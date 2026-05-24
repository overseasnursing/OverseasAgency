import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen, Clock, ChevronRight, Play, CheckCircle,
  XCircle, Zap, RotateCcw, Target, Award, TrendingUp,
} from 'lucide-react'
import { getUserAttempts, type UserAttempt } from '@/app/actions/exam-sessions'

export const metadata: Metadata = {
  title: 'My Mock Tests — OverseasNursing',
  description: 'View your mock test history, scores and results.',
}

export const dynamic = 'force-dynamic'

/* ── Helpers ────────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }: { status: UserAttempt['status'] }) {
  const map = {
    in_progress: { label: 'In Progress', cls: 'bg-blue-50 text-blue-700 border-blue-100',          icon: <Clock size={10} /> },
    submitted:   { label: 'Completed',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-100',  icon: <CheckCircle size={10} /> },
    expired:     { label: 'Expired',     cls: 'bg-red-50 text-red-600 border-red-100',              icon: <XCircle size={10} /> },
  }
  const s = map[status]
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  )
}

function GradeBadge({ pct, passPct }: { pct: number; passPct: number }) {
  if (pct >= 90)    return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50  text-amber-700  border border-amber-200">🏆 Excellent</span>
  if (pct >= 75)    return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600  border border-slate-200">🥈 Very Good</span>
  if (pct >= passPct) return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">👍 Pass</span>
  return              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50   text-red-600    border border-red-200">❌ Needs Review</span>
}

function TimeLeft({ expiresAt }: { expiresAt: string }) {
  const msLeft = new Date(expiresAt).getTime() - Date.now()
  if (msLeft <= 0) return <span className="text-[12px] text-red-500">Expired</span>
  const mins = Math.floor(msLeft / 60_000)
  return <span className="text-[12px] text-blue-600 font-semibold">{mins}m left</span>
}

/* ══════════════════════════════════════════════════════════════════════
   Page
══════════════════════════════════════════════════════════════════════ */
export default async function DashboardMockTestsPage() {
  const attempts = await getUserAttempts()

  const active    = attempts.filter(a => a.status === 'in_progress')
  const completed = attempts.filter(a => a.status === 'submitted')

  const scores    = completed.map(a => Number(a.percentage ?? 0))
  const avgScore  = scores.length ? scores.reduce((s, x) => s + x, 0) / scores.length : 0
  const bestScore = scores.length ? Math.max(...scores) : 0
  const passCount = completed.filter(a =>
    Number(a.percentage ?? 0) >= (a.test?.passing_percentage ?? 60)
  ).length

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900">My Mock Tests</h1>
          <p className="text-[13px] text-slate-500 mt-1">{attempts.length} attempt{attempts.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/mock-tests"
          className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold rounded-xl transition-colors">
          <BookOpen size={13} /> Browse Tests
        </Link>
      </div>

      {/* Stats */}
      {completed.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: <BookOpen   size={16} className="text-primary" />,       label: 'Completed',  value: completed.length,          sub: `${active.length} active`             },
            { icon: <Target     size={16} className="text-emerald-500" />,   label: 'Avg Score',  value: `${avgScore.toFixed(1)}%`,  sub: 'all submissions'                     },
            { icon: <Award      size={16} className="text-amber-500" />,     label: 'Best Score', value: `${bestScore.toFixed(1)}%`, sub: 'personal best'                       },
            { icon: <TrendingUp size={16} className="text-violet-500" />,    label: 'Passed',     value: passCount,                  sub: `of ${completed.length} completed`    },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                <span className="text-[10.5px] text-slate-400 uppercase tracking-wide font-semibold">{s.label}</span>
              </div>
              <p className="text-[21px] font-black text-slate-800 leading-none">{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active sessions */}
      {active.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse inline-block" />
            Active Sessions
          </h2>
          <div className="flex flex-col gap-2">
            {active.map(a => (
              <div key={a.id} className="bg-white border-2 border-blue-200 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Play size={15} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-800 truncate">{a.test?.name ?? 'Mock Test'}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[12px] text-slate-400">{a.total_questions} questions</span>
                    <TimeLeft expiresAt={a.expires_at} />
                  </div>
                </div>
                {a.test && (
                  <Link
                    href={`/mock-tests/${a.test.location_slug}/${a.test.category_slug}/${a.test.slug}/attempt/${a.id}`}
                    className="flex-shrink-0 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    Resume <ChevronRight size={13} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All attempts */}
      {attempts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <BookOpen size={36} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-[16px] font-semibold text-slate-600 mb-2">No attempts yet</h2>
          <p className="text-[13px] text-slate-400 mb-5">Start a mock test to see your results here.</p>
          <Link href="/mock-tests"
            className="inline-flex items-center gap-2 h-9 px-5 bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold rounded-xl transition-colors">
            Browse Mock Tests
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-slate-800">All Attempts</h2>
            <span className="text-[12px] text-slate-400">({attempts.length})</span>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-slate-100">
            {attempts.map(a => {
              const pct     = Number(a.percentage ?? 0)
              const passPct = a.test?.passing_percentage ?? 60
              const passed  = pct >= passPct
              return (
                <div key={a.id} className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13.5px] font-semibold text-slate-800 flex-1 leading-tight">{a.test?.name ?? '—'}</p>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.status === 'submitted' && (
                      <>
                        <span className={`text-[15px] font-bold ${passed ? 'text-emerald-700' : 'text-red-600'}`}>{pct.toFixed(1)}%</span>
                        <GradeBadge pct={pct} passPct={passPct} />
                      </>
                    )}
                    {a.status === 'in_progress' && <TimeLeft expiresAt={a.expires_at} />}
                    <span className="text-[12px] text-slate-400">{formatDate(a.started_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    {a.status === 'in_progress' && a.test && (
                      <Link href={`/mock-tests/${a.test.location_slug}/${a.test.category_slug}/${a.test.slug}/attempt/${a.id}`}
                        className="h-7 px-3 bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-semibold rounded-lg flex items-center gap-1 transition-colors">
                        Resume <ChevronRight size={11} />
                      </Link>
                    )}
                    {a.status === 'submitted' && a.test && (
                      <>
                        <Link href={`/mock-tests/${a.test.location_slug}/${a.test.category_slug}/${a.test.slug}/attempt/${a.id}/result`}
                          className="h-7 px-3 bg-primary/5 border border-primary/20 text-primary text-[12px] font-semibold rounded-lg flex items-center gap-1 transition-colors">
                          <Zap size={11} /> Result
                        </Link>
                        <Link href={`/mock-tests/${a.test.location_slug}/${a.test.category_slug}`}
                          className="h-7 px-3 bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-semibold rounded-lg flex items-center gap-1 transition-colors">
                          <RotateCcw size={11} /> Retry
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop table */}
          <table className="hidden sm:table w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-semibold text-slate-500">Test</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Score</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Grade</th>
                <th className="px-5 py-3 text-right font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attempts.map(a => {
                const pct     = Number(a.percentage ?? 0)
                const passPct = a.test?.passing_percentage ?? 60
                const passed  = pct >= passPct
                return (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-800 max-w-[200px] truncate">{a.test?.name ?? '—'}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{a.total_questions} questions</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{formatDate(a.started_at)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={a.status} />
                        {a.status === 'in_progress' && <TimeLeft expiresAt={a.expires_at} />}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {a.status === 'submitted'
                        ? <span className={`text-[15px] font-bold ${passed ? 'text-emerald-700' : 'text-red-600'}`}>{pct.toFixed(1)}%</span>
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      {a.status === 'submitted'
                        ? <GradeBadge pct={pct} passPct={passPct} />
                        : <span className="text-slate-300 text-[12px]">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {a.status === 'in_progress' && a.test && (
                          <Link href={`/mock-tests/${a.test.location_slug}/${a.test.category_slug}/${a.test.slug}/attempt/${a.id}`}
                            className="inline-flex items-center gap-1.5 h-7 px-3 bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                            <Play size={10} /> Resume
                          </Link>
                        )}
                        {a.status === 'submitted' && a.test && (
                          <>
                            <Link href={`/mock-tests/${a.test.location_slug}/${a.test.category_slug}/${a.test.slug}/attempt/${a.id}/result`}
                              className="inline-flex items-center gap-1.5 h-7 px-3 bg-primary/5 border border-primary/20 text-primary text-[12px] font-semibold rounded-lg hover:bg-primary/10 transition-colors">
                              <Zap size={10} /> Result
                            </Link>
                            <Link href={`/mock-tests/${a.test.location_slug}/${a.test.category_slug}`}
                              className="inline-flex items-center gap-1.5 h-7 px-3 bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-100 transition-colors">
                              <RotateCcw size={10} /> Retry
                            </Link>
                          </>
                        )}
                        {a.status === 'expired' && <span className="text-[12px] text-slate-300">—</span>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
