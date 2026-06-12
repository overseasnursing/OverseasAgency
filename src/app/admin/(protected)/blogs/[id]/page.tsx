import React from 'react'
import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/require-admin'
import { getBlogPost } from '@/lib/db/blogs'
import { BlogForm } from '../_components/BlogForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: Props) {
  await requirePermission('blogs')
  const { id } = await params
  const post = await getBlogPost(id)
  if (!post) notFound()

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">Edit Blog Post</h1>
        <p className="text-[13px] text-slate-500">/blog/{post.slug}</p>
      </div>
      <BlogForm initial={post} />
    </div>
  )
}
