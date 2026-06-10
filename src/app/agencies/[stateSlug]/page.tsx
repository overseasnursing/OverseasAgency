import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, ShieldCheck, Building2, ChevronRight, TrendingUp, IndianRupee } from 'lucide-react'
import { getAllStatesFromDb, getStatePageData } from '@/lib/data/getAgencyLocationData'
import { buildStateAgencyMetadata } from '@/lib/seo/metadata'
import { buildBreadcrumbSchema, buildFaqSchema, buildCollectionPageSchema, buildAgencyItemListSchema } from '@/lib/seo/schemas'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/seo/Breadcrumb'

export const revalidate = 86400 // 24 h ISR — fresh data, fast delivery

interface PageProps {
  params: Promise<{ stateSlug: string }>
}

/* ── Static params from DB ──────────────────────────────────────────── */

export async function generateStaticParams() {
  const states = await getAllStatesFromDb()
  return states.map((s) => ({ stateSlug: s.stateSlug }))
}

/* ── Metadata ───────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stateSlug } = await params
  const data = await getStatePageData(stateSlug)
  if (!data) return {}
  return buildStateAgencyMetadata({
    state:          data.state,
    stateSlug:      data.stateSlug,
    agencyCount:    data.agencyCount,
    topDestinations: data.topDestinations,
    feeRange:       data.feeRange,
  })
}

/* ── Helpers ────────────────────────────────────────────────────────── */

const TRUST = {
  verified:   { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', label: 'Verified' },
  trusted:    { bg: 'bg-[#DBEAFE]', text: 'text-[#1D4ED8]', label: 'Trusted' },
  unverified: { bg: 'bg-slate-100',  text: 'text-slate-500',  label: 'Listed' },
} as const

/* ── Page ───────────────────────────────────────────────────────────── */

export default async function StateAgencyPage({ params }: PageProps) {
  const { stateSlug } = await params
  const data = await getStatePageData(stateSlug)
  if (!data) notFound()

  const path = `/agencies/${stateSlug}`
  const breadcrumbItems = [
    { name: 'Home',     href: '/' },
    { name: 'Agencies', href: '/agencies' },
    { name: data.state, href: path },
  ]

  const schemas = [
    buildBreadcrumbSchema(breadcrumbItems),
    buildFaqSchema(data.faqs),
    buildCollectionPageSchema({
      name:          `Overseas Nursing Agencies in ${data.state}`,
      description:   `Compare ${data.agencyCount} overseas nursing agencies in ${data.state}. Real reviews, transparent fees, and scam alerts.`,
      path,
      locationName:  data.state,
      agencyCount:   data.agencyCount,
    }),
    buildAgencyItemListSchema(
      data.agencies.map((a) => ({
        name:        a.name,
        slug:        a.slug,
        rating:      a.rating,
        reviewCount: a.reviewCount,
        city:        a.address.split(',')[0]?.trim() ?? data.state,
        state:       data.state,
      })),
      `Overseas Nursing Agencies in ${data.state}`,
    ),
  ]

  const destText = data.topDestinations.slice(0, 3).join(', ')

  return (
    <>
      <MultiJsonLd schemas={schemas} />

      {/* ── Hero ── */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-primary" />
              <span className="text-[13px] font-semibold text-primary">India · {data.state}</span>
            </div>
            <h1 className="text-[32px] sm:text-[40px] font-bold text-slate-900 leading-tight mb-3">
              Overseas Nursing Agencies in {data.state}
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-5">
              {data.agencyCount} verified{' '}
              agenc{data.agencyCount === 1 ? 'y' : 'ies'} across {data.cities.slice(0, 4).map(c => c.city).join(', ')}
              {data.cities.length > 4 ? ` and ${data.cities.length - 4} more cities` : ''}.
              {destText ? ` Placing nurses in ${destText} and more.` : ''}
            </p>
            {data.topDestinations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.topDestinations.map((dest) => (
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

      {/* ── Stats bar ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-6 text-[13px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Building2 size={14} className="text-primary" />
              <span className="font-semibold text-slate-800">{data.agencyCount}</span> agencies
            </div>
            {data.feeRange.minLakhs > 0 && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <IndianRupee size={14} className="text-primary" />
                Fees from{' '}
                <span className="font-semibold text-slate-800">₹{data.feeRange.minLakhs}L–₹{data.feeRange.maxLakhs}L</span>
              </div>
            )}
            {data.cities.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin size={14} className="text-primary" />
                <span className="font-semibold text-slate-800">{data.cities.length}</span> cities
              </div>
            )}
            {destText && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <TrendingUp size={14} className="text-primary" />
                Top destinations: <span className="font-semibold text-slate-800">{destText}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* ── Main column ── */}
          <main className="flex-1 min-w-0 flex flex-col gap-12">

            {/* Cities in this state */}
            {data.cities.length > 1 && (
              <section aria-labelledby="cities-heading">
                <h2 id="cities-heading" className="text-[20px] font-bold text-slate-800 mb-4">
                  Browse by city in {data.state}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.cities.map((c) => (
                    <Link
                      key={c.citySlug}
                      href={`/agencies/${stateSlug}/${c.citySlug}`}
                      className="group flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-primary hover:shadow-sm transition-all"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-slate-800 group-hover:text-primary transition-colors">
                          {c.city}
                        </p>
                        <p className="text-[12px] text-slate-400 mt-0.5">
                          {c.agencyCount} {c.agencyCount === 1 ? 'agency' : 'agencies'}
                        </p>
                      </div>
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Agency listings */}
            <section aria-labelledby="agencies-heading">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 id="agencies-heading" className="text-[20px] font-bold text-slate-800 mb-1">
                    All agencies in {data.state}
                  </h2>
                  <p className="text-[13.5px] text-slate-500">
                    Sorted by rating · includes head offices and branch locations
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
                <p className="text-[14px] text-slate-400 py-8 text-center">No agencies found for this state.</p>
              )}
            </section>

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

            {/* Cities quick links */}
            {data.cities.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide mb-3">
                  Cities in {data.state}
                </h3>
                <div className="flex flex-col gap-0.5">
                  {data.cities.map((c) => (
                    <Link
                      key={c.citySlug}
                      href={`/agencies/${stateSlug}/${c.citySlug}`}
                      className="flex items-center justify-between py-1.5 text-[13px] text-slate-600 hover:text-primary transition-colors"
                    >
                      <span>{c.city}</span>
                      <span className="text-[11px] text-slate-400">{c.agencyCount}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Top destinations */}
            {data.topDestinations.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide mb-3">
                  Nurses from {data.state} migrate to
                </h3>
                <div className="flex flex-col gap-1.5">
                  {data.topDestinations.map((dest) => (
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

            {/* CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <h3 className="text-[13px] font-bold text-slate-800 mb-1.5">
                Is your agency listed?
              </h3>
              <p className="text-[12.5px] text-slate-500 leading-relaxed mb-3">
                Claim your free agency profile to receive verified nurse reviews and appear in search results.
              </p>
              <Link
                href="/for-agencies"
                className="block w-full text-center py-2 px-4 bg-primary text-white text-[13px] font-semibold rounded-xl hover:bg-primary-hover transition-colors"
              >
                List your agency
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </>
  )
}
