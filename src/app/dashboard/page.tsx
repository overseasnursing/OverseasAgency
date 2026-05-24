import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUserAttempts } from '@/app/actions/exam-sessions'
import {
  BookOpen, Target, Award, TrendingUp,
  ChevronRight, Play, CheckCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — OverseasNursing',
}

export const dynamic = 'force-dynamic'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const displayName = user?.user_metadata?.full_name
    ?? user?.user_metadata?.name
    ?? user?.email?.split('@')[0]
    ?? 'there'

  const attempts = await getUserAttempts()
  const completed = attempts.filter(a => a.status === 'submitted')
  const active    = attempts.filter(a => a.status === 'in_progress')

  const scores   = completed.map(a => Number(a.percentage ?? 0))
  const avgScore = scores.length ? scores.reduce((s, x) => s + x, 0) / scores.length : null
  const best     = scores.length ? Math.max(...scores) : null
  const passCount = completed.filter(a =>
    Number(a.percentage ?? 0) >= (a.test?.passing_percentage ?? 60)
  ).length

  const recentAttempts = attempts.slice(0, 3)

  return (
    <div>
      {/* Welcome */}
      <div className="mb-7">
        <h1 className="text-[22px] font-bold text-slate-900">Welcome back, {displayName} 👋</h1>
        <p className="text-[13px] text-slate-500 mt-1">Here&apos;s a summary of your mock test activity.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          {
            icon:  <BookOpen size={18} className="text-primary" />,
            bg:    'bg-primary/10',
            label: 'Tests Taken',
            value: completed.length,
            sub:   `${active.length} in progress`,
          },
          {
            icon:  <Target size={18} className="text-emerald-600" />,
            bg:    'bg-emerald-100',
            label: 'Avg Score',
            value: avgScore !== null ? `${avgScore.toFixed(1)}%` : '—',
            sub:   'across all attempts',
          },
          {
            icon:  <Award size={18} className="text-amber-600" />,
            bg:    'bg-amber-100',
            label: 'Best Score',
            value: best !== null ? `${best.toFixed(1)}%` : '—',
            sub:   'personal best',
          },
          {
            icon:  <TrendingUp size={18} className="text-violet-600" />,
            bg:    'bg-violet-100',
            label: 'Tests Passed',
            value: passCount,
            sub:   `of ${completed.length} completed`,
          },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className="text-[21px] font-black text-slate-800 leading-none">{s.value}</p>
            <p className="text-[11.5px] font-semibold text-slate-600 mt-1">{s.label}</p>
            <p className="text-[11px] text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-3 mb-7">
        <Link href="/mock-tests"
          className="flex items-center gap-4 p-5 bg-primary rounded-2xl text-white hover:bg-primary/90 transition-colors group">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold">Browse Mock Tests</p>
            <p className="text-[12px] text-white/70 mt-0.5">Start a new exam and track your progress</p>
          </div>
          <ChevronRight size={16} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link href="/dashboard/mock-tests"
          className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 transition-colors group">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-slate-800">View All Results</p>
            <p className="text-[12px] text-slate-400 mt-0.5">See your full test history and scores</p>
          </div>
          <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Active sessions */}
      {active.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse inline-block" />
            Active Tests
          </h2>
          <div className="flex flex-col gap-2">
            {active.map(a => (
              <div key={a.id} className="bg-white border-2 border-blue-200 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Play size={15} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-800 truncate">{a.test?.name ?? 'Mock Test'}</p>
                  <p className="text-[12px] text-slate-400">{a.total_questions} questions</p>
                </div>
                {a.test && (
                  <Link
                    href={`/mock-tests/${a.test.location_slug}/${a.test.category_slug}/${a.test.slug}/attempt/${a.id}`}
                    className="flex-shrink-0 h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    Resume <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent attempts */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-[14px] font-bold text-slate-800">Recent Attempts</h2>
          <Link href="/dashboard/mock-tests"
            className="text-[12.5px] text-primary font-semibold hover:underline">
            View all →
          </Link>
        </div>

        {recentAttempts.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen size={30} className="text-slate-300 mx-auto mb-3" />
            <p className="text-[13px] text-slate-500 mb-4">No tests taken yet</p>
            <Link href="/mock-tests"
              className="inline-flex items-center gap-2 h-9 px-5 bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold rounded-xl transition-colors">
              Start your first test
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentAttempts.map(a => {
              const pct     = Number(a.percentage ?? 0)
              const passPct = a.test?.passing_percentage ?? 60
              const passed  = pct >= passPct
              return (
                <div key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    a.status === 'submitted' ? (passed ? 'bg-emerald-100' : 'bg-red-50') : 'bg-blue-50'
                  }`}>
                    {a.status === 'submitted'
                      ? <CheckCircle size={15} className={passed ? 'text-emerald-600' : 'text-red-400'} />
                      : <Play size={14} className="text-blue-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">{a.test?.name ?? '—'}</p>
                    <p className="text-[11.5px] text-slate-400">{formatDate(a.started_at)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {a.status === 'submitted' ? (
                      <>
                        <p className={`text-[14px] font-bold ${passed ? 'text-emerald-700' : 'text-red-600'}`}>
                          {pct.toFixed(1)}%
                        </p>
                        <p className="text-[11px] text-slate-400">{passed ? 'Passed' : 'Failed'}</p>
                      </>
                    ) : (
                      <span className="text-[12px] text-blue-600 font-semibold">In Progress</span>
                    )}
                  </div>
                  {a.status === 'submitted' && a.test && (
                    <Link
                      href={`/mock-tests/${a.test.location_slug}/${a.test.category_slug}/${a.test.slug}/attempt/${a.id}/result`}
                      className="flex-shrink-0 h-7 px-3 bg-primary/5 border border-primary/20 text-primary text-[12px] font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      Result
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
