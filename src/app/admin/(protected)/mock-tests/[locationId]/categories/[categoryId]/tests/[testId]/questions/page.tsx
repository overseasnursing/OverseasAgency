import React from 'react'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { QuestionsClient } from './_components/QuestionsClient'

export const dynamic = 'force-dynamic'

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ locationId: string; categoryId: string; testId: string }>
}) {
  const { locationId, categoryId, testId } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [
    { data: location },
    { data: category },
    { data: test, error: testError },
    { data: questions, error: qError },
  ] = await Promise.all([
    db.from('mock_test_locations').select('id, name').eq('id', locationId).single(),
    db.from('mock_test_categories').select('id, name').eq('id', categoryId).single(),
    db.from('mock_tests')
      .select('id, name, slug, duration_minutes, total_questions, passing_percentage')
      .eq('id', testId)
      .single(),
    db.from('mock_test_questions')
      .select('*')
      .eq('mock_test_id', testId)
      .order('sort_order', { ascending: true }),
  ])

  if (testError || !test || !location || !category) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (questions ?? []).map((q: any) => ({
    id:                    q.id,
    mock_test_id:          testId,
    question_text:         q.question_text,
    option_a:              q.option_a,
    option_b:              q.option_b,
    option_c:              q.option_c,
    option_d:              q.option_d,
    correct_answer:        q.correct_answer as 'A' | 'B' | 'C' | 'D',
    explanation:           q.explanation           ?? '',
    explanation_image_url: q.explanation_image_url ?? '',
    learning_notes:        q.learning_notes        ?? '',
    difficulty:            q.difficulty as 'easy' | 'medium' | 'hard',
    marks:                 q.marks,
    image_url:             q.image_url             ?? '',
    randomize_options:     q.randomize_options     ?? false,
    is_active:             q.is_active,
    sort_order:            q.sort_order,
    created_at:            q.created_at,
  }))

  const totalMarks = rows.reduce((s: number, q: { marks: number }) => s + q.marks, 0)
  const difficultyStats = {
    easy:   rows.filter((q: { difficulty: string }) => q.difficulty === 'easy').length,
    medium: rows.filter((q: { difficulty: string }) => q.difficulty === 'medium').length,
    hard:   rows.filter((q: { difficulty: string }) => q.difficulty === 'hard').length,
  }

  return (
    <QuestionsClient
      location={{ id: location.id, name: location.name }}
      category={{ id: category.id, name: category.name }}
      test={{
        id:                 test.id,
        name:               test.name,
        duration_minutes:   test.duration_minutes,
        total_questions:    test.total_questions,
        passing_percentage: test.passing_percentage,
      }}
      questions={rows}
      totalMarks={totalMarks}
      difficultyStats={difficultyStats}
      dbError={qError?.message ?? null}
    />
  )
}
