import type { Agency } from './agency'

export interface Review {
  id: string
  authorName: string
  authorFrom: string
  authorInitials: string
  verified: boolean
  date: string
  rating: number
  title: string
  body: string
  countryPlaced: string
  actualCostPaid: number      // in rupees
  timelineMonths: number
  wouldRecommend: boolean
  visaReceived: boolean
  communicationRating: number // 1–5
  transparencyRating: number
  speedRating: number
  hiddenChargesExperienced: boolean
  hiddenChargesAmount?: number
  helpful: number
}

export interface PricingDetail {
  isFree: boolean
  freeNote: string
  minCost: number          // in rupees (0 when isFree)
  maxCost: number
  isApproximate: boolean
  includes: string[]
  excludes: string[]
  installmentAvailable: boolean
  installmentNote?: string
  disclaimer: string
  lastUpdated: string
}

export interface Branch {
  id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  whatsapp: string
  email: string
  googleMapsUrl?: string
  isHeadOffice: boolean
  openingHours?: string
  latitude?: number
  longitude?: number
}

export interface ScamReport {
  id: string
  title: string
  description: string
  amountLost: number
  countryPromised: string
  date: string
  resolved: boolean
  resolutionNote?: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface AgencyDetail extends Omit<Agency, 'pricing'> {
  description: string
  email: string
  website?: string
  whatsapp: string
  recommendationPercent: number
  visaSuccessRate: number
  pricing: PricingDetail
  reviews: Review[]
  scamReports: ScamReport[]
  branches: Branch[]
  faqs: FAQ[]
  services: string[]
  languageTrainingOffered: boolean
  postPlacementSupport: boolean
  relatedSlugs: string[]
  // Legal & Credentials
  meaLicenseNo?: string
  meaLicenseExpiry?: string
  companyRegistrationNo?: string
  certifications: string[]
  // Language Academy
  languageInstituteName?: string
  batchType?: string
  classScheduleNote?: string
  // Media & Social
  videoTestimonials: string[]
  socialLinks: { instagram?: string; facebook?: string; youtube?: string; linkedin?: string }
  // Jobs
  currentOpeningsUrl?: string
  // Google review fallback (shown only when reviewCount === 0)
  googlePlaceId?: string
  googleRating?: number
  googleReviewCount?: number
}
