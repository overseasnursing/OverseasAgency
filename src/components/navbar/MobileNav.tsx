'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ShieldAlert, Home, Building2, Star, BookOpen } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; fill?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { href: '/',             label: 'Home',     Icon: Home       },
  { href: '/agencies',     label: 'Agencies', Icon: Building2  },
  { href: '/reviews',      label: 'Reviews',  Icon: Star       },
  { href: '/guides',       label: 'Guides',   Icon: BookOpen   },
  { href: '/scam-reports', label: 'Scams',    Icon: ShieldAlert },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile navigation"
    >
      <div className="flex h-[72px]">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href
          return (
            <a
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              className="flex-1 flex flex-col items-center justify-center gap-1 relative"
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2.5px] bg-primary rounded-full"
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.75}
                className={isActive ? 'text-primary' : 'text-slate-400'}
                fill={isActive && label === 'Reviews' ? '#0F4C81' : 'none'}
              />
              <span className={`text-[10.5px] leading-none ${isActive ? 'font-semibold text-primary' : 'font-medium text-slate-400'}`}>
                {label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
