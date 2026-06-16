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
