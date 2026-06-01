import { createAdminClient } from '@/lib/supabase/admin'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type FaqItem  = { q: string; a: string }
export type LinkItem = { label: string; href: string }

export type MockTestAuthor = {
  name: string
  credentials: string
  linkedin?: string
}

export type MockTestReviewer = {
  name: string
  title: string
  experience: string
  license?: string
}

export type MockTestContentMeta = {
  lastUpdated?: string
  publishedDate?: string
  modifiedDate?: string
  author?: MockTestAuthor
  reviewer?: MockTestReviewer
  faqs?: FaqItem[]
  relatedLinks?: LinkItem[]
}

export type MockTestContent = {
  meta: MockTestContentMeta
  body: string
}

/** DB row → MockTestContent */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToContent(data: any): MockTestContent {
  return {
    body: data.body ?? '',
    meta: {
      lastUpdated:   data.last_updated   ?? undefined,
      publishedDate: data.published_date ?? undefined,
      modifiedDate:  data.modified_date  ?? undefined,
      author:        data.author         ?? undefined,
      reviewer:      data.reviewer       ?? undefined,
      faqs:          Array.isArray(data.faqs)          ? data.faqs          : [],
      relatedLinks:  Array.isArray(data.related_links) ? data.related_links : [],
    },
  }
}

/** File fallback: reads src/content/mock-tests/{slug}.md */
function readFromFile(categorySlug: string): MockTestContent | null {
  try {
    const filePath = path.join(process.cwd(), 'src/content/mock-tests', `${categorySlug}.md`)
    if (!fs.existsSync(filePath)) return null
    const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'))
    const meta = data as MockTestContentMeta
    return { meta, body: content.trim() }
  } catch {
    return null
  }
}

/**
 * Load guide content for a category.
 * DB takes priority over file. File is the legacy fallback.
 * Pass both categoryId (for DB) and categorySlug (for file fallback).
 * Server-only — uses admin client and Node.js fs.
 */
export async function getMockTestContent(
  categoryId: string,
  categorySlug: string,
): Promise<MockTestContent | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createAdminClient() as any
    const { data, error } = await db
      .from('mock_test_category_guides')
      .select('*')
      .eq('category_id', categoryId)
      .maybeSingle()

    if (!error && data && (data.body || data.faqs?.length)) {
      return rowToContent(data)
    }
  } catch {
    // fall through to file
  }

  return readFromFile(categorySlug)
}
