'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin, isSuperAdmin, type AdminPermission } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'

export type EmployeeInput = {
  name:        string
  email:       string
  password:    string
  permissions: AdminPermission[]
}

export type EmployeeUpdateInput = {
  id:          string
  name:        string
  permissions: AdminPermission[]
  is_active:   boolean
}

/* ── helpers ── */

function guard(condition: boolean, msg = 'Forbidden'): void {
  if (!condition) throw new Error(msg)
}

/* ── Create employee ── */

export async function createEmployee(
  input: EmployeeInput,
): Promise<{ error: string | null }> {
  const admin = await requireAdmin()
  guard(isSuperAdmin(admin), 'Only super admins can add employees.')

  if (!input.email?.trim())    return { error: 'Email is required.' }
  if (!input.password?.trim()) return { error: 'Password is required.' }
  if (input.password.length < 8) return { error: 'Password must be at least 8 characters.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  // Create Supabase Auth user using service-role client
  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email:          input.email.trim().toLowerCase(),
    password:       input.password,
    email_confirm:  true,
  })
  if (authError) return { error: authError.message }

  const userId = authData.user.id

  // Upsert into users table — Supabase triggers may auto-insert a row on auth user creation,
  // so we upsert to handle both the "row exists" and "row doesn't exist" cases.
  const { error: dbError } = await db.from('users').upsert(
    {
      id:                userId,
      email:             input.email.trim().toLowerCase(),
      role:              'admin',
      admin_name:        input.name.trim() || null,
      admin_permissions: input.permissions,
    },
    { onConflict: 'id' },
  )

  if (dbError) {
    // Rollback: delete the auth user we just created
    await db.auth.admin.deleteUser(userId)
    return { error: dbError.message }
  }

  revalidatePath('/admin/employees')
  return { error: null }
}

/* ── Update employee (name, permissions, active status) ── */

export async function updateEmployee(
  input: EmployeeUpdateInput,
): Promise<{ error: string | null }> {
  const admin = await requireAdmin()
  guard(isSuperAdmin(admin), 'Only super admins can edit employees.')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { error } = await db
    .from('users')
    .update({
      admin_name:        input.name.trim() || null,
      admin_permissions: input.permissions,
    })
    .eq('id', input.id)
    .eq('role', 'admin')

  if (error) return { error: error.message }

  // Activate / deactivate the Supabase Auth account
  const { error: authError } = await db.auth.admin.updateUserById(input.id, {
    ban_duration: input.is_active ? 'none' : '876600h', // ~100 years = effectively disabled
  })
  if (authError) return { error: authError.message }

  revalidatePath('/admin/employees')
  return { error: null }
}

/* ── Delete employee permanently ── */

export async function deleteEmployee(
  userId: string,
): Promise<{ error: string | null }> {
  const admin = await requireAdmin()
  guard(isSuperAdmin(admin), 'Only super admins can delete employees.')
  guard(userId !== admin.userId, 'You cannot delete your own account.')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const { error: authError } = await db.auth.admin.deleteUser(userId)
  if (authError) return { error: authError.message }

  // Row in users table will cascade-delete if FK is set, otherwise delete manually
  await db.from('users').delete().eq('id', userId)

  revalidatePath('/admin/employees')
  return { error: null }
}
