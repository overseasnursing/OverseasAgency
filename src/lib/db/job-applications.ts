import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Tables, InsertDto } from '@/types/database'

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'

export type JobApplicationRow = Tables<'job_applications'>

// ── User reads (own applications via RLS) ─────────────────────────────────────

export async function hasUserApplied(jobId: string, userId: string): Promise<boolean> {
  if (!SUPABASE_CONFIGURED) return false
  const supabase = await createClient()
  const { data } = await supabase
    .from('job_applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('user_id', userId)
    .single()
  return !!data
}

export type UserApplicationWithJob = JobApplicationRow & {
  job_title:   string
  job_country: string
  job_slug:    string
}

export async function getUserApplicationsWithJobs(userId: string): Promise<UserApplicationWithJob[]> {
  if (!SUPABASE_CONFIGURED) return []
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('job_applications')
    .select('*, jobs(title, country, slug)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[job-applications] getUserApplicationsWithJobs:', error.message)
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    ...row,
    jobs:        undefined,
    job_title:   row.jobs?.title   ?? '—',
    job_country: row.jobs?.country ?? '—',
    job_slug:    row.jobs?.slug    ?? '',
  }))
}

export async function getApplicationsByUser(userId: string): Promise<JobApplicationRow[]> {
  if (!SUPABASE_CONFIGURED) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[job-applications] getApplicationsByUser:', error.message)
    return []
  }
  return data ?? []
}

// ── Admin reads (bypasses RLS) ────────────────────────────────────────────────

export type ApplicationWithJob = JobApplicationRow & {
  job_title:   string
  job_country: string
  job_slug:    string
}

export async function getApplicationsByJob(jobId: string): Promise<JobApplicationRow[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('job_applications')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: true })
  if (error) {
    console.error('[job-applications] getApplicationsByJob:', error.message)
    return []
  }
  return data ?? []
}

export async function getApplicationsByAgency(agencyId: string): Promise<ApplicationWithJob[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data: jobs } = await db
    .from('jobs')
    .select('id')
    .eq('agency_id', agencyId)
  const jobIds: string[] = (jobs ?? []).map((j: { id: string }) => j.id)
  if (!jobIds.length) return []

  const { data, error } = await db
    .from('job_applications')
    .select('*, jobs(title, country, slug)')
    .in('job_id', jobIds)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[job-applications] getApplicationsByAgency:', error.message)
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    ...row,
    jobs:        undefined,
    job_title:   row.jobs?.title   ?? '—',
    job_country: row.jobs?.country ?? '—',
    job_slug:    row.jobs?.slug    ?? '',
  }))
}

export async function getAllApplicationsWithJobs(): Promise<ApplicationWithJob[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data, error } = await db
    .from('job_applications')
    .select('*, jobs(title, country, slug)')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[job-applications] getAllApplicationsWithJobs:', error.message)
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    ...row,
    jobs:        undefined,
    job_title:   row.jobs?.title   ?? '—',
    job_country: row.jobs?.country ?? '—',
    job_slug:    row.jobs?.slug    ?? '',
  }))
}

export async function getAllApplicationsAdmin(): Promise<JobApplicationRow[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[job-applications] getAllApplicationsAdmin:', error.message)
    return []
  }
  return data ?? []
}

// ── Insert (admin client so server actions work regardless of session state) ──

export async function insertJobApplication(
  application: InsertDto<'job_applications'>,
): Promise<{ id: string } | null> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('job_applications')
    .insert(application)
    .select('id')
    .single()
  if (error) {
    console.error('[job-applications] insertJobApplication:', error.message)
    return null
  }
  return data
}

// ── User mutation (own applications only) ─────────────────────────────────────

export async function deleteJobApplication(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id)
  if (error) {
    console.error('[job-applications] deleteJobApplication:', error.message)
    return false
  }
  return true
}
