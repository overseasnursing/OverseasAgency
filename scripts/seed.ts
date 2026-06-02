/**
 * Database seed script — imports mock TypeScript data and inserts into local Supabase.
 * Run: npx tsx scripts/seed.ts
 */
import { createClient } from '@supabase/supabase-js'
import { MOCK_AGENCIES } from '../src/lib/data/agencies.js'
import { PLATFORM_REVIEWS } from '../src/lib/data/reviews.js'
import { SCAM_REPORTS } from '../src/lib/data/scamReports.js'
import type { Database } from '../src/types/database.js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required. Add it to .env.local or pass as env var.')
  process.exit(1)
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ============================================================
// CLEAR existing seed data (idempotent)
// ============================================================
async function clearExistingData() {
  console.log('Clearing existing data...')
  await supabase.from('scam_reports').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('agencies').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('Cleared.')
}

// ============================================================
// SEED AGENCIES
// ============================================================
async function seedAgencies() {
  console.log(`Seeding ${MOCK_AGENCIES.length} agencies...`)

  const rows = MOCK_AGENCIES.map((a) => ({
    slug: a.slug,
    name: a.name,
    city: a.city,
    state: a.state,
    location: a.location,
    established: a.established ?? null,
    trust_level: a.trustLevel as 'verified' | 'trusted' | 'unverified' | 'scam-reported',
    rating: a.rating,
    review_count: a.reviewCount,
    placement_count: a.placementCount,
    transparency_score: a.transparencyScore ?? null,
    countries: a.countries,
    exams_supported: a.examsSupported,
    pricing_min_lakhs: a.pricing?.minLakhs ?? null,
    pricing_max_lakhs: a.pricing?.maxLakhs ?? null,
    pricing_is_approximate: a.pricing?.isApproximate ?? true,
    hidden_charges_reported: a.hiddenChargesReported,
    visa_sponsorship: a.visaSponsorship,
    average_timeline_months: a.averageTimelineMonths?.toString() ?? null,
    tagline: a.tagline ?? null,
    featured: a.featured,
    is_active: true,
  }))

  const { data, error } = await supabase.from('agencies').insert(rows).select('id, slug')
  if (error) {
    console.error('Agency seed error:', error.message)
    process.exit(1)
  }
  console.log(`  Inserted ${data?.length} agencies.`)
  return data ?? []
}

// ============================================================
// SEED REVIEWS
// ============================================================
async function seedReviews(agencyRows: { id: string; slug: string }[]) {
  console.log(`Seeding ${PLATFORM_REVIEWS.length} reviews...`)

  const agencyMap = new Map(agencyRows.map((a) => [a.slug, a.id]))

  const rows = PLATFORM_REVIEWS.map((r) => ({
    agency_id: agencyMap.get(r.agencySlug) ?? null,
    agency_slug: r.agencySlug,
    agency_name: r.agencyName,
    user_id: null,
    author_name: r.authorName,
    author_from: r.authorFrom,
    country_placed: r.destinationCountry,
    exam_taken: null,
    timeline_months: r.timelineMonths ?? null,
    actual_cost_paid: r.actualCostPaid
      ? `₹${(r.actualCostPaid / 100000).toFixed(1)}L`
      : null,
    overall_rating: Math.round(r.rating),
    communication_rating: r.communicationRating ? Math.round(r.communicationRating) : null,
    transparency_rating: r.transparencyRating ? Math.round(r.transparencyRating) : null,
    speed_rating: r.speedRating ? Math.round(r.speedRating) : null,
    review_text: r.body,
    surprise_charges: r.whatSurprisedMe ?? null,
    advice: r.adviceForOthers ?? null,
    placed: r.visaReceived ?? false,
    recommends: r.wouldRecommend ?? true,
    status: 'approved' as const,
    helpful_count: r.helpful ?? 0,
  }))

  const { data, error } = await supabase.from('reviews').insert(rows).select('id')
  if (error) {
    console.error('Review seed error:', error.message)
    process.exit(1)
  }
  console.log(`  Inserted ${data?.length} reviews.`)
}

// ============================================================
// SEED SCAM REPORTS
// ============================================================
async function seedScamReports(agencyRows: { id: string; slug: string }[]) {
  console.log(`Seeding ${SCAM_REPORTS.length} scam reports...`)

  const agencyMap = new Map(agencyRows.map((a) => [a.slug, a.id]))

  const rows = SCAM_REPORTS.map((r) => ({
    slug: r.slug,
    agency_id: agencyMap.get(r.agencySlug) ?? null,
    agency_slug: r.agencySlug,
    agency_name: r.agencyName,
    user_id: null,
    reporter_name: r.reporterName,
    reporter_from: r.reporterFrom,
    category: r.category as Database['public']['Tables']['scam_reports']['Row']['category'],
    severity: r.severity as Database['public']['Tables']['scam_reports']['Row']['severity'],
    country_promised: r.countryPromised,
    amount_lost: r.amountLost ?? null,
    amount_paid: r.amountPaid ?? null,
    amount_recovered: r.amountRecovered ?? null,
    incident_date: r.reportedDate ?? null,
    incident_text: r.fullIncident,
    warning_signs_missed: r.warningSignsMissed ?? null,
    lessons_learned: r.lessonsLearned ?? null,
    emotional_experience: r.emotionalExperience ?? null,
    resolved: r.resolved ?? false,
    agency_responded: false,
    agency_response_text: null,
    evidence_count: r.evidenceCount ?? 0,
    status: 'approved' as const,
  }))

  const { data, error } = await supabase.from('scam_reports').insert(rows).select('id')
  if (error) {
    console.error('Scam report seed error:', error.message)
    process.exit(1)
  }
  console.log(`  Inserted ${data?.length} scam reports.`)
}

// ============================================================
// SEED MOCK TESTS (UAE)
// ============================================================
async function seedUaeMockTest() {
  console.log('Seeding UAE mock test...')

  const { data: locationRow, error: locationError } = await supabase
    .from('mock_test_locations')
    .upsert(
      [{
        name: 'UAE Licensing Exams',
        slug: 'uae',
        description: 'Mock tests for DHA/DOH/MOH nursing licensing pathways in the UAE.',
        is_active: true,
      }],
      { onConflict: 'slug' },
    )
    .select('id')
    .single()

  if (locationError || !locationRow) {
    console.error('UAE location seed error:', locationError?.message ?? 'Unable to upsert location')
    process.exit(1)
  }

  const { data: categoryRow, error: categoryError } = await supabase
    .from('mock_test_categories')
    .upsert(
      [{
        location_id: locationRow.id,
        name: 'DHA Nursing',
        slug: 'uae-dha-nursing',
        description: 'DHA-style practice tests for nurses planning to work in Dubai and wider UAE.',
        seo_title: 'UAE DHA Nursing Mock Test',
        seo_description: 'Practice UAE DHA nursing exam questions with timed mock tests and answer explanations.',
        is_active: true,
      }],
      { onConflict: 'slug' },
    )
    .select('id')
    .single()

  if (categoryError || !categoryRow) {
    console.error('UAE category seed error:', categoryError?.message ?? 'Unable to upsert category')
    process.exit(1)
  }

  const { error: testError } = await supabase
    .from('mock_tests')
    .upsert(
      [{
        category_id: categoryRow.id,
        name: 'UAE DHA Nursing Mock Test 1',
        slug: 'uae-dha-nursing-mock-test-1',
        duration_minutes: 60,
        total_questions: 0,
        passing_percentage: 60,
        instructions: 'Answer all questions. Select the best clinical option and review explanations after submission.',
        seo_title: 'UAE DHA Nursing Mock Test 1',
        seo_description: 'Free UAE DHA nursing practice set with exam-style MCQs for migration preparation.',
        is_active: true,
      }],
      { onConflict: 'slug' },
    )

  if (testError) {
    console.error('UAE mock test seed error:', testError.message)
    process.exit(1)
  }

  console.log('  UAE mock test upserted.')
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('Starting seed...\n')

  await clearExistingData()
  const agencyRows = await seedAgencies()
  await seedReviews(agencyRows)
  await seedScamReports(agencyRows)
  await seedUaeMockTest()

  console.log('\nSeed complete.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
