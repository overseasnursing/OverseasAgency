import React from 'react'
import { MessageSquare, BookOpen, FileText, CreditCard, Briefcase, Plane, MapPin } from 'lucide-react'

const STEPS = [
  {
    icon: MessageSquare,
    title: 'Initial Consultation',
    duration: 'Week 1',
    description: 'Free counselling session to assess eligibility, select target country, and plan your migration pathway.',
  },
  {
    icon: BookOpen,
    title: 'Exam Preparation',
    duration: '2–6 months',
    description: 'Agency guides you through NCLEX, OET/IELTS, or country-specific licensing exams with study support.',
  },
  {
    icon: FileText,
    title: 'Documentation',
    duration: '4–8 weeks',
    description: "Credential verification, notarization, and submission to the destination country's nursing board.",
  },
  {
    icon: CreditCard,
    title: 'Visa Application',
    duration: '4–12 weeks',
    description: "Agency files your work visa or employment permit with the destination country's immigration authority.",
  },
  {
    icon: Briefcase,
    title: 'Job Placement',
    duration: '2–6 weeks',
    description: 'Matched with a hospital or healthcare facility. Contract negotiation and offer letter confirmation.',
  },
  {
    icon: Plane,
    title: 'Pre-Departure',
    duration: '2–3 weeks',
    description: 'Flight booking assistance, orientation briefing, accommodation guidance, and travel insurance.',
  },
  {
    icon: MapPin,
    title: 'Arrival & Onboarding',
    duration: 'Week 1 onsite',
    description: 'Airport pickup coordination, registration with local authorities, and hospital onboarding support.',
  },
]

export function TimelineSection() {
  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="text-[22px] font-bold text-slate-800 mb-6">
        Migration Process Timeline
      </h2>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[21px] top-10 bottom-10 w-px bg-slate-100 hidden sm:block" aria-hidden="true" />

        <ol className="flex flex-col gap-0">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isLast = index === STEPS.length - 1
            return (
              <li key={index} className="flex gap-4 sm:gap-5">
                {/* Step indicator */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-primary/8 border-2 border-primary/20 flex items-center justify-center z-10 relative">
                    <Icon size={17} className="text-primary" />
                  </div>
                  {!isLast && (
                    <div className="w-px flex-1 bg-slate-100 mt-1 mb-1 sm:hidden" aria-hidden="true" />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-7 min-w-0 ${isLast ? '' : ''}`}>
                  <div className="flex items-center flex-wrap gap-2 mb-1 pt-2.5">
                    <h3 className="text-[15px] font-semibold text-slate-800">{step.title}</h3>
                    <span className="text-[11.5px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-[13.5px] text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <p className="text-[12.5px] text-slate-400 mt-2 leading-relaxed">
        Total estimated timeline: 6–18 months depending on target country, exam results, and visa processing times.
        Timelines are approximate and vary case by case.
      </p>
    </section>
  )
}
