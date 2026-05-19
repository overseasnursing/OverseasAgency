import React from 'react'
import { ArrowRight } from 'lucide-react'
import { getAllCountries } from '@/lib/data/countries'
import type { CountryDetail } from '@/types/countryDetail'
import { FlagIcon } from '@/components/ui/FlagIcon'

function DemandDot({ level }: { level: CountryDetail['demandLevel'] }) {
  const color =
    level === 'very-high' ? 'bg-[#22C55E]'
    : level === 'high' ? 'bg-[#2563EB]'
    : 'bg-[#F59E0B]'
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
}

function formatSalaryShort(country: CountryDetail) {
  const { salary } = country
  if (salary.period === 'monthly') {
    return `${salary.localSymbol}${salary.localMin.toLocaleString()}–${salary.localMax.toLocaleString()}/mo`
  }
  const minK = Math.round(salary.localMin / 1000)
  const maxK = Math.round(salary.localMax / 1000)
  return `${salary.localSymbol}${minK}K–${maxK}K/yr`
}

interface RelatedCountriesProps {
  country: CountryDetail
}

export function RelatedCountries({ country }: RelatedCountriesProps) {
  const all = getAllCountries()
  const related = country.relatedCountrySlugs
    .map((slug) => all.find((c) => c.slug === slug))
    .filter(Boolean) as CountryDetail[]

  if (related.length === 0) return null

  return (
    <section aria-labelledby="countries-heading">
      <h2 id="countries-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Compare with Other Countries
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        Explore other top destinations for Indian nurses and compare salaries, costs, and immigration pathways.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((c) => (
          <a
            key={c.slug}
            href={`/country/${c.slug}`}
            className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-card-md transition-all"
          >
            {/* Flag + name */}
            <div className="flex items-center gap-3 mb-4">
              <FlagIcon emoji={c.flag} size={36} className="rounded-sm" />
              <div>
                <p className="text-[15px] font-semibold text-slate-800 group-hover:text-primary transition-colors">
                  {c.name}
                </p>
                <p className="text-[12px] text-slate-400">{c.continent}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">Salary</span>
                <span className="font-semibold text-slate-700">{formatSalaryShort(c)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">Total cost</span>
                <span className="font-semibold text-slate-700">
                  ₹{(c.totalMigrationCostMin / 100000).toFixed(1)}L–{(c.totalMigrationCostMax / 100000).toFixed(1)}L
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">Demand</span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <DemandDot level={c.demandLevel} />
                  {c.demandLevel === 'very-high' ? 'Very High' : c.demandLevel === 'high' ? 'High' : 'Moderate'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">PR pathway</span>
                <span className="font-semibold text-slate-700">
                  {c.prPathway === 'none' ? 'None' : c.prPathway === 'direct' ? `${c.prTimelineYears} yrs` : 'Available'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[12.5px] font-semibold text-primary">
              Explore {c.name}
              <ArrowRight size={12} />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
