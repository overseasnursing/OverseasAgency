export interface SalaryByExperience {
  level: string
  yearsExperience: string
  localSalary: string
  inrAnnual: string
  inrMonthly: string
}

export interface SalaryBySpecialty {
  specialty: string
  localSalary: string
  inrMonthly: string
  demandLevel: 'very-high' | 'high' | 'moderate'
}

export interface SalaryByCity {
  city: string
  localSalary: string
  note?: string
}

export interface SalaryPageData {
  slug: string
  countrySlug: string
  countryName: string
  countryFlag: string
  headline: string
  tagline: string
  currency: string
  currencySymbol: string
  averageSalary: string
  salaryRangeDisplay: string
  inrMonthlyMin: number
  inrMonthlyMax: number
  taxFree: boolean
  lastUpdated: string
  byExperience: SalaryByExperience[]
  bySpecialty: SalaryBySpecialty[]
  byCity: SalaryByCity[]
  comparisonNote: string
  deductionsNote?: string
  faqs: { question: string; answer: string }[]
  relatedSlugs: string[]
  relatedCountrySlugs: string[]
  // Content Recommendation Foundation — which SOURCE country this salary
  // guide was written for. Undefined means global (every visitor, always
  // the fallback). No existing salary page is tagged yet — type-level
  // foundation only, see src/lib/recommendations/rank.ts.
  sourceCountry?: string
}
