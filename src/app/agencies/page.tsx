import type { Metadata } from 'next'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

export const revalidate = 1800

import { AgencyListingClient } from './AgencyListingClient'
import { getAgencies } from '@/lib/data/getAgencies'
import { resolveSourceCountry } from '@/lib/country/resolve'

export const metadata: Metadata = {
  title: 'Find Overseas Nursing Agencies — Compare Reviews & Pricing',
  description:
    'Browse 600+ verified overseas nursing agencies. Compare real reviews, transparent pricing, migration timelines and scam alerts before choosing your agency.',
  alternates: { canonical: '/agencies' },
  openGraph: {
    title:       'Find Overseas Nursing Agencies — Compare Reviews & Pricing',
    description: 'Real reviews, transparent pricing, scam alerts. Find the right agency for Germany, UK, Canada & more.',
    url:         'https://overseasnursing.com/agencies',
    images:      [{ url: '/og-agencies.png', width: 1200, height: 630 }],
  },
}

const AGENCIES_SCHEMAS = [
  buildWebPageSchema({
    title: 'Find Overseas Nursing Agencies — Compare Reviews & Pricing',
    description:
      'Browse verified overseas nursing agencies and compare real reviews, pricing transparency, and scam alerts.',
    path: '/agencies',
  }),
  buildBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Agencies', href: '/agencies' },
  ]),
]

export default async function AgenciesPage({ searchParams }: { searchParams: Promise<{ country?: string }> }) {
  // Already a dynamic route (searchParams), so resolving here adds no new
  // caching cost — see src/lib/country/resolve.ts for why this must never
  // be called from a statically-generated page.
  const [resolved, { country }] = await Promise.all([resolveSourceCountry(), searchParams])

  let agencies = await getAgencies(resolved.name)
  // Graceful fallback while a market has no listed agencies yet, per Phase 3.
  if (agencies.length === 0 && resolved.name !== 'India') {
    agencies = await getAgencies('India')
  }

  return (
    <>
      <MultiJsonLd schemas={AGENCIES_SCHEMAS} />

      {/* Minimal page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-7">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-slate-900 leading-tight">
            Find Overseas Nursing Agencies
          </h1>
          <p className="text-[14px] text-slate-400 mt-1.5">
            600+ agencies &middot; real nurse reviews &middot; transparent pricing
          </p>
        </div>
      </div>

      {/* Search + filter + results */}
      <div className="bg-[#F8FAFC] min-h-screen">
        <AgencyListingClient agencies={agencies} initialCountry={country ?? null} />
      </div>
    </>
  )
}
