/**
 * fetchLlmsData.ts
 *
 * Centralised data-fetching for both /llms.txt and /llms-full.txt routes.
 * All Supabase queries run in parallel and degrade gracefully when the DB
 * is unreachable (returns empty collections instead of throwing).
 *
 * Called at most once per 24-hour ISR window — not on every request.
 */

import { createAdminClient } from '@/lib/supabase/admin'

// ── Output types ─────────────────────────────────────────────────────────────

export interface LlmsAgency {
  name: string
  slug: string
  location: string | null
  rating: number | null
  trustLevel: string
  countries: string[]
}

export interface LlmsMockLocation {
  id: string
  name: string
  slug: string
}

export interface LlmsMockCategory {
  id: string
  name: string
  slug: string
  locationId: string
}

export interface LlmsMockTest {
  name: string
  slug: string
  categoryId: string
  durationMinutes: number
  totalQuestions: number
  difficulty: string
}

export interface LlmsDbStats {
  agencyTotal: number
  agencyVerified: number
  reviewTotal: number
  scamReportTotal: number
  mockLocationTotal: number
  mockCategoryTotal: number
  mockTestTotal: number
}

export interface LlmsFullData {
  stats: LlmsDbStats
  agencies: LlmsAgency[]
  mockLocations: LlmsMockLocation[]
  mockCategories: LlmsMockCategory[]
  mockTests: LlmsMockTest[]
}

// ── Query ─────────────────────────────────────────────────────────────────────

export async function fetchLlmsData(): Promise<LlmsFullData> {
  const empty: LlmsFullData = {
    stats: {
      agencyTotal: 0,
      agencyVerified: 0,
      reviewTotal: 0,
      scamReportTotal: 0,
      mockLocationTotal: 0,
      mockCategoryTotal: 0,
      mockTestTotal: 0,
    },
    agencies: [],
    mockLocations: [],
    mockCategories: [],
    mockTests: [],
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createAdminClient() as any

    const [
      agenciesRes,
      verifiedCountRes,
      reviewCountRes,
      scamCountRes,
      locationsRes,
      categoriesRes,
      testsRes,
    ] = await Promise.all([
      // All active agencies — name, slug, location, rating, trust_level, countries
      db
        .from('agencies')
        .select('name, slug, location, rating, trust_level, countries')
        .eq('is_active', true)
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(200),

      // Verified-agency count (count only — no row data needed)
      db
        .from('agencies')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('trust_level', 'verified'),

      // Approved review count
      db
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'approved')
        .eq('user_disabled', false),

      // Approved scam report count
      db
        .from('scam_reports')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'approved')
        .eq('user_disabled', false),

      // All active mock-test locations
      db
        .from('mock_test_locations')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name', { ascending: true }),

      // All active mock-test categories
      db
        .from('mock_test_categories')
        .select('id, name, slug, location_id')
        .eq('is_active', true)
        .order('name', { ascending: true }),

      // All active mock tests (lightweight — name, slug, category, shape)
      db
        .from('mock_tests')
        .select('name, slug, category_id, duration_minutes, total_questions, difficulty')
        .eq('is_active', true)
        .order('name', { ascending: true }),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agencies: LlmsAgency[] = (agenciesRes.data ?? []).map((a: any) => ({
      name: a.name,
      slug: a.slug,
      location: a.location ?? null,
      rating: typeof a.rating === 'number' ? a.rating : null,
      trustLevel: a.trust_level ?? 'unverified',
      countries: Array.isArray(a.countries) ? a.countries : [],
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockLocations: LlmsMockLocation[] = (locationsRes.data ?? []).map((l: any) => ({
      id: l.id,
      name: l.name,
      slug: l.slug,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockCategories: LlmsMockCategory[] = (categoriesRes.data ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      locationId: c.location_id,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockTests: LlmsMockTest[] = (testsRes.data ?? []).map((t: any) => ({
      name: t.name,
      slug: t.slug,
      categoryId: t.category_id,
      durationMinutes: t.duration_minutes ?? 0,
      totalQuestions: t.total_questions ?? 0,
      difficulty: t.difficulty ?? 'medium',
    }))

    return {
      stats: {
        agencyTotal: agencies.length,
        agencyVerified: verifiedCountRes.count ?? 0,
        reviewTotal: reviewCountRes.count ?? 0,
        scamReportTotal: scamCountRes.count ?? 0,
        mockLocationTotal: mockLocations.length,
        mockCategoryTotal: mockCategories.length,
        mockTestTotal: mockTests.length,
      },
      agencies,
      mockLocations,
      mockCategories,
      mockTests,
    }
  } catch {
    // DB unavailable — return empty collections (site still builds cleanly)
    return empty
  }
}
