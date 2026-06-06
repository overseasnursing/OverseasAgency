import React from 'react'
import Image from 'next/image'
import { ExternalLink, MapPin, DollarSign, CheckSquare, BookOpen } from 'lucide-react'
import type { SiblingCategory } from '@/lib/data/getMockTestData'
import { getLocationLinks, getDestinationByCountrySlug, getExamAuthority } from '@/lib/data/mockTestMappings'

export type DestinationOverrides = {
  country?:     { label: string; href: string }
  salary?:      { label: string; href: string }
  eligibility?: { label: string; href: string }
  authority?:   { name: string; url: string }
}

type Props = {
  locationSlug:      string
  categorySlug:      string
  siblingCategories: SiblingCategory[]
  destOverrides?:    DestinationOverrides | null
  destCountrySlug?:  string | null
}

export function AutoInternalLinks({ locationSlug, categorySlug, siblingCategories, destOverrides, destCountrySlug }: Props) {
  const auto = destCountrySlug
    ? getDestinationByCountrySlug(destCountrySlug)
    : getLocationLinks(locationSlug)
  const autoAuth = getExamAuthority(categorySlug)

  // Merge: manual overrides win over auto-generated
  const countryLink = destOverrides?.country    ?? (auto ? { label: auto.countryName,    href: `/country/${auto.countrySlug}` } : null)
  const salaryLink  = destOverrides?.salary     ?? (auto ? { label: 'Nurse Salaries',    href: `/salary/${auto.salarySlug}` }   : null)
  const eligLink    = destOverrides?.eligibility ?? { label: 'Check Eligibility', href: '/eligibility' }
  const authority   = destOverrides?.authority  ?? (autoAuth ? { name: autoAuth.label, url: autoAuth.url } : null)

  const hasSiblings    = siblingCategories.length > 0
  const hasDestination = !!(countryLink || salaryLink || eligLink || authority)

  if (!hasSiblings && !hasDestination) return null

  return (
    <div className="mt-8 flex flex-col gap-5">

      {/* ── 1. Destination + eligibility + official portal (TOP) ── */}
      {hasDestination && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          {auto && (
            <div className="flex items-center gap-2 mb-4">
              <Image src={`https://flagcdn.com/20x15/${auto.flagCode}.png`} alt={auto.countryName} width={20} height={15} sizes="20px" className="rounded-sm flex-shrink-0" unoptimized />
              <h2 className="text-[13.5px] font-bold text-slate-700 uppercase tracking-wide">
                Planning to Work in {auto.countryName}?
              </h2>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {countryLink && (
              <a
                href={countryLink.href}
                className="flex items-center gap-2.5 px-4 py-3 border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.03] rounded-xl transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[12px] text-slate-400 leading-none mb-0.5">Migration Guide</p>
                  <p className="text-[13px] font-semibold text-slate-700 group-hover:text-primary transition-colors">{countryLink.label}</p>
                </div>
              </a>
            )}

            {salaryLink && (
              <a
                href={salaryLink.href}
                className="flex items-center gap-2.5 px-4 py-3 border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.03] rounded-xl transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <DollarSign size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[12px] text-slate-400 leading-none mb-0.5">Salary Guide</p>
                  <p className="text-[13px] font-semibold text-slate-700 group-hover:text-primary transition-colors">{salaryLink.label}</p>
                </div>
              </a>
            )}

            {eligLink && (
              <a
                href={eligLink.href}
                className="flex items-center gap-2.5 px-4 py-3 border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.03] rounded-xl transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <CheckSquare size={14} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-[12px] text-slate-400 leading-none mb-0.5">Free Tool</p>
                  <p className="text-[13px] font-semibold text-slate-700 group-hover:text-primary transition-colors">{eligLink.label}</p>
                </div>
              </a>
            )}

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
                  <p className="text-[13px] font-semibold text-amber-800 group-hover:text-amber-900 transition-colors">{authority.name}</p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── 2. Related exam categories (BELOW destination) ── */}
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
    </div>
  )
}
