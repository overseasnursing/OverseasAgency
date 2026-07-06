'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, otpEmailHtml } from '@/lib/email/sendEmail'
import { createHash, randomInt } from 'crypto'

// ── Helpers ───────────────────────────────────────────────────────────────────

function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex')
}

function generateOtp(): string {
  return String(randomInt(100000, 999999))
}

// ── Search agencies ───────────────────────────────────────────────────────────

export interface AgencySearchResult {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  isClaimed: boolean
}

export async function searchAgenciesForClaim(
  query: string,
): Promise<{ results?: AgencySearchResult[]; error?: string }> {
  if (!query || query.trim().length < 2) return { results: [] }

  try {
    const db = createAdminClient() as any
    const { data, error } = await db
      .from('agencies')
      .select('id, name, slug, city, state, is_claimed')
      .eq('is_active', true)
      .ilike('name', `%${query.trim()}%`)
      .order('name', { ascending: true })
      .limit(10)

    if (error) return { error: 'Search failed. Please try again.' }

    const results: AgencySearchResult[] = (data ?? []).map((a: any) => ({
      id:        a.id,
      name:      a.name,
      slug:      a.slug,
      city:      a.city ?? null,
      state:     a.state ?? null,
      isClaimed: a.is_claimed ?? false,
    }))

    return { results }
  } catch {
    return { error: 'Search failed. Please try again.' }
  }
}

// ── Submit claim (step 1) ─────────────────────────────────────────────────────

export interface ClaimFormInput {
  agencyId:    string
  agencyName:  string
  contactName: string
  designation: string
  email:       string
  phone:       string
  message:     string
}

export async function submitClaimRequest(
  input: ClaimFormInput,
): Promise<{ claimId?: string; error?: string }> {
  const db = createAdminClient() as any

  // Block re-claims on already-claimed agencies
  const { data: ag } = await db
    .from('agencies')
    .select('is_claimed')
    .eq('id', input.agencyId)
    .single()
  if (ag?.is_claimed) return { error: 'This agency listing has already been claimed.' }

  // Prevent duplicate pending requests from same email for same agency
  const { data: existing } = await db
    .from('claim_requests')
    .select('id, status')
    .eq('agency_id', input.agencyId)
    .eq('contact_email', input.email.toLowerCase())
    .in('status', ['pending_verification', 'pending_approval'])
    .maybeSingle()

  if (existing) {
    // Re-use existing claim_id so the OTP step still works
    return { claimId: existing.id }
  }

  const otp     = generateOtp()
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

  const { data: inserted, error: insertErr } = await db
    .from('claim_requests')
    .insert({
      agency_id:     input.agencyId,
      contact_name:  input.contactName.trim(),
      contact_email: input.email.toLowerCase().trim(),
      contact_phone: input.phone.trim() || null,
      designation:   input.designation,
      message:       input.message.trim() || null,
      status:        'pending_verification',
      otp_hash:      hashOtp(otp),
      otp_expires_at: expires,
    })
    .select('id')
    .single()

  if (insertErr || !inserted) return { error: 'Could not create claim request. Please try again.' }

  try {
    await sendEmail({
      to:      { name: input.contactName, email: input.email },
      subject: `Your OTP to claim ${input.agencyName} on OverseasNursing`,
      html:    otpEmailHtml(otp, input.agencyName),
      text:    `Your OTP is: ${otp}. It expires in 10 minutes.`,
    })
  } catch (emailErr) {
    // Clean up the inserted row so user can retry
    await db.from('claim_requests').delete().eq('id', inserted.id)
    return { error: 'Could not send OTP email. Please check email settings or try again.' }
  }

  return { claimId: inserted.id }
}

// ── Verify OTP (step 2) ───────────────────────────────────────────────────────

const MAX_OTP_ATTEMPTS = 5

export async function verifyClaimOtp(
  claimId: string,
  otp: string,
): Promise<{ success?: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data, error } = await db
    .from('claim_requests')
    .select('id, otp_hash, otp_expires_at, status, otp_attempts')
    .eq('id', claimId)
    .single()

  if (error || !data) return { error: 'Claim request not found.' }
  if (data.status !== 'pending_verification') return { error: 'This OTP has already been used.' }

  if (new Date(data.otp_expires_at) < new Date()) {
    return { error: 'OTP has expired. Please request a new one.' }
  }

  if ((data.otp_attempts ?? 0) >= MAX_OTP_ATTEMPTS) {
    return { error: 'Too many incorrect attempts. Please request a new OTP.' }
  }

  if (data.otp_hash !== hashOtp(otp.trim())) {
    await db
      .from('claim_requests')
      .update({ otp_attempts: (data.otp_attempts ?? 0) + 1 })
      .eq('id', claimId)
    return { error: 'Incorrect OTP. Please check your email and try again.' }
  }

  const { error: updateErr } = await db
    .from('claim_requests')
    .update({
      status:         'pending_approval',
      otp_verified_at: new Date().toISOString(),
      otp_hash:       null, // clear after use
    })
    .eq('id', claimId)

  if (updateErr) return { error: 'Verification failed. Please try again.' }

  return { success: true }
}

// ── Resend OTP ────────────────────────────────────────────────────────────────

export async function resendClaimOtp(
  claimId: string,
): Promise<{ success?: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data, error } = await db
    .from('claim_requests')
    .select('id, contact_email, contact_name, agency_id, status')
    .eq('id', claimId)
    .single()

  if (error || !data) return { error: 'Claim request not found.' }
  if (data.status !== 'pending_verification') return { error: 'OTP already verified.' }

  // Get agency name for the email
  const { data: ag } = await db
    .from('agencies')
    .select('name')
    .eq('id', data.agency_id)
    .single()

  const otp     = generateOtp()
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  await db
    .from('claim_requests')
    .update({ otp_hash: hashOtp(otp), otp_expires_at: expires, otp_attempts: 0 })
    .eq('id', claimId)

  try {
    await sendEmail({
      to:      { name: data.contact_name, email: data.contact_email },
      subject: `New OTP to claim ${ag?.name ?? 'your agency'} on OverseasNursing`,
      html:    otpEmailHtml(otp, ag?.name ?? 'your agency'),
      text:    `Your new OTP is: ${otp}. It expires in 10 minutes.`,
    })
  } catch {
    return { error: 'Failed to resend OTP. Please check email settings.' }
  }

  return { success: true }
}
