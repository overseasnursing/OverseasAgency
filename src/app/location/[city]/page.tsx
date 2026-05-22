import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MapPin, Star, ShieldCheck, Building2 } from 'lucide-react'
import { getAllLocationCitiesFromDb, getLocationPageData } from '@/lib/data/getLocationData'
import { buildLocationMetadata } from '@/lib/seo/metadata'
import { buildFaqSchema } from '@/lib/seo/schemas'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { JsonLd } from '@/components/seo/JsonLd'
import { ContentCluster } from '@/components/seo/RelatedContent'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  const cities = await getAllLocationCitiesFromDb()
  return cities.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params
  const data = await getLocationPageData(city)
  if (!data) return {}
  return buildLocationMetadata({
    city:       data.city,
    citySlug:   data.citySlug,
    state:      data.state,
    agencyCount: data.agencyCount,
  })
}

const TRUST_COLORS = {
  verified:   { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', label: 'Verified' },
  trusted:    { bg: 'bg-[#DBEAFE]', text: 'text-[#1D4ED8]', label: 'Trusted' },
  unverified: { bg: 'bg-slate-100',  text: 'text-slate-500',  label: 'Unverified' },
}

export default async function LocationPage({ params }: PageProps) {
  const { city } = await params
  const data = await getLocationPageData(city)
  if (!data) notFound()

  const faqSchema     = buildFaqSchema(data.faqs)
  const breadcrumbItems = [
    { name: 'Home',     href: '/' },
    { name: 'Location', href: '/location' },
    { name: `${data.city}, ${data.state}`, href: `/location/${data.citySlug}` },
  ]

  return (
    <>
      <JsonLd schema={faqSchema} />

      {/* Hero */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-primary" />
              <p className="text-[13px] font-semibold text-primary">
                {data.state}
              </p>
            </div>
            <h1 className="text-[32px] sm:text-[38px] font-bold text-slate-900 leading-tight mb-3">
              Overseas Nursing Agencies in {data.city}
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-5">
              {data.tagline}
            </p>
            {data.popularDestinations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.popularDestinations.map((dest) => (
                  <span
                    key={dest}
                    className="text-[12px] font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full"
                  >
                    {dest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <main className="flex-1 min-w-0 flex flex-col gap-12">

            {/* About */}
            <section>
              <h2 className="text-[20px] font-bold text-slate-800 mb-3">
                Nursing Migration in {data.city}
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
                    {data.agencyCount} {data.agencyCount === 1 ? 'agency' : 'agencies'} serving nurses from {data.city}
                  </p>
                </div>
              </div>

              {data.agencies.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {data.agencies.map((agency) => {
                    const trust = TRUST_COLORS[agency.trustLevel]
                    return (
                      <a
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

                            <div className="flex items-center gap-1 mb-3">
                              <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                              <span className="text-[13px] font-semibold text-slate-700">
                                {agency.rating > 0 ? agency.rating.toFixed(1) : '—'}
                              </span>
                              <span className="text-[12px] text-slate-400">
                                {agency.reviewCount > 0 ? `(${agency.reviewCount} reviews)` : 'No reviews yet'}
                              </span>
                            </div>

                            {agency.address && (
                              <div className="flex items-center gap-1.5 text-[12.5px] text-slate-400 mb-3">
                                <MapPin size={12} />
                                {agency.address}
                              </div>
                            )}

                            {agency.destinations.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {agency.destinations.slice(0, 5).map((d) => (
                                  <span key={d} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {d}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p className="text-[11px] text-slate-400 mb-0.5">Fee range</p>
                            <p className="text-[15px] font-bold text-slate-800">{agency.feeRangeDisplay}</p>
                          </div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                  <Building2 size={32} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-[14px] text-slate-400">No agencies listed in {data.city} yet.</p>
                  <a href="/agencies" className="text-[13.5px] text-primary hover:underline mt-2 inline-block">
                    Browse all agencies →
                  </a>
                </div>
              )}

              <a
                href="/agencies"
                className="inline-flex items-center h-10 px-5 mt-4 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors"
              >
                Browse all agencies →
              </a>
            </section>

            {/* Local insights */}
            <section className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={16} className="text-[#1D4ED8]" />
                <h2 className="text-[17px] font-bold text-slate-800">Local Insights for {data.city}</h2>
              </div>
              <p className="text-[14px] text-[#1D4ED8]/80 leading-relaxed">{data.localInsights}</p>
            </section>

            {/* FAQ */}
            {data.faqs.length > 0 && (
              <section aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-[20px] font-bold text-slate-800 mb-5">
                  Frequently Asked Questions — {data.city}
                </h2>
                <div className="flex flex-col gap-4">
                  {data.faqs.map((faq, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
                      <h3 className="text-[14.5px] font-semibold text-slate-800 mb-2">{faq.question}</h3>
                      <p className="text-[13.5px] text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <ContentCluster
              relatedCountrySlugs={data.relatedCountrySlugs}
              relatedPricingSlugs={data.relatedCountrySlugs}
              relatedLocations={data.nearbyLocations}
            />
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-[272px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">
              {/* Quick stats */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  {data.city} at a Glance
                </p>
                <div className="flex flex-col gap-2.5 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Agencies</span>
                    <span className="font-semibold text-slate-700">{data.agencyCount}</span>
                  </div>
                  {data.popularDestinations.length > 0 && (
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 flex-shrink-0">Top destinations</span>
                      <span className="font-semibold text-slate-700 text-right">
                        {data.popularDestinations.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">State</span>
                    <span className="font-semibold text-slate-700">{data.state}</span>
                  </div>
                </div>
              </div>

              {/* Nearby */}
              {data.nearbyLocations.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Nearby Locations
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {data.nearbyLocations.map((loc) => (
                      <a
                        key={loc.slug}
                        href={`/location/${loc.slug}`}
                        className="text-[13px] text-slate-600 hover:text-primary transition-colors"
                      >
                        Agencies in {loc.city} →
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col gap-2.5">
                <a
                  href="/agencies"
                  className="flex items-center justify-center h-10 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors"
                >
                  Browse All Agencies
                </a>
                <a
                  href="/reviews"
                  className="flex items-center justify-center h-10 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors"
                >
                  Read Nurse Reviews
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
