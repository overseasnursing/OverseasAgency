export type CountryLink = { name: string; href: string }

export function normalizeCountry(country: string): string {
  const c = country.toLowerCase().trim()
  if (c.includes('saudi') || c === 'ksa') return 'saudi-arabia'
  if (c.includes('uae') || c.includes('dubai') || c.includes('emirates') || c.includes('abu dhabi')) return 'uae'
  if (c === 'uk' || c.includes('united kingdom') || c.includes('britain') || c.includes('england')) return 'uk'
  if (c.includes('australia') || c === 'aus') return 'australia'
  if (c.includes('germany') || c === 'de') return 'germany'
  if (c.includes('canada') || c === 'ca') return 'canada'
  if (c.includes('ireland')) return 'ireland'
  if (c.includes('new zealand') || c === 'nz') return 'new-zealand'
  if (c === 'usa' || c.includes('united states') || c.includes('america')) return 'usa'
  if (c.includes('singapore') || c === 'sg') return 'singapore'
  if (c.includes('bahrain')) return 'bahrain'
  if (c.includes('qatar')) return 'qatar'
  if (c.includes('kuwait')) return 'kuwait'
  if (c.includes('oman')) return 'oman'
  return c.replace(/\s+/g, '-')
}
