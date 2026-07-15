'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getMyReviews, setReviewDisabled, type ReviewRow } from '@/lib/db/reviews'

async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user
}

export async function getMyReviewsAction(): Promise<ReviewRow[]> {
  const user = await requireUser()
  return getMyReviews(user.id)
}

export async function toggleMyReviewDisabled(reviewId: string, disabled: boolean): Promise<{ error: string | null }> {
  const user = await requireUser()
  const ok = await setReviewDisabled(reviewId, user.id, disabled)
  if (!ok) return { error: 'Failed to update review. Please try again.' }

  revalidatePath('/dashboard/reviews')
  // Public agency page uses createAdminClient() (bypasses the anon-client
  // cache key), so the slug alone is enough to invalidate it here.
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const db = createAdminClient()
  const { data } = await db.from('reviews').select('agency_slug').eq('id', reviewId).single()
  if (data?.agency_slug) revalidatePath(`/agency/${data.agency_slug}`)

  return { error: null }
}
