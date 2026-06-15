'use client'

import React, { useState, useMemo } from 'react'
import { Search, X, Briefcase } from 'lucide-react'
import { JobCard } from './_components/JobCard'
import type { ActiveJobListing } from '@/lib/db/jobs'

interface JobsClientProps {
  jobs: ActiveJobListing[]
}

export function JobsClient({ jobs }: JobsClientProps) {
  const [search, setSearch]   = useState('')
  const [country, setCountry] = useState('')

  const countries = useMemo(() => {
    const all = jobs.map((j) => j.country).filter(Boolean)
    return [...new Set(all)].sort()
  }, [jobs])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return jobs.filter((j) => {
      if (q && !j.title.toLowerCase().includes(q)) return false
      if (country && j.country !== country) return false
      return true
    })
  }, [jobs, search, country])

  const hasFilters = search.length > 0 || country.length > 0

  return (
    <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-10">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job title..."
            className="w-full h-11 pl-10 pr-10 text-[14px] bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-card"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-card sm:w-48"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      {hasFilters && (
        <p className="text-[13px] text-slate-500 mb-5">
          {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid / empty */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
            <Briefcase size={28} className="text-slate-300" />
          </div>
          <p className="text-[16px] font-semibold text-slate-700 mb-1.5">
            No nursing jobs available right now.
          </p>
          {hasFilters && (
            <>
              <p className="text-[13px] text-slate-400 mb-5">
                Try clearing your filters to see all open positions.
              </p>
              <button
                onClick={() => { setSearch(''); setCountry('') }}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
