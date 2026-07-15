import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getAllScamReports as getMockReports,
  getScamReport as getMockReport,
} from '@/lib/data/scamReports'
import type { Tables, InsertDto, UpdateDto } from '@/types/database'

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'

export type ScamReportRow = Tables<'scam_reports'>

// ── Public reads (anon client, RLS enforces approved-only) ────────────────

export async function getApprovedScamReports(): Promise<ScamReportRow[]> {
  if (!SUPABASE_CONFIGURED) {
    return getMockReports() as unknown as ScamReportRow[]
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('scam_reports')
    .select('*')
    .eq('status', 'approved')
    .eq('user_disabled', false)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[scam_reports] getApprovedScamReports:', error.message)
    return getMockReports() as unknown as ScamReportRow[]
  }
  return data ?? []
}

export async function getScamReport(slug: string): Promise<ScamReportRow | null> {
  if (!SUPABASE_CONFIGURED) {
    return getMockReport(slug) as unknown as ScamReportRow | null
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('scam_reports')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .eq('user_disabled', false)
    .single()
  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[scam_reports] getScamReport:', error.message)
    }
    return getMockReport(slug) as unknown as ScamReportRow | null
  }
  return data
}

export async function getApprovedScamReportsByAgency(agencySlug: string): Promise<ScamReportRow[]> {
  if (!SUPABASE_CONFIGURED) {
    return getMockReports().filter((r) => r.agencySlug === agencySlug) as unknown as ScamReportRow[]
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('scam_reports')
    .select('*')
    .eq('agency_slug', agencySlug)
    .eq('status', 'approved')
    .eq('user_disabled', false)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[scam_reports] getApprovedScamReportsByAgency:', error.message)
    return []
  }
  return data ?? []
}

// ── Admin reads (admin client, bypasses RLS so all statuses visible) ──────

export async function getPendingScamReports(): Promise<ScamReportRow[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('scam_reports')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) {
    console.error('[scam_reports] getPendingScamReports:', error.message)
    return []
  }
  return data ?? []
}

export async function getScamReportStats(): Promise<{
  total: number; pending: number; approved: number; rejected: number
}> {
  const db = createAdminClient()
  const [total, pending, approved, rejected] = await Promise.all([
    db.from('scam_reports').select('*', { count: 'exact', head: true }),
    db.from('scam_reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('scam_reports').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    db.from('scam_reports').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
  ])
  if (total.error) console.error('[scam-reports] getScamReportStats:', total.error.message)
  return {
    total:    total.count    ?? 0,
    pending:  pending.count  ?? 0,
    approved: approved.count ?? 0,
    rejected: rejected.count ?? 0,
  }
}

export async function getRecentScamReportsAdmin(limit = 5): Promise<ScamReportRow[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('scam_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return data ?? []
}

// ── Public insert (admin client so anonymous submissions work) ────────────
// Server actions validate all inputs before calling this.

export async function insertScamReport(
  report: InsertDto<'scam_reports'>,
): Promise<{ id: string } | null> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('scam_reports')
    .insert(report)
    .select('id')
    .single()
  if (error) {
    console.error('[scam_reports] insertScamReport:', error.message)
    return null
  }
  return data
}

// ── Admin mutations (admin client, caller must verify admin cookie first) ─

export async function moderateScamReport(
  id: string,
  status: 'approved' | 'rejected',
  rejectReason?: string,
): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db
    .from('scam_reports')
    .update({
      status,
      moderated_by:  null, // admin uses custom cookie auth, not a Supabase user UUID
      moderated_at:  new Date().toISOString(),
      reject_reason: rejectReason ?? null,
    })
    .eq('id', id)
  if (error) {
    console.error('[scam_reports] moderateScamReport:', error.message)
    return false
  }
  return true
}

export async function deleteScamReport(id: string): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db.from('scam_reports').delete().eq('id', id)
  if (error) {
    console.error('[scam_reports] deleteScamReport:', error.message)
    return false
  }
  return true
}

// ── Owner self-service (caller must verify the session user first) ────────
// Users can view, hide, or edit their own reports — never delete them, so
// the trust record stays intact even if they change their mind.

export async function getOwnedScamReport(id: string, userId: string): Promise<ScamReportRow | null> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('scam_reports')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    console.error('[scam_reports] getOwnedScamReport:', error.message)
    return null
  }
  return data
}

export async function getMyScamReports(userId: string): Promise<ScamReportRow[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('scam_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[scam_reports] getMyScamReports:', error.message)
    return []
  }
  return data ?? []
}

// `userId` is included in the WHERE clause (not just checked by the caller)
// as a second guard against updating a report that isn't the caller's own.
export async function setScamReportDisabled(id: string, userId: string, disabled: boolean): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db
    .from('scam_reports')
    .update({ user_disabled: disabled })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) {
    console.error('[scam_reports] setScamReportDisabled:', error.message)
    return false
  }
  return true
}

export async function updateOwnedScamReport(
  id: string,
  userId: string,
  updates: UpdateDto<'scam_reports'>,
): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db
    .from('scam_reports')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
  if (error) {
    console.error('[scam_reports] updateOwnedScamReport:', error.message)
    return false
  }
  return true
}
