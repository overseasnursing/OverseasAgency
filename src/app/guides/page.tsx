import type { Metadata } from 'next'
import React from 'react'
import { Container } from '@/components/layout/Container'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { FlagIcon } from '@/components/ui/FlagIcon'
import { getAllExams } from '@/lib/data/exams'
import { ArrowRight, BookOpen, Clock, Globe, FileText, Stethoscope } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nursing Migration Guides — NCLEX, OET, DHA, Germany & More',
  description:
    'Free step-by-step guides for Indian nurses migrating overseas. Covers NCLEX, OET, DHA, HAAD exams, Germany recognition process, UK CBT, salary expectations and visa processes.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'Nursing Migration Guides',
    description: 'Free guides covering every exam and process for overseas nursing migration from India.',
    url: 'https://overseasnursing.com/guides',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const EXAM_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; bg: string; iconColor: string; badge: string }> = {
  language:     { label: 'Language Exam',       icon: Globe,        bg: 'bg-[#DBEAFE]', iconColor: 'text-[#1D4ED8]', badge: 'bg-[#DBEAFE] text-[#1D4ED8]' },
  professional: { label: 'Professional Exam',   icon: FileText,     bg: 'bg-[#DCFCE7]', iconColor: 'text-[#166534]', badge: 'bg-[#DCFCE7] text-[#166534]' },
  clinical:     { label: 'Clinical Assessment', icon: Stethoscope,  bg: 'bg-[#FEF3C7]', iconColor: 'text-[#92400E]', badge: 'bg-[#FEF3C7] text-[#92400E]' },
}

export default function GuidesPage() {
  const exams = getAllExams()

  return (
    <>
      <SectionWrapper spacing="lg" background="card">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 bg-primary/8 rounded-full">
                <BookOpen size={13} className="text-primary" />
                <span className="text-[12px] font-semibold text-primary tracking-wide uppercase">
                  Free guides
                </span>
              </div>
              <h1 className="text-balance mb-4">
                Nursing migration guides
              </h1>
              <p className="text-[17px] text-slate-500 leading-[1.75] mb-6">
                Everything you need to know — exam preparation, visa processes,
                salary benchmarks, and step-by-step migration guides for Indian nurses.
              </p>
              {/* Exam category pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Language Exams', icon: Globe,       bg: 'bg-[#DBEAFE] text-[#1D4ED8]', note: 'OET, IELTS, GOETHE' },
                  { label: 'Professional',   icon: FileText,    bg: 'bg-[#DCFCE7] text-[#166534]', note: 'NCLEX, DHA, HAAD' },
                  { label: 'Clinical Assess',icon: Stethoscope, bg: 'bg-[#FEF3C7] text-[#92400E]', note: 'UK CBT, OSCE' },
                ].map(({ label, icon: Icon, bg, note }) => (
                  <div key={label} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold ${bg}`}>
                    <Icon size={13} />
                    <span>{label}</span>
                    <span className="opacity-60 font-normal text-[11px]">— {note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual steps card */}
            <div className="hidden lg:block" aria-hidden="true">
              <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6">
                <p className="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wide mb-4">Migration pathway</p>
                <div className="flex flex-col gap-0">
                  {[
                    { step: '01', label: 'Choose destination country',     sub: 'Germany, UK, Canada, Australia or Dubai',  color: 'text-primary',    dot: 'bg-primary' },
                    { step: '02', label: 'Clear your language exam',        sub: 'OET / IELTS / German B2 depending on country', color: 'text-[#1D4ED8]', dot: 'bg-[#1D4ED8]' },
                    { step: '03', label: 'Pass the professional exam',      sub: 'NCLEX / DHA / CBT / HAAD based on destination', color: 'text-[#166534]', dot: 'bg-[#166534]' },
                    { step: '04', label: 'Secure agency & employer',        sub: 'Choose a verified agency. Get written contract.',  color: 'text-[#92400E]', dot: 'bg-[#92400E]' },
                    { step: '05', label: 'Visa & relocation',              sub: 'Work visa processing · 2–24 weeks timeline',       color: 'text-slate-600', dot: 'bg-slate-400' },
                  ].map(({ step, label, sub, color, dot }, i, arr) => (
                    <div key={step} className="flex gap-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full ${dot} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                          {step}
                        </div>
                        {i < arr.length - 1 && <div className="w-0.5 h-8 bg-slate-200 my-1" />}
                      </div>
                      {/* Content */}
                      <div className="pb-5">
                        <p className={`text-[13.5px] font-semibold leading-tight ${color}`}>{label}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper spacing="md" background="page" divided>
        <Container>
          <h2 className="text-[22px] font-bold text-slate-800 mb-2">
            Exam Guides
          </h2>
          <p className="text-[14px] text-slate-500 mb-8">
            Detailed preparation guides for every exam required in overseas nursing migration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {exams.map((exam) => {
              const typeConf = EXAM_TYPE_CONFIG[exam.examType] ?? { label: 'Exam Guide', icon: BookOpen, bg: 'bg-slate-100', iconColor: 'text-slate-500', badge: 'bg-slate-100 text-slate-500' }
              const TypeIcon = typeConf.icon
              return (
                <a
                  key={exam.slug}
                  href={`/exam/${exam.slug}`}
                  className="bg-white rounded-card shadow-card hover:shadow-card-md transition-all hover:-translate-y-0.5 p-6 flex flex-col gap-4 group border border-slate-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-xl ${typeConf.bg} flex items-center justify-center flex-shrink-0`}>
                      <TypeIcon size={22} className={typeConf.iconColor} />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${typeConf.badge}`}>
                      {typeConf.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-slate-800 mb-1">
                      {exam.examName} — {exam.examFullName}
                    </h3>
                    <p className="text-[13.5px] text-slate-500 leading-relaxed line-clamp-2">
                      {exam.tagline}
                    </p>
                  </div>

                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {exam.prepTimeMonths.min}–{exam.prepTimeMonths.max} months prep
                    </span>
                    <span>{exam.applicableCountries.slice(0, 2).join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-primary group-hover:gap-2.5 transition-all mt-auto pt-3 border-t border-slate-100">
                    Read full guide
                    <ArrowRight size={13} />
                  </div>
                </a>
              )
            })}
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper spacing="md" background="section" divided>
        <Container>
          <h2 className="text-[22px] font-bold text-slate-800 mb-2">
            Country Guides
          </h2>
          <p className="text-[14px] text-slate-500 mb-8">
            Migration process, salary ranges, visa requirements, and recognition steps by country.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: 'Germany',   slug: 'germany'   },
              { label: 'UK',        slug: 'uk'        },
              { label: 'Australia', slug: 'australia' },
              { label: 'Canada',    slug: 'canada'    },
              { label: 'Dubai',     slug: 'dubai'     },
            ].map(({ label, slug }) => (
              <a
                key={slug}
                href={`/country/${slug}`}
                className="bg-white rounded-card shadow-card hover:shadow-card-md transition-shadow p-5 text-center flex flex-col items-center gap-2"
              >
                <FlagIcon slug={slug} size={32} className="rounded-sm mx-auto" />
                <span className="text-[14px] font-semibold text-slate-700">{label}</span>
                <span className="text-[12px] text-primary font-medium">View guide →</span>
              </a>
            ))}
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
