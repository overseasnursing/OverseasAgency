import { createAdminClient } from '@/lib/supabase/admin'

export async function getEnabledSourceCountries(): Promise<string[]> {
  // country_settings is not yet in the generated Database types (new table) —
  // same `as any` pattern used by every other admin db/action file in this repo.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data, error } = await db
    .from('country_settings')
    .select('source_country')
    .eq('enabled', true)
    .order('source_country')

  if (error) {
    console.error('[country-settings] getEnabledSourceCountries:', error.message)
    return ['India']
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => r.source_country as string)
}

export async function isSourceCountryEnabled(name: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data, error } = await db
    .from('country_settings')
    .select('enabled')
    .eq('source_country', name)
    .maybeSingle()

  if (error) {
    console.error('[country-settings] isSourceCountryEnabled:', error.message)
    return false
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any)?.enabled === true
}
