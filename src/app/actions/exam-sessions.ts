'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin }      from '@/lib/require-admin'

const ts = () => new Date().toISOString()

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export type AttemptStatus = 'in_progress' | 'submitted' | 'expired'

/* ── Start or Resume ────────────────────────────────────────────────── */
export async function startExamSession(
  mockTestId: string,
): Promise<{ attemptId?: string; isResume?: boolean; error?: string }> {
  const user = await getAuthUser()
  if (!user) return { error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Check for existing active attempt
  const { data: existing } = await db
    .from('mock_test_attempts')
    .select('id, expires_at')
    .eq('user_id',      user.id)
    .eq('mock_test_id', mockTestId)
    .eq('status',       'in_progress')
    .maybeSingle()

  if (existing) {
    if (new Date(existing.expires_at) > new Date()) {
      return { attemptId: existing.id, isResume: true }
    }
    // Expired — mark and fall through to create a new one
    await db
      .from('mock_test_attempts')
      .update({ status: 'expired', updated_at: ts() })
      .eq('id', existing.id)
  }

  // Load test
  const { data: test } = await db
    .from('mock_tests')
    .select('id, duration_minutes')
    .eq('id',        mockTestId)
    .eq('is_active', true)
    .single()
  if (!test) return { error: 'Test not found or inactive' }

  // Load active questions
  const { data: questions } = await db
    .from('mock_test_questions')
    .select('id, marks')
    .eq('mock_test_id', mockTestId)
    .eq('is_active',    true)
    .order('sort_order', { ascending: true })
  if (!questions?.length) return { error: 'No questions available in this test yet' }

  // Fisher-Yates shuffle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shuffled: any[] = [...questions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const shuffledIds: string[] = shuffled.map(q => q.id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalMarks: number    = shuffled.reduce((s, q: any) => s + (q.marks ?? 1), 0)
  const startedAt             = new Date()
  const expiresAt             = new Date(startedAt.getTime() + test.duration_minutes * 60_000)

  const { data: attempt, error: insErr } = await db
    .from('mock_test_attempts')
    .insert({
      user_id:                 user.id,
      mock_test_id:            mockTestId,
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
    // 23505 = unique_violation → race condition, another request created it first
    if (insErr.code === '23505') {
      const { data: race } = await db
        .from('mock_test_attempts')
        .select('id')
        .eq('user_id',      user.id)
        .eq('mock_test_id', mockTestId)
        .eq('status',       'in_progress')
        .maybeSingle()
      if (race) return { attemptId: race.id, isResume: true }
    }
    return { error: insErr.message }
  }

  // Pre-populate blank answer rows so answers table is ready for Phase 5
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

  return { attemptId: attempt.id, isResume: false }
}

/* ── Validate attempt on the attempt page ───────────────────────────── */
export type AttemptValidation =
  | { valid: true;  attempt: AttemptRow }
  | { valid: false; reason: 'unauthenticated' | 'not_found' | 'unauthorized' | 'expired' | 'submitted' }

export type AttemptRow = {
  id: string
  user_id: string
  mock_test_id: string
  started_at: string
  expires_at: string
  status: AttemptStatus
  total_questions: number
  total_marks: number
  shuffled_question_order: string[]
}

export async function validateAttempt(attemptId: string): Promise<AttemptValidation> {
  const user = await getAuthUser()
  if (!user) return { valid: false, reason: 'unauthenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('mock_test_attempts')
    .select('id, user_id, mock_test_id, started_at, expires_at, status, total_questions, total_marks, shuffled_question_order')
    .eq('id', attemptId)
    .maybeSingle()

  if (!data)                   return { valid: false, reason: 'not_found' }
  if (data.user_id !== user.id) return { valid: false, reason: 'unauthorized' }
  if (data.status === 'submitted') return { valid: false, reason: 'submitted' }

  // Auto-expire if time passed
  if (data.status === 'in_progress' && new Date(data.expires_at) <= new Date()) {
    await db.from('mock_test_attempts')
      .update({ status: 'expired', updated_at: ts() })
      .eq('id', attemptId)
    return { valid: false, reason: 'expired' }
  }

  if (data.status === 'expired') return { valid: false, reason: 'expired' }

  return {
    valid: true,
    attempt: {
      ...data,
      shuffled_question_order: data.shuffled_question_order ?? [],
    },
  }
}

/* ── User attempt history (dashboard) ──────────────────────────────── */
export type UserAttempt = {
  id: string
  status: AttemptStatus
  started_at: string
  expires_at: string
  submitted_at: string | null
  total_questions: number
  total_marks: number
  obtained_marks: number
  percentage: number | null
  test: { id: string; name: string; slug: string; location_slug: string; category_slug: string; passing_percentage: number } | null
}

export async function getUserAttempts(): Promise<UserAttempt[]> {
  const user = await getAuthUser()
  if (!user) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // First auto-expire any overdue in_progress attempts
  await db
    .from('mock_test_attempts')
    .update({ status: 'expired', updated_at: ts() })
    .eq('user_id',  user.id)
    .eq('status',   'in_progress')
    .lt('expires_at', ts())

  const { data } = await db
    .from('mock_test_attempts')
    .select(`
      id, status, started_at, expires_at, submitted_at,
      total_questions, total_marks, obtained_marks, percentage,
      mock_tests (
        id, name, slug, passing_percentage,
        mock_test_categories ( slug, mock_test_locations ( slug ) )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => {
    const t   = row.mock_tests
    const cat = t?.mock_test_categories
    const loc = cat?.mock_test_locations
    return {
      id:              row.id,
      status:          row.status,
      started_at:      row.started_at,
      expires_at:      row.expires_at,
      submitted_at:    row.submitted_at,
      total_questions: row.total_questions,
      total_marks:     row.total_marks,
      obtained_marks:  row.obtained_marks,
      percentage:      row.percentage,
      test: t ? {
        id:                 t.id,
        name:               t.name,
        slug:               t.slug,
        passing_percentage: t.passing_percentage,
        location_slug:      loc?.slug ?? '',
        category_slug:      cat?.slug ?? '',
      } : null,
    }
  })
}

/* ── Admin: attempt counts per test (used in admin tests page) ──────── */
export async function getAttemptCountsForTests(
  testIds: string[],
): Promise<Record<string, { total: number; active: number }>> {
  if (!testIds.length) return {}
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('mock_test_attempts')
    .select('mock_test_id, status')
    .in('mock_test_id', testIds)

  const out: Record<string, { total: number; active: number }> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(data ?? []).forEach((row: any) => {
    out[row.mock_test_id] ??= { total: 0, active: 0 }
    out[row.mock_test_id].total++
    if (row.status === 'in_progress') out[row.mock_test_id].active++
  })
  return out
}
