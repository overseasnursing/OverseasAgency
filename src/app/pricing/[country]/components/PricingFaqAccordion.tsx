'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { PricingFAQ } from '@/types/pricingDetail'

function FaqItem({ faq, index }: { faq: PricingFAQ; index: number }) {
  const [open, setOpen] = useState(false)
  const id = `pricing-faq-${index}`

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#F8FAFC] transition-colors"
      >
        <span className="text-[15px] font-semibold text-slate-800 leading-snug">
          {faq.question}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div id={id} role="region" aria-label={faq.question}>
          <p className="px-5 pb-5 text-[14px] text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  )
}

interface PricingFaqAccordionProps {
  faqs: PricingFAQ[]
  countryName: string
}

export function PricingFaqAccordion({ faqs, countryName }: PricingFaqAccordionProps) {
  if (faqs.length === 0) return null

  return (
    <section aria-labelledby="pricing-faq-heading">
      <h2 id="pricing-faq-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Pricing FAQs
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        The most common questions about {countryName} nursing migration costs.
      </p>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <FaqItem key={i} faq={faq} index={i} />
        ))}
      </div>
    </section>
  )
}
