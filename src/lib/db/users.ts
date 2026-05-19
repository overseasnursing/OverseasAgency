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
