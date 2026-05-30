import type { Metadata } from 'next'
import { getAllComparisons } from '@/lib/data/comparisons'
import { ArrowRight, BarChart2, TrendingUp, BookOpen } from 'lucide-react'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Compare Nursing Destinations — Germany vs UK, Australia vs Canada & More',
  description: 'Side-by-side comparisons of top overseas nursing destinations. Salary, visa timelines, language requirements, and migration costs compared.',
  alternates: { canonical: '/compare' },
}

const COMPARE_HUB_SCHEMAS = [
  buildWebPageSchema({
    title: 'Compare Nursing Destinations — Germany vs UK, Australia vs Canada & More',
    description: 'Side-by-side comparisons of top overseas nursing destinations. Salary, visa timelines, language requirements, and migration costs compared.',
    path: '/compare',
  }),
  buildBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Compare', href: '/compare' },
  ]),
]

export default function CompareIndexPage() {
  const comparisons = getAllComparisons()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <MultiJsonLd schemas={COMPARE_HUB_SCHEMAS} />
      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 py-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 text-primary rounded-full text-[12px] font-semibold uppercase tracking-wide mb-5">
            <BarChart2 size={11} />
            Country Comparisons
          </div>
          <h1 className="text-[32px] sm:text-[40px] font-bold text-slate-900 leading-tight mb-3">
            Compare Nursing Destinations
          </h1>
          <p className="text-[16px] text-slate-500 max-w-xl leading-relaxed">
            Side-by-side data on salary, visa timelines, language requirements, and migration costs
            to help you choose the right country.
          </p>
        </div>
      </div>

      {/* Related resources strip */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-[12.5px] text-slate-400 font-medium">Also explore:</span>
          <a
            href="/salary"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <TrendingUp size={13} /> Salary Guides
          </a>
          <a
            href="/exam"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <BookOpen size={13} /> Exam Guides
          </a>
        </div>
      </div>

      {/* Comparison cards */}
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="grid sm:grid-cols-2 gap-5">
          {comparisons.map((c) => (
            <a
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[32px]">{c.countryAFlag}</span>
                <span className="text-[18px] font-bold text-slate-300">vs</span>
                <span className="text-[32px]">{c.countryBFlag}</span>
              </div>
              <h2 className="text-[16px] font-bold text-slate-800 mb-2">
                {c.countryAName} vs {c.countryBName}
              </h2>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-4 line-clamp-2">
                {c.verdict}
              </p>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-primary group-hover:gap-2.5 transition-all">
                See full comparison
                <ArrowRight size={13} />
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
