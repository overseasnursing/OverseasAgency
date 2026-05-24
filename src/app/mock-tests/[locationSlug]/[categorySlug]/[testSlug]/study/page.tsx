import { redirect, notFound } from 'next/navigation'
import { createClient }        from '@/lib/supabase/server'
import { createAdminClient }   from '@/lib/supabase/admin'
import { getBookmarkStatusForQuestions } from '@/app/actions/bookmarks'
import { StudyEngine }         from './_components/StudyEngine'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{
    locationSlug: string
    categorySlug: string
    testSlug:     string
  }>
}

export default async function StudyModePage({ params }: PageProps) {
  const { locationSlug, categorySlug, testSlug } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/auth/login?next=/mock-tests/${locationSlug}/${categorySlug}/${testSlug}/study`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Load test via category + location slugs
  const { data: location } = await db
    .from('mock_test_locations')
    .select('id, name')
    .eq('slug', locationSlug)
    .single()

  const { data: category } = await db
    .from('mock_test_categories')
    .select('id, name')
    .eq('slug',        categorySlug)
    .eq('location_id', location?.id ?? '')
    .single()

  const { data: test } = await db
    .from('mock_tests')
    .select('id, name, instructions, passing_percentage, duration_minutes')
    .eq('slug',        testSlug)
    .eq('category_id', category?.id ?? '')
    .eq('is_active',   true)
    .single()

  if (!location || !category || !test) notFound()

  // Load active questions in sort order
  const { data: rawQuestions } = await db
    .from('mock_test_questions')
    .select('id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, learning_notes, difficulty, marks, image_url, randomize_options')
    .eq('mock_test_id', test.id)
    .eq('is_active',    true)
    .order('sort_order', { ascending: true })

  if (!rawQuestions?.length) {
    redirect(`/mock-tests/${locationSlug}/${categorySlug}`)
  }

  // Load bookmark status for these questions
  const questionIds   = rawQuestions.map((q: { id: string }) => q.id)
  const bookmarkedIds = await getBookmarkStatusForQuestions(questionIds)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const questions = rawQuestions.map((q: any) => ({
    id:               q.id,
    question_text:    q.question_text,
    option_a:         q.option_a,
    option_b:         q.option_b,
    option_c:         q.option_c,
    option_d:         q.option_d,
    correct_answer:   q.correct_answer,
    explanation:      q.explanation    ?? null,
    learning_notes:   q.learning_notes ?? null,
    difficulty:       q.difficulty     ?? 'medium',
    marks:            q.marks          ?? 1,
    image_url:        q.image_url      ?? null,
    randomize_options: q.randomize_options ?? false,
  }))

  return (
    <StudyEngine
      testName={test.name}
      testId={test.id}
      locationSlug={locationSlug}
      categorySlug={categorySlug}
      testSlug={testSlug}
      questions={questions}
      initialBookmarks={bookmarkedIds}
    />
  )
}
