import React from 'react'
import { Star, CheckCircle, ThumbsUp, MapPin, Briefcase } from 'lucide-react'
import type { CountryDetail } from '@/types/countryDetail'

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          fill={i <= Math.round(rating) ? '#F59E0B' : '#E2E8F0'}
          className={i <= Math.round(rating) ? 'text-[#F59E0B]' : 'text-slate-200'}
        />
      ))}
    </div>
  )
}

interface CountryReviewsProps {
  country: CountryDetail
}

export function CountryReviews({ country }: CountryReviewsProps) {
  if (country.reviews.length === 0) return null

  const avgRating = country.reviews.reduce((sum, r) => sum + r.rating, 0) / country.reviews.length

  return (
    <section id="reviews" aria-labelledby="reviews-heading">
      <div className="flex items-center justify-between mb-2">
        <h2 id="reviews-heading" className="text-[22px] font-bold text-slate-800">
          Nurse Experiences in {country.name}
        </h2>
      </div>

      {/* Summary strip */}
      <div className="bg-[#F8FAFC] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex flex-col items-center justify-center sm:min-w-[100px]">
          <span className="text-[44px] font-bold text-slate-800 leading-none">{avgRating.toFixed(1)}</span>
          <StarRow rating={avgRating} />
          <span className="text-[12px] text-slate-400 mt-1">{country.reviews.length} reviews</span>
        </div>
        <div className="h-px sm:h-auto sm:w-px bg-slate-200 self-stretch" aria-hidden="true" />
        <div className="flex flex-wrap gap-6 text-center sm:text-left">
          <div>
            <p className="text-[22px] font-bold text-[#166534]">{country.recommendationPercent}%</p>
            <p className="text-[12px] text-slate-400">Would recommend</p>
          </div>
          <div>
            <p className="text-[22px] font-bold text-slate-800">{country.visaProcessingWeeks.min}–{country.visaProcessingWeeks.max}wks</p>
            <p className="text-[12px] text-slate-400">Typical visa time</p>
          </div>
          <div>
            <p className="text-[22px] font-bold text-slate-800">
              ₹{(country.totalMigrationCostMin / 100000).toFixed(1)}–{(country.totalMigrationCostMax / 100000).toFixed(1)}L
            </p>
            <p className="text-[12px] text-slate-400">Average total spend</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {country.reviews.map((review) => (
          <article key={review.id} className="bg-white border border-slate-200 rounded-2xl p-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] font-bold text-primary">{review.authorInitials}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-slate-800">{review.authorName}</span>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534]">
                        <CheckCircle size={10} />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-slate-400">{review.authorFrom}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <StarRow rating={review.rating} />
                <p className="text-[11.5px] text-slate-400 mt-0.5">{review.date}</p>
              </div>
            </div>

            {/* Title + body */}
            <h3 className="text-[15px] font-semibold text-slate-800 mb-2">{review.title}</h3>
            <p className="text-[13.5px] text-slate-600 leading-relaxed mb-4">{review.body}</p>

            {/* Key facts */}
            <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F8FAFC] rounded-xl">
                <MapPin size={12} className="text-slate-400" />
                <span className="text-[12.5px] font-semibold text-slate-700">{review.destinationCity}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F8FAFC] rounded-xl">
                <Briefcase size={12} className="text-slate-400" />
                <span className="text-[12.5px] font-semibold text-slate-700">{review.hospitalType}</span>
              </div>
              <div className="flex flex-col px-3 py-2 bg-[#F8FAFC] rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Total Cost Paid</span>
                <span className="text-[12.5px] font-semibold text-slate-700">
                  ₹{(review.actualTotalCostINR / 100000).toFixed(1)}L
                </span>
              </div>
              <div className="flex flex-col px-3 py-2 bg-[#F8FAFC] rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Timeline</span>
                <span className="text-[12.5px] font-semibold text-slate-700">{review.timelineMonths} months</span>
              </div>
              <div className="flex flex-col px-3 py-2 bg-[#DCFCE7] rounded-xl">
                <span className="text-[10px] text-[#166534] uppercase tracking-wide font-medium">Current Salary</span>
                <span className="text-[12.5px] font-semibold text-[#166534]">{review.currentSalaryDisplay}</span>
              </div>
              {review.wouldRecommend && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#EFF6FF] rounded-xl">
                  <ThumbsUp size={12} className="text-[#1D4ED8]" />
                  <span className="text-[12.5px] font-semibold text-[#1D4ED8]">Recommends</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
