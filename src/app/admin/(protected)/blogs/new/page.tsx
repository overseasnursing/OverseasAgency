import React from 'react'
import { requirePermission } from '@/lib/require-admin'
import { BlogForm } from '../_components/BlogForm'

export default async function NewBlogPostPage() {
  await requirePermission('blogs')

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">New Blog Post</h1>
        <p className="text-[13px] text-slate-500">Write and publish a new post to /blog</p>
      </div>
      <BlogForm />
    </div>
  )
}
