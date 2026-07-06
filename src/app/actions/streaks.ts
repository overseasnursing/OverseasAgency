'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient }      from '@/lib/supabase/server'

export type UserStreak = {
  current_streak:   number
  longest_streak:   number
  last_study_date:  string | null
  total_study_days: number
}

export type Achievement = {
  key:         string
  label:       string
  description: string
  icon:        string
  unlocked_at: string
}

// Every export below takes a userId param but must only ever act on the
// caller's own data — without this check any client could read or mutate
// another user's streak/achievement rows by passing their id directly.
async function assertOwnUser(userId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user && user.id === userId
}

const ACHIEVEMENT_DEFS: Record<string, Omit<Achievement, 'unlocked_at'>> = {
  first_test:       { key: 'first_test',       label: 'First Step',      description: 'Complete your first mock test',          icon: '🎯' },
  five_tests:       { key: 'five_tests',        label: 'Getting Serious', description: 'Complete 5 mock tests',                  icon: '📚' },
  ten_tests:        { key: 'ten_tests',         label: 'Dedicated',       description: 'Complete 10 mock tests',                 icon: '🏅' },
  perfect_score:    { key: 'perfect_score',     label: 'Perfect Score',   description: 'Achieve 100% on any test',               icon: '💯' },
  ninety_plus:      { key: 'ninety_plus',       label: 'Excellence',      description: 'Score 90%+ on any test',                 icon: '🏆' },
  seven_day_streak: { key: 'seven_day_streak',  label: '7-Day Streak',    description: 'Study for 7 consecutive days',           icon: '🔥' },
  thirty_day_streak:{ key: 'thirty_day_streak', label: '30-Day Streak',   description: 'Study for 30 consecutive days',          icon: '⚡' },
  pass_master:      { key: 'pass_master',       label: 'Pass Master',     description: 'Pass 10 mock tests',                     icon: '🎖️' },
  first_bookmark:   { key: 'first_bookmark',    label: 'Note Taker',      description: 'Bookmark your first question',           icon: '🔖' },
}

/* ── Update streak after study activity ─────────────────────────────── */
export async function updateStreak(userId: string): Promise<void> {
  if (!(await assertOwnUser(userId))) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db    = createAdminClient() as any
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  const { data: existing } = await db
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (!existing) {
    await db.from('user_streaks').insert({
      user_id:          userId,
      current_streak:   1,
      longest_streak:   1,
      last_study_date:  today,
      total_study_days: 1,
      updated_at:       new Date().toISOString(),
    })
    return
  }

  if (existing.last_study_date === today) return // already counted today

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const ymd = yesterday.toISOString().slice(0, 10)

  const wasYesterday = existing.last_study_date === ymd
  const newStreak    = wasYesterday ? existing.current_streak + 1 : 1
  const newLongest   = Math.max(newStreak, existing.longest_streak)

  await db.from('user_streaks').update({
    current_streak:   newStreak,
    longest_streak:   newLongest,
    last_study_date:  today,
    total_study_days: existing.total_study_days + 1,
    updated_at:       new Date().toISOString(),
  }).eq('user_id', userId)
}

/* ── Check and unlock achievements ──────────────────────────────────── */
export async function checkAchievements(userId: string): Promise<void> {
  if (!(await assertOwnUser(userId))) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Already unlocked
  const { data: existing } = await db
    .from('user_achievements')
    .select('achievement_key')
    .eq('user_id', userId)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unlocked = new Set((existing ?? []).map((r: any) => r.achievement_key))

  // Load stats in parallel — counts/max instead of pulling every attempt row,
  // since this runs on every exam submission and attempt counts grow unbounded.
  const [
    { count: submittedCount },
    { count: passCount },
    { data: topAttempt },
    { data: streak },
    { data: bookmarks },
  ] = await Promise.all([
    db.from('mock_test_attempts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'submitted'),
    db.from('mock_test_attempts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'submitted').gte('percentage', 60),
    db.from('mock_test_attempts').select('percentage').eq('user_id', userId).eq('status', 'submitted').order('percentage', { ascending: false }).limit(1),
    db.from('user_streaks').select('current_streak').eq('user_id', userId).maybeSingle(),
    db.from('mock_test_bookmarks').select('id').eq('user_id', userId).limit(1),
  ])

  const submitted  = submittedCount ?? 0
  const maxPct     = Number(topAttempt?.[0]?.percentage ?? 0)
  const cs         = streak?.current_streak ?? 0

  const toUnlock: string[] = []
  if (!unlocked.has('first_test')        && submitted >= 1)   toUnlock.push('first_test')
  if (!unlocked.has('five_tests')        && submitted >= 5)   toUnlock.push('five_tests')
  if (!unlocked.has('ten_tests')         && submitted >= 10)  toUnlock.push('ten_tests')
  if (!unlocked.has('perfect_score')     && maxPct >= 100)           toUnlock.push('perfect_score')
  if (!unlocked.has('ninety_plus')       && maxPct >= 90)            toUnlock.push('ninety_plus')
  if (!unlocked.has('seven_day_streak')  && cs >= 7)                 toUnlock.push('seven_day_streak')
  if (!unlocked.has('thirty_day_streak') && cs >= 30)                toUnlock.push('thirty_day_streak')
  if (!unlocked.has('pass_master')       && passCount >= 10)         toUnlock.push('pass_master')
  if (!unlocked.has('first_bookmark')    && (bookmarks?.length ?? 0) >= 1) toUnlock.push('first_bookmark')

  if (toUnlock.length) {
    await db.from('user_achievements').insert(
      toUnlock.map(key => ({
        user_id:         userId,
        achievement_key: key,
        unlocked_at:     new Date().toISOString(),
      }))
    )
  }
}

/* ── Read streak for dashboard ───────────────────────────────────────── */
export async function getUserStreak(userId: string): Promise<UserStreak> {
  if (!(await assertOwnUser(userId))) {
    return { current_streak: 0, longest_streak: 0, last_study_date: null, total_study_days: 0 }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('user_streaks')
    .select('current_streak, longest_streak, last_study_date, total_study_days')
    .eq('user_id', userId)
    .maybeSingle()

  return {
    current_streak:   data?.current_streak   ?? 0,
    longest_streak:   data?.longest_streak   ?? 0,
    last_study_date:  data?.last_study_date  ?? null,
    total_study_days: data?.total_study_days ?? 0,
  }
}

/* ── Read achievements for dashboard ────────────────────────────────── */
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  if (!(await assertOwnUser(userId))) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('user_achievements')
    .select('achievement_key, unlocked_at')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => {
    const def = ACHIEVEMENT_DEFS[r.achievement_key]
    return {
      key:         r.achievement_key,
      label:       def?.label       ?? r.achievement_key,
      description: def?.description ?? '',
      icon:        def?.icon        ?? '🏅',
      unlocked_at: r.unlocked_at,
    }
  })
}

/* ── Auth-internal wrapper for client components ─────────────────────── */
export async function recordStudyActivity(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await Promise.all([
    updateStreak(user.id),
    checkAchievements(user.id),
  ]).catch(() => {})
}

/* ── Get all achievement definitions (for display) ───────────────────── */
export async function getAllAchievementDefs() {
  return Object.values(ACHIEVEMENT_DEFS)
}
