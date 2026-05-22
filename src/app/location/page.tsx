import React from 'react'
import type { Metadata } from 'next'
import { MapPin, Building2 } from 'lucide-react'
import { getLocationsByState } from '@/lib/data/getLocationData'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Overseas Nursing Agencies by Location | OverseasNursing.com',
  description:
    'Browse overseas nursing agencies across India by city and state. Find verified agencies in Kerala, Tamil Nadu, Maharashtra, and more.',
}

export default async function LocationIndexPage() {
  const groups = await getLocationsByState()

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-[13px] text-slate-400 mb-5">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <span className="text-slate-600 font-medium">Agencies by Location</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" />
            <p className="text-[13px] font-semibold text-primary uppercase tracking-wide">Browse by City</p>
          </div>
          <h1 className="text-[30px] sm:text-[36px] font-bold text-slate-900 leading-tight mb-3">
            Overseas Nursing Agencies by Location
          </h1>
          <p className="text-[15px] text-slate-500 leading-relaxed max-w-2xl">
            Find verified nursing migration agencies near you. Browse by city to compare fees, read nurse reviews, and check trust ratings.
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-5 sm:px-6 lg:px-8 py-10">
        {groups.length === 0 ? (
          <div className="text-center py-20">
            <Building2 size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-[15px] text-slate-400">No locations found. Add agencies to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {groups.map((group) => (
              <section key={group.state}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[18px] font-bold text-slate-800">{group.state}</h2>
                  <span className="text-[12px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {group.cities.length} {group.cities.length === 1 ? 'city' : 'cities'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.cities.map((city) => (
                    <a
                      key={city.slug}
                      href={`/location/${city.slug}`}
                      className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-card transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <MapPin size={14} className="text-primary flex-shrink-0" />
                            <h3 className="text-[15px] font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">
                              {city.city}
                            </h3>
                          </div>
                          <p className="text-[13px] text-slate-400">{group.state}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-[20px] font-bold text-slate-800">{city.agencyCount}</p>
                          <p className="text-[11px] text-slate-400">
                            {city.agencyCount === 1 ? 'agency' : 'agencies'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[12.5px] text-primary font-medium">
                          View agencies →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 p-6 bg-white border border-slate-200 rounded-2xl text-center">
          <p className="text-[15px] font-semibold text-slate-800 mb-1">
            Can&apos;t find your city?
          </p>
          <p className="text-[13.5px] text-slate-500 mb-4">
            Browse all agencies or search by country and exam.
          </p>
          <a
            href="/agencies"
            className="inline-flex items-center h-10 px-6 bg-primary hover:bg-primary-hover text-white text-[13.5px] font-semibold rounded-xl transition-colors"
          >
            Browse All Agencies
          </a>
        </div>
      </div>
    </div>
  )
}
