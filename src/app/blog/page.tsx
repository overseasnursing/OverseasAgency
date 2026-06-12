import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import { getPublishedBlogPosts } from '@/lib/db/blogs'
import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react'

export const revalidate = 3600

const BASE = 'https://overseasnursing.com'

export const metadata: Metadata = {
  title: 'Blog — Guides, Tips & Insights for Nurses Going Abroad',
  description:
    'Expert articles for Indian nurses planning to migrate overseas. Covers Germany, UK, Australia, Dubai, salary comparisons, visa steps, exam tips and agency reviews.',
  keywords: 'overseas nursing blog, nurse migration guide, nursing jobs abroad, Germany nursing, UK nursing, Indian nurses abroad',
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: 'OverseasNursing Blog — Guides & Insights',
    description: 'Expert guides and insights for nurses migrating abroad from India.',
    url: `${BASE}/blog`,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'OverseasNursing Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OverseasNursing Blog — Guides & Insights',
    description: 'Expert guides and insights for nurses migrating abroad from India.',
    images: [`${BASE}/opengraph-image`],
  },
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'OverseasNursing Blog',
    description: 'Expert articles for Indian nurses planning to migrate overseas.',
    url: `${BASE}/blog`,
    inLanguage: 'en-IN',
    publisher: {
      '@type': 'Organization',
      name: 'OverseasNursing.com',
      url: BASE,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE}/logo.png`,
        width: 200,
        height: 60,
      },
    },
  }

  const itemListSchema = posts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Latest Blog Posts — OverseasNursing',
    url: `${BASE}/blog`,
    numberOfItems: posts.length,
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/blog/${p.slug}`,
      name: p.title,
    })),
  } : null

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      {/* Header */}
      <section className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-primary uppercase tracking-wide mb-3">
            <BookOpen size={13} />
            <span>Blog</span>
          </div>
          <h1 className="text-[32px] font-bold text-slate-900 leading-tight mb-3">
            Guides &amp; Insights for Overseas Nurses
          </h1>
          <p className="text-[15px] text-slate-500 max-w-xl">
            Practical advice for Indian nurses planning to work in Germany, UK, Australia, Dubai and beyond.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {!posts.length ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-[15px] text-slate-500">No posts published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map(post => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex gap-0">
                  {post.cover_image_url && (
                    <div className="relative w-48 flex-shrink-0 hidden sm:block" style={{ minHeight: '140px' }}>
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="192px"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col gap-2">
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[11px] font-semibold px-2 py-0.5 bg-primary/8 text-primary rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-[17px] font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                    )}

                    <div className="flex items-center gap-4 mt-auto pt-2 text-[12px] text-slate-400">
                      {post.author_name && (
                        <span className="flex items-center gap-1">
                          <User size={11} />{post.author_name}
                        </span>
                      )}
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      <span className="ml-auto flex items-center gap-1 text-primary font-semibold">
                        Read <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
