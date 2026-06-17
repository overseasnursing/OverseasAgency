'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '@/lib/data/getMockTestContent'

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-[14px] font-semibold text-slate-800 pr-4 leading-snug">
                {faq.q}
              </span>
              <ChevronDown
                size={16}
                className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Always in DOM — Google indexes it; CSS height controls visibility */}
            <div
              className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? '600px' : '0px' }}
              aria-hidden={!isOpen}
            >
              <div className="px-5 pb-5 text-[13.5px] text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                {faq.a}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
