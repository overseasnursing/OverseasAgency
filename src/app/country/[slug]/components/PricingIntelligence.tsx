import React from 'react'
import { Info, AlertTriangle } from 'lucide-react'
import type { CountryDetail } from '@/types/countryDetail'

function formatL(rupees: number) {
  const l = rupees / 100000
  return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)}L`
}

function formatK(rupees: number) {
  if (rupees >= 100000) return formatL(rupees)
  return `₹${(rupees / 1000).toFixed(0)}K`
}

interface PricingIntelligenceProps {
  country: CountryDetail
}

export function PricingIntelligence({ country }: PricingIntelligenceProps) {
  const { pricing } = country

  const lineItems = [
    {
      label: 'Agency Fee',
      range: `${formatL(pricing.agencyFeeMin)} – ${formatL(pricing.agencyFeeMax)}`,
      colorDot: 'bg-primary',
      note: 'Includes documentation support, employer matching, visa filing',
    },
    ...pricing.examCosts.map((e) => ({
      label: e.exam,
      range: formatK(e.costINR),
      colorDot: 'bg-[#F59E0B]',
      note: undefined,
    })),
    {
      label: 'Visa / Immigration Fees',
      range: formatK(pricing.visaFeeINR),
      colorDot: 'bg-[#2563EB]',
      note: 'Embassy fees, VFS charges, biometrics',
    },
    {
      label: 'Relocation (Flight + Setup)',
      range: `${formatK(pricing.relocationMin)} – ${formatK(pricing.relocationMax)}`,
      colorDot: 'bg-[#22C55E]',
      note: 'Economy flight + initial luggage shipment',
    },
    {
      label: 'Accommodation Setup',
      range: `${formatK(pricing.accommodationSetupMin)} – ${formatK(pricing.accommodationSetupMax)}`,
      colorDot: 'bg-[#8B5CF6]',
      note: 'Security deposit + first-month rent (if not employer-covered)',
    },
  ]

  return (
    <section id="pricing" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Full Migration Cost Breakdown
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        Detailed cost intelligence for migrating to {country.name} as a nurse from India.
        All figures in Indian Rupees (INR), 2025 estimates.
      </p>

      {/* Total range hero */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 mb-5">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
          Estimated Total Migration Cost
        </p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[40px] font-bold text-slate-800 leading-none">
            {formatL(pricing.totalMin)}
          </span>
          <span className="text-[24px] font-bold text-slate-400">
            — {formatL(pricing.totalMax)}
          </span>
        </div>
        <p className="text-[13px] text-slate-400">Typical all-in cost for a single nurse</p>
      </div>

      {/* Line items */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5">
        {lineItems.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 px-5 py-4 ${i !== lineItems.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${item.colorDot} flex-shrink-0 mt-2`} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-slate-700">{item.label}</p>
              {item.note && (
                <p className="text-[12px] text-slate-400">{item.note}</p>
              )}
            </div>
            <p className="text-[14px] font-bold text-slate-800 flex-shrink-0">{item.range}</p>
          </div>
        ))}

        {/* Total row */}
        <div className="flex items-center gap-4 px-5 py-4 bg-[#F8FAFC] border-t-2 border-slate-200">
          <div className="flex-1">
            <p className="text-[15px] font-bold text-slate-800">Total (estimated)</p>
          </div>
          <p className="text-[16px] font-bold text-primary">
            {formatL(pricing.totalMin)} – {formatL(pricing.totalMax)}
          </p>
        </div>
      </div>

      {/* Warning about hidden charges */}
      <div className="flex items-start gap-3 p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl mb-4">
        <AlertTriangle size={15} className="text-[#92400E] flex-shrink-0 mt-0.5" />
        <p className="text-[13.5px] text-[#92400E] leading-relaxed">
          <span className="font-semibold">Always get a signed cost breakdown before paying any agency.</span>{' '}
          Legitimate agencies provide itemized quotes. Never pay large sums without a written agreement.
          Check scam reports on each agency profile before selecting.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
        <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-slate-500 leading-relaxed">
          {pricing.disclaimer}
        </p>
      </div>
    </section>
  )
}
