'use client'

import { useEffect, useState } from 'react'
import { BookOpen, ChevronRight } from 'lucide-react'
import { useSourceCountry } from '@/lib/country/context'
import { rankBySourceCountry } from '@/lib/recommendations/rank'
import type { ExamPageData } from '@/types/exam'

const TYPE_LABEL: Record<string, string> = {
  language:     'Language Exam',
  professional: 'Professional Exam',
  clinical:     'Clinical Assessment',
}
const TYPE_COLOR: Record<string, string> = {
  language:     'bg-[#DBEAFE] text-[#1D4ED8]',
  professional: 'bg-[#DCFCE7] text-[#166534]',
  clinical:     'bg-[#FEF3C7] text-[#92400E]',
}

function ExamGuideCard({ exam }: { exam: ExamPageData }) {
  return (
    <a
      href={`/exam/${exam.slug}`}
      className="bg-white rounded-card shadow-card hover:shadow-card-md transition-shadow border border-slate-100 flex flex-col p-5 group flex-shrink-0 w-[260px] sm:w-[280px]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
          <BookOpen size={18} className="text-primary" />
        </div>
        <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[exam.examType] ?? 'bg-slate-100 text-slate-500'}`}>
          {TYPE_LABEL[exam.examType] ?? 'Guide'}
        </span>
      </div>

      <h3 className="text-[15px] font-bold text-slate-800 mb-1">{exam.examName}</h3>
      <p className="text-[12px] text-slate-400 mb-3">{exam.examFullName}</p>

      <p className="text-[12.5px] text-slate-500 leading-relaxed flex-1 mb-4 line-clamp-2">
        {exam.tagline}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[12px] text-slate-400">
          {exam.prepTimeMonths.min}–{exam.prepTimeMonths.max} months prep
        </span>
        <span className="text-[12px] font-semibold text-primary flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
          Read guide <ChevronRight size={12} />
        </span>
      </div>
    </a>
  )
}

/**
 * Homepage "Exam Guides" strip — server-renders every exam in its existing
 * natural order (unchanged canonical HTML, identical for every visitor and
 * crawler). Only after mount, once Market Context resolves, does it re-rank
 * client-side via the shared recommendation layer — no new fetch, since the
 * full exam list is already static data passed in as a prop. Today this is a
 * no-op for every exam (none are tagged to a source country yet, see
 * ExamPageData.sourceCountry in src/types/exam.ts) — it activates the moment
 * any exam guide is tagged, with no further code changes.
 */
export function RecommendedExams({ exams }: { exams: ExamPageData[] }) {
  const { country, ready } = useSourceCountry()
  const [ranked, setRanked] = useState(exams)

  useEffect(() => {
    if (!ready) return
    const reranked = rankBySourceCountry(
      exams.map(e => ({ ...e, sourceCountry: e.sourceCountry })),
      country.name,
      exams.length,
    )
    if (reranked.length > 0) setRanked(reranked)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, country.name])

  return (
    <div className="-mx-5 sm:-mx-6 lg:-mx-8 px-5 sm:px-6 lg:px-8 overflow-x-auto pb-4">
      <div className="flex gap-4" style={{ width: 'max-content' }}>
        {ranked.map((exam) => (
          <ExamGuideCard key={exam.slug} exam={exam} />
        ))}
      </div>
    </div>
  )
}
