import React from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import { LocationsClient } from './_components/LocationsClient'

export const dynamic = 'force-dynamic'

export default async function MockTestLocationsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: locations, error } = await db
    .from('mock_test_locations')
    .select(`
      id, name, slug, description, is_active, created_at,
      mock_test_categories(count)
    `)
    .order('created_at', { ascending: false })

  const rows = (locations ?? []).map((l: any) => ({
    id:         l.id,
    name:       l.name,
    slug:       l.slug,
    description: l.description ?? '',
    is_active:  l.is_active,
    created_at: l.created_at,
    categoryCount: l.mock_test_categories?.[0]?.count ?? 0,
  }))

  return (
    <LocationsClient
      locations={rows}
      dbError={error?.message ?? null}
    />
  )
}
