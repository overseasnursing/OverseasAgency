import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

async function fetchAdminUser(): Promise<{ userId: string; email: string } | null> {
  try {
    const supabase = await buildClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (data?.role !== 'admin') return null
    return { userId: user.id, email: user.email! }
  } catch {
    return null
  }
}

/** Use in layouts/pages — returns null instead of redirecting */
export async function getAdminUser() {
  return fetchAdminUser()
}

/** Use in server actions — throws Unauthorized if not admin */
export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const admin = await fetchAdminUser()
  if (!admin) {
    redirect('/auth/login?next=/admin')
  }
  return admin
}
