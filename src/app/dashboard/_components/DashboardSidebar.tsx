'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Briefcase, Star, AlertTriangle, LogOut, Compass,
} from 'lucide-react'

type NavItem = {
  href:  string
  label: string
  Icon:  React.ElementType
  exact: boolean
}

const NAV: NavItem[] = [
  { href: '/dashboard',              label: 'Overview',        Icon: LayoutDashboard, exact: true  },
  { href: '/dashboard/mock-tests',   label: 'Mock Tests',       Icon: BookOpen,        exact: false },
  { href: '/dashboard/applications', label: 'My Applications',  Icon: Briefcase,       exact: false },
  { href: '/dashboard/reviews',      label: 'My Reviews',       Icon: Star,            exact: false },
  { href: '/dashboard/scam-reports', label: 'My Scam Reports',  Icon: AlertTriangle,   exact: false },
]

type Props = {
  name:  string
  email: string
}

export function DashboardSidebar({ name, email }: Props) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside className="w-[220px] flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-full overflow-y-auto">

      {/* ── Brand ── */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-100">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-primary rounded-[9px] flex items-center justify-center flex-shrink-0">
            <Compass size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
              OverseasNursing
            </p>
            <p className="text-[10.5px] text-slate-400 font-medium leading-tight mt-0.5">My Account</p>
          </div>
        </a>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5" aria-label="Dashboard navigation">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</p>
        {NAV.map(({ href, label, Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <a
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 h-9 px-3 rounded-xl text-[13px] font-medium transition-all',
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              ].join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 2} />
              <span className="flex-1 truncate">{label}</span>
            </a>
          )
        })}
      </nav>

      {/* ── User / Sign out ── */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-3 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-primary">
              {(name || email || '?').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            {name && <p className="text-[12px] font-semibold text-slate-700 truncate leading-tight">{name}</p>}
            <p className="text-[11px] text-slate-400 truncate">{email}</p>
          </div>
        </div>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 h-9 px-3 w-full rounded-xl text-[13px] font-medium text-[#B91C1C] hover:bg-red-50 transition-all"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </form>
      </div>

    </aside>
  )
}
