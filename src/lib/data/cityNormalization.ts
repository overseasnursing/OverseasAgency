/**
 * Normalization layer for city names sourced from the `country-state-city`
 * npm package (and any free-text city input). Third-party geo datasets mix
 * official renames, old English names, and administrative district names as
 * if they were all distinct cities — e.g. Karnataka's raw city list contains
 * "Bengaluru", "Bangalore Urban", and "Bangalore Rural" as three separate
 * entries, none of which is the plain "Bangalore" nurses/agencies actually
 * use. Apply this at every write path (so bad data can't be created again)
 * and every read/aggregation path (so legacy data can't produce duplicate
 * pages or filter options).
 */

// Alias → canonical spelling. Only renames — never used to hide a city that
// should stay visible. Extend this list for similar cases (old English names,
// post-independence renames) as they come up.
const CITY_ALIASES: Record<string, string> = {
  'bengaluru':          'Bangalore',
  'bangalore urban':    'Bangalore',
  'bengaluru urban':    'Bangalore',
  'bombay':             'Mumbai',
  'calcutta':           'Kolkata',
  'madras':             'Chennai',
}

// Raw dataset entries that are administrative districts, not cities a user
// would ever pick as "their city" — must never appear as a selectable option
// or a standalone city page.
const EXCLUDED_CITIES = new Set<string>([
  'bangalore rural',
])

function key(name: string): string {
  return name.trim().toLowerCase()
}

/**
 * Renames known aliases to their canonical spelling. Always returns a
 * display string (never removes data) — safe to use on any write path,
 * including free-text form input, where silently dropping a value would be
 * wrong.
 */
export function normalizeCityName(raw: string): string {
  const trimmed = raw.trim()
  return CITY_ALIASES[key(trimmed)] ?? trimmed
}

/**
 * True if this raw name is an administrative district (or similar) that
 * should never be shown as a selectable/visible city.
 */
export function isExcludedCityName(raw: string): boolean {
  return EXCLUDED_CITIES.has(key(raw))
}

/**
 * For building dropdown/city-list options: drops excluded entries, renames
 * aliases to canonical spelling, and de-duplicates (case-insensitive) while
 * preserving first-seen order.
 */
export function normalizeCityList(cities: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of cities) {
    if (isExcludedCityName(raw)) continue
    const canonical = normalizeCityName(raw)
    const k = key(canonical)
    if (seen.has(k)) continue
    seen.add(k)
    result.push(canonical)
  }
  return result
}
