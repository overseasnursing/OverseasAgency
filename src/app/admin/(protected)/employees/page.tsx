import React from 'react'
import { redirect } from 'next/navigation'
import { getAdminUser, isSuperAdmin } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { EmployeesClient } from './_components/EmployeesClient'

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
  const admin = await getAdminUser()
  if (!admin || !isSuperAdmin(admin)) redirect('/admin')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Fetch all admin users except the current super admin
  const { data: rows } = await db
    .from('users')
    .select('id, email, admin_name, admin_permissions, created_at')
    .eq('role', 'admin')
    .neq('id', admin.userId)
    .order('created_at', { ascending: false })

  // Fetch ban status from auth for each employee
  type Employee = {
    id: string
    email: string
    name: string | null
    permissions: string[]
    is_active: boolean
    created_at: string
  }

  const employees: Employee[] = []
  for (const row of rows ?? []) {
    const { data: authUser } = await db.auth.admin.getUserById(row.id)
    const banned = authUser?.user?.banned_until
      ? new Date(authUser.user.banned_until) > new Date()
      : false
    employees.push({
      id:          row.id,
      email:       row.email,
      name:        row.admin_name ?? null,
      permissions: Array.isArray(row.admin_permissions) ? row.admin_permissions : [],
      is_active:   !banned,
      created_at:  row.created_at,
    })
  }

  return <EmployeesClient employees={employees} />
}
