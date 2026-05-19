import React from 'react'
import { Shield } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { NavbarClient } from './NavbarClient'

const NAV_LINKS = [
  { href: '/countries',    label: 'Countries' },
  { href: '/agencies',     label: 'Agencies' },
  { href: '/pricing',      label: 'Check Eligibility' },
  { href: '/reviews',      label: 'Reviews' },
  { href: '/scam-reports', label: 'Scam Reports' },
  { href: '/guides',       label: 'Guides' },
]

// Server component — static nav links are rendered to HTML, not hydrated.
// Only NavbarClient (scroll shadow + mobile toggle) hydrates on the client.
export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-40 bg-white border-b border-slate-100"
      aria-label="Main navigation"
    >
      <Container>
        <div className="flex items-center justify-between h-[68px] relative">

          {/* Logo — server-rendered, zero JS */}
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

          {/* Desktop links — server-rendered, zero JS */}
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

          {/* Desktop right actions — server-rendered */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="/for-agencies"
              className="px-3 py-2 text-[13.5px] font-medium text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
            >
              For Agencies
            </a>
            <a
              href="/auth/login"
              className="ml-1 inline-flex items-center px-4 py-2 text-[13px] font-semibold text-primary border border-primary/25 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              Sign in
            </a>
          </div>

          {/* Client island: scroll shadow overlay + mobile menu toggle */}
          <NavbarClient />
        </div>
      </Container>
    </nav>
  )
}
