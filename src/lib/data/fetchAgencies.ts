import { createAdminClient } from '@/lib/supabase/admin'
import type { Agency } from '@/types/agency'
import { normalizeCityName, isExcludedCityName } from '@/lib/data/cityNormalization'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(a: any): Agency {
  return {
    id:                    String(a.id),
    slug:                  String(a.slug),
    name:                  String(a.name),
    location:              String(a.location ?? ''),
    city:                  normalizeCityName(String(a.city ?? '')),
    state:                 String(a.state ?? ''),
    established:           Number(a.established ?? 0),
    trustLevel:            a.trust_level ?? 'unverified',
    rating:                Number(a.rating ?? 0),
    reviewCount:           Number(a.review_count ?? 0),
    placementCount:        Number(a.placement_count ?? 0),
    transparencyScore:     Number(a.transparency_score ?? 0),
    countries:             Array.isArray(a.countries) ? a.countries : [],
    examsSupported:        Array.isArray(a.exams_supported) ? a.exams_supported : [],
    pricing: {
      minLakhs:            Number(a.pricing_min_lakhs ?? 0),
      maxLakhs:            Number(a.pricing_max_lakhs ?? 0),
      isApproximate:       Boolean(a.pricing_is_approximate ?? true),
    },
    hiddenChargesReported: Number(a.hidden_charges_reported ?? 0),
    visaSponsorship:       Boolean(a.visa_sponsorship ?? false),
    averageTimelineMonths: String(a.average_timeline_months ?? ''),
    tagline:               String(a.tagline ?? ''),
    featured:              Boolean(a.featured ?? false),
    logo:                  a.logo_url          ? String(a.logo_url)           : undefined,
    featuredImage:         a.featured_image_url ? String(a.featured_image_url) : undefined,
    googleRating:          a.google_rating       != null ? Number(a.google_rating)        : undefined,
    googleReviewCount:     a.google_review_count != null ? Number(a.google_review_count)  : undefined,
    googlePlaceId:         a.google_place_id     != null ? String(a.google_place_id)      : undefined,
    // reviewSnippet is required by the type but not rendered by AgencyCard
    reviewSnippet: {
      authorName:    '',
      authorFrom:    '',
      countryPlaced: '',
      rating:        0,
      text:          '',
      actualCostPaid: '',
      timeline:      '',
      date:          '',
    },
  }
}

/** Top agencies by transparency score — for homepage cards and general listing. */
export async function fetchFeaturedAgencies(limit = 6): Promise<Agency[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('agencies')
    .select('*')
    .eq('is_active', true)
    .order('transparency_score', { ascending: false })
    .limit(limit)

  if (!data?.length) return []
  return data.map(mapRow)
}

/** Lightweight list for search-bar suggestions (slug + name + location only). */
export async function fetchAgenciesForSearch(
  limit = 100,
): Promise<{ slug: string; name: string; location: string }[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('agencies')
    .select('slug, name, location')
    .eq('is_active', true)
    .order('transparency_score', { ascending: false })
    .limit(limit)

  if (!data?.length) return []
  return data.map((a: { slug: string; name: string; location: string }) => ({
    slug:     a.slug,
    name:     a.name,
    location: a.location ?? '',
  }))
}

/**
 * Agencies that have their HQ or a branch in the given city slug.
 * Used on /agencies/[stateSlug]/[citySlug] pages.
 */
export async function fetchAgenciesByCity(citySlug: string): Promise<Agency[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [{ data: agencyRows }, { data: branchRows }] = await Promise.all([
    db.from('agencies').select('*').eq('is_active', true),
    db.from('branches').select('agency_id, city'),
  ])

  if (!agencyRows?.length) return []

  const toSlug = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const branchAgencyIds = new Set<string>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((branchRows ?? []) as any[])
      .filter((b: { city: string | null; agency_id: string }) => b.city && !isExcludedCityName(b.city) && toSlug(normalizeCityName(b.city)) === citySlug)
      .map((b: { agency_id: string }) => b.agency_id),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matched = (agencyRows as any[]).filter(
    (a) => (a.city && !isExcludedCityName(a.city) && toSlug(normalizeCityName(a.city)) === citySlug) || branchAgencyIds.has(a.id),
  )

  matched.sort(
    (a, b) =>
      (b.transparency_score ?? 0) - (a.transparency_score ?? 0) ||
      (b.rating ?? 0) - (a.rating ?? 0),
  )

  return matched.map(mapRow)
}

/**
 * Agencies that have their HQ or a branch in the given state slug.
 * Used on /agencies/[stateSlug] pages.
 */
export async function fetchAgenciesByState(stateSlug: string): Promise<Agency[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [{ data: agencyRows }, { data: branchRows }] = await Promise.all([
    db.from('agencies').select('*').eq('is_active', true),
    db.from('branches').select('agency_id, state'),
  ])

  if (!agencyRows?.length) return []

  const toSlug = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const branchAgencyIds = new Set<string>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((branchRows ?? []) as any[])
      .filter((b: { state: string | null; agency_id: string }) => b.state && toSlug(b.state) === stateSlug)
      .map((b: { agency_id: string }) => b.agency_id),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matched = (agencyRows as any[]).filter(
    (a) => (a.state && toSlug(a.state) === stateSlug) || branchAgencyIds.has(a.id),
  )

  matched.sort(
    (a, b) =>
      (b.transparency_score ?? 0) - (a.transparency_score ?? 0) ||
      (b.rating ?? 0) - (a.rating ?? 0),
  )

  return matched.map(mapRow)
}

/** Top agencies that serve a given country — for country pages and mock-test pages. */
export async function fetchAgenciesByCountry(
  countryTerms: string[],
  limit = 3,
): Promise<Agency[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  // Filter by country in SQL (uses the countries GIN index) before ranking/
  // limiting — previously this fetched the top 200 agencies SITEWIDE by
  // transparency score with no country filter at all, then filtered in JS.
  // That silently produced empty/thin results for any destination whose
  // agencies weren't already in the global top 200 — fine at today's small
  // scale, but a real correctness bug once there are 50k agencies across
  // 100+ destinations. `.overlaps` narrows to country-relevant rows first;
  // the JS pass below just tolerates loose term variants (e.g. "UAE" vs
  // "UAE (Dubai)") on that already-narrowed set, not the whole table.
  const { data } = await db
    .from('agencies')
    .select('*')
    .eq('is_active', true)
    .overlaps('countries', countryTerms)
    .order('transparency_score', { ascending: false })
    .limit(Math.max(limit * 10, 50))

  if (!data?.length) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matched = (data as any[])
    .filter(a => {
      const countries: string[] = Array.isArray(a.countries) ? a.countries : []
      return countries.some(c =>
        countryTerms.some(term =>
          c.toLowerCase().includes(term.toLowerCase()) ||
          term.toLowerCase().includes(c.toLowerCase()),
        ),
      )
    })
    .slice(0, limit)

  return matched.map(mapRow)
}
