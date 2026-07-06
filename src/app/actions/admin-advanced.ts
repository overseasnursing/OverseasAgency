'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'

const ts = () => new Date().toISOString()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolvePublicPath(db: any, testId: string): Promise<string | null> {
  const { data } = await db
    .from('mock_tests')
    .select('mock_test_categories!inner(slug, mock_test_locations!inner(slug))')
    .eq('id', testId)
    .single()
  if (!data) return null
  const cat = data.mock_test_categories
  return `/mock-tests/${cat.mock_test_locations.slug}/${cat.slug}`
}

/* ── Clone a mock test (copies all questions) ────────────────────────── */
export async function cloneMockTest(
  testId: string,
): Promise<{ newTestId?: string; error?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: test } = await db
    .from('mock_tests')
    .select('*')
    .eq('id', testId)
    .single()
  if (!test) return { error: 'Test not found' }

  const { data: questions } = await db
    .from('mock_test_questions')
    .select('*')
    .eq('mock_test_id', testId)
    .order('sort_order', { ascending: true })

  // Create copy with "(Copy)" suffix
  const slugBase  = test.slug + '-copy'
  const newName   = test.name + ' (Copy)'
  const now       = ts()

  const { data: newTest, error: testErr } = await db
    .from('mock_tests')
    .insert({
      category_id:        test.category_id,
      name:               newName,
      slug:               slugBase + '-' + Date.now(),
      duration_minutes:   test.duration_minutes,
      passing_percentage: test.passing_percentage,
      instructions:       test.instructions,
      seo_title:          '',
      seo_description:    '',
      is_active:          false,  // start inactive
      status:             'draft',
      is_premium:         test.is_premium,
      created_at:         now,
      updated_at:         now,
    })
    .select('id')
    .single()

  if (testErr || !newTest) return { error: testErr?.message ?? 'Clone failed' }

  // Clone questions
  if (questions?.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qRows = questions.map((q: any) => ({
      mock_test_id:       newTest.id,
      question_text:      q.question_text,
      option_a:           q.option_a,
      option_b:           q.option_b,
      option_c:           q.option_c,
      option_d:           q.option_d,
      correct_answer:     q.correct_answer,
      explanation:        q.explanation,
      learning_notes:     q.learning_notes,
      difficulty:         q.difficulty,
      marks:              q.marks,
      image_url:          q.image_url,
      randomize_options:  q.randomize_options,
      is_active:          q.is_active,
      sort_order:         q.sort_order,
      created_at:         now,
      updated_at:         now,
    }))
    await db.from('mock_test_questions').insert(qRows)
  }

  return { newTestId: newTest.id }
}

/* ── Set test status (published / draft / archived) ─────────────────── */
export async function setTestStatus(
  testId: string,
  status: 'published' | 'draft' | 'archived',
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db
    .from('mock_tests')
    .update({
      status,
      is_active:  status === 'published',
      updated_at: ts(),
    })
    .eq('id', testId)

  if (error) return { ok: false, error: error.message }
  const pagePath = await resolvePublicPath(db, testId)
  if (pagePath) revalidatePath(pagePath)
  return { ok: true }
}

/* ── Toggle premium flag ─────────────────────────────────────────────── */
export async function toggleTestPremium(
  testId:     string,
  isPremium:  boolean,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { error } = await db
    .from('mock_tests')
    .update({ is_premium: isPremium, updated_at: ts() })
    .eq('id', testId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/* ── Clone a category (without tests) ───────────────────────────────── */
export async function cloneCategory(
  categoryId: string,
): Promise<{ newCategoryId?: string; error?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { data: cat } = await db
    .from('mock_test_categories')
    .select('*')
    .eq('id', categoryId)
    .single()
  if (!cat) return { error: 'Category not found' }

  const now = ts()
  const { data: newCat, error: catErr } = await db
    .from('mock_test_categories')
    .insert({
      location_id: cat.location_id,
      name:        cat.name + ' (Copy)',
      slug:        cat.slug + '-copy-' + Date.now(),
      description: cat.description,
      is_active:   false,
      created_at:  now,
      updated_at:  now,
    })
    .select('id')
    .single()

  if (catErr || !newCat) return { error: catErr?.message ?? 'Clone failed' }
  return { newCategoryId: newCat.id }
}
