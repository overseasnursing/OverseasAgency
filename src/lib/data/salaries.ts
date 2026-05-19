import type { SalaryPageData } from '@/types/salary'

const SALARIES: SalaryPageData[] = [
  {
    slug: 'germany-nurse-salary',
    countrySlug: 'germany',
    countryName: 'Germany',
    countryFlag: '🇩🇪',
    headline: 'Germany Nurse Salary 2025 — Complete Guide for Indian Nurses',
    tagline: 'Earn €3,500–€5,200/month in one of Europe\'s strongest healthcare systems',
    currency: 'EUR',
    currencySymbol: '€',
    averageSalary: '€3,500–€5,200/month',
    salaryRangeDisplay: '€3,500–€5,200/month net',
    inrMonthlyMin: 310000,
    inrMonthlyMax: 460000,
    taxFree: false,
    lastUpdated: 'January 2025',
    byExperience: [
      {
        level: 'Entry Level (Berufsanerkennung stage)',
        yearsExperience: '0-1 year in Germany',
        localSalary: '€2,800–€3,200/month gross',
        inrAnnual: '₹22L–₹26L/year',
        inrMonthly: '₹1.8L–₹2.2L/month (after tax)',
      },
      {
        level: 'Qualified Nurse (Krankenpfleger/in)',
        yearsExperience: '1-3 years',
        localSalary: '€3,200–€3,800/month gross',
        inrAnnual: '₹26L–₹31L/year',
        inrMonthly: '₹2.2L–₹2.6L/month (after tax)',
      },
      {
        level: 'Experienced Nurse',
        yearsExperience: '3-7 years',
        localSalary: '€3,800–€4,500/month gross',
        inrAnnual: '₹31L–₹37L/year',
        inrMonthly: '₹2.6L–₹3.1L/month (after tax)',
      },
      {
        level: 'Senior / Specialist Nurse',
        yearsExperience: '7+ years',
        localSalary: '€4,500–€5,500/month gross',
        inrAnnual: '₹37L–₹45L/year',
        inrMonthly: '₹3.1L–₹3.8L/month (after tax)',
      },
    ],
    bySpecialty: [
      { specialty: 'ICU / Intensive Care', localSalary: '€4,200–€5,500/month', inrMonthly: '₹2.9L–₹3.8L', demandLevel: 'very-high' },
      { specialty: 'Operating Theatre', localSalary: '€4,000–€5,200/month', inrMonthly: '₹2.8L–₹3.6L', demandLevel: 'very-high' },
      { specialty: 'Emergency / A&E', localSalary: '€3,800–€5,000/month', inrMonthly: '₹2.7L–₹3.5L', demandLevel: 'very-high' },
      { specialty: 'General Ward', localSalary: '€3,200–€3,800/month', inrMonthly: '₹2.2L–₹2.7L', demandLevel: 'high' },
      { specialty: 'Geriatric / Elder Care', localSalary: '€3,000–€3,600/month', inrMonthly: '₹2.1L–₹2.5L', demandLevel: 'very-high' },
      { specialty: 'Paediatrics', localSalary: '€3,400–€4,200/month', inrMonthly: '₹2.4L–₹2.9L', demandLevel: 'high' },
    ],
    byCity: [
      { city: 'Munich (München)', localSalary: '€3,800–€5,500/month', note: 'Highest cost of living but highest salaries' },
      { city: 'Frankfurt', localSalary: '€3,600–€5,000/month', note: 'Financial centre, good hospital network' },
      { city: 'Berlin', localSalary: '€3,400–€4,800/month', note: 'Large hospital network, lower cost of living' },
      { city: 'Hamburg', localSalary: '€3,500–€4,900/month', note: 'Port city, university hospitals' },
      { city: 'Cologne (Köln)', localSalary: '€3,300–€4,600/month', note: 'Good work-life balance, moderate cost of living' },
      { city: 'Stuttgart', localSalary: '€3,500–€4,800/month', note: 'Strong hospital infrastructure' },
    ],
    comparisonNote:
      'German salaries are quoted gross (before tax). German income tax for this range is approximately 25-35%. Net take-home for a €3,500/month gross salary is approximately €2,300–€2,600/month. Social security contributions (health, pension, unemployment insurance) are mandatory but provide excellent long-term benefits.',
    deductionsNote:
      'Germany has mandatory social security contributions: health insurance (≈14.6%), pension (≈18.6%), unemployment (≈2.4%), and care insurance (≈3.05%). These are split between employer and employee. As a nurse you pay approximately half — roughly €450–€600/month on a €3,500 gross salary. Net take-home is significantly lower than gross.',
    faqs: [
      {
        question: 'What is the average salary for Indian nurses in Germany in 2025?',
        answer:
          'Indian nurses in Germany typically start at €2,800–€3,200/month gross during the Berufsanerkennung (credential recognition) phase, then move to €3,200–€3,800 as qualified nurses. Experienced nurses earn €4,000–€5,500. After German taxes (25-35%) and social security, net take-home is approximately €2,200–€3,800/month depending on experience.',
      },
      {
        question: 'How much do Indian nurses earn in Germany after tax?',
        answer:
          'After German income tax and mandatory social contributions, a nurse earning €3,500 gross takes home approximately €2,300–€2,600/month net. A nurse earning €4,500 gross takes home approximately €2,900–€3,200/month. The exact figure depends on your tax class (Steuerklasse), which changes if you\'re married or have children.',
      },
      {
        question: 'Is the Germany nurse salary better than UK nurse salary?',
        answer:
          'Germany generally pays more in gross terms. A German qualified nurse earns €3,200–€4,500 gross/month. A UK Band 5 NHS nurse earns £2,370–£2,895/month. After respective taxes, net salaries are comparable for junior nurses but Germany pulls ahead significantly at senior levels (€4,500–€5,500 vs £3,000–£3,600 for specialists).',
      },
      {
        question: 'Do Indian nurses get additional benefits in Germany beyond salary?',
        answer:
          'Yes. German employment includes: 28-30 days paid annual leave, comprehensive health insurance (employer-shared), generous parental leave, pension contributions (employer matches your contribution), and access to Germany\'s strong social safety net. These benefits significantly increase the total compensation value beyond the base salary.',
      },
      {
        question: 'How long does it take to qualify for full salary in Germany?',
        answer:
          'During the Berufsanerkennung (credential recognition) process, which typically takes 12-18 months in Germany, nurses may work at a reduced rate as "Assistenzpflegekraft" or similar. Full qualification salary starts once Berufsanerkennung is complete. Most agencies facilitate direct hospital employment from arrival with full contract terms.',
      },
    ],
    relatedSlugs: ['uk-nurse-salary', 'canada-nurse-salary', 'australia-nurse-salary'],
    relatedCountrySlugs: ['germany', 'uk', 'canada', 'australia'],
  },
  {
    slug: 'uk-nurse-salary',
    countrySlug: 'uk',
    countryName: 'United Kingdom',
    countryFlag: '🇬🇧',
    headline: 'UK Nurse Salary 2025 — Complete NHS Pay Guide for Indian Nurses',
    tagline: 'NHS Band 5 to Band 8 — clear pay progression with transparent banding',
    currency: 'GBP',
    currencySymbol: '£',
    averageSalary: '£28,407–£43,742/year',
    salaryRangeDisplay: '£28,407–£43,742/year (Band 5-7)',
    inrMonthlyMin: 250000,
    inrMonthlyMax: 380000,
    taxFree: false,
    lastUpdated: 'January 2025',
    byExperience: [
      {
        level: 'Band 5 — Newly Registered',
        yearsExperience: '0-2 years',
        localSalary: '£28,407–£34,581/year',
        inrAnnual: '₹30L–₹36L/year',
        inrMonthly: '₹2.0L–₹2.4L/month (after tax)',
      },
      {
        level: 'Band 5 — Experienced',
        yearsExperience: '2-5 years',
        localSalary: '£28,407–£34,581/year',
        inrAnnual: '₹30L–₹36L/year',
        inrMonthly: '₹2.0L–₹2.4L/month (after tax)',
      },
      {
        level: 'Band 6 — Senior Nurse / Team Leader',
        yearsExperience: '5-8 years',
        localSalary: '£35,392–£42,618/year',
        inrAnnual: '₹37L–₹45L/year',
        inrMonthly: '₹2.5L–₹3.0L/month (after tax)',
      },
      {
        level: 'Band 7 — Clinical Nurse Specialist',
        yearsExperience: '8+ years',
        localSalary: '£43,742–£50,056/year',
        inrAnnual: '₹46L–₹53L/year',
        inrMonthly: '₹3.0L–₹3.5L/month (after tax)',
      },
    ],
    bySpecialty: [
      { specialty: 'ICU / Critical Care', localSalary: '£34,000–£45,000/year', inrMonthly: '₹2.4L–₹3.1L', demandLevel: 'very-high' },
      { specialty: 'Theatre / Perioperative', localSalary: '£32,000–£44,000/year', inrMonthly: '₹2.2L–₹3.0L', demandLevel: 'very-high' },
      { specialty: 'Emergency Department', localSalary: '£30,000–£42,000/year', inrMonthly: '₹2.1L–₹2.9L', demandLevel: 'very-high' },
      { specialty: 'Mental Health', localSalary: '£29,000–£43,000/year', inrMonthly: '₹2.0L–₹3.0L', demandLevel: 'high' },
      { specialty: 'Community / District', localSalary: '£29,000–£40,000/year', inrMonthly: '₹2.0L–₹2.8L', demandLevel: 'high' },
    ],
    byCity: [
      { city: 'London', localSalary: '£28,407–£43,742 + High Cost of Living Supplement', note: 'HCAS adds £3,000–£5,000/year in inner London' },
      { city: 'Manchester', localSalary: '£28,407–£43,742/year', note: 'Lower cost of living than London' },
      { city: 'Birmingham', localSalary: '£28,407–£43,742/year', note: 'Large NHS Trust network' },
      { city: 'Leeds', localSalary: '£28,407–£43,742/year', note: 'Major teaching hospital' },
      { city: 'Edinburgh', localSalary: 'NHS Scotland bands — slightly different scale', note: 'Scotland NHS has separate pay scales' },
    ],
    comparisonNote:
      'UK NHS salaries follow the Agenda for Change (AfC) pay framework. Indian nurses typically start at Band 5 and can progress through annual increment points. London and inner city NHS Trusts pay a High Cost of Living Allowance (HCAS) on top of the national band rate.',
    deductionsNote:
      'UK income tax starts at 20% for earnings above £12,570/year (personal allowance). National Insurance is 12% on earnings between £12,570–£50,270. A Band 5 nurse earning £28,407 takes home approximately £23,000–£24,000/year after tax and NI (≈£1,920/month or ₹2.0L/month).',
    faqs: [
      {
        question: 'What band do Indian nurses start at in the UK NHS?',
        answer:
          'Most Indian nurses register at Band 5, which is the standard entry level for registered nurses in the UK NHS. Band 5 salary range is £28,407–£34,581 (2024/25). You progress through the band via annual increment points. Moving to Band 6 requires demonstrating additional competencies or taking on team leader responsibilities.',
      },
      {
        question: 'How much does a Band 5 nurse earn after tax in the UK?',
        answer:
          'A Band 5 nurse at the minimum of £28,407 takes home approximately £23,000–£24,000/year after income tax and National Insurance — approximately £1,920/month (₹2.0L/month at current rates). In London with HCAS, take-home can be £1,000–£1,500 higher per year.',
      },
      {
        question: 'Can Indian nurses progress beyond Band 5 in the UK?',
        answer:
          'Yes. Band 5 progression to Band 6 typically takes 3-5 years. Band 6 (Senior Nurse / Team Leader) pays £35,392–£42,618. Band 7 (Clinical Nurse Specialist, Advanced Practitioner) pays £43,742–£50,056. Progression requires additional qualifications or demonstrating specialist competency. Many Indian nurses reach Band 6-7 within 5-8 years.',
      },
    ],
    relatedSlugs: ['germany-nurse-salary', 'canada-nurse-salary', 'australia-nurse-salary'],
    relatedCountrySlugs: ['uk', 'germany', 'canada', 'australia'],
  },
  {
    slug: 'dubai-nurse-salary',
    countrySlug: 'dubai',
    countryName: 'Dubai / UAE',
    countryFlag: '🇦🇪',
    headline: 'Dubai Nurse Salary 2025 — Tax-Free Earnings Guide for Indian Nurses',
    tagline: 'AED 5,000–10,000/month — completely tax-free, with accommodation often included',
    currency: 'AED',
    currencySymbol: 'AED',
    averageSalary: 'AED 5,000–10,000/month',
    salaryRangeDisplay: 'AED 5,000–10,000/month (tax-free)',
    inrMonthlyMin: 115000,
    inrMonthlyMax: 230000,
    taxFree: true,
    lastUpdated: 'January 2025',
    byExperience: [
      {
        level: 'Entry Level (1-2 years experience)',
        yearsExperience: '1-2 years',
        localSalary: 'AED 5,000–6,500/month',
        inrAnnual: '₹13.8L–₹18L/year',
        inrMonthly: '₹1.15L–₹1.5L/month (tax-free)',
      },
      {
        level: 'Qualified Nurse (2-5 years)',
        yearsExperience: '2-5 years',
        localSalary: 'AED 6,500–8,500/month',
        inrAnnual: '₹18L–₹23.5L/year',
        inrMonthly: '₹1.5L–₹1.95L/month (tax-free)',
      },
      {
        level: 'Senior Nurse (5-10 years)',
        yearsExperience: '5-10 years',
        localSalary: 'AED 8,000–11,000/month',
        inrAnnual: '₹22L–₹30.5L/year',
        inrMonthly: '₹1.84L–₹2.53L/month (tax-free)',
      },
      {
        level: 'Charge Nurse / Senior Specialist',
        yearsExperience: '10+ years',
        localSalary: 'AED 10,000–15,000/month',
        inrAnnual: '₹27.6L–₹41.4L/year',
        inrMonthly: '₹2.3L–₹3.45L/month (tax-free)',
      },
    ],
    bySpecialty: [
      { specialty: 'ICU / Critical Care', localSalary: 'AED 8,000–12,000/month', inrMonthly: '₹1.84L–₹2.76L', demandLevel: 'very-high' },
      { specialty: 'Operating Theatre', localSalary: 'AED 7,500–11,000/month', inrMonthly: '₹1.73L–₹2.53L', demandLevel: 'very-high' },
      { specialty: 'Emergency', localSalary: 'AED 7,000–10,000/month', inrMonthly: '₹1.61L–₹2.3L', demandLevel: 'high' },
      { specialty: 'General Ward', localSalary: 'AED 5,000–7,000/month', inrMonthly: '₹1.15L–₹1.61L', demandLevel: 'high' },
      { specialty: 'Private Hospital Premium', localSalary: 'AED 8,000–15,000/month', inrMonthly: '₹1.84L–₹3.45L', demandLevel: 'high' },
    ],
    byCity: [
      { city: 'Dubai (DHA)', localSalary: 'AED 6,000–12,000/month', note: 'Highest private hospital salaries. DHA license required.' },
      { city: 'Abu Dhabi (MOH/HAAD)', localSalary: 'AED 5,500–11,000/month', note: 'Government hospitals pay well. HAAD license required.' },
      { city: 'Sharjah', localSalary: 'AED 5,000–8,000/month', note: 'Lower cost of living, more affordable accommodation.' },
      { city: 'Al Ain', localSalary: 'AED 5,000–8,500/month', note: 'TAWAM Hospital and Oasis Hospital are major employers.' },
    ],
    comparisonNote:
      'Dubai salaries are entirely tax-free — there is no income tax in the UAE. Many hospital packages include free accommodation, health insurance, and annual flight allowance to India. These benefits can be worth AED 2,000–4,000/month extra in value. Factor in the full package when comparing with UK or Germany.',
    faqs: [
      {
        question: 'How much can an Indian nurse save working in Dubai?',
        answer:
          'An Indian nurse earning AED 7,000/month tax-free in Dubai, with hospital-provided accommodation, can realistically save AED 3,000–4,500/month (₹69K–₹103K). Over 2 years, savings of ₹16L–₹25L are achievable. This makes Dubai an excellent stepping stone for funding Germany or Australia migration.',
      },
      {
        question: 'Is accommodation included in Dubai nursing packages?',
        answer:
          'Many government hospitals and large private hospitals in Dubai and Abu Dhabi include free shared accommodation or a housing allowance. Some packages also include annual flight tickets to India, health insurance, and uniform allowance. Always clarify the full package — not just the base salary — before signing.',
      },
      {
        question: 'What is the difference between DHA, MOH, and HAAD for Indian nurses in UAE?',
        answer:
          'DHA (Dubai Health Authority) license is required for Dubai. HAAD (Health Authority Abu Dhabi) is for Abu Dhabi. MOH (Ministry of Health) covers other emirates. Each has a separate exam. Most Indian nurses choose DHA or MOH based on which emirate they want to work in. DHA exam is considered slightly more competitive.',
      },
    ],
    relatedSlugs: ['uk-nurse-salary', 'germany-nurse-salary', 'canada-nurse-salary'],
    relatedCountrySlugs: ['dubai', 'uk', 'germany', 'canada'],
  },
]

export function getAllSalaries(): SalaryPageData[] {
  return SALARIES
}

export function getSalary(slug: string): SalaryPageData | undefined {
  return SALARIES.find((s) => s.slug === slug)
}

export function getAllSalarySlugs(): string[] {
  return SALARIES.map((s) => s.slug)
}
