'use client'

import { useState, useTransition } from 'react'
import { Star, CheckCircle } from 'lucide-react'
import { submitMockTestReview } from '@/app/actions/submitMockTestReview'

type Props = {
  categoryId: string
  testId:     string
  examName:   string
  onDone:     () => void
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

const inputCls = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-colors'

export function ReviewModal({ categoryId, testId, examName, onDone }: Props) {
  const [rating,    setRating]    = useState(0)
  const [hover,      setHover]     = useState(0)
  const [reviewText, setText]     = useState('')
  const [error,      setError]    = useState('')
  const [submitted,  setSubmitted] = useState(false)
  const [pending,    start]        = useTransition()

  const displayRating = hover || rating

  function handleSubmit() {
    if (rating === 0) { setError('Please select a star rating.'); return }
    setError('')
    start(async () => {
      const result = await submitMockTestReview({
        categoryId,
        testId,
        rating,
        reviewText: reviewText.trim() || undefined,
      })
      if (!result.success) { setError(result.error); return }
      setSubmitted(true)
      setTimeout(onDone, 1400)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-[460px] max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">

        {submitted ? (
          /* ── Success state ─────────────────────────────────────── */
          <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
            <p className="text-[18px] font-bold text-slate-800">Thank you!</p>
            <p className="text-[13.5px] text-slate-500 max-w-[260px] leading-relaxed">
              Your review helps other nurses prepare better for {examName}.
            </p>
            <p className="text-[12px] text-slate-400 mt-1">Loading your report…</p>
          </div>
        ) : (
          <>
            {/* ── Header (fixed) ──────────────────────────────────── */}
            <div className="bg-gradient-to-br from-primary/8 to-primary/4 px-6 pt-6 pb-5 flex-shrink-0">
              <p className="text-[10.5px] font-bold text-primary uppercase tracking-widest mb-1.5">
                Quick Review
              </p>
              <h2 className="text-[19px] font-bold text-slate-800 leading-tight">How was the exam?</h2>
              <p className="text-[13px] text-slate-500 mt-1">
                Rate <span className="font-medium text-slate-700">{examName}</span> to view your report
              </p>
            </div>

            {/* ── Scrollable body ─────────────────────────────────── */}
            <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">

              {/* Stars */}
              <div>
                <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-3">Your Rating</p>
                <div className="flex items-center gap-0.5">
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
                        size={34}
                        fill={i <= displayRating ? '#F59E0B' : 'none'}
                        className={i <= displayRating ? 'text-amber-400' : 'text-slate-200'}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                  {displayRating > 0 && (
                    <span className="text-[13.5px] font-semibold text-slate-600 ml-2.5 min-w-[72px]">
                      {RATING_LABELS[displayRating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Review text */}
              <div>
                <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Detailed Review{' '}
                  <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </p>
                <textarea
                  className={`${inputCls} resize-none leading-relaxed`}
                  rows={4}
                  maxLength={2000}
                  placeholder='Any tips for others? Topics to focus on, question patterns, time management…'
                  value={reviewText}
                  onChange={e => setText(e.target.value)}
                />
                {reviewText.length > 0 && (
                  <p className="text-[11px] text-slate-400 mt-1 text-right">{reviewText.length}/2000</p>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2.5 pb-1">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={pending}
                  className="w-full h-12 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-[14.5px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {pending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    'Submit & View Your Report'
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
