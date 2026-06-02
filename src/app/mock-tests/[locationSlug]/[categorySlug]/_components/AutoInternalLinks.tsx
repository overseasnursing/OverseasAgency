import React from 'react'
import { ExternalLink, MapPin, DollarSign, CheckSquare, BookOpen } from 'lucide-react'
import type { SiblingCategory } from '@/lib/data/getMockTestData'
import { getLocationLinks, getExamAuthority } from '@/lib/data/mockTestMappings'

type Props = {
  locationSlug:      string
  categorySlug:      string
  siblingCategories: SiblingCategory[]
}

export function AutoInternalLinks({ locationSlug, categorySlug, siblingCategories }: Props) {
  const destination = getLocationLinks(locationSlug)
  const authority   = getExamAuthority(categorySlug)

  const hasSiblings    = siblingCategories.length > 0
  const hasDestination = !!destination
  const hasAuthority   = !!authority

  if (!hasSiblings && !hasDestination && !hasAuthority) return null

  return (
    <div className="mt-8 flex flex-col gap-5">

      {/* ── Related exam categories (same location, from DB) ── */}
      {hasSiblings && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={14} className="text-primary" />
            <h2 className="text-[13.5px] font-bold text-slate-700 uppercase tracking-wide">
              Related Nursing Exams
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {siblingCategories.map(sibling => (
              <a
                key={sibling.id}
                href={`/mock-tests/${locationSlug}/${sibling.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-primary/10 border border-slate-200 hover:border-primary/30 text-[13px] font-semibold text-slate-700 hover:text-primary rounded-xl transition-all"
              >
                {sibling.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Destination + eligibility + official portal ── */}
      {(hasDestination || hasAuthority) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          {destination && (
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} className="text-primary" />
              <h2 className="text-[13.5px] font-bold text-slate-700 uppercase tracking-wide">
                {destination.flag} Planning to Work in {destination.countryName}?
              </h2>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {destination && (
              <>
                {/* Country guide */}
                <a
                  href={`/country/${destination.countrySlug}`}
                  className="flex items-center gap-2.5 px-4 py-3 border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.03] rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400 leading-none mb-0.5">Migration Guide</p>
                    <p className="text-[13px] font-semibold text-slate-700 group-hover:text-primary transition-colors">
                      {destination.countryName}
                    </p>
                  </div>
                </a>

                {/* Salary guide */}
                <a
                  href={`/salary/${destination.salarySlug}`}
                  className="flex items-center gap-2.5 px-4 py-3 border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.03] rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400 leading-none mb-0.5">Salary Guide</p>
                    <p className="text-[13px] font-semibold text-slate-700 group-hover:text-primary transition-colors">
                      Nurse Salaries
                    </p>
                  </div>
                </a>
              </>
            )}

            {/* Eligibility — always shown */}
            <a
              href="/eligibility"
              className="flex items-center gap-2.5 px-4 py-3 border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.03] rounded-xl transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                <CheckSquare size={14} className="text-violet-600" />
              </div>
              <div>
                <p className="text-[12px] text-slate-400 leading-none mb-0.5">Free Tool</p>
                <p className="text-[13px] font-semibold text-slate-700 group-hover:text-primary transition-colors">
                  Check Eligibility
                </p>
              </div>
            </a>

            {/* Official authority portal */}
            {authority && (
              <a
                href={authority.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-3 border border-amber-200 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <ExternalLink size={13} className="text-amber-700" />
                </div>
                <div>
                  <p className="text-[12px] text-amber-600 leading-none mb-0.5">Official Source</p>
                  <p className="text-[13px] font-semibold text-amber-800 group-hover:text-amber-900 transition-colors">
                    {authority.label}
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
