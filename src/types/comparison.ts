export type ComparisonWinner = 'a' | 'b' | 'tie'

export interface ComparisonMetric {
  label: string
  valueA: string
  valueB: string
  winner: ComparisonWinner
  context?: string
}

export interface ComparisonPageData {
  slug: string
  countryASlug: string
  countryBSlug: string
  countryAName: string
  countryBName: string
  countryAFlag: string
  countryBFlag: string
  headline: string
  intro: string
  verdict: string
  verdictDetails: string
  metrics: ComparisonMetric[]
  whoShouldChooseA: string[]
  whoShouldChooseB: string[]
  faqs: { question: string; answer: string }[]
  relatedComparisons: string[]
  relatedCountrySlugs: string[]
}
