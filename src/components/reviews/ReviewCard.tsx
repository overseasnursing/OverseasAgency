import React from 'react'
import { Star, ThumbsUp, MapPin, Building2, Clock, DollarSign } from 'lucide-react'
import type { PlatformReview } from '@/types/review'
import {
  VerifiedPlacementBadge,
  VerifiedReviewBadge,
  HiddenChargesBadge,
  VisaSuccessBadge,
} from '@/components/trust/TrustBadges'

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-200 fill-slate-200'}
        />
      ))}
      <span className="text-[12px] font-semibold text-slate-700 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function SubRating({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-slate-500 w-28">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-[12px] font-semibold text-slate-600 w-5 text-right">{value}</span>
    </div>
  )
}

interface ReviewCardProps {
  review: PlatformReview
  showAgencyName?: boolean
}

export function ReviewCard({ review, showAgencyName = false }: ReviewCardProps) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[14px] font-bold text-primary">{review.authorInitials}</span>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-slate-800">{review.authorName}</p>
            <p className="text-[12px] text-slate-400">{review.authorFrom}</p>
          </div>
        </div>
        <p className="text-[12px] text-slate-400 flex-shrink-0">
          {new Date(review.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {review.verified && <VerifiedReviewBadge />}
        {review.verifiedPlacement && <VerifiedPlacementBadge />}
        {review.visaReceived && <VisaSuccessBadge />}
        {review.hiddenChargesExperienced && (
          <HiddenChargesBadge amount={review.hiddenChargesAmount} />
        )}
        {showAgencyName && (
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {review.agencyName}
          </span>
        )}
      </div>

      {/* Rating */}
      <StarRow rating={review.rating} />

      {/* Title + body */}
      <div>
        <h3 className="text-[15px] font-semibold text-slate-800 mb-1.5 leading-snug">
          {review.title}
        </h3>
        <p className="text-[13.5px] text-slate-600 leading-relaxed">{review.body}</p>
      </div>

      {/* Sub-ratings */}
      <div className="flex flex-col gap-1.5 bg-slate-50 rounded-xl px-4 py-3">
        <SubRating label="Communication" value={review.communicationRating} />
        <SubRating label="Transparency" value={review.transparencyRating} />
        <SubRating label="Speed" value={review.speedRating} />
      </div>

      {/* Key facts */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {review.destinationCity && (
          <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
            <MapPin size={12} className="text-slate-400" />
            {review.destinationCity}, {review.destinationCountry}
          </div>
        )}
        {review.hospitalType && (
          <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
            <Building2 size={12} className="text-slate-400" />
            {review.hospitalType}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
          <DollarSign size={12} className="text-slate-400" />
          ₹{(review.actualCostPaid / 100000).toFixed(1)}L paid
        </div>
        <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
          <Clock size={12} className="text-slate-400" />
          {review.timelineMonths} months
        </div>
      </div>

      {/* Optional extras */}
      {review.whatSurprisedMe && (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-3">
          <p className="text-[11.5px] font-semibold text-[#166534] mb-0.5">What surprised me</p>
          <p className="text-[13px] text-[#166534]/80 leading-relaxed">{review.whatSurprisedMe}</p>
        </div>
      )}
      {review.adviceForOthers && (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3">
          <p className="text-[11.5px] font-semibold text-[#1D4ED8] mb-0.5">Advice for others</p>
          <p className="text-[13px] text-[#1D4ED8]/80 leading-relaxed">{review.adviceForOthers}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <ThumbsUp size={12} />
          {review.helpful} people found this helpful
        </div>
        {review.wouldRecommend ? (
          <span className="text-[12px] font-semibold text-[#166534]">Recommends</span>
        ) : (
          <span className="text-[12px] font-semibold text-[#991B1B]">Does not recommend</span>
        )}
      </div>
    </article>
  )
}
