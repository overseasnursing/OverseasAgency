import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // Basic CSRF guard — only accept same-origin form submissions.
  const origin = request.headers.get('origin')
  if (origin && origin !== request.nextUrl.origin) {
    redirect('/')
  }

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
