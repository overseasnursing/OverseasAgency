'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, ShieldAlert, ShieldCheck, MapPin, X, AlertTriangle, ChevronRight } from 'lucide-react'
import type { PlatformScamReport } from '@/types/scamReport'

interface AgencyItem {
  slug: string
  name: string
  location: string
  logo?: string
}

interface Props {
  agencies: AgencyItem[]
  reports: PlatformScamReport[]
}

function Initials({ name }: { name: string }) {
  const letters = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
      <span className="text-[12px] font-bold text-primary">{letters}</span>
    </div>
  )
}

const SEVERITY_CONFIG = {
  critical: { label: 'Critical',  cls: 'bg-[#FEE2E2] text-[#B91C1C]' },
  high:     { label: 'High',      cls: 'bg-[#FEF3C7] text-[#92400E]' },
  moderate: { label: 'Moderate',  cls: 'bg-slate-100 text-slate-600'  },
}

export function ScamAgencySearch({ agencies, reports }: Props) {
  const [query, setQuery]       = useState('')
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState<AgencyItem | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Build a map: agencySlug → reports[]
  const reportsBySlug = React.useMemo(() => {
    const map = new Map<string, PlatformScamReport[]>()
    for (const r of reports) {
      if (!map.has(r.agencySlug)) map.set(r.agencySlug, [])
      map.get(r.agencySlug)!.push(r)
    }
    return map
  }, [reports])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return agencies
      .filter(a => a.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, agencies])

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function selectAgency(agency: AgencyItem) {
    setSelected(agency)
    setQuery(agency.name)
    setOpen(false)
  }

  function clear() {
    setSelected(null)
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const agencyReports = selected ? (reportsBySlug.get(selected.slug) ?? []) : []
  const hasReports    = agencyReports.length > 0

  return (
    <div className="mt-6 flex flex-col gap-3" ref={containerRef}>

      {/* Search input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search agency name to check scam reports…"
          onChange={e => {
            setQuery(e.target.value)
            setSelected(null)
            setOpen(true)
          }}
          onFocus={() => { if (query.length >= 2) setOpen(true) }}
          className="w-full h-12 pl-10 pr-10 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition-all"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={15} />
          </button>
        )}

        {/* Dropdown */}
        {open && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {filtered.map(agency => {
              const scammed = reportsBySlug.has(agency.slug)
              return (
                <button
                  key={agency.slug}
                  onClick={() => selectAgency(agency)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0"
                >
                  <Initials name={agency.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-slate-800 truncate">{agency.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-slate-400 flex-shrink-0" />
                      <span className="text-[12px] text-slate-400 truncate">{agency.location}</span>
                    </div>
                  </div>
                  {scammed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-[#FEE2E2] text-[#B91C1C] rounded-full flex-shrink-0">
                      <ShieldAlert size={10} /> Scam Reported
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-[#DCFCE7] text-[#166534] rounded-full flex-shrink-0">
                      <ShieldCheck size={10} /> No Reports
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* No results */}
        {open && query.trim().length >= 2 && filtered.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 px-4 py-4 text-center">
            <p className="text-[13px] text-slate-500">No agency found matching &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Result panel */}
      {selected && (
        <div className={`rounded-xl border p-4 ${hasReports ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#F0FDF4] border-[#BBF7D0]'}`}>

          {/* Agency header */}
          <div className="flex items-center gap-3 mb-3">
            <Initials name={selected.name} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-slate-800 truncate">{selected.name}</p>
              <div className="flex items-center gap-1">
                <MapPin size={11} className="text-slate-400" />
                <span className="text-[12px] text-slate-400">{selected.location}</span>
              </div>
            </div>
            {hasReports ? (
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 bg-[#FEE2E2] text-[#B91C1C] rounded-full flex-shrink-0">
                <ShieldAlert size={12} />
                {agencyReports.length} Scam Report{agencyReports.length > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 bg-[#DCFCE7] text-[#166534] rounded-full flex-shrink-0">
                <ShieldCheck size={12} /> No Reports
              </span>
            )}
          </div>

          {/* Scam result body */}
          {hasReports ? (
            <div className="flex flex-col gap-2">
              {agencyReports.map(r => (
                <a
                  key={r.id}
                  href={`/scam-report/${r.slug}`}
                  className="flex items-start gap-3 p-3 bg-white border border-[#FECACA] rounded-lg hover:border-[#F87171] transition-colors group"
                >
                  <AlertTriangle size={14} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#B91C1C] transition-colors">
                      {r.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${SEVERITY_CONFIG[r.severity].cls}`}>
                        {SEVERITY_CONFIG[r.severity].label}
                      </span>
                      <span className="text-[11.5px] text-slate-400">{r.displayDate}</span>
                      <span className="text-[11.5px] font-semibold text-[#DC2626]">
                        ₹{(r.amountLost / 100000).toFixed(1)}L lost
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-[#B91C1C] flex-shrink-0 mt-0.5 transition-colors" />
                </a>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={15} className="text-[#166534] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#166534]">No scam reports found for this agency.</p>
                <p className="text-[12.5px] text-[#166534]/70 mt-0.5">
                  This agency has a clean record on OverseasNursing. Always verify fees in writing before paying.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
