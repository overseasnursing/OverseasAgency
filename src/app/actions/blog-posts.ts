'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/require-admin'
import {
  createBlogPost, updateBlogPost, deleteBlogPost,
  type BlogPostInput,
} from '@/lib/db/blogs'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function saveBlogPost(formData: FormData) {
  await requirePermission('blogs')

  const id    = formData.get('id') as string | null
  const title = (formData.get('title') as string).trim()
  const rawSlug = (formData.get('slug') as string).trim()
  const slug  = rawSlug || slugify(title)

  const rawTags = (formData.get('tags') as string ?? '').trim()
  const tags = rawTags
    ? rawTags.split(',').map(t => t.trim()).filter(Boolean)
    : []

  const status = formData.get('status') as 'draft' | 'published'

  const input: BlogPostInput = {
    slug,
    title,
    excerpt:         (formData.get('excerpt') as string)?.trim() || null,
    content:         (formData.get('content') as string)?.trim() || null,
    cover_image_url: (formData.get('cover_image_url') as string)?.trim() || null,
    author_name:     (formData.get('author_name') as string)?.trim() || 'OverseasNursing Team',
    status,
    published_at:    status === 'published'
                       ? ((formData.get('published_at') as string)?.trim() || new Date().toISOString())
                       : null,
    seo_title:       (formData.get('seo_title') as string)?.trim() || null,
    seo_description: (formData.get('seo_description') as string)?.trim() || null,
    tags,
  }

  if (id) {
    await updateBlogPost(id, input)
  } else {
    await createBlogPost(input)
  }

  revalidatePath('/admin/blogs')
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  redirect('/admin/blogs')
}

export async function deleteBlogPostAction(id: string) {
  await requirePermission('blogs')
  await deleteBlogPost(id)
  revalidatePath('/admin/blogs')
  revalidatePath('/blog')
}
