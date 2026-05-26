'use client'

import React, { useState, useTransition, useMemo, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Search, X, Trash2, Pencil, Copy, ToggleLeft, ToggleRight,
  Upload, GripVertical, HelpCircle, CheckCircle, AlertTriangle,
  ChevronDown, Filter, CheckSquare,
} from 'lucide-react'
import { deleteQuestion, duplicateQuestion, toggleQuestionStatus, reorderQuestions, deleteMultipleQuestions } from '@/app/actions/admin-questions'
import { deleteMockTest } from '@/app/actions/admin-mock-tests'
import { QuestionModal } from './QuestionModal'
import { BulkImportModal } from './BulkImportModal'

export type Question = {
  id: string
  mock_test_id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
  explanation: string
  explanation_image_url: string
  learning_notes: string
  difficulty: 'easy' | 'medium' | 'hard'
  marks: number
  image_url: string
  randomize_options: boolean
  is_active: boolean
  sort_order: number
  created_at: string
}

type Info = { id: string; name: string }
type TestInfo = Info & { duration_minutes: number; total_questions: number; passing_percentage: number }

const DIFF_BADGE = {
  easy:   { label: 'Easy',   cls: 'bg-[#DCFCE7] text-[#166534]' },
  medium: { label: 'Medium', cls: 'bg-[#FEF3C7] text-[#92400E]' },
  hard:   { label: 'Hard',   cls: 'bg-[#FEE2E2] text-[#B91C1C]' },
}

const PAGE_SIZE = 20

/* ── Delete single question ─────────────────────────────────────────── */
function DeleteModal({ onConfirm, onCancel, pending }: { onConfirm: () => void; onCancel: () => void; pending: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-[#B91C1C]" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-800 mb-2">Delete Question?</h3>
        <p className="text-[13px] text-slate-500 mb-5">This question will be permanently removed from the mock test.</p>
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

/* ── Bulk delete questions ──────────────────────────────────────────── */
function BulkDeleteModal({ count, onConfirm, onCancel, pending }: { count: number; onConfirm: () => void; onCancel: () => void; pending: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-[#B91C1C]" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-800 mb-2">Delete {count} Question{count !== 1 ? 's' : ''}?</h3>
        <p className="text-[13px] text-slate-500 mb-5">
          These <span className="font-semibold">{count} question{count !== 1 ? 's' : ''}</span> will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 h-9 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl">Cancel</button>
          <button onClick={onConfirm} disabled={pending} className="flex-1 h-9 bg-[#B91C1C] hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl disabled:opacity-60">
            {pending ? 'Deleting…' : `Delete ${count}`}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Delete entire mock test ────────────────────────────────────────── */
function DeleteTestModal({ testName, onConfirm, onCancel, pending }: { testName: string; onConfirm: () => void; onCancel: () => void; pending: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-[#B91C1C]" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-800 mb-2">Delete Entire Mock Test?</h3>
        <p className="text-[13px] text-slate-500 mb-1">
          You are about to permanently delete:
        </p>
        <p className="text-[14px] font-semibold text-slate-800 mb-4 px-2 truncate">"{testName}"</p>
        <p className="text-[12px] text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2 mb-5">
          This will also delete ALL questions and cannot be undone.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 h-9 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl">Cancel</button>
          <button onClick={onConfirm} disabled={pending} className="flex-1 h-9 bg-[#B91C1C] hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl disabled:opacity-60">
            {pending ? 'Deleting…' : 'Delete Test'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────────────────── */
export function QuestionsClient({
  location, category, test, questions: initialQuestions,
  totalMarks, difficultyStats, dbError,
}: {
  location: Info; category: Info; test: TestInfo
  questions: Question[]; totalMarks: number
  difficultyStats: { easy: number; medium: number; hard: number }
  dbError: string | null
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [questions, setQuestions] = useState<Question[]>(initialQuestions)

  // Modals
  const [showAdd, setShowAdd]             = useState(false)
  const [editItem, setEditItem]           = useState<Question | null>(null)
  const [deleteItem, setDeleteItem]       = useState<Question | null>(null)
  const [showBulk, setShowBulk]           = useState(false)
  const [showBulkDelete, setShowBulkDelete] = useState(false)
  const [showDeleteTest, setShowDeleteTest] = useState(false)

  // Multi-select
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Filters & pagination
  const [search, setSearch]             = useState('')
  const [diffFilter, setDiffFilter]     = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage]                 = useState(1)
  const [showDiffDrop, setShowDiffDrop] = useState(false)
  const [showStatusDrop, setShowStatusDrop] = useState(false)

  // Drag state
  const dragIndex = useRef<number | null>(null)
  const dragOverIndex = useRef<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Select-all checkbox ref (for indeterminate state)
  const selectAllRef = useRef<HTMLInputElement>(null)

  /* ── Filtered + paginated ─── */
  const filtered = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = !search || q.question_text.toLowerCase().includes(search.toLowerCase())
      const matchDiff   = diffFilter === 'all' || q.difficulty === diffFilter
      const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? q.is_active : !q.is_active)
      return matchSearch && matchDiff && matchStatus
    })
  }, [questions, search, diffFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const allPageSelected  = paginated.length > 0 && paginated.every(q => selectedIds.has(q.id))
  const somePageSelected = paginated.some(q => selectedIds.has(q.id)) && !allPageSelected

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = somePageSelected
    }
  }, [somePageSelected])

  /* ── Multi-select helpers ─── */
  function toggleAll() {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (allPageSelected) {
        paginated.forEach(q => next.delete(q.id))
      } else {
        paginated.forEach(q => next.add(q.id))
      }
      return next
    })
  }

  function toggleOne(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /* ── Actions ─── */
  function handleDelete() {
    if (!deleteItem) return
    startTransition(async () => {
      await deleteQuestion(deleteItem.id, test.id)
      setQuestions(prev => prev.filter(q => q.id !== deleteItem.id))
      setSelectedIds(prev => { const next = new Set(prev); next.delete(deleteItem.id); return next })
      setDeleteItem(null)
      router.refresh()
    })
  }

  function handleBulkDelete() {
    const ids = Array.from(selectedIds)
    startTransition(async () => {
      await deleteMultipleQuestions(ids, test.id)
      setQuestions(prev => prev.filter(q => !selectedIds.has(q.id)))
      setSelectedIds(new Set())
      setShowBulkDelete(false)
      router.refresh()
    })
  }

  function handleDeleteTest() {
    startTransition(async () => {
      await deleteMockTest(test.id)
      router.push(`/admin/mock-tests/${location.id}/categories/${category.id}/tests`)
    })
  }

  function handleDuplicate(q: Question) {
    startTransition(async () => {
      const res = await duplicateQuestion(q.id, test.id)
      if (!res.error) router.refresh()
    })
  }

  function handleToggle(q: Question) {
    startTransition(async () => {
      await toggleQuestionStatus(q.id, !q.is_active, test.id)
      setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, is_active: !x.is_active } : x))
    })
  }

  /* ── Drag & Drop ─── */
  const onDragStart = useCallback((index: number) => {
    dragIndex.current = index
    setIsDragging(true)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    dragOverIndex.current = index
  }, [])

  const onDrop = useCallback(() => {
    const from = dragIndex.current
    const to   = dragOverIndex.current
    if (from === null || to === null || from === to) { setIsDragging(false); return }

    setQuestions(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      const reindexed = next.map((q, i) => ({ ...q, sort_order: i }))
      startTransition(async () => {
        await reorderQuestions(reindexed.map(q => ({ id: q.id, sort_order: q.sort_order })), test.id)
      })
      return reindexed
    })

    dragIndex.current     = null
    dragOverIndex.current = null
    setIsDragging(false)
  }, [test.id])

  const onModalClose = useCallback(() => {
    setShowAdd(false)
    setEditItem(null)
    router.refresh()
  }, [router])

  return (
    <>
      {/* Modals */}
      {(showAdd || editItem) && (
        <QuestionModal initial={editItem} mockTestId={test.id} onClose={onModalClose} />
      )}
      {deleteItem && (
        <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} pending={pending} />
      )}
      {showBulkDelete && (
        <BulkDeleteModal count={selectedIds.size} onConfirm={handleBulkDelete} onCancel={() => setShowBulkDelete(false)} pending={pending} />
      )}
      {showDeleteTest && (
        <DeleteTestModal testName={test.name} onConfirm={handleDeleteTest} onCancel={() => setShowDeleteTest(false)} pending={pending} />
      )}
      {showBulk && (
        <BulkImportModal mockTestId={test.id} onClose={() => { setShowBulk(false); router.refresh() }} existingTexts={questions.map(q => q.question_text)} />
      )}

      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">{test.name}</h1>
            <p className="text-[13px] text-slate-500">Questions Management</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowDeleteTest(true)}
              className="flex items-center gap-1.5 h-9 px-4 border border-red-200 bg-red-50 hover:bg-red-100 text-[#B91C1C] text-[13px] font-medium rounded-xl transition-colors"
            >
              <Trash2 size={14} /> Delete Test
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <button
              onClick={() => setShowBulk(true)}
              className="flex items-center gap-1.5 h-9 px-4 border border-slate-200 hover:border-primary/40 text-slate-600 hover:text-primary text-[13px] font-medium rounded-xl transition-colors"
            >
              <Upload size={14} /> Bulk Import
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
            >
              <Plus size={14} /> Add Question
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-slate-400 flex-wrap">
          <a href="/admin/mock-tests" className="hover:text-primary transition-colors font-medium text-slate-600">Mock Tests</a>
          <span>/</span>
          <a href={`/admin/mock-tests/${location.id}/categories`} className="hover:text-primary transition-colors">{location.name}</a>
          <span>/</span>
          <a href={`/admin/mock-tests/${location.id}/categories/${category.id}/tests`} className="hover:text-primary transition-colors">{category.name}</a>
          <span>/</span>
          <span className="text-slate-600">{test.name}</span>
          <span>/</span>
          <span className="text-slate-600">Questions</span>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Questions', value: questions.length,                                          color: 'text-primary',    bg: 'bg-primary/5'  },
            { label: 'Total Marks',     value: totalMarks,                                                color: 'text-violet-600', bg: 'bg-violet-50'  },
            { label: 'Duration',        value: `${test.duration_minutes}m`,                               color: 'text-slate-700',  bg: 'bg-slate-50'   },
            { label: 'Pass Mark',       value: `${test.passing_percentage}%`,                             color: 'text-amber-600',  bg: 'bg-amber-50'   },
            { label: 'Easy',            value: difficultyStats.easy,                                      color: 'text-[#166534]',  bg: 'bg-[#DCFCE7]'  },
            { label: 'Medium / Hard',   value: `${difficultyStats.medium} / ${difficultyStats.hard}`,    color: 'text-[#92400E]',  bg: 'bg-[#FEF3C7]'  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
              <p className={`text-[18px] font-bold ${s.color} leading-none`}>{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {dbError && (
          <div className="flex items-center gap-2 p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[13px] text-[#B91C1C]">
            <AlertTriangle size={14} />{dbError}
          </div>
        )}

        {/* Bulk-select action bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl">
            <CheckSquare size={15} className="text-primary flex-shrink-0" />
            <span className="text-[13px] font-semibold text-primary">
              {selectedIds.size} question{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-[12px] text-slate-500 hover:text-slate-700 underline transition-colors"
            >
              Clear
            </button>
            <div className="ml-auto">
              <button
                onClick={() => setShowBulkDelete(true)}
                className="flex items-center gap-1.5 h-8 px-3 bg-[#B91C1C] hover:bg-red-700 text-white text-[12.5px] font-semibold rounded-lg transition-colors"
              >
                <Trash2 size={13} /> Delete Selected ({selectedIds.size})
              </button>
            </div>
          </div>
        )}

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search questions…"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>}
          </div>

          {/* Difficulty filter */}
          <div className="relative">
            <button onClick={() => { setShowDiffDrop(p => !p); setShowStatusDrop(false) }}
              className="flex items-center gap-2 h-9 px-3 border border-slate-200 hover:border-slate-300 rounded-xl text-[13px] text-slate-600 transition-colors">
              <Filter size={13} />
              {diffFilter === 'all' ? 'All Difficulties' : DIFF_BADGE[diffFilter].label}
              <ChevronDown size={13} />
            </button>
            {showDiffDrop && (
              <div className="absolute top-11 left-0 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[160px]">
                {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                  <button key={d} onClick={() => { setDiffFilter(d); setShowDiffDrop(false); setPage(1) }}
                    className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${diffFilter === d ? 'text-primary font-semibold bg-primary/5' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {d === 'all' ? 'All Difficulties' : DIFF_BADGE[d].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status filter */}
          <div className="relative">
            <button onClick={() => { setShowStatusDrop(p => !p); setShowDiffDrop(false) }}
              className="flex items-center gap-2 h-9 px-3 border border-slate-200 hover:border-slate-300 rounded-xl text-[13px] text-slate-600 transition-colors">
              {statusFilter === 'all' ? 'All Status' : statusFilter === 'active' ? 'Active' : 'Inactive'}
              <ChevronDown size={13} />
            </button>
            {showStatusDrop && (
              <div className="absolute top-11 left-0 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[140px]">
                {(['all', 'active', 'inactive'] as const).map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setShowStatusDrop(false); setPage(1) }}
                    className={`w-full text-left px-4 py-2 text-[13px] transition-colors capitalize ${statusFilter === s ? 'text-primary font-semibold bg-primary/5' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-[12.5px] text-slate-400 ml-auto">{filtered.length} question{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {paginated.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-slate-600 mb-1">
                {questions.length === 0 ? 'No questions yet' : 'No questions match your filters'}
              </p>
              {questions.length === 0 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-white text-[13px] font-semibold rounded-xl">
                    <Plus size={14} /> Add Question
                  </button>
                  <button onClick={() => setShowBulk(true)} className="inline-flex items-center gap-2 h-9 px-4 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl">
                    <Upload size={14} /> Bulk Import
                  </button>
                </div>
              )}
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {/* Checkbox column */}
                  <th className="w-10 px-3 py-3">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-primary accent-primary cursor-pointer"
                      title="Select all on this page"
                    />
                  </th>
                  <th className="w-10 px-3 py-3" />
                  <th className="text-left px-3 py-3 font-semibold text-slate-500 w-10">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Question</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Answer</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Difficulty</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Marks</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((q, localIdx) => {
                  const globalIdx = (page - 1) * PAGE_SIZE + localIdx
                  const diff = DIFF_BADGE[q.difficulty]
                  const isSelected = selectedIds.has(q.id)
                  return (
                    <tr
                      key={q.id}
                      draggable
                      onDragStart={() => onDragStart(globalIdx)}
                      onDragOver={(e) => onDragOver(e, globalIdx)}
                      onDrop={onDrop}
                      onDragEnd={() => setIsDragging(false)}
                      className={`transition-colors ${isDragging ? 'cursor-grabbing' : ''} ${isSelected ? 'bg-primary/5' : 'hover:bg-slate-50/60'}`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(q.id)}
                          className="w-4 h-4 rounded border-slate-300 text-primary accent-primary cursor-pointer"
                        />
                      </td>
                      {/* Drag handle */}
                      <td className="px-3 py-3.5">
                        <GripVertical size={14} className="text-slate-300 hover:text-slate-500 cursor-grab transition-colors" />
                      </td>
                      {/* Q number */}
                      <td className="px-3 py-3.5">
                        <span className="text-[12px] font-bold text-slate-400">{q.sort_order + 1}</span>
                      </td>
                      {/* Question */}
                      <td className="px-4 py-3.5 max-w-[320px]">
                        <p className="font-medium text-slate-800 line-clamp-2 leading-snug">{q.question_text}</p>
                        {q.image_url && <span className="text-[11px] text-primary mt-0.5 block">Has image</span>}
                      </td>
                      {/* Correct answer */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[11px] font-bold text-[#166534]">
                            {q.correct_answer}
                          </span>
                          <span className="text-slate-500 text-[12px] max-w-[80px] truncate">
                            {q[`option_${q.correct_answer.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`]}
                          </span>
                        </div>
                      </td>
                      {/* Difficulty */}
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${diff.cls}`}>{diff.label}</span>
                      </td>
                      {/* Marks */}
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] font-semibold text-slate-700">{q.marks}</span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <button onClick={() => handleToggle(q)} className="hover:opacity-80 transition-opacity">
                          {q.is_active
                            ? <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10} />Active</span>
                            : <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Inactive</span>}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setEditItem(q)}
                            className="h-7 w-7 flex items-center justify-center border border-slate-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary text-slate-500 rounded-lg transition-colors"
                            title="Edit">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => handleDuplicate(q)}
                            className="h-7 w-7 flex items-center justify-center border border-slate-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 text-slate-500 rounded-lg transition-colors"
                            title="Duplicate">
                            <Copy size={12} />
                          </button>
                          <button onClick={() => handleToggle(q)}
                            className="h-7 w-7 flex items-center justify-center border border-slate-200 hover:border-slate-300 text-slate-400 rounded-lg transition-colors"
                            title={q.is_active ? 'Deactivate' : 'Activate'}>
                            {q.is_active ? <ToggleRight size={13} className="text-primary" /> : <ToggleLeft size={13} />}
                          </button>
                          <button onClick={() => setDeleteItem(q)}
                            className="h-7 w-7 flex items-center justify-center border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-[#B91C1C] text-slate-400 rounded-lg transition-colors"
                            title="Delete">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] text-slate-400">
              Page {page} of {totalPages} · {filtered.length} questions
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="h-8 px-3 border border-slate-200 text-slate-600 text-[12.5px] font-medium rounded-lg disabled:opacity-40 hover:border-slate-300 transition-colors">
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = totalPages <= 7 ? i + 1 : i + Math.max(1, page - 3)
                if (p > totalPages) return null
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`h-8 w-8 border text-[12.5px] font-medium rounded-lg transition-colors ${p === page ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="h-8 px-3 border border-slate-200 text-slate-600 text-[12.5px] font-medium rounded-lg disabled:opacity-40 hover:border-slate-300 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Drag hint */}
        {questions.length > 1 && (
          <p className="text-[11.5px] text-slate-400 text-center flex items-center justify-center gap-1.5">
            <GripVertical size={12} /> Drag rows to reorder questions
          </p>
        )}
      </div>

      {/* Close dropdowns on outside click */}
      {(showDiffDrop || showStatusDrop) && (
        <div className="fixed inset-0 z-10" onClick={() => { setShowDiffDrop(false); setShowStatusDrop(false) }} />
      )}
    </>
  )
}
