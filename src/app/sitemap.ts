import type { MetadataRoute } from 'next'
import { createAdminClient }   from '@/lib/supabase/admin'
import { getAllCountrySlugs }  from '@/lib/data/countries'
import { getAllPricingCountrySlugs } from '@/lib/data/pricing'
import { getAllScamReports }   from '@/lib/data/scamReports'
import { getAllLocationCitiesFromDb } from '@/lib/data/getLocationData'
import { getAllComparisonSlugs } from '@/lib/data/comparisons'
import { getAllSalarySlugs }   from '@/lib/data/salaries'
import { getAllExamSlugs }     from '@/lib/data/exams'
import { getAllGuideSlugs }    from '@/lib/data/guides'
import { STATIC_SITEMAP_ENTRIES } from '@/lib/seo/sitemap'

const BASE = 'https://overseasnursing.com'
const url  = (path: string) => `${BASE}${path}`

/* ── DB helpers ─────────────────────────────────────────────────────── */

async function getAgenciesFromDb(): Promise<{ slug: string; updatedAt: Date }[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('agencies')
    .select('slug, updated_at')
    .eq('is_active', true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((a: any) => ({ slug: a.slug, updatedAt: new Date(a.updated_at) }))
}

async function getMockTestLocationsFromDb(): Promise<{ slug: string; updatedAt: Date }[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('mock_test_locations')
    .select('slug, updated_at')
    .eq('is_active', true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((l: any) => ({ slug: l.slug, updatedAt: new Date(l.updated_at) }))
}

async function getMockTestCategoriesFromDb(): Promise<{ locationSlug: string; categorySlug: string; updatedAt: Date }[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const [{ data: locs }, { data: cats }] = await Promise.all([
    db.from('mock_test_locations').select('id, slug').eq('is_active', true),
    db.from('mock_test_categories').select('slug, location_id, updated_at').eq('is_active', true),
  ])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locMap = new Map<string, string>((locs ?? []).map((l: any) => [l.id, l.slug]))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (cats ?? []).filter((c: any) => locMap.has(c.location_id)).map((c: any) => ({
    locationSlug: locMap.get(c.location_id)!,
    categorySlug: c.slug,
    updatedAt:    new Date(c.updated_at),
  }))
}

async function getMockTestsFromDb(): Promise<{ locationSlug: string; categorySlug: string; testSlug: string; updatedAt: Date }[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const [{ data: locs }, { data: cats }, { data: tests }] = await Promise.all([
    db.from('mock_test_locations').select('id, slug').eq('is_active', true),
    db.from('mock_test_categories').select('id, slug, location_id').eq('is_active', true),
    db.from('mock_tests').select('slug, category_id, updated_at').eq('is_active', true),
  ])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locMap = new Map<string, string>((locs ?? []).map((l: any) => [l.id, l.slug]))
  const catMap = new Map<string, { slug: string; locSlug: string }>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cats ?? []).filter((c: any) => locMap.has(c.location_id)).map((c: any) => [
      c.id, { slug: c.slug, locSlug: locMap.get(c.location_id)! },
    ])
  )
  return (tests ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((t: any) => catMap.has(t.category_id))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((t: any) => {
      const cm = catMap.get(t.category_id)!
      return { locationSlug: cm.locSlug, categorySlug: cm.slug, testSlug: t.slug, updatedAt: new Date(t.updated_at) }
    })
}

/* ══════════════════════════════════════════════════════════════════════
   Sitemap
══════════════════════════════════════════════════════════════════════ */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date()

  // Fetch all dynamic data in parallel
  const [
    agencies,
    mockLocations,
    mockCategories,
    mockTests,
    locationCities,
  ] = await Promise.all([
    getAgenciesFromDb(),
    getMockTestLocationsFromDb(),
    getMockTestCategoriesFromDb(),
    getMockTestsFromDb(),
    getAllLocationCitiesFromDb(),
  ])

  /* ── Static pages ── */
  const staticPages: MetadataRoute.Sitemap = STATIC_SITEMAP_ENTRIES.map(e => ({
    url: url(e.path),
    lastModified: today,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }))

  /* ── Country pages ── */
  const countryPages: MetadataRoute.Sitemap = getAllCountrySlugs().map(slug => ({
    url: url(`/country/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  /* ── Agency pages (DB-driven) ── */
  const agencyPages: MetadataRoute.Sitemap = agencies.map(a => ({
    url: url(`/agency/${a.slug}`),
    lastModified: a.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  /* ── Pricing pages ── */
  const pricingPages: MetadataRoute.Sitemap = getAllPricingCountrySlugs().map(slug => ({
    url: url(`/pricing/${slug}`),
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  /* ── Location city pages ── */
  const locationPages: MetadataRoute.Sitemap = locationCities.map(({ slug }) => ({
    url: url(`/location/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  /* ── Comparison pages ── */
  const comparisonPages: MetadataRoute.Sitemap = getAllComparisonSlugs().map(slug => ({
    url: url(`/compare/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  /* ── Salary pages ── */
  const salaryPages: MetadataRoute.Sitemap = getAllSalarySlugs().map(slug => ({
    url: url(`/salary/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  /* ── Exam pages ── */
  const examPages: MetadataRoute.Sitemap = getAllExamSlugs().map(slug => ({
    url: url(`/exam/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  /* ── Guide pages ── */
  const guidePages: MetadataRoute.Sitemap = getAllGuideSlugs().map(slug => ({
    url: url(`/guides/${slug}`),
    lastModified: today,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  /* ── Scam report pages ── */
  const scamPages: MetadataRoute.Sitemap = getAllScamReports().map(r => ({
    url: url(`/scam-report/${r.slug}`),
    lastModified: new Date(r.reportedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  /* ── Mock test location pages (DB-driven) ── */
  const mockLocationPages: MetadataRoute.Sitemap = mockLocations.map(l => ({
    url: url(`/mock-tests/${l.slug}`),
    lastModified: l.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  /* ── Mock test category pages (DB-driven) ── */
  // Priority 0.9 — these are our primary SEO targets (guide + tests + schemas)
  const mockCategoryPages: MetadataRoute.Sitemap = mockCategories.map(c => ({
    url: url(`/mock-tests/${c.locationSlug}/${c.categorySlug}`),
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  /* ── Individual mock test pages (DB-driven) ── */
  const mockTestPages: MetadataRoute.Sitemap = mockTests.map(t => ({
    url: url(`/mock-tests/${t.locationSlug}/${t.categorySlug}/${t.testSlug}`),
    lastModified: t.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    ...staticPages,
    ...countryPages,
    ...agencyPages,
    ...pricingPages,
    ...locationPages,
    ...comparisonPages,
    ...salaryPages,
    ...examPages,
    ...guidePages,
    ...scamPages,
    ...mockLocationPages,
    ...mockCategoryPages,
    ...mockTestPages,
  ]
}
