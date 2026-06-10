'use client'

import { useState, useTransition, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Save, Loader2, CheckCircle, AlertCircle,
  Globe, Mail, MessageCircle, Building2, MapPin,
  DollarSign, Shield, Video, Plus, Trash2, ChevronDown, ChevronUp,
  Upload, ImagePlus, X,
} from 'lucide-react'
import {
  saveAgencyAsOwner, saveBranchAsOwner, deleteBranchAsOwner,
  saveFaqAsOwner, deleteFaqAsOwner, uploadAgencyAssetAsOwner,
  type OwnerBranchInput,
} from '@/app/actions/agencyOwnerActions'
import { COUNTRY_FILTER_OPTIONS } from '@/lib/data/countryList'
import { LocationCascade } from '@/components/ui/LocationCascade'

/* ─── Types ────────────────────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AgencyRow = Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BranchRow = Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FaqRow    = Record<string, any>

type FaqState = {
  id?: string
  agency_id: string
  question: string
  answer: string
  sort_order?: number
}

/* ─── Constants ────────────────────────────────────────────────────────────── */

const COMMON_EXAMS    = ['OET', 'IELTS', 'NCLEX', 'CBT (NMC)', 'DHA', 'HAAD', 'PROMETRIC', 'OSCE']
const COMMON_SERVICES = [
  'OET Coaching', 'IELTS Coaching', 'NCLEX Coaching', 'DHA Coaching', 'HAAD Coaching',
  'Visa Processing', 'Document Attestation', 'Job Placement',
  'Pre-departure Briefing', 'Post-placement Support',
  'Language Training', 'Interview Preparation',
]
const SOCIAL_PLATFORMS = ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'telegram']
const DESIGNATION_OPTIONS = ['Owner', 'Director', 'Manager', 'HR Representative', 'Other'] as const

/* ─── Shared UI ────────────────────────────────────────────────────────────── */

const inputCls     = 'w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const textareaCls  = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none'

function SectionCard({ children, title, icon }: { children: React.ReactNode; title: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-[14px] font-bold text-slate-800">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-600">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-3 h-8 rounded-lg border text-[12.5px] font-medium transition-all ${
        checked ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white border-slate-200 text-slate-500'
      }`}
    >
      <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'bg-primary border-primary' : 'border-slate-300'}`}>
        {checked && <CheckCircle size={9} className="text-white" strokeWidth={3} />}
      </div>
      {label}
    </button>
  )
}

function ChipMultiSelect({
  options, selected, onChange,
}: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 h-7 rounded-full text-[12px] font-medium border transition-all ${
              active ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Image Upload ─────────────────────────────────────────────────────────── */

function OwnerImageUpload({
  label, hint, currentUrl, onUploaded, uploadType,
}: {
  label: string; hint?: string; currentUrl: string
  onUploaded: (url: string) => void; uploadType: 'logo' | 'featured'
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(''); setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const result = await uploadAgencyAssetAsOwner(fd, uploadType)
    setUploading(false)
    if (result.error) { setUploadError(result.error); return }
    onUploaded(result.url!)
    if (inputRef.current) inputRef.current.value = ''
  }

  const isLogo = uploadType === 'logo'

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold text-slate-600">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      {currentUrl ? (
        <div
          className={`relative overflow-hidden border border-slate-200 bg-slate-50 rounded-xl group ${isLogo ? 'w-20 h-20' : 'w-full h-32'}`}
        >
          <Image src={currentUrl} alt={label} fill sizes="320px" className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white rounded-lg text-[11px] font-semibold text-slate-700"
            >
              {uploading ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />} Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary/40 hover:text-primary transition-all ${isLogo ? 'w-20 h-20' : 'w-full h-32'}`}
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
          {!uploading && <span className="text-[11px]">Upload</span>}
        </button>
      )}
      {uploadError && <p className="text-[11px] text-red-500">{uploadError}</p>}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

/* ─── Branch Editor ────────────────────────────────────────────────────────── */

function emptyBranch(agencyId: string): OwnerBranchInput {
  return { agency_id: agencyId, name: '', address: '', city: '', state: '' }
}

function BranchEditor({
  branch,
  agencyId,
  onSaved,
  onDeleted,
  isNew,
}: {
  branch: OwnerBranchInput & { id?: string }
  agencyId: string
  onSaved: (updated: OwnerBranchInput & { id?: string }) => void
  onDeleted: () => void
  isNew?: boolean
}) {
  const [data, setData] = useState<OwnerBranchInput & { id?: string }>(branch)
  const [expanded, setExpanded] = useState(isNew ?? false)
  const [error, setError] = useState('')
  const [isPending, start] = useTransition()

  function set(key: keyof OwnerBranchInput, value: string | boolean) {
    setData(d => ({ ...d, [key]: value }))
  }

  function handleSave() {
    if (!data.name.trim()) { setError('Branch name is required'); return }
    if (!data.address.trim()) { setError('Address is required'); return }
    if (!data.city.trim()) { setError('City is required'); return }
    if (!data.state.trim()) { setError('State is required'); return }
    setError('')
    start(async () => {
      const result = await saveBranchAsOwner(data)
      if (result.error) { setError(result.error); return }
      const saved = result.id ? { ...data, id: result.id } : data
      onSaved(saved)
      setExpanded(false)
    })
  }

  function handleDelete() {
    if (!data.id) { onDeleted(); return }
    start(async () => {
      const result = await deleteBranchAsOwner(data.id!)
      if (result.error) { setError(result.error); return }
      onDeleted()
    })
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div>
          <p className="text-[13px] font-semibold text-slate-700">{data.name || 'New Branch'}</p>
          {data.city && <p className="text-[11.5px] text-slate-400">{[data.city, data.state].filter(Boolean).join(', ')}</p>}
        </div>
        <div className="flex items-center gap-2">
          {data.is_head_office && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Head Office</span>
          )}
          {expanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-slate-100 flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Branch Name *">
              <input value={data.name} onChange={e => set('name', e.target.value)} className={inputCls} placeholder="e.g. Kochi Head Office" />
            </Field>
          </div>
          <LocationCascade
            mode="country-state-city"
            country={data.country ?? 'India'}
            state={data.state}
            city={data.city}
            onCountryChange={(v) => set('country', v ?? 'India')}
            onStateChange={(v) => { set('state', v ?? ''); set('city', '') }}
            onCityChange={(v) => set('city', v ?? '')}
            className="grid sm:grid-cols-3 gap-3"
          />
          <Field label="Address *">
            <textarea value={data.address} onChange={e => set('address', e.target.value)} rows={2} className={textareaCls} placeholder="Full street address" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Phone">
              <input value={data.phone ?? ''} onChange={e => set('phone', e.target.value)} className={inputCls} placeholder="+91 98..." />
            </Field>
            <Field label="WhatsApp">
              <input value={data.whatsapp ?? ''} onChange={e => set('whatsapp', e.target.value)} className={inputCls} placeholder="+91 98..." />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Branch Email">
              <input value={data.email ?? ''} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="branch@example.com" />
            </Field>
            <Field label="Office Hours">
              <input value={data.office_hours ?? ''} onChange={e => set('office_hours', e.target.value)} className={inputCls} placeholder="Mon-Sat 9am-6pm" />
            </Field>
          </div>
          <Field label="Google Maps Embed URL" hint="Paste the iframe src URL from Google Maps → Share → Embed">
            <input value={data.google_maps_url ?? ''} onChange={e => set('google_maps_url', e.target.value)} className={inputCls} placeholder="https://www.google.com/maps/embed?pb=..." />
          </Field>

          <div className="flex items-center gap-3">
            <Toggle
              checked={data.is_head_office ?? false}
              onChange={v => set('is_head_office', v)}
              label="Head Office"
            />
          </div>

          {error && <p className="text-[12px] text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 h-8 bg-primary text-white text-[12.5px] font-semibold rounded-lg transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              Save Branch
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 h-8 border border-red-200 text-red-600 text-[12.5px] font-semibold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── FAQ Editor ───────────────────────────────────────────────────────────── */

function FaqEditor({
  faq, agencyId, onSaved, onDeleted, isNew,
}: {
  faq: FaqState
  agencyId: string; onSaved: (f: FaqState) => void; onDeleted: () => void; isNew?: boolean
}) {
  const [data, setData] = useState(faq)
  const [expanded, setExpanded] = useState(isNew ?? false)
  const [error, setError] = useState('')
  const [isPending, start] = useTransition()

  function handleSave() {
    if (!data.question.trim()) { setError('Question is required'); return }
    if (!data.answer.trim())   { setError('Answer is required'); return }
    setError('')
    start(async () => {
      const result = await saveFaqAsOwner(data)
      if (result.error) { setError(result.error); return }
      onSaved(result.id ? { ...data, id: result.id } : data)
      setExpanded(false)
    })
  }

  function handleDelete() {
    if (!data.id) { onDeleted(); return }
    start(async () => {
      const result = await deleteFaqAsOwner(data.id!)
      if (result.error) { setError(result.error); return }
      onDeleted()
    })
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <p className="text-[13px] font-medium text-slate-700 line-clamp-1">{data.question || 'New FAQ'}</p>
        {expanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
      </div>
      {expanded && (
        <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
          <Field label="Question *">
            <input value={data.question} onChange={e => setData(d => ({ ...d, question: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Answer *">
            <textarea value={data.answer} onChange={e => setData(d => ({ ...d, answer: e.target.value }))} rows={3} className={textareaCls} />
          </Field>
          {error && <p className="text-[12px] text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={handleSave} disabled={isPending}
              className="flex items-center gap-1.5 px-4 h-8 bg-primary text-white text-[12.5px] font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
            </button>
            <button type="button" onClick={handleDelete} disabled={isPending}
              className="flex items-center gap-1.5 px-3 h-8 border border-red-200 text-red-600 text-[12.5px] font-semibold rounded-lg hover:bg-red-50 disabled:opacity-60 transition-colors">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Tag Input ────────────────────────────────────────────────────────────── */

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('')
  function addTag() {
    const t = input.trim()
    if (t && !value.includes(t)) onChange([...value, t])
    setInput('')
  }
  return (
    <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg min-h-[38px]">
      {value.map(tag => (
        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[12px] font-medium rounded-full">
          {tag}
          <button type="button" onClick={() => onChange(value.filter(t => t !== tag))}><X size={10} /></button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
        onBlur={addTag}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] text-[13px] text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
      />
    </div>
  )
}

/* ─── Main Form ────────────────────────────────────────────────────────────── */

export function AgencyOwnerEditForm({
  agency: initialAgency,
  branches: initialBranches,
  faqs: initialFaqs,
}: {
  agency: AgencyRow
  branches: BranchRow[]
  faqs: FaqRow[]
}) {
  const router = useRouter()

  // ── Agency state ────────────────────────────────────────────────
  const [a, setA] = useState(initialAgency)
  const [branches, setBranches] = useState<Array<OwnerBranchInput & { id?: string }>>(
    initialBranches.map(b => ({
      id: b.id, agency_id: b.agency_id,
      name: b.name ?? '', address: b.address ?? '',
      city: b.city ?? '', state: b.state ?? '',
      country: b.country ?? undefined,
      phone: b.phone ?? undefined, whatsapp: b.whatsapp ?? undefined,
      email: b.email ?? undefined, google_maps_url: b.google_maps_url ?? undefined,
      is_head_office: b.is_head_office ?? false, office_hours: b.office_hours ?? undefined,
    }))
  )
  const [faqs, setFaqs] = useState<FaqState[]>(initialFaqs.map(f => ({
    id: f.id as string | undefined, agency_id: f.agency_id as string,
    question: (f.question ?? '') as string, answer: (f.answer ?? '') as string,
    sort_order: (f.sort_order ?? 0) as number,
  })))

  // ── Save state ──────────────────────────────────────────────────
  const [isPending, start] = useTransition()
  const [saveError, setSaveError]   = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  function setField(key: string, value: unknown) {
    setA((prev: AgencyRow) => ({ ...prev, [key]: value }))
    setSaveSuccess(false)
  }

  function handleSave() {
    setSaveError(''); setSaveSuccess(false)
    start(async () => {
      const result = await saveAgencyAsOwner({
        id:                            a.id,
        description:                   a.description            ?? undefined,
        tagline:                       a.tagline                ?? undefined,
        website:                       a.website                ?? undefined,
        email:                         a.email                  ?? undefined,
        whatsapp:                      a.whatsapp               ?? undefined,
        logo_url:                      a.logo_url               ?? undefined,
        featured_image_url:            a.featured_image_url     ?? undefined,
        countries:                     a.countries              ?? [],
        services:                      a.services               ?? [],
        exams_supported:               a.exams_supported        ?? [],
        language_training_offered:     a.language_training_offered ?? false,
        post_placement_support:        a.post_placement_support ?? false,
        visa_sponsorship:              a.visa_sponsorship       ?? false,
        average_timeline_months:       a.average_timeline_months ?? undefined,
        pricing_is_free:               a.pricing_is_free        ?? false,
        pricing_min_lakhs:             a.pricing_min_lakhs      ?? undefined,
        pricing_max_lakhs:             a.pricing_max_lakhs      ?? undefined,
        pricing_includes:              a.pricing_includes       ?? [],
        pricing_excludes:              a.pricing_excludes       ?? [],
        pricing_installment_available: a.pricing_installment_available ?? false,
        pricing_installment_note:      a.pricing_installment_note ?? undefined,
        pricing_free_note:             a.pricing_free_note      ?? undefined,
        company_registration_no:       a.company_registration_no ?? undefined,
        company_registration_url:      a.company_registration_url ?? undefined,
        mea_license_no:                a.mea_license_no         ?? undefined,
        mea_license_expiry:            a.mea_license_expiry     ?? undefined,
        mea_license_url:               a.mea_license_url        ?? undefined,
        video_testimonials:            a.video_testimonials     ?? [],
        social_links:                  a.social_links           ?? {},
        current_openings_url:          a.current_openings_url   ?? undefined,
      })
      if (result.error) { setSaveError(result.error); return }
      setSaveSuccess(true)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900">Edit Listing</h1>
          <p className="text-[12.5px] text-slate-400 mt-0.5">{a.name}</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-5 h-9 bg-primary text-white text-[13px] font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save Changes
        </button>
      </div>

      {saveError && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
          <p className="text-[13px] text-red-700">{saveError}</p>
        </div>
      )}
      {saveSuccess && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
          <p className="text-[13px] text-emerald-700">Changes saved successfully.</p>
        </div>
      )}

      {/* ── Overview ── */}
      <SectionCard title="Overview" icon={<Globe size={14} />}>
        <div className="flex flex-col gap-4">
          <Field label="Tagline" hint="Short one-liner shown under your agency name">
            <input
              value={a.tagline ?? ''}
              onChange={e => setField('tagline', e.target.value)}
              className={inputCls}
              placeholder="e.g. India's Most Trusted Overseas Nursing Consultant"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={a.description ?? ''}
              onChange={e => setField('description', e.target.value)}
              rows={5}
              className={textareaCls}
              placeholder="Tell nurses about your agency — services, experience, success stories..."
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Contact ── */}
      <SectionCard title="Contact Details" icon={<Mail size={14} />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email">
            <input
              value={a.email ?? ''}
              onChange={e => setField('email', e.target.value)}
              className={inputCls}
              placeholder="contact@youragency.com"
              type="email"
            />
          </Field>
          <Field label="Website">
            <input
              value={a.website ?? ''}
              onChange={e => setField('website', e.target.value)}
              className={inputCls}
              placeholder="https://www.youragency.com"
              type="url"
            />
          </Field>
          <Field label="WhatsApp">
            <input
              value={a.whatsapp ?? ''}
              onChange={e => setField('whatsapp', e.target.value)}
              className={inputCls}
              placeholder="+91 98765 43210"
            />
          </Field>
          <Field label="Current Openings URL" hint="Link to your job listings page">
            <input
              value={a.current_openings_url ?? ''}
              onChange={e => setField('current_openings_url', e.target.value)}
              className={inputCls}
              placeholder="https://..."
              type="url"
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Media ── */}
      <SectionCard title="Media" icon={<ImagePlus size={14} />}>
        <div className="grid sm:grid-cols-2 gap-6">
          <OwnerImageUpload
            label="Agency Logo"
            hint="Square format, min 200×200 px"
            currentUrl={a.logo_url ?? ''}
            uploadType="logo"
            onUploaded={url => setField('logo_url', url)}
          />
          <OwnerImageUpload
            label="Featured Image"
            hint="Banner shown at top of your listing — 16:9 ratio recommended"
            currentUrl={a.featured_image_url ?? ''}
            uploadType="featured"
            onUploaded={url => setField('featured_image_url', url)}
          />
        </div>
      </SectionCard>

      {/* ── Services ── */}
      <SectionCard title="Services & Destinations" icon={<Building2 size={14} />}>
        <div className="flex flex-col gap-5">
          <Field label="Destination Countries">
            <ChipMultiSelect
              options={COUNTRY_FILTER_OPTIONS}
              selected={a.countries ?? []}
              onChange={v => setField('countries', v)}
            />
          </Field>
          <Field label="Exams Supported">
            <ChipMultiSelect
              options={COMMON_EXAMS}
              selected={a.exams_supported ?? []}
              onChange={v => setField('exams_supported', v)}
            />
          </Field>
          <Field label="Services Offered">
            <ChipMultiSelect
              options={COMMON_SERVICES}
              selected={a.services ?? []}
              onChange={v => setField('services', v)}
            />
          </Field>
          <div>
            <p className="text-[12px] font-semibold text-slate-600 mb-2">Additional Features</p>
            <div className="flex flex-wrap gap-2">
              <Toggle
                checked={a.visa_sponsorship ?? false}
                onChange={v => setField('visa_sponsorship', v)}
                label="Visa Sponsorship"
              />
              <Toggle
                checked={a.language_training_offered ?? false}
                onChange={v => setField('language_training_offered', v)}
                label="Language Training"
              />
              <Toggle
                checked={a.post_placement_support ?? false}
                onChange={v => setField('post_placement_support', v)}
                label="Post-Placement Support"
              />
            </div>
          </div>
          <Field label="Average Processing Timeline" hint="e.g. 6-8 months">
            <input
              value={a.average_timeline_months ?? ''}
              onChange={e => setField('average_timeline_months', e.target.value)}
              className={`${inputCls} max-w-xs`}
              placeholder="e.g. 6-8 months"
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Pricing ── */}
      <SectionCard title="Pricing" icon={<DollarSign size={14} />}>
        <div className="flex flex-col gap-4">
          <Toggle
            checked={a.pricing_is_free ?? false}
            onChange={v => setField('pricing_is_free', v)}
            label="This service is free to nurses"
          />

          {a.pricing_is_free ? (
            <Field label="Free Note" hint="Explain how you're compensated (e.g. employer pays)">
              <textarea
                value={a.pricing_free_note ?? ''}
                onChange={e => setField('pricing_free_note', e.target.value)}
                rows={2}
                className={textareaCls}
                placeholder="e.g. Our services are fully employer-funded..."
              />
            </Field>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Minimum Fee (₹ Lakhs)" hint="e.g. 1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={a.pricing_min_lakhs ?? ''}
                    onChange={e => setField('pricing_min_lakhs', e.target.value ? parseFloat(e.target.value) : null)}
                    className={inputCls}
                    placeholder="0"
                  />
                </Field>
                <Field label="Maximum Fee (₹ Lakhs)" hint="e.g. 3.0">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={a.pricing_max_lakhs ?? ''}
                    onChange={e => setField('pricing_max_lakhs', e.target.value ? parseFloat(e.target.value) : null)}
                    className={inputCls}
                    placeholder="0"
                  />
                </Field>
              </div>
              <Field label="What's included in the fee" hint="Type and press Enter to add each item">
                <TagInput
                  value={a.pricing_includes ?? []}
                  onChange={v => setField('pricing_includes', v)}
                  placeholder="e.g. OET coaching, visa fees..."
                />
              </Field>
              <Field label="What's NOT included">
                <TagInput
                  value={a.pricing_excludes ?? []}
                  onChange={v => setField('pricing_excludes', v)}
                  placeholder="e.g. airfare, accommodation..."
                />
              </Field>
              <div className="flex flex-col gap-3">
                <Toggle
                  checked={a.pricing_installment_available ?? false}
                  onChange={v => setField('pricing_installment_available', v)}
                  label="Installment option available"
                />
                {a.pricing_installment_available && (
                  <Field label="Installment Note">
                    <input
                      value={a.pricing_installment_note ?? ''}
                      onChange={e => setField('pricing_installment_note', e.target.value)}
                      className={inputCls}
                      placeholder="e.g. 50% upfront, 50% after visa approval"
                    />
                  </Field>
                )}
              </div>
            </>
          )}
        </div>
      </SectionCard>

      {/* ── Documents ── */}
      <SectionCard title="Credentials & Documents" icon={<Shield size={14} />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Company Registration No.">
            <input
              value={a.company_registration_no ?? ''}
              onChange={e => setField('company_registration_no', e.target.value)}
              className={inputCls}
              placeholder="CIN / Reg No."
            />
          </Field>
          <Field label="Registration Certificate URL">
            <input
              value={a.company_registration_url ?? ''}
              onChange={e => setField('company_registration_url', e.target.value)}
              className={inputCls}
              placeholder="https://..."
              type="url"
            />
          </Field>
          <Field label="MEA License No.">
            <input
              value={a.mea_license_no ?? ''}
              onChange={e => setField('mea_license_no', e.target.value)}
              className={inputCls}
              placeholder="MEA/RA/..."
            />
          </Field>
          <Field label="MEA License Expiry">
            <input
              value={a.mea_license_expiry ?? ''}
              onChange={e => setField('mea_license_expiry', e.target.value)}
              className={inputCls}
              type="date"
            />
          </Field>
          <Field label="MEA License Document URL" hint="Link to uploaded certificate">
            <input
              value={a.mea_license_url ?? ''}
              onChange={e => setField('mea_license_url', e.target.value)}
              className={inputCls}
              placeholder="https://..."
              type="url"
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Social & Videos ── */}
      <SectionCard title="Social Media & Videos" icon={<Video size={14} />}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[12px] font-semibold text-slate-600 mb-3">Social Media Links</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {SOCIAL_PLATFORMS.map(platform => (
                <Field key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                  <input
                    value={(a.social_links as Record<string, string>)?.[platform] ?? ''}
                    onChange={e => setField('social_links', {
                      ...(a.social_links ?? {}),
                      [platform]: e.target.value,
                    })}
                    className={inputCls}
                    placeholder={`https://${platform}.com/...`}
                    type="url"
                  />
                </Field>
              ))}
            </div>
          </div>

          <Field label="Video Testimonial URLs" hint="Add YouTube video URLs — press Enter after each">
            <TagInput
              value={a.video_testimonials ?? []}
              onChange={v => setField('video_testimonials', v)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Branches ── */}
      <SectionCard title="Office Branches" icon={<MapPin size={14} />}>
        <div className="flex flex-col gap-3">
          {branches.map((branch, i) => (
            <BranchEditor
              key={branch.id ?? `new-${i}`}
              branch={branch}
              agencyId={a.id}
              onSaved={updated => setBranches(bs => bs.map((b, bi) => bi === i ? updated : b))}
              onDeleted={() => setBranches(bs => bs.filter((_, bi) => bi !== i))}
            />
          ))}
          <button
            type="button"
            onClick={() => setBranches(bs => [...bs, emptyBranch(a.id)])}
            className="flex items-center justify-center gap-2 h-10 border-2 border-dashed border-slate-200 rounded-xl text-[13px] font-medium text-slate-500 hover:border-primary/40 hover:text-primary transition-all"
          >
            <Plus size={15} /> Add Branch
          </button>
        </div>
      </SectionCard>

      {/* ── FAQs ── */}
      <SectionCard title="FAQs" icon={<MessageCircle size={14} />}>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FaqEditor
              key={faq.id ?? `new-faq-${i}`}
              faq={faq}
              agencyId={a.id}
              onSaved={updated => setFaqs(fs => fs.map((f, fi) => fi === i ? updated : f))}
              onDeleted={() => setFaqs(fs => fs.filter((_, fi) => fi !== i))}
            />
          ))}
          <button
            type="button"
            onClick={() => setFaqs(fs => [...fs, { agency_id: a.id, question: '', answer: '', sort_order: fs.length }])}
            className="flex items-center justify-center gap-2 h-10 border-2 border-dashed border-slate-200 rounded-xl text-[13px] font-medium text-slate-500 hover:border-primary/40 hover:text-primary transition-all"
          >
            <Plus size={15} /> Add FAQ
          </button>
        </div>
      </SectionCard>

      {/* Footer save */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 sticky bottom-4">
        {saveError && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={14} />
            <p className="text-[12.5px]">{saveError}</p>
          </div>
        )}
        {saveSuccess && (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle size={14} />
            <p className="text-[12.5px]">Saved successfully</p>
          </div>
        )}
        {!saveError && !saveSuccess && <div />}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-5 h-9 bg-primary text-white text-[13px] font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save Changes
        </button>
      </div>

    </div>
  )
}
