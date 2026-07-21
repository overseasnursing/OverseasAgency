'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type MockTestReviewInput = {
  categoryId: string
  testId?:    string
  rating:     number
  reviewText?: string
}

export type MockTestReviewResult =
  | { success: true }
  | { success: false; error: string }

function sanitize(str: string): string {
  // Strip HTML tags and normalise whitespace — no XSS, no injected links
  return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export async function submitMockTestReview(
  data: MockTestReviewInput,
): Promise<MockTestReviewResult> {
  if (!data.categoryId)
    return { success: false, error: 'Invalid category.' }
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5)
    return { success: false, error: 'Rating must be 1–5.' }
  if (data.reviewText && data.reviewText.length > 2000)
    return { success: false, error: 'Review must be under 2,000 characters.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'You must be signed in to submit a review.' }

  // Derive reviewer name from auth metadata (not from client input)
  const meta = user.user_metadata ?? {}
  const reviewerName: string =
    (meta.display_name as string | undefined)?.trim() ||
    (meta.full_name   as string | undefined)?.trim() ||
    (meta.name        as string | undefined)?.trim() ||
    (user.email?.split('@')[0] ?? 'Nurse')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { error } = await db.from('mock_test_reviews').insert({
    category_id:   data.categoryId,
    mock_test_id:  data.testId ?? null,
    user_id:       user.id,
    reviewer_name: sanitize(reviewerName),
    rating:        data.rating,
    review_text:   data.reviewText ? sanitize(data.reviewText) : null,
    status:        'pending',
  })

  if (error) return { success: false, error: 'Failed to save review. Please try again.' }
  return { success: true }
}
