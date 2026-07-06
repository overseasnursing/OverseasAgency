'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateStreak, checkAchievements } from '@/app/actions/streaks'
import { queueNotification }              from '@/app/actions/notifications'

const ts = () => new Date().toISOString()

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/* ── Save a single answer ───────────────────────────────────────────── */
export async function saveAnswer(
  attemptId:  string,
  questionId: string,
  answer:     'A' | 'B' | 'C' | 'D' | null,
): Promise<{ ok: boolean; error?: string }> {
  const user = await getAuthUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Verify the attempt belongs to this user and is still active
  const { data: attempt } = await db
    .from('mock_test_attempts')
    .select('id, user_id, status, expires_at')
    .eq('id', attemptId)
    .maybeSingle()

  if (!attempt || attempt.user_id !== user.id) return { ok: false, error: 'Not found' }
  if (attempt.status !== 'in_progress')        return { ok: false, error: 'Attempt not active' }
  if (new Date(attempt.expires_at) <= new Date()) return { ok: false, error: 'Time expired' }

  const { error } = await db
    .from('mock_test_answers')
    .update({
      selected_answer: answer,
      answered_at:     answer ? ts() : null,
    })
    .eq('attempt_id',  attemptId)
    .eq('question_id', questionId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/* ── Submit exam ────────────────────────────────────────────────────── */
export async function submitExam(
  attemptId: string,
): Promise<{ ok: boolean; error?: string }> {
  const user = await getAuthUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Load attempt
  const { data: attempt } = await db
    .from('mock_test_attempts')
    .select('id, user_id, status, expires_at, started_at, total_marks')
    .eq('id', attemptId)
    .maybeSingle()

  if (!attempt || attempt.user_id !== user.id) return { ok: false, error: 'Not found' }
  if (attempt.status !== 'in_progress')        return { ok: false, error: 'Already submitted or expired' }

  // Load all answers + correct answers from questions
  const { data: answers } = await db
    .from('mock_test_answers')
    .select(`
      id, question_id, selected_answer,
      mock_test_questions ( correct_answer, marks )
    `)
    .eq('attempt_id', attemptId)

  let obtainedMarks = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const answerUpdates: any[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(answers ?? []).forEach((row: any) => {
    const correctAnswer = row.mock_test_questions?.correct_answer
    const marks         = row.mock_test_questions?.marks ?? 1
    const isCorrect     = row.selected_answer !== null && row.selected_answer === correctAnswer
    const marksAwarded  = isCorrect ? marks : 0
    obtainedMarks += marksAwarded
    answerUpdates.push({
      attempt_id:    attemptId,
      question_id:   row.question_id,
      is_correct:    row.selected_answer !== null ? isCorrect : null,
      marks_awarded: marksAwarded,
    })
  })

  const totalMarks  = attempt.total_marks || 1
  const percentage  = Math.round((obtainedMarks / totalMarks) * 10000) / 100
  const submittedAt = new Date()
  const timeTaken   = Math.floor((submittedAt.getTime() - new Date(attempt.started_at).getTime()) / 1000)

  // Update every answer row with is_correct + marks_awarded in a single round-trip
  if (answerUpdates.length > 0) {
    await db
      .from('mock_test_answers')
      .upsert(answerUpdates, { onConflict: 'attempt_id,question_id' })
  }

  // Finalize attempt
  const { error } = await db
    .from('mock_test_attempts')
    .update({
      status:             'submitted',
      submitted_at:       submittedAt.toISOString(),
      obtained_marks:     obtainedMarks,
      percentage:         percentage,
      time_taken_seconds: timeTaken,
      updated_at:         submittedAt.toISOString(),
    })
    .eq('id', attemptId)

  if (error) return { ok: false, error: error.message }

  // Side effects — non-blocking
  Promise.all([
    updateStreak(user.id),
    checkAchievements(user.id),
    queueNotification(user.id, 'exam_complete', {
      attempt_id:     attemptId,
      percentage,
      obtained_marks: obtainedMarks,
      total_marks:    totalMarks,
    }),
  ]).catch(() => { /* ignore */ })

  return { ok: true }
}
