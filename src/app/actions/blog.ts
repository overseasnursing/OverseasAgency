'use server'

import { getPublishedBlogPosts } from '@/lib/db/blogs'
import { rankBySourceCountry } from '@/lib/recommendations/rank'

export type RelatedBlogPost = {
  slug:            string
  title:           string
  cover_image_url: string | null
  published_at:    string | null
}

/**
 * Client-callable wrapper for the blog post detail page's "Related
 * Articles" widget (see RelatedArticles.tsx) — reuses the exact same
 * getPublishedBlogPosts() + tag-overlap filter the page already computes
 * server-side for its default/global set, then additionally ranks by the
 * visitor's resolved source country via the shared recommendation layer.
 * Falls back to global (untagged) posts automatically — see rankBySourceCountry.
 */
export async function getRelatedBlogPosts(
  excludeSlug: string,
  tags: string[],
  sourceCountry: string,
  limit = 3,
): Promise<RelatedBlogPost[]> {
  const allPosts = await getPublishedBlogPosts()
  const candidates = allPosts.filter(
    p => p.slug !== excludeSlug && p.tags?.some(t => tags.includes(t)),
  )
  return rankBySourceCountry(
    candidates.map(p => ({
      slug:            p.slug,
      title:           p.title,
      cover_image_url: p.cover_image_url,
      published_at:    p.published_at,
      sourceCountry:   p.source_country,
    })),
    sourceCountry,
    limit,
  )
}
