import { createAdminClient } from '@/lib/supabase/admin'

export type PageSeoOverride = {
  title?:       string
  description?: string
}

/**
 * Fetch custom SEO override for a page path.
 * Returns {} if no override is set — caller falls back to auto-generated values.
 * Fails silently so a DB issue never breaks page rendering.
 */
export async function getPageSeoOverride(path: string): Promise<PageSeoOverride> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createAdminClient() as any
    const { data } = await db
      .from('page_seo_overrides')
      .select('seo_title, seo_description')
      .eq('path', path)
      .maybeSingle()
    if (!data) return {}
    return {
      title:       data.seo_title        || undefined,
      description: data.seo_description  || undefined,
    }
  } catch {
    return {}
  }
}
