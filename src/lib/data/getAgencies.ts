import { createAdminClient } from '@/lib/supabase/admin'
import type { Agency } from '@/types/agency'

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

export async function getAgencies(): Promise<Agency[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: agencyRows, error } = await db
    .from('agencies')
    .select('*')
    .eq('is_active', true)

  if (error || !agencyRows?.length) return []

  // Will sort by computed rating after review stats are built

  const agencyIds: string[] = agencyRows.map((a: any) => a.id)

  // Fetch all approved reviews for all agencies in one query
  const { data: reviewRows } = await db
    .from('reviews')
    .select('agency_id, author_name, author_from, country_placed, overall_rating, recommends, surprise_charges, review_text, actual_cost_paid, timeline_months, created_at')
    .in('agency_id', agencyIds)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  // Build per-agency maps
  const allReviews = (reviewRows ?? []) as any[]
  const snippetMap = new Map<string, any>()
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
    const city  = (a.city  && a.city.trim())  ? a.city.trim()  : (locationParts[0] ?? '')
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
    }
  }).sort((a: Agency, b: Agency) => b.rating - a.rating || b.reviewCount - a.reviewCount)
}
