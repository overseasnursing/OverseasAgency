'use server'

import { requireAdmin } from '@/lib/require-admin'
import { moderateReview, deleteReview } from '@/lib/db/reviews'
import { moderateScamReport, deleteScamReport } from '@/lib/db/scam-reports'
import { revalidatePath } from 'next/cache'

// ── Reviews ───────────────────────────────────────────────────────────────

export async function approveReview(reviewId: string): Promise<void> {
  await requireAdmin()
  await moderateReview(reviewId, 'approved')
  revalidatePath('/admin/reviews')
  revalidatePath('/reviews')
}

export async function rejectReview(reviewId: string, reason: string): Promise<void> {
  await requireAdmin()
  if (!reason || reason.trim().length < 3) return
  await moderateReview(reviewId, 'rejected', reason.trim().slice(0, 500))
  revalidatePath('/admin/reviews')
}

export async function holdReview(reviewId: string): Promise<void> {
  await requireAdmin()
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const db = createAdminClient()
  await db
    .from('reviews')
    .update({ status: 'pending', moderated_by: null, moderated_at: new Date().toISOString() })
    .eq('id', reviewId)
  revalidatePath('/admin/reviews')
}

export async function removeReview(reviewId: string): Promise<void> {
  await requireAdmin()
  await deleteReview(reviewId)
  revalidatePath('/admin/reviews')
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
