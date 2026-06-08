'use client'

import Image from 'next/image'
import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle, XCircle, Clock, BookOpen, ChevronRight, ChevronLeft,
  Trophy, RotateCcw, AlertTriangle, Target, Zap, BarChart2,
  Medal, Award, ThumbsUp, Filter, Loader2, GraduationCap,
  TrendingUp, Users, ScrollText, Bookmark, BookmarkCheck,
} from 'lucide-react'
import { retryWrongQuestions } from '@/app/actions/exam-analytics'
import { toggleBookmark }      from '@/app/actions/bookmarks'
import type { LeaderboardEntry } from '@/app/actions/exam-analytics'
import { ReviewModal } from './ReviewModal'

/* ── Types ─────────────────────────────────────────────────────────── */
type ReviewAnswer = {
  question_id:     string
  selected_answer: 'A' | 'B' | 'C' | 'D' | null
  is_correct:      boolean | null
  marks_awarded:   number
  question: {
    question_text:  string
    option_a:       string
    option_b:       string
    option_c:       string
    option_d:       string
    correct_answer: string
    explanation:    string | null
    learning_notes: string | null
    difficulty:     string
    marks:          number
    image_url:      string | null
  }
}

type Props = {
  attemptId:         string
  testId:            string
  testName:          string
  categoryId:        string
  categoryName:      string
  locationName:      string
  locationSlug:      string
  categorySlug:      string
  testSlug:          string
  userName:          string
  userEmail:         string
  passingPercentage: number
  percentage:        number
  totalQuestions:    number
  obtainedMarks:     number
  totalMarks:        number
  timeTakenSeconds:  number
  durationMinutes:   number
  attemptDate:       string
  answers:            ReviewAnswer[]
  leaderboard:        LeaderboardEntry[]
  leaderboardEnabled: boolean
  initialBookmarks?:  string[]
}

type Tab            = 'summary' | 'review' | 'leaderboard'
type ReviewFilter   = 'all' | 'wrong' | 'correct' | 'skipped'
type DiffFilter     = 'all' | 'easy' | 'medium' | 'hard'

/* ── Helpers ───────────────────────────────────────────────────────── */
function formatDuration(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getBadge(pct: number, passingPct: number) {
  if (pct >= 90) return { icon: '🏆', label: 'Excellent',   cls: 'text-amber-600  bg-amber-50  border-amber-200' }
  if (pct >= 75) return { icon: '🥈', label: 'Very Good',   cls: 'text-slate-600  bg-slate-100 border-slate-300' }
  if (pct >= passingPct) return { icon: '👍', label: 'Pass',  cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
  return              { icon: '❌', label: 'Needs Review', cls: 'text-red-600    bg-red-50    border-red-200' }
}

/* ── Animated circular SVG ring ────────────────────────────────────── */
function CircleProgress({ pct, size = 96, stroke = 8, color = '#0F4C81' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 150); return () => clearTimeout(t) }, [])
  const r    = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const off  = circ * (1 - (mounted ? pct : 0) / 100)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
    </svg>
  )
}

/* ── Animated CSS bar ──────────────────────────────────────────────── */
function AnimBar({ pct, color }: { pct: number; color: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 200); return () => clearTimeout(t) }, [])
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${mounted ? pct : 0}%`, backgroundColor: color, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   ResultClient — main component
══════════════════════════════════════════════════════════════════════ */
export function ResultClient({
  attemptId, testId, testName, categoryId, categoryName, locationName,
  locationSlug, categorySlug, testSlug,
  userName, userEmail, passingPercentage, percentage,
  totalQuestions, obtainedMarks, totalMarks,
  timeTakenSeconds, durationMinutes, attemptDate,
  answers, leaderboard, leaderboardEnabled, initialBookmarks = [],
}: Props) {
  const router = useRouter()
  const [activeTab,    setActiveTab]    = useState<Tab>('summary')
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all')
  const [diffFilter,   setDiffFilter]   = useState<DiffFilter>('all')
  const [reviewIdx,    setReviewIdx]    = useState(0)
  const [showCert,     setShowCert]     = useState(false)
  const [retryError,   setRetryError]   = useState<string | null>(null)
  const [retrying,     startRetry]      = useTransition()

  /* ── Review modal — shown once per session unless already reviewed ── */
  const storageKey = `reviewed_exam_${categoryId}`
  const [showReviewModal, setShowReviewModal] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(storageKey)) return
    const t = setTimeout(() => setShowReviewModal(true), 900)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleReviewDone() {
    setShowReviewModal(false)
    if (typeof window !== 'undefined') localStorage.setItem(storageKey, '1')
  }

  /* ── Bookmark state ────────────────────────────────────────────── */
  const [bookmarks,      setBookmarks]      = useState<Set<string>>(new Set(initialBookmarks))
  const [bookmarkSaving, setBookmarkSaving] = useState<Set<string>>(new Set())
  const [, startBm]                         = useTransition()

  function handleBookmark(questionId: string) {
    if (bookmarkSaving.has(questionId)) return
    const willBookmark = !bookmarks.has(questionId)
    setBookmarks(prev => {
      const n = new Set(prev); willBookmark ? n.add(questionId) : n.delete(questionId); return n
    })
    setBookmarkSaving(prev => new Set(prev).add(questionId))
    startBm(async () => {
      await toggleBookmark(questionId)
      setBookmarkSaving(prev => { const n = new Set(prev); n.delete(questionId); return n })
    })
  }

  /* ── Derived stats ─────────────────────────────────────────────── */
  const passed        = percentage >= passingPercentage
  const badge         = getBadge(percentage, passingPercentage)
  const correctCount  = answers.filter(a => a.is_correct === true).length
  const wrongCount    = answers.filter(a => a.is_correct === false).length
  const skippedCount  = answers.filter(a => a.selected_answer === null).length
  const accuracy      = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0
  const timeEfficiency = durationMinutes > 0
    ? Math.min(100, 100 - ((timeTakenSeconds - durationMinutes * 30) / (durationMinutes * 60)) * 100)
    : 0
  const avgTimePerQ   = totalQuestions > 0 ? timeTakenSeconds / totalQuestions : 0

  // Difficulty breakdown
  const byDiff = { easy: { c: 0, t: 0 }, medium: { c: 0, t: 0 }, hard: { c: 0, t: 0 } }
  answers.forEach(a => {
    const d = a.question.difficulty as keyof typeof byDiff
    if (!byDiff[d]) return
    byDiff[d].t++
    if (a.is_correct) byDiff[d].c++
  })

  /* ── Review filtering ──────────────────────────────────────────── */
  const filteredAnswers = answers
    .filter(a => {
      if (reviewFilter === 'wrong')   return a.is_correct === false
      if (reviewFilter === 'correct') return a.is_correct === true
      if (reviewFilter === 'skipped') return a.selected_answer === null
      return true
    })
    .filter(a => diffFilter === 'all' || a.question.difficulty === diffFilter)

  // Reset review index when filters change
  const safeIdx = Math.min(reviewIdx, Math.max(0, filteredAnswers.length - 1))

  function changeFilter(rf: ReviewFilter, df?: DiffFilter) {
    setReviewFilter(rf)
    if (df !== undefined) setDiffFilter(df)
    setReviewIdx(0)
  }

  /* ── Retry wrong questions ─────────────────────────────────────── */
  function handleRetryWrong() {
    setRetryError(null)
    startRetry(async () => {
      const res = await retryWrongQuestions(attemptId)
      if (res.error) { setRetryError(res.error); return }
      router.push(`/mock-tests/${locationSlug}/${categorySlug}/${testSlug}/attempt/${res.attemptId}`)
    })
  }

  /* ─────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────── */
  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      {/* ── Review modal ────────────────────────────────────────── */}
      {showReviewModal && (
        <ReviewModal
          categoryId={categoryId}
          reviewerName={userName}
          examName={testName}
          onDone={handleReviewDone}
        />
      )}

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1.5 h-14 text-[12.5px] text-slate-400 flex-wrap">
            <Link href="/mock-tests" className="hover:text-primary transition-colors font-medium">Mock Tests</Link>
            <ChevronRight size={12} />
            <Link href={`/mock-tests/${locationSlug}`} className="hover:text-primary">{locationName}</Link>
            <ChevronRight size={12} />
            <Link href={`/mock-tests/${locationSlug}/${categorySlug}`} className="hover:text-primary">{categoryName}</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium truncate">{testName} — Result</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">

        {/* ── HERO ──────────────────────────────────────────────── */}
        <div className={`bg-white border-2 rounded-2xl overflow-hidden ${passed ? 'border-emerald-200' : 'border-red-200'}`}>
          <div className={`h-1.5 ${passed ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`} />
          <div className="p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

              {/* Circular score ring */}
              <div className="relative flex-shrink-0 self-center sm:self-auto">
                <CircleProgress pct={percentage} size={104} stroke={9} color={passed ? '#10B981' : '#EF4444'} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-[19px] font-black leading-none ${passed ? 'text-emerald-600' : 'text-red-500'}`}>
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">Score</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full border ${badge.cls}`}>
                    {badge.icon} {badge.label}
                  </span>
                  {passed
                    ? <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">PASSED</span>
                    : <span className="text-[11px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">FAILED</span>
                  }
                </div>
                <h1 className="text-[18px] sm:text-[20px] font-bold text-slate-900 leading-tight mb-1 truncate">{testName}</h1>
                <p className="text-[12.5px] text-slate-500">{categoryName} · {locationName}</p>

                {/* User + meta */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-[12px]">
                  {[
                    { l: 'Student',   v: userName },
                    { l: 'Email',     v: userEmail },
                    { l: 'Date',      v: formatDate(attemptDate) },
                    { l: 'Score',     v: `${obtainedMarks}/${totalMarks} marks` },
                    { l: 'Time Taken',v: formatDuration(timeTakenSeconds) },
                    { l: 'Pass Mark', v: `${passingPercentage}%` },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <span className="text-slate-400">{l}: </span>
                      <span className="font-semibold text-slate-700 truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TAB BAR ───────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-1 flex gap-1">
          {([
            { id: 'summary',     label: 'Summary',     icon: <BarChart2 size={14} /> },
            { id: 'review',      label: 'Review',      icon: <ScrollText size={14} /> },
            { id: 'leaderboard', label: 'Leaderboard', icon: <Users size={14} /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-[13px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            SUMMARY TAB
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'summary' && (
          <>
            {/* ── Analytics cards ─────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: <CheckCircle size={18} className="text-emerald-500" />, label: 'Correct',          value: correctCount,              sub: `${((correctCount/totalQuestions)*100).toFixed(1)}% of total`, cls: 'text-emerald-700' },
                { icon: <XCircle     size={18} className="text-red-400" />,     label: 'Wrong',            value: wrongCount,                sub: `${((wrongCount/totalQuestions)*100).toFixed(1)}% of total`,   cls: 'text-red-600' },
                { icon: <AlertTriangle size={18} className="text-amber-400" />, label: 'Skipped',          value: skippedCount,              sub: `${((skippedCount/totalQuestions)*100).toFixed(1)}% of total`, cls: 'text-amber-700' },
                { icon: <Target      size={18} className="text-primary" />,     label: 'Accuracy',         value: `${accuracy.toFixed(1)}%`, sub: 'of answered questions', cls: 'text-primary' },
                { icon: <Zap         size={18} className="text-violet-500" />,  label: 'Avg Time / Q',     value: `${avgTimePerQ.toFixed(0)}s`, sub: 'per question',       cls: 'text-violet-700' },
                { icon: <Clock       size={18} className="text-blue-500" />,    label: 'Time Used',        value: formatDuration(timeTakenSeconds), sub: `of ${durationMinutes}m`,   cls: 'text-blue-700' },
              ].map(card => (
                <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    {card.icon}
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{card.label}</span>
                  </div>
                  <p className={`text-[22px] font-black leading-none ${card.cls}`}>{card.value}</p>
                  <p className="text-[11px] text-slate-400">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* ── Difficulty breakdown ─────────────────────────── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={15} className="text-primary" /> Difficulty Breakdown
              </h2>
              <div className="flex flex-col gap-4">
                {([
                  { key: 'easy',   label: 'Easy',   color: '#10B981' },
                  { key: 'medium', label: 'Medium', color: '#F59E0B' },
                  { key: 'hard',   label: 'Hard',   color: '#EF4444' },
                ] as { key: keyof typeof byDiff; label: string; color: string }[]).map(({ key, label, color }) => {
                  const { c, t } = byDiff[key]
                  const pct = t > 0 ? (c / t) * 100 : 0
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5 text-[12px]">
                        <span className="font-semibold text-slate-700">{label}</span>
                        <span className="text-slate-500">{c}/{t} correct · <span className="font-bold" style={{ color }}>{pct.toFixed(0)}%</span></span>
                      </div>
                      <AnimBar pct={pct} color={color} />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Correct vs Wrong visual ──────────────────────── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart2 size={15} className="text-primary" /> Answer Breakdown
              </h2>
              <div className="flex gap-2 h-10 rounded-xl overflow-hidden border border-slate-100">
                {correctCount > 0 && (
                  <div className="bg-emerald-400 flex items-center justify-center transition-all duration-1000"
                    style={{ flex: correctCount }}>
                    <span className="text-[11px] font-bold text-white">{correctCount}</span>
                  </div>
                )}
                {wrongCount > 0 && (
                  <div className="bg-red-400 flex items-center justify-center"
                    style={{ flex: wrongCount }}>
                    <span className="text-[11px] font-bold text-white">{wrongCount}</span>
                  </div>
                )}
                {skippedCount > 0 && (
                  <div className="bg-slate-200 flex items-center justify-center"
                    style={{ flex: skippedCount }}>
                    <span className="text-[11px] font-semibold text-slate-500">{skippedCount}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 mt-3">
                {[
                  { color: 'bg-emerald-400', label: 'Correct',  count: correctCount },
                  { color: 'bg-red-400',     label: 'Wrong',    count: wrongCount },
                  { color: 'bg-slate-200',   label: 'Skipped',  count: skippedCount },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                    <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                    {l.label} ({l.count})
                  </div>
                ))}
              </div>
            </div>

            {/* ── Weakness callout ────────────────────────────── */}
            {wrongCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-bold text-amber-800 mb-1">Areas Needing Improvement</p>
                  <p className="text-[12.5px] text-amber-700">
                    You answered {wrongCount} question{wrongCount !== 1 ? 's' : ''} incorrectly.
                    {byDiff.hard.t > 0 && byDiff.hard.c < byDiff.hard.t
                      ? ` Hard questions were your weakest area (${byDiff.hard.c}/${byDiff.hard.t} correct).`
                      : byDiff.medium.t > 0 && byDiff.medium.c < byDiff.medium.t
                      ? ` Medium difficulty questions need more practice (${byDiff.medium.c}/${byDiff.medium.t} correct).`
                      : ''}
                    {' '}Review the explanations in the Review tab.
                  </p>
                  <button
                    onClick={() => setActiveTab('review')}
                    className="mt-2 text-[12px] font-semibold text-amber-700 underline underline-offset-2"
                  >
                    Review wrong answers →
                  </button>
                </div>
              </div>
            )}

            {/* ── Certificate placeholder ──────────────────────── */}
            <div className="bg-gradient-to-br from-primary/5 via-blue-50 to-violet-50 border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap size={22} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-slate-800 mb-0.5">Certificate of Completion</p>
                <p className="text-[12px] text-slate-500">
                  {passed
                    ? 'You passed! Your certificate will be available when this feature launches.'
                    : 'Pass the test to earn your certificate.'}
                </p>
              </div>
              <button
                onClick={() => setShowCert(true)}
                disabled={!passed}
                className="flex-shrink-0 h-9 px-4 bg-primary hover:bg-primary/90 text-white text-[12.5px] font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Generate
              </button>
            </div>

            {/* ── Action buttons ───────────────────────────────── */}
            {retryError && (
              <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{retryError}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleRetryWrong}
                disabled={retrying || wrongCount + skippedCount === 0}
                className="h-11 border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {retrying ? <Loader2 size={14} className="animate-spin" /> : <Target size={14} />}
                Retry Wrong ({wrongCount + skippedCount})
              </button>
              <Link
                href={`/mock-tests/${locationSlug}/${categorySlug}`}
                className="h-11 border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw size={14} /> Try Another Test
              </Link>
              <Link
                href="/dashboard/mock-tests"
                className="h-11 bg-primary hover:bg-primary/90 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen size={14} /> My Dashboard
              </Link>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════
            REVIEW TAB
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'review' && (
          <>
            {/* Filter bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter size={12} className="text-slate-400 flex-shrink-0" />
                {([
                  { id: 'all',     label: `All (${answers.length})`,           cls: '' },
                  { id: 'wrong',   label: `Wrong (${wrongCount})`,             cls: 'text-red-600' },
                  { id: 'correct', label: `Correct (${correctCount})`,         cls: 'text-emerald-700' },
                  { id: 'skipped', label: `Skipped (${skippedCount})`,         cls: 'text-amber-700' },
                ] as { id: ReviewFilter; label: string; cls: string }[]).map(f => (
                  <button key={f.id} onClick={() => changeFilter(f.id, diffFilter)}
                    className={`h-7 px-3 rounded-lg text-[12px] font-semibold border transition-colors ${
                      reviewFilter === f.id
                        ? 'bg-primary text-white border-primary'
                        : `border-slate-200 text-slate-600 hover:border-slate-300 ${f.cls}`
                    }`}>
                    {f.label}
                  </button>
                ))}
                <span className="w-px h-5 bg-slate-200 mx-1" />
                {([
                  { id: 'all',    label: 'Any' },
                  { id: 'easy',   label: 'Easy' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'hard',   label: 'Hard' },
                ] as { id: DiffFilter; label: string }[]).map(f => (
                  <button key={f.id} onClick={() => changeFilter(reviewFilter, f.id)}
                    className={`h-7 px-3 rounded-lg text-[12px] font-semibold border transition-colors ${
                      diffFilter === f.id
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredAnswers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
                <p className="text-[14px] font-semibold text-slate-700">No questions match this filter</p>
              </div>
            ) : (
              <>
                {/* Progress counter */}
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-500 font-medium">
                    Question <span className="font-bold text-slate-800">{safeIdx + 1}</span> of <span className="font-bold text-slate-800">{filteredAnswers.length}</span>
                  </span>
                  <div className="flex gap-1">
                    {filteredAnswers.map((_, i) => (
                      <button key={i} onClick={() => setReviewIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === safeIdx ? 'bg-primary' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>

                {/* Question card */}
                {(() => {
                  const ans = filteredAnswers[safeIdx]
                  if (!ans) return null
                  const q         = ans.question
                  const isCorrect = ans.is_correct === true
                  const wasSkip   = ans.selected_answer === null
                  const optMap: Record<string, string> = {
                    A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d,
                  }

                  return (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                      {/* Question header strip */}
                      <div className={`h-1 ${isCorrect ? 'bg-emerald-500' : wasSkip ? 'bg-amber-400' : 'bg-red-500'}`} />
                      <div className="p-5 sm:p-6">
                        {/* Meta */}
                        <div className="flex items-center gap-2 flex-wrap mb-4">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            isCorrect ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : wasSkip  ? 'bg-amber-50  text-amber-700  border-amber-200'
                            :            'bg-red-50    text-red-600    border-red-200'
                          }`}>
                            {isCorrect ? '✓ Correct' : wasSkip ? '— Skipped' : '✗ Wrong'}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            q.difficulty === 'hard'   ? 'bg-red-50 text-red-600 border border-red-100'
                            : q.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {q.difficulty}
                          </span>
                          <span className="text-[11px] text-slate-400">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                          <button
                            onClick={() => handleBookmark(ans.question_id)}
                            disabled={bookmarkSaving.has(ans.question_id)}
                            className={`ml-auto flex items-center gap-1 text-[11.5px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
                              bookmarks.has(ans.question_id)
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-amber-200 hover:text-amber-600'
                            }`}
                          >
                            {bookmarks.has(ans.question_id)
                              ? <><BookmarkCheck size={12} /> Saved</>
                              : <><Bookmark size={12} /> Save</>}
                          </button>
                        </div>

                        {/* Image */}
                        {q.image_url && (
                          <Image src={q.image_url} alt="Question" width={800} height={192} sizes="(max-width: 768px) 100vw, 800px" className="mb-4 rounded-xl border border-slate-200 max-h-48 object-contain w-full" unoptimized />
                        )}

                        {/* Question text */}
                        <p className="text-[15px] font-medium text-slate-800 leading-relaxed mb-5">{q.question_text}</p>

                        {/* Options */}
                        <div className="flex flex-col gap-2 mb-5">
                          {(['A', 'B', 'C', 'D'] as const).map(letter => {
                            const isUserChoice   = ans.selected_answer === letter
                            const isCorrectOpt   = q.correct_answer    === letter
                            return (
                              <div key={letter} className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-[13.5px] ${
                                isCorrectOpt
                                  ? 'bg-emerald-50 border-emerald-300'
                                  : isUserChoice && !isCorrectOpt
                                  ? 'bg-red-50 border-red-300'
                                  : 'border-slate-100'
                              }`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${
                                  isCorrectOpt                  ? 'bg-emerald-500 text-white'
                                  : isUserChoice && !isCorrectOpt ? 'bg-red-500 text-white'
                                  : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {letter}
                                </span>
                                <span className={`leading-snug ${
                                  isCorrectOpt                  ? 'text-emerald-800 font-semibold'
                                  : isUserChoice && !isCorrectOpt ? 'text-red-700 line-through'
                                  : 'text-slate-600'
                                }`}>
                                  {optMap[letter]}
                                </span>
                                <span className="ml-auto flex-shrink-0">
                                  {isCorrectOpt   && <CheckCircle size={14} className="text-emerald-500" />}
                                  {isUserChoice && !isCorrectOpt && <XCircle size={14} className="text-red-400" />}
                                </span>
                              </div>
                            )
                          })}
                        </div>

                        {/* Your answer vs correct */}
                        {!isCorrect && !wasSkip && (
                          <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide mb-0.5">Your Answer</p>
                              <p className="text-[13px] font-semibold text-red-800">{ans.selected_answer}: {optMap[ans.selected_answer!] ?? '—'}</p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-0.5">Correct Answer</p>
                              <p className="text-[13px] font-semibold text-emerald-800">{q.correct_answer}: {optMap[q.correct_answer]}</p>
                            </div>
                          </div>
                        )}

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-3">
                            <p className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wide mb-1.5">Explanation</p>
                            <p className="text-[13px] text-blue-900 leading-relaxed">{q.explanation}</p>
                          </div>
                        )}

                        {/* Learning notes */}
                        {q.learning_notes && (
                          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                            <p className="text-[10.5px] font-bold text-violet-600 uppercase tracking-wide mb-1.5">Learning Notes</p>
                            <p className="text-[13px] text-violet-900 leading-relaxed">{q.learning_notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Navigation */}
                      <div className="border-t border-slate-100 px-5 py-3 flex items-center gap-3 bg-slate-50/60">
                        <button
                          onClick={() => setReviewIdx(i => Math.max(0, i - 1))}
                          disabled={safeIdx === 0}
                          className="flex items-center gap-1.5 h-9 px-4 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft size={14} /> Prev
                        </button>
                        <span className="flex-1 text-center text-[12.5px] text-slate-500 font-medium">
                          {safeIdx + 1} / {filteredAnswers.length}
                        </span>
                        <button
                          onClick={() => setReviewIdx(i => Math.min(filteredAnswers.length - 1, i + 1))}
                          disabled={safeIdx === filteredAnswers.length - 1}
                          className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-[13px] font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Next <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })()}
              </>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════
            LEADERBOARD TAB
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'leaderboard' && (
          leaderboardEnabled && leaderboard.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                <h2 className="text-[14px] font-bold text-slate-800">Top Performers</h2>
              </div>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 font-semibold text-slate-500">Rank</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500">Name</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-500">Score</th>
                    <th className="text-right px-5 py-3 font-semibold text-slate-500">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.map(entry => (
                    <tr key={entry.rank} className={`transition-colors ${entry.is_current_user ? 'bg-primary/5' : 'hover:bg-slate-50/60'}`}>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold ${
                          entry.rank === 1 ? 'bg-amber-100 text-amber-700'
                          : entry.rank === 2 ? 'bg-slate-200 text-slate-600'
                          : entry.rank === 3 ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-100 text-slate-500'
                        }`}>
                          {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800">{entry.display_name}</span>
                        {entry.is_current_user && <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">You</span>}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`font-bold ${entry.percentage >= passingPercentage ? 'text-emerald-700' : 'text-red-600'}`}>
                          {entry.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-500">{formatDuration(entry.time_taken_seconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <Users size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-slate-600 mb-1">
                {leaderboardEnabled ? 'No leaderboard entries yet' : 'Leaderboard Not Enabled'}
              </p>
              <p className="text-[12.5px] text-slate-400">
                {leaderboardEnabled
                  ? 'Be the first on the leaderboard for this test.'
                  : 'The leaderboard for this test has not been enabled by the admin.'}
              </p>
            </div>
          )
        )}
      </div>

      {/* ── Certificate modal (placeholder) ─────────────────────── */}
      {showCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCert(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-7 text-center">
            <GraduationCap size={40} className="text-primary mx-auto mb-3" />
            <h3 className="text-[17px] font-bold text-slate-800 mb-2">Certificate Coming Soon</h3>
            <p className="text-[13px] text-slate-500 mb-2">
              PDF certificate generation is in development. Once live, you&apos;ll be able to download a personalised certificate for <strong>{testName}</strong>.
            </p>
            <p className="text-[12px] text-slate-400 mb-5">Your score: <strong className="text-primary">{percentage.toFixed(1)}%</strong></p>
            <button onClick={() => setShowCert(false)}
              className="w-full h-10 bg-primary text-white text-[13px] font-bold rounded-xl hover:bg-primary/90 transition-colors">
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Hidden icon to prevent tree-shaking */}
      <span className="hidden"><Medal size={1} /><Award size={1} /><ThumbsUp size={1} /></span>
    </div>
  )
}
