import React from 'react'
import { Info } from 'lucide-react'
import { CATEGORY_META } from '@/types/pricingDetail'
import type { PricingPageData } from '@/types/pricingDetail'

function formatK(rupees: number) {
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`
  return `₹${Math.round(rupees / 1000)}K`
}

interface TotalCostBreakdownProps {
  data: PricingPageData
}

export function TotalCostBreakdown({ data }: TotalCostBreakdownProps) {
  const absoluteMax = data.totalMax

  // Group items by whether they are same category consecutively
  const required = data.costLineItems.filter((i) => !i.optional)
  const optional = data.costLineItems.filter((i) => i.optional)

  const allItems = [...required, ...optional]

  return (
    <section id="breakdown" aria-labelledby="breakdown-heading">
      <h2 id="breakdown-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Full Cost Breakdown
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        Every cost involved in migrating to {data.countryName} as a nurse from India.
        Bar width shows the size of each cost relative to the total.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {(Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[])
          .filter((cat) => data.costLineItems.some((i) => i.category === cat))
          .map((cat) => {
            const m = CATEGORY_META[cat]
            return (
              <div key={cat} className="flex items-center gap-1.5 text-[12px] text-slate-500">
                <div className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                {m.label}
              </div>
            )
          })}
      </div>

      {/* Breakdown rows */}
      <div className="flex flex-col gap-2 mb-4">
        {allItems.map((item, i) => {
          const meta = CATEGORY_META[item.category]
          const barPct = Math.round((item.max / absoluteMax) * 100)
          const minBarPct = Math.round((item.min / absoluteMax) * 100)

          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.color}`} />
                  <span className="text-[13.5px] font-medium text-slate-700 truncate">
                    {item.label}
                    {item.optional && (
                      <span className="ml-1.5 text-[11px] text-slate-400 font-normal">(optional)</span>
                    )}
                  </span>
                </div>
                <span className="text-[13.5px] font-bold text-slate-800 flex-shrink-0 tabular-nums">
                  {item.min === item.max
                    ? formatK(item.min)
                    : `${formatK(item.min)}–${formatK(item.max)}`}
                </span>
              </div>

              {/* Bar track */}
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                {/* Min bar */}
                <div
                  className={`absolute left-0 top-0 h-full rounded-full opacity-30 ${meta.color}`}
                  style={{ width: `${minBarPct}%` }}
                />
                {/* Max bar */}
                <div
                  className={`absolute left-0 top-0 h-full rounded-full ${meta.color}`}
                  style={{ width: `${barPct}%` }}
                />
              </div>

              {item.notes && (
                <p className="text-[12px] text-slate-400 mt-1.5">{item.notes}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Total row */}
      <div className="bg-[#F8FAFC] border-2 border-primary/20 rounded-xl px-5 py-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-[15px] font-bold text-slate-800">Total Migration Cost</span>
          <span className="text-[17px] font-bold text-primary tabular-nums">
            {formatK(data.totalMin)} – {formatK(data.totalMax)}
          </span>
        </div>
        {/* Full bar */}
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full w-full bg-primary rounded-full" />
        </div>
        <p className="text-[12.5px] text-slate-500 mt-2">
          Typical all-in cost:{' '}
          <span className="font-semibold text-slate-700">{formatK(data.totalTypical)}</span>
          {' '}· Includes required items only
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 mt-4 p-4 bg-white border border-slate-200 rounded-xl">
        <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-slate-500 leading-relaxed">
          Estimates based on 2025 market data. Agency fees vary by provider. Exchange-rate-linked
          government fees (visa, embassy) change periodically. Optional items may become required
          depending on your specific case. Always obtain an itemized written quote from your agency.
        </p>
      </div>
    </section>
  )
}
