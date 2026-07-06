import { createAdminClient } from '@/lib/supabase/admin'
import type { Agency } from '@/types/agency'
import { normalizeCityName, isExcludedCityName } from '@/lib/data/cityNormalization'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

function formatCostText(raw: string | null): string {
  if (!raw) return '—'
  // If already formatted like "₹4.2L", return as-is
  if (raw.includes('₹') || raw.toLowerCase().includes('l')) return raw
  // If it's a raw number in rupees, convert to lakhs notation
  const n = parseFloat(raw.replace(/[,\s]/g, ''))
  if (!isNaN(n) && n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (!isNaN(n)) return `₹${n.toLocaleString('en-IN')}`
  return raw
}

type BranchDbRow = { agency_id: string; city: string | null; state: string | null }
type ReviewDbRow = { agency_id: string; author_name: string; author_from: string | null; country_placed: string | null; overall_rating: number; recommends: boolean; surprise_charges: boolean; review_text: string; actual_cost_paid: string | null; timeline_months: number | null; created_at: string }

export async function getAgencies(): Promise<Agency[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: agencyRows, error } = await db
    .from('agencies')
    .select('*')
    .eq('is_active', true)

  if (error || !agencyRows?.length) return []

  // Will sort by computed rating after review stats are built

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agencyIds: string[] = agencyRows.map((a: any) => a.id as string)

  // Branches and reviews are independent lookups — fetch in parallel instead
  // of adding two sequential round-trips to this listing page's TTFB.
  const [{ data: branchRows }, { data: reviewRows }] = await Promise.all([
    db
      .from('branches')
      .select('agency_id, city, state')
      .in('agency_id', agencyIds),
    db
      .from('reviews')
      .select('agency_id, author_name, author_from, country_placed, overall_rating, recommends, surprise_charges, review_text, actual_cost_paid, timeline_months, created_at')
      .in('agency_id', agencyIds)
      .eq('status', 'approved')
      .order('created_at', { ascending: false }),
  ])

  const branchMap = new Map<string, { cities: string[]; states: string[] }>()
  for (const b of (branchRows ?? []) as BranchDbRow[]) {
    if (!branchMap.has(b.agency_id)) branchMap.set(b.agency_id, { cities: [], states: [] })
    const entry = branchMap.get(b.agency_id)!
    if (b.city && !isExcludedCityName(b.city)) {
      const city = normalizeCityName(b.city)
      if (!entry.cities.includes(city)) entry.cities.push(city)
    }
    if (b.state && !entry.states.includes(b.state)) entry.states.push(b.state)
  }

  // Build per-agency maps
  const allReviews = (reviewRows ?? []) as ReviewDbRow[]
  const snippetMap = new Map<string, ReviewDbRow>()
  const statsMap = new Map<string, { ratings: number[]; recommends: number; hidden: number }>()

  for (const r of allReviews) {
    const id = r.agency_id
    if (!snippetMap.has(id)) snippetMap.set(id, r)
    if (!statsMap.has(id)) statsMap.set(id, { ratings: [], recommends: 0, hidden: 0 })
    const s = statsMap.get(id)!
    s.ratings.push(r.overall_rating)
    if (r.recommends) s.recommends++
    if (r.surprise_charges) s.hidden++
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return agencyRows.map((a: any): Agency => {
    const r = snippetMap.get(a.id)
    const stats = statsMap.get(a.id)
    const reviewCount = stats?.ratings.length ?? 0
    const rating = reviewCount > 0
      ? Math.round((stats!.ratings.reduce((s, v) => s + v, 0) / reviewCount) * 10) / 10
      : 0
    const recommendationPercent = reviewCount > 0
      ? Math.round((stats!.recommends / reviewCount) * 100)
      : 0
    const hiddenChargesReported = stats?.hidden ?? 0

    // Parse city/state from location string when DB columns are empty
    const locationParts = (a.location ?? '').split(',').map((s: string) => s.trim())
    const rawCity = (a.city && a.city.trim()) ? a.city.trim() : (locationParts[0] ?? '')
    const city  = rawCity ? normalizeCityName(rawCity) : rawCity
    const state = (a.state && a.state.trim()) ? a.state.trim() : (locationParts[1] ?? '')

    const reviewSnippet = r
      ? {
          authorName:     r.author_name,
          authorFrom:     r.author_from ?? '',
          countryPlaced:  r.country_placed ?? '',
          rating:         r.overall_rating,
          text:           r.review_text,
          actualCostPaid: formatCostText(r.actual_cost_paid),
          timeline:       r.timeline_months ? `${r.timeline_months} months` : '',
          date:           formatDate(r.created_at),
        }
      : {
          authorName:     'Verified Nurse',
          authorFrom:     city ? `${city}, ${state}` : '',
          countryPlaced:  (a.countries ?? [])[0] ?? '',
          rating,
          text:           a.tagline ?? '',
          actualCostPaid: a.pricing_min_lakhs ? `₹${a.pricing_min_lakhs}L` : '—',
          timeline:       a.average_timeline_months ?? '',
          date:           '',
        }

    return {
      id:                    a.id,
      slug:                  a.slug,
      name:                  a.name,
      logo:                  a.logo_url          ?? undefined,
      featuredImage:         a.featured_image_url ?? undefined,
      location:              a.location,
      city,
      state,
      branchCities:          branchMap.get(a.id)?.cities ?? [],
      branchStates:          branchMap.get(a.id)?.states ?? [],
      established:           a.established ?? 0,
      trustLevel:            a.trust_level,
      rating,
      reviewCount,
      placementCount:        a.placement_count ?? 0,
      transparencyScore:     a.transparency_score ?? 0,
      countries:             a.countries ?? [],
      examsSupported:        a.exams_supported ?? [],
      pricing: {
        minLakhs:            a.pricing_min_lakhs ?? 0,
        maxLakhs:            a.pricing_max_lakhs ?? 0,
        isApproximate:       a.pricing_is_approximate ?? false,
      },
      hiddenChargesReported,
      visaSponsorship:       a.visa_sponsorship ?? false,
      averageTimelineMonths: a.average_timeline_months ?? '',
      tagline:               a.tagline ?? '',
      featured:              a.featured ?? false,
      reviewSnippet,
      googlePlaceId:         a.google_place_id      ?? undefined,
      googleRating:          a.google_rating        ?? undefined,
      googleReviewCount:     a.google_review_count  ?? undefined,
    }
  }).sort((a: Agency, b: Agency) => b.rating - a.rating || b.reviewCount - a.reviewCount)
}
