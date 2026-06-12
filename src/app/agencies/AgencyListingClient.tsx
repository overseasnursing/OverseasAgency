'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { SlidersHorizontal, ArrowUpDown, CheckCircle } from 'lucide-react'
import { AgencyCard } from '@/components/agencies/AgencyCard'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { FilterDrawer } from '@/components/filters/FilterDrawer'
import type { Agency, FilterState } from '@/types/agency'
import { DEFAULT_FILTERS } from '@/types/agency'

const SORT_LABELS: Record<FilterState['sortBy'], string> = {
  rating:      'Top rated',
  reviews:     'Most reviewed',
  placements:  'Most placements',
  'price-asc': 'Price: low to high',
  'price-desc':'Price: high to low',
}

function applyFilters(agencies: Agency[], filters: FilterState): Agency[] {
  return agencies
    .filter((a) => {
      const q = filters.search.toLowerCase()
      if (q) {
        const match =
          a.name.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.countries.some((c) => c.toLowerCase().includes(q)) ||
          a.examsSupported.some((e) => e.toLowerCase().includes(q)) ||
          (a.branchCities ?? []).some((c) => c.toLowerCase().includes(q)) ||
          (a.branchStates ?? []).some((s) => s.toLowerCase().includes(q))
        if (!match) return false
      }
      if (filters.countries.length > 0) {
        if (!filters.countries.some((c) => a.countries.includes(c))) return false
      }
      if (filters.state !== null) {
        const s = filters.state.toLowerCase()
        const inMain     = a.state.toLowerCase() === s
        const inBranches = (a.branchStates ?? []).some(bs => bs.toLowerCase() === s)
        if (!inMain && !inBranches) return false
      }
      if (filters.city !== null) {
        const c = filters.city.toLowerCase()
        const inMain     = a.city.toLowerCase() === c
        const inBranches = (a.branchCities ?? []).some(bc => bc.toLowerCase() === c)
        if (!inMain && !inBranches) return false
      }
      if (filters.maxPriceLakhs !== null) {
        if (a.pricing.minLakhs > filters.maxPriceLakhs) return false
      }
      if (filters.minRating !== null) {
        if (a.rating < filters.minRating) return false
      }
      if (filters.visaSponsorship === true) {
        if (!a.visaSponsorship) return false
      }
      if (filters.hideScamReported) {
        if (a.trustLevel === 'scam-reported') return false
      }
      if (filters.hideHiddenCharges) {
        if (a.hiddenChargesReported > 0) return false
      }
      if (filters.minPlacements !== null) {
        if (a.placementCount < filters.minPlacements) return false
      }
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':      return b.rating - a.rating
        case 'reviews':     return b.reviewCount - a.reviewCount
        case 'placements':  return b.placementCount - a.placementCount
        case 'price-asc':   return a.pricing.minLakhs - b.pricing.minLakhs
        case 'price-desc':  return b.pricing.maxLakhs - a.pricing.maxLakhs
        default:            return 0
      }
    })
}

function ActiveFilterPills({
  filters,
  onChange,
}: {
  filters: FilterState
  onChange: (f: FilterState) => void
}) {
  const pills: { label: string; clear: () => void }[] = []

  filters.countries.forEach((c) =>
    pills.push({ label: c, clear: () => onChange({ ...filters, countries: filters.countries.filter((x) => x !== c) }) })
  )
  if (filters.state !== null)
    pills.push({ label: filters.state, clear: () => onChange({ ...filters, state: null, city: null }) })
  if (filters.city !== null)
    pills.push({ label: filters.city, clear: () => onChange({ ...filters, city: null }) })
  if (filters.maxPriceLakhs !== null)
    pills.push({ label: `Max ₹${filters.maxPriceLakhs}L`, clear: () => onChange({ ...filters, maxPriceLakhs: null }) })
  if (filters.minRating !== null)
    pills.push({ label: `${filters.minRating}+ stars`, clear: () => onChange({ ...filters, minRating: null }) })
  if (filters.visaSponsorship === true)
    pills.push({ label: 'Visa Sponsorship', clear: () => onChange({ ...filters, visaSponsorship: null }) })
  if (filters.hideScamReported)
    pills.push({ label: 'Hide Scam Reports', clear: () => onChange({ ...filters, hideScamReported: false }) })
  if (filters.hideHiddenCharges)
    pills.push({ label: 'No Hidden Charges', clear: () => onChange({ ...filters, hideHiddenCharges: false }) })
  if (filters.minPlacements !== null)
    pills.push({ label: `${filters.minPlacements}+ placements`, clear: () => onChange({ ...filters, minPlacements: null }) })

  if (pills.length === 0) return null
  return (
    <div className="flex items-center flex-wrap gap-2">
      {pills.map((p) => (
        <button
          key={p.label}
          onClick={p.clear}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-[12.5px] font-semibold rounded-full hover:bg-primary/20 transition-colors"
        >
          {p.label}
          <span className="text-[10px] leading-none">✕</span>
        </button>
      ))}
    </div>
  )
}

interface AgencyListingClientProps {
  agencies: Agency[]
  initialCountry?: string | null
}

const PAGE_SIZE = 12

export function AgencyListingClient({ agencies, initialCountry }: AgencyListingClientProps) {
  const [filters, setFilters] = useState<FilterState>(() =>
    initialCountry ? { ...DEFAULT_FILTERS, countries: [initialCountry] } : DEFAULT_FILTERS
  )
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sortOpen, setSortOpen]     = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Reset to first page whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters])

  // Derive available states and cities from agencies data
  const availableStates = useMemo(() => {
    const all: string[] = []
    for (const a of agencies) {
      if (a.state) all.push(a.state)
      for (const s of (a.branchStates ?? [])) all.push(s)
    }
    return [...new Set(all)].sort()
  }, [agencies])

  const availableCities = useMemo(() => {
    const source = filters.state
      ? agencies.filter((a) => {
          const s = filters.state!.toLowerCase()
          return a.state.toLowerCase() === s || (a.branchStates ?? []).some(bs => bs.toLowerCase() === s)
        })
      : agencies
    const all: string[] = []
    for (const a of source) {
      if (a.city) all.push(a.city)
      for (const c of (a.branchCities ?? [])) all.push(c)
    }
    return [...new Set(all)].sort()
  }, [agencies, filters.state])

  const results = useMemo(() => applyFilters(agencies, filters), [agencies, filters])
  const visible = results.slice(0, visibleCount)
  const hasMore = visibleCount < results.length

  const activeFilterCount = [
    filters.countries.length > 0,
    filters.state !== null,
    filters.city !== null,
    filters.maxPriceLakhs !== null,
    filters.minRating !== null,
    filters.visaSponsorship !== null,
    filters.hideScamReported,
    filters.hideHiddenCharges,
    filters.minPlacements !== null,
  ].filter(Boolean).length

  return (
    <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-10">

      {/* ── Search bar ── */}
      <div className="mb-8">
        <SearchBar
          value={filters.search}
          onChange={(search) => setFilters((f) => ({ ...f, search }))}
          selectedCountry={filters.countries[0] ?? null}
          onCountrySelect={(country) =>
            setFilters((f) => ({ ...f, countries: country ? [country] : [] }))
          }
        />
      </div>

      {/* ── Mobile: filter + sort bar ── */}
      <div className="lg:hidden flex items-center gap-3 mb-5">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold text-slate-700 hover:border-primary hover:text-primary transition-colors shadow-card flex-1"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-auto w-5 h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 h-11 px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-semibold text-slate-700 hover:border-primary hover:text-primary transition-colors shadow-card"
          >
            <ArrowUpDown size={15} />
            Sort
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-card-md z-20 w-48 py-1 animate-fade-in">
              {(Object.entries(SORT_LABELS) as [FilterState['sortBy'], string][]).map(
                ([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFilters((f) => ({ ...f, sortBy: value }))
                      setSortOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-[13.5px] text-left transition-colors ${
                      filters.sortBy === value
                        ? 'text-primary font-semibold bg-primary/5'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {filters.sortBy === value && <CheckCircle size={13} />}
                    {label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Active filter pills ── */}
      <ActiveFilterPills filters={filters} onChange={setFilters} />

      {/* ── Main layout ── */}
      <div className="flex gap-8 mt-6">

        {/* Desktop sidebar */}
        <div className="hidden lg:block w-[260px] flex-shrink-0">
          <div className="sticky top-[92px]">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              resultCount={results.length}
              availableStates={availableStates}
              availableCities={availableCities}
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">

          {/* Results header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[15px] font-semibold text-slate-800">
                {results.length}{' '}
                <span className="font-normal text-slate-500">
                  agenc{results.length === 1 ? 'y' : 'ies'} found
                </span>
              </p>
              {results.length > visibleCount && (
                <p className="text-[13px] text-slate-400 mt-0.5">
                  Showing {visibleCount} of {results.length}
                </p>
              )}
              {filters.search && (
                <p className="text-[13px] text-slate-400 mt-0.5">
                  Results for &ldquo;{filters.search}&rdquo;
                </p>
              )}
            </div>

            {/* Desktop sort */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[13px] text-slate-400">Sort by:</span>
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 h-9 px-3 bg-white border border-slate-200 rounded-xl text-[13.5px] font-medium text-slate-700 hover:border-primary transition-colors"
                >
                  {SORT_LABELS[filters.sortBy]}
                  <ArrowUpDown size={13} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-xl shadow-card-md z-20 w-52 py-1 animate-fade-in">
                    {(Object.entries(SORT_LABELS) as [FilterState['sortBy'], string][]).map(
                      ([value, label]) => (
                        <button
                          key={value}
                          onClick={() => {
                            setFilters((f) => ({ ...f, sortBy: value }))
                            setSortOpen(false)
                          }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-[13.5px] text-left transition-colors ${
                            filters.sortBy === value
                              ? 'text-primary font-semibold bg-primary/5'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {filters.sortBy === value && <CheckCircle size={13} />}
                          {label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cards */}
          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visible.map((agency) => (
                  <AgencyCard key={agency.id} agency={agency} />
                ))}
              </div>

              {hasMore ? (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <button
                    onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                    className="h-11 px-8 bg-white border border-slate-200 hover:border-primary hover:text-primary text-[14px] font-semibold text-slate-700 rounded-xl transition-colors shadow-sm"
                  >
                    Load more agencies
                  </button>
                  <p className="text-[12.5px] text-slate-400">
                    Showing {visibleCount} of {results.length}
                  </p>
                </div>
              ) : results.length > PAGE_SIZE ? (
                <p className="text-center text-[13px] text-slate-400 mt-8">
                  All {results.length} agencies shown
                </p>
              ) : null}
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
                <SlidersHorizontal size={28} className="text-slate-300" />
              </div>
              <h4 className="text-[18px] font-semibold text-slate-700 mb-2">
                No agencies match your filters
              </h4>
              <p className="text-[14px] text-slate-400 max-w-[320px] leading-relaxed mb-6">
                Try removing a few filters or searching by a different country or exam.
              </p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={results.length}
        availableStates={availableStates}
        availableCities={availableCities}
      />
    </div>
  )
}
