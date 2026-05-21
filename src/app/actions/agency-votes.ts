'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export type VoteResult =
  | { success: true; thumbsUp: number; thumbsDown: number; userVote: boolean | null }
  | { success: false; error: string }

export async function submitVote(agencyId: string, agencySlug: string, vote: boolean): Promise<VoteResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'login_required' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Upsert — if user already voted, update; otherwise insert
  const { error } = await db
    .from('agency_votes')
    .upsert(
      { agency_id: agencyId, user_id: user.id, vote, updated_at: new Date().toISOString() },
      { onConflict: 'agency_id,user_id' },
    )

  if (error) return { success: false, error: error.message }

  // Fetch updated counts
  const { data } = await db
    .from('agency_votes')
    .select('vote')
    .eq('agency_id', agencyId)

  const thumbsUp   = (data ?? []).filter((r: { vote: boolean }) => r.vote === true).length
  const thumbsDown = (data ?? []).filter((r: { vote: boolean }) => r.vote === false).length

  revalidatePath(`/agency/${agencySlug}`)

  return { success: true, thumbsUp, thumbsDown, userVote: vote }
}

export async function removeVote(agencyId: string, agencySlug: string): Promise<VoteResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'login_required' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  await db.from('agency_votes').delete().eq('agency_id', agencyId).eq('user_id', user.id)

  const { data } = await db.from('agency_votes').select('vote').eq('agency_id', agencyId)
  const thumbsUp   = (data ?? []).filter((r: { vote: boolean }) => r.vote === true).length
  const thumbsDown = (data ?? []).filter((r: { vote: boolean }) => r.vote === false).length

  revalidatePath(`/agency/${agencySlug}`)

  return { success: true, thumbsUp, thumbsDown, userVote: null }
}
