import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen, Clock, HelpCircle } from 'lucide-react'
import { getMockTestLocationWithCategories, getAllMockTestLocationSlugs } from '@/lib/data/getMockTestData'
import { getExamGuidesForLocation } from '@/lib/data/exams'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

export const revalidate = 3600

type PageProps = { params: Promise<{ locationSlug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllMockTestLocationSlugs()
  return slugs.map(s => ({ locationSlug: s }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug } = await params
  const data = await getMockTestLocationWithCategories(locationSlug)
  if (!data) return {}
  const { location } = data
  const title = `${location.name} — Free Nursing Mock Tests | OverseasNursing`
  const desc  = location.description || `Practice ${location.name} nursing licensing exams with free timed mock tests.`
  return {
    title,
    description: desc,
    alternates: { canonical: `https://overseasnursing.com/mock-tests/${locationSlug}` },
    openGraph: { title, description: desc, url: `https://overseasnursing.com/mock-tests/${locationSlug}` },
  }
}

const DIFF_STYLE = {
  easy:   { label: 'Easy',   cls: 'bg-[#DCFCE7] text-[#166534] border-green-100' },
  medium: { label: 'Medium', cls: 'bg-[#FEF3C7] text-[#92400E] border-amber-100' },
  hard:   { label: 'Hard',   cls: 'bg-[#FEE2E2] text-[#B91C1C] border-red-100' },
}

export default async function LocationPage({ params }: PageProps) {
  const { locationSlug } = await params
  const data = await getMockTestLocationWithCategories(locationSlug)
  if (!data) notFound()
  const { location, categories } = data

  const examGuides = getExamGuidesForLocation(location.slug, location.name)

  const schemas = [
    buildWebPageSchema({
      title: `${location.name} — Free Nursing Mock Tests | OverseasNursing`,
      description: location.description || `Practice ${location.name} nursing licensing exams with free timed mock tests.`,
      path: `/mock-tests/${locationSlug}`,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Mock Tests', href: '/mock-tests' },
      { name: location.name, href: `/mock-tests/${locationSlug}` },
    ]),
  ]

  return (
    <div className="bg-surface-page min-h-screen">
      <MultiJsonLd schemas={schemas} />

      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 mb-5 flex-wrap">
            <Link href="/mock-tests" className="hover:text-primary transition-colors font-medium">Mock Tests</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium">{location.name}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-title-sm font-bold text-slate-900">{location.name}</h1>
              {location.description && (
                <p className="text-[14px] text-slate-500 mt-1.5 max-w-[640px] leading-relaxed">{location.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="text-[12.5px] text-slate-500">
                  <span className="font-semibold text-slate-800">{categories.length}</span> Exam Categor{categories.length !== 1 ? 'ies' : 'y'}
                </span>
                <span className="text-[12.5px] text-slate-500">
                  <span className="font-semibold text-slate-800">{categories.reduce((s, c) => s + c.test_count, 0)}</span> Mock Tests
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8">

        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
            <HelpCircle size={36} className="text-slate-300 mx-auto mb-4" />
            <h2 className="text-[16px] font-semibold text-slate-600 mb-2">No categories yet</h2>
            <p className="text-[13px] text-slate-400">We&apos;re adding exam categories soon. Check back shortly.</p>
          </div>
        ) : (
          <>
            <h2 className="text-[15px] font-bold text-slate-700 mb-5">Choose an Exam Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {categories.map(cat => {
                const diff = DIFF_STYLE[cat.difficulty]
                return (
                  <div key={cat.id} className="bg-white border border-slate-200 rounded-card shadow-card hover:shadow-card-md transition-all flex flex-col group">
                    <div className="p-5 flex flex-col flex-1 gap-4">
                      {/* Title + diff */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[16px] font-bold text-slate-800 leading-tight flex-1">{cat.name}</h3>
                        <span className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-badge border ${diff.cls}`}>
                          {diff.label}
                        </span>
                      </div>

                      {/* Description */}
                      {cat.description && (
                        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3">{cat.description}</p>
                      )}

                      {/* Stats */}
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                          <HelpCircle size={11} className="text-slate-400" />
                          <span><span className="font-semibold text-slate-700">{cat.test_count}</span> Mock Tests</span>
                        </div>
                        {cat.avg_duration > 0 && (
                          <div className="flex items-center gap-1.5 text-[12px] text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                            <Clock size={11} className="text-slate-400" />
                            <span>~<span className="font-semibold text-slate-700">{cat.avg_duration}</span> min avg</span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="pt-3 border-t border-slate-100 mt-auto">
                        <Link
                          href={`/mock-tests/${location.slug}/${cat.slug}`}
                          className="flex items-center justify-between w-full h-9 px-4 border border-primary/30 bg-primary/5 hover:bg-primary hover:text-white text-primary text-[13px] font-semibold rounded-xl transition-all"
                        >
                          <span>View Mock Tests</span>
                          <ChevronRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Exam guide links — reciprocal link to theory prep */}
        {examGuides.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h2 className="text-[14px] font-bold text-slate-700 mb-4">Study the Theory First</h2>
            <div className="flex flex-col gap-3">
              {examGuides.map((guide) => (
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
          </div>
        )}
      </div>
    </div>
  )
}
