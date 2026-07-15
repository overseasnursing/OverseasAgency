'use server'

import { requireAdmin } from '@/lib/require-admin'
import { moderateReview, deleteReview } from '@/lib/db/reviews'
import { moderateScamReport, deleteScamReport } from '@/lib/db/scam-reports'
import { revalidatePath } from 'next/cache'

// ── Reviews ───────────────────────────────────────────────────────────────

export async function approveReview(reviewId: string): Promise<void> {
  await requireAdmin()
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const db = createAdminClient()
  const { data: review } = await db.from('reviews').select('agency_slug').eq('id', reviewId).single()

  await moderateReview(reviewId, 'approved')
  revalidatePath('/admin/reviews')
  revalidatePath('/reviews')
  // The agency's own page is ISR-cached (revalidate = 3600) and shows both
  // the review card and the Review/AggregateRating JSON-LD — without this,
  // an approved review (and its structured data) stays hidden behind the
  // stale cache for up to an hour instead of appearing immediately.
  if (review?.agency_slug) revalidatePath(`/agency/${review.agency_slug}`)
}

export async function rejectReview(reviewId: string, reason: string): Promise<void> {
  await requireAdmin()
  if (!reason || reason.trim().length < 3) return
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const db = createAdminClient()
  const { data: review } = await db.from('reviews').select('agency_slug').eq('id', reviewId).single()

  await moderateReview(reviewId, 'rejected', reason.trim().slice(0, 500))
  revalidatePath('/admin/reviews')
  // Covers rejecting a review that was previously approved and public.
  if (review?.agency_slug) revalidatePath(`/agency/${review.agency_slug}`)
}

export async function holdReview(reviewId: string): Promise<void> {
  await requireAdmin()
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const db = createAdminClient()
  const { data: review } = await db
    .from('reviews')
    .update({ status: 'pending', moderated_by: null, moderated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .select('agency_slug')
    .single()
  revalidatePath('/admin/reviews')
  // Covers putting a previously approved, public review back on hold.
  if (review?.agency_slug) revalidatePath(`/agency/${review.agency_slug}`)
}

export async function removeReview(reviewId: string): Promise<void> {
  await requireAdmin()
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const db = createAdminClient()
  // Must read agency_slug before deleting — the row won't exist to query afterward.
  const { data: review } = await db.from('reviews').select('agency_slug').eq('id', reviewId).single()

  await deleteReview(reviewId)
  revalidatePath('/admin/reviews')
  if (review?.agency_slug) revalidatePath(`/agency/${review.agency_slug}`)
}

// ── Scam Reports ──────────────────────────────────────────────────────────

export async function approveScamReport(reportId: string): Promise<void> {
  await requireAdmin()
  await moderateScamReport(reportId, 'approved')
  revalidatePath('/admin/scam-reports')
  revalidatePath('/scam-reports')
}

export async function rejectScamReport(reportId: string, reason: string): Promise<void> {
  await requireAdmin()
  if (!reason || reason.trim().length < 3) return
  await moderateScamReport(reportId, 'rejected', reason.trim().slice(0, 500))
  revalidatePath('/admin/scam-reports')
}

export async function removeScamReport(reportId: string): Promise<void> {
  await requireAdmin()
  await deleteScamReport(reportId)
  revalidatePath('/admin/scam-reports')
}
