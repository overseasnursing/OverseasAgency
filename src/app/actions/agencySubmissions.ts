'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'
import { sendEmail, approvalEmailHtml, rejectionEmailHtml } from '@/lib/email/sendEmail'

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

export async function submitAgency(
  input: AgencySubmissionInput,
): Promise<{ error: string | null }> {
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

  // 1. Create the agency
  const slug = sub.agency_name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  // Make slug unique by appending city if clash exists
  const { data: existing } = await db.from('agencies').select('id').eq('slug', slug).maybeSingle()
  const finalSlug = existing
    ? `${slug}-${sub.city.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    : slug

  const { data: agency, error: agencyError } = await db
    .from('agencies')
    .insert({
      name:        sub.agency_name,
      slug:        finalSlug,
      city:        sub.city,
      state:       sub.state,
      location:    `${sub.city}, ${sub.state}`,
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
      user_metadata: { role: 'agency_admin', agency_id: agency.id },
    })
  } else {
    const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: sub.contact_email,
      email_confirm: true,
      user_metadata: { role: 'agency_admin', agency_id: agency.id, display_name: sub.contact_name },
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
