import React from 'react'
import { BookOpen, Languages, ClipboardList, CheckCircle } from 'lucide-react'
import type { CountryDetail, ExamCategory } from '@/types/countryDetail'

function CategoryIcon({ category }: { category: ExamCategory }) {
  if (category === 'language') return <Languages size={16} className="text-[#1D4ED8]" />
  if (category === 'competency') return <ClipboardList size={16} className="text-[#166534]" />
  return <BookOpen size={16} className="text-primary" />
}

function CategoryBadge({ category, mandatory }: { category: ExamCategory; mandatory: boolean }) {
  const labels: Record<ExamCategory, { label: string; cls: string }> = {
    language: { label: 'Language', cls: 'bg-[#DBEAFE] text-[#1D4ED8]' },
    competency: { label: 'Competency', cls: 'bg-[#DCFCE7] text-[#166534]' },
    registration: { label: 'Registration', cls: 'bg-[#F3E8FF] text-[#7E22CE]' },
  }
  const { label, cls } = labels[category]
  return (
    <div className="flex items-center gap-2">
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
      {mandatory ? (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C]">Mandatory</span>
      ) : (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Choose one</span>
      )}
    </div>
  )
}

interface ExamRequirementsProps {
  country: CountryDetail
}

export function ExamRequirements({ country }: ExamRequirementsProps) {
  return (
    <section aria-labelledby="exams-heading">
      <h2 id="exams-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Exam & Registration Requirements
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        Required qualifications and certifications to practice nursing in {country.name}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {country.exams.map((exam, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] flex items-center justify-center flex-shrink-0">
                  <CategoryIcon category={exam.category} />
                </div>
                <h3 className="text-[16px] font-bold text-slate-800">{exam.name}</h3>
              </div>
            </div>

            <CategoryBadge category={exam.category} mandatory={exam.mandatory} />

            <p className="text-[13.5px] text-slate-600 leading-relaxed mt-3 mb-4">
              {exam.description}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 bg-[#F8FAFC] rounded-xl p-3">
              <div>
                <p className="text-[10.5px] text-slate-400 uppercase tracking-wide font-medium mb-0.5">Min. Score</p>
                <p className="text-[12.5px] font-semibold text-slate-700">{exam.minimumScore}</p>
              </div>
              <div>
                <p className="text-[10.5px] text-slate-400 uppercase tracking-wide font-medium mb-0.5">Prep Time</p>
                <p className="text-[12.5px] font-semibold text-slate-700">{exam.prepTimeMonths}</p>
              </div>
              <div>
                <p className="text-[10.5px] text-slate-400 uppercase tracking-wide font-medium mb-0.5">Approx Cost</p>
                <p className="text-[12.5px] font-semibold text-slate-700">₹{exam.approxCostINR.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Language barrier note for high-barrier countries */}
      {country.languageBarrier === 'high' && (
        <div className="mt-5 flex items-start gap-3 p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
          <Languages size={16} className="text-[#92400E] flex-shrink-0 mt-0.5" />
          <p className="text-[13.5px] text-[#92400E] leading-relaxed">
            <span className="font-semibold">Language preparation is the biggest time investment for {country.name}.</span>{' '}
            Start language classes immediately — this typically adds 8–14 months to your total timeline.
            Budget sufficient time and costs for this before calculating your overall migration plan.
          </p>
        </div>
      )}
    </section>
  )
}
