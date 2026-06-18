'use client'

import { useState, useMemo } from 'react'
import { Building2, MapPin, IndianRupee, SlidersHorizontal } from 'lucide-react'
import { AgencyCard } from '@/components/agencies/AgencyCard'
import type { Agency } from '@/types/agency'

interface Props {
  agencies: Agency[]
  destinations: string[]
  agencyCount: number
  feeRange: { minLakhs: number; maxLakhs: number }
  cityCount: number
  stateName: string
}

type SortKey = 'rating' | 'reviews' | 'price'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'rating',  label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'price',   label: 'Lowest Fee' },
]

export function StateAgencySection({
  agencies,
  destinations,
  agencyCount,
  feeRange,
  cityCount,
  stateName,
}: Props) {
  const [selectedDest, setSelectedDest] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>('rating')

  const filtered = useMemo(() => {
    let result = agencies
    if (selectedDest) {
      result = result.filter((a) => a.countries.includes(selectedDest))
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'rating')  return b.rating - a.rating
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount
      return a.pricing.minLakhs - b.pricing.minLakhs
    })
  }, [agencies, selectedDest, sortBy])

  const toggleDest = (dest: string) =>
    setSelectedDest((prev) => (prev === dest ? null : dest))

  return (
    <>
      {/* ── Stats bar + filter pills ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            {/* Left — stats */}
            <div className="flex flex-wrap items-center gap-5 text-[13px]">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Building2 size={14} className="text-primary" />
                <span className="font-semibold text-slate-800">{agencyCount}</span>&nbsp;agencies
              </div>
              {feeRange.minLakhs > 0 && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <IndianRupee size={14} className="text-primary" />
                  Fees from&nbsp;
                  <span className="font-semibold text-slate-800">
                    ₹{feeRange.minLakhs}L–₹{feeRange.maxLakhs}L
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin size={14} className="text-primary" />
                <span className="font-semibold text-slate-800">{cityCount}</span>&nbsp;
                {cityCount === 1 ? 'city' : 'cities'}
              </div>
            </div>

            {/* Right — destination filter pills */}
            {destinations.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
                  Filter
                </span>
                <button
                  onClick={() => setSelectedDest(null)}
                  className={`text-[12.5px] font-medium px-3 py-1 rounded-full border transition-colors ${
                    selectedDest === null
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  All
                </button>
                {destinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => toggleDest(dest)}
                    className={`text-[12.5px] font-medium px-3 py-1 rounded-full border transition-colors ${
                      selectedDest === dest
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Agency listings ── */}
      <section aria-labelledby="agencies-heading" className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 pt-10">
        {/* Section header + sort */}
        <div className="flex items-start sm:items-center justify-between gap-4 mb-5 flex-col sm:flex-row">
          <div>
            <h2 id="agencies-heading" className="text-[20px] font-bold text-slate-800 mb-1">
              All agencies in {stateName}
            </h2>
            <p className="text-[13.5px] text-slate-500">
              {selectedDest
                ? `${filtered.length} ${filtered.length === 1 ? 'agency' : 'agencies'} placing nurses in ${selectedDest}`
                : 'Sorted by rating · includes head offices and branch locations'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12.5px] text-slate-400 hidden sm:block">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="h-9 px-3 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards or empty state */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <SlidersHorizontal size={26} className="text-slate-300" />
            </div>
            <p className="text-[16px] font-semibold text-slate-700 mb-1">No agencies found</p>
            <p className="text-[13.5px] text-slate-400 mb-5">
              No agencies in {stateName} currently place nurses in {selectedDest}.
            </p>
            <button
              onClick={() => setSelectedDest(null)}
              className="px-5 py-2.5 bg-primary text-white text-[13.5px] font-semibold rounded-xl hover:bg-primary-hover transition-colors"
            >
              Show all agencies
            </button>
          </div>
        )}
      </section>
    </>
  )
}
