import { createAdminClient } from '@/lib/supabase/admin'

export type PublicLocation = {
  id: string; name: string; slug: string; description: string
  category_count: number; test_count: number
}

export type PublicCategory = {
  id: string; name: string; slug: string; description: string
  seo_title: string; seo_description: string
  test_count: number; avg_duration: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export type PublicTest = {
  id: string; name: string; slug: string
  duration_minutes: number; total_questions: number
  passing_percentage: number; instructions: string
  is_premium: boolean; status: string
}

function difficultyFromPass(pp: number): 'easy' | 'medium' | 'hard' {
  if (pp >= 70) return 'hard'
  if (pp >= 55) return 'medium'
  return 'easy'
}

export async function getMockTestLocations(): Promise<PublicLocation[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const [{ data: locs }, { data: cats }, { data: tests }] = await Promise.all([
    db.from('mock_test_locations').select('id, name, slug, description').eq('is_active', true).order('name'),
    db.from('mock_test_categories').select('id, location_id').eq('is_active', true),
    db.from('mock_tests').select('id, category_id').eq('is_active', true),
  ])
  if (!locs?.length) return []

  const catsByLoc: Record<string, { id: string }[]> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(cats ?? []).forEach((c: any) => {
    catsByLoc[c.location_id] ??= []
    catsByLoc[c.location_id].push(c)
  })
  const testsByCat: Record<string, number> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(tests ?? []).forEach((t: any) => { testsByCat[t.category_id] = (testsByCat[t.category_id] ?? 0) + 1 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return locs.map((loc: any) => {
    const cs = catsByLoc[loc.id] ?? []
    return {
      id: loc.id, name: loc.name, slug: loc.slug,
      description: loc.description ?? '',
      category_count: cs.length,
      test_count: cs.reduce((s, c) => s + (testsByCat[c.id] ?? 0), 0),
    }
  })
}

export async function getMockTestLocationWithCategories(locationSlug: string): Promise<{
  location: { id: string; name: string; slug: string; description: string }
  categories: PublicCategory[]
} | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data: loc } = await db
    .from('mock_test_locations').select('id, name, slug, description')
    .eq('slug', locationSlug).eq('is_active', true).single()
  if (!loc) return null

  const { data: cats } = await db
    .from('mock_test_categories').select('id, name, slug, description, seo_title, seo_description')
    .eq('location_id', loc.id).eq('is_active', true).order('name')
  if (!cats?.length) return { location: loc, categories: [] }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catIds = cats.map((c: any) => c.id)
  const { data: tests } = await db
    .from('mock_tests').select('id, category_id, duration_minutes, passing_percentage')
    .in('category_id', catIds).eq('is_active', true)

  const bycat: Record<string, { dur: number; pp: number }[]> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(tests ?? []).forEach((t: any) => {
    bycat[t.category_id] ??= []
    bycat[t.category_id].push({ dur: t.duration_minutes, pp: t.passing_percentage })
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories: PublicCategory[] = cats.map((c: any) => {
    const ts = bycat[c.id] ?? []
    const avg = (arr: number[]) => arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0
    return {
      id: c.id, name: c.name, slug: c.slug,
      description: c.description ?? '',
      seo_title: c.seo_title ?? '',
      seo_description: c.seo_description ?? '',
      test_count: ts.length,
      avg_duration: Math.round(avg(ts.map(t => t.dur))) || 60,
      difficulty: difficultyFromPass(avg(ts.map(t => t.pp)) || 60),
    }
  })
  return { location: loc, categories }
}

export type SiblingCategory = { id: string; name: string; slug: string }

export async function getMockTestCategoryData(locationSlug: string, categorySlug: string): Promise<{
  location: { id: string; name: string; slug: string; country_slug: string | null }
  category: { id: string; name: string; slug: string; description: string; seo_title: string; seo_description: string }
  tests: PublicTest[]
  siblingCategories: SiblingCategory[]
} | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data: loc } = await db
    .from('mock_test_locations').select('id, name, slug')
    .eq('slug', locationSlug).eq('is_active', true).single()
  if (!loc) return null

  // Fetch country_slug separately — column may not exist yet on older deployments
  let countrySlug: string | null = null
  try {
    const { data: extra } = await db
      .from('mock_test_locations').select('country_slug')
      .eq('id', loc.id).single()
    countrySlug = extra?.country_slug ?? null
  } catch { /* column not yet migrated */ }

  const { data: cat } = await db
    .from('mock_test_categories').select('id, name, slug, description, seo_title, seo_description')
    .eq('slug', categorySlug).eq('location_id', loc.id).eq('is_active', true).single()
  if (!cat) return null

  // Fetch tests + sibling categories in parallel
  const [{ data: tests }, { data: siblings }] = await Promise.all([
    db.from('mock_tests')
      .select('id, name, slug, duration_minutes, total_questions, passing_percentage, instructions')
      .eq('category_id', cat.id).eq('is_active', true)
      .order('created_at', { ascending: true }),
    db.from('mock_test_categories')
      .select('id, name, slug')
      .eq('location_id', loc.id)
      .neq('id', cat.id)
      .eq('is_active', true)
      .order('name'),
  ])

  return {
    location: { id: loc.id, name: loc.name, slug: loc.slug, country_slug: countrySlug },
    category: {
      id: cat.id, name: cat.name, slug: cat.slug,
      description: cat.description ?? '',
      seo_title: cat.seo_title ?? '',
      seo_description: cat.seo_description ?? '',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tests: (tests ?? []).map((t: any) => ({
      id: t.id, name: t.name, slug: t.slug,
      duration_minutes: t.duration_minutes,
      total_questions: t.total_questions,
      passing_percentage: t.passing_percentage,
      instructions: t.instructions ?? '',
      is_premium: t.is_premium ?? false,
      status: t.status ?? 'published',
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    siblingCategories: (siblings ?? []).map((s: any) => ({ id: s.id, name: s.name, slug: s.slug })),
  }
}

export async function getMockTestBySlug(locSlug: string, catSlug: string, testSlug: string): Promise<{
  test: PublicTest & { seo_title: string; seo_description: string }
  category: { id: string; name: string; slug: string }
  location: { id: string; name: string; slug: string }
} | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data: loc } = await db
    .from('mock_test_locations').select('id, name, slug')
    .eq('slug', locSlug).eq('is_active', true).single()
  if (!loc) return null
  const { data: cat } = await db
    .from('mock_test_categories').select('id, name, slug')
    .eq('slug', catSlug).eq('location_id', loc.id).eq('is_active', true).single()
  if (!cat) return null
  const { data: test } = await db
    .from('mock_tests')
    .select('id, name, slug, duration_minutes, total_questions, passing_percentage, instructions, seo_title, seo_description')
    .eq('slug', testSlug).eq('category_id', cat.id).eq('is_active', true).single()
  if (!test) return null
  return {
    test: {
      id: test.id, name: test.name, slug: test.slug,
      duration_minutes: test.duration_minutes,
      total_questions: test.total_questions,
      passing_percentage: test.passing_percentage,
      instructions: test.instructions ?? '',
      seo_title: test.seo_title ?? '',
      seo_description: test.seo_description ?? '',
      is_premium: test.is_premium ?? false,
      status: test.status ?? 'published',
    },
    category: { id: cat.id, name: cat.name, slug: cat.slug },
    location: { id: loc.id, name: loc.name, slug: loc.slug },
  }
}

// Returns active locations whose slug or name contain any of the supplied keywords,
// filtered to those with at least one active test. Used by exam guide pages.
export async function getMockTestLocationsForExam(keywords: string[]): Promise<PublicLocation[]> {
  if (!keywords.length) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [{ data: locs }, { data: cats }, { data: tests }] = await Promise.all([
    db.from('mock_test_locations').select('id, name, slug, description').eq('is_active', true),
    db.from('mock_test_categories').select('id, location_id').eq('is_active', true),
    db.from('mock_tests').select('id, category_id').eq('is_active', true),
  ])

  if (!locs?.length) return []

  const lower = keywords.map((k) => k.toLowerCase())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matched = (locs as any[]).filter((loc) => {
    const haystack = `${loc.slug} ${loc.name}`.toLowerCase()
    return lower.some((kw) => haystack.includes(kw))
  })
  if (!matched.length) return []

  const catsByLoc: Record<string, { id: string }[]> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(cats ?? []).forEach((c: any) => {
    catsByLoc[c.location_id] ??= []
    catsByLoc[c.location_id].push(c)
  })
  const testsByCat: Record<string, number> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(tests ?? []).forEach((t: any) => { testsByCat[t.category_id] = (testsByCat[t.category_id] ?? 0) + 1 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return matched.map((loc: any) => {
    const cs = catsByLoc[loc.id] ?? []
    return {
      id: loc.id, name: loc.name, slug: loc.slug,
      description: loc.description ?? '',
      category_count: cs.length,
      test_count: cs.reduce((s: number, c: { id: string }) => s + (testsByCat[c.id] ?? 0), 0),
    }
  }).filter((loc: PublicLocation) => loc.test_count > 0)
}

export async function getAllMockTestLocationSlugs(): Promise<string[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db.from('mock_test_locations').select('slug').eq('is_active', true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((l: any) => l.slug)
}

export async function getAllMockTestCategorySlugs(): Promise<{ locationSlug: string; categorySlug: string }[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const [{ data: locs }, { data: cats }] = await Promise.all([
    db.from('mock_test_locations').select('id, slug').eq('is_active', true),
    db.from('mock_test_categories').select('slug, location_id').eq('is_active', true),
  ])
  const locMap = new Map<string, string>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (locs ?? []).map((l: any) => [l.id, l.slug])
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (cats ?? []).filter((c: any) => locMap.has(c.location_id)).map((c: any) => ({
    locationSlug: locMap.get(c.location_id)!,
    categorySlug: c.slug,
  }))
}

export async function getAllMockTestSlugs(): Promise<{ locationSlug: string; categorySlug: string; testSlug: string }[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const [{ data: locs }, { data: cats }, { data: tests }] = await Promise.all([
    db.from('mock_test_locations').select('id, slug').eq('is_active', true),
    db.from('mock_test_categories').select('id, slug, location_id').eq('is_active', true),
    db.from('mock_tests').select('slug, category_id').eq('is_active', true),
  ])
  const locMap = new Map<string, string>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (locs ?? []).map((l: any) => [l.id, l.slug])
  )
  const catMap = new Map<string, { slug: string; locSlug: string }>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cats ?? []).filter((c: any) => locMap.has(c.location_id)).map((c: any) => [
      c.id, { slug: c.slug, locSlug: locMap.get(c.location_id)! }
    ])
  )
  return (tests ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((t: any) => catMap.has(t.category_id))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((t: any) => {
      const cm = catMap.get(t.category_id)!
      return { locationSlug: cm.locSlug, categorySlug: cm.slug, testSlug: t.slug }
    })
}
