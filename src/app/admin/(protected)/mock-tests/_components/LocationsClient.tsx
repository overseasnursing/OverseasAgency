'use client'

import React, { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, FolderOpen, Search, X, ChevronRight, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react'
import { saveLocation, deleteLocation, toggleLocationStatus, type LocationInput } from '@/app/actions/admin-mock-tests'
import { DESTINATION_COUNTRY_OPTIONS } from '@/lib/data/mockTestMappings'

type Location = {
  id: string
  name: string
  slug: string
  description: string
  is_active: boolean
  created_at: string
  categoryCount: number
  country_slug: string | null
}

const inputCls  = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const labelCls  = 'block text-[12px] font-semibold text-slate-600 mb-1'

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')
}

function emptyForm(): Omit<LocationInput, 'id'> {
  return { name: '', slug: '', description: '', is_active: true, country_slug: null }
}

/* ── Add / Edit Modal ──────────────────────────────────────────────── */
function LocationModal({
  initial,
  onClose,
}: {
  initial: (LocationInput & { id?: string }) | null
  onClose: () => void
}) {
  const router     = useRouter()
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState<Omit<LocationInput, 'id'>>(
    initial ? { name: initial.name, slug: initial.slug, description: initial.description, is_active: initial.is_active, country_slug: initial.country_slug ?? null }
            : emptyForm()
  )
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(p => ({ ...p, [k]: v }))
  }

  function handleNameChange(v: string) {
    set('name', v)
    if (!initial) set('slug', toSlug(v))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    startTransition(async () => {
      const res = await saveLocation({ ...form, id: initial?.id })
      if (res.error) { setError(res.error); return }
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[16px] font-bold text-slate-800">{initial ? 'Edit Location' : 'Add Location'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-[12.5px] text-[#B91C1C]">
              <AlertTriangle size={13} />{error}
            </div>
          )}
          <div>
            <label className={labelCls}>Location Name <span className="text-red-500">*</span></label>
            <input className={inputCls} value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Middle East & Gulf Licensing Mock Test" />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="middle-east-gulf" />
            <p className="text-[11px] text-slate-400 mt-1">Used in URLs. Auto-generated from name.</p>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={inputCls + ' resize-none'} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of this location group..." />
          </div>
          <div>
            <label className={labelCls}>Destination Country</label>
            <select
              className={inputCls}
              value={form.country_slug ?? ''}
              onChange={e => set('country_slug', e.target.value || null)}
            >
              <option value="">— Select country —</option>
              {DESTINATION_COUNTRY_OPTIONS.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Used for agency cards, salary links, and internal linking on mock test pages.</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-[13px] font-medium text-slate-700">Active</span>
            <button type="button" onClick={() => set('is_active', !form.is_active)} className="transition-colors">
              {form.is_active
                ? <ToggleRight size={26} className="text-primary" />
                : <ToggleLeft size={26} className="text-slate-300" />}
            </button>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 h-9 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={pending} className="flex-1 h-9 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-60">
              {pending ? 'Saving…' : initial ? 'Save Changes' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Delete Confirm Modal ──────────────────────────────────────────── */
function DeleteModal({ name, onConfirm, onCancel, pending }: { name: string; onConfirm: () => void; onCancel: () => void; pending: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-[#B91C1C]" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-800 mb-2">Delete Location?</h3>
        <p className="text-[13px] text-slate-500 mb-5">
          <span className="font-semibold">&ldquo;{name}&rdquo;</span> and all its categories and mock tests will be permanently deleted.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 h-9 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl">Cancel</button>
          <button onClick={onConfirm} disabled={pending} className="flex-1 h-9 bg-[#B91C1C] hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-60">
            {pending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────────────────── */
export function LocationsClient({ locations, dbError, isSuperAdmin }: { locations: Location[]; dbError: string | null; isSuperAdmin: boolean }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [search, setSearch]         = useState('')
  const [showAdd, setShowAdd]       = useState(false)
  const [editItem, setEditItem]     = useState<Location | null>(null)
  const [deleteItem, setDeleteItem] = useState<Location | null>(null)

  const filtered = useMemo(() =>
    locations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.slug.includes(search.toLowerCase()))
  , [locations, search])

  function handleDelete() {
    if (!deleteItem) return
    startTransition(async () => {
      await deleteLocation(deleteItem.id)
      router.refresh()
      setDeleteItem(null)
    })
  }

  function handleToggle(l: Location) {
    startTransition(async () => {
      await toggleLocationStatus(l.id, !l.is_active)
      router.refresh()
    })
  }

  return (
    <>
      {(showAdd || editItem) && (
        <LocationModal
          initial={editItem ? { ...editItem } : null}
          onClose={() => { setShowAdd(false); setEditItem(null) }}
        />
      )}
      {deleteItem && (
        <DeleteModal
          name={deleteItem.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          pending={pending}
        />
      )}

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">Mock Tests</h1>
            <p className="text-[13px] text-slate-500">{locations.length} location{locations.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            <Plus size={14} /> Add Location
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <span className="font-medium text-slate-600">Mock Tests</span>
          <span>/ Locations</span>
        </div>

        {dbError && (
          <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[13px] text-[#B91C1C]">
            {dbError}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search locations…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {!filtered.length ? (
            <div className="text-center py-16">
              <FolderOpen size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-slate-600 mb-1">{search ? 'No locations match your search' : 'No locations yet'}</p>
              {!search && <p className="text-[13px] text-slate-400 mb-4">Add your first location group to get started.</p>}
              {!search && (
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-white text-[13px] font-semibold rounded-xl">
                  <Plus size={14} /> Add Location
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-500">Location</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Categories</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FolderOpen size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{l.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">/{l.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {l.categoryCount} categor{l.categoryCount !== 1 ? 'ies' : 'y'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => handleToggle(l)} className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80">
                        {l.is_active
                          ? <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">Active</span>
                          : <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Inactive</span>}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/mock-tests/${l.id}/categories`}
                          className="inline-flex items-center gap-1.5 h-7 px-3 bg-primary/10 hover:bg-primary/20 text-primary text-[12px] font-semibold rounded-lg transition-colors"
                        >
                          <ChevronRight size={12} /> View
                        </a>
                        <button
                          onClick={() => setEditItem(l)}
                          className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-primary/40 hover:bg-primary/5 text-slate-600 hover:text-primary text-[12px] font-medium rounded-lg transition-colors"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => setDeleteItem(l)}
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
            Showing {filtered.length} of {locations.length} location{locations.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </>
  )
}
