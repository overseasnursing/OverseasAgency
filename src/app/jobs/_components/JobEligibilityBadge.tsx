'use client'

import { Globe2, CheckCircle2 } from 'lucide-react'
import { useSourceCountry } from '@/lib/country/context'
import type { JobEligibilityMode } from '@/lib/db/jobs'

/**
 * Informational only — never gates whether a job renders. The canonical
 * job list/detail page always shows every approved, unexpired job for every
 * visitor and crawler; this only highlights relevance for the current
 * visitor's resolved source country (Phase 6). A Server Component can render
 * this directly — the 'use client' boundary starts here, so parents (job
 * detail page, Similar Jobs on the server) never need their own cookie read.
 */
export function JobEligibilityBadge({
  mode,
  countries,
}: {
  mode: JobEligibilityMode
  countries: string[]
}) {
  const { country } = useSourceCountry()

  if (mode === 'worldwide') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-full">
        <Globe2 size={10} /> Open worldwide
      </span>
    )
  }

  if (countries.length === 0) return null

  const eligible = countries.includes(country.name)

  return eligible ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
      <CheckCircle2 size={10} /> Open to {country.name}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-full">
      Open to: {countries.join(', ')}
    </span>
  )
}
