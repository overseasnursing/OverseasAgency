import type { Metadata } from 'next'
import { MapPin } from 'lucide-react'
import { getAllStatesFromDb } from '@/lib/data/getAgencyLocationData'
import { buildMetadata } from '@/lib/seo/metadata'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { LocationDirectoryClient } from './LocationDirectoryClient'

export const revalidate = 86400

/* ── Metadata ── */

export async function generateMetadata(): Promise<Metadata> {
  const states = await getAllStatesFromDb()
  const totalCities = states.reduce((n, s) => n + s.cities.length, 0)
  return buildMetadata({
    title: `Browse Overseas Nursing Agency Locations — ${states.length} States & ${totalCities} Cities in India | OverseasNursing.com`,
    description: `Explore overseas nursing agencies by location. Browse ${states.length} Indian states and ${totalCities} cities. Click any state or city to find verified agencies, compare fees, and read real nurse reviews.`,
    path: '/locations',
  })
}

/* ── Structured data ── */

function buildLocationDirectorySchema(states: { state: string; stateSlug: string; agencyCount: number }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Overseas Nursing Agency Locations in India',
    description: 'Browse overseas nursing agencies by state and city across India.',
    url: 'https://overseasnursing.com/locations',
    about: {
      '@type': 'Country',
      name: 'India',
    },
    hasPart: states.map((s) => ({
      '@type': 'WebPage',
      name: `Overseas Nursing Agencies in ${s.state}`,
      url: `https://overseasnursing.com/agencies/${s.stateSlug}`,
    })),
  }
}

/* ── Page ── */

export default async function LocationsPage() {
  const states = await getAllStatesFromDb()
  const totalCities = states.reduce((n, s) => n + s.cities.length, 0)
  const totalAgencies = states.reduce((n, s) => n + s.agencyCount, 0)

  const breadcrumbItems = [
    { name: 'Home',      href: '/' },
    { name: 'Locations', href: '/locations' },
  ]

  return (
    <>
      <MultiJsonLd schemas={[buildLocationDirectorySchema(states)]} />

      {/* ── Hero ── */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-primary" />
              <span className="text-[13px] font-semibold text-primary">Location Directory</span>
            </div>
            <h1 className="text-[32px] sm:text-[40px] font-bold text-slate-900 leading-tight mb-3">
              Browse Agencies by Location
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-5">
              Find overseas nursing agencies near you. We cover {states.length}{' '}
              states and {totalCities} cities across India — {totalAgencies} verified agencies in total.
            </p>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                <MapPin size={11} className="text-primary" />
                {states.length} States
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                <MapPin size={11} className="text-primary" />
                {totalCities} Cities
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive directory ── */}
      <LocationDirectoryClient states={states} />
    </>
  )
}
