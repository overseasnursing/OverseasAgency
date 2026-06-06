import React from 'react'
import { Star, CheckCircle, ThumbsUp, AlertTriangle, PenLine } from 'lucide-react'
import type { Review } from '@/types/agencyDetail'
import type { AgencyDetail } from '@/types/agencyDetail'

function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(value) ? '#F59E0B' : '#E2E8F0'}
          className={i <= Math.round(value) ? 'text-[#F59E0B]' : 'text-slate-200'}
        />
      ))}
    </div>
  )
}

function MiniRating({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100
  const color =
    value >= 4 ? 'bg-[#22C55E]'
    : value >= 3 ? 'bg-[#F59E0B]'
    : 'bg-[#EF4444]'
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-slate-400 w-[100px] shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[12px] font-semibold text-slate-600 w-4 text-right tabular-nums">
        {value}
      </span>
    </div>
  )
}

function RatingSummary({ reviews, overallRating }: { reviews: Review[]; overallRating: number }) {
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    pct: Math.round((reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100),
  }))

  return (
    <div className="bg-[#F8FAFC] rounded-2xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Overall */}
        <div className="flex flex-col items-center justify-center sm:min-w-[120px]">
          <span className="text-[52px] font-bold text-slate-800 leading-none">
            {overallRating.toFixed(1)}
          </span>
          <StarRating value={overallRating} size={16} />
          <span className="text-[13px] text-slate-400 mt-1.5">
            {reviews.length} reviews
          </span>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2">
          {dist.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-2.5">
              <span className="text-[12px] text-slate-400 w-6 text-right">{star}</span>
              <Star size={11} fill="#F59E0B" className="text-[#F59E0B]" />
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[12px] text-slate-400 w-7 tabular-nums">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const formatCost = (rupees: number) =>
    `₹${(rupees / 100000).toFixed(1).replace('.0', '')}L`

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[14px] font-bold text-primary">{review.authorInitials}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-slate-800">
                {review.authorName}
              </span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534]">
                  <CheckCircle size={10} strokeWidth={2.5} />
                  Verified
                </span>
              )}
            </div>
            <p className="text-[12.5px] text-slate-400">{review.authorFrom}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <StarRating value={review.rating} />
          <p className="text-[12px] text-slate-400 mt-1">{review.date}</p>
        </div>
      </div>

      {/* Title + body */}
      <h4 className="text-[16px] font-semibold text-slate-800 mb-2">{review.title}</h4>
      <p className="text-[14px] text-slate-600 leading-relaxed mb-4">{review.body}</p>

      {/* Key facts */}
      <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="flex flex-col items-start px-3 py-2 bg-[#F8FAFC] rounded-xl">
          <span className="text-[10.5px] text-slate-400 mb-0.5 uppercase tracking-wide font-medium">
            Placed in
          </span>
          <span className="text-[13px] font-semibold text-slate-700">
            {review.countryPlaced}
          </span>
        </div>
        <div className="flex flex-col items-start px-3 py-2 bg-[#F8FAFC] rounded-xl">
          <span className="text-[10.5px] text-slate-400 mb-0.5 uppercase tracking-wide font-medium">
            Actually paid
          </span>
          <span className="text-[13px] font-semibold text-slate-700">
            {formatCost(review.actualCostPaid)}
          </span>
        </div>
        <div className="flex flex-col items-start px-3 py-2 bg-[#F8FAFC] rounded-xl">
          <span className="text-[10.5px] text-slate-400 mb-0.5 uppercase tracking-wide font-medium">
            Timeline
          </span>
          <span className="text-[13px] font-semibold text-slate-700">
            {review.timelineMonths} months
          </span>
        </div>
        {review.visaReceived && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#DCFCE7] rounded-xl">
            <CheckCircle size={12} className="text-[#166534]" />
            <span className="text-[13px] font-semibold text-[#166534]">Visa received</span>
          </div>
        )}
        {review.wouldRecommend && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#EFF6FF] rounded-xl">
            <ThumbsUp size={12} className="text-[#1D4ED8]" />
            <span className="text-[13px] font-semibold text-[#1D4ED8]">Recommends</span>
          </div>
        )}
      </div>

      {/* Hidden charges */}
      {review.hiddenChargesExperienced && review.hiddenChargesAmount && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#FEF3C7] rounded-xl mb-4">
          <AlertTriangle size={13} className="text-[#92400E] flex-shrink-0" />
          <span className="text-[12.5px] text-[#92400E] font-medium">
            Hidden charge of ₹{review.hiddenChargesAmount.toLocaleString()} experienced
          </span>
        </div>
      )}

      {/* Sub-ratings */}
      <div className="space-y-2">
        <MiniRating label="Communication" value={review.communicationRating} />
        <MiniRating label="Transparency"  value={review.transparencyRating} />
        <MiniRating label="Speed"         value={review.speedRating} />
      </div>

      {/* Helpful */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        <ThumbsUp size={13} className="text-slate-300" />
        <span className="text-[12.5px] text-slate-400">
          {review.helpful} nurses found this helpful
        </span>
      </div>
    </article>
  )
}

interface ReviewsSectionProps {
  agency: AgencyDetail
}

export function ReviewsSection({ agency }: ReviewsSectionProps) {
  const writeReviewUrl = `/reviews/submit?agency=${agency.slug}&name=${encodeURIComponent(agency.name)}`

  return (
    <section id="reviews" aria-labelledby="reviews-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="reviews-heading" className="text-[22px] font-bold text-slate-800">
          {agency.name} Nurse Reviews
        </h2>
        <a
          href={writeReviewUrl}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <PenLine size={14} />
          Write a review
        </a>
      </div>

      {agency.reviews.length === 0 ? (
        <div className="bg-[#F8FAFC] border border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center">
            <PenLine size={20} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[16px] font-semibold text-slate-700 mb-1">No reviews yet</p>
            {agency.googleRating && agency.googleReviewCount ? (
              <p className="text-[13.5px] text-slate-500 max-w-md leading-relaxed">
                While {agency.name} holds a{' '}
                <span className="font-semibold text-slate-700">{agency.googleRating.toFixed(1)}-star</span> rating
                across{' '}
                <span className="font-semibold text-slate-700">{agency.googleReviewCount.toLocaleString()}+</span> reviews
                on Google Maps, standard map ratings lack itemized timelines and cost tracking.
                We are building the first transparent, data-driven database for nurses.
              </p>
            ) : (
              <p className="text-[13.5px] text-slate-400 max-w-sm leading-relaxed">
                Be the first to share your experience with {agency.name} and help other nurses make an informed decision.
              </p>
            )}
          </div>
          <a
            href={writeReviewUrl}
            className="inline-flex items-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors"
          >
            <PenLine size={14} />
            Write the first review
          </a>
        </div>
      ) : (
        <>
          <RatingSummary reviews={agency.reviews} overallRating={agency.rating} />
          <div className="flex flex-col gap-4">
            {agency.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href={writeReviewUrl}
              className="inline-flex items-center gap-2 h-10 px-5 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-[13.5px] font-semibold rounded-xl transition-colors"
            >
              <PenLine size={14} />
              Write a review
            </a>
          </div>
        </>
      )}
    </section>
  )
}
