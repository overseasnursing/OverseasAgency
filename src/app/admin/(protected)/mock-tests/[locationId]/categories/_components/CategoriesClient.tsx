'use client'

import React, { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Search, X, ChevronRight, AlertTriangle, ToggleLeft, ToggleRight, Tag, BookOpen } from 'lucide-react'
import { saveCategory, deleteCategory, toggleCategoryStatus, type CategoryInput } from '@/app/actions/admin-mock-tests'

type Category = {
  id: string
  name: string
  slug: string
  description: string
  seo_title: string
  seo_description: string
  is_active: boolean
  created_at: string
  testCount: number
  location_id: string
}

type LocationInfo = { id: string; name: string; slug: string }

const inputCls    = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const labelCls    = 'block text-[12px] font-semibold text-slate-600 mb-1'
const textareaCls = inputCls + ' resize-none'

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')
}

function emptyForm(locationId: string): Omit<CategoryInput, 'id'> {
  return { location_id: locationId, name: '', slug: '', description: '', seo_title: '', seo_description: '', is_active: true }
}

/* ── Category Modal ─────────────────────────────────────────────────── */
function CategoryModal({ initial, locationId, onClose }: { initial: Category | null; locationId: string; onClose: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState<Omit<CategoryInput, 'id'>>(
    initial
      ? { location_id: locationId, name: initial.name, slug: initial.slug, description: initial.description, seo_title: initial.seo_title, seo_description: initial.seo_description, is_active: initial.is_active }
      : emptyForm(locationId)
  )
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab]     = useState<'basic' | 'seo'>('basic')

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(p => ({ ...p, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    startTransition(async () => {
      const res = await saveCategory({ ...form, id: initial?.id })
      if (res.error) { setError(res.error); return }
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-[16px] font-bold text-slate-800">{initial ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 flex-shrink-0">
          {(['basic', 'seo'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`h-10 px-4 text-[12.5px] font-semibold border-b-2 transition-colors capitalize ${tab === t ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
              {t === 'basic' ? 'Basic Info' : 'SEO'}
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
                <label className={labelCls}>Category Name <span className="text-red-500">*</span></label>
                <input className={inputCls} value={form.name}
                  onChange={e => { set('name', e.target.value); if (!initial) set('slug', toSlug(e.target.value)) }}
                  placeholder="DHA Nursing Mock Test" />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="dha-nursing-mock-test" />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea className={textareaCls} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description…" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-[13px] font-medium text-slate-700">Active</span>
                <button type="button" onClick={() => set('is_active', !form.is_active)}>
                  {form.is_active ? <ToggleRight size={26} className="text-primary" /> : <ToggleLeft size={26} className="text-slate-300" />}
                </button>
              </div>
            </>
          )}

          {tab === 'seo' && (
            <>
              <div>
                <label className={labelCls}>SEO Title</label>
                <input className={inputCls} value={form.seo_title} onChange={e => set('seo_title', e.target.value)} placeholder="DHA Nursing Mock Test — Free Practice" />
                <p className="text-[11px] text-slate-400 mt-1">{form.seo_title.length}/60 chars</p>
              </div>
              <div>
                <label className={labelCls}>SEO Description</label>
                <textarea className={textareaCls} rows={3} value={form.seo_description} onChange={e => set('seo_description', e.target.value)} placeholder="Practice DHA nursing exam with our free mock tests…" />
                <p className="text-[11px] text-slate-400 mt-1">{form.seo_description.length}/160 chars</p>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 h-9 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={pending} className="flex-1 h-9 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl disabled:opacity-60 transition-colors">
              {pending ? 'Saving…' : initial ? 'Save Changes' : 'Add Category'}
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
        <h3 className="text-[16px] font-bold text-slate-800 mb-2">Delete Category?</h3>
        <p className="text-[13px] text-slate-500 mb-5">
          <span className="font-semibold">&ldquo;{name}&rdquo;</span> and all its mock tests will be permanently deleted.
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
export function CategoriesClient({ location, categories, dbError }: { location: LocationInfo; categories: Category[]; dbError: string | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [search, setSearch]         = useState('')
  const [showAdd, setShowAdd]       = useState(false)
  const [editItem, setEditItem]     = useState<Category | null>(null)
  const [deleteItem, setDeleteItem] = useState<Category | null>(null)

  const filtered = useMemo(() =>
    categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  , [categories, search])

  function handleDelete() {
    if (!deleteItem) return
    startTransition(async () => {
      await deleteCategory(deleteItem.id, location.id)
      router.refresh()
      setDeleteItem(null)
    })
  }

  function handleToggle(c: Category) {
    startTransition(async () => {
      await toggleCategoryStatus(c.id, !c.is_active, location.id)
      router.refresh()
    })
  }

  return (
    <>
      {(showAdd || editItem) && (
        <CategoryModal initial={editItem} locationId={location.id} onClose={() => { setShowAdd(false); setEditItem(null) }} />
      )}
      {deleteItem && (
        <DeleteModal name={deleteItem.name} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} pending={pending} />
      )}

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">{location.name}</h1>
            <p className="text-[13px] text-slate-500">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            <Plus size={14} /> Add Category
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <a href="/admin/mock-tests" className="hover:text-primary transition-colors font-medium text-slate-600">Mock Tests</a>
          <span>/</span>
          <span>{location.name}</span>
          <span>/</span>
          <span className="text-slate-600">Categories</span>
        </div>

        {dbError && (
          <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[13px] text-[#B91C1C]">{dbError}</div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {!filtered.length ? (
            <div className="text-center py-16">
              <Tag size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-slate-600 mb-1">{search ? 'No categories match' : 'No categories yet'}</p>
              {!search && (
                <button onClick={() => setShowAdd(true)} className="mt-3 inline-flex items-center gap-2 h-9 px-4 bg-primary text-white text-[13px] font-semibold rounded-xl">
                  <Plus size={14} /> Add Category
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-500">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Mock Tests</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <Tag size={14} className="text-indigo-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">/{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {c.testCount} test{c.testCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => handleToggle(c)} className="hover:opacity-80 transition-opacity">
                        {c.is_active
                          ? <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">Active</span>
                          : <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Inactive</span>}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/mock-tests/${location.id}/categories/${c.id}/tests`}
                          className="inline-flex items-center gap-1.5 h-7 px-3 bg-primary/10 hover:bg-primary/20 text-primary text-[12px] font-semibold rounded-lg transition-colors"
                        >
                          <ChevronRight size={12} /> Tests
                        </a>
                        <a
                          href={`/admin/mock-tests/${location.id}/categories/${c.id}/guide`}
                          className="inline-flex items-center gap-1.5 h-7 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[12px] font-semibold rounded-lg transition-colors"
                        >
                          <BookOpen size={11} /> Guide
                        </a>
                        <button
                          onClick={() => setEditItem(c)}
                          className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-primary/40 hover:bg-primary/5 text-slate-600 hover:text-primary text-[12px] font-medium rounded-lg transition-colors"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteItem(c)}
                          className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-[#B91C1C] text-[12px] font-medium rounded-lg transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-[12px] text-slate-400 text-center">Showing {filtered.length} of {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
        )}
      </div>
    </>
  )
}
