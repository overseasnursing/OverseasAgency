import React from 'react'
import { Shield } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { NavbarClient } from './NavbarClient'

const NAV_LINKS = [
  { href: '/countries',    label: 'Countries' },
  { href: '/agencies',     label: 'Agencies' },
  { href: '/mock-tests',   label: 'Mock Test' },
  { href: '/pricing',      label: 'Check Eligibility' },
  { href: '/reviews',      label: 'Reviews' },
  { href: '/scam-reports', label: 'Scam Reports' },
  { href: '/guides',       label: 'Guides' },
  { href: '/exam',         label: 'Exams' },
  { href: '/compare',      label: 'Compare' },
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
          <a
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="OverseasNursing — home"
          >
            <div className="w-8 h-8 bg-primary rounded-[9px] flex items-center justify-center">
              <Shield size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[16px] font-bold text-slate-800 group-hover:text-primary transition-colors">
              OverseasNursing
            </span>
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

          {/* For Agencies link (desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="/for-agencies"
              className="px-3 py-2 text-[13.5px] font-medium text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
            >
              For Agencies
            </a>
          </div>

          {/* Client island — owns all auth state */}
          <NavbarClient />
        </div>
      </Container>
    </nav>
  )
}
