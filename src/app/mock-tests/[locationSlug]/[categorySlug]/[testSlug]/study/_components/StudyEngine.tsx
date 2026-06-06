'use client'

import Image from 'next/image'
import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, Bookmark, BookmarkCheck,
  CheckCircle, XCircle, BookOpen, Play, RotateCcw,
  GraduationCap, Menu, X,
} from 'lucide-react'
import { toggleBookmark }       from '@/app/actions/bookmarks'
import { recordStudyActivity }  from '@/app/actions/streaks'

type StudyQuestion = {
  id:               string
  question_text:    string
  option_a:         string
  option_b:         string
  option_c:         string
  option_d:         string
  correct_answer:   string
  explanation:      string | null
  learning_notes:   string | null
  difficulty:       string
  marks:            number
  image_url:        string | null
  randomize_options: boolean
}

type Props = {
  testName:         string
  testId:           string
  locationSlug:     string
  categorySlug:     string
  testSlug:         string
  questions:        StudyQuestion[]
  initialBookmarks: string[]
}

export function StudyEngine({
  testName, locationSlug, categorySlug, testSlug,
  questions, initialBookmarks,
}: Props) {
  const total = questions.length

  const [current,        setCurrent]        = useState(0)
  const [selected,       setSelected]       = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({})
  const [bookmarks,      setBookmarks]      = useState<Set<string>>(new Set(initialBookmarks))
  const [bookmarkSaving, setBookmarkSaving] = useState<Set<string>>(new Set())
  const [showSidebar,    setShowSidebar]    = useState(false)
  const [done,           setDone]           = useState(false)
  const [, startBm]  = useTransition()
  const [, startEnd] = useTransition()

  // Trigger streak on mount (starting study = study day)
  useEffect(() => {
    startEnd(async () => { await recordStudyActivity() })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const q          = questions[current]
  const answered   = Object.keys(selected).length
  const correctCnt = Object.entries(selected).filter(([qid, ans]) => {
    const question = questions.find(q => q.id === qid)
    return question?.correct_answer === ans
  }).length

  const optMap: Record<string, string> = {
    A: q?.option_a ?? '',
    B: q?.option_b ?? '',
    C: q?.option_c ?? '',
    D: q?.option_d ?? '',
  }

  const userAns   = selected[q?.id ?? '']
  const revealed  = userAns !== undefined
  const isCorrect = revealed && userAns === q?.correct_answer

  function selectAnswer(ans: 'A' | 'B' | 'C' | 'D') {
    if (revealed) return // can't change after revealing
    setSelected(prev => ({ ...prev, [q.id]: ans }))
  }

  function handleBookmark(questionId: string) {
    if (bookmarkSaving.has(questionId)) return
    const willBookmark = !bookmarks.has(questionId)
    setBookmarks(prev => {
      const next = new Set(prev)
      willBookmark ? next.add(questionId) : next.delete(questionId)
      return next
    })
    setBookmarkSaving(prev => new Set(prev).add(questionId))
    startBm(async () => {
      await toggleBookmark(questionId)
      setBookmarkSaving(prev => { const n = new Set(prev); n.delete(questionId); return n })
    })
  }

  function handleDone() {
    startEnd(async () => { await recordStudyActivity() })
    setDone(true)
  }

  /* ── Done Screen ─────────────────────────────────────────────────── */
  if (done) {
    const accuracy = total > 0 ? Math.round((correctCnt / total) * 100) : 0
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={28} className="text-primary" />
          </div>
          <h2 className="text-[20px] font-bold text-slate-800 mb-1">Study Session Complete!</h2>
          <p className="text-[13px] text-slate-500 mb-6">{testName}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Practiced',  value: total,       cls: 'text-primary' },
              { label: 'Correct',    value: correctCnt,  cls: 'text-emerald-600' },
              { label: 'Accuracy',   value: `${accuracy}%`, cls: accuracy >= 70 ? 'text-emerald-600' : 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className={`text-[20px] font-black ${s.cls}`}>{s.value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => { setSelected({}); setDone(false); setCurrent(0) }}
              className="w-full h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
              <RotateCcw size={13} /> Study Again
            </button>
            <Link href={`/mock-tests/${locationSlug}/${categorySlug}`}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Play size={13} /> Take the Exam
            </Link>
            <Link href="/dashboard/mock-tests"
              className="w-full h-10 border border-primary/20 text-primary text-[13px] font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
              <BookOpen size={13} /> My Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Main Study UI ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 h-14">
          <Link href={`/mock-tests/${locationSlug}/${categorySlug}`}
            className="flex-shrink-0 text-[12.5px] text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
            <ChevronLeft size={14} /> Back
          </Link>
          <div className="flex-1 min-w-0 text-center">
            <p className="text-[12px] font-semibold text-primary uppercase tracking-wide">Study Mode</p>
            <p className="text-[11px] text-slate-400 truncate">{testName}</p>
          </div>
          <button onClick={() => setShowSidebar(true)}
            className="flex-shrink-0 sm:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100">
            <Menu size={16} />
          </button>
          {/* Progress pill */}
          <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            <span className="text-primary font-bold">{current + 1}</span> / {total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:px-6 gap-6">

        {/* ── Question area ─────────────────────────────────────── */}
        <main className="flex-1 flex flex-col gap-4">

          {/* Question meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              q.difficulty === 'hard'   ? 'bg-red-50 text-red-600 border-red-100'
              : q.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}>{q.difficulty}</span>
            <span className="text-[11px] text-slate-400">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
            <span className="ml-auto">
              <button onClick={() => handleBookmark(q.id)}
                className={`flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                  bookmarks.has(q.id)
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-amber-200'
                }`}>
                {bookmarks.has(q.id)
                  ? <><BookmarkCheck size={13} /> Saved</>
                  : <><Bookmark size={13} /> Save</>
                }
              </button>
            </span>
          </div>

          {/* Image */}
          {q.image_url && (
            <Image src={q.image_url} alt="Question" width={800} height={192} sizes="(max-width: 768px) 100vw, 800px" className="rounded-xl border border-slate-200 max-h-48 object-contain w-full" unoptimized />
          )}

          {/* Question text */}
          <p className="text-[15.5px] font-medium text-slate-800 leading-relaxed">{q.question_text}</p>

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {(['A', 'B', 'C', 'D'] as const).map(letter => {
              const isUserChoice = userAns === letter
              const isCorrectOpt = q.correct_answer === letter
              const showResult   = revealed

              return (
                <button
                  key={letter}
                  onClick={() => selectAnswer(letter)}
                  disabled={revealed}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-start gap-3 disabled:cursor-default ${
                    showResult && isCorrectOpt
                      ? 'border-emerald-400 bg-emerald-50'
                      : showResult && isUserChoice && !isCorrectOpt
                      ? 'border-red-400 bg-red-50'
                      : !revealed && isUserChoice
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${
                    showResult && isCorrectOpt                    ? 'bg-emerald-500 text-white'
                    : showResult && isUserChoice && !isCorrectOpt ? 'bg-red-500 text-white'
                    : !revealed && isUserChoice                   ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-500'
                  }`}>{letter}</span>
                  <span className={`text-[14px] leading-snug ${
                    showResult && isCorrectOpt                    ? 'text-emerald-800 font-semibold'
                    : showResult && isUserChoice && !isCorrectOpt ? 'text-red-700 line-through'
                    : 'text-slate-700'
                  }`}>
                    {optMap[letter]}
                  </span>
                  <span className="ml-auto flex-shrink-0 mt-0.5">
                    {showResult && isCorrectOpt              && <CheckCircle size={15} className="text-emerald-500" />}
                    {showResult && isUserChoice && !isCorrectOpt && <XCircle size={15} className="text-red-400" />}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Instant feedback after answering */}
          {revealed && (
            <div className={`rounded-xl border p-4 flex items-center gap-3 ${
              isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
            }`}>
              {isCorrect
                ? <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                : <XCircle     size={18} className="text-red-500 flex-shrink-0" />
              }
              <div>
                <p className={`text-[13px] font-bold ${isCorrect ? 'text-emerald-800' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct!' : `Incorrect — correct answer is ${q.correct_answer}`}
                </p>
                {!isCorrect && (
                  <p className="text-[12.5px] text-red-700 mt-0.5">{optMap[q.correct_answer]}</p>
                )}
              </div>
            </div>
          )}

          {/* Explanation */}
          {revealed && q.explanation && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wide mb-1.5">Explanation</p>
              <p className="text-[13px] text-blue-900 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {/* Learning notes */}
          {revealed && q.learning_notes && (
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
              <p className="text-[10.5px] font-bold text-violet-600 uppercase tracking-wide mb-1.5">Learning Notes</p>
              <p className="text-[13px] text-violet-900 leading-relaxed">{q.learning_notes}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => setCurrent(i => Math.max(0, i - 1))} disabled={current === 0}
              className="flex items-center gap-1.5 h-10 px-4 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={14} /> Prev
            </button>
            <div className="flex-1" />
            {current < total - 1 ? (
              <button onClick={() => setCurrent(i => i + 1)}
                className="flex items-center gap-1.5 h-10 px-5 bg-primary hover:bg-primary/90 text-white text-[13px] font-bold rounded-xl transition-colors">
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={handleDone}
                className="flex items-center gap-1.5 h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl transition-colors">
                <CheckCircle size={14} /> Done
              </button>
            )}
          </div>
        </main>

        {/* ── Desktop sidebar ──────────────────────────────────── */}
        <aside className="hidden sm:flex flex-col w-52 flex-shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sticky top-20">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Progress</p>
            <p className="text-[24px] font-black text-primary mb-1">{answered}/{total}</p>
            <p className="text-[11px] text-slate-400 mb-3">questions answered</p>
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {questions.map((sq, i) => {
                const ans = selected[sq.id]
                const state = i === current ? 'current'
                  : ans !== undefined ? (ans === sq.correct_answer ? 'correct' : 'wrong')
                  : 'unanswered'
                return (
                  <button key={sq.id} onClick={() => setCurrent(i)}
                    className={`w-full aspect-square rounded-lg text-[10.5px] font-bold flex items-center justify-center transition-colors ${
                      state === 'current'    ? 'bg-primary text-white'
                      : state === 'correct'  ? 'bg-emerald-500 text-white'
                      : state === 'wrong'    ? 'bg-red-400 text-white'
                      :                        'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}>{i + 1}</button>
                )
              })}
            </div>
            {current === total - 1 && (
              <button onClick={handleDone}
                className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-xl transition-colors">
                Done
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* ── Mobile sidebar ────────────────────────────────────────── */}
      {showSidebar && (
        <div className="fixed inset-0 z-[200] sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSidebar(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-60 bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100">
              <p className="text-[13px] font-bold text-slate-800">Progress</p>
              <button onClick={() => setShowSidebar(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((sq, i) => {
                  const ans = selected[sq.id]
                  const state = i === current ? 'current'
                    : ans !== undefined ? (ans === sq.correct_answer ? 'correct' : 'wrong')
                    : 'unanswered'
                  return (
                    <button key={sq.id} onClick={() => { setCurrent(i); setShowSidebar(false) }}
                      className={`w-full aspect-square rounded-lg text-[11px] font-bold flex items-center justify-center ${
                        state === 'current'  ? 'bg-primary text-white'
                        : state === 'correct' ? 'bg-emerald-500 text-white'
                        : state === 'wrong'   ? 'bg-red-400 text-white'
                        :                       'bg-slate-100 text-slate-500'
                      }`}>{i + 1}</button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
