import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  buildHref: (page: number) => string
  itemLabel?: string
}

function pageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const near = new Set([1, total, current, current - 1, current + 1].filter(p => p >= 1 && p <= total))
  const sorted = [...near].sort((a, b) => a - b)
  const result: (number | '…')[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && (sorted[i] as number) - (sorted[i - 1] as number) > 1) result.push('…')
    result.push(sorted[i])
  }
  return result
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  buildHref,
  itemLabel = 'items',
}: AdminPaginationProps) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * pageSize + 1
  const end   = Math.min(currentPage * pageSize, totalItems)
  const pages = pageNumbers(currentPage, totalPages)

  const btnBase = 'h-8 min-w-[32px] px-2 flex items-center justify-center rounded-lg border text-[13px] font-medium transition-colors'
  const btnActive = 'bg-primary border-primary text-white'
  const btnIdle   = 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
  const btnOff    = 'border-slate-100 text-slate-300 pointer-events-none cursor-not-allowed'

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-100 mt-2">
      <p className="text-[13px] text-slate-400">
        Showing {start}–{end} of {totalItems} {itemLabel}
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Link href={currentPage > 1 ? buildHref(currentPage - 1) : '#'} className={`${btnBase} ${currentPage === 1 ? btnOff : btnIdle}`} aria-label="Previous">
          <ChevronLeft size={14} />
        </Link>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className={`${btnBase} border-transparent text-slate-300 cursor-default`}>…</span>
          ) : (
            <Link key={p} href={buildHref(p as number)} className={`${btnBase} ${p === currentPage ? btnActive : btnIdle}`}>
              {p}
            </Link>
          )
        )}

        <Link href={currentPage < totalPages ? buildHref(currentPage + 1) : '#'} className={`${btnBase} ${currentPage === totalPages ? btnOff : btnIdle}`} aria-label="Next">
          <ChevronRight size={14} />
        </Link>
      </nav>
    </div>
  )
}
