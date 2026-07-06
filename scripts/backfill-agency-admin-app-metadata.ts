/**
 * One-time backfill: copies role/agency_id from user_metadata (self-editable
 * by the account owner via the Supabase Auth API) into app_metadata
 * (service-role-only writes) for existing agency-admin accounts.
 *
 * Needed because the app used to write/read role & agency_id from
 * user_metadata, which let any authenticated user grant themselves control
 * of an arbitrary agency by calling supabase.auth.updateUser() directly.
 * The app now reads only app_metadata for authorization — this script
 * migrates accounts created before that fix so they don't lose access.
 *
 * Run: npx tsx scripts/backfill-agency-admin-app-metadata.ts
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/database.js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required. Add it to .env.local or pass as env var.')
  process.exit(1)
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function backfill() {
  let page = 1
  let migrated = 0
  let skipped = 0

  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) {
      console.error('listUsers failed:', error.message)
      process.exit(1)
    }
    if (!data.users.length) break

    for (const user of data.users) {
      const legacyRole     = user.user_metadata?.role as string | undefined
      const legacyAgencyId = user.user_metadata?.agency_id as string | undefined

      if (legacyRole !== 'agency_admin' || !legacyAgencyId) continue

      if (user.app_metadata?.role === 'agency_admin' && user.app_metadata?.agency_id === legacyAgencyId) {
        skipped++
        continue
      }

      const { error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
        app_metadata: {
          ...user.app_metadata,
          role: 'agency_admin',
          agency_id: legacyAgencyId,
        },
      })

      if (updateErr) {
        console.error(`Failed to migrate ${user.email ?? user.id}:`, updateErr.message)
        continue
      }

      console.log(`Migrated ${user.email ?? user.id} -> agency ${legacyAgencyId}`)
      migrated++
    }

    page++
  }

  console.log(`Done. Migrated ${migrated} user(s), ${skipped} already up to date.`)
}

backfill()
