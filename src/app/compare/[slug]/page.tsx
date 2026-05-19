import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CheckCircle, XCircle, Minus } from 'lucide-react'
import { getAllComparisons, getComparison } from '@/lib/data/comparisons'
import { buildComparisonMetadata } from '@/lib/seo/metadata'
import { buildFaqSchema, buildArticleSchema } from '@/lib/seo/schemas'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { ContentCluster } from '@/components/seo/RelatedContent'
import { FlagIcon } from '@/components/ui/FlagIcon'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = getComparison(slug)
  if (!data) return {}

  return buildComparisonMetadata({
    countryAName: data.countryAName,
    countryBName: data.countryBName,
    slug: data.slug,
    verdict: data.verdict,
  })
}

function WinnerIcon({ winner, side }: { winner: 'a' | 'b' | 'tie'; side: 'a' | 'b' }) {
  if (winner === 'tie') return <Minus size={14} className="text-slate-400" />
  if (winner === side) return <CheckCircle size={14} className="text-[#166534]" />
  return <XCircle size={14} className="text-slate-300" />
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params
  const data = getComparison(slug)
  if (!data) notFound()

  const schemas = [
    buildFaqSchema(data.faqs),
    buildArticleSchema({
      title: data.headline,
      description: data.verdict,
      path: `/compare/${data.slug}`,
      publishedDate: '2025-01-01',
    }),
  ]

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Compare', href: '/compare' },
    { name: `${data.countryAName} vs ${data.countryBName}`, href: `/compare/${slug}` },
  ]

  return (
    <>
      <MultiJsonLd schemas={schemas} />

      {/* Hero */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-4 max-w-2xl">
            <p className="text-[12px] font-semibold text-primary uppercase tracking-widest mb-3">
              Country Comparison
            </p>
            <h1 className="text-[30px] sm:text-[36px] font-bold text-slate-900 leading-tight mb-4">
              {data.headline}
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed">{data.intro}</p>
          </div>

          {/* Country header cards */}
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center flex flex-col items-center">
              <FlagIcon emoji={data.countryAFlag} size={40} className="rounded-sm" />
              <p className="text-[16px] font-bold text-slate-800 mt-2">{data.countryAName}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center flex flex-col items-center">
              <FlagIcon emoji={data.countryBFlag} size={40} className="rounded-sm" />
              <p className="text-[16px] font-bold text-slate-800 mt-2">{data.countryBName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <main className="flex-1 min-w-0 flex flex-col gap-12">
            {/* Verdict */}
            <section className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-6">
              <p className="text-[12px] font-semibold text-[#166534] uppercase tracking-wide mb-2">
                Our Verdict
              </p>
              <h2 className="text-[18px] font-bold text-slate-800 mb-2">{data.verdict}</h2>
              <p className="text-[14px] text-slate-600 leading-relaxed">{data.verdictDetails}</p>
            </section>

            {/* Metrics comparison table */}
            <section aria-labelledby="metrics-heading">
              <h2 id="metrics-heading" className="text-[20px] font-bold text-slate-800 mb-5">
                Side-by-Side Comparison
              </h2>

              {/* Header */}
              <div className="grid grid-cols-[1fr_1fr_1fr] bg-slate-50 border border-slate-200 rounded-t-2xl px-4 py-3 text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                <span>Factor</span>
                <span className="text-center flex items-center justify-center gap-1.5"><FlagIcon emoji={data.countryAFlag} size={16} className="rounded-sm" />{data.countryAName}</span>
                <span className="text-center flex items-center justify-center gap-1.5"><FlagIcon emoji={data.countryBFlag} size={16} className="rounded-sm" />{data.countryBName}</span>
              </div>

              <div className="border border-t-0 border-slate-200 rounded-b-2xl overflow-hidden">
                {data.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-[1fr_1fr_1fr] px-4 py-4 gap-4 ${
                      i < data.metrics.length - 1 ? 'border-b border-slate-100' : ''
                    } ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700">{metric.label}</p>
                      {metric.context && (
                        <p className="text-[11.5px] text-slate-400 mt-0.5 leading-snug">{metric.context}</p>
                      )}
                    </div>
                    <div className="flex items-start gap-1.5">
                      <WinnerIcon winner={metric.winner} side="a" />
                      <span className="text-[13px] text-slate-700">{metric.valueA}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <WinnerIcon winner={metric.winner} side="b" />
                      <span className="text-[13px] text-slate-700">{metric.valueB}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Who should choose */}
            <section>
              <h2 className="text-[20px] font-bold text-slate-800 mb-5">Who Should Choose Which?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FlagIcon emoji={data.countryAFlag} size={24} className="rounded-sm" />
                    <h3 className="text-[15px] font-bold text-slate-800">Choose {data.countryAName} if…</h3>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {data.whoShouldChooseA.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13.5px] text-slate-700 leading-relaxed">
                        <CheckCircle size={13} className="text-[#166534] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FlagIcon emoji={data.countryBFlag} size={24} className="rounded-sm" />
                    <h3 className="text-[15px] font-bold text-slate-800">Choose {data.countryBName} if…</h3>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {data.whoShouldChooseB.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13.5px] text-slate-700 leading-relaxed">
                        <CheckCircle size={13} className="text-[#166534] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ */}
            {data.faqs.length > 0 && (
              <section aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-[20px] font-bold text-slate-800 mb-5">
                  {data.countryAName} vs {data.countryBName} — FAQs
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

            {/* Related content */}
            <ContentCluster
              relatedCountrySlugs={data.relatedCountrySlugs}
              relatedPricingSlugs={data.relatedCountrySlugs}
              relatedComparisons={data.relatedComparisons.map((s) => ({
                slug: s,
                label: s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(' Vs ', ' vs '),
              }))}
              relatedSalaries={data.relatedCountrySlugs}
            />
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-[272px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[13px] font-bold text-slate-700 mb-3">Quick Verdict</p>
                <div className="flex flex-col gap-3 text-[13px]">
                  <div className="flex items-center gap-2">
                    <FlagIcon emoji={data.countryAFlag} size={20} className="rounded-sm" />
                    <span className="text-slate-600">{data.countryAName}</span>
                  </div>
                  <div className="text-center text-[11px] text-slate-400 font-semibold uppercase tracking-wide">vs</div>
                  <div className="flex items-center gap-2">
                    <FlagIcon emoji={data.countryBFlag} size={20} className="rounded-sm" />
                    <span className="text-slate-600">{data.countryBName}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[12px] text-slate-500 leading-relaxed">{data.verdict}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href={`/country/${data.countryASlug}`}
                  className="flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
                >
                  <FlagIcon emoji={data.countryAFlag} size={16} className="rounded-sm" />
                  {data.countryAName} Full Guide
                </a>
                <a
                  href={`/country/${data.countryBSlug}`}
                  className="flex items-center justify-center gap-1.5 h-10 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors"
                >
                  <FlagIcon emoji={data.countryBFlag} size={16} className="rounded-sm" />
                  {data.countryBName} Full Guide
                </a>
                <a
                  href={`/pricing/${data.countryASlug}`}
                  className="flex items-center justify-center h-10 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors"
                >
                  {data.countryAName} Migration Costs
                </a>
                <a
                  href={`/pricing/${data.countryBSlug}`}
                  className="flex items-center justify-center h-10 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors"
                >
                  {data.countryBName} Migration Costs
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
