import { ArrowRight } from 'lucide-react'
import { AgencyCard } from '@/components/agencies/AgencyCard'
import { fetchAgenciesByCountry } from '@/lib/data/fetchAgencies'
import type { CountryDetail } from '@/types/countryDetail'

interface TopAgenciesSectionProps {
  country: CountryDetail
}

export async function TopAgenciesSection({ country }: TopAgenciesSectionProps) {
  const agencies = await fetchAgenciesByCountry([country.name], 3)

  if (!agencies.length) return null

  return (
    <section id="agencies" aria-labelledby="agencies-heading">
      <div className="flex items-center justify-between mb-2">
        <h2 id="agencies-heading" className="text-[22px] font-bold text-slate-800">
          Top Agencies for {country.name}
        </h2>
        <a
          href="/agencies"
          className="text-[13.5px] font-semibold text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
        >
          View all agencies <ArrowRight size={13} />
        </a>
      </div>
      <p className="text-[14px] text-slate-500 mb-6">
        Agencies with verified placements and transparent pricing for {country.name} nursing migration.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {agencies.map((agency) => (
          <AgencyCard key={agency.id} agency={agency} />
        ))}
      </div>

      <div className="mt-5 text-center">
        <a
          href={`/agencies?country=${encodeURIComponent(country.name)}`}
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 hover:border-primary/30 rounded-xl text-[14px] font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          Compare all {country.name} agencies
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}
