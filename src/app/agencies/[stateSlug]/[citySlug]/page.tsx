import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, ShieldCheck, ChevronRight, IndianRupee } from 'lucide-react'
import { getAllStatesFromDb } from '@/lib/data/getAgencyLocationData'
import { getLocationPageData } from '@/lib/data/getLocationData'
import { buildCityAgencyMetadata } from '@/lib/seo/metadata'
import { buildBreadcrumbSchema, buildFaqSchema, buildCollectionPageSchema, buildAgencyItemListSchema } from '@/lib/seo/schemas'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { ContentCluster } from '@/components/seo/RelatedContent'

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

/* ── Helpers ────────────────────────────────────────────────────────── */

const TRUST = {
  verified:   { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', label: 'Verified' },
  trusted:    { bg: 'bg-[#DBEAFE]', text: 'text-[#1D4ED8]', label: 'Trusted' },
  unverified: { bg: 'bg-slate-100',  text: 'text-slate-500',  label: 'Listed' },
} as const

/* ── Page ───────────────────────────────────────────────────────────── */

export default async function CityAgencyPage({ params }: PageProps) {
  const { stateSlug, citySlug } = await params
  const data = await getLocationPageData(citySlug)
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
          <div className="mt-4 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-primary" />
              <Link
                href={`/agencies/${stateSlug}`}
                className="text-[13px] font-semibold text-primary hover:underline"
              >
                {data.state}
              </Link>
            </div>
            <h1 className="text-[32px] sm:text-[38px] font-bold text-slate-900 leading-tight mb-3">
              Overseas Nursing Agencies in {data.city}
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-5">{data.tagline}</p>
            {data.popularDestinations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.popularDestinations.map((dest) => (
                  <Link
                    key={dest}
                    href={`/country/${dest.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                    className="text-[12px] font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full hover:border-primary hover:text-primary transition-colors"
                  >
                    {dest}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* ── Main column ── */}
          <main className="flex-1 min-w-0 flex flex-col gap-12">

            {/* About */}
            <section>
              <h2 className="text-[20px] font-bold text-slate-800 mb-3">
                Nursing migration from {data.city}
              </h2>
              <p className="text-[14.5px] text-slate-600 leading-relaxed">{data.description}</p>
            </section>

            {/* Agency listings */}
            <section aria-labelledby="agencies-heading">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 id="agencies-heading" className="text-[20px] font-bold text-slate-800 mb-1">
                    Agencies in {data.city}
                  </h2>
                  <p className="text-[13.5px] text-slate-500">
                    {data.agencyCount} {data.agencyCount === 1 ? 'agency' : 'agencies'} · sorted by rating
                  </p>
                </div>
              </div>

              {data.agencies.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {data.agencies.map((agency) => {
                    const trust = TRUST[agency.trustLevel] ?? TRUST.unverified
                    return (
                      <Link
                        key={agency.slug}
                        href={`/agency/${agency.slug}`}
                        className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-card transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-[16px] font-bold text-slate-800 group-hover:text-primary transition-colors">
                                {agency.name}
                              </h3>
                              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${trust.bg} ${trust.text}`}>
                                <ShieldCheck size={10} />
                                {trust.label}
                              </span>
                            </div>

                            {agency.rating > 0 ? (
                              <div className="flex items-center gap-1 mb-3">
                                <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                                <span className="text-[13px] font-semibold text-slate-700">{agency.rating}</span>
                                <span className="text-[12px] text-slate-400">({agency.reviewCount} reviews)</span>
                              </div>
                            ) : (
                              <p className="text-[12px] text-slate-400 mb-3">No reviews yet</p>
                            )}

                            <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                {agency.address}
                              </span>
                              {agency.feeRangeDisplay !== '—' && (
                                <span className="flex items-center gap-1">
                                  <IndianRupee size={11} />
                                  {agency.feeRangeDisplay}
                                </span>
                              )}
                            </div>

                            {agency.destinations.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {agency.destinations.slice(0, 4).map((d) => (
                                  <span key={d} className="text-[11.5px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                                    {d}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="text-[14px] text-slate-400 py-8 text-center">No agencies found for this city.</p>
              )}
            </section>

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

          </main>

          {/* ── Sidebar ── */}
          <aside className="lg:w-[260px] flex-shrink-0 flex flex-col gap-6">

            {/* Back to state */}
            <Link
              href={`/agencies/${stateSlug}`}
              className="flex items-center gap-2 text-[13px] text-primary font-semibold hover:underline"
            >
              <ChevronRight size={13} className="rotate-180" />
              All agencies in {data.state}
            </Link>

            {/* Nearby cities */}
            {data.nearbyLocations.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide mb-3">
                  Other cities in {data.state}
                </h3>
                <div className="flex flex-col gap-0.5">
                  {data.nearbyLocations.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/agencies/${stateSlug}/${loc.slug}`}
                      className="py-1.5 text-[13px] text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight size={12} className="text-slate-300" />
                      {loc.city}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Destinations */}
            {data.popularDestinations.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide mb-3">
                  Top destinations from {data.city}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {data.popularDestinations.map((dest) => (
                    <Link
                      key={dest}
                      href={`/country/${dest.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                      className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-primary transition-colors py-0.5"
                    >
                      <ChevronRight size={12} className="text-slate-300" />
                      {dest}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related content */}
            {data.relatedCountrySlugs.length > 0 && (
              <ContentCluster relatedCountrySlugs={data.relatedCountrySlugs} />
            )}

            {/* CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <h3 className="text-[13px] font-bold text-slate-800 mb-1.5">Leave a review</h3>
              <p className="text-[12.5px] text-slate-500 leading-relaxed mb-3">
                Worked with an agency in {data.city}? Help other nurses by sharing your experience.
              </p>
              <Link
                href="/reviews/submit"
                className="block w-full text-center py-2 px-4 bg-primary text-white text-[13px] font-semibold rounded-xl hover:bg-primary-hover transition-colors"
              >
                Write a review
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </>
  )
}
