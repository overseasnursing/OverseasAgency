import React from 'react'
import { CheckCircle, XCircle, ShieldAlert, AlertTriangle, ArrowRight, Star } from 'lucide-react'
import type { PricingPageData, AgencyPricingRow } from '@/types/pricingDetail'

function formatL(rupees: number) {
  return `₹${(rupees / 100000).toFixed(1)}L`
}

function TrustBadge({ level }: { level: AgencyPricingRow['trustLevel'] }) {
  if (level === 'verified')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[11px] font-semibold rounded-full"><CheckCircle size={9} />Verified</span>
  if (level === 'trusted')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DBEAFE] text-[#1D4ED8] text-[11px] font-semibold rounded-full"><CheckCircle size={9} />Trusted</span>
  if (level === 'scam-reported')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-semibold rounded-full"><ShieldAlert size={9} />Scam Reported</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] font-semibold rounded-full">Unverified</span>
}

function TransparencyBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-[#22C55E]' : score >= 65 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
  const textColor = score >= 80 ? 'text-[#166534]' : score >= 65 ? 'text-[#92400E]' : 'text-[#B91C1C]'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[12px] font-semibold ${textColor} tabular-nums w-8 text-right`}>{score}</span>
    </div>
  )
}

interface AgencyFeeTableProps {
  data: PricingPageData
}

export function AgencyFeeTable({ data }: AgencyFeeTableProps) {
  const sorted = [...data.agencyComparison].sort((a, b) => {
    const order = { verified: 0, trusted: 1, unverified: 2, 'scam-reported': 3 }
    return order[a.trustLevel] - order[b.trustLevel]
  })

  return (
    <section id="agencies" aria-labelledby="agency-table-heading">
      <h2 id="agency-table-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Agency Fee Comparison
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        Side-by-side comparison of agencies offering {data.countryName} nurse migration services.
        Sorted by trust level. Always verify with each agency before signing.
      </p>

      <div className="flex flex-col gap-4">
        {sorted.map((agency) => (
          <div
            key={agency.slug}
            className={`bg-white border rounded-2xl p-5 ${
              agency.trustLevel === 'scam-reported'
                ? 'border-[#FECACA]'
                : agency.hiddenChargesReported > 0
                ? 'border-[#FDE68A]'
                : 'border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h3 className="text-[15px] font-semibold text-slate-800">{agency.name}</h3>
                  <TrustBadge level={agency.trustLevel} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" />
                  <span className="text-[12.5px] font-semibold text-slate-700">{agency.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-right sm:text-left flex-shrink-0">
                <p className="text-[12px] text-slate-400 uppercase tracking-wide font-medium mb-0.5">Agency Fee</p>
                <p className="text-[20px] font-bold text-slate-800">
                  {formatL(agency.feeMin)}–{formatL(agency.feeMax)}
                </p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

              {/* Installment */}
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium mb-1">Installment</p>
                <div className="flex items-center gap-1.5">
                  {agency.installmentAvailable ? (
                    <>
                      <CheckCircle size={13} className="text-[#22C55E]" />
                      <span className="text-[13px] font-semibold text-slate-700">Available</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={13} className="text-slate-300" />
                      <span className="text-[13px] text-slate-500">Not offered</span>
                    </>
                  )}
                </div>
                {agency.installmentNote && (
                  <p className="text-[11.5px] text-slate-400 mt-0.5">{agency.installmentNote}</p>
                )}
              </div>

              {/* Hidden charges */}
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium mb-1">Hidden Charges</p>
                <div className="flex items-center gap-1.5">
                  {agency.hiddenChargesReported === 0 ? (
                    <>
                      <CheckCircle size={13} className="text-[#22C55E]" />
                      <span className="text-[13px] font-semibold text-[#166534]">None reported</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={13} className="text-[#92400E]" />
                      <span className="text-[13px] font-semibold text-[#92400E]">{agency.hiddenChargesReported} reported</span>
                    </>
                  )}
                </div>
              </div>

              {/* Transparency score */}
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium mb-1.5">Transparency Score</p>
                <TransparencyBar score={agency.transparencyScore} />
              </div>
            </div>

            {/* Included services */}
            <div className="mb-4">
              <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium mb-2">What&apos;s Included</p>
              <div className="flex flex-wrap gap-2">
                {agency.includedServices.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[12px] text-slate-600 bg-[#F8FAFC] px-2.5 py-1 rounded-lg">
                    <CheckCircle size={10} className="text-[#22C55E]" />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={`/agency/${agency.slug}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
            >
              View full profile & reviews
              <ArrowRight size={13} />
            </a>
          </div>
        ))}
      </div>

      <p className="text-[12.5px] text-slate-400 mt-4">
        Agency fees are self-reported and verified against nurse reviews. Always request a written itemized quote
        before signing. Compare at least 3 agencies before deciding.
      </p>
    </section>
  )
}
