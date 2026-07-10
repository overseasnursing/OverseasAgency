/**
 * Content Recommendation Foundation (Phase 5).
 *
 * One generic, pure ranking rule — content tagged for the visitor's resolved
 * source country comes first, untagged ("global") content fills the rest,
 * content tagged for a DIFFERENT source country is excluded, and nothing is
 * ever duplicated. Every future consumer (jobs, blogs, guides, exams —
 * later salaries, eligibility, promotions, notifications) calls this same
 * function instead of re-implementing the rule.
 *
 * Deliberately just a ranking rule, not a fetcher: it knows nothing about
 * Supabase, cookies, or React. Callers fetch their own candidates (already
 * bounded/limited at the query level) and pass them in.
 */

export type SourceCountryTagged = {
  sourceCountry?: string | null
}

export function rankBySourceCountry<T extends SourceCountryTagged>(
  items: T[],
  preferredCountry: string,
  limit: number,
): T[] {
  const matching = items.filter(i => i.sourceCountry === preferredCountry)
  const global   = items.filter(i => !i.sourceCountry)
  const ranked   = [...matching, ...global]

  // De-dupe defensively — a caller's candidate set should never contain the
  // same item twice, but this guarantees "never duplicated" regardless.
  const seen = new Set<unknown>()
  const deduped: T[] = []
  for (const item of ranked) {
    const key = (item as { id?: unknown }).id ?? item
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(item)
  }

  return deduped.slice(0, limit)
}
