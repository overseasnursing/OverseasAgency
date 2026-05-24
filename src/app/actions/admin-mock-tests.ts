'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'

const now = () => new Date().toISOString()

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')
}

/* ── Types ───────────────────────────────────────────────────────────── */

export type LocationInput = {
  id?: string
  name: string
  slug: string
  description: string
  is_active: boolean
}

export type CategoryInput = {
  id?: string
  location_id: string
  name: string
  slug: string
  description: string
  seo_title: string
  seo_description: string
  is_active: boolean
}

export type MockTestInput = {
  id?: string
  category_id: string
  name: string
  slug: string
  duration_minutes: number
  total_questions: number
  passing_percentage: number
  instructions: string
  seo_title: string
  seo_description: string
  is_active: boolean
}

/* ── Location CRUD ───────────────────────────────────────────────────── */

export async function saveLocation(data: LocationInput): Promise<{ error: string | null; id?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db  = createAdminClient() as any
  const row = {
    name:        data.name.trim(),
    slug:        toSlug(data.slug || data.name),
    description: data.description || null,
    is_active:   data.is_active,
    updated_at:  now(),
  }
  if (data.id) {
    const { error } = await db.from('mock_test_locations').update(row).eq('id', data.id)
    if (error) return { error: error.message }
    revalidatePath('/admin/mock-tests')
    return { error: null, id: data.id }
  }
  const { data: r, error } = await db.from('mock_test_locations').insert(row).select('id').single()
  if (error) return { error: error.message }
  revalidatePath('/admin/mock-tests')
  return { error: null, id: r.id }
}

export async function deleteLocation(id: string): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('mock_test_locations').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/mock-tests')
  return { error: null }
}

export async function toggleLocationStatus(id: string, is_active: boolean): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('mock_test_locations').update({ is_active, updated_at: now() }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/mock-tests')
  return { error: null }
}

/* ── Category CRUD ───────────────────────────────────────────────────── */

export async function saveCategory(data: CategoryInput): Promise<{ error: string | null; id?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db  = createAdminClient() as any
  const row = {
    location_id:     data.location_id,
    name:            data.name.trim(),
    slug:            toSlug(data.slug || data.name),
    description:     data.description     || null,
    seo_title:       data.seo_title       || null,
    seo_description: data.seo_description || null,
    is_active:       data.is_active,
    updated_at:      now(),
  }
  if (data.id) {
    const { error } = await db.from('mock_test_categories').update(row).eq('id', data.id)
    if (error) return { error: error.message }
    revalidatePath('/admin/mock-tests')
    return { error: null, id: data.id }
  }
  const { data: r, error } = await db.from('mock_test_categories').insert(row).select('id').single()
  if (error) return { error: error.message }
  revalidatePath('/admin/mock-tests')
  return { error: null, id: r.id }
}

export async function deleteCategory(id: string, locationId: string): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('mock_test_categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/admin/mock-tests/${locationId}/categories`)
  return { error: null }
}

export async function toggleCategoryStatus(id: string, is_active: boolean, locationId: string): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('mock_test_categories').update({ is_active, updated_at: now() }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/admin/mock-tests/${locationId}/categories`)
  return { error: null }
}

/* ── Mock Test CRUD ──────────────────────────────────────────────────── */

export async function saveMockTest(data: MockTestInput): Promise<{ error: string | null; id?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db  = createAdminClient() as any
  const row = {
    category_id:        data.category_id,
    name:               data.name.trim(),
    slug:               toSlug(data.slug || data.name),
    duration_minutes:   data.duration_minutes,
    total_questions:    data.total_questions,
    passing_percentage: data.passing_percentage,
    instructions:       data.instructions || null,
    seo_title:          data.seo_title    || null,
    seo_description:    data.seo_description || null,
    is_active:          data.is_active,
    updated_at:         now(),
  }
  if (data.id) {
    const { error } = await db.from('mock_tests').update(row).eq('id', data.id)
    if (error) return { error: error.message }
    revalidatePath('/admin/mock-tests')
    return { error: null, id: data.id }
  }
  const { data: r, error } = await db.from('mock_tests').insert(row).select('id').single()
  if (error) return { error: error.message }
  revalidatePath('/admin/mock-tests')
  return { error: null, id: r.id }
}

export async function deleteMockTest(id: string): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('mock_tests').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/mock-tests')
  return { error: null }
}

export async function toggleMockTestStatus(id: string, is_active: boolean): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('mock_tests').update({ is_active, updated_at: now() }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/mock-tests')
  return { error: null }
}
