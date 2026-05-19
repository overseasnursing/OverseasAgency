import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrendingUp, AlertCircle } from 'lucide-react'
import { getAllSalaries, getSalary } from '@/lib/data/salaries'
import { buildSalaryMetadata } from '@/lib/seo/metadata'
import { buildFaqSchema, buildArticleSchema } from '@/lib/seo/schemas'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { ContentCluster } from '@/components/seo/RelatedContent'
import { FlagIcon } from '@/components/ui/FlagIcon'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSalaries().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = getSalary(slug)
  if (!data) return {}

  return buildSalaryMetadata({
    countryName: data.countryName,
    slug: data.slug,
    averageSalary: data.averageSalary,
    inrEquivalent: `₹${(data.inrMonthlyMin / 100000).toFixed(1)}L–₹${(data.inrMonthlyMax / 100000).toFixed(1)}L/month`,
  })
}

const DEMAND_COLORS = {
  'very-high': 'text-[#166534] bg-[#DCFCE7]',
  high: 'text-[#1D4ED8] bg-[#DBEAFE]',
  moderate: 'text-slate-600 bg-slate-100',
}

const DEMAND_LABELS = {
  'very-high': 'Very High Demand',
  high: 'High Demand',
  moderate: 'Moderate Demand',
}

export default async function SalaryPage({ params }: PageProps) {
  const { slug } = await params
  const data = getSalary(slug)
  if (!data) notFound()

  const schemas = [
    buildFaqSchema(data.faqs),
    buildArticleSchema({
      title: data.headline,
      description: data.tagline,
      path: `/salary/${data.slug}`,
      publishedDate: '2025-01-01',
    }),
  ]

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: data.countryName, href: `/country/${data.countrySlug}` },
    { name: `${data.countryName} Nurse Salary`, href: `/salary/${slug}` },
  ]

  return (
    <>
      <MultiJsonLd schemas={schemas} />

      {/* Hero */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <FlagIcon emoji={data.countryFlag} size={28} className="rounded-sm" />
              <p className="text-[13px] font-semibold text-primary">
                {data.countryName} · Salary Guide {new Date().getFullYear()}
              </p>
            </div>
            <h1 className="text-[32px] sm:text-[38px] font-bold text-slate-900 leading-tight mb-2">
              {data.headline}
            </h1>
            <p className="text-[15px] text-slate-500 mb-6">{data.tagline}</p>

            {/* Salary hero stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
                <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Salary Range</p>
                <p className="text-[22px] font-bold text-slate-800">{data.salaryRangeDisplay}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
                <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">INR Equivalent</p>
                <p className="text-[22px] font-bold text-primary">
                  ₹{(data.inrMonthlyMin / 100000).toFixed(1)}L–₹{(data.inrMonthlyMax / 100000).toFixed(1)}L/month
                </p>
              </div>
              {data.taxFree && (
                <div className="bg-[#DCFCE7] border border-[#BBF7D0] rounded-2xl px-5 py-4">
                  <p className="text-[11px] text-[#166534] uppercase tracking-wide mb-1">Tax Status</p>
                  <p className="text-[18px] font-bold text-[#166534]">Tax-Free</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <main className="flex-1 min-w-0 flex flex-col gap-12">
            {/* By experience */}
            <section aria-labelledby="experience-heading">
              <h2 id="experience-heading" className="text-[20px] font-bold text-slate-800 mb-5">
                Salary by Experience Level
              </h2>
              <div className="flex flex-col gap-3">
                {data.byExperience.map((level, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-[14.5px] font-semibold text-slate-800 mb-0.5">
                          {level.level}
                        </h3>
                        <p className="text-[12.5px] text-slate-400">{level.yearsExperience}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 sm:text-right">
                        <div>
                          <p className="text-[11px] text-slate-400 uppercase tracking-wide">Local Salary</p>
                          <p className="text-[15px] font-bold text-slate-800">{level.localSalary}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400 uppercase tracking-wide">INR/month</p>
                          <p className="text-[15px] font-bold text-primary">{level.inrMonthly}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* By specialty */}
            <section aria-labelledby="specialty-heading">
              <h2 id="specialty-heading" className="text-[20px] font-bold text-slate-800 mb-5">
                Salary by Nursing Specialty
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.bySpecialty.map((spec, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[13.5px] font-semibold text-slate-800">{spec.specialty}</h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${DEMAND_COLORS[spec.demandLevel]}`}
                      >
                        {DEMAND_LABELS[spec.demandLevel]}
                      </span>
                    </div>
                    <p className="text-[14px] font-bold text-slate-800">{spec.localSalary}</p>
                    <p className="text-[12px] text-primary font-semibold">{spec.inrMonthly}/month</p>
                  </div>
                ))}
              </div>
            </section>

            {/* By city */}
            <section aria-labelledby="city-heading">
              <h2 id="city-heading" className="text-[20px] font-bold text-slate-800 mb-5">
                Salary by City
              </h2>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {data.byCity.map((city, i) => (
                  <div
                    key={i}
                    className={`flex items-start justify-between gap-4 px-5 py-4 ${
                      i < data.byCity.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div>
                      <p className="text-[13.5px] font-semibold text-slate-800">{city.city}</p>
                      {city.note && (
                        <p className="text-[12px] text-slate-400 mt-0.5">{city.note}</p>
                      )}
                    </div>
                    <p className="text-[14px] font-bold text-slate-700 flex-shrink-0">{city.localSalary}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Deductions note */}
            {data.deductionsNote && (
              <section className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-5">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-[#92400E] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#92400E] mb-1">
                      Tax & Deductions
                    </p>
                    <p className="text-[13px] text-[#92400E]/80 leading-relaxed">{data.deductionsNote}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Comparison note */}
            <section className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5">
              <div className="flex items-start gap-2">
                <TrendingUp size={16} className="text-[#1D4ED8] mt-0.5 flex-shrink-0" />
                <p className="text-[13.5px] text-[#1D4ED8]/80 leading-relaxed">{data.comparisonNote}</p>
              </div>
            </section>

            {/* FAQ */}
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-[20px] font-bold text-slate-800 mb-5">
                {data.countryName} Nurse Salary FAQs
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

            {/* Related content */}
            <ContentCluster
              relatedCountrySlugs={data.relatedCountrySlugs}
              relatedPricingSlugs={data.relatedCountrySlugs}
              relatedSalaries={data.relatedSlugs.map((s) => s.replace('-nurse-salary', ''))}
            />
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-[272px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FlagIcon emoji={data.countryFlag} size={28} className="rounded-sm" />
                  <div>
                    <p className="text-[13px] font-bold text-slate-800">{data.countryName}</p>
                    <p className="text-[11px] text-slate-400">Nurse Salary 2025</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Average salary</span>
                    <span className="font-semibold text-slate-700">{data.averageSalary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">INR equivalent</span>
                    <span className="font-bold text-primary">
                      ₹{(data.inrMonthlyMin / 100000).toFixed(1)}L–₹{(data.inrMonthlyMax / 100000).toFixed(1)}L/mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax-free</span>
                    <span className={`font-semibold ${data.taxFree ? 'text-[#166534]' : 'text-slate-600'}`}>
                      {data.taxFree ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Updated</span>
                    <span className="text-slate-500">{data.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href={`/country/${data.countrySlug}`}
                  className="flex items-center justify-center h-10 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors"
                >
                  Full {data.countryName} Guide
                </a>
                <a
                  href={`/pricing/${data.countrySlug}`}
                  className="flex items-center justify-center h-10 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors"
                >
                  Migration Costs
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
