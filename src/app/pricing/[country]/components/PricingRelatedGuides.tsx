import React from 'react'
import { Clock, ArrowRight } from 'lucide-react'
import type { PricingPageData, PricingRelatedGuide } from '@/types/pricingDetail'

const CATEGORY_COLORS: Record<PricingRelatedGuide['category'], { bg: string; text: string; label: string }> = {
  exam:       { bg: 'bg-[#DBEAFE]', text: 'text-[#1D4ED8]', label: 'Exam Guide' },
  salary:     { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', label: 'Salary' },
  visa:       { bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]', label: 'Visa' },
  process:    { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', label: 'Process' },
  comparison: { bg: 'bg-slate-100',  text: 'text-slate-600', label: 'Comparison' },
}

interface PricingRelatedGuidesProps {
  data: PricingPageData
}

export function PricingRelatedGuides({ data }: PricingRelatedGuidesProps) {
  if (data.relatedGuides.length === 0) return null

  return (
    <section aria-labelledby="pricing-guides-heading">
      <h2 id="pricing-guides-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Helpful Guides
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        Deep dives on exams, salaries, and visa processes for {data.countryName} nursing migration.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.relatedGuides.map((guide) => {
          const cat = CATEGORY_COLORS[guide.category]
          return (
            <a
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-card transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                  {cat.label}
                </span>
                <div className="flex items-center gap-1 text-[11.5px] text-slate-400">
                  <Clock size={11} />
                  {guide.readingTimeMinutes} min read
                </div>
              </div>
              <h3 className="text-[15px] font-semibold text-slate-800 mb-2 group-hover:text-primary transition-colors leading-snug">
                {guide.title}
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-3">
                {guide.description}
              </p>
              <div className="flex items-center gap-1 text-[12.5px] font-semibold text-primary">
                Read guide
                <ArrowRight size={12} />
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
