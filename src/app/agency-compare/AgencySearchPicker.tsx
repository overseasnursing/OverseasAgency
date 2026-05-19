'use client'

import React, { useState, useMemo } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import type { Agency } from '@/types/agency'

interface AgencySearchPickerProps {
  agencies: Agency[]
  lockedSlug: string   // agency A — exclude from results
  currentBSlug?: string
}

export function AgencySearchPicker({ agencies, lockedSlug, currentBSlug }: AgencySearchPickerProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return agencies
      .filter(a => a.slug !== lockedSlug)
      .filter(a =>
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.countries.some(c => c.toLowerCase().includes(q))
      )
      .slice(0, 8)
  }, [agencies, lockedSlug, query])

  return (
    <div className="flex flex-col gap-4">
      {/* Search input */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search agency name, city, or country…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 text-[14px] text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          autoFocus
        />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-2">
        {filtered.map(agency => {
          const isSelected = agency.slug === currentBSlug
          const href = `?a=${lockedSlug}&b=${agency.slug}`
          return (
            <a
              key={agency.slug}
              href={href}
              className={[
                'flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 hover:border-primary hover:bg-[#F8FAFC]',
              ].join(' ')}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Initials avatar */}
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-primary">
                    {agency.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-800 truncate">{agency.name}</p>
                  <p className="text-[12px] text-slate-400 truncate">
                    {agency.location} · {agency.rating.toFixed(1)}★ · {agency.countries.slice(0, 2).join(', ')}
                    {agency.countries.length > 2 ? ` +${agency.countries.length - 2}` : ''}
                  </p>
                </div>
              </div>
              <ArrowRight size={15} className="text-slate-300 flex-shrink-0" />
            </a>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-[13px] text-slate-400 text-center py-6">No agencies found. Try a different search.</p>
        )}
      </div>
    </div>
  )
}
