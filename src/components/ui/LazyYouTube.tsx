'use client'

import { useState } from 'react'

interface Props {
  videoId: string
  title: string
  className?: string
}

export function LazyYouTube({ videoId, title, className = 'w-full h-full' }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [thumbReady, setThumbReady] = useState(false)

  // maxresdefault (1280×720) when available; hqdefault (480×360) always exists.
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
  const fallback  = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  if (loaded) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`${className} border-0`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`Play: ${title}`}
      className="relative w-full h-full group focus:outline-none bg-slate-900"
    >
      {/* Thumbnail — shown once loaded to avoid flash of broken icon */}
      <img
        src={thumbnail}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        width={1280}
        height={720}
        onLoad={() => setThumbReady(true)}
        onError={(e) => {
          // maxresdefault may not exist for every video — fall back to hqdefault
          const img = e.currentTarget
          if (img.src !== fallback) {
            img.src = fallback
          }
        }}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          thumbReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dark gradient overlay — always visible so play button stands out */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60 transition-colors"
      />

      {/* YouTube play button */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white/90 shadow-xl ring-4 ring-white/30 group-hover:scale-110 group-hover:bg-white transition-all duration-200">
          <svg
            viewBox="0 0 68 48"
            width="36"
            height="26"
            aria-hidden="true"
            fill="none"
          >
            {/* Red background */}
            <path
              d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
              fill="#FF0000"
            />
            {/* White triangle */}
            <path d="M45 24 27 14v20z" fill="#fff" />
          </svg>
        </span>
      </span>

      {/* Video title — subtle label at the bottom */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 px-4 py-3 text-white text-[13px] font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {title}
      </span>
    </button>
  )
}
