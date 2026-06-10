'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Building2, ChevronRight, ArrowLeft, Search } from 'lucide-react'
import type { StateIndex } from '@/lib/data/getAgencyLocationData'

interface Props {
  states: StateIndex[]
}

export function LocationDirectoryClient({ states }: Props) {
  const [selectedState, setSelectedState] = useState<StateIndex | null>(null)
  const [query, setQuery] = useState('')

  const totalCities = useMemo(
    () => states.reduce((n, s) => n + s.cities.length, 0),
    [states],
  )

  function handleStateClick(state: StateIndex) {
    setSelectedState(state)
    setQuery('')
  }

  function handleBack() {
    setSelectedState(null)
    setQuery('')
  }

  const filteredStates = useMemo(() => {
    if (selectedState) return []
    if (!query.trim()) return states
    const q = query.toLowerCase()
    return states.filter(
      (s) =>
        s.state.toLowerCase().includes(q) ||
        s.cities.some((c) => c.city.toLowerCase().includes(q)),
    )
  }, [query, selectedState, states])

  const filteredCities = useMemo(() => {
    if (!selectedState) return []
    if (!query.trim()) return selectedState.cities
    const q = query.toLowerCase()
    return selectedState.cities.filter((c) => c.city.toLowerCase().includes(q))
  }, [query, selectedState])

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            {/* Breadcrumb trail */}
            <div className="flex items-center gap-2 text-[13px] min-w-0">
              <button
                onClick={handleBack}
                className={`font-semibold shrink-0 transition-colors ${
                  selectedState
                    ? 'text-primary hover:underline cursor-pointer'
                    : 'text-slate-400 cursor-default'
                }`}
                disabled={!selectedState}
              >
                All States
              </button>
              {selectedState && (
                <>
                  <ChevronRight size={13} className="text-slate-300 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{selectedState.state}</span>
                </>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search */}
            <div className="relative w-full sm:w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={selectedState ? `Search cities in ${selectedState.state}…` : 'Search states or cities…'}
                className="w-full pl-8 pr-3 h-9 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-slate-50"
              />
            </div>
          </div>

          {/* State pills — only shown at root level, no query */}
          {!selectedState && !query && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {states.map((s) => (
                <button
                  key={s.stateSlug}
                  onClick={() => handleStateClick(s)}
                  className="text-[12px] font-medium text-slate-600 bg-slate-100 hover:bg-primary hover:text-white px-3 py-1 rounded-full transition-colors"
                >
                  {s.state}
                  <span className="ml-1 text-[10px] opacity-70">{s.agencyCount}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8">

        {/* ── State drill-down view ── */}
        {selectedState ? (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-[13px] text-primary font-semibold hover:underline"
              >
                <ArrowLeft size={14} />
                All States
              </button>
              <span className="text-slate-300">·</span>
              <Link
                href={`/agencies/${selectedState.stateSlug}`}
                className="text-[13px] text-slate-600 hover:text-primary transition-colors"
              >
                View all {selectedState.agencyCount} agencies in {selectedState.state} →
              </Link>
            </div>

            <div className="mb-5">
              <h2 className="text-[22px] font-bold text-slate-800">
                Cities in {selectedState.state}
              </h2>
              <p className="text-[13.5px] text-slate-500 mt-1">
                {selectedState.cities.length} {selectedState.cities.length === 1 ? 'city' : 'cities'} with overseas nursing agencies
              </p>
            </div>

            {/* State itself as a card */}
            <Link
              href={`/agencies/${selectedState.stateSlug}`}
              className="group flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 mb-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-[14.5px] font-bold text-primary">All agencies in {selectedState.state}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">{selectedState.agencyCount} verified agencies across all cities</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-primary shrink-0" />
            </Link>

            {/* City grid */}
            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCities.map((city) => (
                  <Link
                    key={city.citySlug}
                    href={`/agencies/${selectedState.stateSlug}/${city.citySlug}`}
                    className="group flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin size={14} className="text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">
                          {city.city}
                        </p>
                        <p className="text-[11.5px] text-slate-400 mt-0.5">
                          {city.agencyCount} {city.agencyCount === 1 ? 'agency' : 'agencies'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-slate-400 py-8 text-center">No cities match your search.</p>
            )}
          </section>
        ) : (
          /* ── Root view: all states ── */
          <section>
            {!query && (
              <div className="mb-6">
                <h2 className="text-[22px] font-bold text-slate-800">Browse all states</h2>
                <p className="text-[13.5px] text-slate-500 mt-1">
                  {states.length} states · {totalCities} cities — click a state to explore its cities
                </p>
              </div>
            )}

            {query && (
              <div className="mb-6">
                <p className="text-[13.5px] text-slate-500">
                  {filteredStates.length} {filteredStates.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
                </p>
              </div>
            )}

            {filteredStates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredStates.map((state) => (
                  <button
                    key={state.stateSlug}
                    onClick={() => handleStateClick(state)}
                    className="group text-left bg-white border border-slate-200 rounded-xl px-4 py-4 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-bold text-slate-800 group-hover:text-primary transition-colors">
                          {state.state}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[12px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Building2 size={11} />
                            {state.agencyCount} {state.agencyCount === 1 ? 'agency' : 'agencies'}
                          </span>
                          {state.cities.length > 0 && (
                            <span className="flex items-center gap-1">
                              <MapPin size={11} />
                              {state.cities.length} {state.cities.length === 1 ? 'city' : 'cities'}
                            </span>
                          )}
                        </div>
                        {state.cities.length > 0 && (
                          <p className="text-[11.5px] text-slate-400 mt-1.5 truncate">
                            {state.cities.slice(0, 3).map((c) => c.city).join(', ')}
                            {state.cities.length > 3 ? ` +${state.cities.length - 3} more` : ''}
                          </p>
                        )}
                      </div>
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-slate-400 py-8 text-center">No locations match your search.</p>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
