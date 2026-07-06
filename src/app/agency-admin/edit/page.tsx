import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AgencyOwnerEditForm } from './_components/AgencyOwnerEditForm'

export const dynamic = 'force-dynamic'

export default async function AgencyOwnerEditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/agency-admin/edit')

  const agencyId = user.app_metadata?.agency_id as string | undefined
  if (!agencyId) redirect('/agency-admin')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any

  const [agencyRes, branchesRes, faqsRes] = await Promise.all([
    db.from('agencies').select('*').eq('id', agencyId).single(),
    db.from('branches').select('*').eq('agency_id', agencyId).order('is_head_office', { ascending: false }),
    db.from('agency_faqs').select('*').eq('agency_id', agencyId).order('sort_order'),
  ])

  if (!agencyRes.data) redirect('/agency-admin')

  return (
    <AgencyOwnerEditForm
      agency={agencyRes.data}
      branches={branchesRes.data ?? []}
      faqs={faqsRes.data ?? []}
    />
  )
}
