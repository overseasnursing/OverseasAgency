import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Clock, HelpCircle, Target } from 'lucide-react'
import { getMockTestBySlug, getAllMockTestSlugs } from '@/lib/data/getMockTestData'

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
  const desc  = test.seo_description || `Take this ${test.duration_minutes}-minute nursing mock test with ${test.total_questions} questions. Part of ${category.name} prep.`
  return {
    title,
    description: desc,
    alternates: { canonical: `https://overseasnursing.com/mock-tests/${locationSlug}/${categorySlug}/${testSlug}` },
    openGraph: { title, description: desc },
  }
}

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`bg-slate-200 rounded animate-pulse ${className}`} />
}

export default async function TestPlaceholderPage({ params }: PageProps) {
  const { locationSlug, categorySlug, testSlug } = await params
  const data = await getMockTestBySlug(locationSlug, categorySlug, testSlug)
  if (!data) notFound()
  const { test, category, location } = data

  const passMarks = Math.ceil(test.total_questions * test.passing_percentage / 100)

  return (
    <div className="bg-surface-page min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-6 sm:py-8">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 mb-5 flex-wrap">
            <Link href="/mock-tests" className="hover:text-primary transition-colors font-medium">Mock Tests</Link>
            <ChevronRight size={12} />
            <Link href={`/mock-tests/${locationSlug}`} className="hover:text-primary transition-colors">{location.name}</Link>
            <ChevronRight size={12} />
            <Link href={`/mock-tests/${locationSlug}/${categorySlug}`} className="hover:text-primary transition-colors">{category.name}</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium line-clamp-1">{test.name}</span>
          </nav>
          <h1 className="text-title-sm font-bold text-slate-900">{test.name}</h1>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="max-w-xl mx-auto">

          {/* Exam ready card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden mb-6">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-primary to-blue-500" />

            <div className="p-7 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-[32px]">📝</span>
              </div>
              <h2 className="text-[20px] font-bold text-slate-800 mb-1">Ready to begin?</h2>
              <p className="text-[13.5px] text-slate-500 leading-relaxed">
                This exam engine is launching soon. Once live, your results and score will appear instantly after submission.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
              {[
                { icon: <Clock size={15} className="text-slate-400" />,     label: 'Duration',   value: `${test.duration_minutes} min` },
                { icon: <HelpCircle size={15} className="text-slate-400" />, label: 'Questions',  value: `${test.total_questions}` },
                { icon: <Target size={15} className="text-slate-400" />,    label: 'Pass Mark',  value: `${passMarks}/${test.total_questions}` },
              ].map(s => (
                <div key={s.label} className="py-4 text-center">
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <p className="text-[16px] font-bold text-slate-800">{s.value}</p>
                  <p className="text-[11px] text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Loading skeleton — represents the future exam UI */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <SkeletonPulse className="w-7 h-7 rounded-lg" />
              <SkeletonPulse className="h-4 w-40 rounded" />
            </div>
            <SkeletonPulse className="h-3 w-full rounded mb-2" />
            <SkeletonPulse className="h-3 w-5/6 rounded mb-5" />
            <div className="flex flex-col gap-2">
              {['A', 'B', 'C', 'D'].map(opt => (
                <div key={opt} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[12px] font-semibold text-slate-400">{opt}</div>
                  <SkeletonPulse className="h-3 flex-1 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Coming soon notice */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center mb-6">
            <p className="text-[13px] text-primary font-semibold mb-0.5">Exam Engine Coming Soon</p>
            <p className="text-[12px] text-slate-500">
              The interactive exam with timer, instant scoring and full explanations is being built now.
            </p>
          </div>

          {/* Back */}
          <div className="text-center">
            <Link
              href={`/mock-tests/${locationSlug}/${categorySlug}`}
              className="inline-flex items-center gap-2 h-10 px-6 border border-slate-200 hover:border-primary/30 text-slate-600 hover:text-primary text-[13px] font-medium rounded-xl transition-colors"
            >
              ← Back to {category.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
