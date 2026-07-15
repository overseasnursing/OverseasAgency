'use server'

import { getActiveJobs, type ActiveJobListing } from '@/lib/db/jobs'

/**
 * Client-callable wrapper for homepage progressive enhancement (see
 * FeaturedJobsSection) — lets a Market-Context-aware widget re-fetch after
 * mount without the homepage itself reading cookies server-side, which
 * would force it out of static generation.
 */
export async function getFeaturedJobsForCountry(name: string, limit = 6): Promise<ActiveJobListing[]> {
  const jobs = await getActiveJobs(name)
  return jobs.slice(0, limit)
}
