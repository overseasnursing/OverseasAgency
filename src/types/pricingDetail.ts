export type CostCategory =
  | 'agency'
  | 'exam'
  | 'language'
  | 'visa'
  | 'documentation'
  | 'travel'
  | 'setup'

export const CATEGORY_META: Record<CostCategory, { label: string; color: string; textColor: string }> = {
  agency:        { label: 'Agency Fee',        color: 'bg-[#0F4C81]', textColor: 'text-[#0F4C81]' },
  exam:          { label: 'Exam Fees',          color: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]' },
  language:      { label: 'Language Training',  color: 'bg-[#8B5CF6]', textColor: 'text-[#8B5CF6]' },
  visa:          { label: 'Visa & Immigration', color: 'bg-[#2563EB]', textColor: 'text-[#2563EB]' },
  documentation: { label: 'Documentation',      color: 'bg-[#F97316]', textColor: 'text-[#F97316]' },
  travel:        { label: 'Travel & Relocation',color: 'bg-[#22C55E]', textColor: 'text-[#22C55E]' },
  setup:         { label: 'Arrival Setup',      color: 'bg-[#64748B]', textColor: 'text-[#64748B]' },
}

export interface CostLineItem {
  label: string
  category: CostCategory
  min: number
  max: number
  notes?: string
  optional: boolean
}

export interface AgencyPricingRow {
  slug: string
  name: string
  feeMin: number
  feeMax: number
  installmentAvailable: boolean
  installmentNote?: string
  hiddenChargesReported: number
  transparencyScore: number
  includedServices: string[]
  trustLevel: 'verified' | 'trusted' | 'unverified' | 'scam-reported'
  rating: number
}

export interface HiddenChargePattern {
  title: string
  description: string
  typicalAmount: string
  severity: 'warning' | 'critical'
  howToAvoid: string
}

export interface NurseCostExperience {
  id: string
  authorName: string
  authorInitials: string
  authorFrom: string
  date: string
  expectedCostINR: number
  actualCostINR: number
  biggestSurprise: string
  advice: string
  quote: string
  destinationCity: string
  timelineMonths: number
  verified: boolean
}

export interface PricingTimelineStage {
  stageNumber: number
  stageName: string
  timingLabel: string
  description: string
  costs: Array<{ label: string; range: string; optional: boolean }>
  stageTotal: string
  paymentType: 'upfront' | 'installment' | 'post-arrival'
  warning?: string
}

export interface PricingFAQ {
  question: string
  answer: string
}

export interface PricingRelatedGuide {
  slug: string
  title: string
  description: string
  category: 'exam' | 'salary' | 'visa' | 'process' | 'comparison'
  readingTimeMinutes: number
}

export interface PricingPageData {
  countrySlug: string
  countryName: string
  flag: string

  totalMin: number
  totalMax: number
  totalTypical: number
  transparencyStatement: string
  lastUpdated: string

  costLineItems: CostLineItem[]
  agencyComparison: AgencyPricingRow[]
  hiddenChargePatterns: HiddenChargePattern[]
  nurseCostExperiences: NurseCostExperience[]
  pricingTimeline: PricingTimelineStage[]

  whatShouldBeIncluded: string[]
  redFlagPhrases: string[]
  questionsToAsk: string[]

  faqs: PricingFAQ[]
  relatedCountrySlugs: string[]
  relatedGuides: PricingRelatedGuide[]
}
