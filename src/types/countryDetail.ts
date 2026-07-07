export type DemandLevel = 'very-high' | 'high' | 'moderate'
export type PrPathway = 'direct' | 'pathway' | 'none'
export type LanguageBarrier = 'high' | 'moderate' | 'low'
export type ExamCategory = 'language' | 'competency' | 'registration'

export interface SalaryInfo {
  localCurrency: string
  localSymbol: string
  localMin: number
  localMax: number
  period: 'monthly' | 'annual'
  inrMonthlyMin: number
  inrMonthlyMax: number
  taxFree: boolean
}

export interface ExamRequirement {
  name: string
  category: ExamCategory
  minimumScore: string
  prepTimeMonths: string
  approxCostINR: number
  mandatory: boolean
  description: string
}

export interface CountryMigrationStep {
  title: string
  duration: string
  description: string
}

export interface PricingBreakdown {
  agencyFeeMin: number
  agencyFeeMax: number
  examCosts: { exam: string; costINR: number }[]
  visaFeeINR: number
  relocationMin: number
  relocationMax: number
  accommodationSetupMin: number
  accommodationSetupMax: number
  totalMin: number
  totalMax: number
  disclaimer: string
}

export interface CountryReview {
  id: string
  authorName: string
  authorInitials: string
  authorFrom: string
  date: string
  rating: number
  title: string
  body: string
  destinationCity: string
  hospitalType: string
  actualTotalCostINR: number
  timelineMonths: number
  currentSalaryDisplay: string
  wouldRecommend: boolean
  verified: boolean
}

export interface CountryRelatedGuide {
  slug: string
  title: string
  description: string
  category: 'exam' | 'salary' | 'visa' | 'process' | 'comparison'
  readingTimeMinutes: number
}

export interface CountryFAQ {
  question: string
  answer: string
}

export interface CountryDetail {
  slug: string
  name: string
  flag: string
  continent: string
  capital: string
  officialLanguage: string

  tagline: string
  description: string

  salary: SalaryInfo
  demandLevel: DemandLevel
  visaProcessingWeeks: { min: number; max: number }
  prPathway: PrPathway
  prTimelineYears?: number
  languageBarrier: LanguageBarrier
  nursingDemand: string
  recommendationPercent: number
  totalMigrationCostMin: number
  totalMigrationCostMax: number

  exams: ExamRequirement[]
  migrationSteps: CountryMigrationStep[]
  pricing: PricingBreakdown
  reviews: CountryReview[]
  faqs: CountryFAQ[]
  relatedGuides: CountryRelatedGuide[]
  relatedCountrySlugs: string[]
  featuredAgencySlugs: string[]
  // Content Recommendation Foundation — reserved for a future per-source-
  // country variant of this destination's related content. Country pages
  // are keyed by destination (one page per country, e.g. Germany), not by
  // source country, so this is registry-level foundation only — no widget
  // consumes it yet. See src/lib/recommendations/rank.ts.
  sourceCountry?: string
}
