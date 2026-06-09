import { createAdminClient } from '@/lib/supabase/admin'
import { requirePermission } from '@/lib/require-admin'
import { AgencySubmissionsClient } from './_components/AgencySubmissionsClient'

export const dynamic = 'force-dynamic'

export interface SubmissionRow {
  id:               string
  agency_name:      string
  city:             string
  state:            string
  website:          string | null
  email:            string
  phone:            string | null
  whatsapp:         string | null
  description:      string | null
  countries_served: string[]
  services:         string[]
  established_year: number | null
  contact_name:     string
  contact_email:    string
  contact_phone:    string | null
  designation:      string
  status:           'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  reviewed_at:      string | null
  agency_id:        string | null
  created_at:       string
}

export default async function AgencySubmissionsPage() {
  await requirePermission('agencies')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data } = await db
    .from('agency_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = (data ?? []) as SubmissionRow[]
  const pending  = rows.filter(r => r.status === 'pending')
  const resolved = rows.filter(r => r.status !== 'pending')

  return <AgencySubmissionsClient pending={pending} resolved={resolved} />
}
