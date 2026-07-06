import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { expireOverdueJobs } from '@/lib/db/jobs'

export const dynamic = 'force-dynamic'

function isValidCronSecret(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || !authHeader) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const actual   = Buffer.from(authHeader)
  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}

export async function GET(req: NextRequest) {
  if (!isValidCronSecret(req.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const count = await expireOverdueJobs()
    console.log(`[cron] expire-jobs: marked ${count} job(s) as expired`)
    return NextResponse.json({ ok: true, expired: count })
  } catch (err) {
    console.error('[cron] expire-jobs failed:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
