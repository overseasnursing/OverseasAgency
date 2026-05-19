/**
 * Run before deploying: npx tsx scripts/check-env.ts
 * Exits with code 1 if any required production env var is missing.
 */

const REQUIRED: { key: string; description: string }[] = [
  { key: 'NEXT_PUBLIC_SUPABASE_URL',    description: 'Supabase REST API URL (https://xxx.supabase.co)' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', description: 'Supabase anon JWT key' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY',   description: 'Supabase service role JWT key (server-only)' },
  { key: 'NEXT_PUBLIC_SITE_URL',        description: 'Public site URL (https://overseasnursing.com)' },
]

const OPTIONAL: { key: string; description: string }[] = [
  { key: 'NEXT_PUBLIC_GA_ID',       description: 'Google Analytics 4 measurement ID (G-XXXXXXXXXX)' },
  { key: 'NEXT_PUBLIC_CLARITY_ID',  description: 'Microsoft Clarity project ID' },
  { key: 'RESEND_API_KEY',          description: 'Resend email API key' },
  { key: 'R2_ACCOUNT_ID',           description: 'Cloudflare R2 account ID' },
  { key: 'R2_ACCESS_KEY_ID',        description: 'Cloudflare R2 access key' },
  { key: 'R2_SECRET_ACCESS_KEY',    description: 'Cloudflare R2 secret key' },
  { key: 'R2_BUCKET_NAME',          description: 'Cloudflare R2 bucket name' },
]

const PLACEHOLDER = 'https://your-project-id.supabase.co'

let hasErrors = false

console.log('\n── Required environment variables ──────────────────────────')
for (const { key, description } of REQUIRED) {
  const val = process.env[key]
  if (!val || val === PLACEHOLDER) {
    console.error(`  ✗  MISSING  ${key}`)
    console.error(`             ${description}`)
    hasErrors = true
  } else {
    console.log(`  ✓  ${key}`)
  }
}

console.log('\n── Optional environment variables ──────────────────────────')
for (const { key, description } of OPTIONAL) {
  const val = process.env[key]
  if (!val) {
    console.warn(`  ○  NOT SET  ${key}`)
    console.warn(`             ${description}`)
  } else {
    console.log(`  ✓  ${key}`)
  }
}

if (hasErrors) {
  console.error('\n✗  One or more required variables are missing. Fix before deploying.\n')
  process.exit(1)
} else {
  console.log('\n✓  All required variables are set.\n')
}
