import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, CreditCard } from 'lucide-react'
import type { AgencyDetail } from '@/types/agencyDetail'
import { getCurrencySymbol } from '@/lib/data/countryList'

function formatLakhs(amount: number, currencySymbol: string) {
  const lakhs = amount / 100000
  return `${currencySymbol}${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`
}

interface PricingSectionProps {
  agency: AgencyDetail
}

export function PricingSection({ agency }: PricingSectionProps) {
  const { pricing } = agency
  const hasHiddenChargeWarning = agency.hiddenChargesReported > 0
  const currencySymbol = getCurrencySymbol(agency.sourceCountry)

  return (
    <section id="pricing" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading" className="text-[22px] font-bold text-slate-800 mb-6">
        {agency.name} Fees &amp; Pricing
      </h2>

      {/* Price display */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Total Agency Fee
            </p>

            {pricing.isFree ? (
              /* ── Free placement display ── */
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-[40px] font-bold text-[#16A34A] leading-none">
                    Free Placement
                  </span>
                </div>
                {pricing.freeNote && (
                  <p className="text-[13px] text-slate-500 mt-2 leading-relaxed max-w-prose">
                    {pricing.freeNote}
                  </p>
                )}
              </>
            ) : (
              /* ── Normal price display ── */
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-[40px] font-bold text-slate-800 leading-none">
                    {formatLakhs(pricing.minCost, currencySymbol)}
                  </span>
                  <span className="text-[24px] font-bold text-slate-400">
                    — {formatLakhs(pricing.maxCost, currencySymbol)}
                  </span>
                </div>
                {pricing.isApproximate && (
                  <p className="text-[13px] text-slate-400 mt-1">Approximate — final fee varies by case</p>
                )}
              </>
            )}
          </div>

          {!pricing.isFree && pricing.installmentAvailable && (
            <div className="sm:ml-auto flex items-center gap-2 px-4 py-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl">
              <CreditCard size={16} className="text-[#1D4ED8]" />
              <span className="text-[13px] font-semibold text-[#1D4ED8]">Installment Available</span>
            </div>
          )}
        </div>

        {!pricing.isFree && pricing.installmentAvailable && pricing.installmentNote && (
          <p className="text-[13.5px] text-slate-500 border-t border-slate-200 pt-4">
            <span className="font-semibold text-slate-700">Payment plan:</span>{' '}
            {pricing.installmentNote}
          </p>
        )}
      </div>

      {/* Hidden charge warning */}
      {hasHiddenChargeWarning && (
        <div className="flex items-start gap-3 p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl mb-5">
          <AlertTriangle size={16} className="text-[#92400E] flex-shrink-0 mt-0.5" />
          <p className="text-[13.5px] text-[#92400E] leading-relaxed">
            <span className="font-semibold">
              {agency.hiddenChargesReported} hidden charge{agency.hiddenChargesReported > 1 ? 's' : ''} reported
            </span>{' '}
            by nurses who used this agency. Review reports carefully before paying.
          </p>
        </div>
      )}

      {/* Included / Excluded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Included */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
            <CheckCircle size={15} className="text-[#22C55E]" />
            What&apos;s Included
          </h3>
          <ul className="space-y-3">
            {pricing.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle
                  size={14}
                  className="text-[#22C55E] flex-shrink-0 mt-0.5"
                  strokeWidth={2.5}
                />
                <span className="text-[13.5px] text-slate-600 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Excluded */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
            <XCircle size={15} className="text-[#EF4444]" />
            Not Included
          </h3>
          <ul className="space-y-3">
            {pricing.excludes.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <XCircle
                  size={14}
                  className="text-slate-300 flex-shrink-0 mt-0.5"
                  strokeWidth={2.5}
                />
                <span className="text-[13.5px] text-slate-500 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
        <Info size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-slate-500 leading-relaxed whitespace-pre-wrap">
          {pricing.disclaimer}{' '}
          <span className="text-slate-400">Last updated: {pricing.lastUpdated}.</span>
        </p>
      </div>
    </section>
  )
}
