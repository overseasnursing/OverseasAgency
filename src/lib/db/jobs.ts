import { cache } from 'react'
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
  // Eligibility (Phase 6) — informational only. Never used to hide this page;
  // the canonical detail page always renders for any approved/expired job.
  eligibility_mode: JobEligibilityMode
  eligible_countries: string[]
}

// cache() dedupes this within a single request — generateMetadata() and the
// page component both call it for the same slug; without this it ran twice
// per request (Phase 9).
export const getJobBySlugPublic = cache(async (slug: string): Promise<JobDetailRow | null> => {
  if (!SUPABASE_CONFIGURED) return null
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select('*, agencies(name, slug, logo_url, rating, review_count, google_rating, google_review_count, source_country), job_eligible_countries(country)')
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
    eligibility_mode:            (row.eligibility_mode as JobEligibilityMode) ?? 'worldwide',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eligible_countries:          (row.job_eligible_countries ?? []).map((r: any) => r.country as string),
  }
})

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
  _agencySourceCountry?: string | null,
): Promise<ActiveJobListing[]> {
  if (!SUPABASE_CONFIGURED) return []
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select(ACTIVE_JOB_LISTING_COLUMNS)
    .eq('status', 'approved')
    .gte('expiry_date', new Date().toISOString())
    .eq('country', country)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit)

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
  // Eligibility (Phase 6) — informational only, never used to exclude a job
  // from a canonical listing; drives badges/highlighting client-side only.
  eligibility_mode: JobEligibilityMode
  eligible_countries: string[]
}

/**
 * Active job listings — every approved, unexpired job, regardless of
 * visitor/agency source country. Canonical query: source-country used to
 * exclude jobs here (Phase 1 hotfix — see jobs module migration notes);
 * `_sourceCountry` is kept only so existing call sites don't need to change
 * and is intentionally unused until personalization is reintroduced as a
 * non-exclusionary signal in a later phase.
 *
 * Service-role client, not the cookie-aware one (Phase 9) — nothing here
 * has read the visitor's cookies since the Phase 1 hotfix removed
 * source-country filtering, so there was no remaining reason for this to
 * force dynamic rendering on every caller (including /jobs itself, and
 * sitemap.ts). This used to be split into this function plus a separate
 * getActiveJobsAdmin with an identical body just to get the service-role
 * client — now that this one no longer needs cookies, that duplicate no
 * longer has a reason to exist and has been removed; callers that used it
 * now call this instead.
 */
export async function getActiveJobs(_sourceCountry?: string): Promise<ActiveJobListing[]> {
  if (!SUPABASE_CONFIGURED) return []
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (db as any)
    .from('jobs')
    .select(ACTIVE_JOB_LISTING_COLUMNS)
    .eq('status', 'approved')
    .gte('expiry_date', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[jobs] getActiveJobs:', error.message)
    return []
  }
  return (data ?? []).map(mapActiveJobRow)
}

/**
 * Active jobs scoped to a destination (Phase 7 — canonical destination-first
 * routes). Country/city/jobType are exact-match filters on the job's own
 * fields — never on source country, which stays a personalization-only
 * signal (see getActiveJobs). Omit a filter to not constrain that level.
 *
 * Service-role client — same reasoning as getActiveJobs: these routes are
 * meant to be statically generated/ISR-cached for SEO, and reading cookies
 * would force dynamic rendering regardless of `revalidate`.
 *
 * cache()-wrapped (Phase 9) — the [city] and [specialty] destination pages
 * each call this once in generateMetadata() and again in the page component
 * with identical arguments; without this it ran twice per request.
 */
export const getActiveJobsByDestination = cache(async (filters: {
  country?: string
  city?: string
  jobType?: string
}): Promise<ActiveJobListing[]> => {
  if (!SUPABASE_CONFIGURED) return []
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (db as any)
    .from('jobs')
    .select(ACTIVE_JOB_LISTING_COLUMNS)
    .eq('status', 'approved')
    .gte('expiry_date', new Date().toISOString())
    .order('created_at', { ascending: false })
  if (filters.country) query = query.eq('country', filters.country)
  if (filters.city)    query = query.eq('city', filters.city)
  if (filters.jobType) query = query.eq('job_type', filters.jobType)

  const { data, error } = await query
  if (error) {
    console.error('[jobs] getActiveJobsByDestination:', error.message)
    return []
  }
  return (data ?? []).map(mapActiveJobRow)
})

/** Distinct destination countries with ≥1 approved, unexpired job — for
 * generateStaticParams. Service-role client, same reasoning as above. */
export async function getActiveJobCountries(): Promise<string[]> {
  if (!SUPABASE_CONFIGURED) return []
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (db as any)
    .from('jobs')
    .select('country')
    .eq('status', 'approved')
    .gte('expiry_date', new Date().toISOString())
  if (error) {
    console.error('[jobs] getActiveJobCountries:', error.message)
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countries: string[] = (data ?? []).map((r: any) => r.country as string)
  return [...new Set(countries)]
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
    eligibility_mode:   (row.eligibility_mode as JobEligibilityMode) ?? 'worldwide',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eligible_countries: (row.job_eligible_countries ?? []).map((r: any) => r.country as string),
  }
}

const ACTIVE_JOB_LISTING_COLUMNS =
  'id, title, slug, country, state, city, job_type, experience_years, salary_currency, salary_amount, logo_url, description, created_at, expiry_date, agency_id, eligibility_mode, agencies(name, source_country), job_eligible_countries(country)'

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

// ── Eligibility (Phase 5 — posting workflow only, not read by public queries yet) ─

export type JobEligibilityMode = 'specific_countries' | 'worldwide'

export type JobEligibility = {
  mode: JobEligibilityMode
  countries: string[]
}

/** Countries this agency is licensed to recruit from (agency_licensed_countries). */
export async function getAgencyLicensedCountries(agencyId: string): Promise<string[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data, error } = await db
    .from('agency_licensed_countries')
    .select('country')
    .eq('agency_id', agencyId)
    .order('country')
  if (error) {
    console.error('[jobs] getAgencyLicensedCountries:', error.message)
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => r.country as string)
}

/** A job's current eligibility_mode + eligible_countries, for form prefill. */
export async function getJobEligibility(jobId: string): Promise<JobEligibility> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const [{ data: job }, { data: countries }] = await Promise.all([
    db.from('jobs').select('eligibility_mode').eq('id', jobId).single(),
    db.from('job_eligible_countries').select('country').eq('job_id', jobId).order('country'),
  ])
  return {
    mode: (job?.eligibility_mode as JobEligibilityMode) ?? 'specific_countries',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    countries: (countries ?? []).map((r: any) => r.country as string),
  }
}

/** Sets a job's eligibility_mode and replaces its job_eligible_countries rows. */
export async function saveJobEligibility(
  jobId: string,
  mode: JobEligibilityMode,
  countries: string[],
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { error: modeError } = await db.from('jobs').update({ eligibility_mode: mode }).eq('id', jobId)
  if (modeError) {
    console.error('[jobs] saveJobEligibility (mode):', modeError.message)
    return false
  }

  const { error: clearError } = await db.from('job_eligible_countries').delete().eq('job_id', jobId)
  if (clearError) {
    console.error('[jobs] saveJobEligibility (clear):', clearError.message)
    return false
  }

  if (mode === 'specific_countries' && countries.length > 0) {
    const { error: insertError } = await db
      .from('job_eligible_countries')
      .insert(countries.map(country => ({ job_id: jobId, country })))
    if (insertError) {
      console.error('[jobs] saveJobEligibility (insert):', insertError.message)
      return false
    }
  }
  return true
}
