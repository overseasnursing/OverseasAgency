import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Tables, InsertDto, UpdateDto } from '@/types/database'

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'

export type JobRow = Tables<'jobs'>

// ── Public reads (anon client, RLS enforces approved-only) ───────────────────

export async function getApprovedJobs(): Promise<JobRow[]> {
  if (!SUPABASE_CONFIGURED) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[jobs] getApprovedJobs:', error.message)
    return []
  }
  return data ?? []
}

export async function getApprovedJobsByCountry(country: string): Promise<JobRow[]> {
  if (!SUPABASE_CONFIGURED) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'approved')
    .eq('country', country)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[jobs] getApprovedJobsByCountry:', error.message)
    return []
  }
  return data ?? []
}

export async function getJobBySlug(slug: string): Promise<JobRow | null> {
  if (!SUPABASE_CONFIGURED) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()
  if (error) {
    console.error('[jobs] getJobBySlug:', error.message)
    return null
  }
  return data
}

// Full job detail row for the public detail page (includes joined agency)
export type JobDetailRow = JobRow & {
  agency_name: string | null
  agency_slug: string | null
  agency_logo_url: string | null
  agency_rating: number | null
  agency_review_count: number
  agency_google_rating: number | null
  agency_google_review_count: number | null
  // Which country the POSTING AGENCY recruits nurses FROM — the job's own
  // fixed fact, used to scope "Similar Jobs" to the same source country as
  // this job (not the visitor's), so the canonical /jobs/[slug] page never
  // has to read the visitor's Market Context to render correctly.
  agency_source_country: string | null
}

export async function getJobBySlugPublic(slug: string): Promise<JobDetailRow | null> {
  if (!SUPABASE_CONFIGURED) return null
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select('*, agencies(name, slug, logo_url, rating, review_count, google_rating, google_review_count, source_country)')
    .eq('slug', slug)
    .in('status', ['approved', 'expired'])
    .single()
  if (error) {
    console.error('[jobs] getJobBySlugPublic:', error.message)
    return null
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = data as any
  return {
    ...row,
    agencies:                    undefined,
    agency_name:                 row.agencies?.name ?? null,
    agency_slug:                 row.agencies?.slug ?? null,
    agency_logo_url:             row.agencies?.logo_url ?? null,
    agency_rating:               row.agencies?.rating ?? null,
    agency_review_count:         row.agencies?.review_count ?? 0,
    agency_google_rating:        row.agencies?.google_rating ?? null,
    agency_google_review_count:  row.agencies?.google_review_count ?? null,
    agency_source_country:       row.agencies?.source_country ?? null,
  }
}

/**
 * Jobs in the same destination country. Pass `agencySourceCountry` (the
 * VIEWED job's own posting-agency source country, not the visitor's) to
 * additionally scope to "same source country" per Phase 5 — omit it to keep
 * prior behaviour (used nowhere today, but keeps this function safe for any
 * future caller that only cares about destination).
 */
export async function getSimilarJobs(
  country: string,
  excludeId: string,
  limit = 6,
  agencySourceCountry?: string | null,
): Promise<ActiveJobListing[]> {
  if (!SUPABASE_CONFIGURED) return []
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('jobs')
    .select(
      agencySourceCountry
        ? 'id, title, slug, country, state, city, job_type, experience_years, salary_currency, salary_amount, logo_url, description, created_at, expiry_date, agency_id, agencies!inner(name, source_country)'
        : 'id, title, slug, country, state, city, job_type, experience_years, salary_currency, salary_amount, logo_url, description, created_at, expiry_date, agency_id, agencies(name, source_country)',
    )
    .eq('status', 'approved')
    .gte('expiry_date', new Date().toISOString())
    .eq('country', country)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (agencySourceCountry) query = query.eq('agencies.source_country', agencySourceCountry)

  const { data, error } = await query
  if (error) {
    console.error('[jobs] getSimilarJobs:', error.message)
    return []
  }
  return (data ?? []).map(mapActiveJobRow)
}

// Represents a job card row with agency name joined in
export type ActiveJobListing = {
  id: string
  title: string
  slug: string
  country: string
  state: string | null
  city: string | null
  job_type: string
  experience_years: number | null
  salary_currency: string | null
  salary_amount: number | null
  logo_url: string | null
  description: string
  created_at: string
  expiry_date: string
  agency_id: string | null
  agency_name: string | null
  // Which country the posting agency recruits nurses FROM — used for the
  // card's subtle Source Country indicator (Phase 6). Null if the job has
  // no agency or the agency predates source_country.
  agency_source_country: string | null
}

/**
 * Active job listings. Pass `sourceCountry` to scope to jobs posted by
 * agencies recruiting from that country — omitted callers (sitemap.ts, which
 * needs every job URL for indexing) are unaffected and keep seeing every
 * active job regardless of source country.
 */
export async function getActiveJobs(sourceCountry?: string): Promise<ActiveJobListing[]> {
  if (!SUPABASE_CONFIGURED) return []
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('jobs')
    .select(
      sourceCountry
        ? 'id, title, slug, country, state, city, job_type, experience_years, salary_currency, salary_amount, logo_url, description, created_at, expiry_date, agency_id, agencies!inner(name, source_country)'
        : 'id, title, slug, country, state, city, job_type, experience_years, salary_currency, salary_amount, logo_url, description, created_at, expiry_date, agency_id, agencies(name, source_country)',
    )
    .eq('status', 'approved')
    .gte('expiry_date', new Date().toISOString())
    .order('created_at', { ascending: false })
  if (sourceCountry) query = query.eq('agencies.source_country', sourceCountry)

  const { data, error } = await query
  if (error) {
    console.error('[jobs] getActiveJobs:', error.message)
    return []
  }
  return (data ?? []).map(mapActiveJobRow)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapActiveJobRow(row: any): ActiveJobListing {
  return {
    id:               row.id,
    title:            row.title,
    slug:             row.slug,
    country:          row.country,
    state:            row.state ?? null,
    city:             row.city ?? null,
    job_type:         row.job_type,
    experience_years: row.experience_years ?? null,
    salary_currency:  row.salary_currency ?? null,
    salary_amount:    row.salary_amount ?? null,
    logo_url:         row.logo_url ?? null,
    description:      row.description,
    created_at:       row.created_at,
    expiry_date:      row.expiry_date,
    agency_id:        row.agency_id ?? null,
    agency_name:      row.agencies?.name ?? null,
    agency_source_country: row.agencies?.source_country ?? null,
  }
}

const ACTIVE_JOB_LISTING_COLUMNS_UNFILTERED =
  'id, title, slug, country, state, city, job_type, experience_years, salary_currency, salary_amount, logo_url, description, created_at, expiry_date, agency_id, agencies(name, source_country)'
const ACTIVE_JOB_LISTING_COLUMNS_BY_COUNTRY =
  'id, title, slug, country, state, city, job_type, experience_years, salary_currency, salary_amount, logo_url, description, created_at, expiry_date, agency_id, agencies!inner(name, source_country)'

/**
 * Same active-job listing as getActiveJobs(), but via the service-role
 * client instead of the cookie-aware one — for callers that must not read
 * the visitor's cookies (e.g. the static homepage's initial/default render;
 * see FeaturedJobsSection). jobs RLS already permits public reads of
 * approved listings, matching how agencies/reviews are fetched for public
 * pages elsewhere in this codebase.
 */
export async function getActiveJobsAdmin(sourceCountry?: string): Promise<ActiveJobListing[]> {
  if (!SUPABASE_CONFIGURED) return []
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (db as any)
    .from('jobs')
    .select(sourceCountry ? ACTIVE_JOB_LISTING_COLUMNS_BY_COUNTRY : ACTIVE_JOB_LISTING_COLUMNS_UNFILTERED)
    .eq('status', 'approved')
    .gte('expiry_date', new Date().toISOString())
    .order('created_at', { ascending: false })
  if (sourceCountry) query = query.eq('agencies.source_country', sourceCountry)

  const { data, error } = await query
  if (error) {
    console.error('[jobs] getActiveJobsAdmin:', error.message)
    return []
  }
  return (data ?? []).map(mapActiveJobRow)
}

// ── Authenticated user reads (own jobs, any status) ───────────────────────────

export async function getJobsByUser(userId: string): Promise<JobRow[]> {
  if (!SUPABASE_CONFIGURED) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('posted_by_user_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[jobs] getJobsByUser:', error.message)
    return []
  }
  return data ?? []
}

// ── Admin reads (admin client, bypasses RLS so all statuses visible) ──────────

export async function getPendingJobsAdmin(): Promise<JobRow[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) {
    console.error('[jobs] getPendingJobsAdmin:', error.message)
    return []
  }
  return data ?? []
}

export async function getAllJobsAdmin(status?: string): Promise<JobRow[]> {
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = db.from('jobs').select('*').order('created_at', { ascending: false })
  if (status && status !== 'all') query = query.eq('status', status)
  const { data, error } = await query
  if (error) {
    console.error('[jobs] getAllJobsAdmin:', error.message)
    return []
  }
  return data ?? []
}

export async function getJobStats(): Promise<{
  total: number; pending: number; approved: number; hold: number; expired: number; rejected: number
}> {
  const db = createAdminClient()
  const [total, pending, approved, hold, expired, rejected] = await Promise.all([
    db.from('jobs').select('*', { count: 'exact', head: true }),
    db.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    db.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'hold'),
    db.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
    db.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
  ])
  if (total.error) console.error('[jobs] getJobStats:', total.error.message)
  return {
    total:    total.count    ?? 0,
    pending:  pending.count  ?? 0,
    approved: approved.count ?? 0,
    hold:     hold.count     ?? 0,
    expired:  expired.count  ?? 0,
    rejected: rejected.count ?? 0,
  }
}

// ── Scheduled expiry (admin client, called by daily cron) ────────────────────

/**
 * Bulk-sets status='expired' on all approved jobs whose expiry_date is in the past.
 * Returns the number of rows updated. Throws on DB error so the cron handler can log it.
 */
export async function expireOverdueJobs(): Promise<number> {
  const db = createAdminClient()
  const now = new Date().toISOString()
  const { data, error } = await db
    .from('jobs')
    .update({ status: 'expired', updated_at: now } satisfies UpdateDto<'jobs'>)
    .eq('status', 'approved')
    .lt('expiry_date', now)
    .select('id')
  if (error) {
    console.error('[jobs] expireOverdueJobs:', error.message)
    throw new Error(error.message)
  }
  return data?.length ?? 0
}

// ── Insert (admin client so server actions work regardless of session state) ──

export async function insertJob(job: InsertDto<'jobs'>): Promise<{ id: string } | null> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('jobs')
    .insert(job)
    .select('id')
    .single()
  if (error) {
    console.error('[jobs] insertJob:', error.message)
    return null
  }
  return data
}

// ── Admin mutations (caller must verify admin cookie first) ───────────────────

export async function updateJobStatus(
  id: string,
  status: JobRow['status'],
): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db
    .from('jobs')
    .update({ status, updated_at: new Date().toISOString() } satisfies UpdateDto<'jobs'>)
    .eq('id', id)
  if (error) {
    console.error('[jobs] updateJobStatus:', error.message)
    return false
  }
  return true
}

export async function deleteJob(id: string): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db.from('jobs').delete().eq('id', id)
  if (error) {
    console.error('[jobs] deleteJob:', error.message)
    return false
  }
  return true
}
