'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export type BookmarkedQuestion = {
  id:             string
  question_id:    string
  created_at:     string
  question: {
    question_text:  string
    option_a:       string
    option_b:       string
    option_c:       string
    option_d:       string
    correct_answer: string
    explanation:    string | null
    learning_notes: string | null
    difficulty:     string
    marks:          number
    image_url:      string | null
    mock_test_id:   string
    mock_test_name: string
  }
}

/* ── Toggle bookmark on/off ─────────────────────────────────────────── */
export async function toggleBookmark(
  questionId: string,
): Promise<{ bookmarked: boolean; error?: string }> {
  const user = await getAuthUser()
  if (!user) return { bookmarked: false, error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: existing } = await db
    .from('mock_test_bookmarks')
    .select('id')
    .eq('user_id',     user.id)
    .eq('question_id', questionId)
    .maybeSingle()

  if (existing) {
    await db.from('mock_test_bookmarks').delete().eq('id', existing.id)
    return { bookmarked: false }
  }

  const { error } = await db.from('mock_test_bookmarks').insert({
    user_id:     user.id,
    question_id: questionId,
  })
  if (error) return { bookmarked: false, error: error.message }
  return { bookmarked: true }
}

/* ── Get all bookmarked question IDs for current user ───────────────── */
export async function getBookmarkedIds(): Promise<string[]> {
  const user = await getAuthUser()
  if (!user) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('mock_test_bookmarks')
    .select('question_id')
    .eq('user_id', user.id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => r.question_id)
}

/* ── Get bookmarked IDs filtered to a list of question IDs ─────────── */
export async function getBookmarkStatusForQuestions(questionIds: string[]): Promise<string[]> {
  if (!questionIds.length) return []
  const user = await getAuthUser()
  if (!user) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('mock_test_bookmarks')
    .select('question_id')
    .eq('user_id', user.id)
    .in('question_id', questionIds)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => r.question_id)
}

/* ── Get full bookmarked question data (for dashboard) ──────────────── */
export async function getUserBookmarks(): Promise<BookmarkedQuestion[]> {
  const user = await getAuthUser()
  if (!user) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('mock_test_bookmarks')
    .select(`
      id, question_id, created_at,
      mock_test_questions (
        question_text, option_a, option_b, option_c, option_d,
        correct_answer, explanation, learning_notes, difficulty, marks, image_url,
        mock_test_id,
        mock_tests ( name )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(200)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => {
    const q  = row.mock_test_questions
    const mt = q?.mock_tests
    return {
      id:          row.id,
      question_id: row.question_id,
      created_at:  row.created_at,
      question: {
        question_text:  q?.question_text  ?? '',
        option_a:       q?.option_a       ?? '',
        option_b:       q?.option_b       ?? '',
        option_c:       q?.option_c       ?? '',
        option_d:       q?.option_d       ?? '',
        correct_answer: q?.correct_answer ?? '',
        explanation:    q?.explanation    ?? null,
        learning_notes: q?.learning_notes ?? null,
        difficulty:     q?.difficulty     ?? 'medium',
        marks:          q?.marks          ?? 1,
        image_url:      q?.image_url      ?? null,
        mock_test_id:   q?.mock_test_id   ?? '',
        mock_test_name: mt?.name          ?? 'Unknown Test',
      },
    }
  })
}
