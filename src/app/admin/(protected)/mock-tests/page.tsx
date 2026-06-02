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

  // Fetch country_slug separately — column may not exist yet on older deployments
  let countrySlugs: Record<string, string | null> = {}
  try {
    const { data: extras } = await db.from('mock_test_locations').select('id, country_slug')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (extras) extras.forEach((r: any) => { countrySlugs[r.id] = r.country_slug ?? null })
  } catch { /* column not yet migrated */ }

  type LocationRow = { id: string; name: string; slug: string; description: string | null; is_active: boolean; created_at: string; mock_test_categories: { count: number }[] }
  const rows = (locations ?? [] as LocationRow[]).map((l: LocationRow) => ({
    id:           l.id,
    name:         l.name,
    slug:         l.slug,
    description:  l.description ?? '',
    is_active:    l.is_active,
    created_at:   l.created_at,
    country_slug: countrySlugs[l.id] ?? null,
    categoryCount: l.mock_test_categories?.[0]?.count ?? 0,
  }))

  return (
    <LocationsClient
      locations={rows}
      dbError={error?.message ?? null}
    />
  )
}
