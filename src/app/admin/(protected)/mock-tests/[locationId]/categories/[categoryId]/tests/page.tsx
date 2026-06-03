import React from 'react'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { requirePermission, isSuperAdmin } from '@/lib/require-admin'
import { MockTestsClient } from './_components/MockTestsClient'
import { getAttemptCountsForTests } from '@/app/actions/exam-sessions'

export const dynamic = 'force-dynamic'

export default async function MockTestsPage({
  params,
}: {
  params: Promise<{ locationId: string; categoryId: string }>
}) {
  const { locationId, categoryId } = await params
  const admin = await requirePermission('mock-tests')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [
    { data: location, error: locError },
    { data: category, error: catError },
    { data: tests,    error: testError },
  ] = await Promise.all([
    db.from('mock_test_locations').select('id, name').eq('id', locationId).single(),
    db.from('mock_test_categories').select('id, name').eq('id', categoryId).single(),
    db.from('mock_tests')
      .select('id, name, slug, duration_minutes, total_questions, passing_percentage, instructions, seo_title, seo_description, is_active, created_at')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false }),
  ])

  if (locError || !location || catError || !category) notFound()

  const testIds = (tests ?? []).map((t: { id: string }) => t.id)
  const attemptCounts = await getAttemptCountsForTests(testIds)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (tests ?? []).map((t: any) => ({
    id:                 t.id,
    name:               t.name,
    slug:               t.slug,
    duration_minutes:   t.duration_minutes,
    total_questions:    t.total_questions,
    passing_percentage: t.passing_percentage,
    instructions:       t.instructions       ?? '',
    seo_title:          t.seo_title          ?? '',
    seo_description:    t.seo_description    ?? '',
    is_active:          t.is_active,
    created_at:         t.created_at,
    category_id:        categoryId,
    total_attempts:     attemptCounts[t.id]?.total  ?? 0,
    active_attempts:    attemptCounts[t.id]?.active ?? 0,
  }))

  return (
    <MockTestsClient
      location={{ id: location.id, name: location.name }}
      category={{ id: category.id, name: category.name }}
      tests={rows}
      dbError={testError?.message ?? null}
      isSuperAdmin={isSuperAdmin(admin)}
    />
  )
}
