import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CheckCircle, XCircle, Clock, DollarSign, ShieldCheck } from 'lucide-react'
import { getAllExams, getExam } from '@/lib/data/exams'
import { getMockTestLocationsForExam } from '@/lib/data/getMockTestData'
import { buildExamMetadata } from '@/lib/seo/metadata'
import { buildFaqSchema, buildArticleSchema, buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { ContentCluster } from '@/components/seo/RelatedContent'
import { ContentAttribution, type AttributionSource } from '@/components/seo/ContentAttribution'
import { getAttributionProfiles } from '@/lib/admin-profile'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllExams().map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = getExam(slug)
  if (!data) return {}

  return buildExamMetadata({
    examName: data.examName,
    slug: data.slug,
    applicableCountries: data.applicableCountries,
    prepTimeMonths: data.prepTimeMonths,
  })
}

const EXAM_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  language: { label: 'Language Test', color: 'text-[#7E22CE] bg-[#F3E8FF]' },
  'nursing-competency': { label: 'Clinical Assessment', color: 'text-[#0F4C81] bg-[#DBEAFE]' },
  registration: { label: 'Registration', color: 'text-[#166534] bg-[#DCFCE7]' },
  licensing: { label: 'Licensing Exam', color: 'text-[#92400E] bg-[#FEF3C7]' },
}

const EXAM_EXTRA_SOURCES: Record<string, AttributionSource[]> = {
  'oet-guide': [
    { label: 'Nursing and Midwifery Council (NMC), United Kingdom' },
    { label: 'Australian Health Practitioner Regulation Agency (AHPRA)' },
  ],
  'ielts-guide': [
    { label: 'Nursing and Midwifery Council (NMC), United Kingdom' },
    { label: 'Australian Health Practitioner Regulation Agency (AHPRA)' },
    { label: 'German Federal Employment Agency (Bundesagentur für Arbeit)' },
  ],
  'nclex-rn-guide': [
    { label: 'National Council of State Boards of Nursing (NCSBN)' },
    { label: 'Canadian Nurses Association (CNA)' },
    { label: 'National Nursing Assessment Service (NNAS), Canada' },
  ],
  'dha-exam-guide': [
    { label: 'Dubai Health Authority (DHA) — Health Regulation Sector' },
    { label: 'Prometric — Authorised Testing Provider' },
  ],
  'ahpra-registration-guide': [
    { label: 'Australian Health Practitioner Regulation Agency (AHPRA)' },
    { label: 'Australian Nursing and Midwifery Accreditation Council (ANMAC)' },
    { label: 'Australian Department of Home Affairs' },
  ],
  'cbse-osce-guide': [
    { label: 'Nursing and Midwifery Council (NMC) — Test of Competence' },
    { label: 'Pearson VUE — Authorised NMC CBT Provider' },
  ],
  'haad-exam-guide': [
    { label: 'Prometric — Authorised Testing Provider' },
    { label: 'General Directorate of Residency and Foreigners Affairs (GDRFA), Dubai' },
  ],
  'moh-exam-guide': [
    { label: 'Prometric — Authorised Testing Provider' },
    { label: 'Ministry of Human Resources & Emiratisation (MOHRE), UAE' },
  ],
}

// Maps exam guide slug → keywords that match mock_test_locations slug/name in the DB.
// Only exams with supported mock-test content are listed.
const MOCK_TEST_KEYWORDS: Record<string, string[]> = {
  'oet-guide':              ['oet'],
  'ielts-guide':            ['ielts'],
  'nclex-rn-guide':         ['nclex'],
  'dha-exam-guide':         ['dha'],
  'haad-exam-guide':        ['haad'],
  'moh-exam-guide':         ['moh'],
  'cbse-osce-guide':        ['cbse', 'osce', 'nmc', 'cbt'],
  'ahpra-registration-guide': ['ahpra'],
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params
  const data = getExam(slug)
  if (!data) notFound()

  const [attribution, mockTestLocations] = await Promise.all([
    getAttributionProfiles(),
    getMockTestLocationsForExam(MOCK_TEST_KEYWORDS[slug] ?? []),
  ])

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Exam Guides', href: '/exam' },
    { name: data.examName, href: `/exam/${slug}` },
  ]

  const schemas = [
    buildFaqSchema(data.faqs),
    buildArticleSchema({
      title: data.headline,
      description: data.tagline,
      path: `/exam/${data.slug}`,
      publishedDate: '2025-01-01',
      modifiedDate: '2025-01-01',
    }),
    buildWebPageSchema({
      title: data.headline,
      description: data.tagline,
      path: `/exam/${data.slug}`,
    }),
    buildBreadcrumbSchema(breadcrumbItems),
  ]

  const examTypeStyle = EXAM_TYPE_LABELS[data.examType] ?? EXAM_TYPE_LABELS.registration

  return (
    <>
      <MultiJsonLd schemas={schemas} />

      {/* Hero */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-4 max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${examTypeStyle.color}`}>
                {examTypeStyle.label}
              </span>
              {data.applicableCountries.map((c) => (
                <span key={c} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {c}
                </span>
              ))}
            </div>
            <h1 className="text-[30px] sm:text-[36px] font-bold text-slate-900 leading-tight mb-3">
              {data.headline}
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">{data.tagline}</p>

            {/* Key facts strip */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                <Clock size={14} className="text-slate-400" />
                <span className="text-[13px] font-semibold text-slate-700">
                  {data.prepTimeMonths.min}–{data.prepTimeMonths.max} month prep
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                <DollarSign size={14} className="text-slate-400" />
                <span className="text-[13px] font-semibold text-slate-700">
                  ₹{(data.registrationFeeINR / 1000).toFixed(0)}K fee
                </span>
              </div>
              {data.passRate && (
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                  <ShieldCheck size={14} className="text-slate-400" />
                  <span className="text-[13px] font-semibold text-slate-700">{data.passRate.split('.')[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <main className="flex-1 min-w-0 flex flex-col gap-12">
            {/* Overview */}
            <section>
              <h2 className="text-[20px] font-bold text-slate-800 mb-3">What is the {data.examName}?</h2>
              <p className="text-[14.5px] text-slate-600 leading-relaxed">{data.overview}</p>
            </section>

            {/* Key details */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="text-[16px] font-bold text-slate-800 mb-4">Key Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[13px]">
                <div>
                  <p className="text-slate-400 mb-0.5">Passing Score</p>
                  <p className="font-semibold text-slate-800">{data.passingScore}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Preparation Time</p>
                  <p className="font-semibold text-slate-800">
                    {data.prepTimeMonths.min}–{data.prepTimeMonths.max} months
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Registration Fee</p>
                  <p className="font-semibold text-slate-800">≈ ₹{(data.registrationFeeINR / 1000).toFixed(0)}K</p>
                </div>
                {data.validity && (
                  <div>
                    <p className="text-slate-400 mb-0.5">Result Validity</p>
                    <p className="font-semibold text-slate-800">{data.validity}</p>
                  </div>
                )}
                {data.passRate && (
                  <div>
                    <p className="text-slate-400 mb-0.5">Pass Rate (Indian nurses)</p>
                    <p className="font-semibold text-slate-800">{data.passRate}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-400 mb-0.5">Mandatory for</p>
                  <p className="font-semibold text-slate-800">{data.applicableCountries.join(', ')}</p>
                </div>
              </div>
            </section>

            {/* Sections */}
            <section aria-labelledby="sections-heading">
              <h2 id="sections-heading" className="text-[20px] font-bold text-slate-800 mb-5">
                Exam Structure
              </h2>
              <div className="flex flex-col gap-4">
                {data.sections.map((section, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-[15px] font-bold text-slate-800">{section.name}</h3>
                      <div className="flex gap-3 flex-shrink-0 text-right">
                        {section.duration && (
                          <span className="text-[12px] text-slate-400">{section.duration}</span>
                        )}
                        {section.scoreRequired && (
                          <span className="text-[12px] font-semibold text-primary">{section.scoreRequired}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[13.5px] text-slate-600 leading-relaxed">{section.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Prep tips */}
            <section className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-6">
              <h2 className="text-[18px] font-bold text-slate-800 mb-4">
                Preparation Tips for Indian Nurses
              </h2>
              <ul className="flex flex-col gap-3">
                {data.prepTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={14} className="text-[#166534] mt-0.5 flex-shrink-0" />
                    <span className="text-[13.5px] text-slate-700 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Common mistakes */}
            <section className="bg-[#FFF5F5] border border-[#FECACA] rounded-2xl p-6">
              <h2 className="text-[18px] font-bold text-slate-800 mb-4">Common Mistakes to Avoid</h2>
              <ul className="flex flex-col gap-3">
                {data.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <XCircle size={14} className="text-[#DC2626] mt-0.5 flex-shrink-0" />
                    <span className="text-[13.5px] text-slate-700 leading-relaxed">{mistake}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Practice This Exam — only rendered when matching mock-test content exists in DB */}
            {mockTestLocations.length > 0 && (
              <section aria-labelledby="practice-heading">
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6">
                  <h2 id="practice-heading" className="text-[18px] font-bold text-slate-800 mb-2">
                    Practice This Exam
                  </h2>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-4">
                    Reading the guide is step one. Scoring consistently under timed conditions is step two.
                    Take a free {data.examName} mock test to benchmark your readiness and identify weak areas before your actual sitting.
                  </p>
                  <ul className="flex flex-col gap-2 mb-5">
                    {[
                      'Timed simulation — mirrors the real exam format',
                      'Instant results with full explanations after submission',
                      'No negative marking — attempt every question confidently',
                      'Free to take — no subscription required',
                    ].map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2.5 text-[13px] text-slate-600">
                        <CheckCircle size={13} className="text-[#166534] flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    {mockTestLocations.map((loc) => (
                      <a
                        key={loc.slug}
                        href={`/mock-tests/${loc.slug}`}
                        className="inline-flex items-center gap-2 h-11 px-6 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
                      >
                        Take {data.examName} Mock Test
                        {loc.test_count > 0 && (
                          <span className="text-[11px] font-medium bg-white/20 px-1.5 py-0.5 rounded-full">
                            {loc.test_count} free
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* FAQ */}
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-[20px] font-bold text-slate-800 mb-5">
                {data.examName} FAQs for Indian Nurses
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
              relatedExams={data.relatedExamSlugs.map((s) => ({
                slug: s,
                name: s.replace(/-guide$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                countries: 'Multiple countries',
              }))}
            />

            <ContentAttribution
              {...(attribution?.author && { author: attribution.author })}
              {...(attribution?.reviewer && { reviewer: attribution.reviewer })}
              lastReviewed={data.lastUpdated}
              sources={[
                ...(data.registrationUrl
                  ? [{ label: `${data.examName} — Official Registration`, url: data.registrationUrl }]
                  : []),
                ...(EXAM_EXTRA_SOURCES[data.slug] ?? []),
              ]}
              sourceNote="Information reviewed against official exam body publications, candidate handbooks, and regulatory guidelines. Fees and timelines are indicative and should be verified against the issuing authority before applying."
            />
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-[272px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">
              {/* Quick facts */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  {data.examName} at a Glance
                </p>
                <div className="flex flex-col gap-2.5 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prep time</span>
                    <span className="font-semibold text-slate-700">
                      {data.prepTimeMonths.min}–{data.prepTimeMonths.max} months
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Exam fee</span>
                    <span className="font-semibold text-slate-700">≈ ₹{(data.registrationFeeINR / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pass score</span>
                    <span className="font-semibold text-slate-700 text-right max-w-[120px]">{data.passingScore.split('(')[0].trim()}</span>
                  </div>
                  {data.validity && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Valid for</span>
                      <span className="font-semibold text-slate-700">{data.validity.split(' ')[0]} {data.validity.split(' ')[1]}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Updated</span>
                    <span className="text-slate-400">{data.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Applicable countries */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Required For
                </p>
                <div className="flex flex-col gap-1.5">
                  {data.applicableCountrySlugs.map((countrySlug) => (
                    <a
                      key={countrySlug}
                      href={`/country/${countrySlug}`}
                      className="text-[13px] text-slate-600 hover:text-primary transition-colors"
                    >
                      {countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1)} Migration Guide →
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href="/agencies"
                  className="flex items-center justify-center h-10 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors"
                >
                  Find an Agency
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
