'use client'

import React, { useState, useTransition, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Search, X, Trash2, Pencil, Copy, ToggleLeft, ToggleRight,
  Upload, GripVertical, Clock, HelpCircle, CheckCircle, AlertTriangle,
  ChevronDown, Filter,
} from 'lucide-react'
import { deleteQuestion, duplicateQuestion, toggleQuestionStatus, reorderQuestions } from '@/app/actions/admin-questions'
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

/* ── Delete Confirmation ────────────────────────────────────────────── */
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

  // Local ordered list for drag-and-drop
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)

  // Modals
  const [showAdd, setShowAdd]           = useState(false)
  const [editItem, setEditItem]         = useState<Question | null>(null)
  const [deleteItem, setDeleteItem]     = useState<Question | null>(null)
  const [showBulk, setShowBulk]         = useState(false)

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
  const [isDragging, setIsDragging]     = useState(false)

  /* ── Filtered + paginated ─── */
  const filtered = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = !search || q.question_text.toLowerCase().includes(search.toLowerCase())
      const matchDiff   = diffFilter === 'all' || q.difficulty === diffFilter
      const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? q.is_active : !q.is_active)
      return matchSearch && matchDiff && matchStatus
    })
  }, [questions, search, diffFilter, statusFilter])

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  /* ── Actions ─── */
  function handleDelete() {
    if (!deleteItem) return
    startTransition(async () => {
      await deleteQuestion(deleteItem.id, test.id)
      setQuestions(prev => prev.filter(q => q.id !== deleteItem.id))
      setDeleteItem(null)
      router.refresh()
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

      // Persist
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
        <QuestionModal
          initial={editItem}
          mockTestId={test.id}
          onClose={onModalClose}
        />
      )}
      {deleteItem && (
        <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} pending={pending} />
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
            { label: 'Total Questions', value: questions.length,                            color: 'text-primary',      bg: 'bg-primary/5'    },
            { label: 'Total Marks',     value: totalMarks,                                  color: 'text-violet-600',   bg: 'bg-violet-50'    },
            { label: 'Duration',        value: `${test.duration_minutes}m`,                 color: 'text-slate-700',    bg: 'bg-slate-50'     },
            { label: 'Pass Mark',       value: `${test.passing_percentage}%`,               color: 'text-amber-600',    bg: 'bg-amber-50'     },
            { label: 'Easy',            value: difficultyStats.easy,                         color: 'text-[#166534]',   bg: 'bg-[#DCFCE7]'   },
            { label: 'Medium / Hard',   value: `${difficultyStats.medium} / ${difficultyStats.hard}`, color: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
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
                  return (
                    <tr
                      key={q.id}
                      draggable
                      onDragStart={() => onDragStart(globalIdx)}
                      onDragOver={(e) => onDragOver(e, globalIdx)}
                      onDrop={onDrop}
                      onDragEnd={() => setIsDragging(false)}
                      className={`hover:bg-slate-50/60 transition-colors ${isDragging ? 'cursor-grabbing' : ''}`}
                    >
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
