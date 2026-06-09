'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

interface Props {
  embedUrl: string
  title: string
  address: string
}

export function LazyMap({ embedUrl, title, address }: Props) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className="w-full h-full"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`Load map for ${address}`}
      className="w-full h-full flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none group"
    >
      {/* Subtle grid pattern to hint at map */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <span className="relative z-10 flex flex-col items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 group-hover:shadow transition-shadow">
          <MapPin size={18} className="text-primary" />
        </span>

        <span className="max-w-[240px] text-center text-[12.5px] leading-relaxed text-slate-500">
          {address}
        </span>

        <span className="rounded-xl bg-primary px-4 py-2 text-[12.5px] font-semibold text-white group-hover:bg-primary-hover transition-colors">
          Load Map
        </span>
      </span>
    </button>
  )
}
