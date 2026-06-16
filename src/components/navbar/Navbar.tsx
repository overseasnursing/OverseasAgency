import React from 'react'
import { Container } from '@/components/layout/Container'
import { NavbarClient } from './NavbarClient'

const NAV_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/agencies',     label: 'Agencies' },
  { href: '/jobs',         label: 'Jobs' },
  { href: '/mock-tests',   label: 'Mock Test' },
  { href: '/eligibility',  label: 'Check Eligibility' },
  { href: '/scam-reports', label: 'Scam Report' },
  { href: '/countries',    label: 'Countries' },
  { href: '/exam',         label: 'Exams' },
]

export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-40 bg-white border-b border-slate-100"
      aria-label="Main navigation"
    >
      <Container>
        <div className="flex items-center justify-between h-[68px] relative">

          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0" aria-label="OverseasNursing — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="OverseasNursing" className="h-10 w-auto" />
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5" role="navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-3 py-2 text-[13.5px] font-medium text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Client island — owns all auth state */}
          <NavbarClient />
        </div>
      </Container>
    </nav>
  )
}
