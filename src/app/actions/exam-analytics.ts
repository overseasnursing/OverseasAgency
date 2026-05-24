'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ts = () => new Date().toISOString()

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/* ── Leaderboard ─────────────────────────────────────────────────────── */
export type LeaderboardEntry = {
  rank:              number
  display_name:      string
  percentage:        number
  time_taken_seconds: number
  is_current_user:   boolean
}

export async function getLeaderboard(
  testId:        string,
  currentUserId: string,
): Promise<LeaderboardEntry[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('mock_test_attempts')
    .select('user_id, display_name, percentage, time_taken_seconds')
    .eq('mock_test_id', testId)
    .eq('status', 'submitted')
    .not('percentage', 'is', null)
    .order('percentage', { ascending: false })
    .order('time_taken_seconds', { ascending: true })
    .limit(10)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any, i: number) => ({
    rank:               i + 1,
    display_name:       row.display_name ?? 'Anonymous',
    percentage:         Number(row.percentage ?? 0),
    time_taken_seconds: row.time_taken_seconds ?? 0,
    is_current_user:    row.user_id === currentUserId,
  }))
}

/* ── Retry wrong / skipped questions ────────────────────────────────── */
export async function retryWrongQuestions(
  originalAttemptId: string,
): Promise<{ attemptId?: string; error?: string }> {
  const user = await getAuthUser()
  if (!user) return { error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Load original attempt — must be submitted and owned by this user
  const { data: original } = await db
    .from('mock_test_attempts')
    .select('id, user_id, mock_test_id, status')
    .eq('id', originalAttemptId)
    .maybeSingle()

  if (!original || original.user_id !== user.id) return { error: 'Not found' }
  if (original.status !== 'submitted') return { error: 'Original attempt not yet submitted' }

  // Load wrong + skipped question IDs
  const { data: answers } = await db
    .from('mock_test_answers')
    .select('question_id, is_correct, selected_answer')
    .eq('attempt_id', originalAttemptId)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const retryIds: string[] = (answers ?? [])
    .filter((a: { is_correct: boolean | null; selected_answer: string | null }) =>
      a.is_correct !== true // wrong OR skipped
    )
    .map((a: { question_id: string }) => a.question_id)

  if (!retryIds.length) return { error: 'No wrong or skipped questions to retry — great job!' }

  // Load test metadata
  const { data: test } = await db
    .from('mock_tests')
    .select('id, duration_minutes')
    .eq('id', original.mock_test_id)
    .eq('is_active', true)
    .single()
  if (!test) return { error: 'Test not found' }

  // Load question data for the subset
  const { data: questions } = await db
    .from('mock_test_questions')
    .select('id, marks')
    .in('id', retryIds)
    .eq('is_active', true)
  if (!questions?.length) return { error: 'Questions no longer available' }

  // Expire any existing active attempt for same test
  await db
    .from('mock_test_attempts')
    .update({ status: 'expired', updated_at: ts() })
    .eq('user_id',      user.id)
    .eq('mock_test_id', original.mock_test_id)
    .eq('status',       'in_progress')

  // Fisher-Yates shuffle the subset
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shuffled: any[] = [...questions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const shuffledIds: string[] = shuffled.map(q => q.id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalMarks: number    = shuffled.reduce((s, q: any) => s + (q.marks ?? 1), 0)

  // Proportional duration: wrong_count / total_questions * duration_minutes (min 10m)
  const originalTotal   = (answers ?? []).length || 1
  const proratedMinutes = Math.max(10, Math.round((shuffled.length / originalTotal) * test.duration_minutes))
  const startedAt       = new Date()
  const expiresAt       = new Date(startedAt.getTime() + proratedMinutes * 60_000)

  const displayName = user.user_metadata?.full_name
    ?? user.user_metadata?.name
    ?? user.email?.split('@')[0]
    ?? 'Anonymous'

  const { data: attempt, error: insErr } = await db
    .from('mock_test_attempts')
    .insert({
      user_id:                 user.id,
      mock_test_id:            original.mock_test_id,
      display_name:            displayName,
      started_at:              startedAt.toISOString(),
      expires_at:              expiresAt.toISOString(),
      status:                  'in_progress',
      total_questions:         shuffled.length,
      total_marks:             totalMarks,
      obtained_marks:          0,
      shuffled_question_order: shuffledIds,
      created_at:              startedAt.toISOString(),
      updated_at:              startedAt.toISOString(),
    })
    .select('id')
    .single()

  if (insErr) {
    if (insErr.code === '23505') {
      const { data: race } = await db
        .from('mock_test_attempts')
        .select('id')
        .eq('user_id',      user.id)
        .eq('mock_test_id', original.mock_test_id)
        .eq('status',       'in_progress')
        .maybeSingle()
      if (race) return { attemptId: race.id }
    }
    return { error: insErr.message }
  }

  // Pre-populate blank answer rows
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const answerRows = shuffled.map((q: any) => ({
    attempt_id:      attempt.id,
    question_id:     q.id,
    selected_answer: null,
    is_correct:      null,
    marks_awarded:   0,
    answered_at:     null,
    created_at:      startedAt.toISOString(),
  }))
  await db.from('mock_test_answers').insert(answerRows)

  return { attemptId: attempt.id }
}

/* ── Admin analytics for a single test ──────────────────────────────── */
export type MostFailedQuestion = {
  question_id:   string
  question_text: string
  difficulty:    string
  failure_rate:  number
  total_shown:   number
  wrong_count:   number
}

export type TestAdminAnalytics = {
  total_attempts:    number
  submitted_count:   number
  pass_count:        number
  fail_count:        number
  avg_percentage:    number
  completion_rate:   number
  most_failed:       MostFailedQuestion[]
}

export async function getTestAdminAnalytics(
  testId: string,
): Promise<TestAdminAnalytics> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Load test to get passing_percentage
  const { data: test } = await db
    .from('mock_tests')
    .select('passing_percentage')
    .eq('id', testId)
    .single()

  const passingPct = test?.passing_percentage ?? 60

  // All attempts
  const { data: attempts } = await db
    .from('mock_test_attempts')
    .select('id, status, percentage')
    .eq('mock_test_id', testId)

  const allAttempts  = (attempts ?? []) as { id: string; status: string; percentage: number | null }[]
  const submitted    = allAttempts.filter(a => a.status === 'submitted')
  const passCount    = submitted.filter(a => Number(a.percentage ?? 0) >= passingPct).length
  const avgPct       = submitted.length
    ? submitted.reduce((s, a) => s + Number(a.percentage ?? 0), 0) / submitted.length
    : 0

  // Most failed questions — from submitted attempts only
  const submittedIds = submitted.map(a => a.id)
  let mostFailed: MostFailedQuestion[] = []

  if (submittedIds.length > 0) {
    const { data: answers } = await db
      .from('mock_test_answers')
      .select('question_id, is_correct, mock_test_questions(question_text, difficulty)')
      .in('attempt_id', submittedIds)
      .not('selected_answer', 'is', null) // only answered (not skipped)

    // Group by question_id
    const qMap = new Map<string, { text: string; difficulty: string; total: number; wrong: number }>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(answers ?? []).forEach((row: any) => {
      const qid  = row.question_id
      const text = row.mock_test_questions?.question_text ?? '—'
      const diff = row.mock_test_questions?.difficulty    ?? 'medium'
      if (!qMap.has(qid)) qMap.set(qid, { text, difficulty: diff, total: 0, wrong: 0 })
      const entry = qMap.get(qid)!
      entry.total++
      if (row.is_correct === false) entry.wrong++
    })

    mostFailed = Array.from(qMap.entries())
      .map(([qid, v]) => ({
        question_id:   qid,
        question_text: v.text,
        difficulty:    v.difficulty,
        failure_rate:  v.total > 0 ? v.wrong / v.total : 0,
        total_shown:   v.total,
        wrong_count:   v.wrong,
      }))
      .filter(q => q.failure_rate > 0)
      .sort((a, b) => b.failure_rate - a.failure_rate)
      .slice(0, 10)
  }

  return {
    total_attempts:  allAttempts.length,
    submitted_count: submitted.length,
    pass_count:      passCount,
    fail_count:      submitted.length - passCount,
    avg_percentage:  Math.round(avgPct * 100) / 100,
    completion_rate: allAttempts.length > 0 ? submitted.length / allAttempts.length : 0,
    most_failed:     mostFailed,
  }
}
