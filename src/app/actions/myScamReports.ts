'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getMyScamReports, setScamReportDisabled, type ScamReportRow } from '@/lib/db/scam-reports'

async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user
}

export async function getMyScamReportsAction(): Promise<ScamReportRow[]> {
  const user = await requireUser()
  return getMyScamReports(user.id)
}

export async function toggleMyScamReportDisabled(reportId: string, disabled: boolean): Promise<{ error: string | null }> {
  const user = await requireUser()
  const ok = await setScamReportDisabled(reportId, user.id, disabled)
  if (!ok) return { error: 'Failed to update report. Please try again.' }

  revalidatePath('/dashboard/scam-reports')
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const db = createAdminClient()
  const { data } = await db.from('scam_reports').select('agency_slug').eq('id', reportId).single()
  if (data?.agency_slug) revalidatePath(`/agency/${data.agency_slug}`)

  return { error: null }
}
