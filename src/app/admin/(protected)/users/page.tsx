import React from 'react'
import { redirect } from 'next/navigation'
import { getAdminUser, isSuperAdmin } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { UsersClient } from './_components/UsersClient'
import type { UserRow } from './_components/UsersClient'

export const dynamic = 'force-dynamic'

export default async function AllUsersPage() {
  const admin = await getAdminUser()
  if (!admin || !isSuperAdmin(admin)) redirect('/admin')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Fetch public users table (role, ban status, created_at)
  const { data: publicRows } = await db
    .from('users')
    .select('id, email, display_name, role, is_banned, created_at')
    .order('created_at', { ascending: false })

  const rows: UserRow[] = (publicRows ?? []).map((r: {
    id: string
    email: string
    display_name: string | null
    role: string
    is_banned: boolean | null
    created_at: string
  }) => ({
    id:           r.id,
    email:        r.email ?? '',
    display_name: r.display_name ?? null,
    role:         (r.role === 'admin' || r.role === 'agency') ? r.role : 'registered_user',
    is_banned:    r.is_banned ?? false,
    created_at:   r.created_at,
  }))

  // Build last-30-days daily signup chart data
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dayMap = new Map<string, number>()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    dayMap.set(key, 0)
  }

  for (const r of rows) {
    const d = new Date(r.created_at)
    d.setHours(0, 0, 0, 0)
    const diffDays = Math.round((today.getTime() - d.getTime()) / 86400000)
    if (diffDays >= 0 && diffDays < 30) {
      const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1)
    }
  }

  const chartData = Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }))

  return (
    <div className="w-full max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-8">
      <UsersClient users={rows} chartData={chartData} />
    </div>
  )
}
