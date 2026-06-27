'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Pencil, Trash2, X, AlertTriangle, ShieldCheck,
  ShieldOff, UserCog, ToggleLeft, ToggleRight, Users,
} from 'lucide-react'
import { createEmployee, updateEmployee, deleteEmployee } from '@/app/actions/admin-employees'
import type { AdminPermission } from '@/lib/require-admin'

/* ── Permission definitions ─────────────────────────────────── */

const ALL_PERMISSIONS: { key: AdminPermission; label: string; description: string }[] = [
  { key: 'agencies',       label: 'Agencies',        description: 'View and manage agency listings' },
  { key: 'reviews',        label: 'Reviews',          description: 'Moderate and manage reviews' },
  { key: 'scam-reports',   label: 'Scam Reports',     description: 'View and action scam reports' },
  { key: 'mock-tests',     label: 'Mock Tests',       description: 'Manage mock test locations and content' },
  { key: 'jobs',           label: 'Jobs',             description: 'Manage job listings and postings' },
  { key: 'applications',   label: 'Applications',     description: 'View and manage job applications' },
  { key: 'claim-listings', label: 'Claim Listings',   description: 'Review and approve agency claim requests' },
  { key: 'blogs',          label: 'Blogs',            description: 'Create and manage blog content' },
  { key: 'settings',       label: 'Settings',         description: 'Access admin settings' },
]

/* ── Types ──────────────────────────────────────────────────── */

type Employee = {
  id:          string
  email:       string
  name:        string | null
  permissions: string[]
  is_active:   boolean
  created_at:  string
}

const inputCls = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const labelCls = 'block text-[12px] font-semibold text-slate-600 mb-1'

/* ── Add / Edit Modal ───────────────────────────────────────── */

function EmployeeModal({
  existing,
  onClose,
}: {
  existing: Employee | null
  onClose:  () => void
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [name,        setName]        = useState(existing?.name        ?? '')
  const [email,       setEmail]       = useState(existing?.email       ?? '')
  const [password,    setPassword]    = useState('')
  const [permissions, setPermissions] = useState<AdminPermission[]>(
    (existing?.permissions ?? []) as AdminPermission[]
  )
  const [error, setError] = useState<string | null>(null)

  function togglePermission(key: AdminPermission) {
    setPermissions(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      let res: { error: string | null }
      if (existing) {
        res = await updateEmployee({
          id: existing.id, name, permissions, is_active: existing.is_active,
        })
      } else {
        res = await createEmployee({ name, email, password, permissions })
      }
      if (res.error) { setError(res.error); return }
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-[16px] font-bold text-slate-800">
            {existing ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-[12.5px] text-red-700">
              <AlertTriangle size={13} /> {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className={labelCls}>Full Name</label>
            <input className={inputCls} value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma" />
          </div>

          {/* Email — readonly when editing */}
          <div>
            <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
            {existing ? (
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-500">
                {existing.email}
              </div>
            ) : (
              <input className={inputCls} type="email" required value={email}
                onChange={e => setEmail(e.target.value)} placeholder="employee@company.com" />
            )}
          </div>

          {/* Password — only for new employees */}
          {!existing && (
            <div>
              <label className={labelCls}>Password <span className="text-red-500">*</span></label>
              <input className={inputCls} type="password" required value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                minLength={8} />
              <p className="text-[11px] text-slate-400 mt-1">Share this with the employee after creation.</p>
            </div>
          )}

          {/* Permissions */}
          <div>
            <label className={labelCls}>Page Access</label>
            <p className="text-[11.5px] text-slate-400 mb-3">Select which admin pages this employee can access.</p>
            <div className="flex flex-col gap-2">
              {ALL_PERMISSIONS.map(({ key, label, description }) => {
                const checked = permissions.includes(key)
                return (
                  <label
                    key={key}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? 'border-primary/40 bg-primary/[0.04]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePermission(key)}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700">{label}</p>
                      <p className="text-[11.5px] text-slate-400">{description}</p>
                    </div>
                  </label>
                )
              })}
            </div>
            {permissions.length === 0 && (
              <p className="text-[11.5px] text-amber-600 mt-2">
                No pages selected — this employee won&apos;t be able to access anything.
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 h-9 border border-slate-200 hover:border-slate-300 text-slate-600 text-[13px] font-medium rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={pending}
              className="flex-1 h-9 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-60">
              {pending ? (existing ? 'Saving…' : 'Creating…') : (existing ? 'Save Changes' : 'Add Employee')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Delete confirm modal ───────────────────────────────────── */

function DeleteModal({
  employee, onConfirm, onCancel, pending,
}: {
  employee: Employee; onConfirm: () => void; onCancel: () => void; pending: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-600" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-800 mb-2">Remove Employee?</h3>
        <p className="text-[13px] text-slate-500 mb-1">
          <span className="font-semibold">{employee.name ?? employee.email}</span>
        </p>
        <p className="text-[12.5px] text-slate-400 mb-5">
          Their login will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 h-9 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={pending}
            className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-60">
            {pending ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────────── */

export function EmployeesClient({ employees }: { employees: Employee[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [showAdd,    setShowAdd]    = useState(false)
  const [editItem,   setEditItem]   = useState<Employee | null>(null)
  const [deleteItem, setDeleteItem] = useState<Employee | null>(null)

  function handleDelete() {
    if (!deleteItem) return
    start(async () => {
      await deleteEmployee(deleteItem.id)
      router.refresh()
      setDeleteItem(null)
    })
  }

  function handleToggleActive(emp: Employee) {
    start(async () => {
      await updateEmployee({
        id: emp.id, name: emp.name ?? '', permissions: emp.permissions as AdminPermission[], is_active: !emp.is_active,
      })
      router.refresh()
    })
  }

  return (
    <>
      {(showAdd || editItem) && (
        <EmployeeModal
          existing={editItem}
          onClose={() => { setShowAdd(false); setEditItem(null) }}
        />
      )}
      {deleteItem && (
        <DeleteModal
          employee={deleteItem}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          pending={pending}
        />
      )}

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">Employees</h1>
            <p className="text-[13px] text-slate-500">
              {employees.length} employee{employees.length !== 1 ? 's' : ''} · Super admin has full access
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            <Plus size={14} /> Add Employee
          </button>
        </div>

        {/* Empty state */}
        {employees.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center">
            <Users size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-slate-600 mb-1">No employees yet</p>
            <p className="text-[13px] text-slate-400 mb-4">Add team members with restricted access to specific pages.</p>
            <button onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-white text-[13px] font-semibold rounded-xl">
              <Plus size={14} /> Add Employee
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {employees.map(emp => (
              <div key={emp.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-slate-300 transition-colors">

                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserCog size={16} className="text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-bold text-slate-800">
                        {emp.name ?? emp.email}
                      </p>
                      {emp.is_active ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={10} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                          <ShieldOff size={10} /> Deactivated
                        </span>
                      )}
                    </div>
                    {emp.name && (
                      <p className="text-[12px] text-slate-400 mt-0.5">{emp.email}</p>
                    )}

                    {/* Permission chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {emp.permissions.length > 0 ? (
                        emp.permissions.map(p => (
                          <span key={p}
                            className="text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full capitalize">
                            {ALL_PERMISSIONS.find(a => a.key === p)?.label ?? p}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11.5px] text-amber-600">No page access</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Active toggle */}
                  <button onClick={() => handleToggleActive(emp)}
                    title={emp.is_active ? 'Deactivate' : 'Activate'}
                    className="transition-opacity hover:opacity-70">
                    {emp.is_active
                      ? <ToggleRight size={24} className="text-primary" />
                      : <ToggleLeft size={24} className="text-slate-300" />}
                  </button>

                  <button onClick={() => setEditItem(emp)}
                    className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-primary/40 hover:bg-primary/5 text-slate-600 hover:text-primary text-[12px] font-medium rounded-lg transition-colors">
                    <Pencil size={11} /> Edit
                  </button>

                  <button onClick={() => setDeleteItem(emp)}
                    className="inline-flex items-center h-7 px-3 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 text-[12px] rounded-lg transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
