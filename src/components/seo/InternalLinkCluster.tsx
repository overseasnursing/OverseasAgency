import React from 'react'
import { ArrowRight } from 'lucide-react'

export interface ClusterLink {
  href: string
  label: string
  description?: string
  badge?: string
  badgeColor?: string
}

interface InternalLinkClusterProps {
  heading: string
  links: ClusterLink[]
  columns?: 1 | 2 | 3
  compact?: boolean
}

export function InternalLinkCluster({
  heading,
  links,
  columns = 2,
  compact = false,
}: InternalLinkClusterProps) {
  if (links.length === 0) return null

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }[columns]

  return (
    <div>
      <h3 className={`font-bold text-slate-700 mb-3 ${compact ? 'text-[13px]' : 'text-[15px]'}`}>
        {heading}
      </h3>
      <div className={`grid ${gridClass} gap-2`}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`font-semibold text-slate-800 group-hover:text-primary transition-colors ${
                    compact ? 'text-[12.5px]' : 'text-[13.5px]'
                  }`}
                >
                  {link.label}
                </span>
                {link.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      link.badgeColor ?? 'text-primary bg-primary/10'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </div>
              {link.description && !compact && (
                <p className="text-[12px] text-slate-400 mt-0.5 leading-snug line-clamp-1">
                  {link.description}
                </p>
              )}
            </div>
            <ArrowRight
              size={13}
              className="text-slate-300 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5"
            />
          </a>
        ))}
      </div>
    </div>
  )
}
