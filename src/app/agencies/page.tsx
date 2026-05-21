import type { Metadata } from 'next'

export const revalidate = 1800

import { AgencyListingClient } from './AgencyListingClient'
import { getAgencies } from '@/lib/data/getAgencies'

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

export default async function AgenciesPage() {
  const agencies = await getAgencies()

  return (
    <>
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
        <AgencyListingClient agencies={agencies} />
      </div>
    </>
  )
}
