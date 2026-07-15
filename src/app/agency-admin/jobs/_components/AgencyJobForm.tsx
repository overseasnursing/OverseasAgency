'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, AlertCircle, CheckCircle } from 'lucide-react'
import { saveAgencyJob } from '@/app/actions/agencyJobActions'
import type { JobRow } from '@/lib/db/jobs'
import { JOB_COUNTRIES, JOB_CURRENCIES, slugify } from '@/lib/jobConstants'
import { TiptapEditor } from '@/components/admin/TiptapEditor'

const inputCls = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-white'
const labelCls = 'block text-[12px] font-semibold text-slate-600 mb-1'

type Props = {
  initialData: JobRow | null
  availableCountries: string[]
  initialEligibility?: { mode: 'specific_countries' | 'worldwide'; countries: string[] }
}

export function AgencyJobForm({ initialData, availableCountries, initialEligibility }: Props) {
  const isEdit  = !!initialData
  const router  = useRouter()
  const [pending, startSave] = useTransition()
  const [notice, setNotice]  = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [title, setTitle]    = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [eligibilityMode, setEligibilityMode] = useState<'specific_countries' | 'worldwide' | ''>(initialEligibility?.mode ?? '')
  const [eligibleCountries, setEligibleCountries] = useState<string[]>(initialEligibility?.countries ?? [])

  function toggleCountry(c: string) {
    setEligibleCountries(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('description', description)
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
      </div>

      {/* ── Eligibility ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Eligibility</h2>

        <div>
          <label className={labelCls}>Who can apply? *</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="eligibility_mode"
                value="specific_countries"
                required
                checked={eligibilityMode === 'specific_countries'}
                onChange={() => setEligibilityMode('specific_countries')}
              />
              Specific countries
            </label>
            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="eligibility_mode"
                value="worldwide"
                required
                checked={eligibilityMode === 'worldwide'}
                onChange={() => setEligibilityMode('worldwide')}
              />
              Worldwide — open to nurses from any country
            </label>
          </div>
        </div>

        {eligibilityMode === 'specific_countries' && (
          <div>
            <label className={labelCls}>Eligible Source Countries *</label>
            <p className="text-[11px] text-slate-400 mb-2">Only your licensed markets are selectable.</p>
            {availableCountries.length === 0 ? (
              <p className="text-[12.5px] text-slate-400">
                No licensed markets configured for your agency yet — contact support, or choose Worldwide.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableCountries.map(c => (
                  <label
                    key={c}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] rounded-lg border cursor-pointer transition-colors ${
                      eligibleCountries.includes(c)
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="eligible_countries"
                      value={c}
                      checked={eligibleCountries.includes(c)}
                      onChange={() => toggleCountry(c)}
                      className="hidden"
                    />
                    {c}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
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
