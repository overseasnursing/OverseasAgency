/**
 * Single source of truth for destination country data.
 * Every country list in the app derives from this file.
 *
 * dbValue = exact string stored in agencies.countries[] — used for filter matching.
 * name    = display label shown to users in forms and UI.
 * slug    = URL segment used in /country/[slug], /salary/[slug] etc.
 */

export type DestinationCountry = {
  slug:     string
  name:     string
  dbValue:  string   // canonical value stored in DB — DO NOT change without a data migration
  flagCode: string   // ISO 3166-1 alpha-2 lowercase, for flagcdn.com
}

export const DESTINATION_COUNTRIES: DestinationCountry[] = [
  { slug: 'germany',     name: 'Germany',        dbValue: 'Germany',      flagCode: 'de' },
  { slug: 'uk',          name: 'United Kingdom', dbValue: 'UK',           flagCode: 'gb' },
  { slug: 'canada',      name: 'Canada',         dbValue: 'Canada',       flagCode: 'ca' },
  { slug: 'australia',   name: 'Australia',      dbValue: 'Australia',    flagCode: 'au' },
  { slug: 'dubai',       name: 'UAE (Dubai)',     dbValue: 'UAE',          flagCode: 'ae' },
  { slug: 'saudi',       name: 'Saudi Arabia',   dbValue: 'Saudi Arabia', flagCode: 'sa' },
  { slug: 'qatar',       name: 'Qatar',          dbValue: 'Qatar',        flagCode: 'qa' },
  { slug: 'bahrain',     name: 'Bahrain',        dbValue: 'Bahrain',      flagCode: 'bh' },
  { slug: 'kuwait',      name: 'Kuwait',         dbValue: 'Kuwait',       flagCode: 'kw' },
  { slug: 'ireland',     name: 'Ireland',        dbValue: 'Ireland',      flagCode: 'ie' },
  { slug: 'new-zealand', name: 'New Zealand',    dbValue: 'New Zealand',  flagCode: 'nz' },
  { slug: 'singapore',   name: 'Singapore',      dbValue: 'Singapore',    flagCode: 'sg' },
  { slug: 'austria',     name: 'Austria',        dbValue: 'Austria',      flagCode: 'at' },
  { slug: 'switzerland', name: 'Switzerland',    dbValue: 'Switzerland',  flagCode: 'ch' },
  { slug: 'usa',         name: 'USA',            dbValue: 'USA',          flagCode: 'us' },
]

/** DB values used in the agency filter sidebar (exact match against agencies.countries[]) */
export const COUNTRY_FILTER_OPTIONS: string[] = DESTINATION_COUNTRIES.map(c => c.dbValue)

/**
 * Display names for user-facing forms (reviews, scam reports, inquiries).
 * Shows name not dbValue — e.g. "UAE (Dubai)" not "UAE".
 * Includes "Other" at the end.
 */
export const COUNTRY_FORM_OPTIONS: string[] = [
  ...DESTINATION_COUNTRIES.map(c => c.name),
  'Other',
]

/** For admin dropdowns that only need slug + name + flag (e.g. mock test location modal) */
export const COUNTRY_ADMIN_OPTIONS = DESTINATION_COUNTRIES.map(c => ({
  slug:     c.slug,
  name:     c.name,
  flagCode: c.flagCode,
}))

export function getCountryBySlug(slug: string): DestinationCountry | undefined {
  return DESTINATION_COUNTRIES.find(c => c.slug === slug)
}

export function getCountryByDbValue(dbValue: string): DestinationCountry | undefined {
  return DESTINATION_COUNTRIES.find(c => c.dbValue === dbValue)
}

/**
 * Countries nurses migrate FROM (agencies.source_country) — separate from
 * DESTINATION_COUNTRIES, which is where they migrate TO. India stays first
 * since every existing agency defaults to it.
 */
export type SourceCountry = {
  name:     string
  isoCode:  string   // ISO 3166-1 alpha-2 uppercase, for schema.org addressCountry
  flagCode: string   // ISO 3166-1 alpha-2 lowercase, for flagcdn.com
  // Registry facts below are optional and only populated for source countries
  // actually enabled for agency management (see country_settings). Add a
  // country's phone/currency facts when it's actually being onboarded, not
  // preemptively for every entry in this list.
  phoneCode?:      string   // default international dial code, e.g. "+63"
  currencyCode?:   string   // ISO 4217, e.g. "PHP"
  currencySymbol?: string
  // Adjectival demonym for homepage copy personalization (Phase 6) — e.g.
  // "Filipino nurses", not "Philippines nurses". Optional, same reasoning as
  // phoneCode/currencyCode above: only populated for countries actually
  // being onboarded, not preemptively.
  demonym?:        string
}

// CHECKLIST when onboarding a new source country (filling in phoneCode/currencyCode/
// demonym below and enabling it in country_settings):
//   1. Fill in currencyCode/currencySymbol — without it, getCurrencySymbol()
//      falls back to ₹ for that country's own agencies/reviews/scam reports.
//   2. Add its row to AGENCY_ATTRIBUTION further down this file — without it,
//      agency pages silently fall back to AGENCY_ATTRIBUTION_DEFAULT's generic
//      wording instead of citing that country's actual licensing bodies.

export const SOURCE_COUNTRIES: SourceCountry[] = [
  { name: 'India',        isoCode: 'IN', flagCode: 'in', phoneCode: '+91', currencyCode: 'INR', currencySymbol: '₹', demonym: 'Indian' },
  { name: 'Philippines',  isoCode: 'PH', flagCode: 'ph', phoneCode: '+63', currencyCode: 'PHP', currencySymbol: '₱', demonym: 'Filipino' },
  { name: 'Nepal',        isoCode: 'NP', flagCode: 'np' },
  { name: 'Nigeria',      isoCode: 'NG', flagCode: 'ng' },
  { name: 'Kenya',        isoCode: 'KE', flagCode: 'ke' },
  { name: 'South Africa', isoCode: 'ZA', flagCode: 'za' },
]

/** For the admin agency form's source-country field (name only, "Other" allowed via free text). */
export const SOURCE_COUNTRY_OPTIONS: string[] = SOURCE_COUNTRIES.map(c => c.name)

export function getSourceCountryByName(name: string): SourceCountry | undefined {
  return SOURCE_COUNTRIES.find(c => c.name === name)
}

/**
 * Currency symbol for money tied to a specific source country (agency fees,
 * scam report amounts, review costs — all entered by/about that country's
 * agencies). Falls back to India's ₹ since every pre-Phase-1 record is
 * implicitly INR. No FX conversion — amounts are already stored in the
 * agency's own currency (see agencies.pricing_currency); this only fixes the
 * displayed symbol. Automatically correct for any future source country once
 * its currencySymbol is filled in above (see onboarding checklist).
 */
export function getCurrencySymbol(sourceCountryName: string): string {
  return getSourceCountryByName(sourceCountryName)?.currencySymbol ?? '₹'
}

/** Reverse lookup for geo-detection — ISO 3166-1 alpha-2, case-insensitive. */
export function getSourceCountryByIso(isoCode: string): SourceCountry | undefined {
  const upper = isoCode.toUpperCase()
  return SOURCE_COUNTRIES.find(c => c.isoCode === upper)
}

/**
 * Agency page "Source & Attribution" widget — the regulatory/licensing bodies
 * cited depend on which country the agency recruits nurses FROM, not the
 * destination. Keyed by SourceCountry.name. Falls back to AGENCY_ATTRIBUTION_DEFAULT
 * for any source country without a dedicated entry yet (see SOURCE_COUNTRIES comment —
 * only populate here once a source country is actually onboarded).
 */
export const AGENCY_ATTRIBUTION: Record<string, { sources: { label: string }[]; note: string }> = {
  India: {
    sources: [
      { label: 'Ministry of External Affairs (MEA), India — ePOE Overseas Recruiter Register' },
      { label: 'State Nursing Council Registration Databases' },
      { label: 'Protector General of Emigrants (PGE), India — Recruitment Agent Licensing' },
      { label: 'Nurse-submitted reviews and direct agency verification' },
    ],
    note: 'Agency information compiled from public business records, official licensing databases, MEA filings, and nurse-submitted reviews. Pricing and timelines are self-reported and independently verified where possible.',
  },
  Philippines: {
    sources: [
      { label: 'Department of Migrant Workers (DMW), Philippines — Licensed Recruitment Agency Registry' },
      { label: 'Professional Regulation Commission (PRC) — Board of Nursing' },
      { label: 'Overseas Workers Welfare Administration (OWWA) — Recruitment Agency Licensing' },
      { label: 'Nurse-submitted reviews and direct agency verification' },
    ],
    note: 'Agency information compiled from public business records, official licensing databases, DMW filings, and nurse-submitted reviews. Pricing and timelines are self-reported and independently verified where possible.',
  },
}

export const AGENCY_ATTRIBUTION_DEFAULT = {
  sources: [
    { label: 'Public business registration records' },
    { label: 'Official nursing regulatory body registration databases' },
    { label: 'Recruitment agency licensing authority records' },
    { label: 'Nurse-submitted reviews and direct agency verification' },
  ],
  note: 'Agency information compiled from public business records, official licensing databases, and nurse-submitted reviews. Pricing and timelines are self-reported and independently verified where possible.',
}

export function getAgencyAttribution(sourceCountryName: string) {
  return AGENCY_ATTRIBUTION[sourceCountryName] ?? AGENCY_ATTRIBUTION_DEFAULT
}
