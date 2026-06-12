'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, Save, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import { saveBlogPost, deleteBlogPostAction } from '@/app/actions/blog-posts'
import type { BlogPost } from '@/lib/db/blogs'

const inputCls    = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-white'
const labelCls    = 'block text-[12px] font-semibold text-slate-600 mb-1'
const textareaCls = inputCls + ' resize-none leading-relaxed'

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

type Props = { initial?: BlogPost | null }

export function BlogForm({ initial }: Props) {
  const router   = useRouter()
  const [pending, startTransition] = useTransition()
  const [delPending, startDel]     = useTransition()
  const [preview, setPreview]      = useState(false)
  const [notice, setNotice]        = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const [title,   setTitle]   = useState(initial?.title ?? '')
  const [slug,    setSlug]    = useState(initial?.slug  ?? '')
  const [content, setContent] = useState(initial?.content ?? '')

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!initial) setSlug(slugify(v))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await saveBlogPost(fd)
        setNotice({ type: 'ok', msg: 'Saved successfully.' })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.'
        setNotice({ type: 'err', msg })
      }
    })
  }

  function handleDelete() {
    if (!initial?.id) return
    if (!confirm('Delete this blog post permanently?')) return
    startDel(async () => {
      await deleteBlogPostAction(initial.id)
      router.push('/admin/blogs')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      {notice && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium ${notice.type === 'ok' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#B91C1C]'}`}>
          {notice.type === 'ok' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {notice.msg}
        </div>
      )}

      {/* ── Core fields ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Post Details</h2>

        <div>
          <label className={labelCls}>Title *</label>
          <input
            name="title"
            required
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            className={inputCls}
            placeholder="e.g. How to Get a Nursing Job in Germany"
          />
        </div>

        <div>
          <label className={labelCls}>Slug *</label>
          <input
            name="slug"
            required
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className={inputCls}
            placeholder="how-to-get-nursing-job-germany"
          />
          <p className="text-[11px] text-slate-400 mt-1">Public URL: /blog/{slug || '…'}</p>
        </div>

        <div>
          <label className={labelCls}>Excerpt</label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={initial?.excerpt ?? ''}
            className={textareaCls}
            placeholder="Short description shown in blog listing (1–2 sentences)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Author Name</label>
            <input
              name="author_name"
              defaultValue={initial?.author_name ?? 'OverseasNursing Team'}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Cover Image URL</label>
            <input
              name="cover_image_url"
              defaultValue={initial?.cover_image_url ?? ''}
              className={inputCls}
              placeholder="https://…"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Tags <span className="text-slate-400 font-normal">(comma separated)</span></label>
          <input
            name="tags"
            defaultValue={initial?.tags?.join(', ') ?? ''}
            className={inputCls}
            placeholder="germany, nursing, migration"
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Content <span className="text-slate-400 font-normal normal-case">(Markdown)</span></h2>
          <button
            type="button"
            onClick={() => setPreview(p => !p)}
            className="flex items-center gap-1.5 h-7 px-3 border border-slate-200 text-[12px] text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {preview ? <><EyeOff size={12} /> Edit</> : <><Eye size={12} /> Preview</>}
          </button>
        </div>

        {preview ? (
          <div className="min-h-[300px] p-4 border border-slate-200 rounded-lg prose prose-sm max-w-none text-[13px] text-slate-800">
            {content ? <Markdown>{content}</Markdown> : <p className="text-slate-400 italic">Nothing to preview.</p>}
          </div>
        ) : (
          <textarea
            name="content"
            rows={20}
            value={content}
            onChange={e => setContent(e.target.value)}
            className={textareaCls + ' font-mono text-[12.5px]'}
            placeholder="Write your blog post in Markdown…"
          />
        )}
      </div>

      {/* ── Publish settings ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Publish</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Status</label>
            <select name="status" defaultValue={initial?.status ?? 'draft'} className={inputCls}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Published At</label>
            <input
              name="published_at"
              type="datetime-local"
              defaultValue={initial?.published_at ? initial.published_at.slice(0, 16) : ''}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* ── SEO ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">SEO</h2>

        <div>
          <label className={labelCls}>SEO Title <span className="text-slate-400 font-normal">(leave blank to use post title)</span></label>
          <input
            name="seo_title"
            defaultValue={initial?.seo_title ?? ''}
            className={inputCls}
            placeholder="Overrides title in search results"
          />
        </div>

        <div>
          <label className={labelCls}>Meta Description <span className="text-slate-400 font-normal">(150–160 chars)</span></label>
          <textarea
            name="seo_description"
            rows={2}
            defaultValue={initial?.seo_description ?? ''}
            className={textareaCls}
            placeholder="What appears under the title in Google search results"
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 h-9 px-5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {initial ? 'Save Changes' : 'Create Post'}
        </button>

        <a
          href="/admin/blogs"
          className="h-9 px-4 flex items-center text-[13px] text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </a>

        {initial && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={delPending}
            className="ml-auto flex items-center gap-2 h-9 px-4 text-[13px] font-medium text-[#B91C1C] hover:bg-red-50 border border-red-200 rounded-xl transition-colors disabled:opacity-60"
          >
            {delPending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Delete Post
          </button>
        )}
      </div>
    </form>
  )
}
