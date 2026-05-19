import React from 'react'
import { CheckCircle, MapPin, Quote } from 'lucide-react'
import type { PricingPageData } from '@/types/pricingDetail'

function formatL(rupees: number) {
  return `₹${(rupees / 100000).toFixed(1)}L`
}

function ExpectedVsActual({ expected, actual }: { expected: number; actual: number }) {
  const diff = actual - expected
  const isOver = diff > 0
  const maxVal = Math.max(expected, actual)

  return (
    <div className="bg-[#F8FAFC] rounded-xl p-4 mb-4">
      <div className="flex flex-col gap-3">
        {/* Expected */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] text-slate-400 font-medium uppercase tracking-wide">Expected</span>
            <span className="text-[13px] font-semibold text-slate-600">{formatL(expected)}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-400 rounded-full"
              style={{ width: `${(expected / maxVal) * 100}%` }}
            />
          </div>
        </div>

        {/* Actual */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-medium uppercase tracking-wide text-slate-500">Actually Paid</span>
            <span className={`text-[13px] font-bold ${isOver ? 'text-[#B91C1C]' : 'text-[#166534]'}`}>
              {formatL(actual)}
            </span>
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isOver ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`}
              style={{ width: `${(actual / maxVal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-1.5 mt-3 text-[12.5px] font-semibold ${isOver ? 'text-[#B91C1C]' : 'text-[#166534]'}`}>
        {isOver ? (
          <span>↑ {formatL(Math.abs(diff))} more than expected</span>
        ) : (
          <>
            <CheckCircle size={12} />
            <span>{formatL(Math.abs(diff))} under budget</span>
          </>
        )}
      </div>
    </div>
  )
}

interface NurseCostExperiencesProps {
  data: PricingPageData
}

export function NurseCostExperiences({ data }: NurseCostExperiencesProps) {
  if (data.nurseCostExperiences.length === 0) return null

  return (
    <section aria-labelledby="experiences-heading">
      <h2 id="experiences-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        What Nurses Actually Paid
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        First-hand financial experiences from Indian nurses who migrated to {data.countryName}.
        Expected vs actual costs — including the surprises.
      </p>

      <div className="flex flex-col gap-6">
        {data.nurseCostExperiences.map((exp) => (
          <article key={exp.id} className="bg-white border border-slate-200 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] font-bold text-primary">{exp.authorInitials}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-semibold text-slate-800">{exp.authorName}</span>
                  {exp.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534]">
                      <CheckCircle size={10} />
                      Verified experience
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-slate-400">
                  <span>{exp.authorFrom}</span>
                  <span>·</span>
                  <MapPin size={11} />
                  <span>{exp.destinationCity}</span>
                  <span>·</span>
                  <span>{exp.timelineMonths} months total</span>
                  <span>·</span>
                  <span>{exp.date}</span>
                </div>
              </div>
            </div>

            {/* Expected vs Actual */}
            <ExpectedVsActual expected={exp.expectedCostINR} actual={exp.actualCostINR} />

            {/* Quote */}
            <div className="flex items-start gap-3 mb-4">
              <Quote size={16} className="text-slate-300 flex-shrink-0 mt-0.5" />
              <p className="text-[13.5px] text-slate-600 leading-relaxed italic">
                {exp.quote}
              </p>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-3">
                <p className="text-[11px] font-semibold text-[#92400E] uppercase tracking-wide mb-1">
                  Biggest Financial Surprise
                </p>
                <p className="text-[13px] text-[#92400E] leading-relaxed">{exp.biggestSurprise}</p>
              </div>
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3">
                <p className="text-[11px] font-semibold text-[#1D4ED8] uppercase tracking-wide mb-1">
                  Advice for Future Nurses
                </p>
                <p className="text-[13px] text-[#1D4ED8] leading-relaxed">{exp.advice}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
