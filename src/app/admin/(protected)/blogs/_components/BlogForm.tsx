'use client'

import React, { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2, Save, Trash2, AlertCircle, CheckCircle,
  ImagePlus, X,
} from 'lucide-react'
import { saveBlogPost, deleteBlogPostAction } from '@/app/actions/blog-posts'
import { uploadBlogImage } from '@/app/actions/blog-upload'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import type { BlogPost } from '@/lib/db/blogs'

const inputCls    = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-white'
const labelCls    = 'block text-[12px] font-semibold text-slate-600 mb-1'
const textareaCls = inputCls + ' resize-none leading-relaxed'

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

type Props = { initial?: BlogPost | null }

export function BlogForm({ initial }: Props) {
  const router = useRouter()
  const [pending,    startSave] = useTransition()
  const [delPending, startDel]  = useTransition()
  const [notice, setNotice]     = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const [title,      setTitle]      = useState(initial?.title ?? '')
  const [slug,       setSlug]       = useState(initial?.slug  ?? '')
  const [content,    setContent]    = useState(initial?.content ?? '')
  const [coverUrl,   setCoverUrl]   = useState(initial?.cover_image_url ?? '')
  const [coverUploading, startCoverUpload] = useTransition()
  const coverInputRef = useRef<HTMLInputElement>(null)

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!initial) setSlug(slugify(v))
  }

  function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    startCoverUpload(async () => {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadBlogImage(fd)
      if (res.url) {
        setCoverUrl(res.url)
      } else {
        setNotice({ type: 'err', msg: res.error ?? 'Cover image upload failed' })
      }
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    // inject values managed in state
    fd.set('content',         content)
    fd.set('cover_image_url', coverUrl)
    startSave(async () => {
      try {
        await saveBlogPost(fd)
        setNotice({ type: 'ok', msg: 'Saved successfully.' })
      } catch (err: unknown) {
        setNotice({ type: 'err', msg: err instanceof Error ? err.message : 'Something went wrong.' })
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

      {/* ── Post Details ── */}
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
            placeholder="Short description shown in listing (1–2 sentences)"
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
            <label className={labelCls}>Tags <span className="text-slate-400 font-normal">(comma separated)</span></label>
            <input
              name="tags"
              defaultValue={initial?.tags?.join(', ') ?? ''}
              className={inputCls}
              placeholder="germany, nursing, migration"
            />
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className={labelCls}>Cover Image</label>
          {coverUrl ? (
            <div className="relative w-full max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt="Cover"
                className="w-full h-40 object-cover rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={() => setCoverUrl('')}
                className="absolute top-2 right-2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-300 transition-colors shadow-sm"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="flex items-center gap-2 h-10 px-4 border border-dashed border-slate-300 rounded-xl text-[13px] text-slate-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
            >
              {coverUploading
                ? <><Loader2 size={14} className="animate-spin" /> Uploading…</>
                : <><ImagePlus size={14} /> Upload Cover Image</>
              }
            </button>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleCoverFileChange}
          />
        </div>
      </div>

      {/* ── Content Editor ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Content</h2>
        <TiptapEditor value={content} onChange={setContent} />
      </div>

      {/* ── Publish ── */}
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
          <input name="seo_title" defaultValue={initial?.seo_title ?? ''} className={inputCls} placeholder="Overrides title in search results" />
        </div>
        <div>
          <label className={labelCls}>Meta Description <span className="text-slate-400 font-normal">(150–160 chars)</span></label>
          <textarea name="seo_description" rows={2} defaultValue={initial?.seo_description ?? ''} className={textareaCls} placeholder="What appears under the title in Google" />
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

        <a href="/admin/blogs" className="h-9 px-4 flex items-center text-[13px] text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
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
