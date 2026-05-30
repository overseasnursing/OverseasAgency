import React from 'react'
import { MapPin, Phone, Mail, ExternalLink, Clock } from 'lucide-react'
import type { AgencyDetail } from '@/types/agencyDetail'
import { MailtoLink } from '@/components/ui/MailtoLink'

interface BranchesSectionProps {
  agency: AgencyDetail
}

export function BranchesSection({ agency }: BranchesSectionProps) {
  return (
    <section aria-labelledby="branches-heading">
      <h2 id="branches-heading" className="text-[22px] font-bold text-slate-800 mb-6">
        Office Locations
      </h2>

      <div className="flex flex-col gap-4">
        {agency.branches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[15px] font-semibold text-slate-800">{branch.name}</h3>
                  {branch.isHeadOffice && (
                    <span className="text-[11px] font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                      Head Office
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-1.5 text-[13.5px] text-slate-500">
                  <MapPin size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{branch.address}, {branch.city}, {branch.state}</span>
                </div>
                {branch.openingHours && (
                  <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500 mt-1">
                    <Clock size={12} className="text-slate-400 flex-shrink-0" />
                    <span>{branch.openingHours}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href={`tel:${branch.phone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-colors"
              >
                <Phone size={13} />
                {branch.phone}
              </a>

              <a
                href={`https://wa.me/${branch.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-[13px] font-medium text-[#166534] hover:bg-[#DCFCE7] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              <MailtoLink
                email={branch.email}
                className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-colors"
              >
                <Mail size={13} />
                {branch.email}
              </MailtoLink>

              {branch.googleMapsUrl && (
                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-colors"
                >
                  <ExternalLink size={13} />
                  View on Maps
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
