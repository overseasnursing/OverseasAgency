import { Country, State, City } from 'country-state-city'

export type LocationOption = {
  label: string
  value: string // ISO code — used internally for cascading, not stored in DB
}

export const INDIA_ISO = 'IN'

export function getAllCountries(): LocationOption[] {
  return Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
  }))
}

export function getStatesOfCountry(countryIso: string): LocationOption[] {
  return State.getStatesOfCountry(countryIso).map((s) => ({
    label: s.name,
    value: s.isoCode,
  }))
}

export function getCitiesOfState(countryIso: string, stateIso: string): LocationOption[] {
  return City.getCitiesOfState(countryIso, stateIso).map((c) => ({
    label: c.name,
    value: c.name,
  }))
}

/**
 * Maps our COUNTRY_FORM_OPTIONS display names to ISO codes.
 * Needed because some of our labels differ from the package's canonical names.
 */
const COUNTRY_LABEL_TO_ISO: Record<string, string> = {
  'UAE (Dubai)':    'AE',
  'UAE':            'AE',
  'USA':            'US',
  'UK':             'GB',
  'United Kingdom': 'GB',
}

/** Map a country display name → ISO code (case-insensitive, handles our label aliases) */
export function findCountryIso(name: string): string | null {
  if (!name) return null
  if (COUNTRY_LABEL_TO_ISO[name]) return COUNTRY_LABEL_TO_ISO[name]
  const lower = name.toLowerCase()
  return Country.getAllCountries().find((c) => c.name.toLowerCase() === lower)?.isoCode ?? null
}

/** Map a state display name → ISO code within a country (case-insensitive) */
export function findStateIso(countryIso: string, stateName: string): string | null {
  if (!stateName) return null
  const lower = stateName.toLowerCase()
  return State.getStatesOfCountry(countryIso).find((s) => s.name.toLowerCase() === lower)?.isoCode ?? null
}
