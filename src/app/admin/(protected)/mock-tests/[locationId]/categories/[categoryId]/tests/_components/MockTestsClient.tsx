'use client'

import React, { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Pencil, Trash2, Search, X, AlertTriangle,
  ToggleLeft, ToggleRight, ClipboardList, Clock, HelpCircle, ChevronRight, BarChart2,
  Copy, Archive, Sparkles,
} from 'lucide-react'
import { saveMockTest, deleteMockTest, toggleMockTestStatus, type MockTestInput } from '@/app/actions/admin-mock-tests'
import { cloneMockTest, setTestStatus } from '@/app/actions/admin-advanced'

type MockTest = {
  id: string
  name: string
  slug: string
  duration_minutes: number
  total_questions: number
  passing_percentage: number
  instructions: string
  seo_title: string
  seo_description: string
  is_active: boolean
  created_at: string
  category_id: string
  total_attempts: number
  active_attempts: number
}

type Info = { id: string; name: string }

const inputCls    = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const labelCls    = 'block text-[12px] font-semibold text-slate-600 mb-1'
const textareaCls = inputCls + ' resize-none'

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')
}

function emptyForm(categoryId: string): Omit<MockTestInput, 'id'> {
  return {
    category_id: categoryId, name: '', slug: '',
    duration_minutes: 60, total_questions: 50, passing_percentage: 60,
    instructions: '', seo_title: '', seo_description: '', is_active: true,
  }
}

/* ── Mock Test Modal ────────────────────────────────────────────────── */
function MockTestModal({ initial, categoryId, onClose }: { initial: MockTest | null; categoryId: string; onClose: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState<Omit<MockTestInput, 'id'>>(
    initial
      ? {
          category_id: categoryId, name: initial.name, slug: initial.slug,
          duration_minutes: initial.duration_minutes, total_questions: initial.total_questions,
          passing_percentage: initial.passing_percentage, instructions: initial.instructions,
          seo_title: initial.seo_title, seo_description: initial.seo_description, is_active: initial.is_active,
        }
      : emptyForm(categoryId)
  )
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab]     = useState<'basic' | 'settings' | 'seo'>('basic')

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(p => ({ ...p, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    if (form.duration_minutes < 1) { setError('Duration must be at least 1 minute'); return }
    if (form.passing_percentage < 1 || form.passing_percentage > 100) { setError('Passing % must be between 1 and 100'); return }
    startTransition(async () => {
      const res = await saveMockTest({ ...form, id: initial?.id })
      if (res.error) { setError(res.error); return }
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-[16px] font-bold text-slate-800">{initial ? 'Edit Mock Test' : 'Add Mock Test'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 flex-shrink-0">
          {(['basic', 'settings', 'seo'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`h-10 px-4 text-[12.5px] font-semibold border-b-2 transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
              {t === 'basic' ? 'Basic Info' : t === 'settings' ? 'Settings' : 'SEO'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-[12.5px] text-[#B91C1C]">
              <AlertTriangle size={13} />{error}
            </div>
          )}

          {tab === 'basic' && (
            <>
              <div>
                <label className={labelCls}>Mock Test Name <span className="text-red-500">*</span></label>
                <input className={inputCls} value={form.name}
                  onChange={e => { set('name', e.target.value); if (!initial) set('slug', toSlug(e.target.value)) }}
                  placeholder="DHA Nursing Mock Test 1" />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="dha-nursing-mock-test-1" />
                <p className="text-[11px] text-slate-400 mt-1">Auto-generated. Used in public URL.</p>
              </div>
              <div>
                <label className={labelCls}>Instructions</label>
                <textarea className={textareaCls} rows={4} value={form.instructions}
                  onChange={e => set('instructions', e.target.value)}
                  placeholder="Read each question carefully. You have 60 minutes to complete 50 questions. No negative marking…" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-[13px] font-medium text-slate-700">Active / Published</span>
                <button type="button" onClick={() => set('is_active', !form.is_active)}>
                  {form.is_active ? <ToggleRight size={26} className="text-primary" /> : <ToggleLeft size={26} className="text-slate-300" />}
                </button>
              </div>
            </>
          )}

          {tab === 'settings' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Duration (mins)</label>
                  <input className={inputCls} type="number" min={1} max={360} value={form.duration_minutes}
                    onChange={e => set('duration_minutes', parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <label className={labelCls}>Total Questions</label>
                  <input className={inputCls} type="number" min={1} max={500} value={form.total_questions}
                    onChange={e => set('total_questions', parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <label className={labelCls}>Pass % Required</label>
                  <input className={inputCls} type="number" min={1} max={100} value={form.passing_percentage}
                    onChange={e => set('passing_percentage', parseInt(e.target.value) || 0)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl text-center">
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Time per question</p>
                  <p className="text-[14px] font-bold text-slate-800">
                    {form.total_questions > 0 ? ((form.duration_minutes * 60) / form.total_questions).toFixed(0) : '—'}s
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Pass mark</p>
                  <p className="text-[14px] font-bold text-slate-800">
                    {form.total_questions > 0 ? Math.ceil(form.total_questions * form.passing_percentage / 100) : '—'}/{form.total_questions}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Pass threshold</p>
                  <p className="text-[14px] font-bold text-slate-800">{form.passing_percentage}%</p>
                </div>
              </div>
            </>
          )}

          {tab === 'seo' && (
            <>
              <div>
                <label className={labelCls}>SEO Title</label>
                <input className={inputCls} value={form.seo_title} onChange={e => set('seo_title', e.target.value)}
                  placeholder="Free DHA Nursing Mock Test 1 — 50 Questions" />
                <p className="text-[11px] text-slate-400 mt-1">{form.seo_title.length}/60 chars</p>
              </div>
              <div>
                <label className={labelCls}>SEO Description</label>
                <textarea className={textareaCls} rows={3} value={form.seo_description}
                  onChange={e => set('seo_description', e.target.value)}
                  placeholder="Practice the DHA nursing exam with this free 50-question mock test. Timed, scored, and reviewed." />
                <p className="text-[11px] text-slate-400 mt-1">{form.seo_description.length}/160 chars</p>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 h-9 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl">Cancel</button>
            <button type="submit" disabled={pending} className="flex-1 h-9 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl disabled:opacity-60 transition-colors">
              {pending ? 'Saving…' : initial ? 'Save Changes' : 'Add Mock Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Delete Modal ───────────────────────────────────────────────────── */
function DeleteModal({ name, onConfirm, onCancel, pending }: { name: string; onConfirm: () => void; onCancel: () => void; pending: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-[#B91C1C]" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-800 mb-2">Delete Mock Test?</h3>
        <p className="text-[13px] text-slate-500 mb-5">
          <span className="font-semibold">&ldquo;{name}&rdquo;</span> will be permanently deleted. Questions inside it will also be removed.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 h-9 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl">Cancel</button>
          <button onClick={onConfirm} disabled={pending} className="flex-1 h-9 bg-[#B91C1C] hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl disabled:opacity-60">
            {pending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main ───────────────────────────────────────────────────────────── */
export function MockTestsClient({
  location, category, tests, dbError, isSuperAdmin,
}: {
  location: Info; category: Info; tests: MockTest[]; dbError: string | null; isSuperAdmin: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [search, setSearch]         = useState('')
  const [showAdd, setShowAdd]       = useState(false)
  const [editItem, setEditItem]     = useState<MockTest | null>(null)
  const [deleteItem, setDeleteItem] = useState<MockTest | null>(null)

  const filtered = useMemo(() =>
    tests.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
  , [tests, search])

  function handleDelete() {
    if (!deleteItem) return
    startTransition(async () => {
      await deleteMockTest(deleteItem.id)
      router.refresh()
      setDeleteItem(null)
    })
  }

  function handleToggle(t: MockTest) {
    startTransition(async () => {
      await toggleMockTestStatus(t.id, !t.is_active)
      router.refresh()
    })
  }

  function handleClone(t: MockTest) {
    startTransition(async () => {
      const res = await cloneMockTest(t.id)
      if (res.error) alert(`Clone failed: ${res.error}`)
      else router.refresh()
    })
  }

  function handleArchive(t: MockTest) {
    if (!confirm(`Archive "${t.name}"? It will be hidden from public listings.`)) return
    startTransition(async () => {
      await setTestStatus(t.id, 'archived')
      router.refresh()
    })
  }

  return (
    <>
      {(showAdd || editItem) && (
        <MockTestModal initial={editItem} categoryId={category.id} onClose={() => { setShowAdd(false); setEditItem(null) }} />
      )}
      {deleteItem && (
        <DeleteModal name={deleteItem.name} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} pending={pending} />
      )}

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">{category.name}</h1>
            <p className="text-[13px] text-slate-500">{tests.length} mock test{tests.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            <Plus size={14} /> Add Mock Test
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-slate-400 flex-wrap">
          <a href="/admin/mock-tests" className="hover:text-primary transition-colors font-medium text-slate-600">Mock Tests</a>
          <span>/</span>
          <a href={`/admin/mock-tests/${location.id}/categories`} className="hover:text-primary transition-colors">{location.name}</a>
          <span>/</span>
          <span className="text-slate-600">{category.name}</span>
        </div>

        {dbError && (
          <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[13px] text-[#B91C1C]">{dbError}</div>
        )}

        {/* Stats strip */}
        {tests.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Tests',    value: tests.length,                         icon: <ClipboardList size={16} className="text-primary" /> },
              { label: 'Active',         value: tests.filter(t => t.is_active).length, icon: <span className="w-4 h-4 rounded-full bg-[#22C55E] flex-shrink-0 inline-block" /> },
              { label: 'Avg. Questions', value: tests.length ? Math.round(tests.reduce((s, t) => s + t.total_questions, 0) / tests.length) : 0, icon: <HelpCircle size={16} className="text-slate-400" /> },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                {s.icon}
                <div>
                  <p className="text-[18px] font-bold text-slate-800 leading-none">{s.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mock tests…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {!filtered.length ? (
            <div className="text-center py-16">
              <ClipboardList size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-slate-600 mb-1">{search ? 'No tests match' : 'No mock tests yet'}</p>
              {!search && (
                <button onClick={() => setShowAdd(true)} className="mt-3 inline-flex items-center gap-2 h-9 px-4 bg-primary text-white text-[13px] font-semibold rounded-xl">
                  <Plus size={14} /> Add Mock Test
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-500">Mock Test</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Duration</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Questions</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Pass %</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Attempts</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <ClipboardList size={14} className="text-violet-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{t.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">/{t.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Clock size={12} className="text-slate-400" />
                        {t.duration_minutes} min
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <HelpCircle size={12} className="text-slate-400" />
                        {t.total_questions} Qs
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] font-semibold text-slate-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                        {t.passing_percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-semibold text-slate-800">{t.total_attempts}</span>
                        {t.active_attempts > 0 && (
                          <span className="text-[11px] text-blue-600">{t.active_attempts} active</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => handleToggle(t)} className="hover:opacity-80 transition-opacity">
                        {t.is_active
                          ? <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">Active</span>
                          : <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Inactive</span>}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/mock-tests/${location.id}/categories/${category.id}/tests/${t.id}/questions`}
                          className="inline-flex items-center gap-1.5 h-7 px-3 border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 text-[12px] font-medium rounded-lg transition-colors"
                        >
                          <HelpCircle size={11} /> Questions <ChevronRight size={10} />
                        </a>
                        <a
                          href={`/admin/mock-tests/${location.id}/categories/${category.id}/tests/${t.id}/analytics`}
                          className="inline-flex items-center gap-1.5 h-7 px-3 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[12px] font-medium rounded-lg transition-colors"
                        >
                          <BarChart2 size={11} /> Analytics
                        </a>
                        <a
                          href={`/admin/mock-tests/${location.id}/categories/${category.id}/tests/${t.id}/ai-generator`}
                          className="inline-flex items-center gap-1.5 h-7 px-3 border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 text-[12px] font-medium rounded-lg transition-colors"
                          title="AI Question Generator"
                        >
                          <Sparkles size={11} /> AI
                        </a>
                        <button
                          onClick={() => handleClone(t)}
                          disabled={pending}
                          className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 text-[12px] font-medium rounded-lg transition-colors disabled:opacity-40"
                          title="Clone test"
                        >
                          <Copy size={11} />
                        </button>
                        <button
                          onClick={() => setEditItem(t)}
                          className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-primary/40 hover:bg-primary/5 text-slate-600 hover:text-primary text-[12px] font-medium rounded-lg transition-colors"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        <button
                          onClick={() => handleArchive(t)}
                          disabled={pending}
                          className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-amber-200 hover:bg-amber-50 text-slate-400 hover:text-amber-700 text-[12px] font-medium rounded-lg transition-colors disabled:opacity-40"
                          title="Archive test"
                        >
                          <Archive size={11} />
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => setDeleteItem(t)}
                            className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-[#B91C1C] text-[12px] font-medium rounded-lg transition-colors"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-[12px] text-slate-400 text-center">
            Showing {filtered.length} of {tests.length} mock test{tests.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </>
  )
}
