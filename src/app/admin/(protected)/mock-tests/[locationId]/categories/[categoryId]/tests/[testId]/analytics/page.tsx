import { notFound } from 'next/navigation'
import Link         from 'next/link'
import {
  ChevronRight, BarChart2, CheckCircle, XCircle,
  Users, Target, TrendingUp, AlertTriangle, Trophy,
} from 'lucide-react'
import { createAdminClient }    from '@/lib/supabase/admin'
import { getTestAdminAnalytics } from '@/app/actions/exam-analytics'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{
    locationId:  string
    categoryId:  string
    testId:      string
  }>
}

function DiffBadge({ d }: { d: string }) {
  if (d === 'hard')   return <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">Hard</span>
  if (d === 'medium') return <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Medium</span>
  return                     <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Easy</span>
}

export default async function TestAnalyticsPage({ params }: PageProps) {
  const { locationId, categoryId, testId } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [
    { data: location },
    { data: category },
    { data: test },
  ] = await Promise.all([
    db.from('mock_test_locations').select('id, name').eq('id', locationId).single(),
    db.from('mock_test_categories').select('id, name').eq('id', categoryId).single(),
    db.from('mock_tests').select('id, name, passing_percentage, duration_minutes, total_questions').eq('id', testId).single(),
  ])

  if (!location || !category || !test) notFound()

  const analytics = await getTestAdminAnalytics(testId)

  const completionPct = Math.round(analytics.completion_rate * 100)
  const passPct       = analytics.submitted_count > 0
    ? Math.round((analytics.pass_count / analytics.submitted_count) * 100)
    : 0

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">Test Analytics</h1>
        <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 flex-wrap">
          <Link href="/admin/mock-tests" className="hover:text-primary transition-colors font-medium text-slate-600">Mock Tests</Link>
          <ChevronRight size={12} />
          <Link href={`/admin/mock-tests/${locationId}/categories`} className="hover:text-primary">{location.name}</Link>
          <ChevronRight size={12} />
          <Link href={`/admin/mock-tests/${locationId}/categories/${categoryId}/tests`} className="hover:text-primary">{category.name}</Link>
          <ChevronRight size={12} />
          <span className="text-slate-600 font-medium">{test.name}</span>
          <ChevronRight size={12} />
          <span className="text-slate-600">Analytics</span>
        </nav>
      </div>

      {/* Test name card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <BarChart2 size={22} className="text-primary" />
        </div>
        <div>
          <p className="text-[17px] font-bold text-slate-900">{test.name}</p>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            {test.total_questions} questions · {test.duration_minutes} min · Pass: {test.passing_percentage}%
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Link
            href={`/admin/mock-tests/${locationId}/categories/${categoryId}/tests/${testId}/questions`}
            className="h-9 px-4 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            Questions
          </Link>
        </div>
      </div>

      {/* ── Overview stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: <Users     size={18} className="text-primary" />,       label: 'Total Attempts',   value: analytics.total_attempts,                           cls: 'text-primary' },
          { icon: <CheckCircle size={18} className="text-emerald-500" />, label: 'Submitted',        value: analytics.submitted_count,                          cls: 'text-emerald-700' },
          { icon: <Trophy    size={18} className="text-amber-500" />,     label: 'Passed',           value: analytics.pass_count,                               cls: 'text-amber-700' },
          { icon: <XCircle   size={18} className="text-red-400" />,       label: 'Failed',           value: analytics.fail_count,                               cls: 'text-red-600' },
          { icon: <Target    size={18} className="text-violet-500" />,    label: 'Avg Score',        value: `${analytics.avg_percentage.toFixed(1)}%`,          cls: 'text-violet-700' },
          { icon: <TrendingUp size={18} className="text-blue-500" />,     label: 'Completion Rate',  value: `${completionPct}%`,                                cls: 'text-blue-700' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-between">
              {s.icon}
              <span className="text-[10.5px] text-slate-400 uppercase tracking-wide font-semibold">{s.label}</span>
            </div>
            <p className={`text-[24px] font-black leading-none ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Pass / Fail chart bar ──────────────────────────────────── */}
      {analytics.submitted_count > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart2 size={15} className="text-primary" /> Pass / Fail Breakdown
          </h2>
          <div className="flex gap-2 h-10 rounded-xl overflow-hidden">
            {analytics.pass_count > 0 && (
              <div className="bg-emerald-400 flex items-center justify-center transition-all"
                style={{ flex: analytics.pass_count }}>
                <span className="text-[12px] font-bold text-white">{analytics.pass_count} passed</span>
              </div>
            )}
            {analytics.fail_count > 0 && (
              <div className="bg-red-400 flex items-center justify-center"
                style={{ flex: analytics.fail_count }}>
                <span className="text-[12px] font-bold text-white">{analytics.fail_count} failed</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 text-[12.5px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-400" />
              <span className="text-slate-600">Passed: <strong>{passPct}%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-red-400" />
              <span className="text-slate-600">Failed: <strong>{100 - passPct}%</strong></span>
            </div>
            <span className="text-slate-400">Pass mark: {test.passing_percentage}%</span>
          </div>
        </div>
      )}

      {/* ── Most failed questions ──────────────────────────────────── */}
      {analytics.most_failed.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle size={15} className="text-red-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Most Failed Questions</h2>
            <span className="text-[12px] text-slate-400 ml-auto">Top {analytics.most_failed.length} by failure rate</span>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-semibold text-slate-500">Question</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Difficulty</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-500">Shown</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-500">Wrong</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500">Failure %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.most_failed.map((q, i) => (
                <tr key={q.question_id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-slate-800 leading-snug line-clamp-2 max-w-[360px]">{q.question_text}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><DiffBadge d={q.difficulty} /></td>
                  <td className="px-4 py-3.5 text-right text-slate-600">{q.total_shown}</td>
                  <td className="px-4 py-3.5 text-right text-red-600 font-semibold">{q.wrong_count}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`font-bold text-[13px] ${
                      q.failure_rate >= 0.7 ? 'text-red-600'
                      : q.failure_rate >= 0.5 ? 'text-amber-700'
                      : 'text-slate-700'
                    }`}>
                      {(q.failure_rate * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-[14px] font-semibold text-slate-600 mb-1">No submitted attempts yet</p>
          <p className="text-[12.5px] text-slate-400">Question failure data will appear once users submit attempts.</p>
        </div>
      )}

      {/* ── No attempts at all ─────────────────────────────────────── */}
      {analytics.total_attempts === 0 && (
        <div className="flex items-start gap-3 text-[12.5px] text-slate-400 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-400" />
          This test has not been attempted yet. Share it with users to start collecting analytics.
        </div>
      )}
    </div>
  )
}
