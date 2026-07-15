'use server'

import { requireAdmin } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { saveJobEligibility, type JobEligibilityMode } from '@/lib/db/jobs'
import { slugify, getJobDestinationPaths } from '@/lib/jobConstants'
import { revalidatePath } from 'next/cache'

function revalidateJob(id: string, slug: string, country: string, city: string | null, jobType: string) {
  revalidatePath('/admin/jobs')
  revalidatePath('/jobs')
  revalidatePath(`/jobs/listing/${slug}`)
  for (const path of getJobDestinationPaths(country, city, jobType)) revalidatePath(path)
}

export async function approveJob(jobId: string): Promise<void> {
  await requireAdmin()
  const db = createAdminClient()
  const { data } = await db.from('jobs').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', jobId).select('slug, country, city, job_type').single()
  if (data) revalidateJob(jobId, data.slug, data.country, data.city, data.job_type)
}

export async function holdJob(jobId: string): Promise<void> {
  await requireAdmin()
  const db = createAdminClient()
  const { data } = await db.from('jobs').update({ status: 'hold', updated_at: new Date().toISOString() }).eq('id', jobId).select('slug, country, city, job_type').single()
  if (data) revalidateJob(jobId, data.slug, data.country, data.city, data.job_type)
}

export async function rejectJob(jobId: string): Promise<void> {
  await requireAdmin()
  const db = createAdminClient()
  const { data } = await db.from('jobs').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', jobId).select('slug, country, city, job_type').single()
  if (data) revalidateJob(jobId, data.slug, data.country, data.city, data.job_type)
}

export async function saveJob(
  formData: FormData,
): Promise<{ error: string | null; id?: string }> {
  const admin = await requireAdmin()
  const db = createAdminClient()

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
  const logo_url            = (formData.get('logo_url') as string ?? '').trim() || null
  const apply_type_raw      = (formData.get('apply_type') as string ?? 'direct').trim()
  const apply_type          = apply_type_raw === 'redirect' ? 'redirect' : 'direct'
  const redirect_url        = (formData.get('redirect_url') as string ?? '').trim() || null
  const eligibility_mode    = (formData.get('eligibility_mode') as string ?? '').trim()
  const eligible_countries  = formData.getAll('eligible_countries').map(v => String(v))

  if (!title || !country || !job_type || !description || !expiry_date_raw) {
    return { error: 'Required fields are missing.' }
  }
  if (experience_years_raw && (Number.isNaN(experience_years) || (experience_years as number) < 0)) {
    return { error: 'Experience required must be a positive number.' }
  }
  if (salary_amount_raw && (Number.isNaN(salary_amount) || (salary_amount as number) < 0)) {
    return { error: 'Salary amount must be a positive number.' }
  }
  if (apply_type === 'redirect' && !redirect_url) {
    return { error: 'Redirect URL is required when apply method is set to Redirect.' }
  }
  if (eligibility_mode !== 'specific_countries' && eligibility_mode !== 'worldwide') {
    return { error: 'Please select who is eligible to apply.' }
  }
  if (eligibility_mode === 'specific_countries' && eligible_countries.length === 0) {
    return { error: 'Select at least one eligible country, or choose Worldwide.' }
  }

  const slug        = slug_raw || slugify(title)
  const expiry_date = new Date(expiry_date_raw + 'T23:59:59.000Z').toISOString()

  if (id) {
    // Read the pre-update destination fields too — if country/city/job_type
    // changed, the OLD destination pages need revalidating as well, or they'd
    // keep showing this job until their ISR window naturally expires.
    const { data: previous } = await db.from('jobs').select('country, city, job_type').eq('id', id).single()

    const { error } = await db
      .from('jobs')
      .update({ title, slug, country, state, city, job_type, experience_years, salary_currency, salary_amount, logo_url, apply_type, redirect_url, description, expiry_date, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return { error: error.message }
    const eligibilitySaved = await saveJobEligibility(id, eligibility_mode as JobEligibilityMode, eligible_countries)
    if (!eligibilitySaved) return { error: 'Job saved, but eligibility could not be updated.' }
    revalidatePath(`/admin/jobs/${id}`)
    revalidateJob(id, slug, country, city, job_type)
    if (previous) revalidateJob(id, slug, previous.country, previous.city, previous.job_type)
    return { error: null, id }
  }

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
      logo_url,
      apply_type,
      redirect_url,
      description,
      expiry_date,
      status: 'approved',
      posted_by_user_id: admin.userId,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  const eligibilitySaved = await saveJobEligibility(data.id, eligibility_mode as JobEligibilityMode, eligible_countries)
  if (!eligibilitySaved) return { error: 'Job created, but eligibility could not be saved. Please edit the job to set it.' }
  revalidateJob(data.id, slug, country, city, job_type)
  return { error: null, id: data.id }
}
