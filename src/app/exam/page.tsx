import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Clock, Globe, TrendingUp, BarChart2 } from 'lucide-react'
import { getAllExams } from '@/lib/data/exams'
import { MultiJsonLd } from '@/components/seo/JsonLd'
import { buildWebPageSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Nursing Exam Guides — OET, IELTS, NCLEX, DHA, MOH & More | OverseasNursing',
  description: 'Complete guides for every nursing exam required for overseas migration — OET, IELTS, NCLEX-RN, DHA, MOH, HAAD, Prometric and more. Fees, prep tips, pass rates.',
  alternates: { canonical: 'https://overseasnursing.com/exam' },
  openGraph: {
    title: 'Nursing Exam Guides — OverseasNursing',
    description: 'Complete guides for every nursing exam required for overseas migration.',
  },
}

const EXAM_TYPE_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  language:            { label: 'Language Test',       bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]' },
  'nursing-competency':{ label: 'Clinical Assessment', bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
  registration:        { label: 'Registration',        bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
  licensing:           { label: 'Licensing Exam',      bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
}

const EXAM_HUB_SCHEMAS = [
  buildWebPageSchema({
    title: 'Nursing Exam Guides — OET, IELTS, NCLEX, DHA, MOH & More | OverseasNursing',
    description: 'Complete guides for every nursing exam required for overseas migration — OET, IELTS, NCLEX-RN, DHA, MOH, HAAD, Prometric and more. Fees, prep tips, pass rates.',
    path: '/exam',
  }),
  buildBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Exam Guides', href: '/exam' },
  ]),
]

export default function ExamIndexPage() {
  const exams = getAllExams()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <MultiJsonLd schemas={EXAM_HUB_SCHEMAS} />
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 mb-5">
            <Link href="/" className="hover:text-primary transition-colors font-medium text-slate-600">Home</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium">Exam Guides</span>
          </nav>
          <h1 className="text-[30px] sm:text-[36px] font-bold text-slate-900 mb-3">
            Nursing Exam Guides
          </h1>
          <p className="text-[15px] text-slate-500 max-w-2xl leading-relaxed">
            Every exam Indian nurses need to pass for overseas migration — fees, preparation timelines, pass rates and study tips.
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((exam) => {
            const typeStyle = EXAM_TYPE_LABELS[exam.examType] ?? EXAM_TYPE_LABELS.registration
            const prepRange = `${exam.prepTimeMonths.min}–${exam.prepTimeMonths.max} months`

            return (
              <Link
                key={exam.slug}
                href={`/exam/${exam.slug}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[20px] font-black text-slate-900 leading-none">{exam.examName}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">{exam.examFullName}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${typeStyle.bg} ${typeStyle.text}`}>
                    {typeStyle.label}
                  </span>
                </div>

                <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">{exam.tagline}</p>

                <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <Clock size={11} className="text-slate-400" /> {prepRange} prep
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <Globe size={11} className="text-slate-400" /> {exam.applicableCountries.slice(0, 2).join(', ')}{exam.applicableCountries.length > 2 ? ` +${exam.applicableCountries.length - 2}` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {exam.registrationFeeINR ? (
                    <span className="text-[12px] font-semibold text-slate-700">
                      ₹{exam.registrationFeeINR.toLocaleString('en-IN')} fee
                    </span>
                  ) : <span />}
                  <span className="text-[12px] font-semibold text-primary flex items-center gap-1">
                    View guide <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-[12.5px] text-slate-400 font-medium">Related resources:</span>
          <a
            href="/salary"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <TrendingUp size={13} /> Salary Guides by Country
          </a>
          <a
            href="/compare"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <BarChart2 size={13} /> Compare Nursing Destinations
          </a>
        </div>
      </div>
    </div>
  )
}
