'use server'

import { getAllStatesFromDb, type StateIndex } from '@/lib/data/getAgencyLocationData'

/**
 * /locations' country filter defaults to the visitor's Market Context
 * (useSourceCountry) but the page itself stays static/ISR-friendly by
 * server-rendering the platform default (India) — this is what the client
 * calls to re-fetch states for whichever country the visitor actually is.
 */
export async function getStatesForSourceCountry(sourceCountry: string): Promise<StateIndex[]> {
  return getAllStatesFromDb(sourceCountry)
}
