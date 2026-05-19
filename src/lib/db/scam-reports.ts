import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getAllScamReports as getMockReports,
  getScamReport as getMockReport,
} from '@/lib/data/scamReports'
import type { Tables, InsertDto } from '@/types/database'

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
