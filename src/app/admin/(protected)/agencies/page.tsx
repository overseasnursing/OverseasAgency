import React from 'react'
import Image from 'next/image'
import { createAdminClient } from '@/lib/supabase/admin'
import { requirePermission } from '@/lib/require-admin'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { Plus, Pencil, Globe, Star, Shield, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

const TRUST_BADGE: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  verified:       { label: 'Verified',       cls: 'bg-[#DCFCE7] text-[#166534]',   icon: <CheckCircle size={11} /> },
  trusted:        { label: 'Trusted',        cls: 'bg-[#DBEAFE] text-[#1D4ED8]',   icon: <Shield size={11} /> },
  unverified:     { label: 'Unverified',     cls: 'bg-slate-100 text-slate-500',    icon: <Globe size={11} /> },
  'scam-reported':{ label: 'Scam Reported',  cls: 'bg-[#FEE2E2] text-[#B91C1C]',   icon: <AlertTriangle size={11} /> },
}

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; trust?: string }>
}

export default async function AdminAgenciesPage({ searchParams }: PageProps) {
  await requirePermission('agencies')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { page: pageStr = '1', q = '', trust = '' } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  // Paginated query
  let query = db
    .from('agencies')
    .select('id, slug, name, city, state, trust_level, is_active, featured, rating, review_count, placement_count, logo_url, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (q) query = query.ilike('name', `%${q}%`)
  if (trust) query = query.eq('trust_level', trust)

  const { data: agencies, error, count: totalCount } = await query

  const totalPages = Math.ceil((totalCount ?? 0) / PAGE_SIZE)

  function buildHref(p: number) {
    const params = new URLSearchParams()
    params.set('page', String(p))
    if (q) params.set('q', q)
    if (trust) params.set('trust', trust)
    return `/admin/agencies?${params}`
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">Agencies</h1>
          <p className="text-[13px] text-slate-500">
            {totalCount ?? 0} agencies total
            {q && ` · searching "${q}"`}
            {trust && ` · ${trust}`}
          </p>
        </div>
        <a
          href="/admin/agencies/new"
          className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors"
        >
          <Plus size={14} />
          Add Agency
        </a>
      </div>

      {/* Search + filter bar */}
      <form method="get" action="/admin/agencies" className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            name="q"
            defaultValue={q}
            type="text"
            placeholder="Search agencies…"
            className="w-full h-9 pl-8 pr-3 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          />
        </div>
        <select
          name="trust"
          defaultValue={trust}
          className="h-9 pl-3 pr-8 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
        >
          <option value="">All Trust Levels</option>
          <option value="verified">Verified</option>
          <option value="trusted">Trusted</option>
          <option value="unverified">Unverified</option>
          <option value="scam-reported">Scam Reported</option>
        </select>
        <button type="submit" className="h-9 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-xl transition-colors">
          Search
        </button>
        {(q || trust) && (
          <a href="/admin/agencies" className="h-9 px-3 flex items-center text-[13px] text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl transition-colors">
            Clear
          </a>
        )}
      </form>

      {error && (
        <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[13px] text-[#B91C1C]">
          Error loading agencies: {error.message}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {!agencies?.length ? (
          <div className="text-center py-16">
            <Globe size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-slate-600 mb-1">No agencies found</p>
            <p className="text-[13px] text-slate-400 mb-4">
              {q || trust ? 'Try adjusting your search or filter.' : 'Add your first agency to get started.'}
            </p>
            {!q && !trust && (
              <a href="/admin/agencies/new" className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-white text-[13px] font-semibold rounded-xl">
                <Plus size={14} /> Add Agency
              </a>
            )}
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-slate-500">Agency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Trust</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Placements</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agencies.map((a: {
                id: string; slug: string; name: string; city: string; state: string
                trust_level: string; is_active: boolean; featured: boolean
                rating: number | null; review_count: number; placement_count: number
                logo_url: string | null
              }) => {
                const badge = TRUST_BADGE[a.trust_level] ?? TRUST_BADGE.unverified
                return (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary flex-shrink-0 overflow-hidden">
                          {a.logo_url ? (
                            <Image
                              src={a.logo_url}
                              alt={`${a.name} logo`}
                              width={32}
                              height={32}
                              sizes="32px"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            a.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{a.name}</p>
                          <p className="text-[11px] text-slate-400">{a.city}, {a.state} · /{a.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                        {badge.icon}{badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {a.rating ? (
                        <span className="flex items-center gap-1 text-slate-700">
                          <Star size={11} className="text-[#F59E0B] fill-[#F59E0B]" />
                          {a.rating.toFixed(1)}
                          <span className="text-slate-400">({a.review_count})</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{a.placement_count.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {a.is_active ? (
                          <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">Active</span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Inactive</span>
                        )}
                        {a.featured && (
                          <span className="text-[11px] font-semibold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <a
                        href={`/admin/agencies/${a.slug}`}
                        className="inline-flex items-center gap-1.5 h-7 px-3 border border-slate-200 hover:border-primary/40 hover:bg-primary/5 text-slate-600 hover:text-primary text-[12px] font-medium rounded-lg transition-colors"
                      >
                        <Pencil size={11} /> Edit
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalCount ?? 0}
        pageSize={PAGE_SIZE}
        buildHref={buildHref}
        itemLabel="agencies"
      />

      {!!agencies?.length && (
        <p className="text-[12px] text-slate-400 text-center">
          Public listing: <a href="/agencies" target="_blank" className="text-primary hover:underline">/agencies</a>
        </p>
      )}
    </div>
  )
}
