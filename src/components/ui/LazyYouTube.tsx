'use client'

import { useState } from 'react'

interface Props {
  videoId: string
  title: string
  className?: string
}

export function LazyYouTube({ videoId, title, className = 'w-full h-full' }: Props) {
  const [loaded, setLoaded] = useState(false)

  // YouTube hqdefault always exists; use it as the preview thumbnail.
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

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
      className="relative w-full h-full group focus:outline-none"
    >
      {/* Thumbnail — loaded from YouTube's image CDN, not the player */}
      <img
        src={thumbnail}
        alt={title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />

      {/* Scrim */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors"
      />

      {/* Play button */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white/90 shadow-lg ring-2 ring-white/60 group-hover:scale-105 transition-transform">
          {/* YouTube red play triangle */}
          <svg
            viewBox="0 0 68 48"
            width="34"
            height="24"
            className="text-[#FF0000] translate-x-[2px]"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" />
            <path d="M45 24 27 14v20" fill="white" />
          </svg>
        </span>
      </span>
    </button>
  )
}
