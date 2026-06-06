import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type AdminPermission =
  | 'agencies'
  | 'reviews'
  | 'scam-reports'
  | 'mock-tests'
  | 'settings'

export type AdminUser = {
  userId:      string
  email:       string
  name:        string | null
  // null = super admin (full access). array = employee restricted to listed keys.
  permissions: AdminPermission[] | null
}

async function buildClient() {
  const jar = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) => jar.set(name, value, options)),
      },
    },
  )
}

async function fetchAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await buildClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Select all columns so admin auth works across local/remote schema versions.
    // Older local DBs only have display_name; newer schemas add admin_name/admin_permissions.
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data?.role !== 'admin') return null

    const name = data.admin_name ?? data.display_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
    const permissions = Array.isArray(data.admin_permissions) ? data.admin_permissions : null

    return {
      userId:      user.id,
      email:       user.email!,
      name,
      permissions,
    }
  } catch {
    return null
  }
}

/** True if this admin has full access (super admin — permissions is null) */
export function isSuperAdmin(admin: AdminUser): boolean {
  return admin.permissions === null
}

/** True if user can access the given page */
export function hasPermission(admin: AdminUser, key: AdminPermission): boolean {
  if (isSuperAdmin(admin)) return true
  return admin.permissions!.includes(key)
}

/** Use in layouts/pages — returns null instead of redirecting */
export async function getAdminUser(): Promise<AdminUser | null> {
  return fetchAdminUser()
}

/** Use in server actions — redirects if not logged in as admin */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await fetchAdminUser()
  if (!admin) redirect('/auth/login?next=/admin')
  return admin
}

/**
 * Use at the top of each protected admin page.
 * Super admins always pass. Employees must have the key in their permissions.
 * Redirects to /admin dashboard if access is denied.
 */
export async function requirePermission(key: AdminPermission): Promise<AdminUser> {
  const admin = await requireAdmin()
  if (!hasPermission(admin, key)) redirect('/admin')
  return admin
}
