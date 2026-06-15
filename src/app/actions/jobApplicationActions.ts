'use server'

import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { uploadToR2 } from '@/lib/r2'
import { revalidatePath } from 'next/cache'

const ALLOWED_CV_MIME: Record<string, string> = {
  'application/pdf':                                                         'pdf',
  'application/msword':                                                      'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}
const MAX_CV_BYTES = 5 * 1024 * 1024

export async function submitApplication(
  formData: FormData,
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be signed in to apply.' }

  const jobId           = (formData.get('job_id')           as string ?? '').trim()
  const jobSlug         = (formData.get('job_slug')         as string ?? '').trim()
  const full_name       = (formData.get('full_name')        as string ?? '').trim()
  const email           = (formData.get('email')            as string ?? '').trim()
  const phone           = (formData.get('phone')            as string ?? '').trim()
  const current_country = (formData.get('current_country')  as string ?? '').trim()
  const cvFile          = formData.get('cv') as File | null

  if (!jobId || !full_name || !email || !phone || !current_country) {
    return { error: 'Please fill in all required fields.' }
  }
  if (!cvFile || cvFile.size === 0) {
    return { error: 'Please upload your CV.' }
  }
  if (cvFile.size > MAX_CV_BYTES) {
    return { error: 'CV must be under 5 MB.' }
  }
  const ext = ALLOWED_CV_MIME[cvFile.type]
  if (!ext) {
    return { error: 'CV must be a PDF or Word document (DOC/DOCX).' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: existing } = await db
    .from('job_applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('user_id', user.id)
    .single()

  if (existing) return { error: 'You have already applied for this job.' }

  const path   = `cvs/${user.id}/${Date.now()}-${randomUUID()}.${ext}`
  const buffer = Buffer.from(await cvFile.arrayBuffer())

  let cv_url: string
  try {
    cv_url = await uploadToR2('cv-assets', path, buffer, cvFile.type)
  } catch {
    return { error: 'CV upload failed. Please try again.' }
  }

  const { error } = await db
    .from('job_applications')
    .insert({ job_id: jobId, user_id: user.id, full_name, email, phone, current_country, cv_url })

  if (error) {
    if (error.code === '23505') return { error: 'You have already applied for this job.' }
    return { error: error.message }
  }

  if (jobSlug) revalidatePath(`/jobs/${jobSlug}`)
  revalidatePath('/dashboard/applications')
  return { error: null }
}
