import React from 'react'
import type { CountryDetail } from '@/types/countryDetail'

interface MigrationProcessProps {
  country: CountryDetail
}

export function MigrationProcess({ country }: MigrationProcessProps) {
  return (
    <section id="process" aria-labelledby="process-heading">
      <h2 id="process-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        How to Migrate to {country.name} as a Nurse
      </h2>
      <p className="text-[14px] text-slate-500 mb-8">
        Step-by-step migration pathway for Indian nurses. Estimated total timeline:{' '}
        <span className="font-semibold text-slate-700">
          {country.visaProcessingWeeks.min + 8}–{country.visaProcessingWeeks.max + 24} weeks
        </span>{' '}
        depending on language preparation and exam results.
      </p>

      <ol className="flex flex-col gap-0 relative">
        {/* vertical line */}
        <div className="absolute left-[21px] top-10 bottom-10 w-px bg-slate-100 hidden sm:block" aria-hidden="true" />

        {country.migrationSteps.map((step, index) => {
          const isLast = index === country.migrationSteps.length - 1
          return (
            <li key={index} className="flex gap-4 sm:gap-5">
              {/* Step number bubble */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center z-10 relative font-bold text-[14px]">
                  {index + 1}
                </div>
                {!isLast && (
                  <div className="w-px flex-1 bg-slate-100 mt-1 mb-1 sm:hidden" aria-hidden="true" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-7 min-w-0`}>
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
    </section>
  )
}
