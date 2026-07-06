import { createAdminClient } from '@/lib/supabase/admin'
import type { LocationAgencyListing, LocationPageData } from '@/types/location'
import { normalizeCityName, isExcludedCityName } from '@/lib/data/cityNormalization'

type CityRow    = { city: string | null; state: string | null }
type AgencyRow  = CityRow & { id: string; slug: string; name: string; location: string | null; countries: string[] | null; pricing_min_lakhs: number | null; pricing_max_lakhs: number | null; trust_level: string | null }
type BranchRow  = CityRow & { agency_id: string; address: string | null }
type ReviewRow  = { agency_id: string; overall_rating: number }

export function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

/* ── All unique cities from agencies + branches ──────────────────────── */

export async function getAllLocationCitiesFromDb(): Promise<Array<{ city: string; slug: string; state: string }>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [{ data: agencyRows }, { data: branchRows }] = await Promise.all([
    db.from('agencies').select('city, state').eq('is_active', true),
    db.from('branches').select('city, state'),
  ])

  // slug -> { city, state }
  const seen = new Map<string, { city: string; state: string }>()

  for (const a of (agencyRows ?? []) as CityRow[]) {
    const rawCity = a.city?.trim()
    const state = a.state?.trim()
    if (rawCity && state && !isExcludedCityName(rawCity)) {
      const city = normalizeCityName(rawCity)
      seen.set(toSlug(city), { city, state })
    }
  }
  for (const b of (branchRows ?? []) as CityRow[]) {
    const rawCity = b.city?.trim()
    const state = b.state?.trim()
    if (rawCity && state && !isExcludedCityName(rawCity)) {
      const city = normalizeCityName(rawCity)
      seen.set(toSlug(city), { city, state })
    }
  }

  return [...seen.entries()]
    .map(([slug, { city, state }]) => ({ slug, city, state }))
    .sort((a, b) => a.city.localeCompare(b.city))
}

/* ── All cities grouped by state (for index page) ───────────────────── */

export async function getLocationsByState(): Promise<
  Array<{ state: string; cities: Array<{ city: string; slug: string; agencyCount: number }> }>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [{ data: agencyRows }, { data: branchRows }] = await Promise.all([
    db.from('agencies').select('id, city, state').eq('is_active', true),
    db.from('branches').select('agency_id, city, state'),
  ])

  const agencies = (agencyRows ?? []) as AgencyRow[]
  const branches = (branchRows ?? []) as BranchRow[]

  // Build: citySlug -> { city, state, Set<agencyId> }
  const cityMap = new Map<string, { city: string; state: string; ids: Set<string> }>()

  const addToCity = (city: string | null, state: string | null, agencyId: string) => {
    const rawCity = city?.trim()
    const s = state?.trim()
    if (!rawCity || !s || isExcludedCityName(rawCity)) return
    const c = normalizeCityName(rawCity)
    const slug = toSlug(c)
    if (!cityMap.has(slug)) cityMap.set(slug, { city: c, state: s, ids: new Set() })
    cityMap.get(slug)!.ids.add(agencyId)
  }

  for (const a of agencies) addToCity(a.city, a.state, a.id)
  for (const b of branches) {
    const parentAgency = agencies.find((a) => a.id === b.agency_id)
    if (parentAgency) addToCity(b.city, b.state, b.agency_id)
  }

  // Group by state
  const stateMap = new Map<string, Array<{ city: string; slug: string; agencyCount: number }>>()
  for (const [slug, { city, state, ids }] of cityMap.entries()) {
    if (!stateMap.has(state)) stateMap.set(state, [])
    stateMap.get(state)!.push({ city, slug, agencyCount: ids.size })
  }

  return [...stateMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, cities]) => ({
      state,
      cities: cities.sort((a, b) => b.agencyCount - a.agencyCount || a.city.localeCompare(b.city)),
    }))
}

/* ── Full page data for a single city ───────────────────────────────── */

export async function getLocationPageData(citySlug: string): Promise<LocationPageData | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: agencyRows, error } = await db
    .from('agencies')
    .select('*')
    .eq('is_active', true)

  if (error || !agencyRows?.length) return null

  const agencyIds: string[] = (agencyRows as AgencyRow[]).map((a) => a.id)

  const [{ data: branchRows }, { data: reviewRows }] = await Promise.all([
    db.from('branches').select('*').in('agency_id', agencyIds),
    db.from('reviews')
      .select('agency_id, overall_rating')
      .in('agency_id', agencyIds)
      .eq('status', 'approved'),
  ])

  // Build rating stats per agency
  const statsMap = new Map<string, number[]>()
  for (const r of (reviewRows ?? []) as ReviewRow[]) {
    if (!statsMap.has(r.agency_id)) statsMap.set(r.agency_id, [])
    statsMap.get(r.agency_id)!.push(r.overall_rating)
  }

  let cityName = ''
  let stateName = ''
  const matchingAgencies: LocationAgencyListing[] = []

  for (const a of agencyRows as AgencyRow[]) {
    const branches = ((branchRows ?? []) as BranchRow[]).filter((b) => b.agency_id === a.id)

    const hqMatches     = a.city   && !isExcludedCityName(a.city)   && toSlug(normalizeCityName(a.city))   === citySlug
    const matchingBranch = branches.find((b) => b.city && !isExcludedCityName(b.city) && toSlug(normalizeCityName(b.city)) === citySlug)

    if (!hqMatches && !matchingBranch) continue

    if (!cityName) {
      cityName  = hqMatches ? normalizeCityName(a.city ?? '') : normalizeCityName(matchingBranch?.city ?? '')
      stateName = hqMatches ? (a.state ?? '') : (matchingBranch?.state || a.state || '')
    }

    const ratings     = statsMap.get(a.id) ?? []
    const reviewCount = ratings.length
    const rating      = reviewCount > 0
      ? Math.round((ratings.reduce((s: number, v: number) => s + v, 0) / reviewCount) * 10) / 10
      : 0

    const address = matchingBranch?.address || a.location || `${a.city}, ${a.state}`
    const feeMin  = a.pricing_min_lakhs
    const feeMax  = a.pricing_max_lakhs
    const feeRangeDisplay = feeMin && feeMax
      ? `₹${feeMin}L–₹${feeMax}L`
      : feeMin ? `From ₹${feeMin}L` : '—'

    const trustLevel = a.trust_level === 'scam-reported' ? 'unverified' : a.trust_level as 'verified' | 'trusted' | 'unverified'

    matchingAgencies.push({
      slug: a.slug,
      name: a.name,
      rating,
      reviewCount,
      destinations: a.countries ?? [],
      feeRangeDisplay,
      address,
      trustLevel,
    })
  }

  if (!cityName) return null

  matchingAgencies.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)

  // Popular destinations
  const destCount = new Map<string, number>()
  for (const ag of matchingAgencies) {
    for (const d of ag.destinations) destCount.set(d, (destCount.get(d) ?? 0) + 1)
  }
  const popularDestinations = [...destCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([d]) => d)

  // Nearby locations: other cities in same state
  const nearbySeen = new Map<string, string>()
  for (const a of agencyRows as AgencyRow[]) {
    if (a.state === stateName && a.city && !isExcludedCityName(a.city)) {
      const city = normalizeCityName(a.city)
      if (toSlug(city) !== citySlug) nearbySeen.set(toSlug(city), city)
    }
  }
  for (const b of (branchRows ?? []) as BranchRow[]) {
    if (b.state === stateName && b.city && !isExcludedCityName(b.city)) {
      const city = normalizeCityName(b.city)
      if (toSlug(city) !== citySlug) nearbySeen.set(toSlug(city), city)
    }
  }
  const nearbyLocations = [...nearbySeen.entries()]
    .slice(0, 4)
    .map(([slug, city]) => ({ city, slug }))

  const relatedCountrySlugs = popularDestinations
    .map((d) => toSlug(d))
    .slice(0, 4)

  const destText = popularDestinations.slice(0, 3).join(', ')
  const count    = matchingAgencies.length

  return {
    city:       cityName,
    citySlug,
    state:      stateName,
    stateSlug:  toSlug(stateName),
    region:     stateName,
    tagline:    `${count} overseas nursing agenc${count === 1 ? 'y' : 'ies'} in ${cityName}${destText ? ` — placing nurses in ${destText}` : ''}`,
    description: `${cityName} is home to ${count} active overseas nursing agenc${count === 1 ? 'y' : 'ies'} serving nurses from ${stateName}${destText ? `, with placements in ${destText}` : ''}. Compare fees, read verified nurse reviews, and check trust ratings before choosing an agency.`,
    popularDestinations,
    agencyCount: count,
    agencies:    matchingAgencies,
    localInsights: `Always verify an agency's MEA licence number and read independent nurse reviews before paying any fees. OverseasNursing.com lists all ${count} agenc${count === 1 ? 'y' : 'ies'} in ${cityName} with verified ratings and transparent fee data.`,
    nearbyLocations,
    faqs: [
      {
        question: `How many overseas nursing agencies are in ${cityName}?`,
        answer:   `There are currently ${count} active overseas nursing agenc${count === 1 ? 'y' : 'ies'} listed in ${cityName} on OverseasNursing.com. Compare their fees, reviews, and trust ratings to make an informed decision.`,
      },
      {
        question: `Which countries do ${cityName} agencies place nurses in?`,
        answer:   popularDestinations.length > 0
          ? `Agencies in ${cityName} primarily place nurses in ${popularDestinations.join(', ')}. Check each agency profile for their specific destination specialisations.`
          : `Check individual agency profiles for specific country specialisations and placement records.`,
      },
      {
        question: `How do I verify an agency in ${cityName} is legitimate?`,
        answer:   `Check the agency's trust rating on OverseasNursing.com, read verified nurse reviews, and confirm their MEA licence. Never pay more than a registration fee before receiving a written agreement.`,
      },
    ],
    relatedCountrySlugs,
  }
}
