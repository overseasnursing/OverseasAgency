'use server'

import { createClient } from '@/lib/supabase/server'
import { insertScamReport, updateOwnedScamReport } from '@/lib/db/scam-reports'
import type { InsertDto } from '@/types/database'

export type ScamReportFormData = {
  agencySlug: string
  agencyName: string
  reporterName: string
  reporterFrom: string
  category: 'fee-fraud' | 'fake-job' | 'document-fraud' | 'visa-fraud' | 'abandonment' | 'other'
  severity: 'critical' | 'high' | 'moderate'
  countryPromised: string
  amountLost?: number
  amountPaid?: number
  amountRecovered?: number
  incidentDate?: string
  incidentText: string
  warningSignsMissed?: string[]
  lessonsLearned?: string[]
  emotionalExperience?: string
}

export type SubmitScamReportResult =
  | { success: true; message: string }
  | { success: false; error: string }

// Strip HTML tags to prevent stored XSS
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

function strRange(val: string | undefined, min: number, max: number): boolean {
  if (!val) return min === 0
  return val.length >= min && val.length <= max
}

const SLUG_RE     = /^[a-z0-9-]{2,120}$/
const DATE_RE     = /^\d{4}-\d{2}-\d{2}$/
const MAX_AMOUNT  = 10_000_000

const ALLOWED_CATEGORIES = new Set([
  'fee-fraud', 'fake-job', 'document-fraud', 'visa-fraud', 'abandonment', 'other',
])
const ALLOWED_SEVERITIES = new Set(['critical', 'high', 'moderate'])

function generateSlug(agencyName: string, category: string): string {
  const base = agencyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
  const cat  = category.replace(/-/g, '').slice(0, 20)
  const ts   = Date.now().toString(36)
  return `${base}-${cat}-${ts}`
}

// Shared by submitScamReport (new) and updateScamReport (edit) — same
// content rules apply either way.
function validateScamReportData(data: ScamReportFormData): string | null {
  if (!data.agencySlug || !SLUG_RE.test(data.agencySlug)) return 'Invalid agency.'
  if (!strRange(data.agencyName, 2, 150)) return 'Agency name must be 2–150 characters.'
  if (!strRange(data.reporterName, 2, 100)) return 'Your name must be 2–100 characters.'
  if (!strRange(data.reporterFrom, 2, 100)) return 'Your location must be 2–100 characters.'
  if (!strRange(data.countryPromised, 2, 100)) return 'Country promised must be 2–100 characters.'
  if (!strRange(data.incidentText, 100, 10_000)) return 'Please describe the incident in 100–10,000 characters.'
  if (!ALLOWED_CATEGORIES.has(data.category)) return 'Invalid category.'
  if (!ALLOWED_SEVERITIES.has(data.severity)) return 'Invalid severity.'

  if (data.emotionalExperience !== undefined && !strRange(data.emotionalExperience, 0, 2000))
    return 'Emotional experience field must be under 2,000 characters.'

  if (data.incidentDate !== undefined && data.incidentDate !== '') {
    if (!DATE_RE.test(data.incidentDate)) return 'Invalid date format.'
    const d = new Date(data.incidentDate)
    if (isNaN(d.getTime()) || d > new Date()) return 'Incident date must be in the past.'
  }

  const checkAmount = (n: number | undefined, label: string) => {
    if (n === undefined) return null
    if (!Number.isFinite(n) || n < 0 || n > MAX_AMOUNT) return `${label} must be between 0 and ₹1 crore.`
    return null
  }
  for (const e of [
    checkAmount(data.amountLost,      'Amount lost'),
    checkAmount(data.amountPaid,      'Amount paid'),
    checkAmount(data.amountRecovered, 'Amount recovered'),
  ]) if (e) return e

  if (data.warningSignsMissed !== undefined) {
    if (!Array.isArray(data.warningSignsMissed) || data.warningSignsMissed.length > 20)
      return 'Too many warning signs (max 20).'
    if (data.warningSignsMissed.some((s) => typeof s !== 'string' || s.length > 200))
      return 'Each warning sign must be under 200 characters.'
  }
  if (data.lessonsLearned !== undefined) {
    if (!Array.isArray(data.lessonsLearned) || data.lessonsLearned.length > 20)
      return 'Too many lessons learned (max 20).'
    if (data.lessonsLearned.some((s) => typeof s !== 'string' || s.length > 200))
      return 'Each lesson must be under 200 characters.'
  }

  return null
}

function buildScamReportFields(
  data: ScamReportFormData,
): Omit<InsertDto<'scam_reports'>, 'agency_slug' | 'agency_name' | 'user_id' | 'slug'> {
  return {
    reporter_name:         sanitize(data.reporterName),
    reporter_from:         sanitize(data.reporterFrom),
    category:              data.category,
    severity:              data.severity,
    country_promised:      sanitize(data.countryPromised),
    amount_lost:           data.amountLost ?? null,
    amount_paid:           data.amountPaid ?? null,
    amount_recovered:      data.amountRecovered ?? null,
    incident_date:         (data.incidentDate && data.incidentDate !== '') ? data.incidentDate : null,
    incident_text:         sanitize(data.incidentText),
    warning_signs_missed:  data.warningSignsMissed?.map(sanitize) ?? null,
    lessons_learned:       data.lessonsLearned?.map(sanitize) ?? null,
    emotional_experience:  data.emotionalExperience ? sanitize(data.emotionalExperience) : null,
  }
}

export async function submitScamReport(
  data: ScamReportFormData,
): Promise<SubmitScamReportResult> {
  const validationError = validateScamReportData(data)
  if (validationError) return { success: false, error: validationError }

  // ── Get Supabase user (optional — anonymous submissions allowed) ───────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const slug = generateSlug(data.agencyName, data.category)

  // ── Insert (admin client bypasses RLS — inputs fully validated above) ──
  const result = await insertScamReport({
    slug,
    agency_slug: data.agencySlug,
    agency_name: sanitize(data.agencyName),
    user_id:     user?.id ?? null,
    ...buildScamReportFields(data),
  })

  if (!result) {
    return { success: false, error: 'Failed to submit report. Please try again.' }
  }

  return {
    success: true,
    message: 'Your report has been submitted for review. Our team will verify and publish it within 48 hours. Thank you for protecting other nurses.',
  }
}

// Editing resets status to pending — edited content must be re-moderated
// before it's public again, same as any new submission.
export async function updateScamReport(reportId: string, data: ScamReportFormData): Promise<SubmitScamReportResult> {
  const validationError = validateScamReportData(data)
  if (validationError) return { success: false, error: validationError }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'You must be signed in to edit a report.' }

  const ok = await updateOwnedScamReport(reportId, user.id, {
    ...buildScamReportFields(data),
    status:        'pending',
    moderated_by:  null,
    moderated_at:  null,
    reject_reason: null,
  })

  if (!ok) return { success: false, error: 'Failed to update report. Please try again.' }

  return {
    success: true,
    message: 'Your report has been updated and is pending re-verification.',
  }
}
