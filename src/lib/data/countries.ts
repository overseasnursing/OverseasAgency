import type { CountryDetail } from '@/types/countryDetail'
import type { AttributionSource } from '@/components/seo/ContentAttribution'

// Official regulatory/government sources cited on each country's migration guide —
// keep in sync with the claims made in that country's CountryDetail entry below.
export const COUNTRY_SOURCES: Record<string, AttributionSource[]> = {
  germany: [
    { label: 'Federal Employment Agency (Bundesagentur für Arbeit), Germany', url: 'https://www.arbeitsagentur.de' },
    { label: 'Recognition in Germany — Make it in Germany (federal portal)', url: 'https://www.make-it-in-germany.com' },
    { label: 'German Nursing Act (Pflegeberufegesetz — PflBG)', url: 'https://www.gesetze-im-internet.de/pflbg/' },
    { label: 'Goethe-Institut — Language Certification Standards', url: 'https://www.goethe.de' },
  ],
  uk: [
    { label: 'Nursing and Midwifery Council (NMC), United Kingdom', url: 'https://www.nmc.org.uk' },
    { label: 'UK Home Office — Health and Care Worker Visa guidance', url: 'https://www.gov.uk/health-care-worker-visa' },
    { label: 'NHS Employers — Agenda for Change Pay Scales', url: 'https://www.nhsemployers.org/topics/pay-pensions-and-reward/agenda-for-change' },
    { label: 'UK Visas and Immigration (UKVI)', url: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration' },
  ],
  canada: [
    { label: 'Immigration, Refugees and Citizenship Canada (IRCC)', url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html' },
    { label: 'Canadian Nurses Association (CNA)', url: 'https://www.cna-aiic.ca' },
    { label: 'National Nursing Assessment Service (NNAS)', url: 'https://www.nnas.ca' },
    { label: 'National Council of State Boards of Nursing (NCSBN) — NCLEX', url: 'https://www.ncsbn.org' },
  ],
  australia: [
    { label: 'Australian Health Practitioner Regulation Agency (AHPRA)', url: 'https://www.ahpra.gov.au' },
    { label: 'Australian Department of Home Affairs', url: 'https://immi.homeaffairs.gov.au' },
    { label: 'Australian Nursing and Midwifery Accreditation Council (ANMAC)', url: 'https://www.anmac.org.au' },
    { label: 'Fair Work Commission — Nursing and Midwifery Industry Award', url: 'https://www.fwc.gov.au' },
  ],
  dubai: [
    { label: 'Dubai Health Authority (DHA) — Health Regulation Sector', url: 'https://www.dha.gov.ae' },
    { label: 'General Directorate of Residency and Foreigners Affairs (GDRFA), Dubai', url: 'https://gdrfad.gov.ae' },
    { label: 'Ministry of Human Resources & Emiratisation (MOHRE), UAE', url: 'https://www.mohre.gov.ae' },
    { label: 'Department of Health Abu Dhabi (DOH)', url: 'https://www.doh.gov.ae' },
  ],
}

const GERMANY: CountryDetail = {
  slug: 'germany',
  name: 'Germany',
  flag: '🇩🇪',
  continent: 'Europe',
  capital: 'Berlin',
  officialLanguage: 'German',
  tagline: 'Europe\'s largest economy with 35,000+ unfilled nursing positions and permanent residency pathway.',
  description: 'Germany is the top destination for Indian nurses seeking long-term career growth in Europe. With an acute nursing shortage of over 35,000 positions, federal hospitals actively recruit internationally trained nurses. The German government has streamlined visa processing under the Fachkräftezuwanderungsgesetz (Skilled Immigration Act), making Germany one of the most nurse-friendly immigration pathways. The key challenge is German language proficiency — B2 level is mandatory for nursing practice. Salaries range from €3,500 to €5,200/month with full social security, health insurance, and a defined path to permanent residency after 4 years.',

  salary: {
    localCurrency: 'Euro',
    localSymbol: '€',
    localMin: 3500,
    localMax: 5200,
    period: 'monthly',
    inrMonthlyMin: 320000,
    inrMonthlyMax: 475000,
    taxFree: false,
  },

  demandLevel: 'very-high',
  visaProcessingWeeks: { min: 12, max: 24 },
  prPathway: 'direct',
  prTimelineYears: 4,
  languageBarrier: 'high',
  nursingDemand: '35,000+ unfilled nursing positions nationwide',
  recommendationPercent: 89,
  // SOURCE OF TRUTH: pricing.ts (germany) — totalMin/totalMax
  totalMigrationCostMin: 542000,
  totalMigrationCostMax: 944000,

  exams: [
    {
      name: 'OET',
      category: 'language',
      minimumScore: 'Grade B (350+)',
      prepTimeMonths: '3–5 months',
      approxCostINR: 25000,
      mandatory: false,
      description: 'Occupational English Test — alternative to IELTS. Accepted by German nursing boards for initial visa application and English-language documentation.',
    },
    {
      name: 'IELTS Academic',
      category: 'language',
      minimumScore: '7.0 overall, 6.5 each band (German visa)',
      prepTimeMonths: '3–6 months',
      approxCostINR: 17000,
      mandatory: false,
      description: 'IELTS is accepted for German visa documentation only — not for nursing licensure (which requires German B2). The German visa threshold (7.0 overall, 6.5 per band) differs from NMC/AHPRA nursing registration (7.0 in all four bands). OET or IELTS required — not both.',
    },
    {
      name: 'TestDaF / Goethe B2',
      category: 'language',
      minimumScore: 'B2 (CEFR)',
      prepTimeMonths: '8–14 months',
      approxCostINR: 12000,
      mandatory: true,
      description: 'German language proficiency at B2 level is mandatory for nursing licensure (Berufsanerkennung) in Germany. This is the most critical and time-consuming requirement.',
    },
    {
      name: 'Berufsanerkennung',
      category: 'registration',
      minimumScore: 'Full Recognition',
      prepTimeMonths: '3–6 months (process)',
      approxCostINR: 18000,
      mandatory: true,
      description: 'German nursing credential recognition process. Your Indian nursing qualification is assessed by the state nursing board (Landesbehörde). Partial recognition may require a supervised adaptation period (Anpassungsqualifikation).',
    },
  ],

  migrationSteps: [
    {
      title: 'OET / IELTS Preparation',
      duration: '3–5 months',
      description: 'Clear English language requirement first. Most agencies include OET coaching. Target OET Grade B or IELTS 7.0+ to proceed.',
    },
    {
      title: 'German Language (A1 → B2)',
      duration: '8–14 months',
      description: 'The most critical phase. Start German classes immediately — B2 is mandatory for nursing practice. Many agencies offer Goethe-Institut affiliated coaching.',
    },
    {
      title: 'Employer Matching',
      duration: '4–8 weeks',
      description: 'Agency matches you with a German hospital or care facility. Employment contract signed. German employer initiates Berufsanerkennung with the state nursing board.',
    },
    {
      title: 'Credential Recognition (Berufsanerkennung)',
      duration: '3–6 months',
      description: 'German nursing board reviews Indian qualifications. Full or partial recognition granted. Partial recognition requires a supervised adaptation period (Anpassungsqualifikation) at the hospital.',
    },
    {
      title: 'Visa Application',
      duration: '8–16 weeks',
      description: 'Apply for Fachkräftezuwanderungsgesetz visa at German consulate in India. Requires job offer, recognition letter, language certificate, and credential documents.',
    },
    {
      title: 'Pre-Departure Preparation',
      duration: '2–4 weeks',
      description: 'Flight booking, health insurance activation (public or employer-arranged), accommodation arrangement in Germany, German bank account setup guidance.',
    },
    {
      title: 'Arrival & Registration',
      duration: 'First 2 weeks',
      description: 'Register at the local Einwohnermeldeamt (residents registration office), open German bank account, begin work at hospital under supervised integration program.',
    },
  ],

  pricing: {
    agencyFeeMin: 350000,
    agencyFeeMax: 550000,
    examCosts: [
      { exam: 'OET (2 attempts)', costINR: 50000 },
      { exam: 'Goethe B2 (2 attempts)', costINR: 24000 },
      { exam: 'Credential Recognition (Berufsanerkennung)', costINR: 18000 },
    ],
    visaFeeINR: 14000,
    relocationMin: 80000,
    relocationMax: 150000,
    accommodationSetupMin: 60000,
    accommodationSetupMax: 120000,
    totalMin: 542000,
    totalMax: 944000,
    disclaimer: 'Figures are estimates based on 2024 market data. Agency fees vary. German government covers healthcare and social security after joining — no ongoing insurance cost.',
  },

  reviews: [
    {
      id: 'de-r1',
      authorName: 'Anitha Krishnan',
      authorInitials: 'AK',
      authorFrom: 'Thrissur, Kerala',
      date: 'Feb 2025',
      rating: 5,
      title: 'Best decision of my nursing career — Germany is incredible',
      body: 'I was skeptical at first because of the German language requirement. Took me 11 months to get B2 but it was 100% worth it. My hospital in Munich is incredibly organized — everything is protocol-driven, patients are very cooperative. Salary is €3,800/month after taxes. My agency (Global Nursing Solutions) handled the Berufsanerkennung process and kept me updated every step.',
      destinationCity: 'Munich',
      hospitalType: 'Government university hospital',
      actualTotalCostINR: 720000,
      timelineMonths: 16,
      currentSalaryDisplay: '€3,800/month',
      wouldRecommend: true,
      verified: true,
    },
    {
      id: 'de-r2',
      authorName: 'Saju Thomas',
      authorInitials: 'ST',
      authorFrom: 'Kottayam, Kerala',
      date: 'Nov 2024',
      rating: 4,
      title: 'Excellent career growth, German language is the real challenge',
      body: 'Germany is fantastic for long-term settlement. PR after 4 years is very achievable. The language learning was hard — I failed B2 once and had to retake. My agency covered the second attempt cost. Now earning €4,100/month in Frankfurt. The adaptation period (Anpassungsqualifikation) was 6 months but I learned so much about German nursing standards. Worth every rupee.',
      destinationCity: 'Frankfurt',
      hospitalType: 'Private hospital network',
      actualTotalCostINR: 840000,
      timelineMonths: 18,
      currentSalaryDisplay: '€4,100/month',
      wouldRecommend: true,
      verified: true,
    },
    {
      id: 'de-r3',
      authorName: 'Meera Nair',
      authorInitials: 'MN',
      authorFrom: 'Kozhikode, Kerala',
      date: 'Aug 2024',
      rating: 5,
      title: 'Germany changed my life — applying for PR next year',
      body: 'Three years in Berlin now. Starting PR application process next year. My salary has grown from €3,500 to €4,600 since I joined. The work-life balance is exceptional — 38-hour work weeks, 30 days annual leave. I was worried about racism but my ward is multicultural with several Indian and Filipino nurses. German language became natural after 6 months of actual practice.',
      destinationCity: 'Berlin',
      hospitalType: 'Government hospital',
      actualTotalCostINR: 680000,
      timelineMonths: 15,
      currentSalaryDisplay: '€4,600/month (after 3 years)',
      wouldRecommend: true,
      verified: true,
    },
  ],

  faqs: [
    {
      question: 'Is German language truly mandatory for nursing in Germany?',
      answer: 'Yes — B2 level German (CEFR) is mandatory for nursing licensure (Berufsanerkennung) in all German states. You cannot practice as a nurse in Germany without B2. Some employers allow you to join at B1 for an adaptation period while you complete B2, but you must achieve B2 before full recognition is granted. Plan 10–14 months of dedicated language study.',
    },
    {
      question: 'What is the Berufsanerkennung process?',
      answer: 'Berufsanerkennung is the German nursing credential recognition process where a state nursing authority (Landesbehörde) compares your Indian nursing qualification against the German nursing standard. Most Indian BSc Nursing graduates receive partial recognition, which requires completing a supervised adaptation period (Anpassungsqualifikation) of 3–12 months at a German hospital. Your employer pays you during this period.',
    },
    {
      question: 'How much does it really cost to move to Germany as a nurse?',
      answer: 'Total cost typically ranges from ₹5.7L to ₹9.3L. This includes agency fees (₹3.5–5.5L), language exam costs (₹40,000–70,000 for OET + Goethe B2), credential recognition fees (₹18,000), visa fees (₹14,000), flight (₹55,000–90,000), and first-month accommodation setup (₹60,000–120,000). Some agencies offer installment plans. Avoid agencies charging upfront payments without a signed contract.',
    },
    {
      question: 'Can I bring my family to Germany?',
      answer: 'Yes. Once you have a work visa and are employed, your spouse and dependent children can apply for family reunification visa (Familienzusammenführung). Your spouse needs basic German A1 before arriving (required by law). Family visa typically takes 3–6 months to process from India.',
    },
    {
      question: 'How long until I get permanent residency (PR) in Germany?',
      answer: 'Permanent residency (Niederlassungserlaubnis) is available after 4 years of continuous legal residence with valid employment. Requirements include sufficient German language proficiency (usually B1), financial self-sufficiency, clean criminal record, and adequate housing. Some federal states may have slightly different conditions. German citizenship is possible after 5 years (or 3 years in exceptional cases).',
    },
    {
      question: 'Is Germany safe for Indian nurses? Is there discrimination?',
      answer: 'Germany has a strong anti-discrimination legal framework. Most government hospitals are multicultural environments with nurses from the Philippines, India, Eastern Europe, and Africa working together. Urban hospitals in Munich, Berlin, Frankfurt, and Hamburg tend to be more international. Rural areas may be less diverse. Most Indian nurses in Germany report positive experiences, with the main adjustment challenge being cultural communication differences in patient care.',
    },
  ],

  relatedGuides: [
    { slug: 'germany-nurse-salary-guide', title: 'Germany Nurse Salary Guide 2025', description: 'Breakdown of TVöD pay scales, state differences, shift allowances, and take-home pay after taxes for Indian nurses in Germany.', category: 'salary', readingTimeMinutes: 8 },
    { slug: 'german-b2-for-nurses', title: 'German B2 Language Guide for Nurses', description: 'How to pass the Goethe-Institut B2 exam — study resources, timelines, common mistakes, and preparation strategies for Indian nurses.', category: 'exam', readingTimeMinutes: 11 },
    { slug: 'berufsanerkennung-guide', title: 'German Credential Recognition (Berufsanerkennung) Process', description: 'Step-by-step guide to getting your Indian nursing qualification recognized in Germany, including adaptation period and required documents.', category: 'process', readingTimeMinutes: 9 },
    { slug: 'oet-vs-ielts-germany', title: 'OET vs IELTS for Germany Nursing Visa', description: 'Which English exam is better for your German nursing visa application? Score requirements, acceptance, and preparation strategies compared.', category: 'comparison', readingTimeMinutes: 6 },
  ],

  relatedCountrySlugs: ['uk', 'canada', 'australia'],
  featuredAgencySlugs: ['global-nursing-solutions', 'medworld-overseas', 'nursepath-international'],
}

const UK: CountryDetail = {
  slug: 'uk',
  name: 'United Kingdom',
  flag: '🇬🇧',
  continent: 'Europe',
  capital: 'London',
  officialLanguage: 'English',
  tagline: 'NHS actively recruits Indian nurses with streamlined visa pathway and no language barrier.',
  description: 'The UK National Health Service (NHS) is one of the world\'s largest employers of nurses and actively recruits internationally trained nurses to address a chronic shortage of over 47,000 nursing vacancies. For Indian nurses, the UK offers a significant advantage: English is the working language, eliminating the language learning barrier faced in Germany. The NMC (Nursing and Midwifery Council) registration requires passing a Computer Based Test (CBT) and Objective Structured Clinical Examination (OSCE). The Health and Care Worker Visa has fast processing and direct NHS sponsorship. Salaries follow the NHS Agenda for Change Band 5-7 pay scales.',

  salary: {
    localCurrency: 'Pound Sterling',
    localSymbol: '£',
    localMin: 28407,
    localMax: 43742,
    period: 'annual',
    inrMonthlyMin: 250000,
    inrMonthlyMax: 385000,
    taxFree: false,
  },

  demandLevel: 'very-high',
  visaProcessingWeeks: { min: 8, max: 14 },
  prPathway: 'direct',
  prTimelineYears: 5,
  languageBarrier: 'low',
  nursingDemand: '47,000+ NHS nursing vacancies',
  recommendationPercent: 84,
  totalMigrationCostMin: 400000,
  totalMigrationCostMax: 750000,

  exams: [
    {
      name: 'OET',
      category: 'language',
      minimumScore: 'Grade B (350+) in all four components',
      prepTimeMonths: '2–4 months',
      approxCostINR: 25000,
      mandatory: false,
      description: 'Occupational English Test — preferred by NMC. Nursing-specific scenarios make it more relevant than IELTS for clinical contexts. Grade B in Listening, Reading, Writing, and Speaking required.',
    },
    {
      name: 'IELTS Academic',
      category: 'language',
      minimumScore: '7.0 in all four bands',
      prepTimeMonths: '2–4 months',
      approxCostINR: 17000,
      mandatory: false,
      description: 'Alternative to OET for NMC registration. Academic IELTS only — 7.0 in all four bands (Listening, Reading, Writing, Speaking). A score of 6.5 in any single band fails the NMC requirement. See /exam/ielts-guide for full requirements.',
    },
    {
      name: 'CBT (NMC)',
      category: 'competency',
      minimumScore: 'Pass',
      prepTimeMonths: '1–2 months',
      approxCostINR: 11000,
      mandatory: true,
      description: 'Computer Based Test set by NMC UK. Tests theoretical nursing knowledge across medicine, surgery, and mental health. Can be taken in India at Pearson VUE centres. Must pass before OSCE.',
    },
    {
      name: 'OSCE (NMC)',
      category: 'competency',
      minimumScore: 'Pass',
      prepTimeMonths: '2–4 weeks (onsite prep)',
      approxCostINR: 60000,
      mandatory: true,
      description: 'Objective Structured Clinical Examination — a practical nursing skills assessment conducted in the UK. Typically organized by the sponsoring NHS trust. Usually done after arriving in the UK. NHS employer often covers preparation cost.',
    },
  ],

  migrationSteps: [
    { title: 'OET / IELTS Preparation', duration: '2–4 months', description: 'Clear language requirement. OET is faster for nurses already working in English-medium hospitals. Target Grade B in all four components.' },
    { title: 'NMC CBT Examination', duration: '4–8 weeks', description: 'Register with NMC, pass the Computer Based Test at a Pearson VUE centre in India. Covers nursing theory across all clinical areas.' },
    { title: 'NMC Application & Document Verification', duration: '8–12 weeks', description: 'Apply to NMC with CBT result, nursing qualification, English test result, and identity documents. NMC issues a letter of conditional registration.' },
    { title: 'Job Offer & Visa Sponsorship', duration: '4–8 weeks', description: 'Agency matches you with an NHS trust or private healthcare provider with a sponsor licence. Employer files Certificate of Sponsorship (CoS).' },
    { title: 'Health and Care Worker Visa', duration: '8–14 weeks', description: 'Apply for visa with CoS. Faster processing than standard skilled worker visa. Low visa fee (subsidized for NHS workers in some trusts). Biometrics at VFS Global.' },
    { title: 'OSCE Completion (UK)', duration: '2–4 weeks (onsite)', description: 'Attend OSCE preparation program organized by your NHS employer. Pass the practical nursing assessment to receive full NMC registration.' },
    { title: 'Full NMC Registration', duration: '1–2 weeks post-OSCE', description: 'NMC issues PIN number — you are now a registered nurse in the UK. Begin full nursing duties at your NHS trust or private hospital.' },
  ],

  pricing: {
    agencyFeeMin: 300000,
    agencyFeeMax: 500000,
    examCosts: [
      { exam: 'OET (2 attempts)', costINR: 50000 },
      { exam: 'NMC CBT', costINR: 11000 },
      { exam: 'NMC Application Fee', costINR: 11000 },
    ],
    visaFeeINR: 35000,
    relocationMin: 70000,
    relocationMax: 130000,
    accommodationSetupMin: 50000,
    accommodationSetupMax: 100000,
    totalMin: 400000,
    totalMax: 750000,
    disclaimer: 'Many NHS trusts reimburse OSCE fees and offer relocation allowances of £1,000–£3,000. Check your employment contract for reimbursements before finalizing agency fee.',
  },

  reviews: [
    {
      id: 'uk-r1',
      authorName: 'Priya Mathew',
      authorInitials: 'PM',
      authorFrom: 'Ernakulam, Kerala',
      date: 'Mar 2025',
      rating: 5,
      title: 'NHS is an incredible workplace — London is expensive but worth it',
      body: 'I work in a surgical ward in a North London NHS trust. The structured career progression in NHS is exceptional — I\'m already planning to apply for Band 6. CBT was straightforward with 6 weeks of preparation. OSCE was more intense but my NHS trust provided excellent preparation support. Agency fee was ₹3.8L — expensive but they handled everything.',
      destinationCity: 'London',
      hospitalType: 'NHS Teaching Hospital',
      actualTotalCostINR: 580000,
      timelineMonths: 10,
      currentSalaryDisplay: '£30,600/year (Band 5)',
      wouldRecommend: true,
      verified: true,
    },
    {
      id: 'uk-r2',
      authorName: 'Binu George',
      authorInitials: 'BG',
      authorFrom: 'Palakkad, Kerala',
      date: 'Jan 2025',
      rating: 4,
      title: 'Good career move, but London cost of living is shocking',
      body: 'Manchester is much better value than London. I\'m earning £29,000 as Band 5 and my rent is manageable. The NHS culture is very patient-centered. OET was my biggest challenge — failed speaking once. My agency covered the retake. Overall happy with the move. ILR (permanent residency) pathway after 5 years is very clear.',
      destinationCity: 'Manchester',
      hospitalType: 'NHS District Hospital',
      actualTotalCostINR: 520000,
      timelineMonths: 9,
      currentSalaryDisplay: '£29,000/year (Band 5)',
      wouldRecommend: true,
      verified: true,
    },
  ],

  faqs: [
    { question: 'Do I need to know German or any other language for UK nursing?', answer: 'No. English is the working language of NHS. You need to demonstrate English proficiency through OET (Grade B in all four sub-tests) or IELTS Academic (7.0 in all four bands — Listening, Reading, Writing, and Speaking). No other language is required.' },
    { question: 'What is the NMC OSCE and when does it happen?', answer: 'The OSCE (Objective Structured Clinical Examination) is a practical nursing skills test conducted in the UK after you arrive. It is organized and usually funded by your NHS employer. You are paid your salary from day one — the OSCE is done on company time within your first few weeks. It tests clinical skills like medication administration, wound care, handover communication, and patient assessment.' },
    { question: 'How long does UK permanent residency (ILR) take?', answer: 'Indefinite Leave to Remain (ILR) is available after 5 continuous years of legal residence on a valid visa. With a Health and Care Worker Visa, you are eligible to apply after 5 years. British citizenship can be applied for 12 months after receiving ILR.' },
    { question: 'Can I work outside NHS in the UK?', answer: 'Yes. Your NMC registration (PIN) is not tied to a specific employer — it is your personal registration. Once you have full NMC registration, you can work for any NHS trust, private hospital, care home, or agency in the UK. Many nurses do bank shifts (additional hours) for extra income.' },
    { question: 'Is the UK still good for Indian nurses after Brexit?', answer: 'Yes — the Health and Care Worker Visa introduced after Brexit has actually made it easier and cheaper for nurses to come to the UK compared to the old Tier 2 route. NHS actively recruits internationally. Visa processing is fast, fees are lower for NHS workers, and the pathway to ILR remains the same.' },
  ],

  relatedGuides: [
    { slug: 'uk-nmc-registration-guide', title: 'UK NMC Registration Step-by-Step Guide', description: 'Complete walkthrough of CBT, OSCE, document verification, and full NMC PIN registration for Indian nurses.', category: 'process', readingTimeMinutes: 10 },
    { slug: 'uk-nurse-salary-bands', title: 'NHS Salary Bands for Indian Nurses (2025)', description: 'Agenda for Change pay scales, Band 5–7 breakdown, London weighting, overtime rates, and take-home pay after tax and NI.', category: 'salary', readingTimeMinutes: 7 },
    { slug: 'oet-for-nmc-uk', title: 'OET Preparation Guide for UK NMC Registration', description: 'Grade B OET requirements, test format, nursing-specific preparation resources, and common mistakes to avoid.', category: 'exam', readingTimeMinutes: 8 },
    { slug: 'uk-vs-germany-nursing', title: 'UK vs Germany for Indian Nurses — Full Comparison', description: 'Salary, cost of living, language requirements, PR timeline, and quality of life comparison for Indian nurses choosing between UK and Germany.', category: 'comparison', readingTimeMinutes: 9 },
  ],

  relatedCountrySlugs: ['germany', 'canada', 'australia'],
  featuredAgencySlugs: ['global-nursing-solutions', 'nursepath-international', 'medlink-solutions'],
}

const CANADA: CountryDetail = {
  slug: 'canada',
  name: 'Canada',
  flag: '🇨🇦',
  continent: 'North America',
  capital: 'Ottawa',
  officialLanguage: 'English / French',
  tagline: 'NCLEX-RN pathway with Express Entry PR — Canada\'s nurse shortage exceeds 60,000 positions.',
  description: 'Canada faces one of its most severe nursing shortages in history, with over 60,000 unfilled nursing positions across provinces. The country actively recruits internationally educated nurses (IENs) through multiple pathways including Express Entry, Provincial Nominee Programs (PNP), and the Rural and Northern Immigration Pilot. Indian nurses must pass the NCLEX-RN and meet province-specific registration requirements. Salaries range from CAD $65,000 to $95,000 annually with excellent benefits. Canada offers one of the clearest permanent residency pathways for nurses, with many achieving PR within 2–3 years of arrival.',

  salary: {
    localCurrency: 'Canadian Dollar',
    localSymbol: 'CAD $',
    localMin: 65000,
    localMax: 95000,
    period: 'annual',
    inrMonthlyMin: 330000,
    inrMonthlyMax: 485000,
    taxFree: false,
  },

  demandLevel: 'very-high',
  visaProcessingWeeks: { min: 16, max: 28 },
  prPathway: 'direct',
  prTimelineYears: 2,
  languageBarrier: 'low',
  nursingDemand: '60,000+ nursing vacancies across provinces',
  recommendationPercent: 87,
  // SOURCE OF TRUTH: pricing.ts (canada) — totalMin/totalMax
  totalMigrationCostMin: 620000,
  totalMigrationCostMax: 1100000,

  exams: [
    {
      name: 'NCLEX-RN',
      category: 'competency',
      minimumScore: 'Pass',
      prepTimeMonths: '3–5 months',
      approxCostINR: 17000,
      mandatory: true,
      description: 'National Council Licensure Examination — mandatory for nursing registration in all Canadian provinces. Computerized adaptive test with 75–145 questions. Can be taken at Pearson VUE in India.',
    },
    {
      name: 'IELTS General',
      category: 'language',
      minimumScore: 'CLB 7 (Overall 6.0, no band below 5.5)',
      prepTimeMonths: '2–4 months',
      approxCostINR: 17000,
      mandatory: true,
      description: 'Required for Express Entry immigration. IELTS General Training version. Canadian Language Benchmark (CLB) 7 maps to IELTS 6.0 overall. Higher scores improve Express Entry Comprehensive Ranking System (CRS) points.',
    },
    {
      name: 'Provincial Registration',
      category: 'registration',
      minimumScore: 'Approved',
      prepTimeMonths: '2–4 months (process)',
      approxCostINR: 15000,
      mandatory: true,
      description: 'Each province has its own nursing regulatory body (e.g., CNO for Ontario, BCCNM for BC). Document assessment and application required separately from NCLEX. Some provinces require a bridging program for internationally educated nurses.',
    },
  ],

  migrationSteps: [
    { title: 'IELTS / Language Test', duration: '2–4 months', description: 'IELTS General Training or CELPIP. Target CLB 7+ for Express Entry eligibility. Higher scores significantly boost CRS points.' },
    { title: 'NCLEX-RN Preparation & Exam', duration: '3–5 months', description: 'Register with NCLEX and your target province\'s nursing college simultaneously. Study using UWORLD, Saunders, or agency-provided resources. Can be taken at Pearson VUE centres in India.' },
    { title: 'Provincial Nursing Registration', duration: '2–4 months', description: 'Apply to provincial regulatory body (CNO, BCCNM, CARNA etc.) for assessment of credentials. Some provinces issue a conditional registration before NCLEX.' },
    { title: 'Job Offer (Optional but Helpful)', duration: '4–8 weeks', description: 'A Canadian job offer in nursing adds 50–200 CRS points to Express Entry. Many Indian nurses apply before arriving via agency matching with Canadian hospitals.' },
    { title: 'Express Entry / PR Application', duration: '6–12 months', description: 'Create Express Entry profile under Federal Skilled Worker stream. With IELTS, job offer, and age advantage, typical CRS score for nurses is 450–480+. Invitation to Apply (ITA) issued during periodic draws.' },
    { title: 'Visa & Arrival', duration: '4–8 weeks post-ITA', description: 'Apply for Permanent Residence after receiving ITA. Physical landing in Canada to activate PR status. Some choose Temporary Foreign Worker permit to start working while PR processes.' },
  ],

  pricing: {
    agencyFeeMin: 400000,
    agencyFeeMax: 600000,
    examCosts: [
      { exam: 'NCLEX-RN', costINR: 17000 },
      { exam: 'IELTS (2 attempts)', costINR: 34000 },
      { exam: 'Provincial Registration', costINR: 15000 },
    ],
    visaFeeINR: 25000,
    relocationMin: 100000,
    relocationMax: 200000,
    accommodationSetupMin: 80000,
    accommodationSetupMax: 160000,
    totalMin: 620000,
    totalMax: 1100000,
    disclaimer: 'Canada immigration fees are paid in CAD. Relocation costs are higher due to long-haul flights. Toronto and Vancouver are expensive cities — consider settling in smaller cities like Calgary, Edmonton, or Winnipeg for better cost of living.',
  },

  reviews: [
    {
      id: 'ca-r1',
      authorName: 'Deepa Varghese',
      authorInitials: 'DV',
      authorFrom: 'Alappuzha, Kerala',
      date: 'Apr 2025',
      rating: 5,
      title: 'PR in 2 years, amazing life quality in Calgary',
      body: 'Canada was my dream. Arrived on a work permit, got PR in 22 months. Calgary is much more affordable than Toronto — my salary is CAD $78,000 and I own my life here. NCLEX prep took me 4 months. The immigration process was complex but my agency guided me excellently through Express Entry CRS scoring. Would choose Canada again 100%.',
      destinationCity: 'Calgary',
      hospitalType: 'Regional health authority hospital',
      actualTotalCostINR: 920000,
      timelineMonths: 20,
      currentSalaryDisplay: 'CAD $78,000/year',
      wouldRecommend: true,
      verified: true,
    },
  ],

  faqs: [
    { question: 'Which province in Canada is easiest for Indian nurses?', answer: 'Ontario and British Columbia have the highest nursing demand but also the most competitive registration processes. Manitoba, Saskatchewan, and Nova Scotia have more accessible processes for internationally educated nurses and often issue invitations through their Provincial Nominee Programs targeted at healthcare workers. Alberta is also increasingly nurse-friendly with a streamlined credential assessment.' },
    { question: 'Can I get PR directly without working in Canada first?', answer: 'Yes — through Express Entry Federal Skilled Worker (FSW) stream, you do not need prior Canadian work experience. You need IELTS CLB 7+, NCLEX pass, credential assessment, and a job offer or strong CRS score. Many Indian nurses receive Invitations to Apply (ITA) without having worked in Canada previously.' },
    { question: 'Is NCLEX-RN difficult for Indian nurses?', answer: 'NCLEX difficulty depends on your preparation. Indian BSc Nursing graduates typically have strong theoretical knowledge but may find the clinical reasoning format (Next Generation NCLEX, NGN) different from Indian exam styles. Most nurses pass within 2–3 attempts with 3–4 months of dedicated preparation using UWORLD and Saunders resources. The pass rate for first-time international candidates has improved significantly.' },
  ],

  relatedGuides: [
    { slug: 'canada-nclex-guide', title: 'NCLEX-RN Guide for Indian Nurses (2025)', description: 'Registration process, study resources, Next Generation NCLEX format, and province-specific requirements for Indian nursing graduates.', category: 'exam', readingTimeMinutes: 12 },
    { slug: 'express-entry-nurses', title: 'Express Entry for Nurses — CRS Score Strategy', description: 'How to maximize your CRS score as an internationally educated nurse for Canadian Express Entry draws.', category: 'visa', readingTimeMinutes: 9 },
    { slug: 'canada-nurse-salary-guide', title: 'Canada Nurse Salary by Province (2025)', description: 'Province-by-province salary breakdown, overtime rates, benefits, and cost of living comparison for Indian nurses in Canada.', category: 'salary', readingTimeMinutes: 8 },
  ],

  relatedCountrySlugs: ['uk', 'australia', 'germany'],
  featuredAgencySlugs: ['medworld-overseas', 'careplus-migration', 'sunrise-overseas-health'],
}

const AUSTRALIA: CountryDetail = {
  slug: 'australia',
  name: 'Australia',
  flag: '🇦🇺',
  continent: 'Oceania',
  capital: 'Canberra',
  officialLanguage: 'English',
  tagline: 'AUD $75,000–$105,000 salary, PR pathway, and world-class work-life balance.',
  description: 'Australia consistently ranks as one of the best countries for nurse migration due to high salaries, excellent working conditions, and a clear pathway to permanent residency. The Australian Health Practitioner Regulation Agency (AHPRA) manages nursing registration. Indian nurses must pass NCLEX-RN (or an AHPRA skills assessment) and meet English language requirements. The Skilled Worker visa (subclass 482 or 190) provides a pathway to permanent residency. Demand is highest in regional areas, which also offer additional immigration points.',

  salary: {
    localCurrency: 'Australian Dollar',
    localSymbol: 'AUD $',
    localMin: 75000,
    localMax: 105000,
    period: 'annual',
    inrMonthlyMin: 344000,
    inrMonthlyMax: 481000,
    taxFree: false,
  },

  demandLevel: 'high',
  visaProcessingWeeks: { min: 12, max: 22 },
  prPathway: 'pathway',
  prTimelineYears: 4,
  languageBarrier: 'low',
  nursingDemand: '30,000+ nursing vacancies, rising demand in regional areas',
  recommendationPercent: 85,
  // SOURCE OF TRUTH: pricing.ts (australia) — totalMin/totalMax
  totalMigrationCostMin: 690000,
  totalMigrationCostMax: 1200000,

  exams: [
    {
      name: 'OET',
      category: 'language',
      minimumScore: 'Grade B (350+) in all four components',
      prepTimeMonths: '2–4 months',
      approxCostINR: 25000,
      mandatory: false,
      description: 'Accepted by AHPRA for nursing registration. OET is preferred by most nursing applicants due to healthcare-specific content.',
    },
    {
      name: 'IELTS Academic',
      category: 'language',
      minimumScore: '7.0 overall, 7.0 in each band',
      prepTimeMonths: '3–5 months',
      approxCostINR: 17000,
      mandatory: false,
      description: 'AHPRA requires IELTS Academic 7.0 in ALL four bands — the same requirement as UK NMC. OET Grade B is generally easier to achieve for nurses. See /exam/ielts-guide for full requirements.',
    },
    {
      name: 'AHPRA Registration Assessment',
      category: 'registration',
      minimumScore: 'Approved',
      prepTimeMonths: '2–4 months (process)',
      approxCostINR: 30000,
      mandatory: true,
      description: 'AHPRA assesses your Indian nursing qualifications against Australian standards. Most Indian BSc (N) degrees are partially recognized, requiring a supervised practice program upon arrival.',
    },
    {
      name: 'NCLEX-RN',
      category: 'competency',
      minimumScore: 'Pass',
      prepTimeMonths: '3–5 months',
      approxCostINR: 17000,
      mandatory: false,
      description: 'Not required for all states but increasingly accepted as part of AHPRA assessment. Advisable to complete for stronger application. Can be taken at Pearson VUE centres in India.',
    },
  ],

  migrationSteps: [
    { title: 'OET / IELTS', duration: '2–5 months', description: 'AHPRA requires OET Grade B or IELTS Academic 7.0 per band. OET recommended for nurses due to healthcare-specific content and generally easier attainment for clinical professionals.' },
    { title: 'AHPRA Assessment', duration: '2–4 months', description: 'Apply to AHPRA for skills assessment of Indian nursing qualification. Submit degree certificates, transcripts, registration certificates, and reference letters from employers.' },
    { title: 'Skills Assessment & Points Test', duration: '4–6 weeks', description: 'For visa subclass 189/190, nursing must be listed on the Medium and Long-term Strategic Skills List (MLTSSL). Points test assessed based on age, English, experience, and qualifications.' },
    { title: 'State Nomination (if applicable)', duration: '4–12 weeks', description: 'For subclass 190 (state-sponsored), apply to a state/territory for nomination. Regional areas offer faster processing and additional 5 points for immigration.' },
    { title: 'Visa Grant', duration: '12–22 weeks', description: 'Lodge permanent or temporary visa application with Department of Home Affairs. Health examination and character checks required. Biometrics at VFS Global in India.' },
    { title: 'Supervised Practice (onsite)', duration: '3–6 months', description: 'AHPRA may require a period of supervised practice with a registered Australian nurse. Your employer arranges this. During this period you earn full salary as an enrolled or conditional nurse.' },
  ],

  pricing: {
    agencyFeeMin: 400000,
    agencyFeeMax: 700000,
    examCosts: [
      { exam: 'OET (2 attempts)', costINR: 50000 },
      { exam: 'AHPRA Assessment', costINR: 30000 },
      { exam: 'Skills Assessment (ANMAC)', costINR: 18000 },
    ],
    visaFeeINR: 90000,
    relocationMin: 90000,
    relocationMax: 180000,
    accommodationSetupMin: 70000,
    accommodationSetupMax: 150000,
    totalMin: 690000,
    totalMax: 1200000,
    disclaimer: 'Australian visa fees are significantly higher than European destinations. Regional area nomination (subclass 190) offers faster processing and additional CRS-equivalent points. Consider Melbourne, Brisbane, or Adelaide over Sydney for cost-of-living balance.',
  },

  reviews: [
    {
      id: 'au-r1',
      authorName: 'Reshma Jacob',
      authorInitials: 'RJ',
      authorFrom: 'Trivandrum, Kerala',
      date: 'Feb 2025',
      rating: 5,
      title: 'Best work-life balance of my nursing career — Brisbane is amazing',
      body: 'I chose Australia over UK primarily for lifestyle. Brisbane is beautiful, nurses are treated with respect, and the 38-hour week is strictly maintained. Earning AUD $82,000 as an ICU nurse. The supervised practice period was 4 months but my hospital paid me full rate. OET was my only real hurdle — passed on second attempt.',
      destinationCity: 'Brisbane',
      hospitalType: 'State government hospital',
      actualTotalCostINR: 890000,
      timelineMonths: 17,
      currentSalaryDisplay: 'AUD $82,000/year',
      wouldRecommend: true,
      verified: true,
    },
  ],

  faqs: [
    { question: 'Is NCLEX-RN mandatory for Australia?', answer: 'NCLEX-RN is not universally mandatory for all AHPRA registrations, but it is accepted as part of the competency assessment for some pathways. AHPRA primarily assesses your Indian nursing qualification against Australian standards. NCLEX is recommended as it strengthens your application and demonstrates clinical competency internationally. Check the specific requirements for your target state.' },
    { question: 'Which Australian city is best for Indian nurses?', answer: 'Brisbane and Adelaide offer the best balance of nursing salaries, cost of living, and quality of life. Sydney and Melbourne have higher salaries but significantly higher living costs. Regional areas (outside major cities) offer additional immigration points and often higher demand — Perth, Darwin, and Cairns are particularly nurse-friendly. For PR through the 190 visa, state nomination from regional areas is often faster.' },
    { question: 'How long does AHPRA assessment take?', answer: 'AHPRA initial assessment typically takes 8–12 weeks after you submit a complete application. If additional information is requested, it can take longer. The assessment determines if your Indian qualification is substantially equivalent to Australian nursing standards. Most Indian BSc Nursing graduates receive conditional registration requiring a supervised practice period.' },
  ],

  relatedGuides: [
    { slug: 'ahpra-registration-india', title: 'AHPRA Registration Guide for Indian Nurses', description: 'Step-by-step AHPRA application process, document requirements, and what to expect from the skills assessment as an Indian nurse.', category: 'process', readingTimeMinutes: 10 },
    { slug: 'australia-nurse-salary-2025', title: 'Australia Nurse Salary Guide 2025', description: 'State-by-state salary comparison, award rates, overtime, penalty rates, and take-home pay for nurses in Australia.', category: 'salary', readingTimeMinutes: 8 },
    { slug: 'australia-vs-canada-nursing', title: 'Australia vs Canada for Indian Nurses', description: 'Salary, cost of living, PR pathway, exam requirements, and quality of life comparison for Indian nurses choosing between Australia and Canada.', category: 'comparison', readingTimeMinutes: 9 },
  ],

  relatedCountrySlugs: ['canada', 'uk', 'germany'],
  featuredAgencySlugs: ['global-nursing-solutions', 'medworld-overseas', 'prime-nursing-abroad'],
}

const DUBAI: CountryDetail = {
  slug: 'dubai',
  name: 'Dubai (UAE)',
  flag: '🇦🇪',
  continent: 'Middle East',
  capital: 'Dubai',
  officialLanguage: 'Arabic (English widely used)',
  tagline: 'Tax-free salary, 4–8 week processing, fastest route for Indian nurses seeking immediate income.',
  description: 'Dubai and the UAE offer the fastest and most accessible migration pathway for Indian nurses — processing in 4–8 weeks, no language barrier, no complex exams, and tax-free salaries. Dubai Health Authority (DHA), Ministry of Health (MOH), and Abu Dhabi Health Authority (HAAD) licensing exams are straightforward computer-based tests. While there is no permanent residency pathway, the UAE\'s proximity to India, cultural familiarity, strong Indian community, and ability to save aggressively make it highly attractive for nurses seeking rapid income growth. Many Indian nurses use UAE as a stepping stone before migrating to Europe or Canada.',

  salary: {
    localCurrency: 'UAE Dirham',
    localSymbol: 'AED',
    localMin: 5000,
    localMax: 10000,
    period: 'monthly',
    inrMonthlyMin: 112000,
    inrMonthlyMax: 225000,
    taxFree: true,
  },

  demandLevel: 'high',
  visaProcessingWeeks: { min: 4, max: 8 },
  prPathway: 'none',
  languageBarrier: 'low',
  nursingDemand: '15,000+ healthcare positions in Dubai, Abu Dhabi, and Sharjah',
  recommendationPercent: 78,
  // SOURCE OF TRUTH: pricing.ts (dubai) — totalMin/totalMax
  totalMigrationCostMin: 160000,
  totalMigrationCostMax: 460000,

  exams: [
    {
      name: 'DHA Exam',
      category: 'registration',
      minimumScore: 'Pass',
      prepTimeMonths: '4–8 weeks',
      approxCostINR: 7000,
      mandatory: false,
      description: 'Dubai Health Authority licensing exam for nurses working specifically in Dubai. Prometric computer-based test with multiple choice questions on clinical nursing. Most Indian nurses pass with 4–6 weeks of preparation.',
    },
    {
      name: 'MOH Exam',
      category: 'registration',
      minimumScore: 'Pass',
      prepTimeMonths: '4–8 weeks',
      approxCostINR: 6000,
      mandatory: false,
      description: 'Ministry of Health exam — valid for nursing practice across most UAE emirates (not Dubai). Required if your employer is a MOH-regulated facility. Similar format to DHA exam.',
    },
    {
      name: 'HAAD / DoH Exam',
      category: 'registration',
      minimumScore: 'Pass',
      prepTimeMonths: '4–8 weeks',
      approxCostINR: 7000,
      mandatory: false,
      description: 'Health Authority of Abu Dhabi (now Department of Health) exam — required for nursing practice in Abu Dhabi emirate. Slightly more rigorous than DHA/MOH. Required if your employer is in Abu Dhabi.',
    },
    {
      name: 'IELTS / English',
      category: 'language',
      minimumScore: '6.0 overall',
      prepTimeMonths: '1–2 months',
      approxCostINR: 17000,
      mandatory: false,
      description: 'English proficiency may be required by some UAE employers. IELTS 6.0 is the most common requirement. Many Indian nurses from English-medium colleges are exempt with degree certificates as proof.',
    },
  ],

  migrationSteps: [
    { title: 'DHA / MOH / HAAD Exam', duration: '4–8 weeks', description: 'Choose your target emirate (Dubai = DHA, Abu Dhabi = HAAD, others = MOH). Register online for Prometric exam. 4–6 weeks of preparation using past papers and agency resources. Can be taken in India.' },
    { title: 'DataFlow Verification', duration: '4–6 weeks', description: 'Primary source verification of your Indian nursing credentials through DataFlow Group. Mandatory for all UAE health authority licensing. Submit degree, registration, and employment certificates.' },
    { title: 'Job Matching', duration: '2–4 weeks', description: 'Agency connects you with UAE hospital, clinic, or healthcare facility. Salary and contract negotiation. Employer files initial visa application with UAE immigration.' },
    { title: 'Employment Visa Processing', duration: '3–5 weeks', description: 'Employer-sponsored employment visa. Medical fitness test in India (blood tests, chest X-ray). Emirates ID registration after arrival. Entire process employer-managed.' },
    { title: 'Arrival & Licensing', duration: '1–2 weeks', description: 'Arrive in UAE. Complete health authority license activation onsite. Receive Emirates ID. Begin working. Many nurses are practice-ready within 2 weeks of landing.' },
  ],

  pricing: {
    agencyFeeMin: 100000,
    agencyFeeMax: 300000,
    examCosts: [
      { exam: 'DHA / MOH Exam', costINR: 7000 },
      { exam: 'DataFlow Verification', costINR: 15000 },
    ],
    visaFeeINR: 8000,
    relocationMin: 30000,
    relocationMax: 60000,
    accommodationSetupMin: 30000,
    accommodationSetupMax: 70000,
    totalMin: 160000,
    totalMax: 460000,
    disclaimer: 'UAE is the most cost-effective migration destination. Many employers cover flight, visa, and accommodation — check your employment contract carefully. Avoid agencies charging more than ₹2L total for UAE placement.',
  },

  reviews: [
    {
      id: 'ae-r1',
      authorName: 'Sini Mathew',
      authorInitials: 'SM',
      authorFrom: 'Idukki, Kerala',
      date: 'Jan 2025',
      rating: 4,
      title: 'Dubai is fast, easy, and saving rate is excellent — but no PR',
      body: 'I moved to Dubai in just 7 weeks from initial consultation. DHA exam was straightforward — passed first attempt with 5 weeks of prep. My salary is AED 7,500/month — tax-free, so I save nearly 60% of my income. Sending ₹1.1L home every month. The downside is visa dependency on employer and no permanent settlement path. But for 3–5 years of income building, Dubai is unbeatable.',
      destinationCity: 'Dubai',
      hospitalType: 'Private hospital group',
      actualTotalCostINR: 230000,
      timelineMonths: 3,
      currentSalaryDisplay: 'AED 7,500/month (tax-free)',
      wouldRecommend: true,
      verified: true,
    },
    {
      id: 'ae-r2',
      authorName: 'Lijo Abraham',
      authorInitials: 'LA',
      authorFrom: 'Pathanamthitta, Kerala',
      date: 'Nov 2024',
      rating: 4,
      title: 'Good for 2–3 years, then I plan to move to Germany',
      body: 'Dubai was my entry into international nursing. 3 years here, learned clinical confidence, saved well, and now applying for Germany. DHA was the easiest exam I ever did. Agency charged ₹1.8L which was fair. Salary grew from AED 5,200 to AED 8,100 in 3 years. The Indian community here is massive which helps. No work-life balance issues at my hospital.',
      destinationCity: 'Dubai',
      hospitalType: 'Government hospital (DHA)',
      actualTotalCostINR: 195000,
      timelineMonths: 2,
      currentSalaryDisplay: 'AED 8,100/month (tax-free)',
      wouldRecommend: true,
      verified: true,
    },
  ],

  faqs: [
    { question: 'Is there permanent residency in Dubai for nurses?', answer: 'No — UAE does not offer a permanent residency pathway for nurses through standard employment visas. You are on a 2-year renewable employment visa tied to your employer. The UAE Golden Visa (10 years) is available for specialized professionals and investors, but standard nursing positions do not qualify. Most Indian nurses in Dubai plan for 3–7 years of high savings before moving to a PR-offering destination.' },
    { question: 'Which exam — DHA, MOH, or HAAD — should I take?', answer: 'It depends entirely on which emirate your employer is in. Dubai employers require DHA. Abu Dhabi employers require HAAD (DoH). All other emirates (Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain) require MOH. Your agency will guide you based on your job offer location. If undecided, MOH is the most broadly applicable.' },
    { question: 'Can I bring my family to Dubai?', answer: 'Yes — if your salary is above AED 4,000/month (which most nurse salaries exceed), you can sponsor your spouse and children for a family residence visa. School fees and healthcare costs in Dubai are high — factor this into your savings plans. Many nurses send money home and maintain family in India until they have saved sufficiently.' },
    { question: 'Is Dubai safe for Indian female nurses?', answer: 'Dubai is consistently rated one of the safest cities in the world. The Indian nurse community in Dubai is very large — thousands of nurses from Kerala, Tamil Nadu, and other states work here. Hospital accommodations (offered by many employers) are in secure, well-maintained complexes. Female Indian nurses report feeling very safe in Dubai compared to many other destinations.' },
  ],

  relatedGuides: [
    { slug: 'dha-exam-application-guide', title: 'DHA Exam Complete Guide for Indian Nurses', description: 'Registration, syllabus, question format, preparation resources, and passing strategy for the Dubai Health Authority nursing exam.', category: 'exam', readingTimeMinutes: 7 },
    { slug: 'dubai-vs-germany-nursing', title: 'Dubai vs Germany — Which is Better for Indian Nurses?', description: 'Salary, savings rate, PR pathway, lifestyle, and long-term career comparison for Indian nurses choosing between UAE and Germany.', category: 'comparison', readingTimeMinutes: 8 },
    { slug: 'uae-nurse-salary-guide', title: 'UAE Nurse Salary Guide 2025 (Tax-Free)', description: 'DHA, MOH, and HAAD salary ranges, allowances, benefits, and actual take-home pay for Indian nurses across UAE emirates.', category: 'salary', readingTimeMinutes: 6 },
  ],

  relatedCountrySlugs: ['uk', 'canada', 'germany'],
  featuredAgencySlugs: ['medlink-solutions', 'prime-nursing-abroad', 'sunrise-overseas-health'],
}

const COUNTRY_MAP: Record<string, CountryDetail> = {
  germany: GERMANY,
  uk: UK,
  canada: CANADA,
  australia: AUSTRALIA,
  dubai: DUBAI,
}

export function getCountryDetail(slug: string): CountryDetail | null {
  return COUNTRY_MAP[slug] ?? null
}

export function getAllCountrySlugs(): string[] {
  return Object.keys(COUNTRY_MAP)
}

export function getAllCountries(): CountryDetail[] {
  return Object.values(COUNTRY_MAP)
}

// Maps normalizeCountry() keys (src/app/jobs/[slug]/_data/countryMappings.ts)
// to the country page slugs that actually exist in COUNTRY_MAP.
const COUNTRY_KEY_TO_PAGE_SLUG: Record<string, string> = {
  'uae':       'dubai',
  'uk':        'uk',
  'germany':   'germany',
  'australia': 'australia',
  'canada':    'canada',
}

/**
 * Real guide links for a job's country — only returns the country overview
 * page plus its curated related guides, both of which are confirmed to
 * exist, so callers never render a broken link.
 */
export function getCountryGuideLinks(normalizedCountryKey: string): { name: string; href: string }[] {
  const pageSlug = COUNTRY_KEY_TO_PAGE_SLUG[normalizedCountryKey]
  if (!pageSlug) return []
  const country = getCountryDetail(pageSlug)
  if (!country) return []
  return [
    { name: `${country.name} Nursing Migration Guide`, href: `/country/${country.slug}` },
    ...country.relatedGuides.map((g) => ({ name: g.title, href: `/guides/${g.slug}` })),
  ]
}
