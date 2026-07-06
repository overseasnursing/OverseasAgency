'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, Building2, Globe, BookOpen } from 'lucide-react'

export interface SearchAgency  { slug: string; name: string; location: string }
export interface SearchCountry { slug: string; name: string }
export interface SearchExam    { slug: string; examName: string; examFullName: string }

interface GlobalSearchBarProps {
  agencies:  SearchAgency[]
  countries: SearchCountry[]
  exams:     SearchExam[]
}

const MAX = 3

export function GlobalSearchBar({ agencies, countries, exams }: GlobalSearchBarProps) {
  const [query, setQuery]       = useState('')
  const [closed, setClosed]     = useState(false)
  const [activeIdx, setActive]  = useState(-1)
  const router                  = useRouter()
  const wrapRef                 = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  const q         = query.trim().toLowerCase()
  const hasQuery  = q.length >= 2
  const isOpen    = hasQuery && !closed

  // Matched results per group — memoized so keyboard navigation (which only
  // changes activeIdx, not the query) doesn't re-run all three filters.
  const { matchedAgencies, matchedCountries, matchedExams } = useMemo(() => {
    if (!hasQuery) return { matchedAgencies: [], matchedCountries: [], matchedExams: [] }
    return {
      matchedAgencies:  agencies.filter(a => a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q)).slice(0, MAX),
      matchedCountries: countries.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)).slice(0, MAX),
      matchedExams:     exams.filter(e => e.examName.toLowerCase().includes(q) || e.examFullName.toLowerCase().includes(q)).slice(0, MAX),
    }
  }, [hasQuery, q, agencies, countries, exams])

  // Flat list for keyboard navigation
  type Row = { href: string; type: 'agency' | 'country' | 'exam'; title: string; subtitle: string }
  const rows: Row[] = useMemo(() => [
    ...matchedAgencies.map(a  => ({ href: `/agency/${a.slug}`,  type: 'agency'  as const, title: a.name,     subtitle: a.location       })),
    ...matchedCountries.map(c => ({ href: `/country/${c.slug}`, type: 'country' as const, title: c.name,     subtitle: 'Destination guide' })),
    ...matchedExams.map(e     => ({ href: `/exam/${e.slug}`,    type: 'exam'    as const, title: e.examName, subtitle: e.examFullName    })),
  ], [matchedAgencies, matchedCountries, matchedExams])
  const hasResults = rows.length > 0

  // Close on outside click (capture phase so it fires before React synthetic events)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setClosed(true)
        setActive(-1)
      }
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  function navigate(href: string) {
    setClosed(true)
    setActive(-1)
    router.push(href)
  }

  function handleChange(val: string) {
    setQuery(val)
    setClosed(false)  // opening again on each keystroke
    setActive(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setClosed(true); setActive(-1); return }
    if (!isOpen) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, rows.length - 1)) }
    else if (e.key === 'ArrowUp')  { e.preventDefault(); setActive(i => Math.max(i - 1, -1)) }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); navigate(rows[activeIdx].href) }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (activeIdx >= 0 && rows[activeIdx]) navigate(rows[activeIdx].href)
    else if (query.trim()) navigate(`/agencies?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div ref={wrapRef} className="relative mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 flex items-center bg-white rounded-2xl border border-slate-200 shadow-card-md focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 transition-all">
            <Search size={17} className="absolute left-4 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => handleChange(e.target.value)}
              onFocus={() => { if (hasQuery) setClosed(false) }}
              onKeyDown={handleKeyDown}
              placeholder="Search agencies, countries, exams..."
              className="w-full h-14 pl-11 pr-10 bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none rounded-2xl"
              autoComplete="off"
              spellCheck="false"
              aria-label="Search agencies, countries and exams"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setClosed(true); setActive(-1); inputRef.current?.focus() }}
                className="absolute right-3.5 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="h-14 px-7 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 flex-shrink-0"
          >
            Search
            <ArrowRight size={15} />
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)]" style={{ top: '100%', zIndex: 9999 }}>
          {hasResults ? (
            <>
              {/* Agencies group */}
              {matchedAgencies.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                    <Building2 size={12} className="text-slate-400" />
                    <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">Agencies</span>
                  </div>
                  {matchedAgencies.map((a, i) => {
                    const idx = i
                    return (
                      <button
                        key={a.slug}
                        type="button"
                        onMouseDown={e => { e.preventDefault(); navigate(`/agency/${a.slug}`) }}
                        onMouseEnter={() => setActive(idx)}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors ${activeIdx === idx ? 'bg-primary/8' : 'hover:bg-slate-50'}`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                          <Building2 size={14} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-slate-800 truncate">{a.name}</p>
                          <p className="text-[12px] text-slate-400 truncate">{a.location}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Countries group */}
              {matchedCountries.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                    <Globe size={12} className="text-slate-400" />
                    <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">Countries</span>
                  </div>
                  {matchedCountries.map((c, i) => {
                    const idx = matchedAgencies.length + i
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onMouseDown={e => { e.preventDefault(); navigate(`/country/${c.slug}`) }}
                        onMouseEnter={() => setActive(idx)}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors ${activeIdx === idx ? 'bg-primary/8' : 'hover:bg-slate-50'}`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                          <Globe size={14} className="text-[#166534]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-slate-800 truncate">{c.name}</p>
                          <p className="text-[12px] text-slate-400 truncate">Destination guide</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Exams group */}
              {matchedExams.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                    <BookOpen size={12} className="text-slate-400" />
                    <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">Exams & Guides</span>
                  </div>
                  {matchedExams.map((e, i) => {
                    const idx = matchedAgencies.length + matchedCountries.length + i
                    return (
                      <button
                        key={e.slug}
                        type="button"
                        onMouseDown={e2 => { e2.preventDefault(); navigate(`/exam/${e.slug}`) }}
                        onMouseEnter={() => setActive(idx)}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors ${activeIdx === idx ? 'bg-primary/8' : 'hover:bg-slate-50'}`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                          <BookOpen size={14} className="text-[#92400E]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-slate-800 truncate">{e.examName}</p>
                          <p className="text-[12px] text-slate-400 truncate">{e.examFullName}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-slate-100 px-4 py-2.5">
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); navigate(`/agencies?q=${encodeURIComponent(query.trim())}`) }}
                  className="text-[12.5px] font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                >
                  Search all agencies for &ldquo;{query.trim()}&rdquo;
                  <ArrowRight size={12} />
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-[14px] text-slate-500 mb-2">No results for &ldquo;{query}&rdquo;</p>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); navigate(`/agencies?q=${encodeURIComponent(query.trim())}`) }}
                className="text-[13px] font-semibold text-primary hover:text-primary-hover"
              >
                Search all agencies →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
