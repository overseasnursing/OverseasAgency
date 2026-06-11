import { createAdminClient } from '@/lib/supabase/admin'
import { ClaimListingsClient } from './_components/ClaimListingsClient'

export const dynamic = 'force-dynamic'

async function fetchClaims() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data } = await db
    .from('claim_requests')
    .select(`
      id, contact_name, contact_email, contact_phone, designation,
      message, status, otp_verified_at, reviewed_at, rejection_reason, created_at,
      agencies(id, name, slug, city, state)
    `)
    .in('status', ['pending_approval', 'approved', 'rejected'])
    .order('created_at', { ascending: false })
    .limit(200)

  return (data ?? []) as ClaimRow[]
}

export interface ClaimRow {
  id:               string
  contact_name:     string
  contact_email:    string
  contact_phone:    string | null
  designation:      string
  message:          string | null
  status:           'pending_approval' | 'approved' | 'rejected'
  otp_verified_at:  string | null
  reviewed_at:      string | null
  rejection_reason: string | null
  created_at:       string
  agencies:         { id: string; name: string; slug: string; city: string | null; state: string | null } | null
}

export default async function ClaimListingsPage() {
  const claims = await fetchClaims()
  const pending  = claims.filter(c => c.status === 'pending_approval')
  const resolved = claims.filter(c => c.status === 'approved' || c.status === 'rejected')
  return <ClaimListingsClient pending={pending} resolved={resolved} />
}
