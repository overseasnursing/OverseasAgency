import React from 'react'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { CategoriesClient } from './_components/CategoriesClient'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage({ params }: { params: Promise<{ locationId: string }> }) {
  const { locationId } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [{ data: location, error: locError }, { data: categories, error: catError }] = await Promise.all([
    db.from('mock_test_locations').select('id, name, slug, is_active').eq('id', locationId).single(),
    db.from('mock_test_categories')
      .select(`id, name, slug, description, seo_title, seo_description, is_active, created_at, mock_tests(count)`)
      .eq('location_id', locationId)
      .order('created_at', { ascending: false }),
  ])

  if (locError || !location) notFound()

  const rows = (categories ?? []).map((c: any) => ({
    id:              c.id,
    name:            c.name,
    slug:            c.slug,
    description:     c.description     ?? '',
    seo_title:       c.seo_title       ?? '',
    seo_description: c.seo_description ?? '',
    is_active:       c.is_active,
    created_at:      c.created_at,
    testCount:       c.mock_tests?.[0]?.count ?? 0,
    location_id:     locationId,
  }))

  return (
    <CategoriesClient
      location={{ id: location.id, name: location.name, slug: location.slug }}
      categories={rows}
      dbError={catError?.message ?? null}
    />
  )
}
