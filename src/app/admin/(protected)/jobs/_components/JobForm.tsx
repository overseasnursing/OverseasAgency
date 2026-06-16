'use client'

import React, { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, AlertCircle, CheckCircle, Upload, X } from 'lucide-react'
import { saveJob } from '@/app/actions/admin-jobs'
import { uploadJobLogo } from '@/app/actions/job-upload'
import type { JobRow } from '@/lib/db/jobs'
import { JOB_COUNTRIES, JOB_CURRENCIES } from '@/lib/jobConstants'
import { TiptapEditor } from '@/components/admin/TiptapEditor'

const inputCls = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-white'
const labelCls = 'block text-[12px] font-semibold text-slate-600 mb-1'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

type Props = { initialData: JobRow | null }

export function JobForm({ initialData }: Props) {
  const isEdit  = !!initialData
  const router  = useRouter()
  const [pending, startSave] = useTransition()
  const [notice, setNotice]  = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [title, setTitle]    = useState(initialData?.title ?? '')
  const [slug,  setSlug]     = useState(initialData?.slug  ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url ?? '')
  const [logoUploading, startLogoUpload] = useTransition()
  const logoFileRef = useRef<HTMLInputElement>(null)
  const [applyType, setApplyType] = useState<'direct' | 'redirect'>(initialData?.apply_type ?? 'direct')

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!isEdit) setSlug(slugify(v))
  }

  function handleLogoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    startLogoUpload(async () => {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadJobLogo(fd)
      if (res.url) setLogoUrl(res.url)
      else setNotice({ type: 'err', msg: res.error ?? 'Logo upload failed' })
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('description', description)
    startSave(async () => {
      const result = await saveJob(fd)
      if (result.error) {
        setNotice({ type: 'err', msg: result.error })
      } else {
        setNotice({ type: 'ok', msg: isEdit ? 'Saved.' : 'Job created.' })
        if (!isEdit && result.id) router.push(`/admin/jobs/${result.id}`)
      }
    })
  }

  const expiryValue = initialData?.expiry_date
    ? new Date(initialData.expiry_date).toISOString().slice(0, 10)
    : ''

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="logo_url" value={logoUrl} />

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
            onChange={e => handleTitleChange(e.target.value)}
            className={inputCls}
            placeholder="e.g. Staff Nurse – ICU"
          />
        </div>

        <div>
          <label className={labelCls}>Slug</label>
          <input
            name="slug"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className={inputCls}
            placeholder="auto-generated from title"
          />
          <p className="text-[11px] text-slate-400 mt-1">URL: /jobs/{slug || '…'}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Country *</label>
            <select
              name="country"
              required
              defaultValue={initialData?.country ?? ''}
              className={inputCls}
            >
              <option value="" disabled>Select country</option>
              {JOB_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input
              name="state"
              defaultValue={initialData?.state ?? ''}
              className={inputCls}
              placeholder="e.g. Bavaria (optional)"
            />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input
              name="city"
              defaultValue={initialData?.city ?? ''}
              className={inputCls}
              placeholder="e.g. Berlin (optional)"
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
            <label className={labelCls}>Experience Required (years)</label>
            <input
              name="experience_years"
              type="number"
              min={0}
              step={1}
              defaultValue={initialData?.experience_years ?? ''}
              className={inputCls}
              placeholder="e.g. 2"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Salary Currency</label>
            <select
              name="salary_currency"
              defaultValue={initialData?.salary_currency ?? ''}
              className={inputCls}
            >
              <option value="">Not specified</option>
              {JOB_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Salary Amount</label>
            <input
              name="salary_amount"
              type="number"
              min={0}
              step={1}
              defaultValue={initialData?.salary_amount ?? ''}
              className={inputCls}
              placeholder="e.g. 3000"
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
          <TiptapEditor value={description} onChange={setDescription} />
        </div>

        <div>
          <label className={labelCls}>Employer Logo (optional)</label>
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <div className="relative w-14 h-14 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Employer logo" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setLogoUrl('')}
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-[#B91C1C] transition-colors"
                  aria-label="Remove logo"
                >
                  <X size={11} />
                </button>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl border border-dashed border-slate-200 flex items-center justify-center flex-shrink-0 bg-slate-50">
                <Upload size={16} className="text-slate-300" />
              </div>
            )}
            <button
              type="button"
              onClick={() => logoFileRef.current?.click()}
              disabled={logoUploading}
              className="h-9 px-4 flex items-center gap-2 text-[13px] font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              {logoUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {logoUrl ? 'Replace logo' : 'Upload logo'}
            </button>
            <input
              ref={logoFileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleLogoFileChange}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Shown on the job listing card and detail page. Square image recommended.
          </p>
        </div>

        <div>
          <label className={labelCls}>How to Apply *</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="apply_type"
                value="direct"
                checked={applyType === 'direct'}
                onChange={() => setApplyType('direct')}
              />
              Direct Apply — candidates apply on OverseasNursing
            </label>
            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="apply_type"
                value="redirect"
                checked={applyType === 'redirect'}
                onChange={() => setApplyType('redirect')}
              />
              Redirect — send candidates to an external URL to apply
            </label>
          </div>
          {applyType === 'redirect' && (
            <input
              name="redirect_url"
              type="url"
              required
              defaultValue={initialData?.redirect_url ?? ''}
              className={`${inputCls} mt-2`}
              placeholder="https://example.com/careers/job-123"
            />
          )}
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
          {isEdit ? 'Save Changes' : 'Create Job'}
        </button>

        <a
          href="/admin/jobs"
          className="h-9 px-4 flex items-center text-[13px] text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
