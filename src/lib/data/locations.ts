import type { LocationPageData } from '@/types/location'

const KERALA_AGENCIES = [
  {
    slug: 'global-nursing-solutions',
    name: 'Global Nursing Solutions',
    rating: 4.9,
    reviewCount: 47,
    destinations: ['Germany', 'UK', 'Canada'],
    feeRangeDisplay: '₹5L–₹9L',
    address: 'MG Road, Ernakulam',
    trustLevel: 'verified' as const,
  },
  {
    slug: 'medworld-overseas',
    name: 'Medworld Overseas',
    rating: 4.3,
    reviewCount: 31,
    destinations: ['Australia', 'Canada', 'UK'],
    feeRangeDisplay: '₹6L–₹12L',
    address: 'Pattom, Thiruvananthapuram',
    trustLevel: 'verified' as const,
  },
  {
    slug: 'nursepath-international',
    name: 'NursePath International',
    rating: 4.6,
    reviewCount: 28,
    destinations: ['UK', 'Germany'],
    feeRangeDisplay: '₹4.5L–₹8L',
    address: 'Swaraj Round, Thrissur',
    trustLevel: 'verified' as const,
  },
  {
    slug: 'medlink-solutions',
    name: 'MedLink Solutions',
    rating: 4.4,
    reviewCount: 19,
    destinations: ['Dubai', 'UK'],
    feeRangeDisplay: '₹1.5L–₹3.5L',
    address: 'Mavoor Road, Kozhikode',
    trustLevel: 'trusted' as const,
  },
]

const LOCATIONS: LocationPageData[] = [
  {
    city: 'Kochi',
    citySlug: 'kochi',
    state: 'Kerala',
    stateSlug: 'kerala',
    region: 'Ernakulam District',
    tagline: 'Kerala\'s largest city has the highest concentration of verified overseas nursing agencies',
    description:
      'Kochi is the hub of overseas nursing consultancy in Kerala. With multiple APSO-registered agencies, strong community networks, and experienced counsellors, nurses from across the state travel to Kochi for consultation. Most agencies serving Germany, UK, Canada, and Australia maintain their primary offices here.',
    popularDestinations: ['Germany', 'UK', 'Canada', 'Australia'],
    agencyCount: 4,
    agencies: KERALA_AGENCIES,
    localInsights:
      'Most Kochi-based agencies have strong UK and Germany specialisation. The MG Road and Palarivattom areas have the highest concentration of registered consultancies. Always verify APSO registration before signing.',
    nearbyLocations: [
      { city: 'Thrissur', slug: 'thrissur' },
      { city: 'Alappuzha', slug: 'alappuzha' },
      { city: 'Kottayam', slug: 'kottayam' },
    ],
    faqs: [
      {
        question: 'How many overseas nursing agencies are in Kochi?',
        answer:
          'Kochi has the highest number of overseas nursing consultancies in Kerala, with 30+ agencies operating. However, only a subset are APSO-registered and independently verified. Always check registration status before paying any fee.',
      },
      {
        question: 'Which countries do Kochi agencies specialize in?',
        answer:
          'Kochi agencies predominantly specialize in Germany (due to high demand and good placement networks), United Kingdom (NHS placements), and Canada. Some agencies also handle Australia and Dubai.',
      },
      {
        question: 'How do I verify an agency in Kochi is legitimate?',
        answer:
          'Check if the agency is registered with APSO (Association of Placement Service Organisations). Request their APSO certificate. Search for independent reviews on platforms like OverseasNursing.com. Never pay more than a small registration fee before a written agreement is provided.',
      },
      {
        question: 'What is the typical agency fee for Germany migration from Kochi?',
        answer:
          'Germany migration fees from Kochi agencies typically range from ₹5L to ₹8L total, covering language support, credential recognition, hospital placement, and visa assistance. Any agency charging more than ₹9L for Germany should be questioned carefully.',
      },
    ],
    relatedCountrySlugs: ['germany', 'uk', 'canada', 'australia'],
  },
  {
    city: 'Thiruvananthapuram',
    citySlug: 'thiruvananthapuram',
    state: 'Kerala',
    stateSlug: 'kerala',
    region: 'Thiruvananthapuram District',
    tagline: 'The state capital has a growing cluster of agencies focused on Australia and Middle East placements',
    description:
      'Thiruvananthapuram has a strong nursing community with significant migration to Australia, Gulf countries, and increasingly the UK. Agencies here tend to have particular expertise in AHPRA registration for Australia and MOH/HAAD exams for the Middle East.',
    popularDestinations: ['Australia', 'Dubai', 'UK', 'Canada'],
    agencyCount: 3,
    agencies: [KERALA_AGENCIES[1], KERALA_AGENCIES[3], KERALA_AGENCIES[2]],
    localInsights:
      'Agencies in the Pattom and Vazhuthacaud areas are most established. The city has strong connections with Australian hospitals through several placement networks. Average fees tend to be slightly lower than Kochi-based agencies for Australia placements.',
    nearbyLocations: [
      { city: 'Kochi', slug: 'kochi' },
      { city: 'Kollam', slug: 'kollam' },
      { city: 'Alappuzha', slug: 'alappuzha' },
    ],
    faqs: [
      {
        question: 'Which agencies in Thiruvananthapuram handle Australia migration?',
        answer:
          'Several agencies in Thiruvananthapuram are experienced with AHPRA registration and skilled visa pathways for Australia. Medworld Overseas is one of the verified agencies with documented Australia placements.',
      },
      {
        question: 'Is it better to use a Kochi agency or Thiruvananthapuram agency for migration?',
        answer:
          'Agency quality depends on the individual agency, not city location. For Germany and UK, Kochi agencies have stronger networks. For Australia and Gulf countries, Thiruvananthapuram agencies may have better contacts. Research individual agencies based on their specialisation.',
      },
    ],
    relatedCountrySlugs: ['australia', 'dubai', 'uk', 'canada'],
  },
  {
    city: 'Thrissur',
    citySlug: 'thrissur',
    state: 'Kerala',
    stateSlug: 'kerala',
    region: 'Thrissur District',
    tagline: 'Central Kerala\'s nursing migration hub with strong UK and Germany specialisation',
    description:
      'Thrissur has a well-established overseas nursing industry serving nurses from central Kerala. Agencies here have particularly strong relationships with UK NHS Trusts and German hospitals. The city also has good OET and IELTS preparation centres.',
    popularDestinations: ['UK', 'Germany', 'Canada'],
    agencyCount: 2,
    agencies: [KERALA_AGENCIES[2], KERALA_AGENCIES[0]],
    localInsights:
      'The Swaraj Round area has the most established agencies. Thrissur has excellent OET coaching infrastructure, which is helpful as most agencies require language certification before enrolling nurses.',
    nearbyLocations: [
      { city: 'Kochi', slug: 'kochi' },
      { city: 'Palakkad', slug: 'palakkad' },
      { city: 'Kozhikode', slug: 'kozhikode' },
    ],
    faqs: [
      {
        question: 'Are there good OET preparation centres in Thrissur?',
        answer:
          'Yes, Thrissur has several established OET and IELTS preparation centres. Most agencies in Thrissur have partnerships with coaching centres and can recommend good quality preparation programs.',
      },
      {
        question: 'Which is the best agency in Thrissur for UK migration?',
        answer:
          'NursePath International has documented UK placements and positive nurse reviews. Always read verified reviews on OverseasNursing.com and request references from the agency before signing any agreement.',
      },
    ],
    relatedCountrySlugs: ['uk', 'germany', 'canada'],
  },
  {
    city: 'Kozhikode',
    citySlug: 'kozhikode',
    state: 'Kerala',
    stateSlug: 'kerala',
    region: 'Kozhikode District',
    tagline: 'North Kerala\'s primary nursing migration centre with Gulf and UK focus',
    description:
      'Kozhikode serves as the migration hub for nurses from Malappuram, Wayanad, Kozhikode, and Kannur districts. Agencies here have strong Gulf connections (particularly Dubai and Abu Dhabi) and growing UK presence.',
    popularDestinations: ['Dubai', 'UK', 'Germany'],
    agencyCount: 2,
    agencies: [KERALA_AGENCIES[3], KERALA_AGENCIES[2]],
    localInsights:
      'The Mavoor Road and Calicut Medical College area have several agencies. Dubai and Abu Dhabi placements are particularly common from Kozhikode. DHA and MOH exam coaching is available locally.',
    nearbyLocations: [
      { city: 'Malappuram', slug: 'malappuram' },
      { city: 'Kannur', slug: 'kannur' },
      { city: 'Thrissur', slug: 'thrissur' },
    ],
    faqs: [
      {
        question: 'Which destinations do Kozhikode agencies specialize in?',
        answer:
          'Kozhikode agencies have historically strong Middle East (Dubai, Abu Dhabi) placement networks. UK and Germany placements are increasing. MedLink Solutions is a verified agency with documented Dubai placements.',
      },
      {
        question: 'Is the DHA exam coaching available in Kozhikode?',
        answer:
          'Yes, DHA and MOH exam coaching is available in Kozhikode. Some agencies partner with coaching centres. Preparation typically takes 6-8 weeks and most nurses clear the exam in the first attempt with structured preparation.',
      },
    ],
    relatedCountrySlugs: ['dubai', 'uk', 'germany'],
  },
  {
    city: 'Kannur',
    citySlug: 'kannur',
    state: 'Kerala',
    stateSlug: 'kerala',
    region: 'Kannur District',
    tagline: 'Growing nursing migration community with strong Gulf connections',
    description:
      'Kannur has a significant nursing community with many nurses working in Gulf countries. The town has several agencies and good awareness of overseas migration processes. Gulf placements dominate but UK interest is growing rapidly.',
    popularDestinations: ['Dubai', 'UK', 'Germany'],
    agencyCount: 2,
    agencies: [KERALA_AGENCIES[3], KERALA_AGENCIES[0]],
    localInsights:
      'Nurses from Kannur often use agencies in Kozhikode or Kochi for placements. Local presence is growing. The nursing community network is strong — connecting with experienced migrant nurses in your area is highly recommended before approaching any agency.',
    nearbyLocations: [
      { city: 'Kozhikode', slug: 'kozhikode' },
      { city: 'Wayanad', slug: 'wayanad' },
    ],
    faqs: [
      {
        question: 'Should I use a local Kannur agency or travel to Kochi for consultation?',
        answer:
          'For complex migrations like Germany or Canada, agencies in Kochi or Kozhikode with proven track records are worth the travel. For Dubai and Gulf placements, Kozhikode-based agencies can serve you well without needing to travel to Kochi.',
      },
    ],
    relatedCountrySlugs: ['dubai', 'uk', 'germany'],
  },
]

export function getAllLocations(): LocationPageData[] {
  return LOCATIONS
}

export function getLocation(citySlug: string): LocationPageData | undefined {
  return LOCATIONS.find((l) => l.citySlug === citySlug)
}

export function getAllLocationSlugs(): string[] {
  return LOCATIONS.map((l) => l.citySlug)
}
