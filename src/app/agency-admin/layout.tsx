import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Briefcase, ClipboardList, LayoutDashboard, Settings, LogOut } from 'lucide-react'

export default async function AgencyAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/agency-admin')

  const role     = user.user_metadata?.role as string | undefined
  const agencyId = user.user_metadata?.agency_id as string | undefined

  if (role !== 'agency_admin' || !agencyId) {
    redirect('/?error=unauthorized')
  }

  const displayName = (
    (user.user_metadata?.display_name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Agency Admin'
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[15px] font-bold text-primary">OverseasNursing</Link>
            <span className="text-slate-200 select-none">/</span>
            <span className="text-[13px] font-semibold text-slate-600">Agency Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-slate-500 hidden sm:block">{displayName}</span>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-700 transition-colors"
              >
                <LogOut size={14} /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 py-6 gap-6">
        {/* Sidebar */}
        <aside className="w-44 flex-shrink-0 hidden sm:block">
          <nav className="flex flex-col gap-1 sticky top-20">
            {[
              { href: '/agency-admin',              icon: LayoutDashboard, label: 'Dashboard' },
              { href: '/agency-admin/edit',         icon: Settings,        label: 'Edit Listing' },
              { href: '/agency-admin/jobs',         icon: Briefcase,       label: 'My Jobs' },
              { href: '/agency-admin/applications', icon: ClipboardList,   label: 'Applications' },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="sm:hidden w-full mb-2">
          <div className="flex gap-2">
            <Link href="/agency-admin"      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:border-primary hover:text-primary transition-colors">
              <LayoutDashboard size={14} /> Dashboard
            </Link>
            <Link href="/agency-admin/edit" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:border-primary hover:text-primary transition-colors">
              <Settings size={14} /> Edit Listing
            </Link>
            <Link href="/agency-admin/jobs" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:border-primary hover:text-primary transition-colors">
              <Briefcase size={14} /> My Jobs
            </Link>
            <Link href="/agency-admin/applications" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:border-primary hover:text-primary transition-colors">
              <ClipboardList size={14} /> Applications
            </Link>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
