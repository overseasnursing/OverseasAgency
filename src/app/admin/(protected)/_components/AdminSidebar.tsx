'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import {
  Shield, LayoutDashboard, Building2, Star, ShieldAlert,
  LogOut, ExternalLink, ClipboardList, Settings, Users, MessageSquare, BadgeCheck, BookOpen, Briefcase, FileText,
} from 'lucide-react'
import type { AdminPermission } from '@/lib/require-admin'

type NavItem = {
  href:       string
  label:      string
  Icon:       React.ElementType
  exact:      boolean
  permission: AdminPermission | null  // null = always visible (Dashboard, Employees for super admin)
  superOnly:  boolean                 // true = only shown to super admin
}

const NAV: NavItem[] = [
  { href: '/admin',                    label: 'Dashboard',     Icon: LayoutDashboard, exact: true,  permission: null,          superOnly: false },
  { href: '/admin/agencies',           label: 'Agencies',      Icon: Building2,       exact: false, permission: 'agencies',    superOnly: false },
  { href: '/admin/reviews',            label: 'Agency Reviews',Icon: Star,            exact: false, permission: 'reviews',     superOnly: false },
  { href: '/admin/mock-test-reviews',  label: 'Exam Reviews',  Icon: MessageSquare,   exact: false, permission: 'mock-tests',  superOnly: false },
  { href: '/admin/scam-reports',       label: 'Scam Reports',  Icon: ShieldAlert,     exact: false, permission: 'scam-reports',superOnly: false },
  { href: '/admin/mock-tests',         label: 'Mock Tests',    Icon: ClipboardList,   exact: false, permission: 'mock-tests',  superOnly: false },
  { href: '/admin/agency-submissions',  label: 'New Agencies',  Icon: Building2,       exact: false, permission: 'agencies',    superOnly: false },
  { href: '/admin/claim-listings',      label: 'Claim Requests',Icon: BadgeCheck,      exact: false, permission: 'claim-listings', superOnly: false },
  { href: '/admin/blogs',               label: 'Blog Posts',    Icon: BookOpen,        exact: false, permission: 'blogs',          superOnly: false },
  { href: '/admin/jobs',               label: 'Jobs',          Icon: Briefcase,       exact: false, permission: 'jobs',         superOnly: false },
  { href: '/admin/applications',       label: 'Applications',  Icon: FileText,        exact: false, permission: 'applications', superOnly: false },
  { href: '/admin/settings',           label: 'Settings',      Icon: Settings,        exact: false, permission: 'settings',     superOnly: false },
  { href: '/admin/employees',          label: 'Employees',     Icon: Users,           exact: false, permission: null,          superOnly: true  },
  { href: '/admin/users',              label: 'All Users',     Icon: Users,           exact: false, permission: null,          superOnly: true  },
]

type Props = {
  email:        string
  name:         string | null
  isSuperAdmin: boolean
  permissions:  AdminPermission[] | null
  badges:       Record<string, number>
}

export function AdminSidebar({ email, name, isSuperAdmin, permissions, badges }: Props) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  function canSee(item: NavItem): boolean {
    if (item.superOnly) return isSuperAdmin
    if (item.permission === null) return true          // always visible (Dashboard)
    if (isSuperAdmin) return true                      // super admin sees everything
    return permissions?.includes(item.permission) ?? false
  }

  const visibleNav = NAV.filter(canSee)

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
        {visibleNav.map(({ href, label, Icon, exact }) => {
          const active = isActive(href, exact)
          const badge  = badges[href] ?? 0
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
              {badge > 0 && (
                <span className={[
                  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10.5px] font-bold leading-none flex-shrink-0',
                  active ? 'bg-white/25 text-white' : 'bg-[#EF4444] text-white',
                ].join(' ')}>
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
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
              {(name ?? email ?? '?').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            {name && <p className="text-[12px] font-semibold text-slate-700 truncate leading-tight">{name}</p>}
            <p className="text-[11px] text-slate-400 truncate">{email}</p>
          </div>
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
