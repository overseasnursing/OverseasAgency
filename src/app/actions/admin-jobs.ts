'use server'

import { requireAdmin } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function approveJob(jobId: string): Promise<void> {
  await requireAdmin()
  const db = createAdminClient()
  await db.from('jobs').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', jobId)
  revalidatePath('/admin/jobs')
}

export async function holdJob(jobId: string): Promise<void> {
  await requireAdmin()
  const db = createAdminClient()
  await db.from('jobs').update({ status: 'hold', updated_at: new Date().toISOString() }).eq('id', jobId)
  revalidatePath('/admin/jobs')
}

export async function rejectJob(jobId: string): Promise<void> {
  await requireAdmin()
  const db = createAdminClient()
  await db.from('jobs').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', jobId)
  revalidatePath('/admin/jobs')
}

export async function saveJob(
  formData: FormData,
): Promise<{ error: string | null; id?: string }> {
  const admin = await requireAdmin()
  const db = createAdminClient()

  const id                  = formData.get('id') as string | null
  const title               = (formData.get('title') as string ?? '').trim()
  const country             = (formData.get('country') as string ?? '').trim()
  const city                = (formData.get('city') as string ?? '').trim() || null
  const job_type            = (formData.get('job_type') as string ?? '').trim()
  const experience_required = (formData.get('experience_required') as string ?? '').trim() || null
  const salary              = (formData.get('salary') as string ?? '').trim() || null
  const description         = (formData.get('description') as string ?? '').trim()
  const expiry_date_raw     = (formData.get('expiry_date') as string ?? '').trim()
  const slug_raw            = (formData.get('slug') as string ?? '').trim()

  if (!title || !country || !job_type || !description || !expiry_date_raw) {
    return { error: 'Required fields are missing.' }
  }

  const slug        = slug_raw || slugify(title)
  const expiry_date = new Date(expiry_date_raw + 'T23:59:59.000Z').toISOString()

  if (id) {
    const { error } = await db
      .from('jobs')
      .update({ title, slug, country, city, job_type, experience_required, salary, description, expiry_date, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/jobs')
    revalidatePath(`/admin/jobs/${id}`)
    return { error: null, id }
  }

  const { data, error } = await db
    .from('jobs')
    .insert({
      title,
      slug,
      country,
      city,
      job_type,
      experience_required,
      salary,
      description,
      expiry_date,
      status: 'approved',
      posted_by_user_id: admin.userId,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/jobs')
  return { error: null, id: data.id }
}
