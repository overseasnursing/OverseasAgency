import type { Metadata } from 'next'
import { Mail, MessageSquare, Shield } from 'lucide-react'
import { MailtoLink } from '@/components/ui/MailtoLink'

export const metadata: Metadata = {
  title: 'Contact Us — OverseasNursing',
  description: 'Get in touch with the OverseasNursing team — report scams, submit corrections, or ask questions.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-5 py-16">

        <div className="text-center mb-12">
          <h1 className="text-[32px] font-bold text-slate-900 mb-3">Contact Us</h1>
          <p className="text-[16px] text-slate-500 leading-relaxed">
            Have a question, correction, or need to report something? We read every message.
          </p>
        </div>

        <div className="grid gap-4 mb-10">
          {[
            {
              icon: Shield,
              title: 'Report a Scam or Fraudulent Agency',
              desc: 'If you have been scammed or want to warn others about an agency, please use our dedicated scam report form.',
              link: '/scam-reports/submit',
              label: 'Submit a scam report',
              bg: 'bg-[#FEF2F2]',
              iconColor: 'text-[#DC2626]',
              iconBg: 'bg-[#FEE2E2]',
            },
            {
              icon: MessageSquare,
              title: 'Submit a Review',
              desc: 'Share your experience with an overseas nursing agency to help other nurses make informed decisions.',
              link: '/reviews/submit',
              label: 'Write a review',
              bg: 'bg-[#F0FDF4]',
              iconColor: 'text-[#166534]',
              iconBg: 'bg-[#DCFCE7]',
            },
            {
              icon: Mail,
              title: 'General Enquiries',
              desc: 'For corrections, partnership enquiries, data removal requests, or anything else — email us directly.',
              link: null,
              email: 'hello@overseasnursing.com',
              label: 'hello@overseasnursing.com',
              bg: 'bg-[#EFF6FF]',
              iconColor: 'text-primary',
              iconBg: 'bg-[#DBEAFE]',
            },
          ].map(({ icon: Icon, title, desc, link, email, label, bg, iconColor, iconBg }) => (
            <div key={title} className={`${bg} rounded-2xl border border-slate-100 p-6 flex gap-4`}>
              <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-bold text-slate-800 mb-1">{title}</h2>
                <p className="text-[13.5px] text-slate-500 leading-relaxed mb-3">{desc}</p>
                {email ? (
                  <MailtoLink email={email} reveal>
                    {label} →
                  </MailtoLink>
                ) : (
                  <a href={link!} className="inline-flex items-center text-[13px] font-semibold text-primary hover:underline">
                    {label} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <p className="text-[13.5px] text-slate-500 leading-relaxed">
            We are a small independent team. Response times may be 2–5 business days.
            For urgent scam reports, please use the{' '}
            <a href="/scam-reports/submit" className="text-primary font-semibold hover:underline">
              scam report form
            </a>{' '}
            which is reviewed within 24–72 hours.
          </p>
        </div>

      </div>
    </div>
  )
}
