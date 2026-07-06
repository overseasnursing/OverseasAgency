'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'
import { sendEmail, approvalEmailHtml, rejectionEmailHtml } from '@/lib/email/sendEmail'
import { normalizeCityName } from '@/lib/data/cityNormalization'

// ── Public: submit a new agency ───────────────────────────────────────────────

export interface AgencySubmissionInput {
  agency_name:      string
  city:             string
  state:            string
  website?:         string
  email:            string
  phone?:           string
  whatsapp?:        string
  description?:     string
  countries_served: string[]
  services:         string[]
  established_year?: number
  contact_name:     string
  contact_email:    string
  contact_phone?:   string
  designation:      string
}

// Strip HTML tags to prevent stored XSS
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

// Validate a string is within length range
function strRange(val: string | undefined, min: number, max: number): boolean {
  if (!val) return min === 0
  return val.length >= min && val.length <= max
}

export async function submitAgency(
  input: AgencySubmissionInput,
): Promise<{ error: string | null }> {
  if (!strRange(input.agency_name, 2, 150)) return { error: 'Agency name must be 2–150 characters.' }
  if (!strRange(input.city, 1, 100)) return { error: 'City must be under 100 characters.' }
  if (!strRange(input.state, 1, 100)) return { error: 'State must be under 100 characters.' }
  if (!strRange(input.website, 0, 300)) return { error: 'Website URL must be under 300 characters.' }
  if (!strRange(input.email, 3, 200)) return { error: 'Agency email must be 3–200 characters.' }
  if (!strRange(input.phone, 0, 30)) return { error: 'Phone must be under 30 characters.' }
  if (!strRange(input.whatsapp, 0, 30)) return { error: 'WhatsApp must be under 30 characters.' }
  if (!strRange(input.description, 0, 3000)) return { error: 'Description must be under 3,000 characters.' }
  if (!strRange(input.contact_name, 2, 100)) return { error: 'Your name must be 2–100 characters.' }
  if (!strRange(input.contact_email, 3, 200)) return { error: 'Your email must be 3–200 characters.' }
  if (!strRange(input.contact_phone, 0, 30)) return { error: 'Your phone must be under 30 characters.' }
  if (!strRange(input.designation, 1, 100)) return { error: 'Designation must be under 100 characters.' }

  input = {
    ...input,
    agency_name:   sanitize(input.agency_name),
    city:          normalizeCityName(sanitize(input.city)),
    state:         sanitize(input.state),
    website:       input.website ? sanitize(input.website) : input.website,
    email:         sanitize(input.email),
    phone:         input.phone ? sanitize(input.phone) : input.phone,
    whatsapp:      input.whatsapp ? sanitize(input.whatsapp) : input.whatsapp,
    description:   input.description ? sanitize(input.description) : input.description,
    contact_name:  sanitize(input.contact_name),
    contact_email: sanitize(input.contact_email),
    contact_phone: input.contact_phone ? sanitize(input.contact_phone) : input.contact_phone,
    designation:   sanitize(input.designation),
  }

  const db = createAdminClient() as any

  // Prevent duplicate pending submissions from same email
  const { data: existing } = await db
    .from('agency_submissions')
    .select('id, status')
    .eq('contact_email', input.contact_email.toLowerCase().trim())
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) {
    return { error: 'A submission from this email is already under review. We will contact you once it is processed.' }
  }

  const { error } = await db.from('agency_submissions').insert({
    agency_name:      input.agency_name.trim(),
    city:             input.city.trim(),
    state:            input.state.trim(),
    website:          input.website?.trim() || null,
    email:            input.email.trim(),
    phone:            input.phone?.trim() || null,
    whatsapp:         input.whatsapp?.trim() || null,
    description:      input.description?.trim() || null,
    countries_served: input.countries_served,
    services:         input.services,
    established_year: input.established_year ?? null,
    contact_name:     input.contact_name.trim(),
    contact_email:    input.contact_email.toLowerCase().trim(),
    contact_phone:    input.contact_phone?.trim() || null,
    designation:      input.designation,
  })

  if (error) return { error: error.message }
  return { error: null }
}

// ── Admin: approve a submission ───────────────────────────────────────────────

export async function approveAgencySubmission(
  submissionId: string,
): Promise<{ error: string | null }> {
  await requireAdmin()
  const db = createAdminClient() as any

  const { data: sub } = await db
    .from('agency_submissions')
    .select('*')
    .eq('id', submissionId)
    .single()

  if (!sub) return { error: 'Submission not found' }

  // Re-normalize in case this submission predates the normalization added at
  // the submitAgency() write path.
  const city = normalizeCityName(sub.city)

  // 1. Create the agency
  const slug = sub.agency_name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // Make slug unique by appending city if clash exists
  const { data: existing } = await db.from('agencies').select('id').eq('slug', slug).maybeSingle()
  const finalSlug = existing
    ? `${slug}-${city.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    : slug

  const { data: agency, error: agencyError } = await db
    .from('agencies')
    .insert({
      name:        sub.agency_name,
      slug:        finalSlug,
      city,
      state:       sub.state,
      location:    `${city}, ${sub.state}`,
      email:       sub.email,
      website:     sub.website ?? null,
      whatsapp:    sub.whatsapp ?? null,
      description: sub.description ?? null,
      countries:   sub.countries_served ?? [],
      services:    sub.services ?? [],
      established: sub.established_year ?? null,
      trust_level: 'unverified',
      is_active:   true,
      is_claimed:  true,
    })
    .select('id, slug')
    .single()

  if (agencyError) return { error: agencyError.message }

  // 2. Create or reuse Supabase auth user for the contact email
  const supabaseAdmin = createAdminClient() as any

  let userId: string
  const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(sub.contact_email)

  if (existingUser?.user) {
    userId = existingUser.user.id
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      // role/agency_id go in app_metadata — only the service role can write it,
      // unlike user_metadata which the account owner can edit via the Auth API.
      app_metadata: { role: 'agency_admin', agency_id: agency.id },
    })
  } else {
    const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: sub.contact_email,
      email_confirm: true,
      app_metadata: { role: 'agency_admin', agency_id: agency.id },
      user_metadata: { display_name: sub.contact_name },
    })
    if (userError) return { error: userError.message }
    userId = newUser.user.id
  }

  // 3. Generate a set-password link
  const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email: sub.contact_email,
  })
  const setPasswordUrl = linkData?.properties?.action_link ?? null

  // 4. Mark agency as claimed by this user
  await db.from('agencies').update({ claimed_by_user_id: userId }).eq('id', agency.id)

  // 5. Mark submission as approved
  await db.from('agency_submissions').update({
    status:      'approved',
    reviewed_at: new Date().toISOString(),
    agency_id:   agency.id,
  }).eq('id', submissionId)

  // 6. Send approval email if SendPulse is configured
  if (setPasswordUrl) {
    try {
      await sendEmail({
        to: { email: sub.contact_email, name: sub.contact_name },
        subject: `Your agency "${sub.agency_name}" is now live on OverseasNursing`,
        html: approvalEmailHtml(sub.agency_name, setPasswordUrl),
      })
    } catch { /* email optional — don't fail the approval */ }
  }

  revalidatePath('/admin/agency-submissions')
  revalidatePath(`/agency/${finalSlug}`)
  return { error: null }
}

// ── Admin: reject a submission ────────────────────────────────────────────────

export async function rejectAgencySubmission(
  submissionId: string,
  reason?: string,
): Promise<{ error: string | null }> {
  await requireAdmin()
  const db = createAdminClient() as any

  const { data: sub } = await db
    .from('agency_submissions')
    .select('contact_email, contact_name, agency_name')
    .eq('id', submissionId)
    .single()

  if (!sub) return { error: 'Submission not found' }

  await db.from('agency_submissions').update({
    status:           'rejected',
    rejection_reason: reason ?? null,
    reviewed_at:      new Date().toISOString(),
  }).eq('id', submissionId)

  try {
    await sendEmail({
      to: { email: sub.contact_email, name: sub.contact_name },
      subject: `Update on your agency submission — OverseasNursing`,
      html: rejectionEmailHtml(sub.agency_name, reason),
    })
  } catch { /* email optional */ }

  revalidatePath('/admin/agency-submissions')
  return { error: null }
}
