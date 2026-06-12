import React from 'react'
import { requirePermission } from '@/lib/require-admin'
import { getAllBlogPosts } from '@/lib/db/blogs'
import { Plus, Pencil, BookOpen, Eye, EyeOff } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminBlogsPage() {
  await requirePermission('blogs')
  const posts = await getAllBlogPosts()

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">Blog Posts</h1>
          <p className="text-[13px] text-slate-500">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <a
          href="/admin/blogs/new"
          className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
        >
          <Plus size={14} />
          New Post
        </a>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {!posts.length ? (
          <div className="text-center py-16">
            <BookOpen size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-slate-600 mb-1">No blog posts yet</p>
            <p className="text-[13px] text-slate-400 mb-4">Create your first post to start ranking on Google.</p>
            <a
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-white text-[13px] font-semibold rounded-xl"
            >
              <Plus size={14} /> New Post
            </a>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-slate-500">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-800">{post.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    {post.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534]">
                        <Eye size={10} /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        <EyeOff size={10} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{post.author_name ?? '—'}</td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('en-IN')
                      : new Date(post.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <a
                      href={`/admin/blogs/${post.id}`}
                      className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-primary/40 hover:bg-primary/5 text-slate-600 hover:text-primary text-[12px] font-medium rounded-lg transition-colors"
                    >
                      <Pencil size={11} /> Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!!posts.length && (
        <p className="text-[12px] text-slate-400 text-center">
          Public blog: <a href="/blog" target="_blank" className="text-primary hover:underline">/blog</a>
        </p>
      )}
    </div>
  )
}
