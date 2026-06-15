import { NextRequest, NextResponse } from 'next/server'
import { expireOverdueJobs } from '@/lib/db/jobs'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
