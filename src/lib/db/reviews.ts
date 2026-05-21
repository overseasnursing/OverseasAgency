import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAllReviews as getMockReviews } from '@/lib/data/reviews'
import type { Tables, InsertDto } from '@/types/database'

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
