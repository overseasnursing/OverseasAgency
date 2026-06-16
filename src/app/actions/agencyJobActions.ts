'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Auth guard ────────────────────────────────────────────────────────────────

async function requireAgencyAdmin(): Promise<{ userId: string; agencyId: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const role     = user.user_metadata?.role as string | undefined
  const agencyId = user.user_metadata?.agency_id as string | undefined
  if (role !== 'agency_admin' || !agencyId) throw new Error('Not authorized')
  return { userId: user.id, agencyId }
}

// ── Slug helper ───────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ── Save job (create or edit) ─────────────────────────────────────────────────

export async function saveAgencyJob(
  formData: FormData,
): Promise<{ error: string | null; id?: string }> {
  let auth: { userId: string; agencyId: string }
  try {
    auth = await requireAgencyAdmin()
  } catch (e) {
    return { error: String(e) }
  }

  const { userId, agencyId } = auth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const id                  = formData.get('id') as string | null
  const title               = (formData.get('title') as string ?? '').trim()
  const country             = (formData.get('country') as string ?? '').trim()
  const state                = (formData.get('state') as string ?? '').trim() || null
  const city                = (formData.get('city') as string ?? '').trim() || null
  const job_type            = (formData.get('job_type') as string ?? '').trim()
  const experience_years_raw = (formData.get('experience_years') as string ?? '').trim()
  const experience_years    = experience_years_raw ? parseInt(experience_years_raw, 10) : null
  const salary_currency     = (formData.get('salary_currency') as string ?? '').trim() || null
  const salary_amount_raw   = (formData.get('salary_amount') as string ?? '').trim()
  const salary_amount       = salary_amount_raw ? parseInt(salary_amount_raw, 10) : null
  const description         = (formData.get('description') as string ?? '').trim()
  const expiry_date_raw     = (formData.get('expiry_date') as string ?? '').trim()
  const slug_raw            = (formData.get('slug') as string ?? '').trim()

  if (!title || !country || !job_type || !description || !expiry_date_raw) {
    return { error: 'Required fields are missing.' }
  }
  if (experience_years_raw && (Number.isNaN(experience_years) || (experience_years as number) < 0)) {
    return { error: 'Experience required must be a positive number.' }
  }
  if (salary_amount_raw && (Number.isNaN(salary_amount) || (salary_amount as number) < 0)) {
    return { error: 'Salary amount must be a positive number.' }
  }

  const slug        = slug_raw || slugify(title)
  const expiry_date = new Date(expiry_date_raw + 'T23:59:59.000Z').toISOString()

  if (id) {
    // Edit: verify ownership before touching anything
    const { data: existing } = await db
      .from('jobs')
      .select('agency_id')
      .eq('id', id)
      .single()

    if (!existing || existing.agency_id !== agencyId) {
      return { error: 'Not authorized to edit this job.' }
    }

    // Status is intentionally excluded — agencies cannot change job status
    const { error } = await db
      .from('jobs')
      .update({
        title,
        slug,
        country,
        state,
        city,
        job_type,
        experience_years,
        salary_currency,
        salary_amount,
        description,
        expiry_date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/agency-admin/jobs')
    revalidatePath(`/agency-admin/jobs/${id}`)
    revalidatePath('/jobs')
    revalidatePath(`/jobs/${slug}`)
    return { error: null, id }
  }

  // Create — status is always pending for agency-submitted jobs
  const { data, error } = await db
    .from('jobs')
    .insert({
      title,
      slug,
      country,
      state,
      city,
      job_type,
      experience_years,
      salary_currency,
      salary_amount,
      description,
      expiry_date,
      status:            'pending',
      agency_id:         agencyId,
      posted_by_user_id: userId,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/agency-admin/jobs')
  revalidatePath('/jobs')
  revalidatePath(`/jobs/${slug}`)
  return { error: null, id: data.id }
}
