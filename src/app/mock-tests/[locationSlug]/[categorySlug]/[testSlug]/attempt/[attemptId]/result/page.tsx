import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBookmarkStatusForQuestions } from '@/app/actions/bookmarks'
import { ResultClient }      from './_components/ResultClient'

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

export default async function ResultPage({ params }: PageProps) {
  const { locationSlug, categorySlug, testSlug, attemptId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?next=/mock-tests/${locationSlug}/${categorySlug}/${testSlug}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Load attempt
  const { data: attempt } = await db
    .from('mock_test_attempts')
    .select('id, user_id, status, submitted_at, started_at, total_questions, total_marks, obtained_marks, percentage, time_taken_seconds, mock_test_id')
    .eq('id', attemptId)
    .maybeSingle()

  if (!attempt || attempt.user_id !== user.id) notFound()
  if (attempt.status === 'in_progress') {
    redirect(`/mock-tests/${locationSlug}/${categorySlug}/${testSlug}/attempt/${attemptId}`)
  }
  if (attempt.status === 'expired') {
    redirect(`/mock-tests/${locationSlug}/${categorySlug}?expired=1`)
  }

  // Load test + category + location
  const { data: test } = await db
    .from('mock_tests')
    .select('id, name, passing_percentage, duration_minutes, mock_test_categories(id, name, slug, mock_test_locations(name, slug))')
    .eq('id', attempt.mock_test_id)
    .single()
  if (!test) notFound()

  // Load answers with full question detail
  const { data: rawAnswers } = await db
    .from('mock_test_answers')
    .select(`
      question_id, selected_answer, is_correct, marks_awarded,
      mock_test_questions (
        question_text, option_a, option_b, option_c, option_d,
        correct_answer, explanation, learning_notes,
        difficulty, marks, image_url
      )
    `)
    .eq('attempt_id', attemptId)

  // Leaderboard (only if enabled) + bookmarks — load in parallel
  const questionIds = (rawAnswers ?? []).map((a: { question_id: string }) => a.question_id)
  const [leaderboard, bookmarkedIds] = await Promise.all([
    Promise.resolve([]),
    getBookmarkStatusForQuestions(questionIds),
  ])

  const category = test.mock_test_categories
  const location = category?.mock_test_locations
  const userName = user.user_metadata?.full_name
    ?? user.user_metadata?.name
    ?? user.email?.split('@')[0]
    ?? 'User'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const answers = (rawAnswers ?? []).map((a: any) => ({
    question_id:     a.question_id,
    selected_answer: a.selected_answer,
    is_correct:      a.is_correct,
    marks_awarded:   a.marks_awarded ?? 0,
    question: {
      question_text:  a.mock_test_questions?.question_text  ?? '',
      option_a:       a.mock_test_questions?.option_a       ?? '',
      option_b:       a.mock_test_questions?.option_b       ?? '',
      option_c:       a.mock_test_questions?.option_c       ?? '',
      option_d:       a.mock_test_questions?.option_d       ?? '',
      correct_answer: a.mock_test_questions?.correct_answer ?? '',
      explanation:    a.mock_test_questions?.explanation    ?? null,
      learning_notes: a.mock_test_questions?.learning_notes ?? null,
      difficulty:     a.mock_test_questions?.difficulty     ?? 'medium',
      marks:          a.mock_test_questions?.marks          ?? 1,
      image_url:      a.mock_test_questions?.image_url      ?? null,
    },
  }))

  return (
    <ResultClient
      attemptId={attemptId}
      testId={test.id}
      testName={test.name}
      categoryId={category?.id ?? ''}
      categoryName={category?.name ?? categorySlug}
      locationName={location?.name ?? locationSlug}
      locationSlug={locationSlug}
      categorySlug={categorySlug}
      testSlug={testSlug}
      userName={userName}
      userEmail={user.email ?? ''}
      passingPercentage={test.passing_percentage}
      percentage={Number(attempt.percentage ?? 0)}
      totalQuestions={attempt.total_questions}
      obtainedMarks={attempt.obtained_marks}
      totalMarks={attempt.total_marks}
      timeTakenSeconds={attempt.time_taken_seconds ?? 0}
      durationMinutes={test.duration_minutes}
      attemptDate={attempt.submitted_at ?? attempt.started_at}
      answers={answers}
      leaderboard={leaderboard}
      leaderboardEnabled={false}
      initialBookmarks={bookmarkedIds}
    />
  )
}
