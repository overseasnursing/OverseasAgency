import React from 'react'
import { ExternalLink, MapPin } from 'lucide-react'
import type { AgencyDetail } from '@/types/agencyDetail'
import { LazyMap } from '@/components/ui/LazyMap'

interface LocationMapProps {
  agency: AgencyDetail
}

export function LocationMap({ agency }: LocationMapProps) {
  const hq = agency.branches.find((b) => b.isHeadOffice) ?? agency.branches[0]
  if (!hq) return null

  const addressQuery = [hq.address, hq.city, hq.state, hq.country]
    .filter(Boolean)
    .join(', ')

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  const mapsUrl  = hq.googleMapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`

  return (
    <section aria-labelledby="map-heading">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={16} className="text-slate-400" />
        <h2 id="map-heading" className="text-[18px] font-bold text-slate-800">
          Office Location
        </h2>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden">
          <LazyMap
            embedUrl={embedUrl}
            title={`Map of ${hq.name}`}
            address={addressQuery}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
          <p className="text-[12.5px] text-slate-500 truncate mr-3">
            {hq.address}, {hq.city}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-[12.5px] font-semibold rounded-xl hover:bg-primary-hover transition-colors flex-shrink-0"
          >
            <ExternalLink size={12} />
            View on Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
