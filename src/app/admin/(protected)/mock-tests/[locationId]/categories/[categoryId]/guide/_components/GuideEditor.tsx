'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Trash2, AlertTriangle, CheckCircle2, Eye, EyeOff,
  GripVertical, ExternalLink,
} from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import {
  saveGuideContent,
  type GuideInput,
  type GuideFaq,
  type GuideLink,
} from '@/app/actions/admin-guide-content'

const inputCls    = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const labelCls    = 'block text-[12px] font-semibold text-slate-600 mb-1'
const textareaCls = inputCls + ' resize-none leading-relaxed'

type Tab = 'content' | 'faqs' | 'links' | 'destination' | 'author' | 'meta'

type Props = {
  categoryId:   string
  categoryName: string
  locationId:   string
  locationSlug: string
  categorySlug: string
  initial:      GuideInput | null
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'content',     label: 'Guide Content' },
  { id: 'faqs',        label: 'FAQs' },
  { id: 'links',       label: 'Related Links' },
  { id: 'destination', label: 'Destination Cards' },
  { id: 'author',      label: 'Author & Reviewer' },
  { id: 'meta',        label: 'Meta / Dates' },
]

function emptyGuide(categoryId: string): GuideInput {
  return {
    category_id:           categoryId,
    body:                  '',
    last_updated:          '',
    published_date:        '',
    modified_date:         '',
    author:                { name: '', credentials: '', linkedin: '' },
    reviewer:              { name: '', title: '', experience: '', license: '' },
    faqs:                  [],
    related_links:         [],
    destination_overrides: {},
  }
}

export function GuideEditor({ categoryId, categoryName, locationId, locationSlug, categorySlug, initial }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [form, setForm] = useState<GuideInput>(initial ?? emptyGuide(categoryId))
  const [tab, setTab]   = useState<Tab>('content')
  const [preview, setPreview] = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  /* ── helpers ── */
  function setField<K extends keyof GuideInput>(k: K, v: GuideInput[K]) {
    setForm(p => ({ ...p, [k]: v }))
    setSaved(false)
  }

  function setAuthor(k: keyof GuideInput['author'], v: string) {
    setForm(p => ({ ...p, author: { ...p.author, [k]: v } }))
    setSaved(false)
  }

  function setReviewer(k: keyof GuideInput['reviewer'], v: string) {
    setForm(p => ({ ...p, reviewer: { ...p.reviewer, [k]: v } }))
    setSaved(false)
  }

  /* ── FAQ helpers ── */
  function addFaq() {
    setField('faqs', [...form.faqs, { q: '', a: '' }])
  }
  function removeFaq(i: number) {
    setField('faqs', form.faqs.filter((_, idx) => idx !== i))
  }
  function updateFaq(i: number, field: keyof GuideFaq, val: string) {
    setField('faqs', form.faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f))
  }

  /* ── Link helpers ── */
  function addLink() {
    setField('related_links', [...form.related_links, { label: '', href: '' }])
  }
  function removeLink(i: number) {
    setField('related_links', form.related_links.filter((_, idx) => idx !== i))
  }
  function updateLink(i: number, field: keyof GuideLink, val: string) {
    setField('related_links', form.related_links.map((l, idx) => idx === i ? { ...l, [field]: val } : l))
  }

  /* ── Save ── */
  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const res = await saveGuideContent(form, locationId, categorySlug)
      if (res.error) { setError(res.error); return }
      setSaved(true)
      router.refresh()
    })
  }

  const publicUrl = `/mock-tests/${locationSlug}/${categorySlug}`

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900">Guide Content Editor</h1>
          <p className="text-[13px] text-slate-500 mt-1">
            SEO content for <span className="font-semibold text-slate-700">{categoryName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3 border border-slate-200 hover:border-primary/40 text-slate-500 hover:text-primary text-[12.5px] font-medium rounded-xl transition-colors"
          >
            <ExternalLink size={12} /> Preview page
          </a>
          <button
            type="submit"
            disabled={pending}
            className="h-9 px-5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl disabled:opacity-60 transition-colors"
          >
            {pending ? 'Saving…' : 'Save Guide'}
          </button>
        </div>
      </div>

      {/* Status */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[12.5px] text-[#B91C1C]">
          <AlertTriangle size={14} /> {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 p-3 bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl text-[12.5px] text-[#166534]">
          <CheckCircle2 size={14} /> Guide saved successfully.
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`h-11 px-5 text-[12.5px] font-semibold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                tab === t.id
                  ? 'border-primary text-primary bg-primary/[0.03]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
              {t.id === 'faqs'  && form.faqs.length > 0          && <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{form.faqs.length}</span>}
              {t.id === 'links' && form.related_links.length > 0  && <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{form.related_links.length}</span>}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── CONTENT TAB ── */}
          {tab === 'content' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className={labelCls}>Guide Body (Markdown)</label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Use ## for H2 headings, ### for H3, **bold**, *italic*, | tables |, ![alt](/image.png)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreview(p => !p)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 border border-slate-200 hover:border-slate-300 text-slate-500 text-[12px] font-medium rounded-lg transition-colors flex-shrink-0"
                >
                  {preview ? <><EyeOff size={12} /> Edit</> : <><Eye size={12} /> Preview</>}
                </button>
              </div>

              {preview ? (
                <div className="min-h-[500px] p-5 border border-slate-200 rounded-xl bg-white prose-like overflow-auto">
                  {form.body ? (
                    <Markdown
                      options={{
                        overrides: {
                          h2: { component: ({ children }) => <h2 className="text-[18px] font-bold text-slate-800 mt-6 mb-3 pb-2 border-b border-slate-100">{children}</h2> },
                          h3: { component: ({ children }) => <h3 className="text-[15px] font-bold text-slate-700 mt-4 mb-2">{children}</h3> },
                          p:  { component: ({ children }) => <p  className="text-[13.5px] text-slate-600 leading-relaxed mb-3">{children}</p> },
                          table: { component: ({ children }) => <div className="overflow-x-auto mb-4 rounded-lg border border-slate-200"><table className="w-full text-[13px]">{children}</table></div> },
                          th: { component: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-slate-700 bg-slate-50 border-b border-slate-200">{children}</th> },
                          td: { component: ({ children }) => <td className="px-3 py-2 text-slate-600 border-b border-slate-100">{children}</td> },
                          ul: { component: ({ children }) => <ul className="ml-4 mb-3 list-disc text-[13.5px] text-slate-600 space-y-1">{children}</ul> },
                          strong: { component: ({ children }) => <strong className="font-semibold text-slate-800">{children}</strong> },
                        },
                        forceBlock: true,
                      }}
                    >
                      {form.body}
                    </Markdown>
                  ) : (
                    <p className="text-[13px] text-slate-400 italic">Nothing to preview yet. Start writing in Edit mode.</p>
                  )}
                </div>
              ) : (
                <textarea
                  className={textareaCls}
                  rows={28}
                  value={form.body}
                  onChange={e => setField('body', e.target.value)}
                  placeholder={`## Introduction\n\nWrite your guide content here using Markdown...\n\n## What is the Exam?\n\nExplain the exam here.\n\n## Exam Pattern\n\n| Item | Details |\n|------|--------|\n| Questions | 150 |\n| Duration | 165 min |`}
                  style={{ fontFamily: 'monospace', fontSize: '13px' }}
                />
              )}
              <p className="text-[11px] text-slate-400">
                {form.body.split(/\s+/).filter(Boolean).length} words · {form.body.length} chars
              </p>
            </div>
          )}

          {/* ── FAQs TAB ── */}
          {tab === 'faqs' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={labelCls}>FAQ Items</p>
                  <p className="text-[11px] text-slate-400">These render as an expandable accordion on the public page and generate FAQ schema for Google.</p>
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="inline-flex items-center gap-1.5 h-8 px-3 bg-primary/10 hover:bg-primary/20 text-primary text-[12px] font-semibold rounded-lg transition-colors flex-shrink-0"
                >
                  <Plus size={13} /> Add FAQ
                </button>
              </div>

              {form.faqs.length === 0 && (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-[13px] text-slate-400">No FAQs yet. Click &ldquo;Add FAQ&rdquo; to start.</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {form.faqs.map((faq, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 flex gap-3">
                    <GripVertical size={16} className="text-slate-300 mt-1 flex-shrink-0" />
                    <div className="flex-1 flex flex-col gap-3">
                      <div>
                        <label className={labelCls}>Question {i + 1}</label>
                        <input
                          className={inputCls}
                          value={faq.q}
                          onChange={e => updateFaq(i, 'q', e.target.value)}
                          placeholder="What is the DHA nursing exam?"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Answer</label>
                        <textarea
                          className={textareaCls}
                          rows={3}
                          value={faq.a}
                          onChange={e => updateFaq(i, 'a', e.target.value)}
                          placeholder="Write a clear, complete answer…"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFaq(i)}
                      className="text-slate-300 hover:text-[#B91C1C] transition-colors mt-1 flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {form.faqs.length > 0 && (
                <button
                  type="button"
                  onClick={addFaq}
                  className="w-full h-10 border border-dashed border-slate-300 hover:border-primary/40 text-slate-400 hover:text-primary text-[13px] font-medium rounded-xl transition-colors"
                >
                  + Add another FAQ
                </button>
              )}
            </div>
          )}

          {/* ── LINKS TAB ── */}
          {tab === 'links' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={labelCls}>Related Links</p>
                  <p className="text-[11px] text-slate-400">Internal links shown at the bottom of the guide — use relative paths like /salary/dubai</p>
                </div>
                <button
                  type="button"
                  onClick={addLink}
                  className="inline-flex items-center gap-1.5 h-8 px-3 bg-primary/10 hover:bg-primary/20 text-primary text-[12px] font-semibold rounded-lg transition-colors flex-shrink-0"
                >
                  <Plus size={13} /> Add Link
                </button>
              </div>

              {form.related_links.length === 0 && (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-[13px] text-slate-400">No links yet. Click &ldquo;Add Link&rdquo; to start.</p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {form.related_links.map((link, i) => (
                  <div key={i} className="flex items-center gap-3 border border-slate-200 rounded-xl p-4">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Label</label>
                        <input
                          className={inputCls}
                          value={link.label}
                          onChange={e => updateLink(i, 'label', e.target.value)}
                          placeholder="Dubai Nurse Salary Guide"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>URL Path</label>
                        <input
                          className={inputCls}
                          value={link.href}
                          onChange={e => updateLink(i, 'href', e.target.value)}
                          placeholder="/salary/dubai"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(i)}
                      className="text-slate-300 hover:text-[#B91C1C] transition-colors flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DESTINATION CARDS TAB ── */}
          {tab === 'destination' && (
            <div className="flex flex-col gap-6">
              <div>
                <p className={labelCls}>Destination Link Cards — Manual Override</p>
                <p className="text-[11px] text-slate-400 mb-4">
                  These 4 cards are auto-generated from the exam type. Leave a field blank to keep the auto value. Fill it in to override with your own label/link.
                </p>
              </div>

              {/* Country Guide override */}
              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-bold text-slate-700 mb-3">1. Migration Guide Card</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Label (e.g. Dubai, UAE)</label>
                    <input className={inputCls} value={form.destination_overrides?.country?.label ?? ''}
                      onChange={e => setField('destination_overrides', { ...form.destination_overrides, country: { label: e.target.value, href: form.destination_overrides?.country?.href ?? '' } })}
                      placeholder="Auto-generated" />
                  </div>
                  <div>
                    <label className={labelCls}>Link (e.g. /country/dubai)</label>
                    <input className={inputCls} value={form.destination_overrides?.country?.href ?? ''}
                      onChange={e => setField('destination_overrides', { ...form.destination_overrides, country: { label: form.destination_overrides?.country?.label ?? '', href: e.target.value } })}
                      placeholder="Auto-generated" />
                  </div>
                </div>
              </div>

              {/* Salary Guide override */}
              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-bold text-slate-700 mb-3">2. Salary Guide Card</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Label (e.g. Nurse Salaries)</label>
                    <input className={inputCls} value={form.destination_overrides?.salary?.label ?? ''}
                      onChange={e => setField('destination_overrides', { ...form.destination_overrides, salary: { label: e.target.value, href: form.destination_overrides?.salary?.href ?? '' } })}
                      placeholder="Auto-generated" />
                  </div>
                  <div>
                    <label className={labelCls}>Link (e.g. /salary/dubai)</label>
                    <input className={inputCls} value={form.destination_overrides?.salary?.href ?? ''}
                      onChange={e => setField('destination_overrides', { ...form.destination_overrides, salary: { label: form.destination_overrides?.salary?.label ?? '', href: e.target.value } })}
                      placeholder="Auto-generated" />
                  </div>
                </div>
              </div>

              {/* Eligibility override */}
              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-bold text-slate-700 mb-3">3. Eligibility Card</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Label (e.g. Check Eligibility)</label>
                    <input className={inputCls} value={form.destination_overrides?.eligibility?.label ?? ''}
                      onChange={e => setField('destination_overrides', { ...form.destination_overrides, eligibility: { label: e.target.value, href: form.destination_overrides?.eligibility?.href ?? '/eligibility' } })}
                      placeholder="Check Eligibility" />
                  </div>
                  <div>
                    <label className={labelCls}>Link</label>
                    <input className={inputCls} value={form.destination_overrides?.eligibility?.href ?? ''}
                      onChange={e => setField('destination_overrides', { ...form.destination_overrides, eligibility: { label: form.destination_overrides?.eligibility?.label ?? 'Check Eligibility', href: e.target.value } })}
                      placeholder="/eligibility" />
                  </div>
                </div>
              </div>

              {/* Official authority override */}
              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-bold text-slate-700 mb-3">4. Official Source Card (amber card)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Portal Name (e.g. DHA Sheryan Portal)</label>
                    <input className={inputCls} value={form.destination_overrides?.authority?.name ?? ''}
                      onChange={e => setField('destination_overrides', { ...form.destination_overrides, authority: { name: e.target.value, url: form.destination_overrides?.authority?.url ?? '' } })}
                      placeholder="Auto-generated from exam type" />
                  </div>
                  <div>
                    <label className={labelCls}>Full URL (https://...)</label>
                    <input className={inputCls} value={form.destination_overrides?.authority?.url ?? ''}
                      onChange={e => setField('destination_overrides', { ...form.destination_overrides, authority: { name: form.destination_overrides?.authority?.name ?? '', url: e.target.value } })}
                      placeholder="Auto-generated from exam type" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Tip: Only fill in the fields you want to change. Empty fields fall back to the auto-generated values based on exam type and location.
              </p>
            </div>
          )}

          {/* ── AUTHOR & REVIEWER TAB ── */}
          {tab === 'author' && (
            <div className="flex flex-col gap-6">
              {/* Author */}
              <div>
                <h3 className="text-[14px] font-bold text-slate-800 mb-4">Author</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input className={inputCls} value={form.author.name} onChange={e => setAuthor('name', e.target.value)} placeholder="Dr. Priya Menon" />
                  </div>
                  <div>
                    <label className={labelCls}>Credentials</label>
                    <input className={inputCls} value={form.author.credentials} onChange={e => setAuthor('credentials', e.target.value)} placeholder="BSc Nursing, 8 years ICU" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>LinkedIn URL (optional)</label>
                    <input className={inputCls} value={form.author.linkedin} onChange={e => setAuthor('linkedin', e.target.value)} placeholder="https://linkedin.com/in/username" />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Reviewer */}
              <div>
                <h3 className="text-[14px] font-bold text-slate-800 mb-1">Clinical Reviewer</h3>
                <p className="text-[12px] text-slate-400 mb-4">Shown in the &ldquo;Clinically Reviewed By&rdquo; box at the bottom of the guide.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Reviewer Name</label>
                    <input className={inputCls} value={form.reviewer.name} onChange={e => setReviewer('name', e.target.value)} placeholder="Arun Thomas RN" />
                  </div>
                  <div>
                    <label className={labelCls}>Title / Role</label>
                    <input className={inputCls} value={form.reviewer.title} onChange={e => setReviewer('title', e.target.value)} placeholder="Senior Nurse, Dubai Hospital" />
                  </div>
                  <div>
                    <label className={labelCls}>Experience</label>
                    <input className={inputCls} value={form.reviewer.experience} onChange={e => setReviewer('experience', e.target.value)} placeholder="12 years clinical experience" />
                  </div>
                  <div>
                    <label className={labelCls}>Licence / Credential (optional)</label>
                    <input className={inputCls} value={form.reviewer.license} onChange={e => setReviewer('license', e.target.value)} placeholder="DHA Licensed Practitioner" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── META TAB ── */}
          {tab === 'meta' && (
            <div className="flex flex-col gap-4">
              <p className="text-[12px] text-slate-400">
                These dates appear in the &ldquo;Last Updated&rdquo; bar and are used in the Article schema sent to Google.
                Use ISO format for schema dates (YYYY-MM-DD) and readable format for the display label.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Last Updated (display)</label>
                  <input className={inputCls} value={form.last_updated} onChange={e => setField('last_updated', e.target.value)} placeholder="June 2026" />
                  <p className="text-[11px] text-slate-400 mt-1">Shown as &ldquo;Last Updated: June 2026&rdquo; on the page</p>
                </div>
                <div>
                  <label className={labelCls}>Published Date (schema)</label>
                  <input className={inputCls} value={form.published_date} onChange={e => setField('published_date', e.target.value)} placeholder="2025-01-01" />
                  <p className="text-[11px] text-slate-400 mt-1">ISO date for Google Article schema</p>
                </div>
                <div>
                  <label className={labelCls}>Modified Date (schema)</label>
                  <input className={inputCls} value={form.modified_date} onChange={e => setField('modified_date', e.target.value)} placeholder="2026-06-01" />
                  <p className="text-[11px] text-slate-400 mt-1">ISO date — update this every time you edit the guide</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom save bar */}
      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
        <p className="text-[12.5px] text-slate-500">
          {form.faqs.length} FAQ{form.faqs.length !== 1 ? 's' : ''} · {form.related_links.length} link{form.related_links.length !== 1 ? 's' : ''} · {form.body.split(/\s+/).filter(Boolean).length} words
        </p>
        <button
          type="submit"
          disabled={pending}
          className="h-9 px-6 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl disabled:opacity-60 transition-colors"
        >
          {pending ? 'Saving…' : 'Save Guide'}
        </button>
      </div>
    </form>
  )
}
