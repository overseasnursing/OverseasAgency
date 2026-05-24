'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type StudyRecommendation = {
  testId:       string
  testName:     string
  categoryName: string
  locationSlug: string
  categorySlug: string
  testSlug:     string
  reason:       string
  priority:     'retry' | 'improve' | 'new'
  score?:       number
}

export async function getStudyRecommendations(): Promise<StudyRecommendation[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Get user's submitted attempts (test_id + percentage)
  const { data: attempts } = await db
    .from('mock_test_attempts')
    .select('mock_test_id, percentage')
    .eq('user_id', user.id)
    .eq('status',  'submitted')
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attemptedMap = new Map<string, number>() // testId → best score
  ;(attempts ?? []).forEach((a: { mock_test_id: string; percentage: number }) => {
    const pct = Number(a.percentage ?? 0)
    const cur = attemptedMap.get(a.mock_test_id)
    if (cur === undefined || pct > cur) attemptedMap.set(a.mock_test_id, pct)
  })

  // Get all active published tests
  const { data: allTests } = await db
    .from('mock_tests')
    .select(`
      id, name, slug, passing_percentage, is_premium,
      mock_test_categories ( name, slug, mock_test_locations ( slug ) )
    `)
    .eq('is_active', true)
    .eq('status',    'published')
    .eq('is_premium', false)
    .order('created_at', { ascending: false })
    .limit(100)

  const recs: StudyRecommendation[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(allTests ?? []).forEach((t: any) => {
    const cat  = t.mock_test_categories
    const loc  = cat?.mock_test_locations
    if (!cat || !loc) return

    const bestScore = attemptedMap.get(t.id)

    if (bestScore !== undefined) {
      // Already attempted
      if (bestScore < t.passing_percentage) {
        // Failed → retry recommendation
        recs.push({
          testId:       t.id,
          testName:     t.name,
          categoryName: cat.name,
          locationSlug: loc.slug,
          categorySlug: cat.slug,
          testSlug:     t.slug,
          reason:       `You scored ${bestScore.toFixed(0)}% — retry to pass (${t.passing_percentage}% needed)`,
          priority:     'retry',
          score:        bestScore,
        })
      } else if (bestScore < 90) {
        // Passed but can improve
        recs.push({
          testId:       t.id,
          testName:     t.name,
          categoryName: cat.name,
          locationSlug: loc.slug,
          categorySlug: cat.slug,
          testSlug:     t.slug,
          reason:       `You scored ${bestScore.toFixed(0)}% — aim for 90%+ for Excellent`,
          priority:     'improve',
          score:        bestScore,
        })
      }
    } else {
      // Never attempted
      recs.push({
        testId:       t.id,
        testName:     t.name,
        categoryName: cat.name,
        locationSlug: loc.slug,
        categorySlug: cat.slug,
        testSlug:     t.slug,
        reason:       `Not attempted yet — great practice opportunity`,
        priority:     'new',
      })
    }
  })

  // Sort: retry first, then improve, then new; limit to 6
  const order: Record<string, number> = { retry: 0, improve: 1, new: 2 }
  return recs
    .sort((a, b) => order[a.priority] - order[b.priority])
    .slice(0, 6)
}
