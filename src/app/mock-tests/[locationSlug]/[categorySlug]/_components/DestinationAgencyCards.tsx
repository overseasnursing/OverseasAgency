import Image from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { AgencyCard } from '@/components/agencies/AgencyCard'
import { fetchAgenciesByCountry } from '@/lib/data/fetchAgencies'

type Props = {
  countryTerms:        string[]
  countryName:         string
  countrySlug:         string
  flagCode:            string
  agencyFilterCountry: string
}

export async function DestinationAgencyCards({ countryTerms, countryName, flagCode, agencyFilterCountry }: Props) {
  const agencies = await fetchAgenciesByCountry(countryTerms, 3)

  const agenciesHref = `/agencies?country=${encodeURIComponent(agencyFilterCountry)}`

  if (!agencies.length) {
    return (
      <div className="mt-8 text-center">
        <a
          href={agenciesHref}
          className="inline-flex items-center gap-2 h-10 px-6 bg-white border border-slate-200 hover:border-primary/40 hover:bg-primary/[0.03] text-[13px] font-semibold text-slate-700 hover:text-primary rounded-xl transition-all"
        >
          Find Agencies for {countryName} <ChevronRight size={14} />
        </a>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image
            src={`https://flagcdn.com/20x15/${flagCode}.png`}
            alt={`${countryName} flag`}
            width={20}
            height={15}
            sizes="20px"
            className="rounded-sm"
            unoptimized
          />
          <h2 className="text-[15px] font-bold text-slate-800">
            Top Agencies for {countryName}
          </h2>
        </div>
        <a
          href={agenciesHref}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
        >
          Find More Agencies <ArrowRight size={13} />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {agencies.map(agency => (
          <AgencyCard key={agency.id} agency={agency} />
        ))}
      </div>
    </div>
  )
}
