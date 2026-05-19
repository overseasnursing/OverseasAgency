import React from 'react'
import { TrendingUp, Clock, Globe, CheckCircle, XCircle, ArrowRight, Banknote, Users } from 'lucide-react'
import type { CountryDetail, DemandLevel, PrPathway } from '@/types/countryDetail'
import { FlagIcon } from '@/components/ui/FlagIcon'

/* Country-specific accent colours — subtle, not garish */
const COUNTRY_ACCENT: Record<string, { from: string; dot: string }> = {
  germany:   { from: 'rgba(185,28,28,0.06)',    dot: '#B91C1C' },
  uk:        { from: 'rgba(29,78,216,0.06)',     dot: '#1D4ED8' },
  canada:    { from: 'rgba(220,38,38,0.06)',     dot: '#DC2626' },
  australia: { from: 'rgba(15,76,129,0.06)',     dot: '#0F4C81' },
  dubai:     { from: 'rgba(22,101,52,0.05)',     dot: '#166534' },
}

function DemandBadge({ level }: { level: DemandLevel }) {
  const map = {
    'very-high': { label: 'Very High Demand', cls: 'bg-[#DCFCE7] text-[#166534]' },
    'high': { label: 'High Demand', cls: 'bg-[#DBEAFE] text-[#1D4ED8]' },
    'moderate': { label: 'Moderate Demand', cls: 'bg-[#FEF3C7] text-[#92400E]' },
  }
  const { label, cls } = map[level]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-semibold rounded-full ${cls}`}>
      <TrendingUp size={12} />
      {label}
    </span>
  )
}

function PrBadge({ pathway, years }: { pathway: PrPathway; years?: number }) {
  if (pathway === 'none')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 text-[12.5px] font-semibold rounded-full">
        <XCircle size={12} />
        No PR Pathway
      </span>
    )
  if (pathway === 'direct')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] text-[#166534] text-[12.5px] font-semibold rounded-full">
        <CheckCircle size={12} />
        PR in {years} years
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#1D4ED8] text-[12.5px] font-semibold rounded-full">
      <CheckCircle size={12} />
      PR Pathway Available
    </span>
  )
}

function formatSalary(country: CountryDetail) {
  const { salary } = country
  if (salary.period === 'monthly') {
    return `${salary.localSymbol}${salary.localMin.toLocaleString()}–${salary.localMax.toLocaleString()}/month`
  }
  const minK = (salary.localMin / 1000).toFixed(0)
  const maxK = (salary.localMax / 1000).toFixed(0)
  return `${salary.localSymbol}${minK}K–${maxK}K/year`
}

interface CountryHeroProps {
  country: CountryDetail
}

export function CountryHero({ country }: CountryHeroProps) {
  const accent = COUNTRY_ACCENT[country.slug] ?? { from: 'rgba(15,76,129,0.05)', dot: '#0F4C81' }

  return (
    <div className="relative bg-white border-b border-slate-100 overflow-hidden">
      {/* Country-specific gradient blob */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[320px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${accent.from} 0%, transparent 65%)` }}
      />
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${accent.dot} 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-slate-400 mb-8" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <a href="/countries" className="hover:text-primary transition-colors">Countries</a>
          <span>/</span>
          <span className="text-slate-600 font-medium">{country.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">

          {/* Left — identity + description */}
          <div className="flex-1 min-w-0">

            {/* Flag + Name */}
            <div className="flex items-center gap-4 mb-4">
              <FlagIcon emoji={country.flag} size={64} className="rounded" />
              <div>
                <h1 className="text-[34px] sm:text-[42px] font-bold text-slate-800 leading-tight">
                  Nursing in {country.name}
                </h1>
                <div className="flex items-center gap-1.5 text-[14px] text-slate-400 mt-1">
                  <Globe size={13} />
                  <span>{country.continent}</span>
                  <span className="text-slate-200">·</span>
                  <span>{country.officialLanguage}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <DemandBadge level={country.demandLevel} />
              <PrBadge pathway={country.prPathway} years={country.prTimelineYears} />
              {country.salary.taxFree && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF3C7] text-[#92400E] text-[12.5px] font-semibold rounded-full">
                  Tax-Free Salary
                </span>
              )}
            </div>

            {/* Tagline */}
            <p className="text-[17px] text-slate-700 leading-relaxed max-w-[640px] mb-6">
              {country.tagline}
            </p>

            {/* Key stats row */}
            <div className="flex flex-wrap gap-5 mb-8 pb-8 border-b border-slate-100">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Avg. Salary</p>
                <p className="text-[18px] font-bold text-slate-800">{formatSalary(country)}</p>
              </div>
              <div className="w-px bg-slate-100" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Visa Timeline</p>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-400" />
                  <p className="text-[18px] font-bold text-slate-800">{country.visaProcessingWeeks.min}–{country.visaProcessingWeeks.max} weeks</p>
                </div>
              </div>
              <div className="w-px bg-slate-100" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Nurses Recommend</p>
                <p className="text-[18px] font-bold text-[#166534]">{country.recommendationPercent}%</p>
              </div>
              <div className="w-px bg-slate-100" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Total Cost (est.)</p>
                <p className="text-[18px] font-bold text-slate-800">
                  ₹{(country.totalMigrationCostMin / 100000).toFixed(1)}L – ₹{(country.totalMigrationCostMax / 100000).toFixed(1)}L
                </p>
              </div>
            </div>

            {/* Nursing demand */}
            <p className="text-[13.5px] text-slate-500">
              <span className="font-semibold text-slate-700">Demand: </span>
              {country.nursingDemand}
            </p>
          </div>

          {/* Right — CTAs + mini visual stat panel */}
          <div className="flex flex-col gap-3 lg:min-w-[280px] lg:flex-shrink-0">
            <a
              href="#agencies"
              className="flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold rounded-xl transition-colors"
            >
              View Top Agencies
              <ArrowRight size={15} />
            </a>
            <a
              href="#process"
              className="flex items-center justify-center gap-2 h-12 px-6 border border-slate-200 hover:border-slate-300 text-slate-700 text-[14px] font-medium rounded-xl transition-colors"
            >
              How to Migrate to {country.name}
            </a>
            <a
              href="#pricing"
              className="flex items-center justify-center gap-2 h-12 px-6 border border-slate-200 hover:border-slate-300 text-slate-700 text-[14px] font-medium rounded-xl transition-colors"
            >
              See Full Cost Breakdown
            </a>

            {/* Mini stat panel */}
            <div className="mt-1 p-4 bg-[#F8FAFC] rounded-2xl border border-slate-100">
              <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide mb-3">At a glance</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                    <Banknote size={12} className="text-slate-400" />
                    Total cost
                  </span>
                  <span className="text-[13px] font-bold text-slate-800">
                    ₹{(country.totalMigrationCostMin / 100000).toFixed(1)}L–₹{(country.totalMigrationCostMax / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                    <Clock size={12} className="text-slate-400" />
                    Visa timeline
                  </span>
                  <span className="text-[13px] font-bold text-slate-800">
                    {country.visaProcessingWeeks.min}–{country.visaProcessingWeeks.max} weeks
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                    <Users size={12} className="text-slate-400" />
                    Recommend
                  </span>
                  <span className="text-[13px] font-bold text-[#166534]">
                    {country.recommendationPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
