'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'

export type GuideAuthor = {
  name: string
  credentials: string
  linkedin: string
}

export type GuideReviewer = {
  name: string
  title: string
  experience: string
  license: string
}

export type GuideFaq = { q: string; a: string }
export type GuideLink = { label: string; href: string }

export type GuideInput = {
  category_id: string
  body: string
  last_updated: string
  published_date: string
  modified_date: string
  author: GuideAuthor
  reviewer: GuideReviewer
  faqs: GuideFaq[]
  related_links: GuideLink[]
}

export async function saveGuideContent(
  input: GuideInput,
  locationId: string,
  categorySlug: string,
): Promise<{ error?: string }> {
  try {
    await requireAdmin()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createAdminClient() as any

    const { error } = await db
      .from('mock_test_category_guides')
      .upsert(
        {
          category_id:    input.category_id,
          body:           input.body,
          last_updated:   input.last_updated   || null,
          published_date: input.published_date || null,
          modified_date:  input.modified_date  || null,
          author:         input.author,
          reviewer:       input.reviewer,
          faqs:           input.faqs,
          related_links:  input.related_links,
          updated_at:     new Date().toISOString(),
        },
        { onConflict: 'category_id' },
      )

    if (error) return { error: error.message }

    revalidatePath(`/mock-tests`)
    revalidatePath(`/admin/mock-tests/${locationId}/categories`)
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Save failed' }
  }
}

export async function loadGuideContent(
  categoryId: string,
): Promise<GuideInput | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createAdminClient() as any
    const { data, error } = await db
      .from('mock_test_category_guides')
      .select('*')
      .eq('category_id', categoryId)
      .single()

    if (error || !data) return null
    return {
      category_id:    data.category_id,
      body:           data.body           ?? '',
      last_updated:   data.last_updated   ?? '',
      published_date: data.published_date ?? '',
      modified_date:  data.modified_date  ?? '',
      author:         data.author         ?? { name: '', credentials: '', linkedin: '' },
      reviewer:       data.reviewer       ?? { name: '', title: '', experience: '', license: '' },
      faqs:           data.faqs           ?? [],
      related_links:  data.related_links  ?? [],
    }
  } catch {
    return null
  }
}
