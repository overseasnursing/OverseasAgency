'use client'

import React, { useRef } from 'react'
import { Search, X } from 'lucide-react'

const TOP_COUNTRIES = ['Germany', 'UK', 'Australia', 'Canada', 'UAE', 'Ireland', 'New Zealand']

interface SearchBarProps {
  value:             string
  onChange:          (value: string) => void
  selectedCountry?:  string | null
  onCountrySelect?:  (country: string | null) => void
}

export function SearchBar({ value, onChange, selectedCountry, onCountrySelect }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full">
      {/* Input */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by country, agency name, or exam..."
          className="w-full h-14 pl-11 pr-10 py-4 text-[15px] bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-card"
          aria-label="Search agencies"
          autoComplete="off"
          spellCheck="false"
        />
        {value && (
          <button
            onClick={() => { onChange(''); inputRef.current?.focus() }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Top country chips */}
      {onCountrySelect && (
        <div className="flex items-center flex-wrap gap-2 mt-3">
          <span className="text-[12px] font-medium text-slate-400 mr-1">Top:</span>
          {TOP_COUNTRIES.map((country) => {
            const active = selectedCountry === country
            return (
              <button
                key={country}
                onClick={() => onCountrySelect(active ? null : country)}
                className={[
                  'px-3 py-1.5 text-[12.5px] font-medium rounded-full border transition-colors',
                  active
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary shadow-sm',
                ].join(' ')}
              >
                {country}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
