import React from 'react'
import { Star, CheckCircle, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react'
import { MOCK_AGENCIES } from '@/lib/data/agencies'
import type { CountryDetail } from '@/types/countryDetail'

interface TopAgenciesSectionProps {
  country: CountryDetail
}

export function TopAgenciesSection({ country }: TopAgenciesSectionProps) {
  const agencies = country.featuredAgencySlugs
    .map((slug) => MOCK_AGENCIES.find((a) => a.slug === slug))
    .filter(Boolean) as typeof MOCK_AGENCIES

  const verified = agencies.filter((a) => a.trustLevel !== 'scam-reported')

  if (verified.length === 0) return null

  return (
    <section id="agencies" aria-labelledby="agencies-heading">
      <div className="flex items-center justify-between mb-2">
        <h2 id="agencies-heading" className="text-[22px] font-bold text-slate-800">
          Top Agencies for {country.name}
        </h2>
        <a
          href="/agencies"
          className="text-[13.5px] font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          View all agencies →
        </a>
      </div>
      <p className="text-[14px] text-slate-500 mb-6">
        Agencies with verified placements and transparent pricing for {country.name} nursing migration.
      </p>

      <div className="flex flex-col gap-4">
        {verified.map((agency) => {
          const initials = agency.name.split(' ').slice(0, 2).map((w) => w[0]).join('')
          const hasHiddenCharges = agency.hiddenChargesReported > 0

          return (
            <a
              key={agency.slug}
              href={`/agency/${agency.slug}`}
              className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-card-md transition-all flex flex-col sm:flex-row sm:items-center gap-5"
            >
              {/* Logo + name */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[15px] font-bold text-primary">{initials}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <p className="text-[15px] font-semibold text-slate-800 group-hover:text-primary transition-colors">
                      {agency.name}
                    </p>
                    {agency.trustLevel === 'verified' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[11px] font-semibold rounded-full">
                        <CheckCircle size={9} />
                        Verified
                      </span>
                    )}
                    {agency.trustLevel === 'scam-reported' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-semibold rounded-full">
                        <ShieldAlert size={9} />
                        Scam Reported
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-slate-400">{agency.city}, {agency.state}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-6 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Star size={13} fill="#F59E0B" className="text-[#F59E0B]" />
                  <span className="text-[13.5px] font-bold text-slate-700">{agency.rating.toFixed(1)}</span>
                  <span className="text-[12px] text-slate-400">({agency.reviewCount})</span>
                </div>
                <div className="text-[13.5px]">
                  <span className="text-slate-400">Fee: </span>
                  <span className="font-semibold text-slate-700">₹{agency.pricing.minLakhs}–{agency.pricing.maxLakhs}L</span>
                </div>
                <div className="text-[13.5px]">
                  <span className="text-slate-400">Placed: </span>
                  <span className="font-semibold text-slate-700">{agency.placementCount.toLocaleString()}+</span>
                </div>
                {hasHiddenCharges && (
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#92400E]">
                    <AlertTriangle size={11} />
                    {agency.hiddenChargesReported} hidden charges reported
                  </span>
                )}
                <div className="flex items-center gap-1 text-[13px] font-semibold text-primary">
                  View profile
                  <ArrowRight size={13} />
                </div>
              </div>
            </a>
          )
        })}
      </div>

      <div className="mt-5 text-center">
        <a
          href={`/agencies?country=${country.name}`}
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 hover:border-primary/30 rounded-xl text-[14px] font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          Compare all {country.name} agencies
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}
