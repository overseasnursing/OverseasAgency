import type { MetadataRoute } from 'next'
import { createAdminClient }   from '@/lib/supabase/admin'
import { getPublishedBlogPosts } from '@/lib/db/blogs'
import { getAllCountrySlugs }  from '@/lib/data/countries'
import { getAllPricingCountrySlugs } from '@/lib/data/pricing'
import { getApprovedScamReports } from '@/lib/db/scam-reports'
import { getAllStatesAcrossEnabledCountries } from '@/lib/data/getAgencyLocationData'
import { getAllComparisonSlugs } from '@/lib/data/comparisons'
import { getAllSalarySlugs }   from '@/lib/data/salaries'
import { getAllExamSlugs }     from '@/lib/data/exams'
import { getAllGuideSlugs }    from '@/lib/data/guides'
import { getActiveJobs }       from '@/lib/db/jobs'
import { getAllAuthors }       from '@/lib/authors/data'
import { getAllReviewers }     from '@/lib/reviewers/data'
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

// getMockTestsFromDb removed — individual test pages no longer exist.
// Individual tests redirect to their parent category page.

/* ══════════════════════════════════════════════════════════════════════
   Sitemap
══════════════════════════════════════════════════════════════════════ */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic data in parallel
  const [
    agencies,
    mockLocations,
    mockCategories,
    agencyStates,
    blogPosts,
    activeJobs,
    authors,
    reviewers,
  ] = await Promise.all([
    getAgenciesFromDb(),
    getMockTestLocationsFromDb(),
    getMockTestCategoriesFromDb(),
    getAllStatesAcrossEnabledCountries(),
    getPublishedBlogPosts(),
    getActiveJobs(),
    getAllAuthors(),
    getAllReviewers(),
  ])

  /* ── Static pages ── */
  // No lastModified here — these are static/curated pages with no real
  // change-tracking, and Google explicitly advises against setting lastmod
  // to "whenever the sitemap was regenerated" (it trains crawlers to distrust
  // the signal). Omit rather than fabricate.
  const staticPages: MetadataRoute.Sitemap = STATIC_SITEMAP_ENTRIES.map(e => ({
    url: url(e.path),
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }))

  /* ── Country pages ── */
  const countryPages: MetadataRoute.Sitemap = getAllCountrySlugs().map(slug => ({
    url: url(`/country/${slug}`),
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
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  /* ── Agency state pages ── */
  const agencyStatePages: MetadataRoute.Sitemap = agencyStates.map((s) => ({
    url: url(`/agencies/${s.stateSlug}`),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  /* ── Agency city pages ── */
  const agencyCityPages: MetadataRoute.Sitemap = agencyStates.flatMap((s) =>
    s.cities.map((c) => ({
      url: url(`/agencies/${s.stateSlug}/${c.citySlug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  /* ── Comparison pages ── */
  const comparisonPages: MetadataRoute.Sitemap = getAllComparisonSlugs().map(slug => ({
    url: url(`/compare/${slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  /* ── Salary pages ── */
  const salaryPages: MetadataRoute.Sitemap = getAllSalarySlugs().map(slug => ({
    url: url(`/salary/${slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  /* ── Exam pages ── */
  const examPages: MetadataRoute.Sitemap = getAllExamSlugs().map(slug => ({
    url: url(`/exam/${slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  /* ── Guide pages ── */
  const guidePages: MetadataRoute.Sitemap = getAllGuideSlugs().map(slug => ({
    url: url(`/guides/${slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  /* ── Scam report pages ── */
  const approvedScamReports = await getApprovedScamReports()
  const scamPages: MetadataRoute.Sitemap = approvedScamReports.map(r => ({
    url: url(`/scam-report/${r.slug}`),
    lastModified: new Date(r.updated_at),
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

  /* ── Blog post pages ── */
  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map(p => ({
    url: url(`/blog/${p.slug}`),
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  /* ── Job posting pages — time-sensitive, needs frequent recrawl ── */
  const jobPages: MetadataRoute.Sitemap = activeJobs.map(j => ({
    url: url(`/jobs/${j.slug}`),
    lastModified: new Date(j.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  /* ── Author / reviewer bio pages (EEAT) ── */
  const authorPages: MetadataRoute.Sitemap = authors.map(a => ({
    url: url(`/authors/${a.slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))
  const reviewerPages: MetadataRoute.Sitemap = reviewers.map(r => ({
    url: url(`/reviewers/${r.slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...blogPostPages,
    ...countryPages,
    ...agencyPages,
    ...agencyStatePages,
    ...agencyCityPages,
    ...pricingPages,
    ...comparisonPages,
    ...salaryPages,
    ...examPages,
    ...guidePages,
    ...scamPages,
    ...mockLocationPages,
    ...mockCategoryPages,
    ...jobPages,
    ...authorPages,
    ...reviewerPages,
  ]
}
