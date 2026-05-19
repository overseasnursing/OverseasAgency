export interface LocationAgencyListing {
  slug: string
  name: string
  rating: number
  reviewCount: number
  destinations: string[]
  feeRangeDisplay: string
  address: string
  trustLevel: 'verified' | 'trusted' | 'unverified'
}

export interface LocationPageData {
  city: string
  citySlug: string
  state: string
  stateSlug: string
  region: string
  tagline: string
  description: string
  popularDestinations: string[]
  agencyCount: number
  agencies: LocationAgencyListing[]
  localInsights: string
  nearbyLocations: { city: string; slug: string }[]
  faqs: { question: string; answer: string }[]
  relatedCountrySlugs: string[]
}
