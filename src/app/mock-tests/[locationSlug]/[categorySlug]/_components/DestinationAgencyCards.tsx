import React from 'react'
import { Star, ArrowRight, Building2 } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

type MiniAgency = {
  id:          string
  name:        string
  slug:        string
  logo:        string | null
  location:    string
  rating:      number
  reviewCount: number
}

async function getTopAgencies(countryTerm: string): Promise<MiniAgency[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('agencies')
    .select('id, name, slug, logo, location, countries')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(80)

  if (!data?.length) return []

  // Filter by country term in JS (reliable regardless of DB column type)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = (data as any[])
    .filter(a => {
      const countries: string[] = Array.isArray(a.countries) ? a.countries : []
      return countries.some(c =>
        c.toLowerCase().includes(countryTerm.toLowerCase()) ||
        countryTerm.toLowerCase().includes(c.toLowerCase())
      )
    })
    .slice(0, 3)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return filtered.map((a: any) => ({
    id:          a.id,
    name:        a.name,
    slug:        a.slug,
    logo:        a.logo ?? null,
    location:    a.location ?? '',
    rating:      a.rating ?? 0,
    reviewCount: a.review_count ?? 0,
  }))
}

function Initials({ name }: { name: string }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
      <span className="text-[13px] font-bold text-primary">{initials}</span>
    </div>
  )
}

type Props = {
  countryTerm: string
  countryName: string
  countrySlug: string
  flagCode:    string
}

export async function DestinationAgencyCards({ countryTerm, countryName, countrySlug, flagCode }: Props) {
  const agencies = await getTopAgencies(countryTerm)
  if (!agencies.length) return null

  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <img
            src={`https://flagcdn.com/20x15/${flagCode}.png`}
            alt={countryName}
            width={20} height={15}
            className="rounded-sm"
          />
          <h2 className="text-[14px] font-bold text-slate-800">
            Top Agencies for {countryName}
          </h2>
        </div>
        <a
          href={`/agencies?country=${countrySlug}`}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
        >
          View all <ArrowRight size={12} />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {agencies.map(agency => (
          <a
            key={agency.id}
            href={`/agency/${agency.slug}`}
            className="flex flex-col gap-3 p-4 border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.02] rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3">
              {agency.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={agency.logo} alt={agency.name} width={40} height={40} className="w-10 h-10 rounded-xl object-contain border border-slate-100" />
              ) : (
                <Initials name={agency.name} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight truncate">
                  {agency.name}
                </p>
                {agency.location && (
                  <p className="text-[11.5px] text-slate-400 mt-0.5 truncate">{agency.location}</p>
                )}
              </div>
            </div>

            {agency.rating > 0 && (
              <div className="flex items-center gap-1.5">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-[12.5px] font-semibold text-slate-700">{agency.rating.toFixed(1)}</span>
                {agency.reviewCount > 0 && (
                  <span className="text-[11.5px] text-slate-400">({agency.reviewCount} reviews)</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 text-[12px] font-semibold text-primary">
              <Building2 size={11} /> View Agency <ArrowRight size={11} />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
