'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

type FaqItem = { q: string; a: string }

export function ExamFaqSection({ faqs, examName }: { faqs: FaqItem[]; examName: string }) {
  // First item open by default so users immediately see an answer
  const [open, setOpen] = useState<number | null>(0)

  if (!faqs.length) return null

  return (
    <section className="mt-10" aria-label={`Frequently asked questions about ${examName}`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <HelpCircle size={16} className="text-primary" />
        </div>
        <h2 className="text-[18px] font-bold text-slate-800">
          Frequently Asked Questions — {examName}
        </h2>
      </div>

      <div className="flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
        {faqs.map((faq, i) => {
          const isOpen = open === i
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-[14px] font-semibold text-slate-800 leading-snug flex-1">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 mt-0.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Always in DOM — Google indexes it; CSS height controls visibility */}
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? '600px' : '0px' }}
                aria-hidden={!isOpen}
              >
                <div className="px-5 pb-5 pt-1">
                  <p className="text-[13.5px] text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
