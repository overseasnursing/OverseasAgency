import { createClient } from '@/lib/supabase/server'
import {
  getAllAgencies as getMockAgencies,
  getAgencyBySlug as getMockAgency,
} from '@/lib/data/agencies'
import type { Tables } from '@/types/database'

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'

export type AgencyRow = Tables<'agencies'>

export async function getActiveAgencies(): Promise<AgencyRow[]> {
  if (!SUPABASE_CONFIGURED) {
    return getMockAgencies() as unknown as AgencyRow[]
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .eq('is_active', true)
    .order('featured', { ascending: false })
    .order('rating', { ascending: false })
  if (error) {
    console.error('[agencies] getActiveAgencies:', error.message)
    return getMockAgencies() as unknown as AgencyRow[]
  }
  return data ?? []
}

export async function getAgency(slug: string): Promise<AgencyRow | null> {
  if (!SUPABASE_CONFIGURED) {
    return getMockAgency(slug) as unknown as AgencyRow | null
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[agencies] getAgency:', error.message)
    }
    return getMockAgency(slug) as unknown as AgencyRow | null
  }
  return data
}
