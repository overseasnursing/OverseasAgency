'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, approvalEmailHtml, rejectionEmailHtml } from '@/lib/email/sendEmail'
import { requirePermission } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'

// ── Approve a claim request ───────────────────────────────────────────────────

export async function approveClaimRequest(
  claimId: string,
): Promise<{ success?: boolean; error?: string }> {
  await requirePermission('claim-listings')

  const db = createAdminClient() as any

  // Fetch full claim details
  const { data: claim, error: claimErr } = await db
    .from('claim_requests')
    .select('*, agencies(name, slug)')
    .eq('id', claimId)
    .single()

  if (claimErr || !claim) return { error: 'Claim request not found.' }
  if (claim.status !== 'pending_approval') return { error: 'Claim is not in pending approval state.' }

  const agencyName = claim.agencies?.name ?? 'Unknown Agency'
  const agencySlug = claim.agencies?.slug ?? ''

  // Create or fetch existing auth user for the claimant
  let userId: string

  // Check if user already exists
  const { data: existingUsers } = await db.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(
    (u: any) => u.email?.toLowerCase() === claim.contact_email.toLowerCase()
  )

  if (existingUser) {
    userId = existingUser.id
    // role/agency_id go in app_metadata — only the service role can write it,
    // unlike user_metadata which the account owner can edit via the Auth API.
    await db.auth.admin.updateUserById(userId, {
      app_metadata: {
        ...existingUser.app_metadata,
        role:      'agency_admin',
        agency_id: claim.agency_id,
      },
      user_metadata: {
        ...existingUser.user_metadata,
        display_name: claim.contact_name,
      },
    })
  } else {
    // Create new user — they'll set their password via the recovery link
    const { data: newUser, error: createErr } = await db.auth.admin.createUser({
      email:         claim.contact_email,
      email_confirm: true,
      app_metadata: {
        role:         'agency_admin',
        agency_id:    claim.agency_id,
      },
      user_metadata: {
        display_name: claim.contact_name,
      },
    })
    if (createErr || !newUser?.user) return { error: `Could not create user account: ${createErr?.message}` }
    userId = newUser.user.id
  }

  // Generate password-setup link so they can log in
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://overseasnursing.com'
  const { data: linkData } = await db.auth.admin.generateLink({
    type:       'recovery',
    email:      claim.contact_email,
    options:    { redirectTo: `${siteUrl}/agency-admin` },
  })
  const setPasswordUrl = linkData?.properties?.action_link ?? `${siteUrl}/auth/login`

  // Update claim request
  await db
    .from('claim_requests')
    .update({
      status:      'approved',
      user_id:     userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', claimId)

  // Mark agency as claimed
  await db
    .from('agencies')
    .update({ is_claimed: true, claimed_by_user_id: userId })
    .eq('id', claim.agency_id)

  // Send approval email
  try {
    await sendEmail({
      to:      { name: claim.contact_name, email: claim.contact_email },
      subject: `Your claim for ${agencyName} has been approved!`,
      html:    approvalEmailHtml(agencyName, setPasswordUrl),
    })
  } catch {
    // Non-fatal — claim is still approved even if email fails
  }

  revalidatePath('/admin/claim-listings')
  return { success: true }
}

// ── Reject a claim request ────────────────────────────────────────────────────

export async function rejectClaimRequest(
  claimId: string,
  reason: string,
): Promise<{ success?: boolean; error?: string }> {
  await requirePermission('claim-listings')

  const db = createAdminClient() as any

  const { data: claim, error: claimErr } = await db
    .from('claim_requests')
    .select('*, agencies(name)')
    .eq('id', claimId)
    .single()

  if (claimErr || !claim) return { error: 'Claim request not found.' }

  await db
    .from('claim_requests')
    .update({
      status:           'rejected',
      rejection_reason: reason.trim() || null,
      reviewed_at:      new Date().toISOString(),
    })
    .eq('id', claimId)

  const agencyName = claim.agencies?.name ?? 'your agency'

  try {
    await sendEmail({
      to:      { name: claim.contact_name, email: claim.contact_email },
      subject: `Update on your claim request for ${agencyName}`,
      html:    rejectionEmailHtml(agencyName, reason.trim() || undefined),
    })
  } catch {
    // Non-fatal
  }

  revalidatePath('/admin/claim-listings')
  return { success: true }
}
