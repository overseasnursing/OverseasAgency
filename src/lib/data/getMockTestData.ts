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
  difficulty: 'easy' | 'medium' | 'hard'
  avgRating:   number
  reviewCount: number
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

// Maps normalizeCountry() keys (src/app/jobs/[slug]/_data/countryMappings.ts)
// to the country_slug values actually stored on mock_test_locations rows.
const COUNTRY_KEY_TO_LOCATION_COUNTRY_SLUG: Record<string, string> = {
  'uae':          'dubai',
  'saudi-arabia': 'saudi',
  'uk':           'uk',
  'germany':      'germany',
  'australia':    'australia',
  'canada':       'canada',
  'ireland':      'ireland',
  'new-zealand':  'new-zealand',
  'singapore':    'singapore',
  'bahrain':      'bahrain',
  'qatar':        'qatar',
  'kuwait':       'kuwait',
  'usa':          'usa',
  'austria':      'austria',
  'switzerland':  'switzerland',
}

/**
 * Real, DB-backed mock test links for a job's country — only returns
 * entries for locations/categories that actually exist and are active,
 * so callers never render a broken link.
 */
export async function getMockTestLinksForCountry(
  normalizedCountryKey: string,
): Promise<{ name: string; href: string }[]> {
  const countrySlug = COUNTRY_KEY_TO_LOCATION_COUNTRY_SLUG[normalizedCountryKey]
  if (!countrySlug) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data: loc } = await db
    .from('mock_test_locations')
    .select('id, slug')
    .eq('country_slug', countrySlug)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()
  if (!loc) return []

  const { data: cats } = await db
    .from('mock_test_categories')
    .select('name, slug')
    .eq('location_id', loc.id)
    .eq('is_active', true)
    .order('name')
  if (!cats?.length) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cats.map((c: any) => ({
    name: `${c.name} Mock Test`,
    href: `/mock-tests/${loc.slug}/${c.slug}`,
  }))
}

export type SiblingCategory = { id: string; name: string; slug: string }

export async function getMockTestCategoryData(locationSlug: string, categorySlug: string): Promise<{
  location: { id: string; name: string; slug: string; country_slug: string | null }
  category: { id: string; name: string; slug: string; description: string; seo_title: string; seo_description: string; updated_at: string }
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
    .from('mock_test_categories').select('id, name, slug, description, seo_title, seo_description, updated_at')
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testIds = (tests ?? []).map((t: any) => t.id)
  const diffByTest:   Record<string, 'easy' | 'medium' | 'hard'> = {}
  const ratingByTest: Record<string, { sum: number; count: number }> = {}

  if (testIds.length > 0) {
    // Fetch question difficulty + approved reviews in parallel
    const [{ data: qRows }, { data: rRows, error: rErr }] = await Promise.all([
      db.from('mock_test_questions').select('mock_test_id, difficulty').in('mock_test_id', testIds),
      db.from('mock_test_reviews').select('mock_test_id, rating')
        .in('mock_test_id', testIds).eq('status', 'approved'),
    ])

    // Dominant difficulty per test
    const diffCounts: Record<string, Record<string, number>> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(qRows ?? []).forEach((q: any) => {
      diffCounts[q.mock_test_id] ??= { easy: 0, medium: 0, hard: 0 }
      const d = q.difficulty as string
      if (d in diffCounts[q.mock_test_id]) diffCounts[q.mock_test_id][d]++
    })
    for (const tid in diffCounts) {
      const sorted = Object.entries(diffCounts[tid]).sort((a, b) => b[1] - a[1])
      diffByTest[tid] = (sorted[0]?.[0] as 'easy' | 'medium' | 'hard') ?? 'medium'
    }

    // Per-test rating aggregates.
    // Primary: reviews linked to a specific test via mock_test_id.
    // Fallback: if no test-linked reviews exist (mock_test_id column not yet migrated,
    //   test was deleted resetting FK to NULL, or reviews predate the inline form),
    //   query the full category and show the aggregate on every card.
    if (!rErr && rRows && rRows.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(rRows as any[]).forEach((r: any) => {
        if (!r.mock_test_id) return
        ratingByTest[r.mock_test_id] ??= { sum: 0, count: 0 }
        ratingByTest[r.mock_test_id].sum   += r.rating
        ratingByTest[r.mock_test_id].count += 1
      })
    } else {
      // Fallback: category-level aggregate shown on all cards
      const { data: catR } = await db
        .from('mock_test_reviews').select('rating')
        .eq('category_id', cat.id).eq('status', 'approved')
      if (catR?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const catSum = (catR as any[]).reduce((s: number, r: any) => s + r.rating, 0)
        testIds.forEach((id: string) => {
          ratingByTest[id] = { sum: catSum, count: catR.length }
        })
      }
    }
  }

  return {
    location: { id: loc.id, name: loc.name, slug: loc.slug, country_slug: countrySlug },
    category: {
      id: cat.id, name: cat.name, slug: cat.slug,
      description: cat.description ?? '',
      seo_title: cat.seo_title ?? '',
      seo_description: cat.seo_description ?? '',
      updated_at: cat.updated_at ?? new Date().toISOString(),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tests: (tests ?? []).map((t: any) => {
      const rt = ratingByTest[t.id]
      return {
        id: t.id, name: t.name, slug: t.slug,
        duration_minutes: t.duration_minutes,
        total_questions: t.total_questions,
        passing_percentage: t.passing_percentage,
        instructions: t.instructions ?? '',
        is_premium: t.is_premium ?? false,
        status: t.status ?? 'published',
        difficulty:  diffByTest[t.id] ?? difficultyFromPass(t.passing_percentage),
        avgRating:   rt ? Math.round((rt.sum / rt.count) * 10) / 10 : 0,
        reviewCount: rt?.count ?? 0,
      }
    }),
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
  // Compute dominant difficulty for this single test
  let testDifficulty: 'easy' | 'medium' | 'hard' = difficultyFromPass(test.passing_percentage)
  const { data: qRows } = await db
    .from('mock_test_questions').select('difficulty').eq('mock_test_id', test.id)
  if (qRows?.length) {
    const counts: Record<string, number> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(qRows as any[]).forEach((q: any) => { counts[q.difficulty] = (counts[q.difficulty] ?? 0) + 1 })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    if (top === 'easy' || top === 'medium' || top === 'hard') testDifficulty = top
  }

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
      difficulty:  testDifficulty,
      avgRating:   0,
      reviewCount: 0,
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
