'use server'

import { createClient } from '@/lib/supabase/server'
import { insertReview } from '@/lib/db/reviews'

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
  advice?: string
  placed: boolean
  recommends: boolean
}

export type SubmitReviewResult =
  | { success: true; message: string }
  | { success: false; error: string }

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

export async function submitReview(data: ReviewFormData): Promise<SubmitReviewResult> {
  // ── Presence & format checks ───────────────────────────────────────────
  if (!data.agencySlug || !SLUG_RE.test(data.agencySlug))
    return { success: false, error: 'Invalid agency.' }
  if (!strRange(data.agencyName, 2, 150))
    return { success: false, error: 'Agency name must be 2–150 characters.' }
  if (!strRange(data.authorName, 2, 100))
    return { success: false, error: 'Your name must be 2–100 characters.' }
  if (!strRange(data.authorFrom, 2, 100))
    return { success: false, error: 'Your location must be 2–100 characters.' }
  if (!strRange(data.countryPlaced, 2, 100))
    return { success: false, error: 'Country placed must be 2–100 characters.' }
  if (!strRange(data.reviewText, 50, 5000))
    return { success: false, error: 'Review must be 50–5,000 characters.' }
  if (!Number.isInteger(data.overallRating) || data.overallRating < 1 || data.overallRating > 5)
    return { success: false, error: 'Overall rating must be 1–5.' }

  // ── Optional field validation ──────────────────────────────────────────
  if (data.examTaken !== undefined && !strRange(data.examTaken, 0, 100))
    return { success: false, error: 'Exam taken must be under 100 characters.' }
  if (data.actualCostPaid !== undefined && !strRange(data.actualCostPaid, 0, 100))
    return { success: false, error: 'Cost field must be under 100 characters.' }
  if (data.surpriseCharges !== undefined && !strRange(data.surpriseCharges, 0, 1000))
    return { success: false, error: 'Surprise charges field must be under 1,000 characters.' }
  if (data.advice !== undefined && !strRange(data.advice, 0, 1000))
    return { success: false, error: 'Advice field must be under 1,000 characters.' }
  if (data.timelineMonths !== undefined) {
    if (!Number.isInteger(data.timelineMonths) || data.timelineMonths < 1 || data.timelineMonths > 120)
      return { success: false, error: 'Timeline must be between 1 and 120 months.' }
  }
  if (!isRating(data.communicationRating)) return { success: false, error: 'Invalid communication rating.' }
  if (!isRating(data.transparencyRating))  return { success: false, error: 'Invalid transparency rating.' }
  if (!isRating(data.speedRating))         return { success: false, error: 'Invalid speed rating.' }

  // ── Get Supabase user (optional — anonymous submissions allowed) ───────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ── Insert (admin client bypasses RLS — inputs fully validated above) ──
  const result = await insertReview({
    agency_slug:           data.agencySlug,
    agency_name:           sanitize(data.agencyName),
    user_id:               user?.id ?? null,
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
    advice:                data.advice ? sanitize(data.advice) : null,
    placed:                data.placed,
    recommends:            data.recommends,
  })

  if (!result) {
    return { success: false, error: 'Failed to submit review. Please try again.' }
  }

  return {
    success: true,
    message: 'Your review has been submitted and is pending verification. Thank you for helping other nurses.',
  }
}
