import React from 'react'
import { requirePermission } from '@/lib/require-admin'
import { JobForm } from '../_components/JobForm'
import { getEnabledSourceCountries } from '@/lib/db/country-settings'

export default async function NewJobPage() {
  await requirePermission('jobs')
  const availableCountries = await getEnabledSourceCountries()

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-[12px] text-slate-400 mb-1">
          <a href="/admin/jobs" className="hover:text-slate-600 transition-colors">Jobs</a>
          {' / New'}
        </p>
        <h1 className="text-[22px] font-bold text-slate-900">New Job</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Job will be published immediately with status Approved.</p>
      </div>
      <JobForm initialData={null} availableCountries={availableCountries} />
    </div>
  )
}
