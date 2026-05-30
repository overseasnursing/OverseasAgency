import type { Metadata } from 'next'
import { Shield, Star, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'
import { MailtoLink } from '@/components/ui/MailtoLink'

export const metadata: Metadata = {
  title: 'For Agencies — List Your Agency on OverseasNursing',
  description: 'Get your nursing migration agency listed on OverseasNursing.com. Reach thousands of Indian nurses actively searching for overseas placement agencies.',
  alternates: { canonical: '/for-agencies' },
}

export default function ForAgenciesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 py-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 text-primary rounded-full text-[12px] font-semibold uppercase tracking-wide mb-6">
            <Shield size={11} />
            For Nursing Agencies
          </div>
          <h1 className="text-[36px] sm:text-[44px] font-bold text-slate-900 leading-tight mb-4">
            Get Listed on India&apos;s Nursing<br className="hidden sm:block" /> Migration Platform
          </h1>
          <p className="text-[17px] text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
            Thousands of Indian nurses visit OverseasNursing.com every month researching agencies.
            Build trust, showcase your track record, and get discovered.
          </p>
          <MailtoLink
            email="hello@overseasnursing.com"
            subject="Agency Listing Enquiry"
            className="inline-flex items-center gap-2 h-12 px-7 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl transition-colors"
          >
            Get in touch <ArrowRight size={15} />
          </MailtoLink>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-16">

        {/* Why list */}
        <h2 className="text-[24px] font-bold text-slate-900 mb-2 text-center">Why List Your Agency?</h2>
        <p className="text-[15px] text-slate-500 text-center mb-10">Nurses trust verified, transparent agencies. We help you prove it.</p>

        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {[
            {
              icon: TrendingUp,
              title: 'Reach Active Nurses',
              desc: 'Nurses searching for Germany, UK, Canada, and UAE placements find agencies through our platform every day.',
              bg: 'bg-[#EFF6FF]',
              iconColor: 'text-primary',
            },
            {
              icon: Star,
              title: 'Build Verified Trust',
              desc: 'Verified listings with real reviews, MEA license details, and transparency scores stand out from unverified agencies.',
              bg: 'bg-[#DCFCE7]',
              iconColor: 'text-[#166534]',
            },
            {
              icon: Shield,
              title: 'SEO-Powered Visibility',
              desc: 'Your agency page is indexed and optimised for search. Nurses searching for your agency by name will find your listing first.',
              bg: 'bg-[#FEF3C7]',
              iconColor: 'text-[#92400E]',
            },
          ].map(({ icon: Icon, title, desc, bg, iconColor }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={22} className={iconColor} />
              </div>
              <h3 className="text-[15px] font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-[13.5px] text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* What's included */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-10">
          <h2 className="text-[20px] font-bold text-slate-800 mb-6">What&apos;s Included in a Listing</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Agency profile with logo and description',
              'Countries and exams supported',
              'Verified MEA license display',
              'Pricing transparency section',
              'Nurse review collection',
              'Transparency score badge',
              'Branch office listings',
              'Social media links',
              'FAQ section',
              'SEO-optimised agency page',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle size={15} className="text-[#22C55E] flex-shrink-0" />
                <span className="text-[13.5px] text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-center text-white">
          <h2 className="text-[22px] font-bold mb-2">Ready to Get Listed?</h2>
          <p className="text-[14px] text-primary-100 mb-6 opacity-80">
            Email us with your agency name and MEA license number to get started.
          </p>
          <MailtoLink
            email="hello@overseasnursing.com"
            subject="Agency Listing Enquiry"
            className="inline-flex items-center gap-2 h-11 px-6 bg-white text-primary text-[14px] font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Email us to get listed <ArrowRight size={14} />
          </MailtoLink>
        </div>

      </div>
    </div>
  )
}
