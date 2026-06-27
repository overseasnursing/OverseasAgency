'use client'

import { useState, useRef } from 'react'
import { AgencyCard } from '@/components/agencies/AgencyCard'
import { Pagination } from '@/components/ui/Pagination'
import type { Agency } from '@/types/agency'

const PAGE_SIZE = 12

interface Props {
  agencies: Agency[]
  cityName: string
  agencyCount: number
}

export function CityAgencyGrid({ agencies, cityName, agencyCount }: Props) {
  const [page, setPage]  = useState(1)
  const sectionRef       = useRef<HTMLElement>(null)

  const totalPages   = Math.ceil(agencies.length / PAGE_SIZE)
  const pageAgencies = agencies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goToPage(p: number) {
    setPage(p)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section ref={sectionRef} aria-labelledby="agencies-heading">
      <div className="mb-5">
        <h2 id="agencies-heading" className="text-[20px] font-bold text-slate-800 mb-1">
          Agencies in {cityName}
        </h2>
        <p className="text-[13.5px] text-slate-500">
          {agencyCount} {agencyCount === 1 ? 'agency' : 'agencies'} · sorted by rating
        </p>
      </div>

      {pageAgencies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {pageAgencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      ) : (
        <p className="text-[14px] text-slate-400 py-8 text-center">
          No agencies found for this city.
        </p>
      )}
    </section>
  )
}
