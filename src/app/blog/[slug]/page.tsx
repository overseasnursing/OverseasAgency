import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getPublishedBlogPosts, getPublishedBlogSlugs } from '@/lib/db/blogs'
import { Calendar, User, ArrowLeft, Tag, Clock } from 'lucide-react'
import { ContentAttribution } from '@/components/seo/ContentAttribution'
import { getAttributionProfiles } from '@/lib/admin-profile'
import { RelatedArticles } from './RelatedArticles'

export const revalidate = 3600

const BASE = 'https://overseasnursing.com'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs()
  return slugs.map(slug => ({ slug }))
}

function readingTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function wordCount(html: string): number {
  return html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  const title       = post.seo_title       ?? post.title
  const description = post.seo_description ?? post.excerpt ?? ''
  const canonical   = `${BASE}/blog/${slug}`
  const image       = post.cover_image_url ?? `${BASE}/opengraph-image`

  return {
    title,
    description,
    keywords:   post.tags?.join(', ') || undefined,
    robots:     { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url:           canonical,
      type:          'article',
      locale:        'en_IN',
      publishedTime: post.published_at ?? undefined,
      modifiedTime:  post.updated_at,
      authors:       [post.author_name ?? 'OverseasNursing Team'],
      tags:          post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [image],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post || post.status !== 'published') notFound()

  const hasFaqs   = (post.faqs?.length ?? 0) > 0
  const readMins  = post.content ? readingTime(post.content) : 1
  const words     = post.content ? wordCount(post.content) : 0

  // Fetch related posts (same tags, excluding current)
  const allPosts   = await getPublishedBlogPosts()
  const related    = allPosts
    .filter(p => p.slug !== slug && p.tags?.some(t => post.tags?.includes(t)))
    .slice(0, 3)

  const attribution = await getAttributionProfiles()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type':    'BlogPosting',
    headline:   post.title,
    description: post.excerpt ?? post.seo_description ?? '',
    inLanguage: 'en-IN',
    wordCount:  words,
    keywords:   post.tags?.join(', '),
    author: {
      '@type': 'Person',
      name:    post.author_name ?? 'OverseasNursing Team',
      url:     `${BASE}/about`,
    },
    publisher: {
      '@type':  'Organization',
      name:     'OverseasNursing.com',
      url:      BASE,
      logo: {
        '@type': 'ImageObject',
        url:     `${BASE}/logo.png`,
        width:   200,
        height:  60,
      },
    },
    datePublished: post.published_at ?? post.created_at,
    dateModified:  post.updated_at,
    url:           `${BASE}/blog/${slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${slug}` },
    ...(post.cover_image_url ? {
      image: {
        '@type':  'ImageObject',
        url:      post.cover_image_url,
        width:    1200,
        height:   630,
      },
    } : {}),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Blog',  item: `${BASE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE}/blog/${slug}` },
    ],
  }

  const faqSchema = hasFaqs ? {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: post.faqs.map(f => ({
      '@type': 'Question',
      name:    f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  const jsonLd = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]

  return (
    <main className="min-h-screen bg-white">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Cover image */}
      {post.cover_image_url && (
        <div className="relative w-full h-56 sm:h-80">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-[12.5px] text-slate-400 flex-wrap">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li aria-hidden>/</li>
            <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
            <li aria-hidden>/</li>
            <li className="text-slate-600 font-medium truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

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

        {/* Meta row */}
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
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </time>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {readMins} min read
          </span>
        </div>

        {/* Content */}
        {post.content ? (
          <div
            className="blog-content prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-[28px] prose-h2:text-[22px] prose-h3:text-[18px] prose-p:text-[15px] prose-p:leading-relaxed prose-li:text-[15px] prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:w-full"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-slate-400 italic">No content yet.</p>
        )}

        {/* Attribution — EEAT trust signal, links to author/reviewer profiles */}
        {attribution && (
          <div className="mt-10">
            <ContentAttribution
              {...(attribution.author && { author: attribution.author })}
              {...(attribution.reviewer && { reviewer: attribution.reviewer })}
              lastReviewed={new Date(post.updated_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              sourceNote="This article is reviewed by our editorial team for accuracy before publishing."
            />
          </div>
        )}

        {/* FAQs */}
        {hasFaqs && (
          <div className="mt-12">
            <h2 className="text-[22px] font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-4">
              {post.faqs.map((faq, i) => (
                <details key={i} className="group border border-slate-200 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none select-none hover:bg-slate-50 transition-colors">
                    <span className="text-[15px] font-semibold text-slate-800">{faq.q}</span>
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform text-[18px] leading-none">›</span>
                  </summary>
                  <div className="px-5 pb-4 pt-1 text-[14px] text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Related posts — server-computed default (tag overlap, global,
            identical for every visitor/crawler); the widget itself may
            re-rank client-side toward the visitor's Market Context once
            resolved. See RelatedArticles.tsx. */}
        <RelatedArticles initialPosts={related} excludeSlug={slug} tags={post.tags ?? []} />

        {/* Footer nav */}
        <div className="mt-10 pt-6 border-t border-slate-100">
          <a href="/blog" className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft size={13} /> More articles
          </a>
        </div>
      </div>
    </main>
  )
}
