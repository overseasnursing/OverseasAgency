'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSourceCountry } from '@/lib/country/context'
import { FlagIcon } from '@/components/ui/FlagIcon'

/**
 * Always-visible header control — lets a visitor see and change their
 * Market Context. Reads/writes only through useSourceCountry(); never
 * touches cookies or the resolver directly.
 */
export function CountrySwitcher() {
  const { country, available, setCountry } = useSourceCountry()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  async function handleSelect(name: string) {
    setOpen(false)
    if (name === country.name) return
    setPending(true)
    await setCountry(name)
    setPending(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        disabled={pending}
        aria-label="Change source country"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 h-9 px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        <FlagIcon iso={country.isoCode.toLowerCase()} size={16} />
        <span className="text-[13px] font-medium text-slate-700 hidden sm:inline">{country.name}</span>
        <ChevronDown size={13} className="text-slate-400" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+8px)] w-44 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50"
        >
          {available.map(c => (
            <button
              key={c.name}
              type="button"
              role="option"
              aria-selected={c.name === country.name}
              onClick={() => handleSelect(c.name)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-left hover:bg-slate-50 transition-colors ${
                c.name === country.name ? 'font-semibold text-primary' : 'text-slate-700'
              }`}
            >
              <FlagIcon iso={c.isoCode.toLowerCase()} size={16} />
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
