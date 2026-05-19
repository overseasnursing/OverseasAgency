'use client'

import React from 'react'
import { RotateCcw } from 'lucide-react'
import type { FilterState } from '@/types/agency'
import { COUNTRIES } from '@/lib/data/agencies'

interface FilterSidebarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  resultCount: number
}

const PRICE_OPTIONS = [
  { label: 'Under ₹3L',   value: 3   },
  { label: '₹3L – ₹5L',  value: 5   },
  { label: '₹5L – ₹8L',  value: 8   },
  { label: '₹8L+',        value: 999 },
]

const RATING_OPTIONS = [
  { label: '4.5+ stars', value: 4.5 },
  { label: '4.0+ stars', value: 4.0 },
  { label: '3.5+ stars', value: 3.5 },
]

const PLACEMENT_OPTIONS = [
  { label: '100+ placements',  value: 100  },
  { label: '500+ placements',  value: 500  },
  { label: '1000+ placements', value: 1000 },
]

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-slate-100 last:border-none">
      <h6 className="mb-4">{title}</h6>
      {children}
    </div>
  )
}

export function FilterSidebar({ filters, onChange, resultCount }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.countries.length > 0 ||
    filters.maxPriceLakhs !== null ||
    filters.minRating !== null ||
    filters.visaSponsorship !== null ||
    filters.hideScamReported ||
    filters.hideHiddenCharges ||
    filters.minPlacements !== null

  const reset = () =>
    onChange({
      ...filters,
      countries: [],
      maxPriceLakhs: null,
      minRating: null,
      visaSponsorship: null,
      hideScamReported: false,
      hideHiddenCharges: false,
      minPlacements: null,
    })

  const toggleCountry = (country: string) => {
    const next = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country]
    onChange({ ...filters, countries: next })
  }

  return (
    <aside
      className="w-full"
      aria-label="Filter agencies"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1 pb-4 border-b border-slate-100">
        <div>
          <h5 className="text-[15px] font-semibold text-slate-800">Filters</h5>
          <p className="text-[12.5px] text-slate-400 mt-0.5">
            {resultCount} agenc{resultCount === 1 ? 'y' : 'ies'} found
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-[12.5px] font-medium text-primary hover:text-primary-hover transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Country */}
      <FilterSection title="Destination Country">
        <div className="space-y-2.5">
          {COUNTRIES.map((country) => (
            <label
              key={country}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.countries.includes(country)}
                onChange={() => toggleCountry(country)}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
              />
              <span className="text-[14px] text-slate-600 group-hover:text-slate-800 transition-colors">
                {country}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Maximum Price">
        <div className="space-y-2">
          {PRICE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={filters.maxPriceLakhs === opt.value}
                onChange={() =>
                  onChange({
                    ...filters,
                    maxPriceLakhs: filters.maxPriceLakhs === opt.value ? null : opt.value,
                  })
                }
                className="w-4 h-4 border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
              />
              <span className="text-[14px] text-slate-600 group-hover:text-slate-800 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-2">
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === opt.value}
                onChange={() =>
                  onChange({
                    ...filters,
                    minRating: filters.minRating === opt.value ? null : opt.value,
                  })
                }
                className="w-4 h-4 border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
              />
              <span className="text-[14px] text-slate-600 group-hover:text-slate-800 transition-colors flex items-center gap-1.5">
                {opt.label}
                <span className="text-[#F59E0B]">{'★'.repeat(Math.floor(opt.value))}</span>
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Placements */}
      <FilterSection title="Placement Experience">
        <div className="space-y-2">
          {PLACEMENT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="placements"
                checked={filters.minPlacements === opt.value}
                onChange={() =>
                  onChange({
                    ...filters,
                    minPlacements: filters.minPlacements === opt.value ? null : opt.value,
                  })
                }
                className="w-4 h-4 border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
              />
              <span className="text-[14px] text-slate-600 group-hover:text-slate-800 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Visa & Trust toggles */}
      <FilterSection title="Agency Quality">
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[14px] text-slate-600">Visa Sponsorship</span>
            <button
              role="switch"
              aria-checked={filters.visaSponsorship === true}
              onClick={() =>
                onChange({
                  ...filters,
                  visaSponsorship: filters.visaSponsorship === true ? null : true,
                })
              }
              className={`relative w-10 h-[22px] rounded-full transition-colors ${
                filters.visaSponsorship === true ? 'bg-primary' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${
                  filters.visaSponsorship === true ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[14px] text-slate-600">Hide Scam Reported</span>
            <button
              role="switch"
              aria-checked={filters.hideScamReported}
              onClick={() =>
                onChange({ ...filters, hideScamReported: !filters.hideScamReported })
              }
              className={`relative w-10 h-[22px] rounded-full transition-colors ${
                filters.hideScamReported ? 'bg-primary' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${
                  filters.hideScamReported ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[14px] text-slate-600">No Hidden Charges</span>
            <button
              role="switch"
              aria-checked={filters.hideHiddenCharges}
              onClick={() =>
                onChange({ ...filters, hideHiddenCharges: !filters.hideHiddenCharges })
              }
              className={`relative w-10 h-[22px] rounded-full transition-colors ${
                filters.hideHiddenCharges ? 'bg-primary' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${
                  filters.hideHiddenCharges ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        </div>
      </FilterSection>
    </aside>
  )
}
