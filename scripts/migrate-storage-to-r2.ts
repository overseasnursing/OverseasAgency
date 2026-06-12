/**
 * One-time migration: Supabase Storage → Cloudflare R2
 *
 * Run:  npx tsx scripts/migrate-storage-to-r2.ts
 *
 * Requirements: all R2 env vars must be set in .env.local
 * (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *  R2_AGENCY_ASSETS_URL, R2_MOCK_TEST_ASSETS_URL, R2_BLOG_ASSETS_URL)
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

/* ── Config ──────────────────────────────────────────────────────────── */

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

const BUCKETS: Array<{
  name:      string
  publicUrl: string  // R2 public URL env var value
}> = [
  { name: 'agency-assets',    publicUrl: process.env.R2_AGENCY_ASSETS_URL    ?? '' },
  { name: 'mock-test-assets', publicUrl: process.env.R2_MOCK_TEST_ASSETS_URL ?? '' },
  { name: 'blog-assets',      publicUrl: process.env.R2_BLOG_ASSETS_URL      ?? '' },
]

// DB columns that may contain Supabase storage URLs — update these after upload
const URL_COLUMNS: Array<{ table: string; column: string }> = [
  { table: 'agencies',              column: 'logo_url' },
  { table: 'agencies',              column: 'featured_image_url' },
  { table: 'mock_test_questions',   column: 'image_url' },
  { table: 'mock_test_questions',   column: 'explanation_image_url' },
  { table: 'guide_contents',        column: 'author_profile_photo' },
  { table: 'guide_contents',        column: 'reviewer_profile_photo' },
  { table: 'blog_posts',            column: 'cover_image_url' },
]

/* ── Clients ─────────────────────────────────────────────────────────── */

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const r2 = new S3Client({
  region:   'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

/* ── Helpers ─────────────────────────────────────────────────────────── */

function getSupabaseOrigin(): string {
  return new URL(SUPABASE_URL).origin
}

async function listAllFiles(bucket: string): Promise<string[]> {
  const paths: string[] = []

  async function listFolder(prefix: string) {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 })
    if (error) { console.error(`  List error in ${bucket}/${prefix}:`, error.message); return }
    if (!data) return

    for (const item of data) {
      if (item.id === null) {
        // it's a folder
        await listFolder(prefix ? `${prefix}/${item.name}` : item.name)
      } else {
        paths.push(prefix ? `${prefix}/${item.name}` : item.name)
      }
    }
  }

  await listFolder('')
  return paths
}

function guessContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', webp: 'image/webp',
    gif: 'image/gif', svg: 'image/svg+xml',
    pdf: 'application/pdf',
  }
  return map[ext ?? ''] ?? 'application/octet-stream'
}

/* ── Main migration ──────────────────────────────────────────────────── */

async function migrateBucket(bucket: string, r2PublicUrl: string) {
  if (!r2PublicUrl) {
    console.warn(`  ⚠  Skipping ${bucket} — R2 public URL not set`)
    return { supabaseBase: '', r2Base: '' }
  }

  console.log(`\n📦 Migrating bucket: ${bucket}`)
  const files = await listAllFiles(bucket)
  console.log(`  Found ${files.length} file(s)`)

  const supabaseBase = `${getSupabaseOrigin()}/storage/v1/object/public/${bucket}`

  let ok = 0, fail = 0
  for (const path of files) {
    try {
      // Download from Supabase
      const { data, error } = await supabase.storage.from(bucket).download(path)
      if (error || !data) throw new Error(error?.message ?? 'Download returned no data')

      const buffer      = Buffer.from(await data.arrayBuffer())
      const contentType = guessContentType(path)

      // Upload to R2
      await r2.send(new PutObjectCommand({
        Bucket:      bucket,
        Key:         path,
        Body:        buffer,
        ContentType: contentType,
      }))

      ok++
      process.stdout.write(`  ✓ ${path}\n`)
    } catch (err) {
      fail++
      console.error(`  ✗ ${path} —`, err instanceof Error ? err.message : err)
    }
  }

  console.log(`  Done: ${ok} uploaded, ${fail} failed`)
  return { supabaseBase, r2Base: r2PublicUrl }
}

async function updateDbUrls(
  supabaseBase: string,
  r2Base:       string,
  bucket:       string,
) {
  if (!supabaseBase || !r2Base) return

  const relevantColumns = URL_COLUMNS.filter(() => true) // update all columns

  for (const { table, column } of relevantColumns) {
    try {
      // Fetch rows where the column contains the old Supabase URL for this bucket
      const { data: rows, error: fetchErr } = await supabase
        .from(table)
        .select(`id, ${column}`)
        .like(column, `${supabaseBase}%`)

      if (fetchErr || !rows?.length) continue

      console.log(`  Updating ${rows.length} row(s) in ${table}.${column}`)

      for (const row of rows) {
        const oldUrl = row[column] as string
        const newUrl = oldUrl.replace(supabaseBase, r2Base)

        const { error: updateErr } = await supabase
          .from(table)
          .update({ [column]: newUrl })
          .eq('id', row.id)

        if (updateErr) {
          console.error(`    ✗ row ${row.id}:`, updateErr.message)
        }
      }
    } catch {
      // Table may not exist in all schema versions — skip silently
    }
  }
}

async function run() {
  console.log('🚀 Starting Supabase → R2 storage migration\n')

  // Validate required env vars
  const missing = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
    .filter(k => !process.env[k])
  if (missing.length) {
    console.error('❌ Missing env vars:', missing.join(', '))
    process.exit(1)
  }

  for (const { name, publicUrl } of BUCKETS) {
    const { supabaseBase, r2Base } = await migrateBucket(name, publicUrl)
    if (supabaseBase && r2Base) {
      console.log(`\n🔗 Updating DB URLs for ${name}…`)
      await updateDbUrls(supabaseBase, r2Base, name)
    }
  }

  console.log('\n✅ Migration complete!')
  console.log('   You can now remove Supabase Storage buckets once you verify everything works.')
}

run().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
