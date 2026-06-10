'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Search } from 'lucide-react'
import type { LocationOption } from '@/lib/data/locationPicker'

interface FormSelectProps {
  options: LocationOption[]
  value: string | null        // the label (display name) currently selected
  onChange: (label: string | null, isoCode: string | null) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export function FormSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled = false,
}: FormSelectProps) {
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
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  function select(opt: LocationOption) {
    onChange(opt.label, opt.value)
    setOpen(false)
    setQuery('')
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange(null, null)
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen((o) => !o); setQuery('') } }}
        className={[
          'w-full flex items-center justify-between h-9 px-3',
          'border rounded-lg text-[13px] transition-all bg-white',
          value ? 'text-slate-800' : 'text-slate-400',
          disabled
            ? 'border-slate-100 bg-slate-50 cursor-not-allowed text-slate-300'
            : open
            ? 'border-primary ring-1 ring-primary/20'
            : 'border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary/20',
        ].join(' ')}
      >
        <span className={['truncate', value ? 'font-medium text-slate-800' : 'text-slate-400'].join(' ')}>
          {value ?? placeholder}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {value && !disabled && (
            <span onClick={clear} className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
              <X size={11} />
            </span>
          )}
          <ChevronDown
            size={13}
            className={`text-slate-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute top-[38px] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-1.5 border-b border-slate-100">
            <div className="flex items-center gap-2 h-7 px-2 bg-slate-50 rounded-md">
              <Search size={12} className="text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-[12.5px] text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-[12.5px] text-slate-400">No results</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => select(opt)}
                  className={[
                    'w-full text-left px-3 py-1.5 text-[13px] transition-colors',
                    value === opt.label
                      ? 'text-primary font-semibold bg-primary/5'
                      : 'text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
