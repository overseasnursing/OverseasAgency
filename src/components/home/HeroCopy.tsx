'use client'

import { useSourceCountry } from '@/lib/country/context'
import { getSourceCountryByName } from '@/lib/data/countryList'

/**
 * Homepage hero headline + sub-copy. Server-renders (and hydrates with)
 * exactly the same global copy every visitor and crawler has always seen —
 * that's the canonical HTML and it never changes. Only after hydration, if
 * the visitor's resolved Market Context has a known demonym (e.g.
 * "Filipino"), does the text swap in place — a wording reframe, not a new
 * claim, so it stays honest without a market-specific trust number to back it.
 */
export function HeroCopy() {
  const { country, ready } = useSourceCountry()
  const demonym = ready ? getSourceCountryByName(country.name)?.demonym : undefined

  return (
    <>
      <h1 className="mb-5 text-balance">
        {demonym
          ? `Find overseas nursing agencies that ${demonym} nurses actually trust.`
          : 'Find overseas nursing agencies that nurses actually trust.'}
      </h1>

      <p className="text-[17px] text-slate-500 leading-[1.78] mb-8 max-w-[520px]">
        Compare verified reviews, real migration costs, and scam reports —
        from {demonym ? `${demonym} ` : ''}nurses who have already made the move to Germany, UK, Canada, and beyond.
      </p>
    </>
  )
}
