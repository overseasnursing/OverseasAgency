import React from 'react'
import { DollarSign, Clock, Languages, Award, TrendingUp, Banknote } from 'lucide-react'
import type { CountryDetail } from '@/types/countryDetail'

interface MetricProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  highlight?: 'good' | 'warn' | 'neutral'
}

function Metric({ icon, label, value, sub, highlight = 'neutral' }: MetricProps) {
  const valueColor =
    highlight === 'good' ? 'text-[#166534]'
    : highlight === 'warn' ? 'text-[#92400E]'
    : 'text-slate-800'

  return (
    <div className="flex flex-col items-center text-center px-4 py-5 min-w-0">
      <div className="mb-2 text-slate-400">{icon}</div>
      <p className={`text-[16px] sm:text-[18px] font-bold leading-none mb-1 ${valueColor}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mb-1">{sub}</p>}
      <p className="text-[11.5px] text-slate-400 font-medium leading-tight">{label}</p>
    </div>
  )
}

function Divider() {
  return <div className="w-px bg-slate-100 self-stretch my-3 hidden sm:block" />
}

function formatSalaryMetric(country: CountryDetail) {
  const { salary } = country
  const inrMin = (salary.inrMonthlyMin / 100000).toFixed(1)
  const inrMax = (salary.inrMonthlyMax / 100000).toFixed(1)
  return {
    value: `₹${inrMin}–${inrMax}L`,
    sub: 'per month (INR equiv.)',
  }
}

function prLabel(country: CountryDetail) {
  if (country.prPathway === 'none') return { value: 'No PR', highlight: 'warn' as const }
  if (country.prPathway === 'direct') return { value: `${country.prTimelineYears} years`, highlight: 'good' as const }
  return { value: 'Pathway', highlight: 'good' as const }
}

function languageLabel(country: CountryDetail) {
  const exams = country.exams
    .filter((e) => e.category === 'language' && e.mandatory)
    .map((e) => e.name)
  const optional = country.exams
    .filter((e) => e.category === 'language' && !e.mandatory)
    .map((e) => e.name)
  const all = [...new Set([...exams, ...optional])]
  return all.slice(0, 2).join(' / ') || 'English only'
}

interface MigrationOverviewStripProps {
  country: CountryDetail
}

export function MigrationOverviewStrip({ country }: MigrationOverviewStripProps) {
  const salary = formatSalaryMetric(country)
  const pr = prLabel(country)
  const lang = languageLabel(country)

  const totalMin = (country.totalMigrationCostMin / 100000).toFixed(1)
  const totalMax = (country.totalMigrationCostMax / 100000).toFixed(1)

  const demandLabel =
    country.demandLevel === 'very-high' ? 'Very High'
    : country.demandLevel === 'high' ? 'High'
    : 'Moderate'

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-100">

          <Metric
            icon={<DollarSign size={20} />}
            label="Monthly Salary (INR)"
            value={salary.value}
            sub={salary.sub}
            highlight="good"
          />
          <Divider />
          <Metric
            icon={<Clock size={20} />}
            label="Visa Processing"
            value={`${country.visaProcessingWeeks.min}–${country.visaProcessingWeeks.max} wks`}
            highlight="neutral"
          />
          <Divider />
          <Metric
            icon={<Languages size={20} />}
            label="Language Exams"
            value={lang}
            highlight={country.languageBarrier === 'high' ? 'warn' : 'neutral'}
          />
          <Divider />
          <Metric
            icon={<Award size={20} />}
            label="PR Pathway"
            value={pr.value}
            highlight={pr.highlight}
          />
          <Divider />
          <Metric
            icon={<TrendingUp size={20} />}
            label="Nurse Demand"
            value={demandLabel}
            highlight={country.demandLevel === 'very-high' ? 'good' : 'neutral'}
          />
          <Divider />
          <Metric
            icon={<Banknote size={20} />}
            label="Total Migration Cost"
            value={`₹${totalMin}–${totalMax}L`}
            highlight="neutral"
          />
        </div>
      </div>
    </div>
  )
}
