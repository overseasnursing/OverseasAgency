'use client'

import React, { useState, useRef, useTransition, useCallback } from 'react'
import { X, Upload, Download, AlertTriangle, CheckCircle, FileText, Trash2 } from 'lucide-react'
import { bulkImportQuestions, type BulkQuestionRow } from '@/app/actions/admin-questions'

const HEADERS = ['question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explanation', 'difficulty', 'marks']
const DISPLAY_HEADERS = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Explanation', 'Difficulty', 'Marks']

type ParsedRow = BulkQuestionRow & {
  _rowNum: number
  _errors: string[]
  _isDuplicate: boolean
}

function parseCSV(text: string): string[][] {
  const lines: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (ch === '"' && next === '"') { cell += '"'; i++ }
      else if (ch === '"') inQuotes = false
      else cell += ch
    } else {
      if (ch === '"') { inQuotes = true }
      else if (ch === ',') { row.push(cell); cell = '' }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && next === '\n') i++
        row.push(cell); cell = ''
        if (row.some(c => c.trim())) lines.push(row)
        row = []
      } else {
        cell += ch
      }
    }
  }
  if (cell || row.length) { row.push(cell); if (row.some(c => c.trim())) lines.push(row) }
  return lines
}

function validateAndMap(rows: string[][], existingTexts: string[]): ParsedRow[] {
  const existingSet = new Set(existingTexts.map(t => t.trim().toLowerCase()))
  return rows.map((cols, idx) => {
    const errors: string[] = []
    const get = (i: number) => (cols[i] ?? '').trim()

    const question_text  = get(0)
    const option_a       = get(1)
    const option_b       = get(2)
    const option_c       = get(3)
    const option_d       = get(4)
    const correct_answer = get(5).toUpperCase() as 'A' | 'B' | 'C' | 'D'
    const explanation    = get(6)
    const difficulty     = get(7).toLowerCase() as 'easy' | 'medium' | 'hard'
    const marksRaw       = get(8)
    const marks          = parseInt(marksRaw) || 0

    if (!question_text)                               errors.push('Question text is required')
    if (!option_a)                                    errors.push('Option A is required')
    if (!option_b)                                    errors.push('Option B is required')
    if (!option_c)                                    errors.push('Option C is required')
    if (!option_d)                                    errors.push('Option D is required')
    if (!['A', 'B', 'C', 'D'].includes(correct_answer)) errors.push('Correct answer must be A, B, C or D')
    if (!['easy', 'medium', 'hard'].includes(difficulty)) errors.push('Difficulty must be easy, medium or hard')
    if (!marksRaw || marks < 1)                       errors.push('Marks must be a positive number')

    return {
      _rowNum: idx + 2,
      _errors: errors,
      _isDuplicate: existingSet.has(question_text.toLowerCase()),
      question_text, option_a, option_b, option_c, option_d,
      correct_answer, explanation, difficulty, marks,
    }
  })
}

function downloadTemplate() {
  const header = DISPLAY_HEADERS.join(',')
  const sample = [
    '"What is the normal adult heart rate?","60–100 bpm","100–140 bpm","40–60 bpm","Above 140 bpm","A","The normal resting adult heart rate is 60–100 bpm.","easy","1"',
    '"Which nerve controls diaphragm movement?","Vagus nerve","Phrenic nerve","Femoral nerve","Radial nerve","B","The phrenic nerve (C3–C5) innervates the diaphragm.","medium","1"',
  ].join('\n')
  const blob = new Blob([header + '\n' + sample], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'questions-template.csv'
  a.click()
}

/* ── Main Component ─────────────────────────────────────────────────── */
export function BulkImportModal({
  mockTestId, existingTexts, onClose,
}: {
  mockTestId: string
  existingTexts: string[]
  onClose: () => void
}) {
  const fileRef           = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()
  const [rows, setRows]   = useState<ParsedRow[] | null>(null)
  const [fileName, setFileName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState<number | null>(null)
  const [skipDuplicates, setSkipDuplicates] = useState(true)

  const validRows = (rows ?? []).filter(r => r._errors.length === 0 && (!skipDuplicates || !r._isDuplicate))
  const errorCount = (rows ?? []).filter(r => r._errors.length > 0).length
  const dupCount   = (rows ?? []).filter(r => r._isDuplicate).length

  const processFile = useCallback((file: File) => {
    if (!file.name.match(/\.(csv|txt)$/i)) {
      setImportError('Please upload a CSV file (.csv)')
      return
    }
    setFileName(file.name)
    setImportError(null)
    setImportedCount(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      if (!parsed.length) { setImportError('File appears to be empty'); return }

      // Detect header row
      const firstRow = parsed[0].map(c => c.trim().toLowerCase())
      const isHeader = firstRow.some(c => c === 'question' || c === 'question_text' || c === 'option a' || c === 'option_a')
      const dataRows = isHeader ? parsed.slice(1) : parsed

      if (!dataRows.length) { setImportError('No data rows found after the header'); return }
      setRows(validateAndMap(dataRows, existingTexts))
    }
    reader.readAsText(file)
  }, [existingTexts])

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleImport() {
    if (!validRows.length) return
    setImportError(null)
    startTransition(async () => {
      const res = await bulkImportQuestions(
        validRows.map(r => ({
          question_text: r.question_text, option_a: r.option_a, option_b: r.option_b,
          option_c: r.option_c, option_d: r.option_d, correct_answer: r.correct_answer,
          explanation: r.explanation, difficulty: r.difficulty, marks: r.marks,
        })),
        mockTestId,
      )
      if (res.error) { setImportError(res.error); return }
      setImportedCount(res.imported)
    })
  }

  const DIFF_COLORS: Record<string, string> = {
    easy: 'bg-[#DCFCE7] text-[#166534]',
    medium: 'bg-[#FEF3C7] text-[#92400E]',
    hard: 'bg-[#FEE2E2] text-[#B91C1C]',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-slate-800">Bulk Import Questions</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Upload a CSV file to import multiple questions at once</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

          {/* Success state */}
          {importedCount !== null ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-[#16A34A]" />
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold text-slate-800">{importedCount} question{importedCount !== 1 ? 's' : ''} imported!</p>
                <p className="text-[13px] text-slate-500 mt-1">They&apos;ve been added to the end of your question list.</p>
              </div>
              <button onClick={onClose} className="h-9 px-6 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors">
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Template download + upload area */}
              <div className="flex items-start gap-4">
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'}`}
                >
                  <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileChange} />
                  <Upload size={24} className="text-slate-400 mb-2" />
                  {fileName ? (
                    <>
                      <p className="text-[13px] font-semibold text-slate-700">{fileName}</p>
                      <p className="text-[12px] text-slate-400 mt-0.5">Click or drop a new file to replace</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[13px] font-semibold text-slate-700">Drop CSV here or click to upload</p>
                      <p className="text-[12px] text-slate-400 mt-0.5">Accepts .csv files</p>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 h-9 px-4 border border-slate-200 hover:border-primary/40 hover:bg-primary/5 text-slate-700 hover:text-primary text-[12.5px] font-semibold rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Download size={13} /> Download Template
                  </button>
                  <p className="text-[11px] text-slate-400 max-w-[160px] leading-relaxed">
                    Use the template to ensure correct column format
                  </p>
                </div>
              </div>

              {/* CSV column format hint */}
              {!rows && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-[12px] font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                    <FileText size={13} /> Expected CSV column order
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {DISPLAY_HEADERS.map((h, i) => (
                      <span key={h} className={`text-[11px] px-2 py-0.5 rounded-md font-mono ${i === 5 ? 'bg-violet-100 text-violet-700' : i === 7 ? 'bg-amber-50 text-amber-700' : 'bg-white border border-slate-200 text-slate-600'}`}>
                        {h}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Correct Answer: A, B, C or D &nbsp;·&nbsp; Difficulty: easy, medium or hard &nbsp;·&nbsp; Marks: positive integer</p>
                </div>
              )}

              {/* Import error */}
              {importError && (
                <div className="flex items-center gap-2 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[12.5px] text-[#B91C1C]">
                  <AlertTriangle size={14} className="flex-shrink-0" /> {importError}
                </div>
              )}

              {/* Preview table */}
              {rows && rows.length > 0 && (
                <div className="flex flex-col gap-3">
                  {/* Summary bar */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[12.5px] font-semibold text-slate-700">{rows.length} rows parsed</span>
                    {errorCount > 0 && (
                      <span className="text-[12px] text-[#B91C1C] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                        {errorCount} row{errorCount !== 1 ? 's' : ''} with errors (will be skipped)
                      </span>
                    )}
                    {dupCount > 0 && (
                      <span className="text-[12px] text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                        {dupCount} duplicate{dupCount !== 1 ? 's' : ''} detected
                      </span>
                    )}
                    {dupCount > 0 && (
                      <label className="flex items-center gap-2 cursor-pointer ml-auto">
                        <input
                          type="checkbox"
                          checked={skipDuplicates}
                          onChange={e => setSkipDuplicates(e.target.checked)}
                          className="w-3.5 h-3.5 rounded accent-primary"
                        />
                        <span className="text-[12px] text-slate-600">Skip duplicates</span>
                      </label>
                    )}
                  </div>

                  {/* Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
                      <table className="w-full text-[12px]">
                        <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                          <tr>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500 w-10">#</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500 min-w-[200px]">Question</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500">A</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500">B</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500 w-12">Ans</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500 w-20">Difficulty</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500 w-12">Marks</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rows.map((row) => {
                            const hasError = row._errors.length > 0
                            const isDup    = row._isDuplicate
                            const rowCls   = hasError ? 'bg-[#FFF5F5]' : isDup ? 'bg-amber-50/60' : ''
                            return (
                              <tr key={row._rowNum} className={rowCls}>
                                <td className="px-3 py-2 text-slate-400 font-mono">{row._rowNum}</td>
                                <td className="px-3 py-2 text-slate-700 max-w-[220px]">
                                  <p className="truncate" title={row.question_text}>{row.question_text || <span className="text-red-400 italic">missing</span>}</p>
                                </td>
                                <td className="px-3 py-2 text-slate-600 max-w-[100px]">
                                  <p className="truncate">{row.option_a}</p>
                                </td>
                                <td className="px-3 py-2 text-slate-600 max-w-[100px]">
                                  <p className="truncate">{row.option_b}</p>
                                </td>
                                <td className="px-3 py-2">
                                  <span className="font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">{row.correct_answer}</span>
                                </td>
                                <td className="px-3 py-2">
                                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${DIFF_COLORS[row.difficulty] ?? 'bg-slate-100 text-slate-500'}`}>
                                    {row.difficulty || '—'}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-center text-slate-700">{row.marks || '—'}</td>
                                <td className="px-3 py-2">
                                  {hasError ? (
                                    <span className="text-[11px] text-[#B91C1C]" title={row._errors.join(', ')}>
                                      ⚠ {row._errors[0]}{row._errors.length > 1 ? ` +${row._errors.length - 1}` : ''}
                                    </span>
                                  ) : isDup ? (
                                    <span className="text-[11px] text-amber-600">Duplicate</span>
                                  ) : (
                                    <span className="text-[11px] text-[#166534]">✓ Ready</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Valid row summary */}
                  <p className="text-[12px] text-slate-500">
                    <span className="font-semibold text-slate-800">{validRows.length}</span> question{validRows.length !== 1 ? 's' : ''} ready to import
                    {skipDuplicates && dupCount > 0 && <span className="text-amber-600"> ({dupCount} duplicate{dupCount !== 1 ? 's' : ''} will be skipped)</span>}
                  </p>

                  {/* Reset */}
                  <button
                    onClick={() => { setRows(null); setFileName(''); setImportError(null) }}
                    className="self-start flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Trash2 size={11} /> Clear and upload a different file
                  </button>
                </div>
              )}

              {/* Empty parse result */}
              {rows && rows.length === 0 && (
                <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[13px] text-[#B91C1C]">
                  No valid rows found in the file. Please check the format and try again.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {importedCount === null && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 flex-shrink-0">
            <button onClick={onClose} className="h-9 px-5 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:border-slate-300 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={pending || !validRows.length}
              className="h-9 px-6 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pending ? 'Importing…' : `Import ${validRows.length || ''} Question${validRows.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
