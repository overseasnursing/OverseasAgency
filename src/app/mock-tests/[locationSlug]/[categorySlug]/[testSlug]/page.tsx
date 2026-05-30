import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Clock, HelpCircle, Target, CheckCircle, Zap, BarChart2, ShieldCheck } from 'lucide-react'
import { getMockTestBySlug, getAllMockTestSlugs } from '@/lib/data/getMockTestData'
import { getExamGuidesForLocation } from '@/lib/data/exams'
import { TestStartButton } from './_components/TestStartButton'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ locationSlug: string; categorySlug: string; testSlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllMockTestSlugs()
  return slugs.map(s => ({
    locationSlug: s.locationSlug,
    categorySlug: s.categorySlug,
    testSlug: s.testSlug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, categorySlug, testSlug } = await params
  const data = await getMockTestBySlug(locationSlug, categorySlug, testSlug)
  if (!data) return {}
  const { test, category } = data
  const title = test.seo_title || `${test.name} — Free Nursing Mock Test | OverseasNursing`
  const desc  = test.seo_description || `Take this ${test.duration_minutes}-minute ${category.name} mock test with ${test.total_questions} questions. Instant results and full explanations.`
  return {
    title,
    description: desc,
    alternates: { canonical: `https://overseasnursing.com/mock-tests/${locationSlug}/${categorySlug}/${testSlug}` },
    openGraph: { title, description: desc },
  }
}

function getDifficulty(pp: number): { label: string; cls: string } {
  if (pp >= 70) return { label: 'Hard',   cls: 'bg-[#FEE2E2] text-[#B91C1C] border-red-100' }
  if (pp >= 55) return { label: 'Medium', cls: 'bg-[#FEF3C7] text-[#92400E] border-amber-100' }
  return           { label: 'Easy',   cls: 'bg-[#DCFCE7] text-[#166534] border-green-100' }
}

export default async function TestLandingPage({ params }: PageProps) {
  const { locationSlug, categorySlug, testSlug } = await params
  const data = await getMockTestBySlug(locationSlug, categorySlug, testSlug)
  if (!data) notFound()
  const { test, category, location } = data

  const passMarks  = Math.ceil(test.total_questions * test.passing_percentage / 100)
  const diff       = getDifficulty(test.passing_percentage)
  const examGuides = getExamGuidesForLocation(location.slug, location.name)

  const pageTitle = test.seo_title || `${test.name} — Free Nursing Mock Test | OverseasNursing`
  const pageDesc  = test.seo_description || `Take this ${test.duration_minutes}-minute ${category.name} mock test with ${test.total_questions} questions. Instant results and full explanations.`
  const schemas = [
    buildWebPageSchema({ title: pageTitle, description: pageDesc, path: `/mock-tests/${locationSlug}/${categorySlug}/${testSlug}` }),
    buildBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Mock Tests', href: '/mock-tests' },
      { name: location.name, href: `/mock-tests/${locationSlug}` },
      { name: category.name, href: `/mock-tests/${locationSlug}/${categorySlug}` },
      { name: test.name, href: `/mock-tests/${locationSlug}/${categorySlug}/${testSlug}` },
    ]),
  ]

  const description = test.seo_description ||
    `This ${test.duration_minutes}-minute mock test contains ${test.total_questions} multiple-choice questions from the ${category.name} curriculum. It simulates real exam conditions to help you gauge your readiness and identify areas to improve before sitting the actual exam.`

  const BENEFITS = [
    { icon: <Clock size={15} className="text-primary" />,        text: `${test.duration_minutes}-minute timed simulation — mirrors real exam conditions` },
    { icon: <Zap size={15} className="text-[#D97706]" />,        text: 'Instant results — score and explanations revealed after submission' },
    { icon: <CheckCircle size={15} className="text-[#166534]" />, text: 'No negative marking — attempt every question without penalty' },
    { icon: <BarChart2 size={15} className="text-[#6D28D9]" />,  text: 'Score history tracked across all your attempts' },
    { icon: <ShieldCheck size={15} className="text-[#0F4C81]" />, text: 'Questions reviewed for clinical and regulatory accuracy' },
    { icon: <HelpCircle size={15} className="text-slate-500" />,  text: 'Multiple-choice format with A, B, C, D options' },
  ]

  return (
    <div className="bg-surface-page min-h-screen">
      <MultiJsonLd schemas={schemas} />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-6 sm:py-8">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 mb-5 flex-wrap">
            <Link href="/mock-tests" className="hover:text-primary transition-colors font-medium">Mock Tests</Link>
            <ChevronRight size={12} />
            <Link href={`/mock-tests/${locationSlug}`} className="hover:text-primary transition-colors">{location.name}</Link>
            <ChevronRight size={12} />
            <Link href={`/mock-tests/${locationSlug}/${categorySlug}`} className="hover:text-primary transition-colors">{category.name}</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium">{test.name}</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[11.5px] font-semibold text-primary bg-primary/10 border border-primary/15 px-2.5 py-0.5 rounded-full">
              {category.name}
            </span>
            <span className={`text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full border ${diff.cls}`}>
              {diff.label}
            </span>
            <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] border border-green-100">
              Free
            </span>
            <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
              ⚡ Instant Results
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[34px] font-bold text-slate-900 leading-tight mb-5">
            {test.name}
          </h1>

          {/* Key stats strip */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <Clock size={14} className="text-slate-400" />,     label: 'Duration',        value: `${test.duration_minutes} min` },
              { icon: <HelpCircle size={14} className="text-slate-400" />, label: 'Questions',       value: `${test.total_questions}` },
              { icon: <Target size={14} className="text-slate-400" />,    label: 'Pass Mark',        value: `${passMarks} / ${test.total_questions}` },
              { icon: <BarChart2 size={14} className="text-slate-400" />, label: 'Passing Score',    value: `${test.passing_percentage}%` },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5">
                {s.icon}
                <div>
                  <p className="text-[13.5px] font-bold text-slate-800 leading-tight">{s.value}</p>
                  <p className="text-[10.5px] text-slate-400 leading-tight">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

          {/* ── Main content ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">

            {/* Description */}
            <section>
              <h2 className="text-[17px] font-bold text-slate-800 mb-3">About This Test</h2>
              <p className="text-[14px] text-slate-600 leading-relaxed">{description}</p>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="text-[17px] font-bold text-slate-800 mb-4">What You Get</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl p-4">
                    <span className="mt-0.5 flex-shrink-0">{b.icon}</span>
                    <p className="text-[13px] text-slate-600 leading-snug">{b.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructions */}
            {test.instructions && (
              <section>
                <h2 className="text-[17px] font-bold text-slate-800 mb-3">Before You Begin</h2>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-[13.5px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {test.instructions}
                </div>
              </section>
            )}

            {/* Grading scale */}
            <section>
              <h2 className="text-[17px] font-bold text-slate-800 mb-1">How Your Score Is Graded</h2>
              <p className="text-[12.5px] text-slate-400 mb-4">Results are shown immediately after you submit</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { emoji: '🏆', range: '90%+',      label: 'Excellent',     bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-800' },
                  { emoji: '🥈', range: '75–89%',    label: 'Very Good',     bg: 'bg-blue-50',   border: 'border-blue-100',   text: 'text-blue-800' },
                  { emoji: '👍', range: '45–74%',    label: 'Pass',          bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-800' },
                  { emoji: '❌', range: 'Below 45%', label: 'Needs Review',  bg: 'bg-red-50',    border: 'border-red-100',    text: 'text-red-700' },
                ].map(g => (
                  <div key={g.label} className={`flex flex-col items-center text-center p-3.5 rounded-xl border ${g.bg} ${g.border}`}>
                    <span className="text-[22px] mb-1">{g.emoji}</span>
                    <p className={`text-[13px] font-bold ${g.text}`}>{g.range}</p>
                    <p className={`text-[11px] font-medium mt-0.5 opacity-80 ${g.text}`}>{g.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Exam guide links */}
            {examGuides.length > 0 && (
              <section>
                <h2 className="text-[17px] font-bold text-slate-800 mb-4">Study the Theory First</h2>
                <div className="flex flex-col gap-3">
                  {examGuides.map(guide => (
                    <Link
                      key={guide.slug}
                      href={`/exam/${guide.slug}`}
                      className="flex items-center justify-between px-5 py-4 bg-white border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.02] rounded-2xl transition-all group"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-slate-800 group-hover:text-primary transition-colors">
                          {guide.examName} Exam Guide
                        </p>
                        <p className="text-[12.5px] text-slate-400 mt-0.5">{guide.examFullName}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA (mobile — shown below content) */}
            <div className="lg:hidden">
              <TestStartButton
                testId={test.id}
                locationSlug={locationSlug}
                categorySlug={categorySlug}
                testSlug={testSlug}
              />
            </div>

            {/* Back link */}
            <Link
              href={`/mock-tests/${locationSlug}/${categorySlug}`}
              className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-primary transition-colors"
            >
              ← Back to {category.name}
            </Link>
          </div>

          {/* ── Sidebar (desktop) ─────────────────────────────────── */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-5">

              {/* CTA card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
                <div className="mb-4">
                  <p className="text-[13px] font-semibold text-slate-700 mb-0.5">{test.name}</p>
                  <p className="text-[12px] text-slate-400">{category.name}</p>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 border border-slate-100 rounded-xl mb-4">
                  {[
                    { value: `${test.duration_minutes}`, unit: 'Min' },
                    { value: `${test.total_questions}`,  unit: 'Qs' },
                    { value: `${passMarks}`,             unit: 'Pass' },
                  ].map(s => (
                    <div key={s.unit} className="py-3 text-center">
                      <p className="text-[17px] font-bold text-slate-800">{s.value}</p>
                      <p className="text-[10.5px] text-slate-400">{s.unit}</p>
                    </div>
                  ))}
                </div>

                <TestStartButton
                  testId={test.id}
                  locationSlug={locationSlug}
                  categorySlug={categorySlug}
                  testSlug={testSlug}
                />
              </div>

              {/* Test detail card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Test Details</p>
                <div className="flex flex-col gap-2.5 text-[13px]">
                  {[
                    { label: 'Duration',       value: `${test.duration_minutes} minutes` },
                    { label: 'Questions',      value: `${test.total_questions} MCQs` },
                    { label: 'Passing score',  value: `${test.passing_percentage}%` },
                    { label: 'Pass mark',      value: `${passMarks} / ${test.total_questions} correct` },
                    { label: 'Difficulty',     value: diff.label },
                    { label: 'Format',         value: 'Multiple Choice (A–D)' },
                    { label: 'Negative marks', value: 'None' },
                    { label: 'Results',        value: 'Instant' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between gap-3">
                      <span className="text-slate-400">{r.label}</span>
                      <span className="font-semibold text-slate-700 text-right">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam guide links (sidebar) */}
              {examGuides.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Study the Theory</p>
                  <div className="flex flex-col gap-2">
                    {examGuides.map(guide => (
                      <Link
                        key={guide.slug}
                        href={`/exam/${guide.slug}`}
                        className="flex items-center justify-between text-[13px] text-slate-700 hover:text-primary transition-colors group py-1"
                      >
                        <span className="font-medium group-hover:underline">{guide.examName} Exam Guide</span>
                        <ChevronRight size={13} className="text-slate-400 group-hover:text-primary flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
