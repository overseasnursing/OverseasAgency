'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'

const now = () => new Date().toISOString()

/* ── Types ───────────────────────────────────────────────────────────── */

export type QuestionInput = {
  id?: string
  mock_test_id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
  explanation: string
  explanation_image_url: string
  learning_notes: string
  difficulty: 'easy' | 'medium' | 'hard'
  marks: number
  image_url: string
  randomize_options: boolean
  is_active: boolean
  sort_order?: number
}

export type BulkQuestionRow = {
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  marks: number
}

/* ── Question Image Upload ───────────────────────────────────────────── */

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
}

export async function uploadQuestionImage(
  formData: FormData,
  type: 'question' | 'explanation',
): Promise<{ url?: string; error?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db   = createAdminClient() as any
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'No file provided' }
  if (file.size > 5 * 1024 * 1024) return { error: 'File must be under 5 MB' }
  const ext = ALLOWED_MIME[file.type]
  if (!ext) return { error: 'Only JPEG, PNG or WebP allowed' }
  const path = `questions/${type}s/${Date.now()}.${ext}`
  const { error } = await db.storage
    .from('mock-test-assets')
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: true })
  if (error) return { error: error.message }
  const { data } = db.storage.from('mock-test-assets').getPublicUrl(path)
  return { url: data.publicUrl }
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function revalidate(mockTestId: string) {
  revalidatePath(`/admin/mock-tests`)
  revalidatePath(`/admin/mock-tests/${mockTestId}`)
}

/* ── Question CRUD ───────────────────────────────────────────────────── */

export async function saveQuestion(
  data: QuestionInput,
): Promise<{ error: string | null; id?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const row = {
    mock_test_id:          data.mock_test_id,
    question_text:         data.question_text.trim(),
    option_a:              data.option_a.trim(),
    option_b:              data.option_b.trim(),
    option_c:              data.option_c.trim(),
    option_d:              data.option_d.trim(),
    correct_answer:        data.correct_answer,
    explanation:           data.explanation           || null,
    explanation_image_url: data.explanation_image_url || null,
    learning_notes:        data.learning_notes        || null,
    difficulty:            data.difficulty,
    marks:                 data.marks,
    image_url:             data.image_url             || null,
    randomize_options:     data.randomize_options,
    is_active:             data.is_active,
    updated_at:            now(),
  }

  if (data.id) {
    const { error } = await db.from('mock_test_questions').update(row).eq('id', data.id)
    if (error) return { error: error.message }
    revalidate(data.mock_test_id)
    return { error: null, id: data.id }
  }

  // Get next sort_order
  const { data: last } = await db
    .from('mock_test_questions')
    .select('sort_order')
    .eq('mock_test_id', data.mock_test_id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const sortOrder = (last?.sort_order ?? -1) + 1
  const { data: r, error } = await db
    .from('mock_test_questions')
    .insert({ ...row, sort_order: sortOrder })
    .select('id')
    .single()
  if (error) return { error: error.message }
  revalidate(data.mock_test_id)
  return { error: null, id: r.id }
}

export async function deleteQuestion(
  id: string,
  mockTestId: string,
): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('mock_test_questions').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate(mockTestId)
  return { error: null }
}

export async function duplicateQuestion(
  id: string,
  mockTestId: string,
): Promise<{ error: string | null; id?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: src, error: fetchErr } = await db
    .from('mock_test_questions')
    .select('*')
    .eq('id', id)
    .single()
  if (fetchErr || !src) return { error: fetchErr?.message ?? 'Not found' }

  const { data: last } = await db
    .from('mock_test_questions')
    .select('sort_order')
    .eq('mock_test_id', mockTestId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, created_at: _c, updated_at: _u, ...rest } = src
  const { data: r, error } = await db
    .from('mock_test_questions')
    .insert({ ...rest, question_text: `${src.question_text} (Copy)`, sort_order: (last?.sort_order ?? 0) + 1, created_at: now(), updated_at: now() })
    .select('id')
    .single()
  if (error) return { error: error.message }
  revalidate(mockTestId)
  return { error: null, id: r.id }
}

export async function toggleQuestionStatus(
  id: string,
  is_active: boolean,
  mockTestId: string,
): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db
    .from('mock_test_questions')
    .update({ is_active, updated_at: now() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidate(mockTestId)
  return { error: null }
}

export async function reorderQuestions(
  items: { id: string; sort_order: number }[],
  mockTestId: string,
): Promise<{ error: string | null }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db
    .from('mock_test_questions')
    .upsert(items.map(i => ({ id: i.id, sort_order: i.sort_order, updated_at: now() })))
  if (error) return { error: error.message }
  revalidate(mockTestId)
  return { error: null }
}

export async function deleteMultipleQuestions(
  ids: string[],
  mockTestId: string,
): Promise<{ error: string | null; deleted: number }> {
  await requireAdmin()
  if (!ids.length) return { error: null, deleted: 0 }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db.from('mock_test_questions').delete().in('id', ids)
  if (error) return { error: error.message, deleted: 0 }
  revalidate(mockTestId)
  return { error: null, deleted: ids.length }
}

export async function bulkImportQuestions(
  questions: BulkQuestionRow[],
  mockTestId: string,
): Promise<{ error: string | null; imported: number }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: last } = await db
    .from('mock_test_questions')
    .select('sort_order')
    .eq('mock_test_id', mockTestId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  let nextSort = (last?.sort_order ?? -1) + 1

  const rows = questions.map(q => ({
    mock_test_id:   mockTestId,
    question_text:  q.question_text.trim(),
    option_a:       q.option_a.trim(),
    option_b:       q.option_b.trim(),
    option_c:       q.option_c.trim(),
    option_d:       q.option_d.trim(),
    correct_answer: q.correct_answer,
    explanation:    q.explanation || null,
    difficulty:     q.difficulty,
    marks:          q.marks,
    is_active:      true,
    sort_order:     nextSort++,
    created_at:     now(),
    updated_at:     now(),
  }))

  const { error } = await db.from('mock_test_questions').insert(rows)
  if (error) return { error: error.message, imported: 0 }
  revalidate(mockTestId)
  return { error: null, imported: rows.length }
}
