'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import {
  Shield, LayoutDashboard, Building2, Star, ShieldAlert, LogOut, ExternalLink, ClipboardList, Settings,
} from 'lucide-react'

const NAV = [
  { href: '/admin',              label: 'Dashboard',    Icon: LayoutDashboard, exact: true  },
  { href: '/admin/agencies',     label: 'Agencies',     Icon: Building2,       exact: false },
  { href: '/admin/reviews',      label: 'Reviews',      Icon: Star,            exact: false },
  { href: '/admin/scam-reports', label: 'Scam Reports', Icon: ShieldAlert,     exact: false },
  { href: '/admin/mock-tests',   label: 'Mock Tests',   Icon: ClipboardList,   exact: false },
  { href: '/admin/settings',     label: 'Settings',     Icon: Settings,        exact: false },
]

export function AdminSidebar({ email }: { email: string }) {
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
            <Shield size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
              OverseasNursing
            </p>
            <p className="text-[10.5px] text-slate-400 font-medium leading-tight mt-0.5">Admin Panel</p>
          </div>
        </a>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5" aria-label="Admin navigation">
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
              {label}
            </a>
          )
        })}

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Site</p>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 h-9 px-3 rounded-xl text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <ExternalLink size={15} strokeWidth={2} />
            View site
          </a>
        </div>
      </nav>

      {/* ── User / Sign out ── */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-3 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-primary">
              {email.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500 truncate">{email}</p>
        </div>
        <form action="/api/admin/logout" method="POST">
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
