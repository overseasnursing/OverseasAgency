'use server'

import { createClient } from '@/lib/supabase/server'
import { insertReview, updateOwnedReview, getReviewByUserAndAgency } from '@/lib/db/reviews'
import type { InsertDto } from '@/types/database'

export type ReviewFormData = {
  agencySlug: string
  agencyName: string
  authorName: string
  authorFrom: string
  countryPlaced: string
  examTaken?: string
  timelineMonths?: number
  actualCostPaid?: string
  overallRating: number
  communicationRating?: number
  transparencyRating?: number
  speedRating?: number
  reviewText: string
  surpriseCharges?: string
  hiddenCharges: boolean
  hiddenChargesAmount?: number
  advice?: string
  placed: boolean
  recommends: boolean
  recommendCondition?: string
}

export type SubmitReviewResult =
  | { success: true; message: string }
  | { success: false; error: string; existingReviewId?: string }

// Strip HTML tags to prevent stored XSS
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

// Validate a string is within length range
function strRange(val: string | undefined, min: number, max: number): boolean {
  if (!val) return min === 0
  return val.length >= min && val.length <= max
}

// Validate rating value
function isRating(n: number | undefined): boolean {
  if (n === undefined) return true
  return Number.isInteger(n) && n >= 1 && n <= 5
}

// Slug format: lowercase letters, digits, hyphens only
const SLUG_RE = /^[a-z0-9-]{2,120}$/

// Shared by submitReview (new) and updateReview (edit) — same content rules
// apply either way.
function validateReviewData(data: ReviewFormData): string | null {
  if (!data.agencySlug || !SLUG_RE.test(data.agencySlug)) return 'Invalid agency.'
  if (!strRange(data.agencyName, 2, 150)) return 'Agency name must be 2–150 characters.'
  if (!strRange(data.authorName, 2, 100)) return 'Your name must be 2–100 characters.'
  if (!strRange(data.authorFrom, 2, 100)) return 'Your location must be 2–100 characters.'
  if (!strRange(data.countryPlaced, 2, 100)) return 'Country placed must be 2–100 characters.'
  if (!strRange(data.reviewText, 50, 5000)) return 'Review must be 50–5,000 characters.'
  if (!Number.isInteger(data.overallRating) || data.overallRating < 1 || data.overallRating > 5)
    return 'Overall rating must be 1–5.'

  if (data.examTaken !== undefined && !strRange(data.examTaken, 0, 100)) return 'Exam taken must be under 100 characters.'
  if (data.actualCostPaid !== undefined && !strRange(data.actualCostPaid, 0, 100)) return 'Cost field must be under 100 characters.'
  if (data.surpriseCharges !== undefined && !strRange(data.surpriseCharges, 0, 1000)) return 'Surprise charges field must be under 1,000 characters.'
  if (data.advice !== undefined && !strRange(data.advice, 0, 1000)) return 'Advice field must be under 1,000 characters.'
  if (data.timelineMonths !== undefined) {
    if (!Number.isInteger(data.timelineMonths) || data.timelineMonths < 1 || data.timelineMonths > 120)
      return 'Timeline must be between 1 and 120 months.'
  }
  if (data.hiddenChargesAmount !== undefined && (Number.isNaN(data.hiddenChargesAmount) || data.hiddenChargesAmount < 0))
    return 'Hidden charges amount must be a positive number.'
  if (data.recommendCondition !== undefined && !strRange(data.recommendCondition, 0, 500))
    return 'Conditions must be under 500 characters.'
  if (!isRating(data.communicationRating)) return 'Invalid communication rating.'
  if (!isRating(data.transparencyRating))  return 'Invalid transparency rating.'
  if (!isRating(data.speedRating))         return 'Invalid speed rating.'

  return null
}

function buildReviewFields(data: ReviewFormData): Omit<InsertDto<'reviews'>, 'agency_slug' | 'agency_name' | 'user_id'> {
  return {
    author_name:           sanitize(data.authorName),
    author_from:           sanitize(data.authorFrom),
    country_placed:        sanitize(data.countryPlaced),
    exam_taken:            data.examTaken ? sanitize(data.examTaken) : null,
    timeline_months:       data.timelineMonths ?? null,
    actual_cost_paid:      data.actualCostPaid ? sanitize(data.actualCostPaid) : null,
    overall_rating:        data.overallRating,
    communication_rating:  data.communicationRating ?? null,
    transparency_rating:   data.transparencyRating ?? null,
    speed_rating:          data.speedRating ?? null,
    review_text:           sanitize(data.reviewText),
    surprise_charges:      data.surpriseCharges ? sanitize(data.surpriseCharges) : null,
    hidden_charges:        data.hiddenCharges,
    hidden_charges_amount: data.hiddenChargesAmount ?? null,
    advice:                data.advice ? sanitize(data.advice) : null,
    placed:                data.placed,
    recommends:            data.recommends,
    recommend_condition:   data.recommendCondition ? sanitize(data.recommendCondition) : null,
  }
}

export async function submitReview(data: ReviewFormData): Promise<SubmitReviewResult> {
  const validationError = validateReviewData(data)
  if (validationError) return { success: false, error: validationError }

  // ── Get Supabase user (optional — anonymous submissions allowed) ───────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // One review per user per agency — direct them to edit the existing one
  // instead of creating a duplicate. Anonymous submissions aren't checked
  // (no user_id to key off), matching the DB constraint's own scope.
  if (user) {
    const existing = await getReviewByUserAndAgency(user.id, data.agencySlug)
    if (existing) {
      return {
        success: false,
        error: 'You’ve already reviewed this agency. Edit your existing review instead of submitting a new one.',
        existingReviewId: existing.id,
      }
    }
  }

  // ── Insert (admin client bypasses RLS — inputs fully validated above) ──
  const result = await insertReview({
    agency_slug: data.agencySlug,
    agency_name: sanitize(data.agencyName),
    user_id:     user?.id ?? null,
    ...buildReviewFields(data),
  })

  if (!result) {
    return { success: false, error: 'Failed to submit review. Please try again.' }
  }

  return {
    success: true,
    message: 'Your review has been submitted and is pending verification. Thank you for helping other nurses.',
  }
}

// Editing resets status to pending — edited content must be re-moderated
// before it's public again, same as any new submission.
export async function updateReview(reviewId: string, data: ReviewFormData): Promise<SubmitReviewResult> {
  const validationError = validateReviewData(data)
  if (validationError) return { success: false, error: validationError }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'You must be signed in to edit a review.' }

  const ok = await updateOwnedReview(reviewId, user.id, {
    ...buildReviewFields(data),
    status:        'pending',
    moderated_by:  null,
    moderated_at:  null,
    reject_reason: null,
  })

  if (!ok) return { success: false, error: 'Failed to update review. Please try again.' }

  return {
    success: true,
    message: 'Your review has been updated and is pending re-verification.',
  }
}
