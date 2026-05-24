'use client'

import React, { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, AlertTriangle, ToggleLeft, ToggleRight, ImagePlus, CheckCircle, Loader2 } from 'lucide-react'
import { saveQuestion, uploadQuestionImage, type QuestionInput } from '@/app/actions/admin-questions'
import type { Question } from './QuestionsClient'

const inputCls    = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
const labelCls    = 'block text-[12px] font-semibold text-slate-600 mb-1'
const textareaCls = inputCls + ' resize-none'
const DRAFT_KEY   = 'mock-test-question-draft'

type Tab = 'question' | 'answers' | 'explanation'
type FormState = Omit<QuestionInput, 'id'>

function emptyForm(mockTestId: string): FormState {
  return {
    mock_test_id: mockTestId,
    question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
    correct_answer: 'A', explanation: '', explanation_image_url: '',
    learning_notes: '', difficulty: 'medium', marks: 1,
    image_url: '', randomize_options: false, is_active: true,
  }
}

/* ── Image Upload Field ─────────────────────────────────────────────── */
function ImageField({
  label, value, onChange, type,
}: {
  label: string; value: string; onChange: (url: string) => void
  type: 'question' | 'explanation'
}) {
  const [uploading, setUploading]   = useState(false)
  const [uploadErr, setUploadErr]   = useState<string | null>(null)
  const inputRef                    = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setUploadErr(null)
    const fd = new FormData(); fd.append('file', file)
    const res = await uploadQuestionImage(fd, type)
    setUploading(false)
    if (res.error) { setUploadErr(res.error); return }
    onChange(res.url!)
  }

  return (
    <div>
      <label className={labelCls}>{label} <span className="text-slate-400 font-normal">(optional)</span></label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="max-h-48 w-full object-contain" />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-slate-500 hover:text-red-600 shadow-sm transition-colors">
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
        >
          {uploading
            ? <Loader2 size={20} className="text-primary animate-spin" />
            : <ImagePlus size={20} className="text-slate-300" />}
          <p className="text-[12px] text-slate-400">{uploading ? 'Uploading…' : 'Click to upload image'}</p>
          {uploadErr && <p className="text-[11px] text-red-500">{uploadErr}</p>}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
      <p className="text-[11px] text-slate-400 mt-1">Or paste a URL:</p>
      <input className={inputCls + ' mt-1'} value={value} onChange={e => onChange(e.target.value)} placeholder="https://…" />
    </div>
  )
}

/* ── Answer Option ──────────────────────────────────────────────────── */
function AnswerOption({
  letter, value, onChange, isCorrect, onSelect,
}: {
  letter: 'A' | 'B' | 'C' | 'D'; value: string; onChange: (v: string) => void
  isCorrect: boolean; onSelect: () => void
}) {
  const colors = isCorrect
    ? 'border-[#22C55E] bg-[#F0FDF4] ring-1 ring-[#22C55E]/30'
    : 'border-slate-200 hover:border-slate-300'

  return (
    <div className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${colors}`}>
      <button type="button" onClick={onSelect}
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-bold transition-all ${
          isCorrect ? 'bg-[#22C55E] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
        }`}>
        {isCorrect ? <CheckCircle size={14} /> : letter}
      </button>
      <input
        className="flex-1 bg-transparent text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={`Option ${letter}`}
      />
      {isCorrect && <span className="text-[10px] font-bold text-[#22C55E] flex-shrink-0">CORRECT</span>}
    </div>
  )
}

/* ── Main Modal ─────────────────────────────────────────────────────── */
export function QuestionModal({
  initial, mockTestId, onClose,
}: {
  initial: Question | null; mockTestId: string; onClose: () => void
}) {
  const router  = useRouter()
  const [pending, startTransition] = useTransition()
  const [tab, setTab]   = useState<Tab>('question')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Init form
  const [form, setForm] = useState<FormState>(() => {
    if (initial) {
      return {
        mock_test_id: mockTestId,
        question_text: initial.question_text, option_a: initial.option_a,
        option_b: initial.option_b, option_c: initial.option_c, option_d: initial.option_d,
        correct_answer: initial.correct_answer, explanation: initial.explanation,
        explanation_image_url: initial.explanation_image_url, learning_notes: initial.learning_notes,
        difficulty: initial.difficulty, marks: initial.marks, image_url: initial.image_url,
        randomize_options: initial.randomize_options, is_active: initial.is_active,
      }
    }
    // Restore draft if adding new
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem(DRAFT_KEY)
      if (draft) {
        try {
          const parsed = JSON.parse(draft) as FormState
          if (parsed.mock_test_id === mockTestId) return parsed
        } catch { /* ignore */ }
      }
    }
    return emptyForm(mockTestId)
  })

  // Autosave draft (new questions only)
  useEffect(() => {
    if (initial) return
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    }, 800)
    return () => clearTimeout(t)
  }, [form, initial])

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(p => ({ ...p, [k]: v }))
  }

  function validate(): string | null {
    if (!form.question_text.trim()) return 'Question text is required'
    if (!form.option_a.trim()) return 'Option A is required'
    if (!form.option_b.trim()) return 'Option B is required'
    if (!form.option_c.trim()) return 'Option C is required'
    if (!form.option_d.trim()) return 'Option D is required'
    if (form.marks < 1) return 'Marks must be at least 1'
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    startTransition(async () => {
      const res = await saveQuestion({ ...form, id: initial?.id })
      if (res.error) { setError(res.error); return }
      localStorage.removeItem(DRAFT_KEY)
      setSaved(true)
      setTimeout(() => {
        router.refresh()
        onClose()
      }, 600)
    })
  }

  const tabs: { key: Tab; label: string; hasError?: boolean }[] = [
    { key: 'question',    label: 'Question',    hasError: !form.question_text.trim() && !!error },
    { key: 'answers',     label: 'Answers' },
    { key: 'explanation', label: 'Explanation' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[94vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-slate-800">{initial ? 'Edit Question' : 'Add Question'}</h2>
            {!initial && <p className="text-[11px] text-slate-400 mt-0.5">Draft auto-saved</p>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 flex-shrink-0">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`h-10 px-5 text-[13px] font-semibold border-b-2 transition-colors relative ${
                tab === t.key ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}>
              {t.label}
              {t.hasError && <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">

            {error && (
              <div className="flex items-center gap-2 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-[12.5px] text-[#B91C1C] mb-4">
                <AlertTriangle size={13} />{error}
              </div>
            )}

            {/* ── TAB 1: Question ── */}
            {tab === 'question' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Question Text <span className="text-red-500">*</span></label>
                  <textarea className={textareaCls} rows={5} value={form.question_text}
                    onChange={e => set('question_text', e.target.value)}
                    placeholder="Type the full question here. Include all relevant clinical context…" />
                  <p className="text-[11px] text-slate-400 mt-1">{form.question_text.length} characters</p>
                </div>

                <ImageField
                  label="Question Image"
                  value={form.image_url}
                  onChange={v => set('image_url', v)}
                  type="question"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Difficulty Level</label>
                    <div className="flex gap-2">
                      {(['easy', 'medium', 'hard'] as const).map(d => (
                        <button key={d} type="button" onClick={() => set('difficulty', d)}
                          className={`flex-1 h-9 rounded-lg text-[12px] font-semibold border transition-all capitalize ${
                            form.difficulty === d
                              ? d === 'easy'   ? 'bg-[#DCFCE7] border-[#22C55E] text-[#166534]'
                              : d === 'medium' ? 'bg-[#FEF3C7] border-amber-400 text-[#92400E]'
                              :                  'bg-[#FEE2E2] border-red-400 text-[#B91C1C]'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Marks</label>
                    <input className={inputCls} type="number" min={1} max={100} value={form.marks}
                      onChange={e => set('marks', parseInt(e.target.value) || 1)} />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-[13px] font-medium text-slate-700">Active / Published</p>
                    <p className="text-[11px] text-slate-400">Inactive questions won&apos;t appear in exams</p>
                  </div>
                  <button type="button" onClick={() => set('is_active', !form.is_active)}>
                    {form.is_active ? <ToggleRight size={28} className="text-primary" /> : <ToggleLeft size={28} className="text-slate-300" />}
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 2: Answers ── */}
            {tab === 'answers' && (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-[#EFF6FF] rounded-xl text-[12.5px] text-[#1D4ED8]">
                  Click the letter button to mark the correct answer. Green = correct.
                </div>

                {(['A', 'B', 'C', 'D'] as const).map(letter => (
                  <AnswerOption
                    key={letter}
                    letter={letter}
                    value={form[`option_${letter.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`]}
                    onChange={v => set(`option_${letter.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`, v)}
                    isCorrect={form.correct_answer === letter}
                    onSelect={() => set('correct_answer', letter)}
                  />
                ))}

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mt-1">
                  <div>
                    <p className="text-[13px] font-medium text-slate-700">Randomize Options</p>
                    <p className="text-[11px] text-slate-400">Shuffle A/B/C/D order for each user</p>
                  </div>
                  <button type="button" onClick={() => set('randomize_options', !form.randomize_options)}>
                    {form.randomize_options ? <ToggleRight size={26} className="text-primary" /> : <ToggleLeft size={26} className="text-slate-300" />}
                  </button>
                </div>

                {/* Answer summary */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[12px] font-semibold text-slate-500 mb-2">Answer Summary</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['A', 'B', 'C', 'D'] as const).map(letter => (
                      <div key={letter} className={`flex items-center gap-2 p-2 rounded-lg ${form.correct_answer === letter ? 'bg-[#DCFCE7]' : 'bg-white border border-slate-200'}`}>
                        <span className={`text-[11px] font-bold ${form.correct_answer === letter ? 'text-[#166534]' : 'text-slate-400'}`}>{letter}</span>
                        <span className="text-[12px] text-slate-600 truncate">{form[`option_${letter.toLowerCase() as 'a'|'b'|'c'|'d'}`] || <em className="text-slate-300">empty</em>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: Explanation ── */}
            {tab === 'explanation' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Explanation</label>
                  <textarea className={textareaCls} rows={5} value={form.explanation}
                    onChange={e => set('explanation', e.target.value)}
                    placeholder="Explain why the correct answer is right. Include clinical reasoning, references or mnemonics…" />
                </div>

                <ImageField
                  label="Explanation Image"
                  value={form.explanation_image_url}
                  onChange={v => set('explanation_image_url', v)}
                  type="explanation"
                />

                <div>
                  <label className={labelCls}>Learning Notes</label>
                  <textarea className={textareaCls} rows={3} value={form.learning_notes}
                    onChange={e => set('learning_notes', e.target.value)}
                    placeholder="Key concepts, mnemonics, or study tips related to this question…" />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex-shrink-0">
            <div className="flex gap-2">
              {tab !== 'question' && (
                <button type="button" onClick={() => setTab(tab === 'explanation' ? 'answers' : 'question')}
                  className="h-9 px-4 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:border-slate-300 transition-colors">
                  ← Back
                </button>
              )}
              {tab !== 'explanation' && (
                <button type="button" onClick={() => setTab(tab === 'question' ? 'answers' : 'explanation')}
                  className="h-9 px-4 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:border-slate-300 transition-colors">
                  Next →
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose}
                className="h-9 px-4 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl">
                Cancel
              </button>
              <button type="submit" disabled={pending || saved}
                className="h-9 px-6 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl disabled:opacity-60 transition-colors flex items-center gap-2">
                {saved
                  ? <><CheckCircle size={14} /> Saved!</>
                  : pending
                  ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                  : initial ? 'Save Changes' : 'Add Question'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
