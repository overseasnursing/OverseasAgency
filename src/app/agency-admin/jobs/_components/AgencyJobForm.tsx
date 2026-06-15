'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, AlertCircle, CheckCircle } from 'lucide-react'
import { saveAgencyJob } from '@/app/actions/agencyJobActions'
import type { JobRow } from '@/lib/db/jobs'

const inputCls    = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-white'
const labelCls    = 'block text-[12px] font-semibold text-slate-600 mb-1'
const textareaCls = inputCls + ' resize-none leading-relaxed'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

type Props = { initialData: JobRow | null }

export function AgencyJobForm({ initialData }: Props) {
  const isEdit  = !!initialData
  const router  = useRouter()
  const [pending, startSave] = useTransition()
  const [notice, setNotice]  = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [title, setTitle]    = useState(initialData?.title ?? '')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    // Auto-generate slug on create; preserve existing slug on edit
    if (!isEdit) fd.set('slug', slugify(title))
    startSave(async () => {
      const result = await saveAgencyJob(fd)
      if (result.error) {
        setNotice({ type: 'err', msg: result.error })
      } else {
        setNotice({ type: 'ok', msg: isEdit ? 'Changes saved.' : 'Job submitted for review.' })
        if (!isEdit && result.id) router.push(`/agency-admin/jobs/${result.id}`)
      }
    })
  }

  const expiryValue = initialData?.expiry_date
    ? new Date(initialData.expiry_date).toISOString().slice(0, 10)
    : ''

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {initialData?.id   && <input type="hidden" name="id"   value={initialData.id} />}
      {isEdit            && <input type="hidden" name="slug" value={initialData.slug} />}

      {notice && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium ${
          notice.type === 'ok' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#B91C1C]'
        }`}>
          {notice.type === 'ok' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {notice.msg}
        </div>
      )}

      {/* ── Job Details ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Job Details</h2>

        <div>
          <label className={labelCls}>Job Title *</label>
          <input
            name="title"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={inputCls}
            placeholder="e.g. Staff Nurse – ICU"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Country *</label>
            <input
              name="country"
              required
              defaultValue={initialData?.country ?? ''}
              className={inputCls}
              placeholder="e.g. Germany"
            />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input
              name="city"
              defaultValue={initialData?.city ?? ''}
              className={inputCls}
              placeholder="e.g. Berlin"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Job Type *</label>
            <input
              name="job_type"
              required
              defaultValue={initialData?.job_type ?? ''}
              className={inputCls}
              placeholder="e.g. Full Time"
            />
          </div>
          <div>
            <label className={labelCls}>Experience Required</label>
            <input
              name="experience_required"
              defaultValue={initialData?.experience_required ?? ''}
              className={inputCls}
              placeholder="e.g. 2+ years ICU"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Salary</label>
            <input
              name="salary"
              defaultValue={initialData?.salary ?? ''}
              className={inputCls}
              placeholder="e.g. €3,000 / month"
            />
          </div>
          <div>
            <label className={labelCls}>Expiry Date *</label>
            <input
              name="expiry_date"
              type="date"
              required
              defaultValue={expiryValue}
              min={new Date().toISOString().slice(0, 10)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description *</label>
          <textarea
            name="description"
            required
            rows={10}
            defaultValue={initialData?.description ?? ''}
            className={textareaCls}
            placeholder="Describe the role: responsibilities, requirements, benefits, and anything a candidate needs to know…"
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
          {isEdit ? 'Save Changes' : 'Submit for Review'}
        </button>

        <a
          href="/agency-admin/jobs"
          className="h-9 px-4 flex items-center text-[13px] text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
