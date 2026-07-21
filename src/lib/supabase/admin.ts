import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Service role client — bypasses RLS. Only use in server-side admin code.
// Has no per-request state (no cookies, no user session), so a single
// instance is reused across all requests/invocations instead of
// reconstructing one on every one of the 200+ call sites across the app.
let adminClient: SupabaseClient<Database> | undefined

export function createAdminClient() {
  if (!adminClient) {
    adminClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL  || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )
  }
  return adminClient
}
