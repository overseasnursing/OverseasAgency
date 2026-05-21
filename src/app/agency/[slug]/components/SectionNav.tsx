'use client'

import React, { useState, useEffect } from 'react'

export interface NavSection {
  id: string
  label: string
}

interface SectionNavProps {
  sections: NavSection[]
}

const NAVBAR_H = 68
const SELF_H   = 44
const OFFSET   = NAVBAR_H + SELF_H

export function SectionNav({ sections }: SectionNavProps) {
  const [show,   setShow]   = useState(false)
  const [active, setActive] = useState(sections[0]?.id ?? '')

  // Show after scrolling past the hero area
  useEffect(() => {
    function onScroll() {
      const about = document.getElementById('about')
      if (about) {
        setShow(about.getBoundingClientRect().top < NAVBAR_H + 60)
      } else {
        setShow(window.scrollY > 300)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track which section is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: `-${OFFSET}px 0px -50% 0px`, threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [sections])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
  }

  if (!show) return null

  return (
    <div
      style={{
        position:     'fixed',
        top:          NAVBAR_H,
        left:         0,
        right:        0,
        zIndex:       100,
        background:   '#fff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow:    '0 2px 8px rgba(0,0,0,0.08)',
        height:       SELF_H,
        display:      'flex',
        alignItems:   'center',
      }}
    >
      <div
        style={{
          width:          '100%',
          maxWidth:       1280,
          margin:         '0 auto',
          padding:        '0 20px',
          display:        'flex',
          justifyContent: 'center',
          alignItems:     'center',
          gap:            6,
          overflowX:      'auto',
        }}
      >
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              flexShrink:   0,
              padding:      '5px 15px',
              borderRadius: 9999,
              fontSize:     13,
              fontWeight:   500,
              whiteSpace:   'nowrap',
              border:       'none',
              cursor:       'pointer',
              background:   active === id ? '#0F4C81' : '#f1f5f9',
              color:        active === id ? '#fff'     : '#475569',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
