import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCountryDetail, getAllCountrySlugs } from '@/lib/data/countries'
import { LAST_REVIEWED } from '@/lib/data/freshness'
import { buildArticleSchema } from '@/lib/seo/schemas'
import { FlagIcon } from '@/components/ui/FlagIcon'
import { getAttributionProfiles } from '@/lib/admin-profile'

import { CountryHero } from './components/CountryHero'
import { MigrationOverviewStrip } from './components/MigrationOverviewStrip'
import { MigrationProcess } from './components/MigrationProcess'
import { ExamRequirements } from './components/ExamRequirements'
import { PricingIntelligence } from './components/PricingIntelligence'
import { TopAgenciesSection } from './components/TopAgenciesSection'
import { CountryReviews } from './components/CountryReviews'
import { CountryFaqAccordion } from './components/CountryFaqAccordion'
import { RelatedGuides } from './components/RelatedGuides'
import { RelatedCountries } from './components/RelatedCountries'
import { ContentAttribution, type AttributionSource } from '@/components/seo/ContentAttribution'

const COUNTRY_SOURCES: Record<string, AttributionSource[]> = {
  germany: [
    { label: 'Federal Employment Agency (Bundesagentur für Arbeit), Germany' },
    { label: 'Recognition in Germany — Make it in Germany (federal portal)' },
    { label: 'German Nursing Act (Pflegeberufegesetz — PflBG)' },
    { label: 'Goethe-Institut — Language Certification Standards' },
  ],
  uk: [
    { label: 'Nursing and Midwifery Council (NMC), United Kingdom' },
    { label: 'UK Home Office — Health and Care Worker Visa guidance' },
    { label: 'NHS Employers — Agenda for Change Pay Scales' },
    { label: 'UK Visas and Immigration (UKVI)' },
  ],
  canada: [
    { label: 'Immigration, Refugees and Citizenship Canada (IRCC)' },
    { label: 'Canadian Nurses Association (CNA)' },
    { label: 'National Nursing Assessment Service (NNAS)' },
    { label: 'National Council of State Boards of Nursing (NCSBN) — NCLEX' },
  ],
  australia: [
    { label: 'Australian Health Practitioner Regulation Agency (AHPRA)' },
    { label: 'Australian Department of Home Affairs' },
    { label: 'Australian Nursing and Midwifery Accreditation Council (ANMAC)' },
    { label: 'Fair Work Commission — Nursing and Midwifery Industry Award' },
  ],
  dubai: [
    { label: 'Dubai Health Authority (DHA) — Health Regulation Sector' },
    { label: 'General Directorate of Residency and Foreigners Affairs (GDRFA), Dubai' },
    { label: 'Ministry of Human Resources & Emiratisation (MOHRE), UAE' },
    { label: 'Department of Health Abu Dhabi (DOH)' },
  ],
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllCountrySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const country = getCountryDetail(slug)
  if (!country) return {}

  const salary = country.salary
  const salaryDisplay =
    salary.period === 'monthly'
      ? `${salary.localSymbol}${salary.localMin.toLocaleString()}–${salary.localMax.toLocaleString()}/month`
      : `${salary.localSymbol}${Math.round(salary.localMin / 1000)}K–${Math.round(salary.localMax / 1000)}K/year`

  const title = `Nursing in ${country.name} for Indian Nurses — Salary, Visa & Migration Guide (2025)`
  const description = `Complete guide for Indian nurses migrating to ${country.name}. Salary ${salaryDisplay}, visa processing ${country.visaProcessingWeeks.min}–${country.visaProcessingWeeks.max} weeks, total cost ₹${(country.totalMigrationCostMin / 100000).toFixed(1)}–${(country.totalMigrationCostMax / 100000).toFixed(1)}L. Exam requirements, top agencies, and nurse reviews.`

  const ogImage = `/og/country-${slug}.png`

  return {
    title,
    description,
    alternates: {
      canonical: `/country/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/country/${slug}`,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Nursing in ${country.name} — OverseasNursing.com` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function CountryPage({ params }: PageProps) {
  const { slug } = await params
  const country = getCountryDetail(slug)
  if (!country) notFound()

  const attribution = await getAttributionProfiles()

  const salary = country.salary
  const salaryDisplay =
    salary.period === 'monthly'
      ? `${salary.localSymbol}${salary.localMin.toLocaleString()}–${salary.localMax.toLocaleString()}/month`
      : `${salary.localSymbol}${Math.round(salary.localMin / 1000)}K–${Math.round(salary.localMax / 1000)}K/year`

  const articleSchema = buildArticleSchema({
    title: `Nursing in ${country.name} for Indian Nurses — Salary, Visa & Migration Guide (2025)`,
    description: `Complete guide for Indian nurses migrating to ${country.name}. Salary ${salaryDisplay}, visa processing ${country.visaProcessingWeeks.min}–${country.visaProcessingWeeks.max} weeks, total cost ₹${(country.totalMigrationCostMin / 100000).toFixed(1)}–${(country.totalMigrationCostMax / 100000).toFixed(1)}L. Exam requirements, top agencies, and nurse reviews.`,
    path: `/country/${slug}`,
  })

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: country.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://overseasnursing.com/' },
      { '@type': 'ListItem', position: 2, name: 'Countries', item: 'https://overseasnursing.com/countries' },
      { '@type': 'ListItem', position: 3, name: country.name, item: `https://overseasnursing.com/country/${slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <CountryHero country={country} />
      <MigrationOverviewStrip country={country} />

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* Main content */}
          <main className="flex-1 min-w-0 flex flex-col gap-14">

            {/* Country description */}
            <section aria-labelledby="overview-heading">
              <h2 id="overview-heading" className="text-[22px] font-bold text-slate-800 mb-4">
                Why Indian Nurses Choose {country.name}
              </h2>
              <p className="text-[15px] text-slate-600 leading-relaxed mb-5">
                {country.description}
              </p>
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl px-5 py-4">
                <p className="text-[14px] font-semibold text-[#166534] flex items-center gap-1.5">
                  <FlagIcon emoji={country.flag} size={16} className="rounded-sm" />
                  {country.nursingDemand}
                </p>
                <p className="text-[13px] text-[#166534]/80 mt-0.5">
                  {country.recommendationPercent}% of Indian nurses who migrated to {country.name} would recommend it to colleagues.
                </p>
              </div>
            </section>

            <MigrationProcess country={country} />
            <ExamRequirements country={country} />
            <PricingIntelligence country={country} />
            <TopAgenciesSection country={country} />
            <CountryReviews country={country} />
            <CountryFaqAccordion faqs={country.faqs} countryName={country.name} />
            <RelatedGuides country={country} />
            <RelatedCountries country={country} />

            <ContentAttribution
              {...(attribution?.author && { author: attribution.author })}
              {...(attribution?.reviewer && { reviewer: attribution.reviewer })}
              lastReviewed={LAST_REVIEWED.countries}
              sources={COUNTRY_SOURCES[slug] ?? []}
              sourceNote="Information reviewed against official government migration portals, regulatory body guidelines, and published nursing employment data. Salary ranges, visa timelines, and migration costs are indicative and vary by employer and individual circumstance."
            />
          </main>

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-[280px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">

              {/* Quick summary card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <FlagIcon emoji={country.flag} size={32} className="rounded-sm" />
                  <p className="text-[15px] font-bold text-slate-800">{country.name}</p>
                </div>
                <div className="flex flex-col gap-3 text-[13.5px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Demand level</span>
                    <span className={`font-semibold ${country.demandLevel === 'very-high' ? 'text-[#166534]' : 'text-[#1D4ED8]'}`}>
                      {country.demandLevel === 'very-high' ? 'Very High' : country.demandLevel === 'high' ? 'High' : 'Moderate'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Visa timeline</span>
                    <span className="font-semibold text-slate-800">{country.visaProcessingWeeks.min}–{country.visaProcessingWeeks.max} weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">PR pathway</span>
                    <span className="font-semibold text-slate-800">
                      {country.prPathway === 'none' ? 'None' : country.prPathway === 'direct' ? `${country.prTimelineYears} years` : 'Available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Recommend rate</span>
                    <span className="font-semibold text-[#166534]">{country.recommendationPercent}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tax-free salary</span>
                    <span className="font-semibold text-slate-800">{country.salary.taxFree ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Language barrier</span>
                    <span className={`font-semibold ${country.languageBarrier === 'high' ? 'text-[#B91C1C]' : country.languageBarrier === 'moderate' ? 'text-[#92400E]' : 'text-[#166534]'}`}>
                      {country.languageBarrier === 'high' ? 'High' : country.languageBarrier === 'moderate' ? 'Moderate' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Migration cost summary */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Migration Cost
                </p>
                <p className="text-[22px] font-bold text-slate-800 leading-none">
                  ₹{(country.totalMigrationCostMin / 100000).toFixed(1)}L
                  <span className="text-slate-400 font-normal"> – </span>
                  ₹{(country.totalMigrationCostMax / 100000).toFixed(1)}L
                </p>
                <p className="text-[12px] text-slate-400 mt-1">Estimated all-in for one nurse</p>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary mt-3 hover:underline"
                >
                  See full breakdown →
                </a>
              </div>

              {/* CTA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[13.5px] font-semibold text-slate-700 mb-3">
                  Find a verified agency for {country.name}
                </p>
                <a
                  href="#agencies"
                  className="flex items-center justify-center h-11 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors mb-2"
                >
                  View Top Agencies
                </a>
                <a
                  href="/agencies"
                  className="flex items-center justify-center h-11 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13.5px] font-medium rounded-xl transition-colors"
                >
                  Browse All Agencies
                </a>
              </div>

              {/* Language barrier warning for high-barrier countries */}
              {country.languageBarrier === 'high' && (
                <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-4">
                  <p className="text-[13px] font-semibold text-[#92400E] mb-1">
                    Language preparation required
                  </p>
                  <p className="text-[12.5px] text-[#92400E]/80 leading-relaxed">
                    {country.name} requires {country.officialLanguage} proficiency. Add 8–14 months for language preparation to your timeline.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
