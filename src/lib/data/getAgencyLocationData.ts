import { cache } from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import { toSlug } from '@/lib/data/getLocationData'
import { normalizeCityName, isExcludedCityName } from '@/lib/data/cityNormalization'
import type { LocationAgencyListing } from '@/types/location'

const AGENCY_COLUMNS = 'id, slug, name, location, city, state, countries, pricing_min_lakhs, pricing_max_lakhs, trust_level'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AgencyRow = Record<string, any>
type BranchRow = { agency_id: string; city: string | null; state: string | null; address: string | null }
type ReviewRow = { agency_id: string; overall_rating: number }

export type CityEntry = {
  city: string
  citySlug: string
  agencyCount: number
}

export type StateIndex = {
  state: string
  stateSlug: string
  agencyCount: number
  cities: CityEntry[]
  topDestinations: string[]
}

export type StatePageData = {
  state: string
  stateSlug: string
  agencyCount: number
  cities: CityEntry[]
  agencies: LocationAgencyListing[]
  topDestinations: string[]
  feeRange: { minLakhs: number; maxLakhs: number }
  faqs: Array<{ question: string; answer: string }>
}

/* ── All states that have at least one agency (main office or branch) ── */

export async function getAllStatesFromDb(): Promise<StateIndex[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [{ data: agencyRows }, { data: branchRows }] = await Promise.all([
    db.from('agencies').select('id, city, state, countries').eq('is_active', true).eq('source_country', 'India'),
    db.from('branches').select('agency_id, city, state'),
  ])

  type StateEntry = {
    state: string
    agencyIds: Set<string>
    cities: Map<string, { city: string; ids: Set<string> }>
    destCount: Map<string, number>
  }
  const stateMap = new Map<string, StateEntry>()

  function add(state: string | null, city: string | null, agencyId: string, destinations: string[]) {
    const s = state?.trim()
    const rawCity = city?.trim()
    if (!s) return
    const slug = toSlug(s)
    if (!stateMap.has(slug)) stateMap.set(slug, { state: s, agencyIds: new Set(), cities: new Map(), destCount: new Map() })
    const entry = stateMap.get(slug)!
    entry.agencyIds.add(agencyId)
    if (rawCity && !isExcludedCityName(rawCity)) {
      const c = normalizeCityName(rawCity)
      const cs = toSlug(c)
      if (!entry.cities.has(cs)) entry.cities.set(cs, { city: c, ids: new Set() })
      entry.cities.get(cs)!.ids.add(agencyId)
    }
    for (const d of destinations) entry.destCount.set(d, (entry.destCount.get(d) ?? 0) + 1)
  }

  for (const a of (agencyRows ?? []) as AgencyRow[]) {
    add(a.state, a.city, a.id, a.countries ?? [])
  }
  for (const b of (branchRows ?? []) as BranchRow[]) {
    const agency = (agencyRows ?? []).find((a: AgencyRow) => a.id === b.agency_id)
    if (agency) add(b.state, b.city, b.agency_id, agency.countries ?? [])
  }

  return [...stateMap.entries()]
    .map(([stateSlug, entry]) => ({
      state: entry.state,
      stateSlug,
      agencyCount: entry.agencyIds.size,
      cities: [...entry.cities.entries()]
        .map(([citySlug, { city, ids }]) => ({ city, citySlug, agencyCount: ids.size }))
        .sort((a, b) => b.agencyCount - a.agencyCount),
      topDestinations: [...entry.destCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([d]) => d),
    }))
    .sort((a, b) => b.agencyCount - a.agencyCount || a.state.localeCompare(b.state))
}

/* ── Full page data for a single state ──────────────────────────────── */

// cache() dedupes this within a single request — generateMetadata() and the
// page component both call getStatePageData(stateSlug) for the same render.
export const getStatePageData = cache(async (stateSlug: string): Promise<StatePageData | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: agencyRows, error } = await db.from('agencies').select(AGENCY_COLUMNS).eq('is_active', true).eq('source_country', 'India')
  if (error || !agencyRows?.length) return null

  const agencyIds: string[] = (agencyRows as AgencyRow[]).map((a) => a.id)

  const [{ data: branchRows }, { data: reviewRows }] = await Promise.all([
    db.from('branches').select('agency_id, city, state').in('agency_id', agencyIds),
    db.from('reviews').select('agency_id, overall_rating').in('agency_id', agencyIds).eq('status', 'approved'),
  ])

  const statsMap = new Map<string, number[]>()
  for (const r of (reviewRows ?? []) as ReviewRow[]) {
    if (!statsMap.has(r.agency_id)) statsMap.set(r.agency_id, [])
    statsMap.get(r.agency_id)!.push(r.overall_rating)
  }

  let stateName = ''
  const matchingAgencies: LocationAgencyListing[] = []
  const cityMap = new Map<string, { city: string; ids: Set<string> }>()
  const destCount = new Map<string, number>()
  const feeMins: number[] = []
  const feeMaxs: number[] = []

  for (const a of agencyRows as AgencyRow[]) {
    const branches = ((branchRows ?? []) as BranchRow[]).filter((b) => b.agency_id === a.id)
    const hqMatch = a.state && toSlug(a.state) === stateSlug
    const branchMatch = branches.find((b) => b.state && toSlug(b.state) === stateSlug)
    if (!hqMatch && !branchMatch) continue

    if (!stateName) stateName = hqMatch ? (a.state ?? '') : (branchMatch?.state ?? '')

    // Collect all cities in this state for this agency
    if (hqMatch && a.city && !isExcludedCityName(a.city)) {
      const city = normalizeCityName(a.city)
      const cs = toSlug(city)
      if (!cityMap.has(cs)) cityMap.set(cs, { city, ids: new Set() })
      cityMap.get(cs)!.ids.add(a.id)
    }
    for (const b of branches) {
      if (b.state && toSlug(b.state) === stateSlug && b.city && !isExcludedCityName(b.city)) {
        const city = normalizeCityName(b.city)
        const cs = toSlug(city)
        if (!cityMap.has(cs)) cityMap.set(cs, { city, ids: new Set() })
        cityMap.get(cs)!.ids.add(a.id)
      }
    }

    for (const d of (a.countries ?? [])) destCount.set(d, (destCount.get(d) ?? 0) + 1)
    if (a.pricing_min_lakhs) feeMins.push(a.pricing_min_lakhs)
    if (a.pricing_max_lakhs) feeMaxs.push(a.pricing_max_lakhs)

    const ratings = statsMap.get(a.id) ?? []
    const reviewCount = ratings.length
    const rating = reviewCount > 0
      ? Math.round((ratings.reduce((s: number, v: number) => s + v, 0) / reviewCount) * 10) / 10
      : 0

    const feeMin = a.pricing_min_lakhs as number | null
    const feeMax = a.pricing_max_lakhs as number | null
    const feeRangeDisplay = feeMin && feeMax ? `₹${feeMin}L–₹${feeMax}L` : feeMin ? `From ₹${feeMin}L` : '—'
    const trustLevel = (a.trust_level === 'scam-reported' ? 'unverified' : a.trust_level) as 'verified' | 'trusted' | 'unverified'

    matchingAgencies.push({
      slug: a.slug,
      name: a.name,
      rating,
      reviewCount,
      destinations: a.countries ?? [],
      feeRangeDisplay,
      address: a.location || `${a.city}, ${a.state}`,
      trustLevel,
    })
  }

  if (!stateName) return null

  matchingAgencies.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)

  const topDestinations = [...destCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([d]) => d)
  const cities: CityEntry[] = [...cityMap.entries()]
    .map(([citySlug, { city, ids }]) => ({ city, citySlug, agencyCount: ids.size }))
    .sort((a, b) => b.agencyCount - a.agencyCount)

  const feeRange = {
    minLakhs: feeMins.length ? Math.min(...feeMins) : 0,
    maxLakhs: feeMaxs.length ? Math.max(...feeMaxs) : 0,
  }

  const count = matchingAgencies.length
  const destText = topDestinations.slice(0, 3).join(', ')
  const cityNames = cities.slice(0, 3).map((c) => c.city).join(', ')

  return {
    state: stateName,
    stateSlug,
    agencyCount: count,
    cities,
    agencies: matchingAgencies,
    topDestinations,
    feeRange,
    faqs: [
      {
        question: `How many overseas nursing agencies are in ${stateName}?`,
        answer: `There are currently ${count} active overseas nursing agenc${count === 1 ? 'y' : 'ies'} listed in ${stateName} on OverseasNursing.com${cityNames ? `, with offices in ${cityNames} and more cities` : ''}. Compare fees, trust ratings, and verified nurse reviews before choosing an agency.`,
      },
      {
        question: `Which countries do nursing agencies in ${stateName} place nurses in?`,
        answer: destText
          ? `Agencies in ${stateName} primarily place nurses in ${destText}. Check each agency profile for their specific destination specialisations and documented placement records.`
          : `Check individual agency profiles for country specialisations and placement records.`,
      },
      {
        question: `What are typical nursing consultancy fees in ${stateName}?`,
        answer: feeRange.minLakhs > 0 && feeRange.maxLakhs > 0
          ? `Nursing consultancy fees in ${stateName} range from ₹${feeRange.minLakhs}L to ₹${feeRange.maxLakhs}L depending on the destination country and services included. Always get a written breakdown of all fees before paying anything.`
          : `Fees vary by destination and services. Always get a full written fee structure before paying. Report any agency that refuses to provide a written agreement.`,
      },
      {
        question: `How do I verify a nursing agency in ${stateName} is legitimate?`,
        answer: `Check the agency's MEA (Ministry of External Affairs) recruitment licence number, read verified nurse reviews on OverseasNursing.com, and confirm their trust rating. Never pay more than a registration fee without a signed agreement. Report suspicious agencies using our Scam Report tool.`,
      },
    ],
  }
})
