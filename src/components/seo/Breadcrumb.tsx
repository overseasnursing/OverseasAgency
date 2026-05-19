import React from 'react'
import { ChevronRight } from 'lucide-react'
import type { BreadcrumbItem } from '@/lib/seo/schemas'
import { buildBreadcrumbSchema } from '@/lib/seo/schemas'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const schema = buildBreadcrumbSchema(items)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-1 text-[12.5px] text-slate-400">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={item.href} className="flex items-center gap-1">
                {isLast ? (
                  <span className="text-slate-600 font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <a href={item.href} className="hover:text-slate-600 transition-colors">
                      {item.name}
                    </a>
                    <ChevronRight size={12} className="flex-shrink-0" />
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
