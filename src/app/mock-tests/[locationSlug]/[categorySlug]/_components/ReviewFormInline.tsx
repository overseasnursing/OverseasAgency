'use client'

import { useState, useEffect, useTransition } from 'react'
import { Star, Globe, CheckCircle, PenLine, ChevronDown, LogIn, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { submitMockTestReview } from '@/app/actions/submitMockTestReview'
import { CountrySelect } from '@/components/ui/LocationCascade'

type TestOption = { id: string; name: string }

type Props = {
  categoryId: string
  tests:      TestOption[]
}

const DIFF_CONFIG = {
  easy:   { label: 'Easy',   base: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', active: 'bg-emerald-100 border-emerald-500 text-emerald-700 ring-2 ring-emerald-300' },
  medium: { label: 'Medium', base: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',         active: 'bg-amber-100 border-amber-500 text-amber-700 ring-2 ring-amber-300' },
  hard:   { label: 'Hard',   base: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',                 active: 'bg-red-100 border-red-500 text-red-700 ring-2 ring-red-300' },
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

const inputCls = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-colors bg-white'

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; displayName: string; userId: string }

function getDisplayName(user: { user_metadata?: Record<string, unknown>; email?: string }): string {
  const m = user.user_metadata ?? {}
  return (
    (m.display_name as string | undefined)?.trim() ||
    (m.full_name    as string | undefined)?.trim() ||
    (m.name         as string | undefined)?.trim() ||
    user.email?.split('@')[0] ||
    'Nurse'
  )
}

export function ReviewFormInline({ categoryId, tests }: Props) {
  const [auth,           setAuth]          = useState<AuthState>({ status: 'loading' })
  const [reviewedTests,  setReviewedTests] = useState<Set<string>>(new Set())
  const [selectedTestId, setSelectedTestId]= useState('')
  const [rating,         setRating]        = useState(0)
  const [hover,          setHover]         = useState(0)
  const [difficulty,     setDiff]          = useState<'easy' | 'medium' | 'hard' | null>(null)
  const [reviewTitle,    setTitle]         = useState('')
  const [reviewText,     setText]          = useState('')
  const [reviewerCountry,setCountry]       = useState('')
  const [error,          setError]         = useState('')
  const [submitted,      setSubmitted]     = useState(false)
  const [pending,        start]            = useTransition()

  // Check auth state + load reviewed tests from localStorage
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setAuth({ status: 'unauthenticated' })
      } else {
        setAuth({ status: 'authenticated', displayName: getDisplayName(user), userId: user.id })
      }
    })

    // Load reviewed tests from localStorage
    const reviewed = new Set<string>()
    tests.forEach(t => {
      if (localStorage.getItem(`reviewed_test_${t.id}`)) reviewed.add(t.id)
    })
    setReviewedTests(reviewed)
    const first = tests.find(t => !reviewed.has(t.id))
    if (first) setSelectedTestId(first.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const displayRating = hover || rating
  const unreviewed    = tests.filter(t => !reviewedTests.has(t.id))
  const allReviewed   = unreviewed.length === 0

  function handleSubmit() {
    if (auth.status !== 'authenticated') return
    if (!selectedTestId)  { setError('Please select a test.'); return }
    if (rating === 0)     { setError('Please select a star rating.'); return }
    if (!difficulty)      { setError('Please select a difficulty level.'); return }
    setError('')
    start(async () => {
      const result = await submitMockTestReview({
        categoryId,
        testId:          selectedTestId,
        rating,
        difficulty,
        reviewTitle:     reviewTitle.trim()     || undefined,
        reviewText:      reviewText.trim()      || undefined,
        reviewerCountry: reviewerCountry.trim() || undefined,
      })
      if (!result.success) { setError(result.error); return }
      localStorage.setItem(`reviewed_test_${selectedTestId}`, '1')
      const updated = new Set(reviewedTests).add(selectedTestId)
      setReviewedTests(updated)
      setSubmitted(true)
      const nextTest = tests.find(t => !updated.has(t.id))
      setTimeout(() => {
        setSubmitted(false)
        setRating(0); setDiff(null); setTitle(''); setText(''); setCountry('')
        if (nextTest) setSelectedTestId(nextTest.id)
      }, 3000)
    })
  }

  // ── Login gate ──────────────────────────────────────────────────
  if (auth.status === 'loading') return null

  if (auth.status === 'unauthenticated') {
    const returnPath = typeof window !== 'undefined' ? window.location.pathname : ''
    return (
      <section className="mt-10">
        <div className="flex items-center gap-2 mb-2">
          <PenLine size={14} className="text-primary" />
          <p className="text-[11px] font-bold text-primary uppercase tracking-widest">Write a Review</p>
        </div>
        <h2 className="text-[20px] font-bold text-slate-800 mb-1">Share Your Experience</h2>
        <p className="text-[13.5px] text-slate-500 mb-6">
          Reviewed a test? Help other nurses by sharing your feedback.
        </p>
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <LogIn size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-800">Sign in to submit a review</p>
            <p className="text-[13px] text-slate-500 mt-1 max-w-[320px]">
              Reviews are linked to your account so we can track and display them accurately.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <a
              href={`/auth/login?next=${encodeURIComponent(returnPath)}`}
              className="h-10 px-5 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <LogIn size={14} />
              Sign in
            </a>
            <a
              href={`/auth/signup?next=${encodeURIComponent(returnPath)}`}
              className="h-10 px-5 border border-slate-200 hover:border-slate-300 text-slate-700 text-[13.5px] font-semibold rounded-xl transition-colors"
            >
              Create account
            </a>
          </div>
        </div>
      </section>
    )
  }

  // ── All reviewed ────────────────────────────────────────────────
  if (allReviewed) {
    return (
      <section className="mt-10">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-emerald-800">You&rsquo;ve reviewed all tests!</p>
            <p className="text-[13px] text-emerald-700 mt-0.5">
              Thank you for helping other nurses prepare with your feedback.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ── Authenticated form ──────────────────────────────────────────
  return (
    <section className="mt-10">

      <div className="flex items-center gap-2 mb-2">
        <PenLine size={14} className="text-primary" />
        <p className="text-[11px] font-bold text-primary uppercase tracking-widest">Write a Review</p>
      </div>
      <h2 className="text-[20px] font-bold text-slate-800 mb-1">Share Your Experience</h2>
      <p className="text-[13.5px] text-slate-500 mb-6">
        Reviewed a test? Help other nurses by sharing your feedback.
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5">

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
            <p className="text-[17px] font-bold text-slate-800">Review submitted!</p>
            <p className="text-[13px] text-slate-500">
              It will appear after admin approval.
              {unreviewed.filter(t => t.id !== selectedTestId).length > 0 && ' You can still review other tests.'}
            </p>
          </div>
        ) : (
          <>
            {/* Logged-in user badge */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-fit">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={12} className="text-primary" />
              </div>
              <span className="text-[13px] text-slate-700">
                Reviewing as <span className="font-semibold text-slate-900">{auth.displayName}</span>
              </span>
            </div>

            {/* Test selector */}
            <div>
              <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-2">Select Test</p>
              <div className="relative">
                <select
                  value={selectedTestId}
                  onChange={e => setSelectedTestId(e.target.value)}
                  className={`${inputCls} pr-10 appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Choose a test…</option>
                  {tests.map(t => (
                    <option
                      key={t.id}
                      value={t.id}
                      disabled={reviewedTests.has(t.id)}
                    >
                      {t.name}{reviewedTests.has(t.id) ? ' ✓ Reviewed' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Two-column layout on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Left column */}
              <div className="flex flex-col gap-5">

                {/* Stars */}
                <div>
                  <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-2">Your Rating</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(i)}
                        className="transition-transform hover:scale-110 active:scale-95 p-0.5"
                      >
                        <Star
                          size={30}
                          fill={i <= displayRating ? '#F59E0B' : 'none'}
                          className={i <= displayRating ? 'text-amber-400' : 'text-slate-200'}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                    {displayRating > 0 && (
                      <span className="text-[13px] font-semibold text-slate-600 ml-2">
                        {RATING_LABELS[displayRating]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-2">Exam Difficulty</p>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map(d => {
                      const cfg = DIFF_CONFIG[d]
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDiff(d)}
                          className={`flex-1 py-2 text-[13px] font-semibold rounded-xl border transition-all ${difficulty === d ? cfg.active : cfg.base}`}
                        >
                          {cfg.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Your Country <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </p>
                  <CountrySelect
                    value={reviewerCountry || null}
                    onChange={(label) => setCountry(label ?? '')}
                    placeholder="Select your country…"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-5">

                {/* Title */}
                <div>
                  <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Review Title <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </p>
                  <input
                    type="text"
                    className={inputCls}
                    maxLength={120}
                    placeholder='e.g. "Very close to the real DHA exam"'
                    value={reviewTitle}
                    onChange={e => setTitle(e.target.value)}
                  />
                  {reviewTitle.length > 80 && (
                    <p className="text-[11px] text-slate-400 mt-1 text-right">{reviewTitle.length}/120</p>
                  )}
                </div>

                {/* Review text */}
                <div className="flex-1 flex flex-col">
                  <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Detailed Review <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </p>
                  <textarea
                    className={`${inputCls} resize-none leading-relaxed flex-1`}
                    rows={6}
                    maxLength={2000}
                    placeholder="Tips for others — topics to focus on, question patterns, time management…"
                    value={reviewText}
                    onChange={e => setText(e.target.value)}
                  />
                  {reviewText.length > 0 && (
                    <p className="text-[11px] text-slate-400 mt-1 text-right">{reviewText.length}/2000</p>
                  )}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
              <p className="text-[12px] text-slate-400">
                Reviews appear after a quick moderation check.
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={pending}
                className="h-11 px-6 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-[14px] font-semibold rounded-xl transition-colors flex items-center gap-2 flex-shrink-0"
              >
                {pending ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting…</>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
