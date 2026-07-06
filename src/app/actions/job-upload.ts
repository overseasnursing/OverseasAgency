'use server'

import { requirePermission } from '@/lib/require-admin'
import { uploadToR2 } from '@/lib/r2'
import { matchesFileSignature } from '@/lib/validateFileSignature'

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
}
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export async function uploadJobLogo(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await requirePermission('jobs')

  const file = formData.get('file') as File | null

  if (!file || file.size === 0) return { error: 'No file provided' }
  if (file.size > MAX_BYTES)    return { error: 'File must be under 5 MB' }

  const ext = ALLOWED_MIME[file.type]
  if (!ext) return { error: 'Only JPEG, PNG or WebP images are allowed' }

  const path   = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  if (!matchesFileSignature(buffer, file.type)) {
    return { error: 'File content does not match its declared type.' }
  }

  try {
    const url = await uploadToR2('job-assets', path, buffer, file.type)
    return { url }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Upload failed' }
  }
}
