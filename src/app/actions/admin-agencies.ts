'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'

/* ── Types ─────────────────────────────────────────────────────────── */

export type AgencyInput = {
  id?: string
  slug: string
  name: string
  tagline: string
  description: string
  logo_url: string
  featured_image_url: string
  city: string
  state: string
  location: string
  established: number | null
  trust_level: 'verified' | 'trusted' | 'unverified' | 'scam-reported'
  is_active: boolean
  featured: boolean
  email: string
  website: string
  whatsapp: string
  transparency_score: number | null
  placement_count: number
  recommendation_percent: number | null
  visa_success_rate: number | null
  average_timeline_months: string
  hidden_charges_reported: number
  pricing_min_lakhs: number | null
  pricing_max_lakhs: number | null
  pricing_is_approximate: boolean
  pricing_includes: string[]
  pricing_excludes: string[]
  pricing_installment_available: boolean
  pricing_installment_note: string
  pricing_disclaimer: string
  pricing_last_updated: string
  countries: string[]
  exams_supported: string[]
  services: string[]
  visa_sponsorship: boolean
  language_training_offered: boolean
  post_placement_support: boolean
  related_slugs: string[]
  // Legal & Credentials
  mea_license_no: string
  mea_license_expiry: string
  company_registration_no: string
  certifications: string[]
  // Language Academy
  language_institute_name: string
  batch_type: string
  class_schedule_note: string
  // Media & Social
  video_testimonials: string[]
  social_links: { instagram?: string; facebook?: string; youtube?: string; linkedin?: string }
  // Jobs
  current_openings_url: string
  // Google Reviews fallback
  google_place_id:      string
  google_rating:        number | null
  google_review_count:  number | null
}

export type BranchInput = {
  id?: string
  agency_id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  whatsapp: string
  email: string
  google_maps_url: string
  is_head_office: boolean
  office_hours?: string
  latitude?: string
  longitude?: string
}

export type FaqInput = {
  id?: string
  agency_id: string
  question: string
  answer: string
  sort_order: number
}

/* ── File upload ────────────────────────────────────────────────────── */

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
}
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB

export async function uploadAgencyAsset(
  formData: FormData,
  agencySlug: string,
  type: 'logo' | 'featured',
): Promise<{ url?: string; error?: string }> {
  await requireAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db   = createAdminClient() as any
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) return { error: 'No file provided' }
  if (file.size > MAX_UPLOAD_BYTES)  return { error: 'File must be under 5 MB' }

  // Validate MIME type against allowlist (don't trust file.name extension)
  const ext = ALLOWED_MIME_TYPES[file.type]
  if (!ext) return { error: 'Only JPEG, PNG, WebP, or GIF images are allowed' }

  // Slug must be safe before embedding in storage path
  const safeSlug = agencySlug.replace(/[^a-z0-9-]/g, '').slice(0, 80)
  const path     = `${type}s/${safeSlug}-${Date.now()}.${ext}`

  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await db.storage
    .from('agency-assets')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error) return { error: error.message }

  const { data } = db.storage.from('agency-assets').getPublicUrl(path)
  return { url: data.publicUrl }
}

/* ── Agency CRUD ────────────────────────────────────────────────────── */

export async function saveAgency(data: AgencyInput): Promise<{ error: string | null; slug?: string }> {
  await requireAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

  const row = {
    slug,
    name:                          data.name,
    tagline:                       data.tagline                   || null,
    description:                   data.description               || null,
    logo_url:                      data.logo_url                  || null,
    featured_image_url:            data.featured_image_url        || null,
    city:                          data.city,
    state:                         data.state,
    location:                      data.location                  || `${data.city}, ${data.state}`,
    established:                   data.established               ?? null,
    trust_level:                   data.trust_level,
    is_active:                     data.is_active,
    featured:                      data.featured,
    email:                         data.email                     || null,
    website:                       data.website                   || null,
    whatsapp:                      data.whatsapp                  || null,
    transparency_score:            data.transparency_score        ?? null,
    placement_count:               data.placement_count,
    recommendation_percent:        data.recommendation_percent    ?? null,
    visa_success_rate:             data.visa_success_rate         ?? null,
    average_timeline_months:       data.average_timeline_months   || null,
    hidden_charges_reported:       data.hidden_charges_reported,
    pricing_min_lakhs:             data.pricing_min_lakhs         ?? null,
    pricing_max_lakhs:             data.pricing_max_lakhs         ?? null,
    pricing_is_approximate:        data.pricing_is_approximate,
    pricing_includes:              data.pricing_includes,
    pricing_excludes:              data.pricing_excludes,
    pricing_installment_available: data.pricing_installment_available,
    pricing_installment_note:      data.pricing_installment_note  || null,
    pricing_disclaimer:            data.pricing_disclaimer        || null,
    pricing_last_updated:          data.pricing_last_updated      || null,
    countries:                     data.countries,
    exams_supported:               data.exams_supported,
    services:                      data.services,
    visa_sponsorship:              data.visa_sponsorship,
    language_training_offered:     data.language_training_offered,
    post_placement_support:        data.post_placement_support,
    related_slugs:                 data.related_slugs,
    // Legal & Credentials
    mea_license_no:                data.mea_license_no            || null,
    mea_license_expiry:            data.mea_license_expiry        || null,
    company_registration_no:       data.company_registration_no   || null,
    certifications:                data.certifications,
    // Language Academy
    language_institute_name:       data.language_institute_name   || null,
    batch_type:                    data.batch_type                || null,
    class_schedule_note:           data.class_schedule_note       || null,
    // Media & Social
    video_testimonials:            data.video_testimonials,
    social_links:                  data.social_links,
    // Jobs
    current_openings_url:          data.current_openings_url      || null,
  }

  if (data.id) {
    const { error } = await db.from('agencies').update(row).eq('id', data.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await db.from('agencies').insert(row)
    if (error) return { error: error.message }
  }

  revalidatePath('/admin/agencies')
  revalidatePath(`/agency/${slug}`)
  revalidatePath('/agencies')

  return { error: null, slug }
}

export async function deleteAgency(id: string): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('agencies').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/agencies')
  revalidatePath('/agencies')
  return { error: null }
}

/* ── Branch CRUD ────────────────────────────────────────────────────── */

export async function saveBranch(data: BranchInput): Promise<{ error: string | null; id?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { id, ...row } = data

  if (id) {
    const { error } = await db.from('branches').update(row).eq('id', id)
    if (error) return { error: error.message }
    return { error: null, id }
  } else {
    const { data: result, error } = await db.from('branches').insert(row).select('id').single()
    if (error) return { error: error.message }
    return { error: null, id: result.id }
  }
}

export async function deleteBranch(id: string): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('branches').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

/* ── FAQ CRUD ───────────────────────────────────────────────────────── */

export async function saveFaq(data: FaqInput): Promise<{ error: string | null; id?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { id, ...row } = data

  if (id) {
    const { error } = await db.from('agency_faqs').update(row).eq('id', id)
    if (error) return { error: error.message }
    return { error: null, id }
  } else {
    const { data: result, error } = await db.from('agency_faqs').insert(row).select('id').single()
    if (error) return { error: error.message }
    return { error: null, id: result.id }
  }
}

export async function deleteFaq(id: string): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('agency_faqs').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
