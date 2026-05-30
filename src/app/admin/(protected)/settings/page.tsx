'use client'

import React, { useActionState, useEffect, useRef } from 'react'
import { saveAdminSettings } from '@/app/actions/admin-settings'

function FieldRow({
  label,
  name,
  defaultValue,
  type = 'text',
  placeholder,
  hint,
}: {
  label: string
  name: string
  defaultValue?: string | number
  type?: string
  placeholder?: string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[13px] font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full h-10 px-3 text-[13.5px] text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-slate-300"
      />
      {hint && <p className="text-[11.5px] text-slate-400">{hint}</p>}
    </div>
  )
}

function TextareaRow({
  label,
  name,
  defaultValue,
  placeholder,
  hint,
  rows = 4,
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
  hint?: string
  rows?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[13px] font-semibold text-slate-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-[13.5px] text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-slate-300 resize-y"
      />
      {hint && <p className="text-[11.5px] text-slate-400">{hint}</p>}
    </div>
  )
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[16px] font-bold text-slate-800">{title}</h2>
      <p className="text-[13px] text-slate-400 mt-0.5">{description}</p>
    </div>
  )
}

function SocialBlock({ prefix, defaults }: { prefix: string; defaults: Record<string, string> }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <FieldRow label="LinkedIn URL" name={`${prefix}LinkedinUrl`} defaultValue={defaults.linkedin} placeholder="https://linkedin.com/in/..." />
      <FieldRow label="Twitter / X URL" name={`${prefix}TwitterUrl`} defaultValue={defaults.twitter} placeholder="https://x.com/..." />
      <FieldRow label="Facebook URL" name={`${prefix}FacebookUrl`} defaultValue={defaults.facebook} placeholder="https://facebook.com/..." />
      <FieldRow label="Instagram URL" name={`${prefix}InstagramUrl`} defaultValue={defaults.instagram} placeholder="https://instagram.com/..." />
      <FieldRow label="YouTube URL" name={`${prefix}YoutubeUrl`} defaultValue={defaults.youtube} placeholder="https://youtube.com/@..." />
    </div>
  )
}

export default function AdminSettingsPage() {
  const [state, formAction, isPending] = useActionState(saveAdminSettings, null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state?.success) successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [state])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-slate-900">Profile Settings</h1>
          <p className="text-[13.5px] text-slate-500 mt-1">
            Author and reviewer profiles displayed on all published content attribution blocks.
          </p>
        </div>

        {/* Success / error banner */}
        {state?.success && (
          <div ref={successRef} className="mb-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-3">
            <p className="text-[13.5px] font-semibold text-[#166534]">Profile saved successfully.</p>
          </div>
        )}
        {state?.error && (
          <div className="mb-6 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3">
            <p className="text-[13.5px] font-semibold text-[#B91C1C]">Save failed: {state.error}</p>
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-8">

          {/* ── Author Section ─────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <SectionHeading
              title="Author Profile"
              description="The person credited as the content author on exam, salary, pricing, comparison, and country pages."
            />
            <div className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <FieldRow
                  label="Display Name"
                  name="authorDisplayName"
                  placeholder="e.g. Priya Menon"
                  hint="Appears as 'Written by' in attribution blocks."
                />
                <FieldRow
                  label="Role Title"
                  name="authorRoleTitle"
                  placeholder="e.g. Senior Migration Correspondent"
                />
              </div>
              <FieldRow
                label="Years of Experience"
                name="authorYearsExperience"
                type="number"
                placeholder="e.g. 8"
              />
              <FieldRow
                label="Profile Photo URL"
                name="authorProfilePhoto"
                placeholder="https://..."
                hint="Direct image URL. Use a Cloudflare R2 or CDN link."
              />
              <TextareaRow
                label="Short Bio"
                name="authorShortBio"
                rows={2}
                placeholder="One or two sentences. Appears in profile cards."
              />
              <TextareaRow
                label="Long Bio"
                name="authorLongBio"
                rows={6}
                placeholder="Full bio shown on the author profile page. Separate paragraphs with a blank line."
              />
              <TextareaRow
                label="Expertise Areas"
                name="authorExpertiseAreas"
                rows={3}
                placeholder={"Overseas nursing migration\nVisa documentation\nSalary benchmarking"}
                hint="One area per line."
              />
              <TextareaRow
                label="Content Specialties"
                name="authorContentSpecialties"
                rows={3}
                placeholder={"Country migration guides\nSalary reports\nExam preparation guides"}
                hint="One specialty per line."
              />
              <div>
                <p className="text-[13px] font-semibold text-slate-700 mb-3">Social Links</p>
                <SocialBlock prefix="author" defaults={{}} />
              </div>
            </div>
          </div>

          {/* ── Reviewer Section ──────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <SectionHeading
              title="Reviewer Profile"
              description="The clinical or regulatory expert who reviews content for accuracy before publication."
            />
            <div className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <FieldRow
                  label="Display Name"
                  name="reviewerDisplayName"
                  placeholder="e.g. Anitha Kumar, RN"
                  hint="Appears as 'Reviewed by' in attribution blocks."
                />
                <FieldRow
                  label="Reviewer Title"
                  name="reviewerTitle"
                  placeholder="e.g. Registered Nurse, NMC UK (PIN 12A3456E)"
                />
              </div>
              <FieldRow
                label="Years of Experience"
                name="reviewerYearsExperience"
                type="number"
                placeholder="e.g. 12"
              />
              <FieldRow
                label="Profile Photo URL"
                name="reviewerProfilePhoto"
                placeholder="https://..."
                hint="Direct image URL."
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <FieldRow
                  label="Registration Number"
                  name="reviewerRegistrationNumber"
                  placeholder="e.g. 12A3456E"
                  hint="If present, verification status is set to 'Verified'."
                />
                <FieldRow
                  label="Issuing Authority"
                  name="reviewerIssuingAuthority"
                  placeholder="e.g. Nursing and Midwifery Council (NMC), UK"
                />
              </div>
              <FieldRow
                label="Credential Summary"
                name="reviewerCredentialSummary"
                placeholder="e.g. NMC Registered Nurse — PIN 12A3456E"
                hint="Short credential line shown on profile and attribution badge."
              />
              <TextareaRow
                label="Short Bio"
                name="reviewerShortBio"
                rows={2}
                placeholder="One or two sentences."
              />
              <TextareaRow
                label="Long Bio"
                name="reviewerLongBio"
                rows={6}
                placeholder="Full bio shown on the reviewer profile page. Separate paragraphs with a blank line."
              />
              <TextareaRow
                label="Expertise Areas"
                name="reviewerExpertiseAreas"
                rows={3}
                placeholder={"Clinical nursing practice\nNMC registration process\nOET/IELTS assessment"}
                hint="One area per line."
              />
              <TextareaRow
                label="Review Specialties"
                name="reviewerSpecialties"
                rows={3}
                placeholder={"Exam requirement accuracy\nVisa and licensing steps\nSalary and compensation data"}
                hint="One specialty per line."
              />
              <div>
                <p className="text-[13px] font-semibold text-slate-700 mb-3">Social Links</p>
                <SocialBlock prefix="reviewer" defaults={{}} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-slate-400">
              Changes take effect on next page build / revalidation.
            </p>
            <button
              type="submit"
              disabled={isPending}
              className="h-11 px-7 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-[14px] font-semibold rounded-xl transition-colors"
            >
              {isPending ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
