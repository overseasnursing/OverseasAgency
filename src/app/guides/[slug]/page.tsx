import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, ArrowRight, ChevronRight } from 'lucide-react'
import { getAllGuideSlugs, getGuide } from '@/lib/data/guides'
import { getCountryDetail, COUNTRY_SOURCES } from '@/lib/data/countries'
import { getPricingData } from '@/lib/data/pricing'
import { LAST_REVIEWED } from '@/lib/data/freshness'
import { buildArticleSchema, buildFaqSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { buildGuideMetadata } from '@/lib/seo/metadata'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { ContentAttribution } from '@/components/seo/ContentAttribution'
import { getAttributionProfiles } from '@/lib/admin-profile'
import { InternalLinkCluster } from '@/components/seo/InternalLinkCluster'
import { RecommendedGuides } from './RecommendedGuides'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}

  return buildGuideMetadata({
    title: guide.title,
    slug: guide.slug,
    description: guide.metaDescription,
    category: guide.category,
  })
}

const CATEGORY_BADGE: Record<string, { label: string; className: string }> = {
  salary:       { label: 'Salary Guide',        className: 'bg-[#DCFCE7] text-[#166534]' },
  exam:         { label: 'Exam Guide',           className: 'bg-[#DBEAFE] text-[#1D4ED8]' },
  registration: { label: 'Registration Guide',   className: 'bg-[#FEF3C7] text-[#92400E]' },
  comparison:   { label: 'Country Comparison',   className: 'bg-[#F3E8FF] text-[#6B21A8]' },
  visa:         { label: 'Visa & Immigration',   className: 'bg-[#FEE2E2] text-[#B91C1C]' },
  language:     { label: 'Language Exam',        className: 'bg-[#E0F2FE] text-[#0369A1]' },
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const badge = CATEGORY_BADGE[guide.category] ?? { label: 'Guide', className: 'bg-slate-100 text-slate-600' }
  const attribution = await getAttributionProfiles()

  // Cross-cluster links (not just same-type "related guides") for crawl/topic-cluster depth
  const countrySlug = guide.country.toLowerCase()
  const countryDetail = getCountryDetail(countrySlug)
  const pricingData   = getPricingData(countrySlug)
  const clusterLinks = [
    ...(countryDetail ? [{ href: `/country/${countrySlug}`, label: `${countryDetail.name} Migration Guide`, description: 'Salary, visa process, and full migration overview' }] : []),
    ...(pricingData   ? [{ href: `/pricing/${countrySlug}`, label: `${countryDetail?.name ?? guide.country} Cost Breakdown`, description: 'Agency fees, exam costs, and total migration budget' }] : []),
  ]

  const schemas = [
    buildArticleSchema({
      title: guide.title,
      description: guide.metaDescription,
      path: `/guides/${guide.slug}`,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Guides', href: '/guides' },
      { name: guide.title, href: `/guides/${guide.slug}` },
    ]),
    ...(guide.faqs.length > 0 ? [buildFaqSchema(guide.faqs)] : []),
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MultiJsonLd schemas={schemas} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <ChevronRight size={12} />
          <a href="/guides" className="hover:text-primary transition-colors">Guides</a>
          <ChevronRight size={12} />
          <span className="text-slate-600 truncate">{guide.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${badge.className}`}>
              {badge.label}
            </span>
            <span className="text-[12px] text-slate-400">·</span>
            <span className="text-[12px] text-slate-400">{guide.country}</span>
            <span className="text-[12px] text-slate-400">·</span>
            <span className="flex items-center gap-1 text-[12px] text-slate-400">
              <Clock size={11} />
              {guide.readingTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[34px] font-bold text-slate-900 leading-tight mb-4">
            {guide.title}
          </h1>
          <p className="text-[16px] text-slate-500 leading-relaxed max-w-2xl">
            {guide.intro}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">

          {/* Main content */}
          <div className="flex flex-col gap-8">

            {/* Key Facts */}
            {guide.keyFacts.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-[15px] font-bold text-slate-800 mb-4">Quick Facts</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {guide.keyFacts.map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
                      <span className="text-[14px] font-semibold text-slate-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sections */}
            {guide.sections.map((section, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6">
                <h2 className="text-[18px] font-bold text-slate-800 mb-3">{section.heading}</h2>
                <p className="text-[14.5px] text-slate-600 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}

            {/* Cross-cluster links — country/pricing pages for this guide's country */}
            {clusterLinks.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <InternalLinkCluster heading={`More on ${guide.country}`} links={clusterLinks} columns={2} />
              </div>
            )}

            {/* FAQs */}
            {guide.faqs.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <h2 className="text-[20px] font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
                <div className="flex flex-col divide-y divide-slate-100">
                  {guide.faqs.map((faq, i) => (
                    <div key={i} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="text-[14.5px] font-bold text-slate-800 mb-2">{faq.question}</h3>
                      <p className="text-[14px] text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">

            <ContentAttribution
              {...(attribution?.author && { author: attribution.author })}
              {...(attribution?.reviewer && { reviewer: attribution.reviewer })}
              lastReviewed={LAST_REVIEWED.guides}
              sources={COUNTRY_SOURCES[countrySlug] ?? []}
              sourceNote="Information reviewed against official government migration portals and regulatory body guidelines. Fees, timelines, and eligibility rules are indicative and should be verified against the issuing authority before applying."
            />

            {/* Related Guides — server-computed default order (editorial
                relatedSlugs, identical for every visitor/crawler); the
                widget itself may re-rank client-side toward the visitor's
                Market Context once resolved. See RecommendedGuides.tsx. */}
            <RecommendedGuides
              guides={guide.relatedSlugs
                .map((relSlug) => {
                  const rel = getGuide(relSlug)
                  return rel ? { slug: rel.slug, title: rel.title, sourceCountry: rel.sourceCountry } : null
                })
                .filter((g): g is NonNullable<typeof g> => g !== null)}
            />

            {/* CTA */}
            <div className="bg-primary rounded-2xl p-5 text-white">
              <h3 className="text-[14px] font-bold mb-2">Find a Verified Agency</h3>
              <p className="text-[12.5px] opacity-80 mb-4 leading-relaxed">
                Compare agencies handling {guide.country} nursing migration with real nurse reviews.
              </p>
              <a
                href="/agencies"
                className="flex items-center justify-center gap-1.5 h-9 bg-white text-primary text-[12.5px] font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Browse agencies
                <ArrowRight size={12} />
              </a>
            </div>

            {/* All Guides */}
            <a
              href="/guides"
              className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-2xl p-4 hover:border-primary/30 transition-colors group"
            >
              <span className="text-[13px] font-semibold text-slate-700 group-hover:text-primary transition-colors">
                View all guides
              </span>
              <ArrowRight size={13} className="text-slate-400 group-hover:text-primary transition-colors" />
            </a>

          </aside>
        </div>
      </div>

    </div>
  )
}
