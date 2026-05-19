import React from 'react'
import { AlertTriangle, ShieldAlert, Lightbulb } from 'lucide-react'
import type { PricingPageData } from '@/types/pricingDetail'

interface HiddenChargesWarningProps {
  data: PricingPageData
}

export function HiddenChargesWarning({ data }: HiddenChargesWarningProps) {
  const critical = data.hiddenChargePatterns.filter((h) => h.severity === 'critical')
  const warnings = data.hiddenChargePatterns.filter((h) => h.severity === 'warning')

  return (
    <section aria-labelledby="hidden-heading">
      <h2 id="hidden-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Hidden Charges to Watch For
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        Common costs that agencies exclude from their headline fee or fail to disclose upfront.
        Based on reports from nurses who migrated to {data.countryName}.
      </p>

      {/* Critical section */}
      {critical.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={16} className="text-[#B91C1C]" />
            <p className="text-[13px] font-bold text-[#B91C1C] uppercase tracking-wide">
              Critical — Most Common Surprises
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {critical.map((charge, i) => (
              <div key={i} className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-5">
                <h3 className="text-[15px] font-semibold text-[#B91C1C] mb-2">{charge.title}</h3>
                <p className="text-[13.5px] text-[#B91C1C]/80 leading-relaxed mb-3">{charge.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#FEE2E2] rounded-lg px-3 py-1.5">
                    <AlertTriangle size={12} className="text-[#B91C1C]" />
                    <span className="text-[12px] font-semibold text-[#B91C1C]">
                      Typical extra cost: {charge.typicalAmount}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[12.5px] text-[#B91C1C]/70">
                    <Lightbulb size={12} className="flex-shrink-0 mt-0.5" />
                    <span>{charge.howToAvoid}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning section */}
      {warnings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-[#92400E]" />
            <p className="text-[13px] font-bold text-[#92400E] uppercase tracking-wide">
              Common Add-Ons Often Not Disclosed
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {warnings.map((charge, i) => (
              <div key={i} className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-5">
                <h3 className="text-[15px] font-semibold text-[#92400E] mb-2">{charge.title}</h3>
                <p className="text-[13.5px] text-[#92400E]/80 leading-relaxed mb-3">{charge.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#FDE68A]/60 rounded-lg px-3 py-1.5">
                    <span className="text-[12px] font-semibold text-[#92400E]">
                      Typical: {charge.typicalAmount}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[12.5px] text-[#92400E]/70">
                    <Lightbulb size={12} className="flex-shrink-0 mt-0.5" />
                    <span>{charge.howToAvoid}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Always-present tip box */}
      <div className="mt-5 flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl">
        <ShieldAlert size={16} className="text-[#1D4ED8] flex-shrink-0 mt-0.5" />
        <p className="text-[13.5px] text-[#1D4ED8] leading-relaxed">
          <span className="font-semibold">The golden rule:</span>{' '}
          Any cost that cannot be explained with a specific, named service and a written receipt is a red flag.
          Before paying anything, ask: &ldquo;What exactly am I paying for, and can you show me the government fee
          schedule or service specification for this charge?&rdquo;
        </p>
      </div>
    </section>
  )
}
