import React from 'react'
import { ArrowRight } from 'lucide-react'
import { getAllPricingData } from '@/lib/data/pricing'
import type { PricingPageData } from '@/types/pricingDetail'
import { FlagIcon } from '@/components/ui/FlagIcon'

function formatL(rupees: number) {
  return `₹${(rupees / 100000).toFixed(1)}L`
}

interface RelatedCountryPricingProps {
  data: PricingPageData
}

export function RelatedCountryPricing({ data }: RelatedCountryPricingProps) {
  const all = getAllPricingData()
  const related = data.relatedCountrySlugs
    .map((slug) => all.find((p) => p.countrySlug === slug))
    .filter(Boolean) as PricingPageData[]

  if (related.length === 0) return null

  return (
    <section aria-labelledby="related-pricing-heading">
      <h2 id="related-pricing-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Compare Migration Costs
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        See how {data.countryName} costs compare to other popular nursing destinations from India.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((c) => (
          <a
            key={c.countrySlug}
            href={`/pricing/${c.countrySlug}`}
            className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-card-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <FlagIcon emoji={c.flag} size={32} className="rounded-sm" />
              <div>
                <p className="text-[15px] font-semibold text-slate-800 group-hover:text-primary transition-colors">
                  {c.countryName}
                </p>
                <p className="text-[12px] text-slate-400">Migration Costs</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">Minimum</span>
                <span className="font-semibold text-slate-700">{formatL(c.totalMin)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">Maximum</span>
                <span className="font-semibold text-slate-700">{formatL(c.totalMax)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">Typical spend</span>
                <span className="font-bold text-primary">{formatL(c.totalTypical)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[12.5px] font-semibold text-primary">
              See full breakdown
              <ArrowRight size={12} />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
