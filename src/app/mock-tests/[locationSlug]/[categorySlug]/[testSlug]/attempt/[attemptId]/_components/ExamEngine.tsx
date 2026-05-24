'use client'

import { useState, useEffect, useCallback, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, Clock, AlertTriangle,
  CheckCircle, X, Loader2, Menu,
  Bookmark, BookmarkCheck,
} from 'lucide-react'
import { saveAnswer } from '@/app/actions/exam-engine'
import { submitExam } from '@/app/actions/exam-engine'
import { toggleBookmark } from '@/app/actions/bookmarks'
import type { ExamQuestion } from '../page'

/* ── Seeded option shuffle ──────────────────────────────────────────── */
function hashSeed(str: string): number {
  let h = 0
  for (const c of str) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const r = [...arr]
  let s = seed
  for (let i = r.length - 1; i > 0; i--) {
    s = (Math.imul(1664525, s) + 1013904223) | 0
    const j = Math.abs(s) % (i + 1)
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

type Option = { key: 'A' | 'B' | 'C' | 'D'; text: string }

function getDisplayOptions(q: ExamQuestion, attemptId: string): Option[] {
  const base: Option[] = [
    { key: 'A', text: q.option_a },
    { key: 'B', text: q.option_b },
    { key: 'C', text: q.option_c },
    { key: 'D', text: q.option_d },
  ]
  if (!q.randomize_options) return base
  return seededShuffle(base, hashSeed(attemptId + q.id))
}

/* ── Timer ──────────────────────────────────────────────────────────── */
function formatTime(secs: number): string {
  if (secs <= 0) return '0:00'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

/* ── Props ──────────────────────────────────────────────────────────── */
type Props = {
  attemptId:         string
  expiresAt:         string
  testName:          string
  passingPercentage: number
  totalMarks:        number
  questions:         ExamQuestion[]
  locationSlug:      string
  categorySlug:      string
  testSlug:          string
  locationName:      string
  categoryName:      string
  initialBookmarks?: string[]
}

/* ══════════════════════════════════════════════════════════════════════
   ExamEngine
══════════════════════════════════════════════════════════════════════ */
export function ExamEngine({
  attemptId, expiresAt, testName,
  questions, locationSlug, categorySlug, testSlug, initialBookmarks = [],
}: Props) {
  const router = useRouter()
  const total  = questions.length

  /* ── Local answers state ─────────────────────────────────────────── */
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>(() => {
    const init: Record<string, 'A' | 'B' | 'C' | 'D' | null> = {}
    questions.forEach(q => { init[q.id] = q.selected_answer })
    return init
  })

  /* ── Navigation ──────────────────────────────────────────────────── */
  const [current,         setCurrent]         = useState(0)
  const [showSidebar,     setShowSidebar]     = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitError,     setSubmitError]     = useState<string | null>(null)
  const [autoExpired,     setAutoExpired]     = useState(false)

  /* ── Autosave ────────────────────────────────────────────────────── */
  const [saving,     setSaving]     = useState<Set<string>>(new Set())
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({})
  const [, startSaveTransition]     = useTransition()
  const [submitting, startSubmit]   = useTransition()

  /* ── Bookmarks ───────────────────────────────────────────────────── */
  const [bookmarks,      setBookmarks]      = useState<Set<string>>(new Set(initialBookmarks))
  const [bookmarkSaving, setBookmarkSaving] = useState<Set<string>>(new Set())
  const [, startBm]                         = useTransition()

  function handleBookmark(questionId: string) {
    if (bookmarkSaving.has(questionId)) return
    const willBookmark = !bookmarks.has(questionId)
    setBookmarks(prev => { const n = new Set(prev); willBookmark ? n.add(questionId) : n.delete(questionId); return n })
    setBookmarkSaving(prev => new Set(prev).add(questionId))
    startBm(async () => {
      await toggleBookmark(questionId)
      setBookmarkSaving(prev => { const n = new Set(prev); n.delete(questionId); return n })
    })
  }

  /* ── Timer ───────────────────────────────────────────────────────── */
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
  )
  const autoSubmitRef = useRef(false)

  useEffect(() => {
    if (timeLeft <= 0) return
    const id = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1
        if (next <= 0 && !autoSubmitRef.current) {
          autoSubmitRef.current = true
          clearInterval(id)
          setAutoExpired(true)
          handleAutoSubmit()
        }
        return Math.max(0, next)
      })
    }, 1000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── beforeunload warning ────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  /* ── Persist position ────────────────────────────────────────────── */
  useEffect(() => {
    const key   = `exam-q-${attemptId}`
    const saved = sessionStorage.getItem(key)
    if (saved !== null) setCurrent(Math.min(Number(saved), total - 1))
  }, [attemptId, total])

  useEffect(() => {
    sessionStorage.setItem(`exam-q-${attemptId}`, String(current))
  }, [attemptId, current])

  /* ── Select answer ───────────────────────────────────────────────── */
  const selectAnswer = useCallback((questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    setSaveErrors(prev => { const n = { ...prev }; delete n[questionId]; return n })
    startSaveTransition(async () => {
      setSaving(prev => new Set(prev).add(questionId))
      const res = await saveAnswer(attemptId, questionId, answer)
      setSaving(prev => { const n = new Set(prev); n.delete(questionId); return n })
      if (!res.ok) setSaveErrors(prev => ({ ...prev, [questionId]: res.error ?? 'Save failed' }))
    })
  }, [attemptId, startSaveTransition])

  /* ── Submit ──────────────────────────────────────────────────────── */
  function handleSubmit() {
    setSubmitError(null)
    startSubmit(async () => {
      const res = await submitExam(attemptId)
      if (!res.ok) { setSubmitError(res.error ?? 'Submission failed'); return }
      sessionStorage.removeItem(`exam-q-${attemptId}`)
      router.push(`/mock-tests/${locationSlug}/${categorySlug}/${testSlug}/attempt/${attemptId}/result`)
    })
  }

  function handleAutoSubmit() {
    startSubmit(async () => {
      await submitExam(attemptId)
      sessionStorage.removeItem(`exam-q-${attemptId}`)
      router.push(`/mock-tests/${locationSlug}/${categorySlug}/${testSlug}/attempt/${attemptId}/result`)
    })
  }

  /* ── Derived ─────────────────────────────────────────────────────── */
  const q             = questions[current]
  const answeredCount = Object.values(answers).filter(v => v !== null).length
  const progress      = total > 0 ? answeredCount / total : 0
  const displayOpts   = q ? getDisplayOptions(q, attemptId) : []
  const timerCritical = timeLeft <= 300
  const timerWarning  = timeLeft <= 900
  const isLastQ       = current === total - 1
  const lastAnswered  = isLastQ && q && answers[q.id] !== null && answers[q.id] !== undefined

  function dotState(i: number): 'current' | 'answered' | 'unanswered' {
    if (i === current) return 'current'
    if (answers[questions[i]?.id] !== null && answers[questions[i]?.id] !== undefined) return 'answered'
    return 'unanswered'
  }

  /* ──────────────────────────────────────────────────────────────────
     Render
  ────────────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col overflow-hidden">

        {/* ── HEADER ────────────────────────────────────────────────── */}
        <header className="bg-white border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3 px-4 h-14">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setShowSidebar(true)}
              className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
            >
              <Menu size={16} />
            </button>

            {/* Test name */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-800 truncate">{testName}</p>
              <p className="text-[11px] text-slate-400">Q {current + 1} of {total}</p>
            </div>

            {/* Progress bar */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 w-16">{answeredCount}/{total}</span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg flex-shrink-0 ${
              timerCritical ? 'bg-red-50 border border-red-200'
              : timerWarning ? 'bg-amber-50 border border-amber-200'
              : 'bg-slate-50 border border-slate-200'
            }`}>
              <Clock size={13} className={timerCritical ? 'text-red-500' : timerWarning ? 'text-amber-500' : 'text-slate-400'} />
              <span className={`text-[13px] font-mono font-bold tabular-nums ${
                timerCritical ? 'text-red-600 animate-pulse'
                : timerWarning ? 'text-amber-700'
                : 'text-slate-700'
              }`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </header>

        {/* ── BODY ──────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── QUESTION AREA ─────────────────────────────────────── */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">

              {/* Question header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary text-white text-[13px] font-bold flex-shrink-0">
                  {current + 1}
                </span>
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                  {q && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700'
                      : q.difficulty === 'hard' ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                    }`}>
                      {q.difficulty}
                    </span>
                  )}
                  {q && (
                    <span className="text-[11px] text-slate-400">
                      {q.marks ?? 1} mark{(q.marks ?? 1) !== 1 ? 's' : ''}
                    </span>
                  )}
                  {saving.has(q?.id ?? '') && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Loader2 size={9} className="animate-spin" /> Saving…
                    </span>
                  )}
                  {saveErrors[q?.id ?? ''] && (
                    <span className="text-[11px] text-red-400">{saveErrors[q?.id ?? '']}</span>
                  )}
                </div>
                {q && (
                  <button
                    onClick={() => handleBookmark(q.id)}
                    disabled={bookmarkSaving.has(q.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors flex-shrink-0 disabled:opacity-50"
                  >
                    {bookmarks.has(q.id)
                      ? <BookmarkCheck size={16} className="text-primary" />
                      : <Bookmark size={16} />
                    }
                  </button>
                )}
              </div>

              {/* Question text + options */}
              {q && (
                <>
                  {q.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={q.image_url}
                      alt="Question image"
                      className="mb-4 rounded-xl border border-slate-200 max-h-56 object-contain w-full bg-white"
                    />
                  )}
                  <p className="text-[15px] sm:text-[16px] text-slate-800 leading-relaxed font-medium mb-6">
                    {q.question_text}
                  </p>

                  <div className="flex flex-col gap-3">
                    {displayOpts.map(opt => {
                      const selected = answers[q.id] === opt.key
                      return (
                        <button
                          key={opt.key}
                          onClick={() => selectAnswer(q.id, opt.key)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 flex items-start gap-3 ${
                            selected
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${
                            selected ? 'border-primary bg-primary text-white' : 'border-slate-300 text-slate-500'
                          }`}>
                            {opt.key}
                          </span>
                          <span className={`text-[14px] leading-snug ${selected ? 'text-primary font-medium' : 'text-slate-700'}`}>
                            {opt.text}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* ── Inline navigation — below the answers ── */}
                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-200">
                    <button
                      onClick={() => setCurrent(i => Math.max(0, i - 1))}
                      disabled={current === 0}
                      className="flex items-center gap-1.5 h-10 px-5 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>

                    {isLastQ ? (
                      lastAnswered ? (
                        <button
                          onClick={() => setShowSubmitModal(true)}
                          className="flex items-center gap-2 h-10 px-6 bg-primary hover:bg-primary/90 text-white text-[13px] font-bold rounded-xl transition-colors shadow-sm"
                        >
                          <CheckCircle size={14} /> Submit Exam
                        </button>
                      ) : (
                        <span className="text-[12px] text-slate-400 italic">Answer to submit</span>
                      )
                    ) : (
                      <button
                        onClick={() => setCurrent(i => Math.min(total - 1, i + 1))}
                        className="flex items-center gap-1.5 h-10 px-5 bg-primary hover:bg-primary/90 text-white text-[13px] font-bold rounded-xl transition-colors"
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Mobile progress bar */}
              <div className="sm:hidden mt-5 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${progress * 100}%` }} />
                </div>
                <span className="text-[11px] text-slate-400">{answeredCount}/{total}</span>
              </div>
            </div>
          </main>

          {/* ── SIDEBAR (desktop) ──────────────────────────────────── */}
          <aside className="hidden sm:flex flex-col w-60 bg-white border-l border-slate-200 flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">Questions</p>

              {/* Legend */}
              <div className="flex flex-col gap-1 mb-3">
                {[
                  { cls: 'bg-primary',     label: 'Current' },
                  { cls: 'bg-emerald-500', label: 'Answered' },
                  { cls: 'bg-slate-200',   label: 'Not answered' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className={`w-2.5 h-2.5 rounded-full ${l.cls}`} />
                    {l.label}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((sq, i) => {
                  const state = dotState(i)
                  return (
                    <button
                      key={sq.id}
                      onClick={() => setCurrent(i)}
                      className={`w-full aspect-square rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center ${
                        state === 'current'    ? 'bg-primary text-white shadow-sm'
                        : state === 'answered' ? 'bg-emerald-500 text-white'
                        :                        'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>

              {/* Answered count only — no submit button */}
              <p className="text-[11px] text-slate-400 text-center mt-4">
                {answeredCount} of {total} answered
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ──────────────────────────────────── */}
      {showSidebar && (
        <div className="fixed inset-0 z-[200] sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSidebar(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100">
              <p className="text-[13px] font-bold text-slate-800">Questions</p>
              <button onClick={() => setShowSidebar(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((sq, i) => {
                  const state = dotState(i)
                  return (
                    <button
                      key={sq.id}
                      onClick={() => { setCurrent(i); setShowSidebar(false) }}
                      className={`w-full aspect-square rounded-lg text-[11px] font-bold flex items-center justify-center ${
                        state === 'current'    ? 'bg-primary text-white'
                        : state === 'answered' ? 'bg-emerald-500 text-white'
                        :                        'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Answered count only — no submit button */}
            <div className="p-4 border-t border-slate-100 text-center">
              <p className="text-[12px] text-slate-400">{answeredCount} of {total} answered</p>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBMIT CONFIRMATION MODAL ───────────────────────────────── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setShowSubmitModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800">Submit Exam?</p>
                <p className="text-[12px] text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                <p className="text-[20px] font-bold text-emerald-700">{answeredCount}</p>
                <p className="text-[11px] text-slate-500">Answered</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <p className="text-[20px] font-bold text-slate-500">{total - answeredCount}</p>
                <p className="text-[11px] text-slate-500">Skipped</p>
              </div>
            </div>

            {submitError && <p className="text-[12px] text-red-600 mb-3">{submitError}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
                className="flex-1 h-10 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
              >
                {submitting
                  ? <><Loader2 size={13} className="animate-spin" /> Submitting…</>
                  : <><CheckCircle size={13} /> Submit</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TIME'S UP OVERLAY — auto-submits, no action needed ──────── */}
      {autoExpired && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/70">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-red-400" />
            </div>
            <p className="text-[20px] font-black text-slate-800 mb-2">Time&apos;s Up!</p>
            <p className="text-[13px] text-slate-500 mb-5">Your exam is being submitted automatically.</p>
            <div className="flex items-center justify-center gap-2 text-[12px] text-slate-400">
              <Loader2 size={14} className="animate-spin" /> Submitting…
            </div>
          </div>
        </div>
      )}
    </>
  )
}
