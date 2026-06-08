'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type MockTestReviewInput = {
  categoryId:       string
  testId?:          string
  rating:           number
  difficulty:       'easy' | 'medium' | 'hard'
  reviewTitle?:     string
  reviewText?:      string
  reviewerName:     string
  reviewerCountry?: string
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
  if (!['easy', 'medium', 'hard'].includes(data.difficulty))
    return { success: false, error: 'Invalid difficulty.' }
  if (!data.reviewerName || data.reviewerName.trim().length < 2)
    return { success: false, error: 'Name is required.' }
  if (data.reviewTitle && data.reviewTitle.length > 120)
    return { success: false, error: 'Title must be under 120 characters.' }
  if (data.reviewText && data.reviewText.length > 2000)
    return { success: false, error: 'Review must be under 2,000 characters.' }
  if (data.reviewerCountry && data.reviewerCountry.length > 100)
    return { success: false, error: 'Country must be under 100 characters.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { error } = await db.from('mock_test_reviews').insert({
    category_id:      data.categoryId,
    mock_test_id:     data.testId ?? null,
    user_id:          user?.id ?? null,
    reviewer_name:    sanitize(data.reviewerName),
    reviewer_country: data.reviewerCountry ? sanitize(data.reviewerCountry) : null,
    rating:           data.rating,
    difficulty:       data.difficulty,
    review_title:     data.reviewTitle  ? sanitize(data.reviewTitle)  : null,
    review_text:      data.reviewText   ? sanitize(data.reviewText)   : null,
    status:           'pending',
  })

  if (error) return { success: false, error: 'Failed to save review. Please try again.' }
  return { success: true }
}
