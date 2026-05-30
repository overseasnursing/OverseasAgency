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
    lastUpdated: 'May 2026',
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
    lastUpdated: 'May 2026',
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
    lastUpdated: 'May 2026',
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
  {
    slug: 'canada-nurse-salary',
    countrySlug: 'canada',
    countryName: 'Canada',
    countryFlag: '🇨🇦',
    headline: 'Canada Nurse Salary 2025 — Complete Guide for Indian Nurses',
    tagline: 'Earn CAD 62,000–100,000/year with full benefits, union protection, and a direct PR pathway',
    currency: 'CAD',
    currencySymbol: 'CAD',
    averageSalary: 'CAD 62,000–100,000/year',
    salaryRangeDisplay: 'CAD 62,000–100,000/year (gross)',
    inrMonthlyMin: 200000,
    inrMonthlyMax: 380000,
    taxFree: false,
    lastUpdated: 'May 2026',
    byExperience: [
      {
        level: 'New Graduate RN',
        yearsExperience: '0-1 year in Canada',
        localSalary: 'CAD 55,000–65,000/year',
        inrAnnual: '₹28L–₹33L/year',
        inrMonthly: '₹2.0L–₹2.3L/month (after tax)',
      },
      {
        level: 'Registered Nurse',
        yearsExperience: '1-5 years',
        localSalary: 'CAD 65,000–82,000/year',
        inrAnnual: '₹33L–₹42L/year',
        inrMonthly: '₹2.3L–₹2.9L/month (after tax)',
      },
      {
        level: 'Experienced RN',
        yearsExperience: '5-10 years',
        localSalary: 'CAD 80,000–96,000/year',
        inrAnnual: '₹41L–₹49L/year',
        inrMonthly: '₹2.8L–₹3.3L/month (after tax)',
      },
      {
        level: 'Senior / Specialist RN',
        yearsExperience: '10+ years',
        localSalary: 'CAD 92,000–110,000/year',
        inrAnnual: '₹47L–₹56L/year',
        inrMonthly: '₹3.2L–₹3.8L/month (after tax)',
      },
    ],
    bySpecialty: [
      { specialty: 'ICU / Critical Care', localSalary: 'CAD 80,000–105,000/year', inrMonthly: '₹2.8L–₹3.7L', demandLevel: 'very-high' },
      { specialty: 'Operating Theatre', localSalary: 'CAD 76,000–100,000/year', inrMonthly: '₹2.6L–₹3.5L', demandLevel: 'very-high' },
      { specialty: 'Emergency / ER', localSalary: 'CAD 73,000–97,000/year', inrMonthly: '₹2.5L–₹3.4L', demandLevel: 'very-high' },
      { specialty: 'General Medical-Surgical', localSalary: 'CAD 62,000–82,000/year', inrMonthly: '₹2.2L–₹2.9L', demandLevel: 'high' },
      { specialty: 'Community / Home Care', localSalary: 'CAD 60,000–80,000/year', inrMonthly: '₹2.1L–₹2.8L', demandLevel: 'high' },
      { specialty: 'Mental Health / Psychiatry', localSalary: 'CAD 64,000–85,000/year', inrMonthly: '₹2.2L–₹3.0L', demandLevel: 'high' },
    ],
    byCity: [
      { city: 'Toronto (Ontario)', localSalary: 'CAD 60,000–96,000/year', note: 'Largest nursing market in Canada. Regulated by CNO. High cost of living.' },
      { city: 'Vancouver (British Columbia)', localSalary: 'CAD 65,000–100,000/year', note: 'BCCNM regulated. High demand, high cost of living, strong Indian community.' },
      { city: 'Calgary / Edmonton (Alberta)', localSalary: 'CAD 68,000–105,000/year', note: 'Highest base salaries. No provincial income tax. Regulated by CARNA.' },
      { city: 'Ottawa (Ontario)', localSalary: 'CAD 60,000–95,000/year', note: 'Federal capital. Strong hospital network. Lower cost of living than Toronto.' },
      { city: 'Montreal (Quebec)', localSalary: 'CAD 54,000–82,000/year', note: 'French language required for provincial registration. OIIQ regulated.' },
    ],
    comparisonNote:
      'Canada is one of the top two destinations for Indian nurses globally, alongside the UK. Salaries are unionised in most provinces — negotiated by CUPE, ONA, or BCNU. Union membership ensures consistent pay scales, overtime protection, and shift premiums. Alberta has no provincial income tax, making it the highest net-take-home province despite similar gross salaries.',
    deductionsNote:
      'Canadian income tax is federal + provincial. For CAD $75,000/year: federal tax ≈ $12,500 + Ontario provincial tax ≈ $8,000 = approximately $20,500 total tax. Net take-home ≈ $54,500/year ($4,540/month, ₹2.8L/month). Alberta nurses take home more due to zero provincial income tax. Also note: Canada Pension Plan (CPP) and Employment Insurance (EI) deductions apply — approximately $4,500/year combined.',
    faqs: [
      {
        question: 'What is the average salary for Indian nurses in Canada in 2025?',
        answer:
          'Indian nurses working in Canada typically start at CAD $55,000–$65,000/year as new graduates, moving to CAD $65,000–$82,000 within 1-5 years. After federal and provincial taxes, a nurse earning CAD $75,000/year takes home approximately CAD $4,500/month (₹2.8L/month at current rates). Senior and specialist nurses with 10+ years earn CAD $90,000–$110,000/year.',
      },
      {
        question: 'Which Canadian province has the highest nurse salary?',
        answer:
          'Alberta consistently offers the highest net nursing salaries because it has no provincial income tax. Gross salaries in Alberta are comparable to BC and Ontario (CAD $68,000–$105,000/year), but net take-home is approximately CAD $3,000–$5,000 higher per year than equivalent roles in Ontario. British Columbia follows closely due to high union-negotiated wages.',
      },
      {
        question: 'How does Canada nurse salary compare to UK and Australia?',
        answer:
          'Canada and Australia offer comparable gross salaries. A mid-career Canadian RN earns CAD $78,000–$90,000/year. An equivalent Australian RN earns AUD $82,000–$100,000/year. Australia has the edge in total compensation due to penalty rates and 11% employer superannuation. UK Band 5-6 nurses earn significantly less (£28,000–£42,000/year) but benefit from NHS job security and PR via ILR.',
      },
      {
        question: 'Do Indian nurses qualify for Canadian PR through nursing?',
        answer:
          "Yes. Nursing is on Canada's Federal Skilled Worker list and several Provincial Nominee Programs (PNPs). Most Indian nurses gain PR through Express Entry (CEC or FSW stream) after 1-2 years of Canadian work experience. Ontario, British Columbia, and Alberta all have active PNP streams for nurses. The PR timeline is typically 12-24 months after gaining Canadian work experience.",
      },
      {
        question: 'Is NCLEX-RN required for Indian nurses to work in Canada?',
        answer:
          'Yes. All Canadian provincial nursing colleges require internationally educated nurses to pass the NCLEX-RN exam as part of registration. Canada adopted NCLEX in 2015. The exam has a 50-60% first-attempt pass rate for internationally educated nurses. Structured preparation with resources like UWorld for 3-5 months is strongly recommended before attempting NCLEX.',
      },
    ],
    relatedSlugs: ['australia-nurse-salary', 'uk-nurse-salary', 'germany-nurse-salary'],
    relatedCountrySlugs: ['canada', 'australia', 'uk', 'germany'],
  },
  {
    slug: 'australia-nurse-salary',
    countrySlug: 'australia',
    countryName: 'Australia',
    countryFlag: '🇦🇺',
    headline: 'Australia Nurse Salary 2025 — Complete Guide for Indian Nurses',
    tagline: 'AUD 70,000–115,000/year plus weekend penalty rates and 11% employer superannuation',
    currency: 'AUD',
    currencySymbol: 'AUD',
    averageSalary: 'AUD 70,000–115,000/year',
    salaryRangeDisplay: 'AUD 70,000–115,000/year (plus super)',
    inrMonthlyMin: 240000,
    inrMonthlyMax: 400000,
    taxFree: false,
    lastUpdated: 'May 2026',
    byExperience: [
      {
        level: 'Graduate RN (Year 1-2)',
        yearsExperience: '0-2 years in Australia',
        localSalary: 'AUD 65,000–74,000/year',
        inrAnnual: '₹30L–₹34L/year',
        inrMonthly: '₹2.0L–₹2.3L/month (after tax)',
      },
      {
        level: 'Registered Nurse Grade 2',
        yearsExperience: '2-5 years',
        localSalary: 'AUD 74,000–90,000/year',
        inrAnnual: '₹34L–₹41L/year',
        inrMonthly: '₹2.3L–₹2.8L/month (after tax)',
      },
      {
        level: 'Senior Registered Nurse',
        yearsExperience: '5-10 years',
        localSalary: 'AUD 88,000–108,000/year',
        inrAnnual: '₹40L–₹50L/year',
        inrMonthly: '₹2.7L–₹3.4L/month (after tax)',
      },
      {
        level: 'Nurse Unit Manager / Clinical Nurse Specialist',
        yearsExperience: '10+ years',
        localSalary: 'AUD 105,000–130,000/year',
        inrAnnual: '₹48L–₹60L/year',
        inrMonthly: '₹3.3L–₹4.0L/month (after tax)',
      },
    ],
    bySpecialty: [
      { specialty: 'ICU / Critical Care', localSalary: 'AUD 88,000–115,000/year', inrMonthly: '₹2.7L–₹3.6L', demandLevel: 'very-high' },
      { specialty: 'Operating Theatre', localSalary: 'AUD 84,000–110,000/year', inrMonthly: '₹2.6L–₹3.4L', demandLevel: 'very-high' },
      { specialty: 'Emergency Department', localSalary: 'AUD 80,000–105,000/year', inrMonthly: '₹2.5L–₹3.2L', demandLevel: 'very-high' },
      { specialty: 'General Medical-Surgical', localSalary: 'AUD 68,000–90,000/year', inrMonthly: '₹2.1L–₹2.8L', demandLevel: 'high' },
      { specialty: 'Mental Health', localSalary: 'AUD 72,000–95,000/year', inrMonthly: '₹2.2L–₹3.0L', demandLevel: 'high' },
      { specialty: 'Aged Care', localSalary: 'AUD 65,000–85,000/year', inrMonthly: '₹2.0L–₹2.6L', demandLevel: 'very-high' },
    ],
    byCity: [
      { city: 'Sydney (NSW)', localSalary: 'AUD 70,000–112,000/year', note: 'Largest hospital network. High cost of living. Strong demand from public and private sectors.' },
      { city: 'Melbourne (VIC)', localSalary: 'AUD 70,000–108,000/year', note: 'Strong public hospital system. AHPRA headquarters. Large Indian nursing community.' },
      { city: 'Brisbane (QLD)', localSalary: 'AUD 68,000–105,000/year', note: 'Growing healthcare sector. Lower cost of living than Sydney or Melbourne.' },
      { city: 'Perth (WA)', localSalary: 'AUD 70,000–112,000/year', note: 'High demand driven by mining sector workforce. Shortage of nurses relative to need.' },
      { city: 'Adelaide (SA)', localSalary: 'AUD 65,000–98,000/year', note: 'Most affordable major city. Good work-life balance. Smaller Indian nursing community.' },
    ],
    comparisonNote:
      'Australian nursing salaries are set by enterprise agreements (EAs) negotiated by unions (ANMF). Weekend and public holiday penalty rates can add 50–150% to base pay — a Saturday shift pays 1.5× and a Sunday 1.75×. Additionally, employers must contribute 11% of gross salary as superannuation (retirement fund) — this is on top of the quoted salary. Total remuneration package is typically 20-30% higher than the base annual salary figure.',
    deductionsNote:
      'Australian income tax uses a progressive scale. For AUD $80,000/year: tax is approximately $18,067 + Medicare Levy $1,600 = ~$19,667 total. Net take-home ≈ $60,333/year ($5,028/month, ₹2.8L/month). At AUD $100,000: tax ≈ $26,000, net ≈ $74,000/year ($6,167/month, ₹3.4L/month). Superannuation (11%) is paid by your employer on top of your salary and is accessible at retirement.',
    faqs: [
      {
        question: 'What is the average salary for Indian nurses in Australia in 2025?',
        answer:
          'Indian nurses working in Australia typically earn AUD $70,000–$115,000/year depending on experience and specialty. Entry-level graduate nurses start at AUD $65,000–$74,000. After Australian income tax and Medicare Levy, a nurse earning AUD $80,000/year takes home approximately AUD $60,000/year (AUD $5,000/month, ₹2.8L/month). Weekend penalty rates can add significantly to base pay.',
      },
      {
        question: 'What are Australian nursing penalty rates and how do they work?',
        answer:
          'Australian enterprise agreements mandate penalty rates for unsocial hours. A standard public hospital Saturday shift pays 1.5× base rate. Sunday shifts pay 1.75×. Public holidays pay 2.5×. For a nurse earning AUD $38/hour base, a Sunday shift pays AUD $66.50/hour. Nurses who regularly work evenings and weekends can earn an additional AUD $8,000–$15,000/year in penalty pay above their base salary.',
      },
      {
        question: 'What is superannuation and how does it benefit Indian nurses in Australia?',
        answer:
          'Superannuation (super) is Australia\'s mandatory employer-funded retirement contribution — currently 11% of gross salary, rising to 12% by 2025-26. Employers pay super on top of your salary. A nurse earning AUD $80,000/year receives an additional AUD $8,800/year in super contributions. If you return to India permanently before retirement age, you can claim your superannuation as a departing Australia superannuation payment (DASP), minus withholding tax.',
      },
      {
        question: 'Is Australia nurse salary better than Canada or UK?',
        answer:
          'Australia generally offers the highest total compensation package among English-speaking nursing destinations, mainly due to penalty rates and superannuation. Gross salary is similar to Canada (AUD $70,000–$115,000 vs CAD $62,000–$100,000), but Australia\'s weekend penalty rates and 11% super make the total remuneration package significantly higher. UK NHS nurses earn considerably less (£28,000–£50,000/year) but benefit from free healthcare and subsidised housing schemes.',
      },
      {
        question: 'Do I need NCLEX to work as a nurse in Australia?',
        answer:
          'No. Australia does not require NCLEX-RN. Instead, you must complete an ANMAC skills assessment of your Indian nursing qualification and then apply for AHPRA registration. If your Indian BSc Nursing degree meets ANMAC standards, no clinical exam is required. You will need OET Grade B or IELTS 7.0 in all bands as your English proficiency evidence.',
      },
    ],
    relatedSlugs: ['canada-nurse-salary', 'uk-nurse-salary', 'germany-nurse-salary'],
    relatedCountrySlugs: ['australia', 'canada', 'uk', 'germany'],
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
