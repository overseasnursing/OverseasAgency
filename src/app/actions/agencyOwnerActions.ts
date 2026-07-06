'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadToR2 } from '@/lib/r2'
import { matchesFileSignature } from '@/lib/validateFileSignature'
import { normalizeCityName } from '@/lib/data/cityNormalization'

// ── Auth guard ────────────────────────────────────────────────────────────────

async function requireAgencyAdmin(): Promise<{ userId: string; agencyId: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const role     = user.app_metadata?.role as string | undefined
  const agencyId = user.app_metadata?.agency_id as string | undefined
  if (role !== 'agency_admin' || !agencyId) throw new Error('Not authorized')
  return { userId: user.id, agencyId }
}

// ── Save agency (owner-accessible fields only) ────────────────────────────────

export interface OwnerAgencyUpdate {
  id:                       string
  description?:             string
  tagline?:                 string
  website?:                 string
  email?:                   string
  whatsapp?:                string
  logo_url?:                string
  featured_image_url?:      string
  countries?:               string[]
  services?:                string[]
  exams_supported?:         string[]
  language_training_offered?: boolean
  post_placement_support?:  boolean
  visa_sponsorship?:        boolean
  average_timeline_months?: string
  pricing_is_free?:         boolean
  pricing_min_lakhs?:       number
  pricing_max_lakhs?:       number
  pricing_includes?:        string[]
  pricing_excludes?:        string[]
  pricing_installment_available?: boolean
  pricing_installment_note?: string
  pricing_free_note?:       string
  company_registration_no?: string
  company_registration_url?: string
  mea_license_no?:          string
  mea_license_expiry?:      string
  mea_license_url?:         string
  video_testimonials?:      string[]
  social_links?:            Record<string, string>
  current_openings_url?:    string
}

export async function saveAgencyAsOwner(
  data: OwnerAgencyUpdate,
): Promise<{ error: string | null }> {
  let agencyId: string
  try {
    const auth = await requireAgencyAdmin()
    agencyId = auth.agencyId
  } catch (e) {
    return { error: String(e) }
  }

  // Ensure they can only update their own agency
  if (data.id !== agencyId) return { error: 'Not authorized to edit this agency.' }

  const db = createAdminClient() as any

  // Only pick fields that owners are allowed to update — strip out trust_level, is_active, etc.
  const allowed: Record<string, unknown> = {
    description:              data.description,
    tagline:                  data.tagline,
    website:                  data.website,
    email:                    data.email,
    whatsapp:                 data.whatsapp,
    logo_url:                 data.logo_url,
    featured_image_url:       data.featured_image_url,
    countries:                data.countries,
    services:                 data.services,
    exams_supported:          data.exams_supported,
    language_training_offered: data.language_training_offered,
    post_placement_support:   data.post_placement_support,
    visa_sponsorship:         data.visa_sponsorship,
    average_timeline_months:  data.average_timeline_months,
    pricing_is_free:          data.pricing_is_free,
    pricing_min_lakhs:        data.pricing_min_lakhs,
    pricing_max_lakhs:        data.pricing_max_lakhs,
    pricing_includes:         data.pricing_includes,
    pricing_excludes:         data.pricing_excludes,
    pricing_installment_available: data.pricing_installment_available,
    pricing_installment_note: data.pricing_installment_note,
    pricing_free_note:        data.pricing_free_note,
    company_registration_no:  data.company_registration_no,
    company_registration_url: data.company_registration_url,
    mea_license_no:           data.mea_license_no,
    mea_license_expiry:       data.mea_license_expiry,
    mea_license_url:          data.mea_license_url,
    video_testimonials:       data.video_testimonials,
    social_links:             data.social_links,
    current_openings_url:     data.current_openings_url,
  }

  // Remove undefined values
  Object.keys(allowed).forEach(k => { if (allowed[k] === undefined) delete allowed[k] })

  const { error } = await db.from('agencies').update(allowed).eq('id', agencyId)
  if (error) return { error: error.message }

  revalidatePath(`/agency/${data.id}`)
  revalidatePath('/agency-admin')
  return { error: null }
}

// ── Branch CRUD (owner) ───────────────────────────────────────────────────────

export interface OwnerBranchInput {
  id?:            string
  agency_id:      string
  name:           string
  address:        string
  city:           string
  state:          string
  country?:       string
  phone?:         string
  whatsapp?:      string
  email?:         string
  google_maps_url?: string
  is_head_office?: boolean
  office_hours?:  string
}

export async function saveBranchAsOwner(
  data: OwnerBranchInput,
): Promise<{ error: string | null; id?: string }> {
  let agencyId: string
  try {
    const auth = await requireAgencyAdmin()
    agencyId = auth.agencyId
  } catch (e) {
    return { error: String(e) }
  }
  if (data.agency_id !== agencyId) return { error: 'Not authorized.' }

  const db = createAdminClient() as any
  const { id, ...row } = data
  if (row.city) row.city = normalizeCityName(row.city)

  if (id) {
    const { error } = await db.from('branches').update(row).eq('id', id).eq('agency_id', agencyId)
    if (error) return { error: error.message }
    return { error: null, id }
  }
  const { data: inserted, error } = await db.from('branches').insert(row).select('id').single()
  if (error) return { error: error.message }
  return { error: null, id: inserted.id }
}

export async function deleteBranchAsOwner(
  branchId: string,
): Promise<{ error: string | null }> {
  let agencyId: string
  try {
    const auth = await requireAgencyAdmin()
    agencyId = auth.agencyId
  } catch (e) {
    return { error: String(e) }
  }
  const db = createAdminClient() as any
  const { error } = await db.from('branches').delete().eq('id', branchId).eq('agency_id', agencyId)
  if (error) return { error: error.message }
  return { error: null }
}

// ── FAQ CRUD (owner) ──────────────────────────────────────────────────────────

export async function saveFaqAsOwner(
  data: { id?: string; agency_id: string; question: string; answer: string; sort_order?: number },
): Promise<{ error: string | null; id?: string }> {
  let agencyId: string
  try {
    const auth = await requireAgencyAdmin()
    agencyId = auth.agencyId
  } catch (e) {
    return { error: String(e) }
  }
  if (data.agency_id !== agencyId) return { error: 'Not authorized.' }

  const db = createAdminClient() as any
  const { id, ...row } = data

  if (id) {
    const { error } = await db.from('agency_faqs').update(row).eq('id', id).eq('agency_id', agencyId)
    if (error) return { error: error.message }
    return { error: null, id }
  }
  const { data: inserted, error } = await db.from('agency_faqs').insert(row).select('id').single()
  if (error) return { error: error.message }
  return { error: null, id: inserted.id }
}

export async function deleteFaqAsOwner(
  faqId: string,
): Promise<{ error: string | null }> {
  let agencyId: string
  try {
    const auth = await requireAgencyAdmin()
    agencyId = auth.agencyId
  } catch (e) {
    return { error: String(e) }
  }
  const db = createAdminClient() as any
  const { error } = await db.from('agency_faqs').delete().eq('id', faqId).eq('agency_id', agencyId)
  if (error) return { error: error.message }
  return { error: null }
}

// ── Image upload (owner) ──────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
}
const MAX_BYTES = 5 * 1024 * 1024

export async function uploadAgencyAssetAsOwner(
  formData: FormData,
  type: 'logo' | 'featured',
): Promise<{ url?: string; error?: string }> {
  let agencyId: string
  let agencySlug: string
  try {
    const auth = await requireAgencyAdmin()
    agencyId = auth.agencyId
  } catch (e) {
    return { error: String(e) }
  }

  const db   = createAdminClient() as any
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'No file provided' }
  if (file.size > MAX_BYTES) return { error: 'File must be under 5 MB' }

  const ext = ALLOWED_MIME_TYPES[file.type]
  if (!ext) return { error: 'Only JPEG, PNG, or WebP images are allowed' }

  const { data: agency } = await db.from('agencies').select('slug').eq('id', agencyId).single()
  if (!agency) return { error: 'Agency not found' }
  agencySlug = agency.slug.replace(/[^a-z0-9-]/g, '').slice(0, 80)

  const path   = `${type}s/${agencySlug}-${Date.now()}.${ext}`
  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  if (!matchesFileSignature(buffer, file.type)) {
    return { error: 'File content does not match its declared type.' }
  }

  try {
    const url = await uploadToR2('agency-assets', path, buffer, file.type)
    return { url }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Upload failed' }
  }
}
