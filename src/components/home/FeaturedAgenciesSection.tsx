'use client'

import { useEffect, useState } from 'react'
import { AgencyCard } from '@/components/agencies/AgencyCard'
import { useSourceCountry } from '@/lib/country/context'
import { getFeaturedAgenciesForCountry } from '@/app/actions/agencies'
import type { Agency } from '@/types/agency'

/**
 * Wraps the homepage's Featured Agencies grid. The initial list (server-
 * rendered, India, identical for every visitor and every crawler) is what
 * ships in the static HTML — this component never changes that on first
 * paint. Only after mount, once the visitor's real Market Context has
 * resolved, does it swap to that country's agencies — falling back to the
 * original India list if the resolved country has none yet. This keeps the
 * homepage itself fully static; see src/lib/country/resolve.ts for why a
 * server-side read here would regress caching for the whole page.
 */
export function FeaturedAgenciesSection({ initialAgencies }: { initialAgencies: Agency[] }) {
  const { country, ready } = useSourceCountry()
  const [agencies, setAgencies] = useState(initialAgencies)

  useEffect(() => {
    if (!ready || country.name === 'India') return
    let cancelled = false

    getFeaturedAgenciesForCountry(country.name, initialAgencies.length)
      .then(result => {
        if (cancelled) return
        // Graceful fallback — a market with no listed agencies yet keeps
        // showing the default India set rather than an empty section.
        if (result.length > 0) setAgencies(result)
      })
      .catch(() => {
        // Non-fatal — keep showing the default set.
      })

    return () => { cancelled = true }
  }, [ready, country.name, initialAgencies.length])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {agencies.map((agency) => (
        <AgencyCard key={agency.id} agency={agency} />
      ))}
    </div>
  )
}
