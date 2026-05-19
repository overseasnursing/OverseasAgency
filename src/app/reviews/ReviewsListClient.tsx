'use client'

import React, { useState, useMemo } from 'react'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import type { PlatformReview } from '@/types/review'

const COUNTRIES = ['All Countries', 'Germany', 'UK', 'Canada', 'Australia', 'Dubai']
const SORT_OPTIONS = [
  { value: 'helpful', label: 'Most Helpful' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'rating-high', label: 'Highest Rated' },
  { value: 'rating-low', label: 'Lowest Rated' },
]

interface ReviewsListClientProps {
  reviews: PlatformReview[]
}

export function ReviewsListClient({ reviews }: ReviewsListClientProps) {
  const [country, setCountry] = useState('All Countries')
  const [sort, setSort] = useState('helpful')
  const [placedOnly, setPlacedOnly] = useState(false)
  const [recommends, setRecommends] = useState(false)

  const filtered = useMemo(() => {
    let list = [...reviews]

    if (country !== 'All Countries') {
      list = list.filter((r) => r.destinationCountry === country)
    }
    if (placedOnly) {
      list = list.filter((r) => r.verifiedPlacement)
    }
    if (recommends) {
      list = list.filter((r) => r.wouldRecommend)
    }

    if (sort === 'helpful') list.sort((a, b) => b.helpful - a.helpful)
    if (sort === 'recent') list.sort((a, b) => b.date.localeCompare(a.date))
    if (sort === 'rating-high') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'rating-low') list.sort((a, b) => a.rating - b.rating)

    return list
  }, [reviews, country, sort, placedOnly, recommends])

  return (
    <div>
      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          {COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`text-[13px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                country === c
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={placedOnly}
              onChange={(e) => setPlacedOnly(e.target.checked)}
              className="rounded"
            />
            Verified placements only
          </label>
          <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={recommends}
              onChange={(e) => setRecommends(e.target.checked)}
              className="rounded"
            />
            Recommends agency
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-[13px] border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-[13px] text-slate-500 mb-4">
        {filtered.length} review{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* List */}
      <div className="flex flex-col gap-5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-[14px]">
            No reviews match your filters.
          </div>
        ) : (
          filtered.map((review) => (
            <ReviewCard key={review.id} review={review} showAgencyName />
          ))
        )}
      </div>
    </div>
  )
}
