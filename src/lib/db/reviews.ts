import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAllReviews as getMockReviews } from '@/lib/data/reviews'
import type { Tables, InsertDto } from '@/types/database'
import type { PlatformReview } from '@/types/review'

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'

export type ReviewRow = Tables<'reviews'>

// ── Public reads (anon client, RLS enforces approved-only) ────────────────

export async function getApprovedReviews(): Promise<ReviewRow[]> {
  if (!SUPABASE_CONFIGURED) {
    return getMockReviews() as unknown as ReviewRow[]
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[reviews] getApprovedReviews:', error.message)
    return getMockReviews() as unknown as ReviewRow[]
  }
  return data ?? []
}

export async function getApprovedReviewsByAgency(agencySlug: string): Promise<ReviewRow[]> {
  if (!SUPABASE_CONFIGURED) {
    const mock = getMockReviews()
    return mock.filter((r) => r.agencySlug === agencySlug) as unknown as ReviewRow[]
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('agency_slug', agencySlug)
    .eq('status', 'approved')
    .order('helpful_count', { ascending: false })
  if (error) {
    console.error('[reviews] getApprovedReviewsByAgency:', error.message)
    return []
  }
  return data ?? []
}

// ── Admin reads (admin client, bypasses RLS so all statuses visible) ──────

export async function getPendingReviews(): Promise<ReviewRow[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) {
    console.error('[reviews] getPendingReviews:', error.message)
    return []
  }
  return data ?? []
}

export async function getAllReviewsAdmin(
  status?: string,
  agencySlug?: string,
): Promise<ReviewRow[]> {
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = db.from('reviews').select('*').order('created_at', { ascending: false })
  if (status && status !== 'all') query = query.eq('status', status)
  if (agencySlug) query = query.eq('agency_slug', agencySlug)
  const { data, error } = await query
  if (error) {
    console.error('[reviews] getAllReviewsAdmin:', error.message)
    return []
  }
  return data ?? []
}

export async function getReviewStats(): Promise<{
  total: number; pending: number; approved: number; rejected: number
}> {
  const db = createAdminClient()
  const { data, error } = await db.from('reviews').select('status')
  if (error || !data) return { total: 0, pending: 0, approved: 0, rejected: 0 }
  return {
    total:    data.length,
    pending:  data.filter((r) => r.status === 'pending').length,
    approved: data.filter((r) => r.status === 'approved').length,
    rejected: data.filter((r) => r.status === 'rejected').length,
  }
}

export async function getRecentReviewsAdmin(limit = 5): Promise<ReviewRow[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return data ?? []
}

// ── Public insert (admin client so anonymous submissions work) ────────────
// Server actions validate all inputs before calling this.

export async function insertReview(review: InsertDto<'reviews'>): Promise<{ id: string } | null> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('reviews')
    .insert(review)
    .select('id')
    .single()
  if (error) {
    console.error('[reviews] insertReview:', error.message)
    return null
  }
  return data
}

// ── Admin mutations (admin client, caller must verify admin cookie first) ─

export async function moderateReview(
  id: string,
  status: 'approved' | 'rejected',
  rejectReason?: string,
): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db
    .from('reviews')
    .update({
      status,
      moderated_by:  null, // admin uses custom cookie auth, not a Supabase user UUID
      moderated_at:  new Date().toISOString(),
      reject_reason: rejectReason ?? null,
    })
    .eq('id', id)
  if (error) {
    console.error('[reviews] moderateReview:', error.message)
    return false
  }
  return true
}

export async function deleteReview(id: string): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db.from('reviews').delete().eq('id', id)
  if (error) {
    console.error('[reviews] deleteReview:', error.message)
    return false
  }
  return true
}

// ── Public page data (mapped to PlatformReview) ───────────────────────────

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()
}

function parseCostStr(text: string | null): number {
  if (!text) return 0
  const clean = text.replace(/[₹,\s]/g, '')
  const lakh  = clean.match(/^([\d.]+)[Ll]/)
  if (lakh) return parseFloat(lakh[1]) * 100000
  const n = parseFloat(clean)
  return isNaN(n) ? 0 : n
}

function rowToPlatformReview(row: ReviewRow, featured: boolean): PlatformReview {
  return {
    id:                       row.id,
    agencySlug:               row.agency_slug,
    agencyName:               row.agency_name,
    authorName:               row.author_name,
    authorInitials:           initials(row.author_name),
    authorFrom:               row.author_from,
    verified:                 true,
    verifiedPlacement:        row.placed,
    date:                     row.created_at,
    rating:                   row.overall_rating,
    communicationRating:      row.communication_rating ?? row.overall_rating,
    transparencyRating:       row.transparency_rating  ?? row.overall_rating,
    speedRating:              row.speed_rating          ?? row.overall_rating,
    destinationCountry:       row.country_placed,
    destinationCity:          '',
    hospitalType:             '',
    actualCostPaid:           parseCostStr(row.actual_cost_paid),
    timelineMonths:           row.timeline_months ?? 0,
    visaReceived:             row.placed,
    hiddenChargesExperienced: !!row.surprise_charges,
    wouldRecommend:           row.recommends,
    title:                    row.country_placed
                                ? `Placed in ${row.country_placed}`
                                : 'Verified Review',
    body:                     row.review_text,
    adviceForOthers:          row.advice ?? undefined,
    helpful:                  row.helpful_count,
    featured,
  }
}

export async function getPublicReviews(): Promise<PlatformReview[]> {
  if (!SUPABASE_CONFIGURED) return getMockReviews()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error || !data?.length) return getMockReviews()

  // Mark top 4 most-helpful verified-placement reviews as featured
  const featuredIds = new Set(
    [...data]
      .filter(r => r.placed)
      .sort((a, b) => b.helpful_count - a.helpful_count)
      .slice(0, 4)
      .map(r => r.id)
  )

  return data.map(r => rowToPlatformReview(r, featuredIds.has(r.id)))
}

export async function getPublicReviewStats(): Promise<{
  total: number
  placed: number
  withHiddenCharges: number
  avgRating: number
  recommendPercent: number
}> {
  if (!SUPABASE_CONFIGURED) {
    const mock = getMockReviews()
    const total = mock.length
    return {
      total,
      placed:            mock.filter(r => r.verifiedPlacement).length,
      withHiddenCharges: mock.filter(r => r.hiddenChargesExperienced).length,
      avgRating:         Math.round(mock.reduce((s, r) => s + r.rating, 0) / total * 10) / 10,
      recommendPercent:  Math.round(mock.filter(r => r.wouldRecommend).length / total * 100),
    }
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('overall_rating, placed, surprise_charges, recommends')
    .eq('status', 'approved')

  if (!data?.length) return { total: 0, placed: 0, withHiddenCharges: 0, avgRating: 0, recommendPercent: 0 }

  const total = data.length
  return {
    total,
    placed:            data.filter(r => r.placed).length,
    withHiddenCharges: data.filter(r => !!r.surprise_charges).length,
    avgRating:         Math.round(data.reduce((s, r) => s + r.overall_rating, 0) / total * 10) / 10,
    recommendPercent:  Math.round(data.filter(r => r.recommends).length / total * 100),
  }
}
