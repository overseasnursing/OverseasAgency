import { createAdminClient } from '@/lib/supabase/admin'

export type VoteCounts = {
  thumbsUp: number
  thumbsDown: number
  userVote: boolean | null // true = up, false = down, null = no vote
  isLoggedIn: boolean
}

// Counts are computed by Postgres (count: 'exact', head: true — no row data
// transferred) instead of fetching every vote row and counting in JS, which
// scaled worst on exactly the most-voted (= most-viewed) agencies.
async function countVotes(agencyId: string): Promise<{ thumbsUp: number; thumbsDown: number }> {
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ count: thumbsUp }, { count: thumbsDown }] = await Promise.all([
    (db as any).from('agency_votes').select('*', { count: 'exact', head: true }).eq('agency_id', agencyId).eq('vote', true),
    (db as any).from('agency_votes').select('*', { count: 'exact', head: true }).eq('agency_id', agencyId).eq('vote', false),
  ])
  return { thumbsUp: thumbsUp ?? 0, thumbsDown: thumbsDown ?? 0 }
}

export async function getVoteCounts(agencyId: string): Promise<VoteCounts> {
  const { thumbsUp, thumbsDown } = await countVotes(agencyId)
  return { thumbsUp, thumbsDown, userVote: null, isLoggedIn: false }
}

