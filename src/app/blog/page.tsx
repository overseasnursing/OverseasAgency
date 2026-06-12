import type { Metadata } from 'next'
import React from 'react'
import { getPublishedBlogPosts } from '@/lib/db/blogs'
import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react'

export const revalidate = 3600 // ISR: refresh every hour

export const metadata: Metadata = {
  title: 'Blog — OverseasNursing.com | Guides, Tips & Insights for Nurses Going Abroad',
  description:
    'Expert articles for Indian nurses planning to migrate overseas. Covers Germany, UK, Australia, Dubai, salary comparisons, visa steps, exam tips and agency reviews.',
  alternates: { canonical: 'https://overseasnursing.com/blog' },
  openGraph: {
    title: 'OverseasNursing Blog',
    description: 'Expert guides and insights for nurses migrating abroad from India.',
    url: 'https://overseasnursing.com/blog',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-primary uppercase tracking-wide mb-3">
            <BookOpen size={13} />
            <span>Blog</span>
          </div>
          <h1 className="text-[32px] font-bold text-slate-900 leading-tight mb-3">
            Guides & Insights for Overseas Nurses
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-48 h-full object-cover flex-shrink-0 hidden sm:block"
                      loading="lazy"
                    />
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
