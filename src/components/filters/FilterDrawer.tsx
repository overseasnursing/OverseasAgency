'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { FilterSidebar } from './FilterSidebar'
import type { FilterState } from '@/types/agency'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onChange: (filters: FilterState) => void
  resultCount: number
}

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onChange,
  resultCount,
}: FilterDrawerProps) {
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — slides up from bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[24px] max-h-[90dvh] flex flex-col animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-label="Filter agencies"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-2 border-b border-slate-100 flex-shrink-0">
          <h4 className="text-[17px] font-bold text-slate-800">Filter Agencies</h4>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close filter drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable filter content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <FilterSidebar
            filters={filters}
            onChange={onChange}
            resultCount={resultCount}
          />
        </div>

        {/* Apply CTA */}
        <div className="px-5 pt-3 pb-6 border-t border-slate-100 flex-shrink-0 bg-white">
          <button
            onClick={onClose}
            className="w-full h-12 bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold rounded-xl transition-colors"
          >
            Show {resultCount} agenc{resultCount === 1 ? 'y' : 'ies'}
          </button>
        </div>
      </div>
    </>
  )
}
