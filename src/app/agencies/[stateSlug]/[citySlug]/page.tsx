import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllStatesFromDb } from '@/lib/data/getAgencyLocationData'
import { getLocationPageData } from '@/lib/data/getLocationData'
import { fetchAgenciesByCity } from '@/lib/data/fetchAgencies'
import { buildCityAgencyMetadata } from '@/lib/seo/metadata'
import { buildBreadcrumbSchema, buildFaqSchema, buildCollectionPageSchema, buildAgencyItemListSchema } from '@/lib/seo/schemas'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { CityAgencyGrid } from './_components/CityAgencyGrid'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ stateSlug: string; citySlug: string }>
}

/* ── Static params from DB ──────────────────────────────────────────── */

export async function generateStaticParams() {
  const states = await getAllStatesFromDb()
  return states.flatMap((s) =>
    s.cities.map((c) => ({ stateSlug: s.stateSlug, citySlug: c.citySlug }))
  )
}

/* ── Metadata ───────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stateSlug, citySlug } = await params
  const data = await getLocationPageData(citySlug)
  if (!data) return {}
  return buildCityAgencyMetadata({
    city:            data.city,
    citySlug:        data.citySlug,
    state:           data.state,
    stateSlug,
    agencyCount:     data.agencyCount,
    topDestinations: data.popularDestinations,
  })
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default async function CityAgencyPage({ params }: PageProps) {
  const { stateSlug, citySlug } = await params
  const [data, agencies] = await Promise.all([
    getLocationPageData(citySlug),
    fetchAgenciesByCity(citySlug),
  ])
  if (!data) notFound()

  const path = `/agencies/${stateSlug}/${citySlug}`
  const breadcrumbItems = [
    { name: 'Home',     href: '/' },
    { name: 'Agencies', href: '/agencies' },
    { name: data.state, href: `/agencies/${stateSlug}` },
    { name: data.city,  href: path },
  ]

  const schemas = [
    buildBreadcrumbSchema(breadcrumbItems),
    buildFaqSchema(data.faqs),
    buildCollectionPageSchema({
      name:          `Overseas Nursing Agencies in ${data.city}, ${data.state}`,
      description:   `Compare ${data.agencyCount} overseas nursing agencies in ${data.city}. Real reviews, transparent fees, and scam alerts.`,
      path,
      locationName:  data.city,
      locationRegion: data.state,
      agencyCount:   data.agencyCount,
    }),
    buildAgencyItemListSchema(
      data.agencies.map((a) => ({
        name:        a.name,
        slug:        a.slug,
        rating:      a.rating,
        reviewCount: a.reviewCount,
        city:        data.city,
        state:       data.state,
      })),
      `Overseas Nursing Agencies in ${data.city}, ${data.state}`,
    ),
  ]

  return (
    <>
      <MultiJsonLd schemas={schemas} />

      {/* ── Hero ── */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-[32px] sm:text-[38px] font-bold text-slate-900 leading-tight mb-3">
              Overseas Nursing Agencies in {data.city}
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed">{data.tagline}</p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10 flex flex-col gap-12">

        {/* About */}
        <section>
          <h2 className="text-[20px] font-bold text-slate-800 mb-3">
            Nursing migration from {data.city}
          </h2>
          <p className="text-[14.5px] text-slate-600 leading-relaxed">{data.description}</p>
        </section>

        {/* Agency listings with pagination */}
        <CityAgencyGrid
          agencies={agencies}
          cityName={data.city}
          agencyCount={data.agencyCount}
        />

        {/* ── 3 info cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Card 1 — top destinations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Where nurses migrate
            </p>
            {data.popularDestinations.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {data.popularDestinations.map((dest) => (
                  <Link
                    key={dest}
                    href={`/country/${dest.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                    className="text-[14px] font-medium text-slate-700 hover:text-primary transition-colors"
                  >
                    {dest}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400">No data yet.</p>
            )}
          </div>

          {/* Card 2 — other cities */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Other cities in {data.state}
            </p>
            {data.nearbyLocations.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {data.nearbyLocations.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/agencies/${stateSlug}/${loc.slug}`}
                    className="text-[14px] font-medium text-slate-700 hover:text-primary transition-colors"
                  >
                    {loc.city}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400">No nearby cities listed.</p>
            )}
          </div>

          {/* Card 3 — leave a review CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col">
            <p className="text-[11.5px] font-bold text-primary/60 uppercase tracking-widest mb-4">
              Share your experience
            </p>
            <h3 className="text-[16px] font-bold text-slate-800 mb-2">
              Worked with an agency in {data.city}?
            </h3>
            <p className="text-[13.5px] text-slate-500 leading-relaxed mb-5 flex-1">
              Leave an honest review and help other nurses make a better decision.
            </p>
            <Link
              href="/reviews/submit"
              className="block w-full text-center py-2.5 px-4 bg-primary text-white text-[13.5px] font-semibold rounded-xl hover:bg-primary-hover transition-colors"
            >
              Write a review
            </Link>
          </div>

        </div>

        {/* Local insights */}
        {data.localInsights && (
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h2 className="text-[15px] font-bold text-amber-900 mb-2">
              Local insight — {data.city}
            </h2>
            <p className="text-[13.5px] text-amber-800 leading-relaxed">{data.localInsights}</p>
          </section>
        )}

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-[20px] font-bold text-slate-800 mb-5">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-[14.5px] font-bold text-slate-800 mb-2">{faq.question}</h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
