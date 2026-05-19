'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/countries',    label: 'Countries' },
  { href: '/agencies',     label: 'Agencies' },
  { href: '/pricing',      label: 'Check Eligibility' },
  { href: '/reviews',      label: 'Reviews' },
  { href: '/scam-reports', label: 'Scam Reports' },
  { href: '/guides',       label: 'Guides' },
]

export function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* Scroll shadow overlay — positioned to cover the static nav border */}
      {scrolled && (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-[68px] z-40 pointer-events-none shadow-nav"
        />
      )}

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden absolute top-[68px] left-0 right-0 bg-white border-t border-b border-slate-100 shadow-card-md animate-fade-in z-30"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="max-w-content mx-auto px-5 sm:px-6 py-3 flex flex-col">
            {[...NAV_LINKS, { href: '/for-agencies', label: 'For Agencies' }].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center h-12 px-1 text-[15px] font-medium text-slate-700 hover:text-primary border-b border-slate-50 last:border-none transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="pt-4 pb-3">
              <a
                href="/auth/login"
                className="flex items-center justify-center w-full h-12 text-[14px] font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Sign in to your account
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
