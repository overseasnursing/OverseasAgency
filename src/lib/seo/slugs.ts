const COUNTRY_NAMES: Record<string, string> = {
  germany: 'Germany',
  uk: 'United Kingdom',
  canada: 'Canada',
  australia: 'Australia',
  dubai: 'Dubai / UAE',
  usa: 'United States',
}

const COUNTRY_FLAGS: Record<string, string> = {
  germany: '🇩🇪',
  uk: '🇬🇧',
  canada: '🇨🇦',
  australia: '🇦🇺',
  dubai: '🇦🇪',
  usa: '🇺🇸',
}

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function slugToTitle(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function countrySlugToName(slug: string): string {
  return COUNTRY_NAMES[slug] ?? slugToTitle(slug)
}

export function countrySlugToFlag(slug: string): string {
  return COUNTRY_FLAGS[slug] ?? '🌍'
}

export function buildCanonical(path: string): string {
  const base = 'https://overseasnursing.com'
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildOgImageUrl(type: string, slug: string): string {
  return `/og/${type}-${slug}.png`
}

export function comparisonSlugToCountries(slug: string): { a: string; b: string } | null {
  const parts = slug.split('-vs-')
  if (parts.length !== 2) return null
  return { a: parts[0], b: parts[1] }
}

export function formatRupees(amount: number, unit: 'L' | 'K' = 'L'): string {
  if (unit === 'L') return `₹${(amount / 100000).toFixed(1)}L`
  return `₹${(amount / 1000).toFixed(0)}K`
}

export function isValidCountrySlug(slug: string): boolean {
  return slug in COUNTRY_NAMES
}

export const ALL_COUNTRY_SLUGS = Object.keys(COUNTRY_NAMES)
