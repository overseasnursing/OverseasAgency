'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSourceCountry } from '@/lib/country/context'
import { getRelatedBlogPosts, type RelatedBlogPost } from '@/app/actions/blog'

/**
 * The blog post detail page's "Related Articles" section. The initial list
 * (server-computed by tag overlap, identical for every visitor and every
 * crawler) is what ships in the static HTML — this component never changes
 * that on first paint, keeping /blog/[slug] fully static. Only after mount,
 * once the visitor's Market Context resolves, does it re-rank toward that
 * country's content via the shared recommendation layer — falling back to
 * the original global set if nothing country-specific exists.
 */
export function RelatedArticles({
  initialPosts,
  excludeSlug,
  tags,
}: {
  initialPosts: RelatedBlogPost[]
  excludeSlug:  string
  tags:         string[]
}) {
  const { country, ready } = useSourceCountry()
  const [posts, setPosts] = useState(initialPosts)

  useEffect(() => {
    if (!ready || country.name === 'India') return
    let cancelled = false

    getRelatedBlogPosts(excludeSlug, tags, country.name, initialPosts.length)
      .then(result => {
        if (cancelled) return
        if (result.length > 0) setPosts(result)
      })
      .catch(() => {
        // Non-fatal — keep showing the default set.
      })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, country.name, excludeSlug, initialPosts.length])

  if (posts.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-slate-100">
      <h2 className="text-[18px] font-bold text-slate-900 mb-4">Related Articles</h2>
      <div className="flex flex-col gap-3">
        {posts.map(p => (
          <a
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-primary/30 hover:bg-slate-50 transition-all group"
          >
            {p.cover_image_url && (
              <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={p.cover_image_url} alt={p.title} fill className="object-cover" sizes="64px" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{p.title}</p>
              {p.published_at && (
                <p className="text-[11.5px] text-slate-400 mt-0.5">
                  {new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
