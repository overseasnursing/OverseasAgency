'use client'

import { useEffect, useState } from 'react'
import { JobCard } from '@/app/jobs/_components/JobCard'
import { useSourceCountry } from '@/lib/country/context'
import { getFeaturedJobsForCountry } from '@/app/actions/jobs'
import type { ActiveJobListing } from '@/lib/db/jobs'

/**
 * Wraps the homepage's Featured Jobs grid — same progressive-enhancement
 * shape as FeaturedAgenciesSection. The initial list (server-rendered,
 * India, identical for every visitor and crawler) ships in the static HTML;
 * only after mount, once the visitor's real Market Context resolves, does
 * it swap to that country's jobs — falling back to the original India list
 * if the resolved country has none yet. Keeps the homepage fully static.
 */
export function FeaturedJobsSection({ initialJobs }: { initialJobs: ActiveJobListing[] }) {
  const { country, ready } = useSourceCountry()
  const [jobs, setJobs] = useState(initialJobs)

  useEffect(() => {
    if (!ready || country.name === 'India') return
    let cancelled = false

    getFeaturedJobsForCountry(country.name, initialJobs.length)
      .then(result => {
        if (cancelled) return
        if (result.length > 0) setJobs(result)
      })
      .catch(() => {
        // Non-fatal — keep showing the default set.
      })

    return () => { cancelled = true }
  }, [ready, country.name, initialJobs.length])

  if (jobs.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
