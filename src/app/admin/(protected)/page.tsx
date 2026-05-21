import React from 'react'
import {
  FileText, AlertTriangle, CheckCircle, Clock, XCircle,
  Building2, Users, ArrowRight, TrendingUp, ShieldAlert,
} from 'lucide-react'
import { getReviewStats, getRecentReviewsAdmin } from '@/lib/db/reviews'
import { getScamReportStats, getRecentScamReportsAdmin } from '@/lib/db/scam-reports'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

async function getTotalAgencies(): Promise<number> {
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (db as any).from('agencies').select('id', { count: 'exact', head: true })
  return count ?? 0
}

async function getTotalUsers(): Promise<number> {
  const db = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (db as any).from('users').select('id', { count: 'exact', head: true })
  return count ?? 0
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:  'bg-[#FEF3C7] text-[#92400E]',
    approved: 'bg-[#DCFCE7] text-[#166534]',
    rejected: 'bg-[#FEE2E2] text-[#B91C1C]',
  }
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default async function AdminDashboardPage() {
  const [reviewStats, scamStats, totalAgencies, totalUsers, recentReviews, recentScams] =
    await Promise.all([
      getReviewStats(),
      getScamReportStats(),
      getTotalAgencies(),
      getTotalUsers(),
      getRecentReviewsAdmin(6),
      getRecentScamReportsAdmin(6),
    ])

  const totalPending = reviewStats.pending + scamStats.pending

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-slate-900 mb-1">Dashboard</h1>
        <p className="text-[14px] text-slate-500">Overview of your platform — agencies, reviews, users, and moderation queue.</p>
      </div>

      {/* Top stats — 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Agencies',
            value: totalAgencies,
            icon: Building2,
            bg: 'bg-[#EFF6FF]',
            iconColor: 'text-primary',
            href: '/admin/agencies',
          },
          {
            label: 'Total Reviews',
            value: reviewStats.total,
            icon: FileText,
            bg: 'bg-[#DCFCE7]',
            iconColor: 'text-[#166534]',
            href: '/admin/reviews',
          },
          {
            label: 'Scam Reports',
            value: scamStats.total,
            icon: ShieldAlert,
            bg: 'bg-[#FEE2E2]',
            iconColor: 'text-[#DC2626]',
            href: '/admin/scam-reports',
          },
          {
            label: 'Registered Users',
            value: totalUsers,
            icon: Users,
            bg: 'bg-[#F3E8FF]',
            iconColor: 'text-[#7E22CE]',
            href: null,
          },
        ].map(({ label, value, icon: Icon, bg, iconColor, href }) => (
          <div
            key={label}
            className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon size={18} className={iconColor} />
            </div>
            <div>
              <p className="text-[28px] font-bold text-slate-900 leading-none mb-1">{value}</p>
              <p className="text-[13px] text-slate-500">{label}</p>
            </div>
            {href && (
              <a href={href} className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1 mt-auto">
                View all <ArrowRight size={11} />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Moderation breakdown — 2 cards */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Reviews breakdown */}
        <a href="/admin/reviews" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#DBEAFE] rounded-xl">
                <FileText size={16} className="text-[#1D4ED8]" />
              </div>
              <span className="text-[15px] font-bold text-slate-800">Reviews</span>
            </div>
            {reviewStats.pending > 0 && (
              <span className="text-[11px] font-bold text-white bg-[#1D4ED8] px-2.5 py-1 rounded-full">
                {reviewStats.pending} pending
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Pending',  value: reviewStats.pending,  icon: Clock,        color: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
              { label: 'Approved', value: reviewStats.approved, icon: CheckCircle,  color: 'text-[#166534]', bg: 'bg-[#DCFCE7]' },
              { label: 'Rejected', value: reviewStats.rejected, icon: XCircle,      color: 'text-[#B91C1C]', bg: 'bg-[#FEE2E2]' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                <Icon size={14} className={`${color} mx-auto mb-1`} />
                <p className={`text-[20px] font-bold ${color}`}>{value}</p>
                <p className="text-[11px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </a>

        {/* Scam reports breakdown */}
        <a href="/admin/scam-reports" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-red-300 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FEE2E2] rounded-xl">
                <AlertTriangle size={16} className="text-[#DC2626]" />
              </div>
              <span className="text-[15px] font-bold text-slate-800">Scam Reports</span>
            </div>
            {scamStats.pending > 0 && (
              <span className="text-[11px] font-bold text-white bg-[#DC2626] px-2.5 py-1 rounded-full">
                {scamStats.pending} pending
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Pending',  value: scamStats.pending,  icon: Clock,        color: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
              { label: 'Approved', value: scamStats.approved, icon: CheckCircle,  color: 'text-[#166534]', bg: 'bg-[#DCFCE7]' },
              { label: 'Rejected', value: scamStats.rejected, icon: XCircle,      color: 'text-[#B91C1C]', bg: 'bg-[#FEE2E2]' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                <Icon size={14} className={`${color} mx-auto mb-1`} />
                <p className={`text-[20px] font-bold ${color}`}>{value}</p>
                <p className="text-[11px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </a>
      </div>

      {/* All-clear banner */}
      {totalPending === 0 && (
        <div className="flex items-center gap-2 text-[14px] text-[#166534] bg-[#DCFCE7] border border-[#BBF7D0] rounded-2xl px-5 py-4">
          <CheckCircle size={16} />
          All submissions have been moderated. Nothing pending.
        </div>
      )}

      {/* Recent submissions — side by side */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Reviews */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-primary" />
              <span className="text-[14px] font-bold text-slate-800">Recent Reviews</span>
            </div>
            <a href="/admin/reviews" className="text-[12px] text-primary font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </a>
          </div>
          {recentReviews.length === 0 ? (
            <p className="text-[13px] text-slate-400 p-5">No reviews yet.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentReviews.map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">
                      {(r as Record<string, unknown>).author_name as string ?? 'Anonymous'}
                    </p>
                    <p className="text-[12px] text-slate-400 truncate">
                      {(r as Record<string, unknown>).agency_slug as string} · {formatDate(r.created_at as string)}
                    </p>
                  </div>
                  <StatusBadge status={r.status as string} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Scam Reports */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-[#DC2626]" />
              <span className="text-[14px] font-bold text-slate-800">Recent Scam Reports</span>
            </div>
            <a href="/admin/scam-reports" className="text-[12px] text-primary font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </a>
          </div>
          {recentScams.length === 0 ? (
            <p className="text-[13px] text-slate-400 p-5">No scam reports yet.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentScams.map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">
                      {(r as Record<string, unknown>).agency_name as string ?? 'Unknown Agency'}
                    </p>
                    <p className="text-[12px] text-slate-400 truncate">
                      {(r as Record<string, unknown>).reporter_name as string ?? 'Anonymous'} · {formatDate(r.created_at as string)}
                    </p>
                  </div>
                  <StatusBadge status={r.status as string} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5">
        <p className="text-[13px] font-bold text-slate-700 uppercase tracking-wide mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Moderate Reviews',      href: '/admin/reviews',        color: 'bg-[#EFF6FF] text-primary hover:bg-[#DBEAFE]' },
            { label: 'Moderate Scam Reports', href: '/admin/scam-reports',   color: 'bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]' },
            { label: 'Add New Agency',         href: '/admin/agencies/new',   color: 'bg-[#F0FDF4] text-[#166534] hover:bg-[#DCFCE7]' },
            { label: 'Manage Agencies',        href: '/admin/agencies',       color: 'bg-slate-50 text-slate-700 hover:bg-slate-100' },
            { label: 'View Live Site',         href: '/',                     color: 'bg-slate-50 text-slate-700 hover:bg-slate-100' },
          ].map(({ label, href, color }) => (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${color}`}
            >
              {label}
              <ArrowRight size={12} />
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
