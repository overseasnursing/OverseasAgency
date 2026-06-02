/**
 * Auto-generated internal linking and authority mappings for mock test pages.
 * No manual input needed — every new category gets these automatically.
 */
import { DESTINATION_COUNTRIES } from './countryList'

// ── Destination info ────────────────────────────────────────────────────────

export type DestinationInfo = {
  countrySlug:         string
  salarySlug:          string
  countryName:         string
  flagCode:            string   // ISO 3166-1 alpha-2, lowercase — used for flagcdn.com
  agencyCountryTerms:  string[] // all terms that match agencies.countries[] values in DB
  agencyFilterCountry: string   // exact country name used in /agencies?country= URL param
}

// ── Canonical map keyed by country_slug (stored in mock_test_locations.country_slug) ──

const COUNTRY_DESTINATION_MAP: Record<string, DestinationInfo> = {
  'dubai':       { countrySlug: 'dubai',       salarySlug: 'dubai',       countryName: 'Dubai, UAE',     flagCode: 'ae', agencyCountryTerms: ['UAE', 'Dubai'],           agencyFilterCountry: 'UAE' },
  'saudi':       { countrySlug: 'saudi',       salarySlug: 'saudi',       countryName: 'Saudi Arabia',   flagCode: 'sa', agencyCountryTerms: ['Saudi Arabia'],            agencyFilterCountry: 'Saudi Arabia' },
  'uk':          { countrySlug: 'uk',          salarySlug: 'uk',          countryName: 'United Kingdom', flagCode: 'gb', agencyCountryTerms: ['UK', 'United Kingdom'],    agencyFilterCountry: 'UK' },
  'germany':     { countrySlug: 'germany',     salarySlug: 'germany',     countryName: 'Germany',        flagCode: 'de', agencyCountryTerms: ['Germany'],                 agencyFilterCountry: 'Germany' },
  'australia':   { countrySlug: 'australia',   salarySlug: 'australia',   countryName: 'Australia',      flagCode: 'au', agencyCountryTerms: ['Australia'],               agencyFilterCountry: 'Australia' },
  'canada':      { countrySlug: 'canada',      salarySlug: 'canada',      countryName: 'Canada',         flagCode: 'ca', agencyCountryTerms: ['Canada'],                  agencyFilterCountry: 'Canada' },
  'new-zealand': { countrySlug: 'new-zealand', salarySlug: 'new-zealand', countryName: 'New Zealand',    flagCode: 'nz', agencyCountryTerms: ['New Zealand'],             agencyFilterCountry: 'New Zealand' },
  'ireland':     { countrySlug: 'ireland',     salarySlug: 'ireland',     countryName: 'Ireland',        flagCode: 'ie', agencyCountryTerms: ['Ireland'],                 agencyFilterCountry: 'Ireland' },
  'qatar':       { countrySlug: 'qatar',       salarySlug: 'qatar',       countryName: 'Qatar',          flagCode: 'qa', agencyCountryTerms: ['Qatar'],                   agencyFilterCountry: 'Qatar' },
  'bahrain':     { countrySlug: 'bahrain',     salarySlug: 'bahrain',     countryName: 'Bahrain',        flagCode: 'bh', agencyCountryTerms: ['Bahrain'],                 agencyFilterCountry: 'Bahrain' },
  'kuwait':      { countrySlug: 'kuwait',      salarySlug: 'kuwait',      countryName: 'Kuwait',         flagCode: 'kw', agencyCountryTerms: ['Kuwait'],                  agencyFilterCountry: 'Kuwait' },
  'singapore':   { countrySlug: 'singapore',   salarySlug: 'singapore',   countryName: 'Singapore',      flagCode: 'sg', agencyCountryTerms: ['Singapore'],               agencyFilterCountry: 'Singapore' },
}

/** Look up by country_slug stored in DB — preferred, use this when available */
export function getDestinationByCountrySlug(countrySlug: string): DestinationInfo | null {
  return COUNTRY_DESTINATION_MAP[countrySlug] ?? null
}

/** Countries available for selection in the admin location modal — derived from countryList */
export const DESTINATION_COUNTRY_OPTIONS = DESTINATION_COUNTRIES.map(c => ({
  slug:     c.slug,
  name:     c.name,
  flagCode: c.flagCode,
}))

// ── Legacy slug-based lookup (fallback for locations without country_slug) ──

const LOCATION_MAP: Record<string, DestinationInfo> = {
  // Gulf / UAE
  'gulf-nursing-exams': COUNTRY_DESTINATION_MAP['dubai'],
  'gulf':               COUNTRY_DESTINATION_MAP['dubai'],
  'dubai':              COUNTRY_DESTINATION_MAP['dubai'],
  'middle-east':        COUNTRY_DESTINATION_MAP['dubai'],
  'uae':                { ...COUNTRY_DESTINATION_MAP['dubai'], countryName: 'UAE' },
  'abu-dhabi':          { ...COUNTRY_DESTINATION_MAP['dubai'], countryName: 'UAE' },

  // Saudi Arabia
  'saudi-arabia':       COUNTRY_DESTINATION_MAP['saudi'],
  'saudi':              COUNTRY_DESTINATION_MAP['saudi'],
  'ksa':                COUNTRY_DESTINATION_MAP['saudi'],

  // United Kingdom
  'united-kingdom':     COUNTRY_DESTINATION_MAP['uk'],
  'uk':                 COUNTRY_DESTINATION_MAP['uk'],

  // Germany
  'germany':            COUNTRY_DESTINATION_MAP['germany'],

  // Australia
  'australia':          COUNTRY_DESTINATION_MAP['australia'],

  // Canada
  'canada':             COUNTRY_DESTINATION_MAP['canada'],

  // New Zealand
  'new-zealand':        COUNTRY_DESTINATION_MAP['new-zealand'],

  // Ireland
  'ireland':            COUNTRY_DESTINATION_MAP['ireland'],
}

export function getLocationLinks(locationSlug: string): DestinationInfo | null {
  if (LOCATION_MAP[locationSlug]) return LOCATION_MAP[locationSlug]

  const s = locationSlug.toLowerCase()
  if (/gulf|dubai|uae|emirate/.test(s))  return LOCATION_MAP['gulf-nursing-exams']
  if (/saudi|ksa/.test(s))               return LOCATION_MAP['saudi-arabia']
  if (/uk|britain|kingdom/.test(s))      return LOCATION_MAP['united-kingdom']
  if (/germany|german/.test(s))          return LOCATION_MAP['germany']
  if (/australia/.test(s))               return LOCATION_MAP['australia']
  if (/canada/.test(s))                  return LOCATION_MAP['canada']
  if (/new.zealand/.test(s))             return LOCATION_MAP['new-zealand']
  if (/ireland/.test(s))                 return LOCATION_MAP['ireland']

  return null
}

// ── Category slug → Official exam authority ────────────────────────────────

type AuthorityInfo = {
  name:  string
  url:   string
  label: string
}

export function getExamAuthority(categorySlug: string): AuthorityInfo | null {
  const s = categorySlug.toLowerCase()

  if (/\bdha\b/.test(s))
    return { name: 'Dubai Health Authority', url: 'https://sheryan.dha.gov.ae', label: 'DHA Sheryan Portal' }

  if (/\bdoh\b/.test(s) || /\bhaad\b/.test(s))
    return { name: 'Dept. of Health — Abu Dhabi', url: 'https://doh.gov.ae', label: 'DOH Official Portal' }

  if (/\bmoh\b/.test(s) && /uae|emirate|dubai/.test(s))
    return { name: 'Ministry of Health UAE', url: 'https://mohap.gov.ae', label: 'MOHAP Official Portal' }

  if (/\bmoh\b/.test(s) || /\bsaudi\b/.test(s) || /\bprometric\b/.test(s))
    return { name: 'Saudi Commission for Health Specialties', url: 'https://www.scfhs.org.sa', label: 'SCFHS Official Portal' }

  if (/\bnmc\b/.test(s))
    return { name: 'Nursing & Midwifery Council', url: 'https://www.nmc.org.uk', label: 'NMC Official Portal' }

  if (/\bnclex\b/.test(s))
    return { name: 'NCSBN — NCLEX', url: 'https://www.ncsbn.org/nclex', label: 'NCSBN NCLEX Portal' }

  if (/\boet\b/.test(s))
    return { name: 'OET', url: 'https://www.occupationalenglishtest.org', label: 'OET Official Portal' }

  if (/\bahpra\b/.test(s))
    return { name: 'AHPRA Australia', url: 'https://www.ahpra.gov.au', label: 'AHPRA Official Portal' }

  if (/\bdataflow\b/.test(s))
    return { name: 'DataFlow Group', url: 'https://www.dataflowgroup.com', label: 'DataFlow Official Portal' }

  return null
}
