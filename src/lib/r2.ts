import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// R2 is S3-compatible. Endpoint format: https://<accountId>.r2.cloudflarestorage.com
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

// Each bucket has its own public URL in Cloudflare (set these in your .env)
const BUCKET_PUBLIC_URLS: Record<string, string> = {
  'agency-assets':    process.env.R2_AGENCY_ASSETS_URL    ?? '',
  'mock-test-assets': process.env.R2_MOCK_TEST_ASSETS_URL ?? '',
  'blog-assets':      process.env.R2_BLOG_ASSETS_URL      ?? '',
}

/**
 * Upload a buffer to an R2 bucket and return the public URL.
 * Throws if the bucket public URL env var is not set.
 */
export async function uploadToR2(
  bucket:      string,
  path:        string,
  buffer:      Buffer,
  contentType: string,
): Promise<string> {
  const base = BUCKET_PUBLIC_URLS[bucket]
  if (!base) throw new Error(`R2_${bucket.toUpperCase().replace(/-/g, '_')}_URL env var not set`)

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket:      bucket,
        Key:         path,
        Body:        buffer,
        ContentType: contentType,
      }),
    )
  } catch (err) {
    console.error(`[R2 upload] bucket=${bucket} path=${path}`, err)
    throw err
  }

  // Strip trailing slash from base URL to avoid double slashes
  return `${base.replace(/\/$/, '')}/${path}`
}
