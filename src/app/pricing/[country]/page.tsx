import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPricingData, getAllPricingCountrySlugs } from '@/lib/data/pricing'
import { buildArticleSchema, buildOrganizationSchema } from '@/lib/seo/schemas'
import { FlagIcon } from '@/components/ui/FlagIcon'

import { PricingHero } from './components/PricingHero'
import { TotalCostBreakdown } from './components/TotalCostBreakdown'
import { AgencyFeeTable } from './components/AgencyFeeTable'
import { HiddenChargesWarning } from './components/HiddenChargesWarning'
import { NurseCostExperiences } from './components/NurseCostExperiences'
import { PricingTimeline } from './components/PricingTimeline'
import { TransparentPricingEducation } from './components/TransparentPricingEducation'
import { PricingFaqAccordion } from './components/PricingFaqAccordion'
import { RelatedCountryPricing } from './components/RelatedCountryPricing'
import { PricingRelatedGuides } from './components/PricingRelatedGuides'
import { ContentAttribution, type AttributionSource } from '@/components/seo/ContentAttribution'
import { getAttributionProfiles } from '@/lib/admin-profile'

const PRICING_SOURCES: Record<string, AttributionSource[]> = {
  germany: [
    { label: 'Federal Employment Agency (Bundesagentur für Arbeit) — Recognition fee schedule' },
    { label: 'German Embassy India — Visa fee schedule' },
    { label: 'OET Official — Exam registration fees', url: 'https://oet.com' },
    { label: 'Goethe-Institut — German language course and exam fees' },
  ],
  uk: [
    { label: 'UK Home Office — Health and Care Worker Visa fee schedule' },
    { label: 'Nursing and Midwifery Council (NMC) — Registration fees' },
    { label: 'OET Official — Exam registration fees', url: 'https://oet.com' },
  ],
  canada: [
    { label: 'Immigration, Refugees and Citizenship Canada (IRCC) — Application fees' },
    { label: 'National Nursing Assessment Service (NNAS) — Assessment fees' },
    { label: 'National Council of State Boards of Nursing (NCSBN) — NCLEX examination fees' },
  ],
  australia: [
    { label: 'Australian Department of Home Affairs — Visa application fees' },
    { label: 'Australian Health Practitioner Regulation Agency (AHPRA) — Registration fees' },
    { label: 'OET Official — Exam registration fees', url: 'https://oet.com' },
    { label: 'Australian Nursing and Midwifery Accreditation Council (ANMAC) — Assessment fees' },
  ],
  dubai: [
    { label: 'Dubai Health Authority (DHA) — Licensing examination and registration fees' },
    { label: 'General Directorate of Residency and Foreigners Affairs (GDRFA) — Visa fees' },
    { label: 'Ministry of Human Resources & Emiratisation (MOHRE) — Labour card fees' },
  ],
}

interface PageProps {
  params: Promise<{ country: string }>
}

export async function generateStaticParams() {
  return getAllPricingCountrySlugs().map((country) => ({ country }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params
  const data = getPricingData(country)
  if (!data) return {}

  const year = new Date().getFullYear()
  const title = `${data.countryName} Nursing Migration Cost ${year} — Complete Fee Breakdown (₹${(data.totalMin / 100000).toFixed(1)}L–₹${(data.totalMax / 100000).toFixed(1)}L)`
  const description = `Full cost breakdown for Indian nurses migrating to ${data.countryName}. Agency fees, exam costs, visa fees, hidden charges, and actual nurse experiences. Typical total: ₹${(data.totalTypical / 100000).toFixed(1)}L — verified ${year} data.`
  // No static /og/pricing-*.png files exist — render a real image on demand instead.
  const ogImage = `/api/og?type=default&title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    alternates: { canonical: `/pricing/${country}` },
    openGraph: {
      title,
      description,
      url: `/pricing/${country}`,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${data.countryName} Nursing Migration Costs — OverseasNursing.com` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export default async function PricingPage({ params }: PageProps) {
  const { country } = await params
  const data = getPricingData(country)
  if (!data) notFound()

  const attribution = await getAttributionProfiles()

  const articleSchema = buildArticleSchema({
    title: `${data.countryName} Nursing Migration Cost ${new Date().getFullYear()} — Complete Fee Breakdown (₹${(data.totalMin / 100000).toFixed(1)}L–₹${(data.totalMax / 100000).toFixed(1)}L)`,
    description: `Full cost breakdown for Indian nurses migrating to ${data.countryName}. Agency fees, exam costs, visa fees, hidden charges, and actual nurse experiences. Typical total: ₹${(data.totalTypical / 100000).toFixed(1)}L — verified ${new Date().getFullYear()} data.`,
    path: `/pricing/${country}`,
  })

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://overseasnursing.com/' },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://overseasnursing.com/pricing' },
      { '@type': 'ListItem', position: 3, name: data.countryName, item: `https://overseasnursing.com/pricing/${country}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <PricingHero data={data} />

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* Main content */}
          <main className="flex-1 min-w-0 flex flex-col gap-14">
            <TotalCostBreakdown data={data} />
            <AgencyFeeTable data={data} />
            <HiddenChargesWarning data={data} />
            <NurseCostExperiences data={data} />
            <PricingTimeline data={data} />
            <TransparentPricingEducation data={data} />
            <PricingFaqAccordion faqs={data.faqs} countryName={data.countryName} />
            <RelatedCountryPricing data={data} />
            <PricingRelatedGuides data={data} />

            <ContentAttribution
              {...(attribution?.author && { author: attribution.author })}
              {...(attribution?.reviewer && { reviewer: attribution.reviewer })}
              lastReviewed={data.lastUpdated}
              sources={PRICING_SOURCES[country] ?? []}
              sourceNote="Fee information reviewed against regulatory publications, nurse-reported migration costs, and publicly available agency fee schedules. Costs are indicative — actual charges vary by agency, visa category, and individual circumstances."
            />
          </main>

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-[272px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">

              {/* Cost summary card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FlagIcon emoji={data.flag} size={28} className="rounded-sm" />
                  <div>
                    <p className="text-[13px] font-bold text-slate-800">{data.countryName}</p>
                    <p className="text-[11px] text-slate-400">Migration Costs</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Minimum cost</span>
                    <span className="font-semibold text-slate-700">₹{(data.totalMin / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Maximum cost</span>
                    <span className="font-semibold text-slate-700">₹{(data.totalMax / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-slate-600 font-semibold">Typical spend</span>
                    <span className="font-bold text-primary">₹{(data.totalTypical / 100000).toFixed(1)}L</span>
                  </div>
                </div>

                <p className="text-[11.5px] text-slate-400 mt-3">Last updated: {data.lastUpdated}</p>
              </div>

              {/* Agency fee range */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Agency Fee Range</p>
                <div className="flex flex-col gap-2">
                  {data.agencyComparison
                    .filter((a) => a.trustLevel === 'verified')
                    .slice(0, 3)
                    .map((agency) => (
                      <div key={agency.slug} className="flex items-center justify-between text-[13px]">
                        <span className="text-slate-600 truncate mr-2">{agency.name.split(' ').slice(0, 2).join(' ')}</span>
                        <span className="font-semibold text-slate-700 flex-shrink-0">
                          ₹{(agency.feeMin / 100000).toFixed(1)}L–₹{(agency.feeMax / 100000).toFixed(1)}L
                        </span>
                      </div>
                    ))}
                </div>
                <a
                  href="#agencies"
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary mt-3 hover:underline"
                >
                  Compare all agencies →
                </a>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-2.5">
                <a
                  href="#agencies"
                  className="flex items-center justify-center h-11 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
                >
                  Compare Agency Fees
                </a>
                <a
                  href={`/country/${data.countrySlug}`}
                  className="flex items-center justify-center gap-1.5 h-11 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors"
                >
                  <FlagIcon emoji={data.flag} size={16} className="rounded-sm" />
                  Full {data.countryName} Guide
                </a>
                <a
                  href="/agencies"
                  className="flex items-center justify-center h-11 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors"
                >
                  Browse Verified Agencies
                </a>
              </div>

              {/* Hidden charges alert */}
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-4">
                <p className="text-[13px] font-semibold text-[#92400E] mb-1">
                  {data.hiddenChargePatterns.length} hidden charge patterns identified
                </p>
                <p className="text-[12px] text-[#92400E]/80 leading-relaxed">
                  Always request an itemized written quote. Read the hidden charges section below before signing anything.
                </p>
                <a href="#" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#92400E] mt-2 hover:underline">
                  See all warning signs →
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
