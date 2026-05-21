import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type VoteCounts = {
  thumbsUp: number
  thumbsDown: number
  userVote: boolean | null // true = up, false = down, null = no vote
  isLoggedIn: boolean
}

export async function getVoteCounts(agencyId: string): Promise<VoteCounts> {
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (db as any)
    .from('agency_votes')
    .select('vote')
    .eq('agency_id', agencyId)

  if (error || !data) return { thumbsUp: 0, thumbsDown: 0, userVote: null, isLoggedIn: false }

  const thumbsUp   = data.filter((r: { vote: boolean }) => r.vote === true).length
  const thumbsDown = data.filter((r: { vote: boolean }) => r.vote === false).length
  return { thumbsUp, thumbsDown, userVote: null, isLoggedIn: false }
}

export async function getVoteCountsWithUserVote(agencyId: string): Promise<VoteCounts> {
  const [db, supabase] = await Promise.all([
    Promise.resolve(createAdminClient()),
    createClient(),
  ])

  const { data: { user } } = await supabase.auth.getUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (db as any)
    .from('agency_votes')
    .select('vote, user_id')
    .eq('agency_id', agencyId)

  if (error || !data) return { thumbsUp: 0, thumbsDown: 0, userVote: null, isLoggedIn: !!user }

  const thumbsUp   = data.filter((r: { vote: boolean }) => r.vote === true).length
  const thumbsDown = data.filter((r: { vote: boolean }) => r.vote === false).length

  let userVote: boolean | null = null
  if (user) {
    const mine = data.find((r: { vote: boolean; user_id: string }) => r.user_id === user.id)
    if (mine) userVote = mine.vote
  }

  return { thumbsUp, thumbsDown, userVote, isLoggedIn: !!user }
}
