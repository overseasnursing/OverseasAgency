import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, TrendingUp, BookOpen, BarChart2 } from 'lucide-react'
import { getAllSalaries } from '@/lib/data/salaries'
import { buildWebPageSchema } from '@/lib/seo/schemas'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { FlagIcon } from '@/components/ui/FlagIcon'

export const metadata: Metadata = {
  title: 'International Nurse Salary Guide 2025 — Germany, UK, Canada, Australia & Dubai | OverseasNursing',
  description:
    'Compare nurse salaries across top migration destinations for Indian nurses — Germany, UK, Canada, Australia, and Dubai. INR equivalents, experience-level breakdowns, tax notes, and specialty pay.',
  alternates: { canonical: 'https://overseasnursing.com/salary' },
  openGraph: {
    title: 'International Nurse Salary Guide 2025 — OverseasNursing',
    description:
      'Compare nurse salaries across Germany, UK, Canada, Australia, and Dubai. INR equivalents, specialty pay, and tax notes for Indian nurses.',
  },
}

const breadcrumbItems = [
  { name: 'Home', href: '/' },
  { name: 'Salary Guides', href: '/salary' },
]

export default function SalaryIndexPage() {
  const salaries = getAllSalaries()

  const webPageSchema = buildWebPageSchema({
    title: 'International Nurse Salary Guide 2025 — Germany, UK, Canada, Australia & Dubai',
    description:
      'Compare nurse salaries across top migration destinations for Indian nurses — Germany, UK, Canada, Australia, and Dubai. INR equivalents, experience-level breakdowns, tax notes, and specialty pay.',
    path: '/salary',
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MultiJsonLd schemas={[webPageSchema]} />

      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-5 max-w-2xl">
            <h1 className="text-[30px] sm:text-[36px] font-bold text-slate-900 mb-3">
              International Nurse Salary Guide 2025
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed">
              A higher-level guide to international nursing salaries for Indian nurses. Compare gross pay,
              net take-home in INR, tax deductions, specialty premiums, and city-level differences across
              the top five migration destinations.
            </p>
          </div>

          {/* Summary strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {salaries.map((s) => (
              <Link
                key={s.slug}
                href={`/salary/${s.slug}`}
                className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 hover:border-primary/40 hover:bg-white transition-all"
              >
                <FlagIcon emoji={s.countryFlag} size={18} className="rounded-sm flex-shrink-0" />
                <span className="text-[12.5px] font-semibold text-slate-700">{s.countryName}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Salary cards */}
      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-5">
          {salaries.map((s) => (
            <Link
              key={s.slug}
              href={`/salary/${s.slug}`}
              className="group bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                {/* Country identity */}
                <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                  <FlagIcon emoji={s.countryFlag} size={36} className="rounded-sm flex-shrink-0" />
                  <div>
                    <p className="text-[17px] font-bold text-slate-900 leading-tight">{s.countryName}</p>
                    {s.taxFree && (
                      <span className="inline-block text-[10.5px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full mt-1">
                        Tax-Free
                      </span>
                    )}
                  </div>
                </div>

                {/* Salary stats */}
                <div className="flex flex-wrap gap-x-8 gap-y-3 flex-1">
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">Salary Range</p>
                    <p className="text-[15px] font-bold text-slate-800">{s.salaryRangeDisplay}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">INR Equivalent</p>
                    <p className="text-[15px] font-bold text-primary">
                      ₹{(s.inrMonthlyMin / 100000).toFixed(1)}L–₹{(s.inrMonthlyMax / 100000).toFixed(1)}L/month
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">Updated</p>
                    <p className="text-[13px] text-slate-600">{s.lastUpdated}</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1 text-[13px] font-semibold text-primary sm:self-center flex-shrink-0 group-hover:gap-2 transition-all">
                  Full salary guide <ChevronRight size={14} />
                </div>
              </div>

              {/* Summary / tagline */}
              <p className="text-[13.5px] text-slate-500 leading-relaxed mt-4 pt-4 border-t border-slate-100">
                {s.tagline}
              </p>
            </Link>
          ))}
        </div>

        {/* Contextual note */}
        <div className="mt-8 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 flex items-start gap-3">
          <TrendingUp size={16} className="text-[#1D4ED8] mt-0.5 flex-shrink-0" />
          <p className="text-[13.5px] text-[#1D4ED8]/80 leading-relaxed">
            All salary figures are verified from official pay scales, union agreements, and nurse-reported
            data as of 2025. INR equivalents are indicative and fluctuate with exchange rates. Click any
            country above for a detailed breakdown by experience level, specialty, and city.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-[12.5px] text-slate-400 font-medium">Related resources:</span>
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <BarChart2 size={13} /> Compare Nursing Destinations
          </Link>
          <Link
            href="/exam"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <BookOpen size={13} /> Exam Guides
          </Link>
        </div>
      </div>
    </div>
  )
}
