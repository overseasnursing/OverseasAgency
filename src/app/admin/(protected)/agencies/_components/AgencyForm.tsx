'use client'

import React, { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Loader2, Plus, X, Save, Trash2, AlertCircle, CheckCircle,
  Building2, MapPin, Mail, Globe, MessageCircle,
  Star, Shield, DollarSign, Users, BookOpen, ChevronDown, ChevronUp,
  Award, Video, Briefcase, ImagePlus, Upload,
} from 'lucide-react'
import {
  saveAgency, deleteAgency, saveBranch, deleteBranch, saveFaq, deleteFaq,
  uploadAgencyAsset,
  type AgencyInput, type BranchInput, type FaqInput,
} from '@/app/actions/admin-agencies'
import { COUNTRY_FILTER_OPTIONS } from '@/lib/data/countryList'

/* ─── Types ─────────────────────────────────────────────────────────── */

export type AgencyFullData = AgencyInput & {
  id: string
  branches: Array<BranchInput & { id: string }>
  faqs: Array<FaqInput & { id: string }>
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

const TRUST_LEVELS = ['verified', 'trusted', 'unverified', 'scam-reported'] as const
const BATCH_TYPES  = ['online', 'offline', 'hybrid'] as const
const COMMON_COUNTRIES = COUNTRY_FILTER_OPTIONS
const COMMON_EXAMS     = ['OET', 'IELTS', 'NCLEX', 'CBT (NMC)', 'DHA', 'HAAD', 'PROMETRIC', 'OSCE']
const COMMON_CERTS     = ['MEA Registered', 'ISO 9001:2015', 'NASSCOM Member', 'APOWS Licensed', 'State Government Approved']

function empty(): AgencyInput {
  return {
    slug: '', name: '', tagline: '', description: '', logo_url: '', featured_image_url: '',
    city: '', state: '', location: '', established: null,
    trust_level: 'unverified', is_active: true, featured: false,
    email: '', website: '', whatsapp: '',
    transparency_score: null, placement_count: 0,
    recommendation_percent: null, visa_success_rate: null,
    average_timeline_months: '', hidden_charges_reported: 0,
    pricing_is_free: false, pricing_free_note: '',
    pricing_min_lakhs: null, pricing_max_lakhs: null, pricing_is_approximate: true,
    pricing_includes: [], pricing_excludes: [],
    pricing_installment_available: false, pricing_installment_note: '',
    pricing_disclaimer: '', pricing_last_updated: '',
    countries: [], exams_supported: [], services: [],
    visa_sponsorship: false, language_training_offered: false, post_placement_support: false,
    related_slugs: [],
    mea_license_no: '', mea_license_expiry: '', company_registration_no: '', certifications: [],
    language_institute_name: '', batch_type: '', class_schedule_note: '',
    video_testimonials: [], social_links: {},
    current_openings_url: '',
    google_place_id: '', google_rating: null, google_review_count: null,
  }
}

/* ─── Sub-components ────────────────────────────────────────────────── */

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-[14px] font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-[12px] text-slate-500">{subtitle}</p>}
      </div>
    </div>
  )
}

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

const inputCls = 'w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const textareaCls = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none'

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2.5 h-9 px-3 rounded-lg border text-[13px] font-medium transition-all ${
        checked ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white border-slate-200 text-slate-500'
      }`}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'bg-primary border-primary' : 'border-slate-300'}`}>
        {checked && <CheckCircle size={10} className="text-white" strokeWidth={3} />}
      </div>
      {label}
    </button>
  )
}

/* ── Image Upload ──────────────────────────────────────────────────── */

function ImageUpload({
  label, hint, currentUrl, onUploaded, agencySlug, type,
}: {
  label: string
  hint?: string
  currentUrl: string
  onUploaded: (url: string) => void
  agencySlug: string
  type: 'logo' | 'featured'
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!agencySlug) { setError('Save the agency first to get a slug, then upload images.'); return }
    setError(''); setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const result = await uploadAgencyAsset(fd, agencySlug, type)
    setUploading(false)
    if (result.error) { setError(result.error); return }
    onUploaded(result.url!)
    // reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = ''
  }

  const isLogo = type === 'logo'
  const previewClass = isLogo
    ? 'w-20 h-20 rounded-xl'
    : 'w-full h-32 rounded-xl'

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold text-slate-600">{label}</label>

      {currentUrl ? (
        <div className={`relative ${previewClass} overflow-hidden border border-slate-200 bg-slate-50 group`}>
          <Image src={currentUrl} alt={label} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-[11px] font-semibold text-slate-700"
            >
              <Upload size={10} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onUploaded('')}
              className="flex items-center gap-1 px-2 py-1 bg-red-600 rounded-lg text-[11px] font-semibold text-white"
            >
              <X size={10} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`${isLogo ? 'w-20 h-20' : 'w-full h-32'} rounded-xl border-2 border-dashed border-slate-300 hover:border-primary/50 bg-slate-50 hover:bg-primary/5 flex flex-col items-center justify-center gap-1.5 transition-all disabled:opacity-50`}
        >
          {uploading
            ? <Loader2 size={18} className="animate-spin text-primary" />
            : <><ImagePlus size={18} className="text-slate-400" /><span className="text-[11px] text-slate-400 font-medium">{isLogo ? 'Upload Logo' : 'Upload Image'}</span></>
          }
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {uploading && <p className="text-[11px] text-primary">Uploading…</p>}
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

/* ── Tag Input ────────────────────────────────────────────────────── */

function TagInput({ values, onChange, placeholder, suggestions }: {
  values: string[]; onChange: (v: string[]) => void; placeholder?: string; suggestions?: string[]
}) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  function add(val: string) {
    const parts = val.split(/,(?! )/).map(s => s.trim()).filter(s => s && !values.includes(s))
    if (parts.length) onChange([...values, ...parts])
    setInput(''); setShowSuggestions(false)
  }

  const filtered = suggestions?.filter(s => !values.includes(s) && s.toLowerCase().includes(input.toLowerCase())) ?? []

  return (
    <div className="flex flex-col gap-2">
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map(v => (
            <span key={v} className="flex items-center gap-1 text-[12px] font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              {v}
              <button type="button" onClick={() => onChange(values.filter(x => x !== v))} className="hover:text-red-600 transition-colors ml-0.5"><X size={10} strokeWidth={3} /></button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <div className="flex gap-2">
          <input type="text" value={input}
            onChange={e => { setInput(e.target.value); setShowSuggestions(true) }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (input.trim()) add(input) } }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={placeholder ?? 'Type and press Enter'} className={inputCls}
          />
          <button type="button" onClick={() => { if (input.trim()) add(input) }}
            className="h-9 px-3 border border-slate-200 hover:border-primary/40 rounded-lg text-slate-500 hover:text-primary transition-colors flex-shrink-0">
            <Plus size={14} />
          </button>
        </div>
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute z-10 top-full mt-1 left-0 right-12 bg-white border border-slate-200 rounded-lg shadow-md py-1 max-h-40 overflow-y-auto">
            {filtered.map(s => (
              <button key={s} type="button" onMouseDown={() => add(s)}
                className="w-full text-left px-3 py-1.5 text-[12.5px] text-slate-700 hover:bg-slate-50 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Branch Editor ─────────────────────────────────────────────────── */

function emptyBranch(agencyId: string): BranchInput & { id?: string } {
  return { agency_id: agencyId, name: '', address: '', city: '', state: '', country: 'India', phone: '', whatsapp: '', email: '', google_maps_url: '', is_head_office: false, office_hours: '' }
}

function BranchFields({ data, onChange }: { data: BranchInput; onChange: (d: BranchInput) => void }) {
  const f = <K extends keyof BranchInput>(k: K) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, [k]: e.target.value })
  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      <Field label="Branch Name" required><input className={inputCls} value={data.name} onChange={f('name')} placeholder="Head Office — Kochi" /></Field>
      <Field label="Is Head Office"><Toggle checked={data.is_head_office} onChange={v => onChange({ ...data, is_head_office: v })} label="Head Office" /></Field>
      <Field label="Address" required><input className={inputCls} value={data.address} onChange={f('address')} placeholder="123 MG Road" /></Field>
      <Field label="City" required><input className={inputCls} value={data.city} onChange={f('city')} placeholder="Kochi" /></Field>
      <Field label="State" required><input className={inputCls} value={data.state} onChange={f('state')} placeholder="Kerala" /></Field>
      <Field label="Country"><input className={inputCls} value={data.country} onChange={f('country')} placeholder="India" /></Field>
      <Field label="Phone"><input className={inputCls} value={data.phone ?? ''} onChange={f('phone')} placeholder="+91 484 123 4567" /></Field>
      <Field label="WhatsApp"><input className={inputCls} value={data.whatsapp ?? ''} onChange={f('whatsapp')} placeholder="+91 98765 43210" /></Field>
      <Field label="Email"><input className={inputCls} value={data.email ?? ''} onChange={f('email')} placeholder="branch@agency.com" /></Field>
      <Field label="Google Maps URL"><input className={inputCls} value={data.google_maps_url ?? ''} onChange={f('google_maps_url')} placeholder="https://maps.google.com/..." /></Field>
      <div className="col-span-2">
        <Field label="Office Hours" hint="Shown to nurses on the agency page — e.g. Mon–Sat: 9am–6pm, Sun: Closed">
          <input className={inputCls} value={data.office_hours ?? ''} onChange={f('office_hours')} placeholder="Mon–Sat: 9am–6pm, Sun: Closed" />
        </Field>
      </div>
    </div>
  )
}

function BranchEditor({ agencyId, initialBranches }: { agencyId: string; initialBranches: Array<BranchInput & { id: string }> }) {
  const [branches, setBranches] = useState(initialBranches)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<BranchInput>(() => emptyBranch(agencyId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editDrafts, setEditDrafts] = useState<Record<string, BranchInput>>({})

  async function handleAdd() {
    setSaving(true); setError('')
    const result = await saveBranch(draft)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    setBranches(prev => [...prev, { ...draft, id: result.id! }])
    setDraft(emptyBranch(agencyId)); setAdding(false)
  }

  async function handleUpdate(id: string) {
    const d = editDrafts[id]; if (!d) return
    setSaving(true); setError('')
    const result = await saveBranch({ ...d, id })
    setSaving(false)
    if (result.error) { setError(result.error); return }
    setBranches(prev => prev.map(b => b.id === id ? { ...d, id } : b))
    setExpanded(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this branch?')) return
    const result = await deleteBranch(id)
    if (result.error) { setError(result.error); return }
    setBranches(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-[12px] text-red-600">{error}</p>}
      {branches.map(b => (
        <div key={b.id} className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
            <div>
              <span className="text-[13px] font-semibold text-slate-700">{b.name || 'Unnamed branch'}</span>
              {b.is_head_office && <span className="ml-2 text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">HEAD OFFICE</span>}
              <span className="text-[12px] text-slate-400 ml-2">{b.city}, {b.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => {
                if (expanded === b.id) { setExpanded(null) } else {
                  setExpanded(b.id); setEditDrafts(prev => ({ ...prev, [b.id]: { ...b } }))
                }
              }} className="h-7 px-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:border-primary/40 transition-colors flex items-center gap-1">
                {expanded === b.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Edit
              </button>
              <button type="button" onClick={() => handleDelete(b.id)} className="h-7 px-2.5 border border-red-200 text-red-500 rounded-lg text-[12px] hover:bg-red-50 transition-colors"><Trash2 size={12} /></button>
            </div>
          </div>
          {expanded === b.id && editDrafts[b.id] && (
            <div className="px-4 pb-4">
              <BranchFields data={editDrafts[b.id]} onChange={d => setEditDrafts(prev => ({ ...prev, [b.id]: d }))} />
              <button type="button" onClick={() => handleUpdate(b.id)} disabled={saving}
                className="mt-3 flex items-center gap-1.5 h-8 px-4 bg-primary text-white text-[12.5px] font-semibold rounded-lg disabled:opacity-50">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save Branch
              </button>
            </div>
          )}
        </div>
      ))}
      {adding ? (
        <div className="border border-dashed border-primary/40 rounded-xl p-4">
          <p className="text-[13px] font-semibold text-slate-700 mb-1">New Branch</p>
          <BranchFields data={draft} onChange={setDraft} />
          <div className="flex gap-2 mt-3">
            <button type="button" onClick={handleAdd} disabled={saving || !draft.name || !draft.city}
              className="flex items-center gap-1.5 h-8 px-4 bg-primary text-white text-[12.5px] font-semibold rounded-lg disabled:opacity-50">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Add Branch
            </button>
            <button type="button" onClick={() => setAdding(false)} className="h-8 px-3 border border-slate-200 text-slate-500 text-[12.5px] rounded-lg hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)}
          className="flex items-center gap-2 h-9 px-4 border border-dashed border-slate-300 hover:border-primary/50 text-slate-500 hover:text-primary text-[13px] rounded-xl transition-colors">
          <Plus size={14} /> Add Branch
        </button>
      )}
    </div>
  )
}

/* ─── FAQ Editor ────────────────────────────────────────────────────── */

function FaqEditor({ agencyId, initialFaqs }: { agencyId: string; initialFaqs: Array<FaqInput & { id: string }> }) {
  const [faqs, setFaqs] = useState(initialFaqs)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<{ question: string; answer: string }>({ question: '', answer: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editDrafts, setEditDrafts] = useState<Record<string, { question: string; answer: string }>>({})

  async function handleAdd() {
    if (!draft.question || !draft.answer) return
    setSaving(true); setError('')
    const result = await saveFaq({ agency_id: agencyId, question: draft.question, answer: draft.answer, sort_order: faqs.length })
    setSaving(false)
    if (result.error) { setError(result.error); return }
    setFaqs(prev => [...prev, { agency_id: agencyId, question: draft.question, answer: draft.answer, sort_order: prev.length, id: result.id! }])
    setDraft({ question: '', answer: '' }); setAdding(false)
  }

  async function handleUpdate(id: string, idx: number) {
    const d = editDrafts[id]; if (!d) return
    setSaving(true); setError('')
    const result = await saveFaq({ agency_id: agencyId, ...d, sort_order: idx, id })
    setSaving(false)
    if (result.error) { setError(result.error); return }
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...d } : f))
    setEditId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    const result = await deleteFaq(id)
    if (result.error) { setError(result.error); return }
    setFaqs(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-[12px] text-red-600">{error}</p>}
      {faqs.map((f, idx) => (
        <div key={f.id} className="border border-slate-200 rounded-xl overflow-hidden">
          {editId === f.id ? (
            <div className="p-4">
              <Field label="Question" required><input className={inputCls} value={editDrafts[f.id]?.question ?? ''} onChange={e => setEditDrafts(prev => ({ ...prev, [f.id]: { ...prev[f.id], question: e.target.value } }))} /></Field>
              <div className="mt-3"><Field label="Answer" required><textarea className={textareaCls} rows={3} value={editDrafts[f.id]?.answer ?? ''} onChange={e => setEditDrafts(prev => ({ ...prev, [f.id]: { ...prev[f.id], answer: e.target.value } }))} /></Field></div>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => handleUpdate(f.id, idx)} disabled={saving}
                  className="flex items-center gap-1.5 h-8 px-4 bg-primary text-white text-[12.5px] font-semibold rounded-lg disabled:opacity-50">
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                </button>
                <button type="button" onClick={() => setEditId(null)} className="h-8 px-3 border border-slate-200 text-slate-500 text-[12.5px] rounded-lg">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-700 mb-0.5">{f.question}</p>
                <p className="text-[12px] text-slate-500 line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button type="button" onClick={() => { setEditId(f.id); setEditDrafts(prev => ({ ...prev, [f.id]: { question: f.question, answer: f.answer } })) }}
                  className="h-7 px-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:border-primary/40 transition-colors">Edit</button>
                <button type="button" onClick={() => handleDelete(f.id)} className="h-7 px-2.5 border border-red-200 text-red-500 rounded-lg text-[12px] hover:bg-red-50 transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
      {adding ? (
        <div className="border border-dashed border-primary/40 rounded-xl p-4 flex flex-col gap-3">
          <Field label="Question" required><input className={inputCls} value={draft.question} onChange={e => setDraft(p => ({ ...p, question: e.target.value }))} placeholder="e.g. How long does the process take?" /></Field>
          <Field label="Answer" required><textarea className={textareaCls} rows={3} value={draft.answer} onChange={e => setDraft(p => ({ ...p, answer: e.target.value }))} placeholder="The process typically takes..." /></Field>
          <div className="flex gap-2">
            <button type="button" onClick={handleAdd} disabled={saving || !draft.question || !draft.answer}
              className="flex items-center gap-1.5 h-8 px-4 bg-primary text-white text-[12.5px] font-semibold rounded-lg disabled:opacity-50">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Add FAQ
            </button>
            <button type="button" onClick={() => setAdding(false)} className="h-8 px-3 border border-slate-200 text-slate-500 text-[12.5px] rounded-lg">Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)}
          className="flex items-center gap-2 h-9 px-4 border border-dashed border-slate-300 hover:border-primary/50 text-slate-500 hover:text-primary text-[13px] rounded-xl transition-colors">
          <Plus size={14} /> Add FAQ
        </button>
      )}
    </div>
  )
}

/* ─── Main Form ─────────────────────────────────────────────────────── */

export default function AgencyForm({ initialData }: { initialData: AgencyFullData | null }) {
  const isEdit = !!initialData
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<AgencyInput>(initialData ?? empty())
  const [saveResult, setSaveResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  function set<K extends keyof AgencyInput>(k: K, v: AgencyInput[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function handleCityOrState(k: 'city' | 'state', v: string) {
    setForm(prev => {
      const updated = { ...prev, [k]: v }
      const city  = k === 'city'  ? v : prev.city
      const state = k === 'state' ? v : prev.state
      if (city && state && (!prev.location || prev.location === `${prev.city}, ${prev.state}`)) {
        updated.location = `${city}, ${state}`
      }
      return updated
    })
  }

  function handleNameChange(v: string) {
    setForm(prev => ({
      ...prev, name: v,
      slug: isEdit ? prev.slug : v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaveResult(null)
    startTransition(async () => {
      const result = await saveAgency({ ...form, id: initialData?.id })
      if (result.error) {
        setSaveResult({ ok: false, msg: result.error })
      } else {
        setSaveResult({ ok: true, msg: isEdit ? 'Agency saved successfully.' : 'Agency created successfully.' })
        if (!isEdit && result.slug) router.push(`/admin/agencies/${result.slug}`)
      }
    })
  }

  async function handleDelete() {
    if (!initialData?.id) return
    if (!confirm(`Delete "${form.name}"? This cannot be undone.`)) return
    setDeleting(true)
    const result = await deleteAgency(initialData.id)
    setDeleting(false)
    if (result.error) { setSaveResult({ ok: false, msg: result.error }); return }
    router.push('/admin/agencies')
  }

  const sectionCls = 'bg-white border border-slate-200 rounded-2xl p-6'
  const num = (v: number | null) => v === null ? '' : String(v)
  const parseNum = (v: string): number | null => v === '' ? null : Number(v)
  const slug = form.slug || 'new-agency'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* ── Status bar ── */}
      {saveResult && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium ${saveResult.ok ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#B91C1C]'}`}>
          {saveResult.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {saveResult.msg}
        </div>
      )}

      {/* ══ 1. Identity + Images ═══════════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<Building2 size={16} />} title="Agency Identity & Images" subtitle="Core info, logo, and featured photo" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Agency Name" required>
            <input className={inputCls} value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Global Nursing Solutions" required />
          </Field>
          <Field label="URL Slug" required hint="Used in URL: /agency/[slug]">
            <input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="global-nursing-solutions" required />
          </Field>
          <Field label="Tagline" hint="Short one-liner shown on listing cards">
            <input className={inputCls} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Trusted by 1,400+ nurses for Germany placements" />
          </Field>
          <div /> {/* spacer */}

          {/* Image uploads side-by-side */}
          <div className="col-span-2 grid grid-cols-2 gap-6 pt-2 border-t border-slate-100 mt-2">
            <ImageUpload
              label="Agency Logo"
              hint="Square image, min 200×200px. PNG or JPG. Max 5 MB."
              currentUrl={form.logo_url}
              onUploaded={url => set('logo_url', url)}
              agencySlug={slug}
              type="logo"
            />
            <ImageUpload
              label="Featured Image"
              hint="Landscape image, min 800×400px. Shown on listing cards and above the About section."
              currentUrl={form.featured_image_url}
              onUploaded={url => set('featured_image_url', url)}
              agencySlug={slug}
              type="featured"
            />
          </div>

          <div className="col-span-2">
            <Field label="Full Description" hint="Shown in the About section of the agency profile">
              <textarea className={textareaCls} rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe what makes this agency unique, their process, track record, and specialisations..." />
            </Field>
          </div>
        </div>
      </div>

      {/* ══ 2. Location ════════════════════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<MapPin size={16} />} title="Location" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" required><input className={inputCls} value={form.city} onChange={e => handleCityOrState('city', e.target.value)} placeholder="Kochi" required /></Field>
          <Field label="State" required><input className={inputCls} value={form.state} onChange={e => handleCityOrState('state', e.target.value)} placeholder="Kerala" required /></Field>
          <Field label="Location Display" hint="Auto-filled from city + state. Edit if needed."><input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Kochi, Kerala" /></Field>
          <Field label="Established Year"><input className={inputCls} type="number" value={num(form.established)} onChange={e => set('established', parseNum(e.target.value))} placeholder="2010" min={1980} max={2030} /></Field>
        </div>
      </div>

      {/* ══ 3. Status & Trust ══════════════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<Shield size={16} />} title="Status & Trust Level" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Trust Level" required>
            <select className={inputCls} value={form.trust_level} onChange={e => set('trust_level', e.target.value as AgencyInput['trust_level'])}>
              {TRUST_LEVELS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
            </select>
          </Field>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-slate-600">Flags</label>
            <div className="flex gap-2 flex-wrap">
              <Toggle checked={form.is_active} onChange={v => set('is_active', v)} label="Active (public)" />
              <Toggle checked={form.featured} onChange={v => set('featured', v)} label="Featured" />
            </div>
          </div>
        </div>
      </div>

      {/* ══ 4. Legal & Credentials ═════════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<Award size={16} />} title="Legal & Credentials" subtitle="MEA license, registration numbers, certifications — critical for E-E-A-T trust signals" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="MEA License No." hint="Ministry of External Affairs Recruitment Agent License (e.g. B-0001/KER/PER/1000+/5/9999)">
            <input className={inputCls} value={form.mea_license_no} onChange={e => set('mea_license_no', e.target.value)} placeholder="B-0001/KER/PER/1000+/5/9999" />
          </Field>
          <Field label="MEA License Expiry" hint="Date the license expires">
            <input className={inputCls} type="date" value={form.mea_license_expiry} onChange={e => set('mea_license_expiry', e.target.value)} />
          </Field>
          <Field label="Company Registration No." hint="ROC / MCA company registration number">
            <input className={inputCls} value={form.company_registration_no} onChange={e => set('company_registration_no', e.target.value)} placeholder="U85100KL2011PTC023456" />
          </Field>
          <div />
          <div className="col-span-2">
            <Field label="Certifications & Accreditations" hint="Press Enter to add each certificate">
              <TagInput values={form.certifications} onChange={v => set('certifications', v)} placeholder="MEA Registered, ISO 9001:2015..." suggestions={COMMON_CERTS} />
            </Field>
          </div>
        </div>
      </div>

      {/* ══ 5. Contact ═════════════════════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<Mail size={16} />} title="Contact Details" subtitle="Shown on the agency profile page" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <div className="relative"><Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /><input className={`${inputCls} pl-8`} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contact@agency.com" /></div>
          </Field>
          <Field label="WhatsApp Number" hint="Include country code e.g. +91 98765 43210">
            <div className="relative"><MessageCircle size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /><input className={`${inputCls} pl-8`} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+91 98765 43210" /></div>
          </Field>
          <Field label="Website URL">
            <div className="relative"><Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /><input className={`${inputCls} pl-8`} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://agency.com" /></div>
          </Field>
          <Field label="Current Job Openings URL" hint="Link to their job listings page — shown as a CTA on the profile">
            <div className="relative"><Briefcase size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /><input className={`${inputCls} pl-8`} value={form.current_openings_url} onChange={e => set('current_openings_url', e.target.value)} placeholder="https://agency.com/jobs" /></div>
          </Field>
        </div>
      </div>

      {/* ══ 6. Metrics ═════════════════════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<Star size={16} />} title="Performance Metrics" subtitle="Stats shown on profile and listing cards" />
        <div className="grid grid-cols-3 gap-4">
          <Field label="Transparency Score" hint="0 – 100"><input className={inputCls} type="number" min={0} max={100} value={num(form.transparency_score)} onChange={e => set('transparency_score', parseNum(e.target.value))} placeholder="87" /></Field>
          <Field label="Total Placements"><input className={inputCls} type="number" min={0} value={form.placement_count} onChange={e => set('placement_count', Number(e.target.value))} placeholder="1420" /></Field>
          <Field label="Would Recommend %" hint="0 – 100"><input className={inputCls} type="number" min={0} max={100} value={num(form.recommendation_percent)} onChange={e => set('recommendation_percent', parseNum(e.target.value))} placeholder="96" /></Field>
          <Field label="Visa Success Rate %" hint="0 – 100"><input className={inputCls} type="number" min={0} max={100} value={num(form.visa_success_rate)} onChange={e => set('visa_success_rate', parseNum(e.target.value))} placeholder="94" /></Field>
          <Field label="Average Timeline" hint="e.g. 8–12 months"><input className={inputCls} value={form.average_timeline_months} onChange={e => set('average_timeline_months', e.target.value)} placeholder="8–12" /></Field>
          <Field label="Hidden Charges Reported"><input className={inputCls} type="number" min={0} value={form.hidden_charges_reported} onChange={e => set('hidden_charges_reported', Number(e.target.value))} placeholder="0" /></Field>
        </div>
      </div>

      {/* ══ 7. Pricing ═════════════════════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<DollarSign size={16} />} title="Pricing" subtitle="Shown in the pricing section and listing cards" />
        <div className="grid grid-cols-2 gap-4">
          {/* Free placement toggle — spans full width, shown first */}
          <div className="col-span-2">
            <Toggle
              checked={form.pricing_is_free}
              onChange={v => {
                set('pricing_is_free', v)
                if (v) { set('pricing_min_lakhs', null); set('pricing_max_lakhs', null) }
              }}
              label="Free Placement (₹0 — agency charges nothing)"
            />
          </div>

          {/* Free placement note — only shown when free is ticked */}
          {form.pricing_is_free && (
            <div className="col-span-2">
              <Field label="Free Placement Details">
                <textarea
                  className={textareaCls}
                  rows={2}
                  value={form.pricing_free_note}
                  onChange={e => set('pricing_free_note', e.target.value)}
                  placeholder="e.g. No fees charged — agency earns from employer contracts only"
                />
              </Field>
            </div>
          )}

          {/* Price fields — grayed out when free */}
          <Field label="Min Price (Lakhs INR)" hint="e.g. 3.5 = ₹3.5 Lakh">
            <input
              className={inputCls}
              type="number" step={0.1} min={0}
              value={form.pricing_is_free ? '' : num(form.pricing_min_lakhs)}
              onChange={e => set('pricing_min_lakhs', parseNum(e.target.value))}
              placeholder={form.pricing_is_free ? 'Free — not applicable' : '3.5'}
              disabled={form.pricing_is_free}
              style={form.pricing_is_free ? { opacity: 0.4, cursor: 'not-allowed', background: '#f8fafc' } : undefined}
            />
          </Field>
          <Field label="Max Price (Lakhs INR)">
            <input
              className={inputCls}
              type="number" step={0.1} min={0}
              value={form.pricing_is_free ? '' : num(form.pricing_max_lakhs)}
              onChange={e => set('pricing_max_lakhs', parseNum(e.target.value))}
              placeholder={form.pricing_is_free ? 'Free — not applicable' : '5.5'}
              disabled={form.pricing_is_free}
              style={form.pricing_is_free ? { opacity: 0.4, cursor: 'not-allowed', background: '#f8fafc' } : undefined}
            />
          </Field>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-slate-600">Pricing Options</label>
            <div className="flex gap-2 flex-wrap">
              <Toggle checked={form.pricing_is_approximate} onChange={v => set('pricing_is_approximate', v)} label="Approximate pricing" />
              <Toggle checked={form.pricing_installment_available} onChange={v => set('pricing_installment_available', v)} label="Installments available" />
            </div>
          </div>
          {form.pricing_installment_available && (
            <Field label="Installment Note"><input className={inputCls} value={form.pricing_installment_note} onChange={e => set('pricing_installment_note', e.target.value)} placeholder="50% upfront, 50% on visa approval" /></Field>
          )}
          <div className="col-span-2"><Field label="What's Included" hint="Press Enter or + to add"><TagInput values={form.pricing_includes} onChange={v => set('pricing_includes', v)} placeholder="Document preparation, OET coaching..." /></Field></div>
          <div className="col-span-2"><Field label="What's NOT Included" hint="Press Enter or + to add"><TagInput values={form.pricing_excludes} onChange={v => set('pricing_excludes', v)} placeholder="Flight tickets, accommodation..." /></Field></div>
          <Field label="Pricing Last Updated"><input className={inputCls} value={form.pricing_last_updated} onChange={e => set('pricing_last_updated', e.target.value)} placeholder="March 2025" /></Field>
          <div className="col-span-2"><Field label="Pricing Disclaimer"><textarea className={textareaCls} rows={2} value={form.pricing_disclaimer} onChange={e => set('pricing_disclaimer', e.target.value)} placeholder="Prices are indicative..." /></Field></div>
        </div>
      </div>

      {/* ══ 8. Services & Destinations ═════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<Globe size={16} />} title="Services & Destinations" />
        <div className="flex flex-col gap-5">
          <Field label="Destination Countries"><TagInput values={form.countries} onChange={v => set('countries', v)} placeholder="Germany, UK, Australia..." suggestions={COMMON_COUNTRIES} /></Field>
          <Field label="Exams Supported"><TagInput values={form.exams_supported} onChange={v => set('exams_supported', v)} placeholder="OET, IELTS, NCLEX..." suggestions={COMMON_EXAMS} /></Field>
          <Field label="Services Offered"><TagInput values={form.services} onChange={v => set('services', v)} placeholder="OET Coaching, Document Attestation..." /></Field>
          <div>
            <label className="text-[12px] font-semibold text-slate-600 block mb-2">Feature Flags</label>
            <div className="flex gap-2 flex-wrap">
              <Toggle checked={form.visa_sponsorship} onChange={v => set('visa_sponsorship', v)} label="Employer Visa Sponsorship" />
              <Toggle checked={form.language_training_offered} onChange={v => set('language_training_offered', v)} label="Language Training Offered" />
              <Toggle checked={form.post_placement_support} onChange={v => set('post_placement_support', v)} label="Post-Placement Support" />
            </div>
          </div>
        </div>
      </div>

      {/* ══ 9. Language Academy ════════════════════════════════════════ */}
      {form.language_training_offered && (
        <div className={sectionCls}>
          <SectionHeader icon={<BookOpen size={16} />} title="Language Academy Details" subtitle="Shown when Language Training is enabled — captures SEO intent like 'German classes Kochi'" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Institute / Academy Name" hint="Name of the in-house or partner language institute">
              <input className={inputCls} value={form.language_institute_name} onChange={e => set('language_institute_name', e.target.value)} placeholder="Global Language Centre / Goethe-Institut Partner" />
            </Field>
            <Field label="Class Format">
              <select className={inputCls} value={form.batch_type} onChange={e => set('batch_type', e.target.value)}>
                <option value="">— Select format —</option>
                {BATCH_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </Field>
            <div className="col-span-2">
              <Field label="Batch / Schedule Details" hint="Class timings, batch sizes, duration, levels offered (A1–B2), trainer qualifications">
                <textarea className={textareaCls} rows={3} value={form.class_schedule_note} onChange={e => set('class_schedule_note', e.target.value)} placeholder="Morning batches 7–9 AM and evening batches 6–8 PM. Batch size capped at 15. A1 to B2 levels. Trainers are Goethe-Institut certified with 5+ years experience..." />
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* ══ 10. Media & Social Proof ════════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<Video size={16} />} title="Media & Social Proof" subtitle="YouTube testimonial videos and social media links — high conversion trust signals" />
        <div className="flex flex-col gap-5">
          <Field label="YouTube Testimonial Video URLs" hint="Paste full YouTube URLs — e.g. https://youtu.be/xxxxx. Press Enter to add each.">
            <TagInput values={form.video_testimonials} onChange={v => set('video_testimonials', v)} placeholder="https://youtu.be/xxxxx" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Instagram Profile URL">
              <input className={inputCls} value={form.social_links.instagram ?? ''} onChange={e => set('social_links', { ...form.social_links, instagram: e.target.value || undefined })} placeholder="https://instagram.com/agencyname" />
            </Field>
            <Field label="Facebook Page URL">
              <input className={inputCls} value={form.social_links.facebook ?? ''} onChange={e => set('social_links', { ...form.social_links, facebook: e.target.value || undefined })} placeholder="https://facebook.com/agencyname" />
            </Field>
            <Field label="YouTube Channel URL">
              <input className={inputCls} value={form.social_links.youtube ?? ''} onChange={e => set('social_links', { ...form.social_links, youtube: e.target.value || undefined })} placeholder="https://youtube.com/@agencyname" />
            </Field>
            <Field label="LinkedIn Page URL">
              <input className={inputCls} value={form.social_links.linkedin ?? ''} onChange={e => set('social_links', { ...form.social_links, linkedin: e.target.value || undefined })} placeholder="https://linkedin.com/company/agencyname" />
            </Field>
          </div>
        </div>
      </div>

      {/* ══ 11. Google Reviews Fallback ════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<Star size={16} />} title="Google Reviews (Fallback)" subtitle="Shown on the public profile only when there are 0 platform reviews" />
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Field label="Google Place ID" hint='Find it at: Google Maps → search agency → share → "Copy link" — the part after "place/" or use the Place ID Finder'>
              <input className={inputCls} value={form.google_place_id} onChange={e => set('google_place_id', e.target.value)} placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4" />
            </Field>
          </div>
          <Field label="Google Rating" hint="e.g. 4.8">
            <input className={inputCls} type="number" step="0.1" min="1" max="5" value={form.google_rating ?? ''} onChange={e => set('google_rating', e.target.value ? parseFloat(e.target.value) : null)} placeholder="4.8" />
          </Field>
          <Field label="Google Review Count" hint="e.g. 142">
            <input className={inputCls} type="number" min="0" value={form.google_review_count ?? ''} onChange={e => set('google_review_count', e.target.value ? parseInt(e.target.value) : null)} placeholder="142" />
          </Field>
        </div>
      </div>

      {/* ══ 12. Related Agencies ═══════════════════════════════════════ */}
      <div className={sectionCls}>
        <SectionHeader icon={<Users size={16} />} title="Related Agencies" />
        <Field label="Related Agency Slugs" hint="Slugs of similar agencies (press Enter to add)">
          <TagInput values={form.related_slugs} onChange={v => set('related_slugs', v)} placeholder="medworld-overseas, nursepath-international..." />
        </Field>
      </div>

      {/* ══ 12. Branches (edit only) ═══════════════════════════════════ */}
      {isEdit && (
        <div className={sectionCls}>
          <SectionHeader icon={<MapPin size={16} />} title="Office Branches" subtitle="Add all office locations for this agency" />
          <BranchEditor agencyId={initialData.id} initialBranches={initialData.branches} />
        </div>
      )}

      {/* ══ 13. FAQs (edit only) ═══════════════════════════════════════ */}
      {isEdit && (
        <div className={sectionCls}>
          <SectionHeader icon={<BookOpen size={16} />} title="FAQs" subtitle="Frequently asked questions shown on the profile page" />
          <FaqEditor agencyId={initialData.id} initialFaqs={initialData.faqs} />
        </div>
      )}

      {/* ══ Save Bar ═══════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 sticky bottom-4 shadow-card-md">
        <div className="text-[12.5px] text-slate-500">
          {isEdit ? <><span>Editing </span><span className="font-semibold text-slate-700">{form.name}</span></> : 'New agency — branches & FAQs can be added after saving'}
        </div>
        <div className="flex items-center gap-3">
          {isEdit && (
            <button type="button" onClick={handleDelete} disabled={deleting || isPending}
              className="flex items-center gap-1.5 h-9 px-4 border border-red-200 text-red-600 hover:bg-red-50 text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-50">
              {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete Agency
            </button>
          )}
          <a href="/admin/agencies" className="h-9 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13px] font-semibold rounded-xl transition-colors flex items-center">Cancel</a>
          <button type="submit" disabled={isPending || !form.name || !form.slug || !form.city || !form.state}
            className="flex items-center gap-2 h-9 px-5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isEdit ? 'Save Changes' : 'Create Agency'}
          </button>
        </div>
      </div>

    </form>
  )
}
