'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Search } from 'lucide-react'

interface SearchableSelectProps {
  options: string[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
}

export function SearchableSelect({ options, value, onChange, placeholder = 'Search...' }: SearchableSelectProps) {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState('')
  const ref               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options

  function select(option: string) {
    onChange(option)
    setOpen(false)
    setQuery('')
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setQuery('') }}
        className={`w-full flex items-center justify-between h-10 px-3 bg-white border rounded-xl text-[13.5px] transition-colors ${
          value ? 'border-primary/60 text-slate-800' : 'border-slate-200 text-slate-400'
        } hover:border-slate-300`}
      >
        <span className={value ? 'text-slate-800 font-medium truncate' : 'text-slate-400'}>
          {value ?? placeholder}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          {value && (
            <span
              onClick={clear}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute top-[42px] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-40 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 h-8 px-2.5 bg-slate-50 rounded-lg">
              <Search size={13} className="text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2.5 text-[13px] text-slate-400">No results</p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => select(option)}
                  className={`w-full text-left px-3 py-2 text-[13.5px] transition-colors ${
                    value === option
                      ? 'text-primary font-semibold bg-primary/5'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
