'use client'

import React, { useState, useTransition, useMemo } from 'react'
import { Search, ShieldOff, ShieldCheck, Users, TrendingUp, UserX, Crown } from 'lucide-react'
import { banUser, unbanUser } from '@/app/actions/adminUserActions'

export interface UserRow {
  id:           string
  email:        string
  display_name: string | null
  role:         'registered_user' | 'agency' | 'admin'
  is_banned:    boolean
  created_at:   string
}

interface Props {
  users:      UserRow[]
  chartData:  { date: string; count: number }[]  // last 30 days
}

/* ── Wave chart ──────────────────────────────────────────────────────── */

function WaveChart({ data }: { data: { date: string; count: number }[] }) {
  const W = 800, H = 120, PAD = 16

  const counts = data.map(d => d.count)
  const max    = Math.max(...counts, 1)

  // Map to SVG coords
  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - d.count / max) * (H - PAD * 2),
    count: d.count,
    date:  d.date,
  }))

  // Smooth path using Catmull-Rom → cubic bezier
  function smoothPath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[Math.min(i + 2, points.length - 1)]
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return d
  }

  const linePath = smoothPath(pts)
  const areaPath = linePath
    + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`

  const [hover, setHover] = useState<{ x: number; y: number; count: number; date: string } | null>(null)
  const total = counts.reduce((a, b) => a + b, 0)

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-[120px]"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill="url(#waveGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Invisible hit areas for hover */}
        {pts.map((pt, i) => (
          <rect
            key={i}
            x={i === 0 ? 0 : (pts[i - 1].x + pt.x) / 2}
            y={0}
            width={i === 0
              ? (pts[1].x + pt.x) / 2
              : i === pts.length - 1
                ? W - (pts[i - 1].x + pt.x) / 2
                : ((pts[i + 1]?.x ?? pt.x) - (pts[i - 1]?.x ?? pt.x)) / 2}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(pt)}
          />
        ))}

        {/* Hover dot + vertical line */}
        {hover && (
          <>
            <line x1={hover.x} y1={PAD} x2={hover.x} y2={H - PAD} stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <circle cx={hover.x} cy={hover.y} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {hover && (
        <div
          className="absolute -top-10 bg-slate-800 text-white text-[11.5px] px-2.5 py-1.5 rounded-lg shadow pointer-events-none whitespace-nowrap"
          style={{ left: `${(hover.x / W) * 100}%`, transform: 'translateX(-50%)' }}
        >
          <span className="font-semibold">{hover.count}</span> signup{hover.count !== 1 ? 's' : ''} · {hover.date}
        </div>
      )}

      {/* X axis labels — first, mid, last */}
      <div className="flex justify-between mt-1 px-[16px] text-[10.5px] text-slate-400">
        <span>{data[0]?.date}</span>
        <span className="font-semibold text-slate-600">{total} signups in 30 days</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}

/* ── Role config ─────────────────────────────────────────────────────── */

const ROLE_CONFIG = {
  admin:           { label: 'Admin',        cls: 'bg-[#FEF3C7] text-[#92400E]', icon: <Crown size={10} />    },
  agency:          { label: 'Agency Admin', cls: 'bg-[#DBEAFE] text-[#1D4ED8]', icon: <Users size={10} />    },
  registered_user: { label: 'User',         cls: 'bg-slate-100 text-slate-600',  icon: <Users size={10} />    },
}

/* ── Row action button ───────────────────────────────────────────────── */

function BanButton({ user }: { user: UserRow }) {
  const [pending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      if (user.is_banned) await unbanUser(user.id)
      else                await banUser(user.id)
    })
  }

  if (user.is_banned) {
    return (
      <button
        onClick={toggle}
        disabled={pending}
        className="inline-flex items-center gap-1.5 h-7 px-3 text-[11.5px] font-semibold bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0] rounded-lg transition-colors disabled:opacity-50"
      >
        <ShieldCheck size={12} />
        {pending ? 'Restoring…' : 'Restore'}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className="inline-flex items-center gap-1.5 h-7 px-3 text-[11.5px] font-semibold bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#FECACA] rounded-lg transition-colors disabled:opacity-50"
    >
      <ShieldOff size={12} />
      {pending ? 'Restricting…' : 'Restrict'}
    </button>
  )
}

/* ── Main component ──────────────────────────────────────────────────── */

export function UsersClient({ users, chartData }: Props) {
  const [query, setQuery]   = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'registered_user' | 'agency' | 'admin'>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter(u => {
      const matchQ    = !q || u.email.toLowerCase().includes(q) || (u.display_name ?? '').toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      return matchQ && matchRole
    })
  }, [users, query, roleFilter])

  const totals = useMemo(() => ({
    total:      users.length,
    admins:     users.filter(u => u.role === 'admin').length,
    agencies:   users.filter(u => u.role === 'agency').length,
    general:    users.filter(u => u.role === 'registered_user').length,
    restricted: users.filter(u => u.is_banned).length,
  }), [users])

  return (
    <div className="flex flex-col gap-6">

      {/* Page header */}
      <div>
        <h1 className="text-[22px] font-bold text-slate-800">All Users</h1>
        <p className="text-[13.5px] text-slate-500 mt-0.5">Manage user access and view signup activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Users',  value: totals.total,      icon: Users,      cls: 'text-primary' },
          { label: 'Admins',       value: totals.admins,     icon: Crown,      cls: 'text-[#92400E]' },
          { label: 'Agency Admins',value: totals.agencies,   icon: TrendingUp, cls: 'text-[#1D4ED8]' },
          { label: 'General Users',value: totals.general,    icon: Users,      cls: 'text-slate-600' },
          { label: 'Restricted',   value: totals.restricted, icon: UserX,      cls: 'text-[#B91C1C]' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <Icon size={15} className={cls} />
            <p className="text-[22px] font-bold text-slate-800 mt-1 leading-none">{value}</p>
            <p className="text-[11.5px] text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Wave chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[14px] font-semibold text-slate-800">Daily Signups</p>
            <p className="text-[12px] text-slate-400 mt-0.5">Last 30 days</p>
          </div>
          <TrendingUp size={16} className="text-primary" />
        </div>
        <WaveChart data={chartData} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name or email…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'registered_user', 'agency', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={[
                'h-9 px-3 rounded-lg text-[12.5px] font-medium transition-colors',
                roleFilter === r
                  ? 'bg-primary text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
              ].join(' ')}
            >
              {r === 'all' ? 'All' : r === 'registered_user' ? 'Users' : r === 'agency' ? 'Agency' : 'Admin'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">User</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Role</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-slate-400">
                  No users match your search.
                </td>
              </tr>
            )}
            {filtered.map(user => {
              const role = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.registered_user
              const initials = (user.display_name ?? user.email).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              const joined   = new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

              return (
                <tr key={user.id} className={user.is_banned ? 'bg-[#FEF2F2]' : 'hover:bg-slate-50'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${user.is_banned ? 'bg-[#FEE2E2] text-[#B91C1C]' : 'bg-primary/10 text-primary'}`}>
                        {initials}
                      </div>
                      <p className="text-[13px] font-medium text-slate-800 truncate max-w-[120px]">
                        {user.display_name ?? '—'}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-slate-600 truncate max-w-[200px]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${role.cls}`}>
                      {role.icon}
                      {role.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12.5px] text-slate-400 whitespace-nowrap">{joined}</td>
                  <td className="px-4 py-3">
                    {user.is_banned ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-[#FEE2E2] text-[#B91C1C] rounded-full">
                        <ShieldOff size={10} /> Restricted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-[#DCFCE7] text-[#166534] rounded-full">
                        <ShieldCheck size={10} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <BanButton user={user} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-slate-100 text-[12px] text-slate-400">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  )
}
