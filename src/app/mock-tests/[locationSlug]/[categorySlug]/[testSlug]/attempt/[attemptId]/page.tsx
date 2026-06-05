import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createAdminClient }   from '@/lib/supabase/admin'
import { validateAttempt }     from '@/app/actions/exam-sessions'
import { ExamEngine }          from './_components/ExamEngine'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

type PageProps = {
  params: Promise<{
    locationSlug: string
    categorySlug: string
    testSlug:     string
    attemptId:    string
  }>
}

export type ExamQuestion = {
  id:               string
  question_text:    string
  option_a:         string
  option_b:         string
  option_c:         string
  option_d:         string
  correct_answer:   string // only used client-side after submit
  explanation:      string | null
  image_url:        string | null
  marks:            number
  difficulty:       string
  randomize_options: boolean
  // filled in from answers table
  selected_answer:  'A' | 'B' | 'C' | 'D' | null
}

export default async function AttemptPage({ params }: PageProps) {
  const { locationSlug, categorySlug, testSlug, attemptId } = await params

  const result = await validateAttempt(attemptId)

  if (!result.valid) {
    switch (result.reason) {
      case 'unauthenticated':
        redirect(`/auth/login?next=/mock-tests/${locationSlug}/${categorySlug}/${testSlug}`)
      case 'unauthorized':
      case 'not_found':
        notFound()
      case 'submitted':
        redirect(`/mock-tests/${locationSlug}/${categorySlug}/${testSlug}/attempt/${attemptId}/result`)
      case 'expired':
        redirect(`/mock-tests/${locationSlug}/${categorySlug}?expired=1`)
    }
  }

  const { attempt } = result
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Load test metadata + category + location
  const { data: test } = await db
    .from('mock_tests')
    .select(`
      id, name, duration_minutes, total_questions, passing_percentage, instructions,
      mock_test_categories ( name, slug, mock_test_locations ( name, slug ) )
    `)
    .eq('id', attempt.mock_test_id)
    .single()

  if (!test) notFound()

  // Load all active questions for this test
  const { data: rawQuestions } = await db
    .from('mock_test_questions')
    .select('id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, image_url, marks, difficulty, randomize_options')
    .eq('mock_test_id', attempt.mock_test_id)
    .eq('is_active', true)

  // Build a map from questionId → question data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const questionMap = new Map<string, any>()
  ;(rawQuestions ?? []).forEach((q: { id: string }) => questionMap.set(q.id, q))

  // Load existing answers for this attempt
  const { data: rawAnswers } = await db
    .from('mock_test_answers')
    .select('question_id, selected_answer')
    .eq('attempt_id', attemptId)

  const answerMap = new Map<string, 'A' | 'B' | 'C' | 'D' | null>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(rawAnswers ?? []).forEach((a: any) => answerMap.set(a.question_id, a.selected_answer))

  // Reorder questions according to shuffled_question_order stored in attempt
  const shuffledOrder: string[] = attempt.shuffled_question_order ?? []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function mapQuestion(q: any): ExamQuestion {
    return {
      id:                q.id,
      question_text:     q.question_text,
      option_a:          q.option_a,
      option_b:          q.option_b,
      option_c:          q.option_c,
      option_d:          q.option_d,
      correct_answer:    q.correct_answer,
      explanation:       q.explanation    ?? null,
      image_url:         q.image_url      ?? null,
      marks:             q.marks          ?? 1,
      difficulty:        q.difficulty     ?? 'medium',
      randomize_options: q.randomize_options ?? false,
      selected_answer:   answerMap.get(q.id) ?? null,
    }
  }

  // Use shuffled order if available; fall back to sort_order from rawQuestions
  const questions: ExamQuestion[] = shuffledOrder.length > 0 && shuffledOrder.some(id => questionMap.has(id))
    ? shuffledOrder.filter(id => questionMap.has(id)).map(id => mapQuestion(questionMap.get(id)))
    : (rawQuestions ?? []).map(mapQuestion)

  const category = test.mock_test_categories
  const location = category?.mock_test_locations

  return (
    <ExamEngine
      attemptId={attemptId}
      expiresAt={attempt.expires_at}
      testName={test.name}
      passingPercentage={test.passing_percentage}
      totalMarks={attempt.total_marks}
      questions={questions}
      locationSlug={locationSlug}
      categorySlug={categorySlug}
      testSlug={testSlug}
      locationName={location?.name ?? locationSlug}
      categoryName={category?.name ?? categorySlug}
    />
  )
}
