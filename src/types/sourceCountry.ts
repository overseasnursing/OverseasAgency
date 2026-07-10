/**
 * Phase 1 foundation type only. Resolved from the Registry (countryList.ts,
 * facts) merged with Config (country_settings table, admin-editable
 * enablement) — see src/lib/country/resolve.ts.
 */
export type ResolvedSourceCountry = {
  name:           string
  isoCode:        string
  phoneCode:      string
  currencyCode:   string
  currencySymbol: string
  enabled:        boolean
}
