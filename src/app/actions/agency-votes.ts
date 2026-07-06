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

  // Fetch updated counts (count-only, no row payload)
  const { thumbsUp, thumbsDown } = await getVoteCounts(db, agencyId)

  revalidatePath(`/agency/${agencySlug}`)

  return { success: true, thumbsUp, thumbsDown, userVote: vote }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getVoteCounts(db: any, agencyId: string) {
  const [up, down] = await Promise.all([
    db.from('agency_votes').select('*', { count: 'exact', head: true }).eq('agency_id', agencyId).eq('vote', true),
    db.from('agency_votes').select('*', { count: 'exact', head: true }).eq('agency_id', agencyId).eq('vote', false),
  ])
  return { thumbsUp: up.count ?? 0, thumbsDown: down.count ?? 0 }
}

export async function removeVote(agencyId: string, agencySlug: string): Promise<VoteResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'login_required' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  await db.from('agency_votes').delete().eq('agency_id', agencyId).eq('user_id', user.id)

  const { thumbsUp, thumbsDown } = await getVoteCounts(db, agencyId)

  revalidatePath(`/agency/${agencySlug}`)

  return { success: true, thumbsUp, thumbsDown, userVote: null }
}
