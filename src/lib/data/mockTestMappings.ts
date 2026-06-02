/**
 * Auto-generated internal linking and authority mappings for mock test pages.
 * No manual input needed — every new category gets these automatically.
 */

// ── Location → Country / Salary destination ────────────────────────────────

type DestinationInfo = {
  countrySlug: string
  salarySlug:  string
  countryName: string
  flag:        string
}

const LOCATION_MAP: Record<string, DestinationInfo> = {
  // Gulf / UAE
  'gulf-nursing-exams': { countrySlug: 'dubai',     salarySlug: 'dubai',     countryName: 'Dubai, UAE',      flag: '🇦🇪' },
  'gulf':               { countrySlug: 'dubai',     salarySlug: 'dubai',     countryName: 'Dubai, UAE',      flag: '🇦🇪' },
  'dubai':              { countrySlug: 'dubai',     salarySlug: 'dubai',     countryName: 'Dubai, UAE',      flag: '🇦🇪' },
  'middle-east':        { countrySlug: 'dubai',     salarySlug: 'dubai',     countryName: 'Dubai, UAE',      flag: '🇦🇪' },
  'uae':                { countrySlug: 'dubai',     salarySlug: 'dubai',     countryName: 'UAE',             flag: '🇦🇪' },
  'abu-dhabi':          { countrySlug: 'dubai',     salarySlug: 'dubai',     countryName: 'UAE',             flag: '🇦🇪' },

  // Saudi Arabia
  'saudi-arabia':       { countrySlug: 'saudi',     salarySlug: 'saudi',     countryName: 'Saudi Arabia',    flag: '🇸🇦' },
  'saudi':              { countrySlug: 'saudi',     salarySlug: 'saudi',     countryName: 'Saudi Arabia',    flag: '🇸🇦' },
  'ksa':                { countrySlug: 'saudi',     salarySlug: 'saudi',     countryName: 'Saudi Arabia',    flag: '🇸🇦' },

  // United Kingdom
  'united-kingdom':     { countrySlug: 'uk',        salarySlug: 'uk',        countryName: 'United Kingdom',  flag: '🇬🇧' },
  'uk':                 { countrySlug: 'uk',        salarySlug: 'uk',        countryName: 'United Kingdom',  flag: '🇬🇧' },

  // Germany
  'germany':            { countrySlug: 'germany',   salarySlug: 'germany',   countryName: 'Germany',         flag: '🇩🇪' },

  // Australia
  'australia':          { countrySlug: 'australia', salarySlug: 'australia', countryName: 'Australia',       flag: '🇦🇺' },

  // Canada
  'canada':             { countrySlug: 'canada',    salarySlug: 'canada',    countryName: 'Canada',          flag: '🇨🇦' },

  // New Zealand
  'new-zealand':        { countrySlug: 'new-zealand', salarySlug: 'new-zealand', countryName: 'New Zealand', flag: '🇳🇿' },

  // Ireland
  'ireland':            { countrySlug: 'ireland',   salarySlug: 'ireland',   countryName: 'Ireland',         flag: '🇮🇪' },
}

export function getLocationLinks(locationSlug: string): DestinationInfo | null {
  // Exact match first
  if (LOCATION_MAP[locationSlug]) return LOCATION_MAP[locationSlug]

  // Keyword fallback — handles slugs like "gulf-2026-exams" etc.
  const s = locationSlug.toLowerCase()
  if (/gulf|dubai|uae|emirate/.test(s))  return LOCATION_MAP['gulf-nursing-exams']
  if (/saudi|ksa/.test(s))               return LOCATION_MAP['saudi-arabia']
  if (/uk|britain|kingdom/.test(s))      return LOCATION_MAP['united-kingdom']
  if (/germany|german/.test(s))          return LOCATION_MAP['germany']
  if (/australia/.test(s))              return LOCATION_MAP['australia']
  if (/canada/.test(s))                 return LOCATION_MAP['canada']
  if (/new.zealand/.test(s))            return LOCATION_MAP['new-zealand']
  if (/ireland/.test(s))               return LOCATION_MAP['ireland']

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

  // MOH UAE first (more specific), then MOH Saudi
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
