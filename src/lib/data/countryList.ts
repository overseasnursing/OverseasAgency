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
