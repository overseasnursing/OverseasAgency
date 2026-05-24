'use client'

import { useState, useTransition } from 'react'
import {
  BookmarkCheck, Bookmark, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Filter,
} from 'lucide-react'
import { toggleBookmark, type BookmarkedQuestion } from '@/app/actions/bookmarks'

type DiffFilter = 'all' | 'easy' | 'medium' | 'hard'

function DiffBadge({ d }: { d: string }) {
  const map: Record<string, string> = {
    easy:   'bg-emerald-50 text-emerald-700 border-emerald-100',
    medium: 'bg-amber-50 text-amber-700 border-amber-100',
    hard:   'bg-red-50 text-red-600 border-red-100',
  }
  return (
    <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${map[d] ?? 'bg-slate-50 text-slate-500 border-slate-100'}`}>
      {d}
    </span>
  )
}

function QuestionCard({ bq, onRemove }: { bq: BookmarkedQuestion; onRemove: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [removing, startRemove] = useTransition()

  const q = bq.question

  function handleRemove() {
    startRemove(async () => {
      await toggleBookmark(bq.question_id)
      onRemove(bq.question_id)
    })
  }

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all ${removing ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* Card header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {q?.difficulty && <DiffBadge d={q.difficulty} />}
              <span className="text-[11px] text-slate-400">{q?.marks ?? 1} mark{(q?.marks ?? 1) > 1 ? 's' : ''}</span>
              {bq.question?.mock_test_name && (
                <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full truncate max-w-[160px]">
                  {bq.question.mock_test_name}
                </span>
              )}
            </div>
            <p className="text-[14px] font-medium text-slate-800 leading-snug line-clamp-2">
              {q?.question_text ?? 'Question unavailable'}
            </p>
          </div>
          <button onClick={handleRemove}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-amber-500 hover:bg-amber-50 transition-colors"
            title="Remove bookmark">
            <BookmarkCheck size={16} />
          </button>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-5 py-2.5 border-t border-slate-100 text-[12px] text-slate-400 hover:bg-slate-50 transition-colors"
      >
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {expanded ? 'Hide answer' : 'Show answer & explanation'}
      </button>

      {/* Expanded content */}
      {expanded && q && (
        <div className="px-5 pb-5 flex flex-col gap-3 border-t border-slate-100 pt-4">
          {/* Options */}
          <div className="flex flex-col gap-2">
            {(['A', 'B', 'C', 'D'] as const).map(letter => {
              const text = q[`option_${letter.toLowerCase()}` as keyof typeof q] as string
              const isCorrect = q.correct_answer === letter
              return (
                <div key={letter}
                  className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border-2 ${
                    isCorrect ? 'border-emerald-400 bg-emerald-50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                    isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>{letter}</span>
                  <span className={`text-[13px] leading-snug ${isCorrect ? 'text-emerald-800 font-semibold' : 'text-slate-700'}`}>{text}</span>
                  {isCorrect && <CheckCircle size={13} className="text-emerald-500 flex-shrink-0 mt-0.5 ml-auto" />}
                </div>
              )
            })}
          </div>

          {/* Explanation */}
          {q.explanation && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wide mb-1.5">Explanation</p>
              <p className="text-[13px] text-blue-900 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {/* Learning notes */}
          {q.learning_notes && (
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
              <p className="text-[10.5px] font-bold text-violet-600 uppercase tracking-wide mb-1.5">Learning Notes</p>
              <p className="text-[13px] text-violet-900 leading-relaxed">{q.learning_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */

export function BookmarksClient({ bookmarks: initial }: { bookmarks: BookmarkedQuestion[] }) {
  const [bookmarks, setBookmarks] = useState(initial)
  const [diffFilter, setDiffFilter] = useState<DiffFilter>('all')

  function onRemove(questionId: string) {
    setBookmarks(prev => prev.filter(b => b.question_id !== questionId))
  }

  const filtered = diffFilter === 'all'
    ? bookmarks
    : bookmarks.filter(b => b.question?.difficulty === diffFilter)

  const counts = {
    all:    bookmarks.length,
    easy:   bookmarks.filter(b => b.question?.difficulty === 'easy').length,
    medium: bookmarks.filter(b => b.question?.difficulty === 'medium').length,
    hard:   bookmarks.filter(b => b.question?.difficulty === 'hard').length,
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={13} className="text-slate-400" />
        {(['all', 'easy', 'medium', 'hard'] as DiffFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setDiffFilter(f)}
            className={`h-7 px-3 text-[12px] font-semibold rounded-full border transition-colors capitalize ${
              diffFilter === f
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {f} {counts[f] > 0 && <span className="opacity-70 ml-0.5">({counts[f]})</span>}
          </button>
        ))}
      </div>

      {/* Question cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
          <Bookmark size={28} className="text-slate-300 mx-auto mb-3" />
          <p className="text-[14px] text-slate-400">No {diffFilter !== 'all' ? diffFilter + ' ' : ''}bookmarks to show.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(bq => (
            <QuestionCard key={bq.question_id} bq={bq} onRemove={onRemove} />
          ))}
        </div>
      )}

      {/* Summary strip */}
      {bookmarks.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {([
            { label: 'Easy',   count: counts.easy,   cls: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Medium', count: counts.medium, cls: 'text-amber-600',   bg: 'bg-amber-50 border-amber-100' },
            { label: 'Hard',   count: counts.hard,   cls: 'text-red-600',     bg: 'bg-red-50 border-red-100' },
          ]).map(s => (
            <div key={s.label} className={`border rounded-2xl p-4 text-center ${s.bg}`}>
              <p className={`text-[20px] font-bold ${s.cls}`}>{s.count}</p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
