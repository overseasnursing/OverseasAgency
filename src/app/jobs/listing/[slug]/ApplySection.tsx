'use client'

import React, { useState, useTransition, useRef, useEffect } from 'react'
import {
  X, Loader2, CheckCircle, AlertCircle, Upload, LogIn,
} from 'lucide-react'
import { submitApplication } from '@/app/actions/jobApplicationActions'

interface ApplySectionProps {
  jobId:      string
  jobSlug:    string
  isExpired:  boolean
  isLoggedIn: boolean
  hasApplied: boolean
  userEmail?: string
}

const inputCls = 'w-full h-10 px-3 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const labelCls = 'block text-[12px] font-semibold text-slate-600 mb-1'

function ApplyModal({
  jobId,
  jobSlug,
  userEmail,
  onClose,
  onSuccess,
}: {
  jobId:     string
  jobSlug:   string
  userEmail: string
  onClose:   () => void
  onSuccess: () => void
}) {
  const [pending, start]       = useTransition()
  const [error, setError]      = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail]      = useState(userEmail)
  const [phone, setPhone]      = useState('')
  const [country, setCountry]  = useState('')
  const [cvFile, setCvFile]    = useState<File | null>(null)
  const fileRef                = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (!cvFile) { setError('Please upload your CV.'); return }

    const fd = new FormData()
    fd.append('job_id',          jobId)
    fd.append('job_slug',        jobSlug)
    fd.append('full_name',       fullName)
    fd.append('email',           email)
    fd.append('phone',           phone)
    fd.append('current_country', country)
    fd.append('cv',              cvFile)

    start(async () => {
      const result = await submitApplication(fd)
      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[17px] font-bold text-slate-800">Apply for this Job</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-[#FEE2E2] border border-[#FECACA] rounded-xl">
              <AlertCircle size={14} className="text-[#B91C1C] flex-shrink-0 mt-0.5" />
              <p className="text-[12.5px] text-[#B91C1C] leading-snug">{error}</p>
            </div>
          )}

          <div>
            <label className={labelCls}>Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your full name"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Current Country *</label>
            <input
              type="text"
              required
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="e.g. India"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Upload CV *</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={e => setCvFile(e.target.files?.[0] ?? null)}
              className="sr-only"
              required
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/5 rounded-xl transition-all group"
            >
              <Upload size={16} className="text-slate-400 group-hover:text-primary flex-shrink-0 transition-colors" />
              <span className="text-[13px] text-slate-500 group-hover:text-primary truncate transition-colors">
                {cvFile ? cvFile.name : 'Click to upload PDF, DOC, or DOCX (max 5 MB)'}
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="flex items-center justify-center gap-2 h-11 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-xl transition-colors mt-1"
          >
            {pending
              ? <><Loader2 size={15} className="animate-spin" /> Submitting…</>
              : 'Submit Application'}
          </button>

          <p className="text-[11.5px] text-slate-400 text-center -mt-1">
            Your details will be shared with the hiring agency.
          </p>
        </form>
      </div>
    </div>
  )
}

export function ApplySection({
  jobId,
  jobSlug,
  isExpired,
  isLoggedIn,
  hasApplied,
  userEmail = '',
}: ApplySectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [applied, setApplied]    = useState(hasApplied)

  if (isExpired) {
    return (
      <div className="px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl">
        <p className="text-[12.5px] text-slate-500 text-center">
          This job has expired and is no longer accepting applications.
        </p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <a
        href={`/auth/login?next=/jobs/listing/${jobSlug}`}
        className="w-full flex items-center justify-center gap-2 h-11 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
      >
        <LogIn size={15} />
        Sign in to Apply
      </a>
    )
  }

  if (applied) {
    return (
      <div className="flex items-center gap-2 px-3 py-3 bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl">
        <CheckCircle size={15} className="text-[#166534] flex-shrink-0" />
        <p className="text-[12.5px] font-semibold text-[#166534]">
          You have already applied for this job.
        </p>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full h-11 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
      >
        Apply Now
      </button>

      {modalOpen && (
        <ApplyModal
          jobId={jobId}
          jobSlug={jobSlug}
          userEmail={userEmail}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setApplied(true); setModalOpen(false) }}
        />
      )}
    </>
  )
}
