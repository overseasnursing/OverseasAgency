'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin, isSuperAdmin } from '@/lib/require-admin'
import { revalidatePath } from 'next/cache'

async function assertSuperAdmin() {
  const admin = await requireAdmin()
  if (!isSuperAdmin(admin)) throw new Error('Not authorized')
}

export async function banUser(userId: string) {
  await assertSuperAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  await Promise.all([
    db.auth.admin.updateUserById(userId, { ban_duration: '876600h' }),
    db.from('users').update({ is_banned: true, updated_at: new Date().toISOString() }).eq('id', userId),
  ])
  revalidatePath('/admin/users')
}

export async function unbanUser(userId: string) {
  await assertSuperAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  await Promise.all([
    db.auth.admin.updateUserById(userId, { ban_duration: 'none' }),
    db.from('users').update({ is_banned: false, updated_at: new Date().toISOString() }).eq('id', userId),
  ])
  revalidatePath('/admin/users')
}
