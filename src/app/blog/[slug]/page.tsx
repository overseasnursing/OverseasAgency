import type { Metadata } from 'next'
import React from 'react'
import { notFound } from 'next/navigation'
import Markdown from 'markdown-to-jsx'
import { getBlogPostBySlug, getPublishedBlogSlugs } from '@/lib/db/blogs'
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  const title       = post.seo_title       ?? post.title
  const description = post.seo_description ?? post.excerpt ?? ''
  const url         = `https://overseasnursing.com/blog/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      authors: [post.author_name ?? 'OverseasNursing Team'],
      ...(post.cover_image_url
        ? { images: [{ url: post.cover_image_url, width: 1200, height: 630 }] }
        : { images: [{ url: '/opengraph-image', width: 1200, height: 630 }] }),
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post || post.status !== 'published') notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? post.seo_description ?? '',
    author: { '@type': 'Organization', name: post.author_name ?? 'OverseasNursing Team' },
    publisher: {
      '@type': 'Organization',
      name: 'OverseasNursing.com',
      url: 'https://overseasnursing.com',
    },
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    url: `https://overseasnursing.com/blog/${slug}`,
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
  }

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cover */}
      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-56 sm:h-72 object-cover"
        />
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Back */}
        <a
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={13} /> Back to Blog
        </a>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-0.5 bg-primary/8 text-primary rounded-full">
                <Tag size={10} />{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-[28px] sm:text-[34px] font-bold text-slate-900 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-[12.5px] text-slate-400 pb-6 mb-8 border-b border-slate-100">
          {post.author_name && (
            <span className="flex items-center gap-1.5">
              <User size={13} />
              <span className="font-medium text-slate-600">{post.author_name}</span>
            </span>
          )}
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {new Date(post.published_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          )}
        </div>

        {/* Content */}
        {post.content ? (
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-[22px] prose-h3:text-[18px] prose-p:text-[15px] prose-p:leading-relaxed prose-li:text-[15px] prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <Markdown>{post.content}</Markdown>
          </div>
        ) : (
          <p className="text-slate-400 italic">No content yet.</p>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-100">
          <a
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={13} /> More articles
          </a>
        </div>
      </div>
    </main>
  )
}
