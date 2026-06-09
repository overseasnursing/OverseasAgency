'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

interface Props {
  embedUrl: string
  title: string
  address: string
}

// Inline SVG that mimics an OpenStreetMap-style map tile:
// beige land, a few white road lines, a blue water patch.
// Pure SVG — zero network requests, looks like a real map.
const MapTileSVG = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 400 260"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full"
  >
    {/* Land */}
    <rect width="400" height="260" fill="#eae6df" />

    {/* Park / green area */}
    <rect x="0"   y="160" width="100" height="100" fill="#d4e9c8" />
    <rect x="270" y="0"   width="130" height="90"  fill="#d4e9c8" />

    {/* Water body */}
    <ellipse cx="340" cy="200" rx="80" ry="50" fill="#aad3df" />

    {/* Main roads — wide, white */}
    <line x1="0"   y1="100" x2="400" y2="100" stroke="#fff" strokeWidth="10" />
    <line x1="0"   y1="160" x2="400" y2="160" stroke="#fff" strokeWidth="6"  />
    <line x1="130" y1="0"   x2="130" y2="260" stroke="#fff" strokeWidth="10" />
    <line x1="240" y1="0"   x2="240" y2="260" stroke="#fff" strokeWidth="6"  />

    {/* Secondary roads — narrower */}
    <line x1="0"   y1="60"  x2="400" y2="60"  stroke="#fff" strokeWidth="3"  opacity="0.7" />
    <line x1="0"   y1="210" x2="270" y2="210" stroke="#fff" strokeWidth="3"  opacity="0.7" />
    <line x1="60"  y1="0"   x2="60"  y2="260" stroke="#fff" strokeWidth="3"  opacity="0.7" />
    <line x1="310" y1="0"   x2="310" y2="160" stroke="#fff" strokeWidth="3"  opacity="0.7" />

    {/* Road outlines (give depth) */}
    <line x1="0"   y1="100" x2="400" y2="100" stroke="#c9b99a" strokeWidth="11" opacity="0.25" />
    <line x1="130" y1="0"   x2="130" y2="260" stroke="#c9b99a" strokeWidth="11" opacity="0.25" />

    {/* Building blocks */}
    <rect x="20"  y="20"  width="30" height="30" rx="2" fill="#d6cfc7" />
    <rect x="70"  y="20"  width="50" height="28" rx="2" fill="#d6cfc7" />
    <rect x="20"  y="70"  width="90" height="20" rx="2" fill="#d6cfc7" />
    <rect x="150" y="20"  width="70" height="30" rx="2" fill="#d6cfc7" />
    <rect x="150" y="120" width="60" height="28" rx="2" fill="#d6cfc7" />
    <rect x="260" y="120" width="50" height="32" rx="2" fill="#d6cfc7" />
    <rect x="20"  y="180" width="60" height="30" rx="2" fill="#d6cfc7" />
    <rect x="100" y="180" width="40" height="25" rx="2" fill="#c8e6b4" />
  </svg>
)

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
      className="relative w-full h-full overflow-hidden focus:outline-none group"
    >
      {/* Map tile background */}
      <MapTileSVG />

      {/* Slight vignette so the centre CTA pops */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-black/10 group-hover:bg-black/15 transition-colors"
      />

      {/* Centre CTA */}
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
        {/* Drop-shadow pin */}
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-white/60 group-hover:scale-105 transition-transform">
          <MapPin size={20} className="text-primary" />
        </span>

        <span className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-md group-hover:bg-primary-hover transition-colors">
          Load Map
        </span>
      </span>
    </button>
  )
}
