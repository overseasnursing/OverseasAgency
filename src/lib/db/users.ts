import { createClient } from '@/lib/supabase/server'
import type { Tables, InsertDto } from '@/types/database'

export type UserRow = Tables<'users'>

export async function getUserProfile(userId: string): Promise<UserRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[users] getUserProfile:', error.message)
    }
    return null
  }
  return data
}

export async function upsertUserProfile(
  profile: InsertDto<'users'>,
): Promise<UserRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single()
  if (error) {
    console.error('[users] upsertUserProfile:', error.message)
    return null
  }
  return data
}

/**
 * Syncs a logged-in user's source-country choice to their profile.
 * Uses the regular (RLS-respecting) client — the users_update_own policy
 * already allows a user to update their own row, so there's no need to
 * reach for the service-role client here.
 */
export async function updatePreferredSourceCountry(userId: string, name: string): Promise<boolean> {
  const supabase = await createClient()
  // preferred_source_country is not yet in the generated Database types
  // (new column) — same `as any` pattern used elsewhere for this reason.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('users')
    .update({ preferred_source_country: name })
    .eq('id', userId)
  if (error) {
    console.error('[users] updatePreferredSourceCountry:', error.message)
    return false
  }
  return true
}
