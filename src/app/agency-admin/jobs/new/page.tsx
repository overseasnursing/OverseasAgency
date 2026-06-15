import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AgencyJobForm } from '../_components/AgencyJobForm'

export default async function NewAgencyJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/agency-admin/jobs/new')

  const role     = user.user_metadata?.role as string | undefined
  const agencyId = user.user_metadata?.agency_id as string | undefined
  if (role !== 'agency_admin' || !agencyId) redirect('/?error=unauthorized')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[12px] text-slate-400 mb-1">
          <a href="/agency-admin/jobs" className="hover:text-slate-600 transition-colors">My Jobs</a>
          {' / New'}
        </p>
        <h1 className="text-[22px] font-bold text-slate-900">Post a Job</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Your job will be reviewed by our team before going live.
        </p>
      </div>
      <AgencyJobForm initialData={null} />
    </div>
  )
}
