'use server'

import { fetchFeaturedAgencies } from '@/lib/data/fetchAgencies'
import type { Agency } from '@/types/agency'

/**
 * Client-callable wrapper for homepage progressive enhancement (see
 * FeaturedAgenciesSection) — lets a Market-Context-aware widget re-fetch
 * after mount without the homepage itself reading cookies server-side,
 * which would force it out of static generation.
 */
export async function getFeaturedAgenciesForCountry(name: string, limit = 6): Promise<Agency[]> {
  return fetchFeaturedAgencies(limit, name)
}
