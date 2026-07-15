import { normalizeCountry } from '@/app/jobs/[slug]/_data/countryMappings'

// Country list for job posting forms — matches the keys used by
// normalizeCountry() in src/app/jobs/[slug]/_data/countryMappings.ts so
// related exams/guides resolve correctly. India has no exam/guide mapping
// yet, so those sections simply render empty for India-based jobs.
export const JOB_COUNTRIES = [
  'India',
  'Germany',
  'UK',
  'Australia',
  'Canada',
  'Ireland',
  'New Zealand',
  'USA',
  'Singapore',
  'Saudi Arabia',
  'UAE',
  'Bahrain',
  'Qatar',
  'Kuwait',
  'Oman',
] as const

export const JOB_CURRENCIES = [
  'INR',
  'USD',
  'EUR',
  'GBP',
  'AED',
  'SAR',
  'CAD',
  'AUD',
  'NZD',
  'SGD',
  'BHD',
  'QAR',
  'KWD',
  'OMR',
] as const

export const EXPERIENCE_FILTER_RANGES = [
  { label: '0–1 years', min: 0, max: 1 },
  { label: '2–4 years', min: 2, max: 4 },
  { label: '5+ years',  min: 5, max: Infinity },
] as const

export type JobExpiryStatus = 'expired' | 'expiring_soon' | 'active'

const EXPIRING_SOON_DAYS = 3

/** Pure date comparison — no side effects, safe on server or client. */
export function getJobExpiryStatus(expiryDate: string): JobExpiryStatus {
  const msRemaining = new Date(expiryDate).getTime() - Date.now()
  if (msRemaining < 0) return 'expired'
  if (msRemaining <= EXPIRING_SOON_DAYS * 24 * 60 * 60 * 1000) return 'expiring_soon'
  return 'active'
}

/** Canonical slug helper for the Jobs module (Phase 10 — consolidated from
 * five byte-identical local copies scattered across admin/agency forms and
 * actions, plus the destination-hierarchy route matching added in Phase 7).
 * Used both for a job's own title→slug on create, and to match a
 * destination-route URL param (city/job_type) back to its raw DB value. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Every destination-hierarchy path a job's country/city/job_type map to —
 * shared by admin and agency mutation actions so revalidatePath() coverage
 * doesn't hand-roll slug construction in two places (Phase 10). */
export function getJobDestinationPaths(country: string, city: string | null, jobType: string): string[] {
  const countrySlug = normalizeCountry(country)
  const paths = [`/jobs/${countrySlug}`]
  if (city) {
    const citySlug = slugify(city)
    paths.push(`/jobs/${countrySlug}/${citySlug}`)
    paths.push(`/jobs/${countrySlug}/${citySlug}/${slugify(jobType)}`)
  }
  return paths
}
