export type ExamType = 'language' | 'nursing-competency' | 'registration' | 'licensing'

export interface ExamSection {
  name: string
  description: string
  scoreRequired?: string
  duration?: string
}

export interface ExamPageData {
  slug: string
  examName: string
  examFullName: string
  examType: ExamType
  applicableCountries: string[]
  applicableCountrySlugs: string[]
  headline: string
  tagline: string
  overview: string
  isMandatory: boolean
  validity?: string
  registrationFeeINR: number
  prepTimeMonths: { min: number; max: number }
  passingScore: string
  passRate?: string
  registrationUrl?: string
  sections: ExamSection[]
  prepTips: string[]
  commonMistakes: string[]
  faqs: { question: string; answer: string }[]
  relatedExamSlugs: string[]
  relatedCountrySlugs: string[]
  lastUpdated: string
}
