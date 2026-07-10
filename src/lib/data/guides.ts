export type GuideFaq = {
  question: string
  answer: string
}

export type GuideSection = {
  heading: string
  content: string
}

export type GuideData = {
  slug: string
  title: string
  metaDescription: string
  category: 'salary' | 'exam' | 'registration' | 'comparison' | 'visa' | 'language'
  country: string
  readingTimeMinutes: number
  intro: string
  keyFacts: { label: string; value: string }[]
  sections: GuideSection[]
  faqs: GuideFaq[]
  relatedSlugs: string[]
  // Content Recommendation Foundation (Phase 5) — which SOURCE country this
  // guide was written for. Undefined/omitted means global (applies to every
  // visitor; always the fallback). No existing guide is tagged yet — this
  // is the type-level foundation for src/lib/recommendations/rank.ts, not a
  // content change.
  sourceCountry?: string
}

const GUIDES: GuideData[] = [
  {
    slug: 'canada-nclex-guide',
    title: 'NCLEX-RN for Canada — Complete Guide for Indian Nurses 2025',
    metaDescription: 'How Indian nurses can clear NCLEX-RN for Canada registration. Exam format, fees, prep tips, and provincial licensing process explained.',
    category: 'exam',
    country: 'Canada',
    readingTimeMinutes: 10,
    intro: 'The NCLEX-RN (National Council Licensure Examination) is the mandatory licensing exam for nurses wanting to work in Canada. Every province requires NCLEX-RN passage before granting registration. For Indian nurses, passing NCLEX-RN is a critical first step in the Canadian migration journey.',
    keyFacts: [
      { label: 'Exam Body', value: 'NCSBN (National Council of State Boards of Nursing)' },
      { label: 'Duration', value: 'Up to 5 hours (adaptive — 75 to 145 questions)' },
      { label: 'Exam Fee', value: 'CAD 360 (~₹22,000)' },
      { label: 'Pass Rate (India)', value: '~60–70% on first attempt' },
      { label: 'Prep Time', value: '3–6 months' },
      { label: 'Validity', value: 'Lifetime (no expiry)' },
    ],
    sections: [
      {
        heading: 'What is the NCLEX-RN?',
        content: 'The NCLEX-RN is a computer-adaptive test (CAT) that measures the competencies required for entry-level nursing practice. The exam adapts based on your answers — if you answer correctly, the next question is harder. The minimum number of questions is 75 and the maximum is 145. Canadian provinces use NCLEX-RN results to determine whether you are competent to practice as a registered nurse.',
      },
      {
        heading: 'Eligibility Requirements for Indian Nurses',
        content: 'To register for NCLEX-RN for Canadian licensing, you must: (1) Apply to a provincial nursing regulatory body (e.g. CNO in Ontario, CRNBC in British Columbia, CRNNS in Nova Scotia). (2) Get your Indian nursing credentials assessed by the provincial body. (3) Receive an Authorization to Test (ATT) from Pearson VUE. Indian nurses with a 3-year or 4-year B.Sc. Nursing, or GNM with some years of experience, are generally eligible but specific requirements vary by province.',
      },
      {
        heading: 'NCLEX-RN Exam Format (Next Generation NCLEX)',
        content: 'Since April 2023, NCLEX-RN uses the Next Generation NCLEX (NGN) format. This includes new question types: Case Studies (6 questions around a single patient scenario), Extended Multiple Response, Drag-and-Drop Cloze, Trend questions, and Matrix/Grid questions. The NGN is designed to test clinical judgment, not just knowledge recall. Preparation materials must be updated to NGN format.',
      },
      {
        heading: 'How to Apply — Step by Step',
        content: '1. Choose your Canadian province and apply to that regulatory body online. 2. Submit your Indian nursing credentials (transcripts, registration certificate, experience letters). 3. The regulatory body may request additional documents or a credential assessment. 4. Once approved, you will receive an ATT from Pearson VUE. 5. Schedule your exam at a Pearson VUE test centre (available in India in major cities). 6. Write the exam and receive results within 48 hours via the NCLEX Candidate website.',
      },
      {
        heading: 'Top Preparation Resources',
        content: 'UWorld NCLEX-RN (most recommended — 2,000+ NGN-format questions), Saunders Comprehensive Review for NCLEX-RN, Kaplan NCLEX-RN Prep, Mark Klimek Audio Lectures (free, excellent for Indian nurses), and the official NCSBN Learning Extension. Focus heavily on case studies and clinical judgment questions for the NGN format.',
      },
      {
        heading: 'After Passing — Canadian Nursing Registration',
        content: 'After passing NCLEX-RN, the provincial regulatory body will issue your nursing license. Ontario (CNO) is the most common destination for Indian nurses. Other popular provinces include British Columbia, Alberta, and Nova Scotia. Each province has its own processing timeline — Ontario typically takes 3–6 months from initial application to license issuance.',
      },
    ],
    faqs: [
      { question: 'Can I write NCLEX-RN in India?', answer: 'Yes. Pearson VUE has test centres in Mumbai, Delhi, Chennai, Hyderabad, Bangalore, and other major cities. You do not need to travel to Canada to write the exam.' },
      { question: 'How many times can I attempt NCLEX-RN?', answer: 'You can attempt NCLEX-RN up to 8 times per year, with a 45-day waiting period between attempts. There is no limit on total attempts.' },
      { question: 'Which Canadian province is best for Indian nurses?', answer: 'Ontario (CNO) is the most popular due to high nurse demand, good salaries, and a large Indian community. British Columbia and Alberta are also highly sought after.' },
      { question: 'Do I need IELTS/OET for Canadian nursing?', answer: 'Most Canadian provinces require proof of English proficiency. IELTS Academic (minimum 6.5–7.0 in each band) is most commonly accepted. Some provinces accept OET Grade B.' },
    ],
    relatedSlugs: ['canada-nurse-salary-guide', 'express-entry-nurses'],
  },

  {
    slug: 'canada-nurse-salary-guide',
    // Distinct from the dedicated /salary/canada-nurse-salary page's title —
    // both existed with the identical slug and near-identical title, which
    // is a duplicate-content risk (two indexable URLs competing for the same
    // keyword). This guide covers province-by-province breakdown; the salary
    // page is the canonical quick-reference.
    title: 'Canada Nurse Salary by Province — In-Depth Guide for Indian Nurses',
    metaDescription: 'How much do nurses earn in Canada in 2025? Province-wise RN salary data, shift differentials, overtime, and take-home pay for Indian nurses.',
    category: 'salary',
    country: 'Canada',
    readingTimeMinutes: 8,
    intro: 'Canada is one of the highest-paying destinations for Indian nurses, with registered nurses earning between CAD 65,000 and CAD 95,000 per year depending on province, experience, and specialisation. Understanding the salary structure before migrating is essential for financial planning.',
    keyFacts: [
      { label: 'Average RN Salary', value: 'CAD 75,000–85,000/year' },
      { label: 'Hourly Rate (Ontario)', value: 'CAD 34–48/hour' },
      { label: 'In INR (approximate)', value: '₹42L–₹54L/year' },
      { label: 'Shift Differential', value: '+CAD 2–4/hour for evenings/nights' },
      { label: 'Best-Paying Province', value: 'Ontario, British Columbia, Alberta' },
      { label: 'Tax Rate (Ontario)', value: '~20–25% effective for this bracket' },
    ],
    sections: [
      {
        heading: 'Province-wise RN Salary Comparison',
        content: 'Ontario: CAD 34–48/hour (average CAD 80,000/year). British Columbia: CAD 35–50/hour (average CAD 82,000/year). Alberta: CAD 36–52/hour (average CAD 85,000/year, and no provincial income tax). Quebec: CAD 28–40/hour but higher cost of living adjustment. Nova Scotia: CAD 30–42/hour — popular with international nurses for faster processing.',
      },
      {
        heading: 'Starting Salary for New Indian Nurses in Canada',
        content: 'Freshly registered Indian nurses typically start at step 1 of the pay scale: approximately CAD 34–36/hour in Ontario. With 2–3 years of Canadian experience, you can expect CAD 40–44/hour. Most collective agreements (union contracts) have annual step increments that automatically increase your pay each year.',
      },
      {
        heading: 'Additional Earnings — Overtime, Premiums, Benefits',
        content: 'Canadian nursing salaries come with significant additional benefits: Overtime at 1.5x or 2x hourly rate. Evening premium (+CAD 2/hour). Night shift premium (+CAD 3–4/hour). Weekend premium (+CAD 1.5–3/hour). Full health and dental benefits for you and family. Pension plan contributions (HOOPP in Ontario — very generous). Paid annual leave (15–25 days). Paid sick days.',
      },
      {
        heading: 'Cost of Living Adjustment',
        content: 'Canadian salaries are high, but cost of living is also significant. Rent in Toronto: CAD 2,000–2,800/month for a 1-bedroom. Vancouver is similar. Smaller cities like Ottawa, London, or Halifax offer better value — rent at CAD 1,200–1,800/month with comparable salaries. Many Indian nurses choose Ontario cities outside Toronto for better affordability.',
      },
      {
        heading: 'Tax and Take-Home Pay',
        content: 'An Ontario nurse earning CAD 80,000/year will pay approximately CAD 18,000–20,000 in federal and provincial income tax, leaving a net income of CAD 60,000–62,000/year or about CAD 5,000/month take-home. This converts to approximately ₹3.1L–3.2L per month after tax — significantly higher than most Indian markets.',
      },
    ],
    faqs: [
      { question: 'Which Canadian province pays nurses the most?', answer: 'Alberta consistently offers the highest nurse salaries in Canada, with hourly rates of CAD 36–52 and no provincial income tax. Ontario and British Columbia are close behind.' },
      { question: 'How long does it take to get a raise in Canada as a nurse?', answer: 'Most provinces have collective agreements with annual step increments. You receive automatic pay increases each year for the first 8–10 years until you reach the top of the pay grid.' },
      { question: 'Can I send money back to India from Canada?', answer: 'Yes. Most Indian nurses use Wise (formerly TransferWise) or bank wire transfers. With CAD 5,000 take-home monthly, many nurses remit CAD 1,500–2,500 while covering local expenses.' },
    ],
    relatedSlugs: ['canada-nclex-guide', 'express-entry-nurses'],
  },

  {
    slug: 'oet-for-nmc-uk',
    title: 'OET for UK NMC Registration — Complete Guide for Indian Nurses',
    metaDescription: 'OET requirements for NMC UK nursing registration. Minimum scores, preparation tips, and how OET compares to IELTS for UK nursing.',
    category: 'exam',
    country: 'United Kingdom',
    readingTimeMinutes: 8,
    intro: 'The Nursing and Midwifery Council (NMC) of the UK accepts OET as proof of English language proficiency for overseas nurses seeking UK registration. OET is often preferred over IELTS because it tests English in a healthcare context, making it more relevant for nursing practice.',
    keyFacts: [
      { label: 'Accepted By', value: 'NMC (Nursing and Midwifery Council) UK' },
      { label: 'Minimum Score', value: 'Grade B in all four sub-tests' },
      { label: 'Exam Fee', value: '~₹26,000 (varies by centre)' },
      { label: 'Validity', value: '2 years from test date' },
      { label: 'Test Centres in India', value: 'All major cities' },
      { label: 'Prep Time', value: '2–4 months' },
    ],
    sections: [
      {
        heading: 'NMC English Language Requirements',
        content: 'The NMC requires internationally educated nurses (IENs) to demonstrate English proficiency. Accepted tests are OET (Grade B in all sub-tests) or IELTS Academic (minimum 7.0 in each of Listening, Reading, Writing, Speaking, with an overall score of 7.0). Some nurses are exempt if they trained in a majority English-speaking country as defined by the NMC.',
      },
      {
        heading: 'Why Indian Nurses Choose OET Over IELTS for UK',
        content: 'OET is healthcare-specific: all reading passages, listening recordings, and writing tasks are based on clinical scenarios. For nurses with strong clinical English who struggle with academic IELTS texts, OET is significantly easier. The writing task (a referral/discharge letter) is a skill nurses use daily, unlike the abstract essays in IELTS Academic. Most Indian nurses who switch from IELTS to OET report passing in their first OET attempt.',
      },
      {
        heading: 'OET Score Requirements for NMC',
        content: 'The NMC requires a minimum Grade B in all four sub-tests: Listening, Reading, Writing, and Speaking. Grade B corresponds to a score of 350+ on the OET scale (200–500). A common failure point for Indian nurses is the Writing sub-test — referral letters must follow strict format and clinical precision. Speaking is scored on an interaction basis and requires confident, clear communication.',
      },
      {
        heading: 'Preparation Strategy for OET (NMC UK)',
        content: 'Recommended resources: (1) Official OET preparation materials from oet.com — practice papers, sample materials. (2) OET Writing Coach or Pocketbook for structured letter templates. (3) E2Language OET course (online, video-based). (4) Cambridge Boxhill Language Assessment OET practice tests. Key strategy: take a full-length mock test first to identify your weak sub-test. Most Indian nurses lose marks in Writing — practice one letter per day in the 4 weeks before your exam.',
      },
      {
        heading: 'Using OET Results in Your NMC Application',
        content: 'Once you receive your OET results (available online within 16 business days of the exam date), you can request that OET send your results directly to the NMC. Log into your OET account, select "Send results to professional body," and choose NMC from the list. There is a small fee for this service. The NMC will verify your scores directly with OET — do not send paper copies.',
      },
    ],
    faqs: [
      { question: 'Is OET harder than IELTS for nurses?', answer: 'OET is harder in structure but easier in content for nurses because all topics are clinical. Most nurses find the reading passages and listening recordings easier in OET because they relate to hospital scenarios they know well.' },
      { question: 'Can I use OET results from a previous test for NMC?', answer: 'OET results are valid for 2 years. If your results are within 2 years of your NMC application, they will be accepted.' },
      { question: 'Do I need OET before or after OSCE for NMC?', answer: 'English proficiency (OET or IELTS) is required as part of the NMC application, which must be completed before the Computer-Based Test (CBT) and OSCE. OET first, then CBT, then OSCE.' },
    ],
    relatedSlugs: ['uk-nmc-registration-guide', 'uk-nurse-salary-bands'],
  },

  {
    slug: 'berufsanerkennung-guide',
    title: 'Berufsanerkennung — German Nursing Recognition Guide for Indian Nurses',
    metaDescription: 'Step-by-step guide to the German nursing recognition process (Berufsanerkennung) for Indian nurses. Documents, timeline, and Anpassungslehrgang explained.',
    category: 'registration',
    country: 'Germany',
    readingTimeMinutes: 12,
    intro: 'Berufsanerkennung is the German professional recognition process that verifies whether an Indian nursing qualification is equivalent to the German nursing standard (Pflegefachmann/Pflegefachfrau). It is the most important — and often most confusing — step in the German nursing migration process.',
    keyFacts: [
      { label: 'Process Name', value: 'Berufsanerkennung (Professional Recognition)' },
      { label: 'Approving Authority', value: 'State-level Bezirksregierung or Landesamt' },
      { label: 'Timeline', value: '3–12 months depending on state' },
      { label: 'Language Required', value: 'German B2 (Goethe or TestDaF)' },
      { label: 'Outcome', value: 'Full recognition or Anpassungslehrgang required' },
      { label: 'Cost', value: '€200–600 for assessment + €400–1000 for translation' },
    ],
    sections: [
      {
        heading: 'What is Berufsanerkennung?',
        content: 'Berufsanerkennung (literally "professional recognition") is the formal comparison of your Indian nursing qualification against the German standard. The relevant state authority assesses your training curriculum, hours, and clinical experience. The possible outcomes are: (1) Full recognition — your qualification is considered equivalent. (2) Partial recognition requiring an Anpassungslehrgang (adaptation course) or a Kenntnisprüfung (knowledge exam). In practice, most Indian B.Sc. Nursing graduates receive full recognition or minor deficiency notices.',
      },
      {
        heading: 'Which State Authority Handles Berufsanerkennung?',
        content: 'Germany\'s recognition process is handled at the state (Bundesland) level, not federally. The authority varies by state: Bavaria — Landesamt für Gesundheit und Lebensmittelsicherheit (LGL). North Rhine-Westphalia — Bezirksregierung Münster or Düsseldorf. Baden-Württemberg — Regierungspräsidium Stuttgart. Berlin — Landesamt für Gesundheit und Soziales (LAGeSo). Many Indian nurses apply through their employer\'s state, as hospitals often guide the process.',
      },
      {
        heading: 'Required Documents for Berufsanerkennung',
        content: 'The standard document list: (1) Application form (from state authority website). (2) Nursing degree certificate (B.Sc. or GNM certificate). (3) Transcript of marks with detailed curriculum/syllabus. (4) Indian Nursing Council (INC) registration certificate. (5) State Nursing Council registration. (6) Experience certificate from employer. (7) Passport copy. (8) Passport-size photos. (9) All documents must be officially translated into German by a certified translator (vereidigter Übersetzer).',
      },
      {
        heading: 'Anpassungslehrgang — Adaptation Course',
        content: 'If the authority finds subject deficiencies in your qualification, they issue a Defizitbescheid (deficiency notice) specifying the missing competencies. You must then complete an Anpassungslehrgang — a supervised practical course in a German hospital, typically 3–6 months. During the Anpassungslehrgang, you work as a Pflegehilfskraft (nursing assistant) and are supervised. Upon successful completion, full recognition is granted. Most employers support their Indian nurses through this process.',
      },
      {
        heading: 'Timeline — Realistic Expectations',
        content: 'Document preparation in India: 1–2 months. Document translation and apostille: 1–2 months. Submission to state authority: Immediate. Authority review period: 3–9 months (varies significantly by state — Bayern is faster, NRW can be slower during peak periods). If Anpassungslehrgang required: add 3–6 months. Total realistic timeline from initial document preparation to full recognition: 8–18 months.',
      },
    ],
    faqs: [
      { question: 'Can I work in Germany before recognition is complete?', answer: 'Yes — with a Berufserlaubnis (provisional license). This allows you to work under supervision while your Berufsanerkennung is pending. Most German hospitals arrange this for their recruited Indian nurses.' },
      { question: 'Do I need German B2 for Berufsanerkennung?', answer: 'German B2 or higher is required for full professional recognition in most states. Some states process the recognition application with B1 but require B2 before issuing the final recognition certificate.' },
      { question: 'Which Indian nursing qualifications are accepted in Germany?', answer: 'B.Sc. Nursing (4-year) is fully accepted in all German states. GNM (3-year diploma) may require additional competency assessment in some states. Post-basic B.Sc. Nursing is also accepted.' },
    ],
    relatedSlugs: ['german-b2-for-nurses', 'germany-nurse-salary-guide'],
  },

  {
    slug: 'express-entry-nurses',
    title: 'Express Entry for Nurses — Canada PR Guide for Indian Nurses 2025',
    metaDescription: 'How Indian nurses can get Canadian PR through Express Entry. CRS score requirements, NOC codes for nurses, and fastest pathways explained.',
    category: 'visa',
    country: 'Canada',
    readingTimeMinutes: 9,
    intro: 'Express Entry is Canada\'s points-based immigration system for skilled workers. Registered Nurses have strong prospects under Express Entry because nursing is classified as a priority occupation, often receiving targeted invitations through Provincial Nominee Programs (PNPs) that boost CRS scores.',
    keyFacts: [
      { label: 'NOC Code for RN', value: 'NOC 31301 (Registered Nurses)' },
      { label: 'Express Entry Stream', value: 'Federal Skilled Worker (FSW) or CEC' },
      { label: 'Minimum CRS Score', value: 'Typically 470–520 for draws' },
      { label: 'Processing Time', value: '6 months after ITA' },
      { label: 'Language Requirement', value: 'IELTS CLB 7+ or French equivalent' },
      { label: 'Work Experience Required', value: '1 year in the past 10 years' },
    ],
    sections: [
      {
        heading: 'Express Entry Pathways for Nurses',
        content: 'Indian nurses can enter the Express Entry pool through three programs: (1) Federal Skilled Worker (FSW) — requires 1 year of full-time skilled work experience, minimum CLB 7 in English, and secondary education. (2) Canadian Experience Class (CEC) — requires 1 year of Canadian skilled work experience. Most Indian nurses who enter Canada on a work permit first pursue CEC after gaining 1 year of Canadian experience. (3) Provincial Nominee Program (PNP) — provinces with healthcare shortages (Alberta, Nova Scotia, Ontario) actively target nurses in their streams.',
      },
      {
        heading: 'CRS Score Calculation for Nurses',
        content: 'Your CRS (Comprehensive Ranking System) score is based on: Core human capital factors (age, education, language, Canadian experience): up to 500 points. Spouse factors: up to 40 points. Skill transferability: up to 100 points. Additional factors (PNP nomination): 600 points. A 25-year-old nurse with a B.Sc., IELTS CLB 9, and 1 year of Canadian experience can expect approximately 430–470 CRS points, which may be below cut-off for general FSW draws but competitive for healthcare-specific PNP streams.',
      },
      {
        heading: 'Provincial Nominee Programs (PNPs) for Nurses',
        content: 'Several provinces actively target nurses: Nova Scotia — Nurses stream under NSNP with no CRS minimum requirement, directly nominated. Alberta — AISH stream for healthcare workers. Ontario — OINP Tech draws sometimes include healthcare. British Columbia — BC PNP has a healthcare worker pathway. A provincial nomination adds 600 points to your CRS score, virtually guaranteeing an ITA in the next draw. For Indian nurses, getting a job offer in a province with a nursing PNP is the fastest path to Canadian PR.',
      },
      {
        heading: 'Steps to Canadian PR for Nurses',
        content: '1. Pass NCLEX-RN and register with a provincial nursing body. 2. Get a Canadian work permit (typically employer-sponsored LMIA or PGWP). 3. Work in Canada for 1 year to qualify for CEC. 4. Create Express Entry profile and enter the pool. 5. Apply through province-specific PNP or wait for federal draw. 6. Receive ITA (Invitation to Apply) and submit PR application. 7. Receive Permanent Residence within 6 months of ITA. The entire process from landing in Canada on a work permit to receiving PR typically takes 2–3 years.',
      },
    ],
    faqs: [
      { question: 'Can I apply for Express Entry from India without Canadian experience?', answer: 'Yes — through the Federal Skilled Worker stream. However, CRS scores without Canadian experience are typically lower. Many Indian nurses find it faster to come on a work permit first, gain experience, then apply through CEC.' },
      { question: 'Do I need a job offer for Express Entry as a nurse?', answer: 'A job offer is not mandatory for Express Entry but adds 50–200 points to your CRS score depending on the NOC level. For nurses (NOC 31301 — TEER 1), a valid job offer adds 200 points.' },
      { question: 'Which provinces are easiest for nurses to get PR in Canada?', answer: 'Nova Scotia has the most nurse-friendly PNP stream with no CRS minimum. Alberta and British Columbia also have strong healthcare pathways. Ontario has the highest volume of nurse immigrants overall.' },
    ],
    relatedSlugs: ['canada-nclex-guide', 'canada-nurse-salary-guide'],
  },

  {
    slug: 'dubai-vs-germany-nursing',
    title: 'Dubai vs Germany Nursing — Which is Better for Indian Nurses?',
    metaDescription: 'Dubai vs Germany for Indian nurses in 2025. Salary comparison, visa process, language requirements, and long-term prospects compared.',
    category: 'comparison',
    country: 'UAE & Germany',
    readingTimeMinutes: 9,
    intro: 'Dubai and Germany are two very different destinations for Indian nurses — one offers quick visa processing and tax-free income, the other offers long-term settlement and higher career stability. The right choice depends entirely on your priorities.',
    keyFacts: [
      { label: 'Dubai Salary', value: 'AED 5,000–10,000/month (tax-free)' },
      { label: 'Germany Salary', value: '€3,500–5,200/month (after tax ~€2,500–3,800)' },
      { label: 'Dubai in INR', value: '~₹1.1L–2.2L/month' },
      { label: 'Germany in INR', value: '~₹2.3L–3.5L/month after tax' },
      { label: 'Dubai Language', value: 'English (no Arabic required)' },
      { label: 'Germany Language', value: 'German B2 mandatory' },
    ],
    sections: [
      {
        heading: 'Salary Comparison — Dubai vs Germany',
        content: 'Dubai offers tax-free salaries ranging from AED 5,000 to AED 10,000/month (₹1.1L–2.2L) depending on employer, specialisation, and experience. Private hospitals pay more than government facilities. Germany pays €3,500–5,200/month gross, but after German income tax and social insurance (approximately 35–40% deductions), take-home is €2,200–3,300/month (₹2.0L–3.0L). Germany wins on net salary, especially for senior nurses and specialists.',
      },
      {
        heading: 'Language Requirements',
        content: 'This is the biggest differentiator. Dubai requires only English — which most Indian nurses already have, making it far quicker to migrate. Germany requires German B2 certification (Goethe-Zertifikat or TestDaF), which typically takes 12–18 months of intensive study for nurses starting from A1. Language training is the single biggest time barrier to Germany migration.',
      },
      {
        heading: 'Visa Process and Timeline',
        content: 'Dubai: Employment visa processing is typically 4–8 weeks once you have a job offer. A DHA or MOH license is required (3–6 months). Realistic timeline from starting the process to working in Dubai: 6–9 months. Germany: The process involves language training (12–18 months), Berufsanerkennung (3–12 months), and visa processing (2–3 months). Realistic timeline: 18–30 months. Dubai is significantly faster for first migration.',
      },
      {
        heading: 'Long-term Settlement and PR',
        content: 'Germany offers permanent residency (Niederlassungserlaubnis) after 5 years of continuous residence, with a pathway to citizenship after 8 years. Germany also offers EU freedom of movement. Dubai/UAE does not offer permanent residency for nurses (long-term residency visas are available but not permanent settlement). If your goal is long-term migration and eventual citizenship, Germany is the clear winner.',
      },
      {
        heading: 'Quality of Life',
        content: 'Dubai offers a luxurious lifestyle, excellent malls and infrastructure, a large Indian community, and proximity to India (3-hour flight). However, work culture can be intense, contracts are employer-tied, and summers are extreme (45°C+). Germany offers a better work-life balance, strong nurses\' unions, 28–30 days paid annual leave, and a comprehensive social safety net. Both countries have high safety levels.',
      },
    ],
    faqs: [
      { question: 'Which is better for saving money — Dubai or Germany?', answer: 'Dubai has a tax-free salary, which helps in the short term. But Germany\'s higher gross salary means that for experienced nurses, take-home pay in Germany often exceeds Dubai, especially with pension contributions that you can partially access later.' },
      { question: 'Can family join in Dubai vs Germany?', answer: 'Both allow family joining. Germany requires proof of housing and sufficient income. Dubai requires the employer to approve family visa and minimum salary thresholds apply. Germany offers better social services (healthcare, schooling) for family members.' },
    ],
    relatedSlugs: ['germany-nurse-salary-guide', 'uae-nurse-salary-guide', 'uk-vs-germany-nursing'],
  },

  {
    slug: 'uk-nurse-salary-bands',
    title: 'UK NHS Nurse Salary Bands 2025 — Complete Guide for Indian Nurses',
    metaDescription: 'NHS nurse salary bands 2024/25 for Indian nurses. Band 5, 6, 7 pay scales, High Cost Area Supplement, London weighting, and take-home pay explained.',
    category: 'salary',
    country: 'United Kingdom',
    readingTimeMinutes: 8,
    intro: 'NHS nurse salaries in England are structured under the Agenda for Change (AfC) pay framework. Understanding the band system, pay points, and additional allowances is essential for Indian nurses planning UK migration. The 2024/25 AfC pay award increased salaries significantly.',
    keyFacts: [
      { label: 'Starting Band', value: 'Band 5 (newly registered RN)' },
      { label: 'Band 5 Range', value: '£28,407–£34,581/year' },
      { label: 'Band 6 Range', value: '£35,392–£42,618/year' },
      { label: 'Band 7 Range', value: '£43,742–£50,056/year' },
      { label: 'London Weighting', value: '+£5,132–6,469/year in London' },
      { label: 'Take-home (Band 5)', value: '~£1,850–2,000/month after tax' },
    ],
    sections: [
      {
        heading: 'NHS Band System Explained',
        content: 'The NHS Agenda for Change (AfC) pay framework has bands from 1 to 9. Registered Nurses start at Band 5. Within each band there are multiple pay points, and nurses progress through these points annually. Band 5: Staff Nurse — newly qualified or newly registered from overseas. Band 6: Senior Staff Nurse or Specialist Nurse — typically 2+ years UK experience or specialist skills. Band 7: Ward Manager, Advanced Nurse Practitioner, or Clinical Specialist. Most Indian nurses arrive at Band 5 and can progress to Band 6 within 2–3 years.',
      },
      {
        heading: '2024/25 AfC Pay Scales',
        content: 'Following the 2024 pay award: Band 5: £28,407 (entry) to £34,581 (top). Band 6: £35,392 to £42,618. Band 7: £43,742 to £50,056. Band 8a: £50,952 to £57,349. These are base salaries in England. Wales, Scotland, and Northern Ireland have slightly different pay scales under their own frameworks but broadly similar.',
      },
      {
        heading: 'High Cost Area Supplement (HCAS) — London',
        content: 'Nurses working in London and surrounding high-cost areas receive an additional High Cost Area Supplement: Inner London: 20% of salary (minimum £5,132, maximum £7,994). Outer London: 15% (minimum £3,699, maximum £5,132). Fringe: 5% (minimum £1,130, maximum £1,763). A Band 5 nurse in Inner London earns approximately £33,539 to £40,575/year — significantly more than outside London.',
      },
      {
        heading: 'Unsocial Hours and Overtime',
        content: 'NHS nurses are paid enhanced rates for unsocial hours: Saturday: time and one third (1.33x). Sunday/Public Holiday: time and two thirds (1.67x). Weeknight (8pm–6am): time and one third (1.33x). Many nurses working full rotational shifts earn significantly more than their base band through unsocial hours payments. A Band 5 nurse working regular weekends and nights can earn £32,000–36,000 annually through base + unsocial hours alone.',
      },
      {
        heading: 'Take-Home Pay After UK Tax',
        content: 'A Band 5 nurse earning £28,407: NHS Pension contribution ~7.1% = £2,017. National Insurance ~8% = £2,273. Income Tax (20% above £12,570 allowance) = ~£3,167. Take-home: approximately £21,000–22,000/year, or £1,750–1,850/month. In London with HCAS (earning ~£34,000): take-home approximately £2,200–2,400/month. This is after all deductions including pension, which you receive back upon leaving the NHS or retirement.',
      },
    ],
    faqs: [
      { question: 'Do Indian nurses start at Band 5 in the UK?', answer: 'Yes. All internationally trained nurses (IENs) start at Band 5 (the entry-level registered nurse band) upon initial NMC registration, regardless of experience in India. However, some specialised nurses with ICU/theatre experience may be placed higher within Band 5 or be considered for Band 6 after demonstrating competency.' },
      { question: 'Can I negotiate salary at Band 5 as an Indian nurse?', answer: 'NHS pay bands are fixed and non-negotiable. However, you can negotiate start point within the band if you have relevant experience. The standard starting point is the bottom of Band 5, but some Trusts may offer Band 5 mid-range entry.' },
      { question: 'How long does it take to reach Band 6 from Band 5?', answer: 'Typically 2–3 years with good performance and completed competencies. Many Indian nurses who demonstrate strong clinical skills and work ethic move to Band 6 within 2 years.' },
    ],
    relatedSlugs: ['uk-nmc-registration-guide', 'oet-for-nmc-uk', 'uk-vs-germany-nursing'],
  },

  {
    slug: 'uk-nmc-registration-guide',
    title: 'UK NMC Registration Guide for Indian Nurses 2025',
    metaDescription: 'Step-by-step NMC UK registration process for Indian nurses. CBT, OSCE, English test, documents, and fees explained with realistic timelines.',
    category: 'registration',
    country: 'United Kingdom',
    readingTimeMinutes: 11,
    intro: 'NMC (Nursing and Midwifery Council) registration is the gateway to working as a nurse in the UK. The process for Indian nurses involves English language testing, a Computer-Based Test (CBT), an Objective Structured Clinical Examination (OSCE), and document verification. The full process typically takes 12–24 months from start to finish.',
    keyFacts: [
      { label: 'Regulatory Body', value: 'NMC — Nursing and Midwifery Council' },
      { label: 'Initial Application Fee', value: '£140' },
      { label: 'CBT Fee', value: '£83 per attempt' },
      { label: 'OSCE Fee', value: '£794 per attempt' },
      { label: 'Annual Registration Renewal', value: '£120/year' },
      { label: 'Total Timeline', value: '12–24 months' },
    ],
    sections: [
      {
        heading: 'NMC Registration — Overview of Steps',
        content: 'The NMC registration process for Indian nurses follows this sequence: (1) Create NMC Online account and submit application with documents. (2) Pass English language test (OET Grade B or IELTS 7.0 in all bands). (3) NMC reviews your application and issues a decision (may request additional information). (4) Pass the Computer-Based Test (CBT). (5) Arrive in UK and pass the OSCE (Objective Structured Clinical Examination). (6) Receive NMC PIN (registration number) and begin working.',
      },
      {
        heading: 'Step 1 — NMC Application and Documents',
        content: 'Required documents: Passport. Nursing degree certificate. Official transcripts. Proof of current nursing registration (state nursing council + INC). Character reference (from current employer). Occupational health declaration. Police clearance certificate (from India). Criminal record check from all countries lived in for 12+ months in past 5 years. The NMC verifies your documents directly with the Indian Nursing Council and your training institution — this verification process can take 3–6 months.',
      },
      {
        heading: 'Step 2 — English Language Test (OET or IELTS)',
        content: 'OET: Grade B in all four sub-tests (Listening, Reading, Writing, Speaking). IELTS Academic: minimum 7.0 in each band with overall 7.0. OET is recommended for nurses (healthcare-specific). Tests must be completed within 2 years of your NMC application decision. Results must be sent directly from OET/IELTS to the NMC — the NMC does not accept certificates handed in by applicants.',
      },
      {
        heading: 'Step 3 — Computer-Based Test (CBT)',
        content: 'The CBT is a 120-question multiple choice test covering nursing knowledge, NMC Code, and clinical decision-making. It is administered by Pearson VUE and can be taken in India at Pearson VUE centres. The pass mark is around 60–65%. The NMC provides a candidate preparation guide. Most Indian nurses pass the CBT on first attempt with 4–6 weeks of preparation using past papers and the NMC Code.',
      },
      {
        heading: 'Step 4 — OSCE (Objective Structured Clinical Examination)',
        content: 'The OSCE is a practical clinical exam taken at NHS Trust venues in the UK. It consists of 8 stations covering clinical skills such as: medication administration, venepuncture, catheterisation, wound care, communication and handover, and clinical assessment. OSCE can only be taken in the UK — you must travel to the UK for this stage, typically arriving on a Skilled Worker visa arranged by your NHS employer. The OSCE takes approximately 3–4 hours. Preparation: most employers provide OSCE preparation training.',
      },
      {
        heading: 'UK Visa — Coming for OSCE',
        content: 'Most Indian nurses come to the UK on a Skilled Worker visa sponsored by an NHS Trust who recruits them for a Band 5 nursing role. The Trust arranges OSCE preparation and supports the registration process. Some nurses arrange OSCE themselves as international visitors, but employer sponsorship is far easier and covers OSCE costs in most cases. The NHS conducts significant international recruitment drives targeting Indian nurses.',
      },
    ],
    faqs: [
      { question: 'How long does NMC registration take for Indian nurses?', answer: 'The typical timeline is 12–24 months. Document verification: 3–6 months. CBT preparation and exam: 1–3 months. OSCE: arranged by UK employer after arrival. Many Indian nurses through NHS recruitment have a structured timeline managed by the Trust.' },
      { question: 'What happens if I fail the OSCE?', answer: 'You have up to 3 attempts at the OSCE. After 3 failed attempts, you would need to apply for a new test of competence, which involves a different process. Most nurses pass within 2 attempts.' },
      { question: 'Can I start working in the UK before NMC registration is complete?', answer: 'No. You must have a valid NMC PIN before working as a registered nurse in the UK. You may work as a Healthcare Assistant (HCA) while awaiting NMC registration, which many nurses do to gain UK experience and earn an income during OSCE preparation.' },
    ],
    relatedSlugs: ['oet-for-nmc-uk', 'uk-nurse-salary-bands'],
  },

  {
    // Distinct from the dedicated /exam/dha-exam-guide page's slug/title —
    // both existed identically, a duplicate-content risk (two indexable
    // URLs competing for the same keyword). This guide is the narrative
    // walkthrough; the exam page is the canonical structured reference.
    slug: 'dha-exam-application-guide',
    title: 'How to Apply for the DHA Exam — Step-by-Step Guide for Indian Nurses',
    metaDescription: 'Complete DHA exam guide for Indian nurses. Eligibility, syllabus, registration process, fees, and tips to pass DHA nursing exam for Dubai.',
    category: 'exam',
    country: 'UAE (Dubai)',
    readingTimeMinutes: 9,
    intro: 'The DHA (Dubai Health Authority) exam is the mandatory licensing examination for nurses wanting to work in Dubai\'s healthcare sector. Passing the DHA exam is required for all internationally trained nurses, including those from India, before receiving a DHA license to practice.',
    keyFacts: [
      { label: 'Exam Body', value: 'Dubai Health Authority (DHA)' },
      { label: 'Exam Format', value: '150 MCQs (2.5 hours)' },
      { label: 'Pass Mark', value: '60–65%' },
      { label: 'Exam Fee', value: 'AED 1,020 (~₹23,000)' },
      { label: 'License Validity', value: '2 years (renewable)' },
      { label: 'Prep Time', value: '2–4 months' },
    ],
    sections: [
      {
        heading: 'What is the DHA Exam?',
        content: 'The DHA exam is a computer-based multiple choice examination that assesses clinical nursing knowledge and competency. It is mandatory for nurses applying for a DHA professional license to work in Dubai\'s government and private healthcare facilities. The exam is different from the MOH (Ministry of Health) exam, which covers the other six UAE emirates. Dubai falls exclusively under DHA jurisdiction.',
      },
      {
        heading: 'DHA Exam Eligibility for Indian Nurses',
        content: 'To apply for the DHA nursing exam: You must have a valid nursing degree (B.Sc. Nursing or GNM recognised by the Indian Nursing Council). Minimum 2 years of clinical experience post-qualification. Valid nursing registration (State Nursing Council and ideally INC). A job offer from a DHA-licensed healthcare facility is usually required to start the licensing process, though some nurses apply independently through the Sheryan portal.',
      },
      {
        heading: 'DHA Exam Registration Process',
        content: '1. Create an account on the DHA Sheryan portal (sheryan.dha.gov.ae). 2. Submit primary source verification (PSV) documents — your credentials are verified directly with your training institution and the Indian Nursing Council. 3. Pay the exam fee (AED 1,020). 4. Schedule your exam at a Prometric test centre — available in India (Mumbai, Delhi, Chennai, Hyderabad, Bangalore, Kochi). 5. Take the exam and receive results immediately. 6. Upon passing, submit employment confirmation and receive DHA license.',
      },
      {
        heading: 'DHA Exam Syllabus for Nurses',
        content: 'The DHA nursing exam covers: Medical-Surgical Nursing (25–30%), Fundamentals of Nursing and Basic Nursing Skills (20%), Critical Care and Emergency Nursing (15%), Obstetrics and Gynaecology (10%), Paediatric Nursing (10%), Community and Mental Health Nursing (10%), Pharmacology and Medication Management (10%). The questions are MCQ format — choose the best answer from 4 options. Questions test applied clinical knowledge, not just theory.',
      },
      {
        heading: 'How to Prepare for DHA Exam',
        content: 'Top preparation resources: (1) DHA Practice Questions on Prometric website. (2) Mosby\'s Comprehensive Review of Nursing for NCLEX-RN — excellent for MCQ practice. (3) DHA nursing exam preparation apps (available on Google Play/App Store). (4) YouTube channels specific to DHA exam preparation. (5) Study groups on Telegram/WhatsApp with nurses preparing for DHA. Focus on: medication administration, patient safety, infection control, and clinical decision-making — these are heavily tested. Take at least 500–700 practice MCQs before your exam date.',
      },
    ],
    faqs: [
      { question: 'Can I give DHA exam in India?', answer: 'Yes. DHA exams are conducted at Prometric test centres in multiple Indian cities including Mumbai, Delhi, Chennai, Hyderabad, Bangalore, and Kochi. You do not need to travel to Dubai for the exam.' },
      { question: 'What is the difference between DHA and MOH exam?', answer: 'DHA covers Dubai, MOH (Ministry of Health) covers the other 6 UAE emirates. HAAD (now DoH) covers Abu Dhabi. If you plan to work in Dubai, you need DHA. If you want to work anywhere in UAE, MOH is most flexible.' },
      { question: 'How many attempts are allowed for DHA exam?', answer: 'There is no official limit on DHA exam attempts. However, after multiple failures, DHA may require additional documentation or a cooling-off period.' },
    ],
    relatedSlugs: ['uae-nurse-salary-guide', 'dubai-vs-germany-nursing'],
  },

  {
    slug: 'german-b2-for-nurses',
    title: 'German B2 Language Exam for Nurses — Complete Preparation Guide',
    metaDescription: 'How Indian nurses can pass German B2 (Goethe B2 or telc B2) for nursing in Germany. Exam format, preparation timeline, and fachsprachliche Prüfung explained.',
    category: 'language',
    country: 'Germany',
    readingTimeMinutes: 10,
    intro: 'German B2 is the mandatory language level for nursing recognition and working as a registered nurse (Pflegefachmann/Pflegefachfrau) in Germany. Most Indian nurses take 12–18 months to reach B2 from scratch. Understanding which exam to take and how to prepare is critical.',
    keyFacts: [
      { label: 'Required Level', value: 'B2 (CEFR scale)' },
      { label: 'Accepted Exams', value: 'Goethe B2, telc Deutsch B2, TestDaF TDN 4' },
      { label: 'Prep Time (from zero)', value: '12–18 months intensive' },
      { label: 'Exam Fee', value: '₹15,000–25,000 depending on centre' },
      { label: 'Test Centres in India', value: 'All major cities (Goethe Institut)' },
      { label: 'Healthcare German Exam', value: 'Fachsprachliche Prüfung (FSP)' },
    ],
    sections: [
      {
        heading: 'Why B2 is Required for Nursing in Germany',
        content: 'German B2 is not just a bureaucratic requirement — nurses in Germany must communicate with patients, relatives, colleagues, and document care in German. The German healthcare system demands linguistic precision. B2 means you can understand complex texts and participate in detailed professional discussions. Some states require B2 for the Berufsanerkennung application itself; others require it for the full recognition certificate.',
      },
      {
        heading: 'Which German Exam to Take — Goethe vs telc vs TestDaF',
        content: 'Goethe-Zertifikat B2: Most widely accepted. Offered by Goethe Institut centres across India. Available year-round. Costs approximately ₹18,000–22,000. Four components: Reading, Writing, Listening, Speaking. telc Deutsch B2: Also widely accepted, particularly in NRW and Baden-Württemberg. Available through certified partners. TestDaF: University-focused, less commonly required for nursing recognition. Recommendation: Take Goethe B2 — it is universally accepted by all German state authorities for Berufsanerkennung.',
      },
      {
        heading: 'Fachsprachliche Prüfung (FSP) — Professional Language Exam',
        content: 'In addition to the general B2 exam, some German states (particularly Bavaria) require the Fachsprachliche Prüfung (FSP) — a professional healthcare German exam. The FSP tests nursing-specific language: patient anamnesis, handover documentation, medical terminology, and clinical communication. It is taken after B2 certification, usually in Germany, and is often arranged by the employer hospital. Indian nurses working in Bavaria will almost certainly need the FSP.',
      },
      {
        heading: 'German Language Learning Path for Indian Nurses',
        content: 'Phase 1 — A1 to A2 (2–3 months): Basic German. Learn with Duolingo, Babbel, and a textbook (Menschen A1, A2). Focus on basics. Phase 2 — B1 (3–4 months): More structured learning. Netzwerk or Schritte Plus B1 textbooks. Join a local Goethe Institut or certified German course. Phase 3 — B2 (4–6 months): Intensive preparation. B2 classes at certified institutes. Read German news (Deutsche Welle) and nursing texts in German. Phase 4 — Exam preparation (1–2 months): Mock exams, past papers, and targeted weak-point practice.',
      },
      {
        heading: 'Indian German Language Institutes for Nurses',
        content: 'Many institutes in Kerala, Tamil Nadu, and other states specifically offer German language courses tailored for nurses migrating to Germany. Major options: Goethe Institut (official, expensive, very good). Private language institutes offering intensive nursing German courses. Online platforms: Deutsche Welle (free), Deutsch Akademie (free), LanguageTransfer (free). Several agencies also bundle German language training with their Germany nursing recruitment packages — verify the quality of language training before signing with an agency.',
      },
    ],
    faqs: [
      { question: 'Can I learn German in 6 months to reach B2?', answer: 'It is extremely difficult to reach B2 in 6 months from zero. The Common European Framework estimates 600–750 hours of study for English speakers to reach B2. Intensive full-time learning can achieve this in 9–12 months, but most working nurses need 14–18 months.' },
      { question: 'Do I need to know German before coming to Germany?', answer: 'Most Germany-bound Indian nurses complete A1 to B1 in India and then continue B2 training either in India or Germany (through employer-sponsored programmes). Some employers allow arrival with B1 and provide in-house German training.' },
      { question: 'Is German B1 enough to work in Germany as a nurse?', answer: 'B1 may allow you to start work on a provisional license (Berufserlaubnis) in some states, but full recognition (Berufsanerkennung) and permanent work permit require B2 in most states.' },
    ],
    relatedSlugs: ['berufsanerkennung-guide', 'germany-nurse-salary-guide'],
  },

  {
    slug: 'uae-nurse-salary-guide',
    title: 'UAE Nurse Salary Guide 2025 — Dubai, Abu Dhabi & All Emirates',
    metaDescription: 'How much do nurses earn in UAE in 2025? Emirate-wise nurse salary data, tax-free income, free accommodation, and take-home pay for Indian nurses.',
    category: 'salary',
    country: 'UAE',
    readingTimeMinutes: 8,
    intro: 'The UAE offers tax-free nurse salaries with additional benefits like free or subsidised accommodation, flight allowances, and health insurance. For Indian nurses, UAE salaries can appear modest compared to Europe, but the tax-free nature and employer-provided benefits make the net financial package very attractive.',
    keyFacts: [
      { label: 'Dubai (Government)', value: 'AED 6,000–10,000/month' },
      { label: 'Dubai (Private)', value: 'AED 4,500–8,500/month' },
      { label: 'Abu Dhabi (SEHA)', value: 'AED 8,000–14,000/month' },
      { label: 'All Salaries', value: '100% tax-free' },
      { label: 'Additional Benefits', value: 'Accommodation + annual flight + health insurance' },
      { label: 'In INR (Dubai avg)', value: '~₹1.3L–2.2L/month' },
    ],
    sections: [
      {
        heading: 'Emirate-wise Salary Breakdown',
        content: 'Abu Dhabi (SEHA hospitals): AED 8,000–14,000/month — highest paying in UAE. The Department of Health (DoH/HAAD) exam is required. Dubai (DHA): Government hospitals (DHA-run) pay AED 6,000–10,000. Private hospitals: AED 4,500–8,500 depending on speciality and hospital tier. Sharjah, Ajman, RAK: AED 3,500–6,500/month — lower pay but still tax-free and often includes accommodation. Abu Dhabi consistently pays more than Dubai for equivalent roles.',
      },
      {
        heading: 'Salary by Specialisation in UAE',
        content: 'ICU/CCU Nurses: AED 8,000–12,000/month. OR (Operating Room): AED 7,500–11,000. Emergency Department: AED 7,000–10,500. General Ward: AED 5,000–8,000. Paediatrics: AED 6,000–9,000. Maternity/NICU: AED 6,500–9,500. Specialised nurses (ICU, CCU, OR) command significantly higher salaries in UAE. Highlighting ICU experience is important when negotiating UAE nursing packages.',
      },
      {
        heading: 'Benefits Package — Beyond the Salary',
        content: 'UAE nursing packages typically include: Free accommodation (shared or single room, varies by employer). Annual return flight to India (or equivalent allowance). Health insurance for yourself (some extend to family). End of Service Gratuity: 21 days salary for first 5 years, 30 days per year after (payable on end of contract). Annual leave: 30 days. Most reputable UAE hospitals provide all of the above. Always verify benefits in writing before signing a contract.',
      },
      {
        heading: 'Effective Take-Home and Savings',
        content: 'A nurse earning AED 7,000/month in Dubai with free accommodation: No tax deductions. Estimated monthly expenses: food (~AED 800), transport (~AED 400), personal (AED 500), phone/internet (AED 100). Monthly savings potential: AED 5,000–5,500 (~₹1.1L–1.2L/month). Over 2 years, this equates to approximately ₹26L–29L in savings — significant for Indian families. The UAE is particularly attractive for nurses whose primary goal is financial savings over a defined contract period.',
      },
    ],
    faqs: [
      { question: 'Which UAE emirate pays nurses the most?', answer: 'Abu Dhabi (SEHA/DOH) consistently pays the highest nurse salaries in UAE. Abu Dhabi government hospitals pay AED 8,000–14,000/month, significantly more than Dubai equivalents.' },
      { question: 'Is UAE a good long-term option for Indian nurses?', answer: 'UAE is excellent for a 2–5 year financial goal. Long-term settlement is not available for nurses (no permanent residency pathway). Many Indian nurses use UAE to save money and then migrate to Europe, Canada, or Australia for long-term settlement.' },
      { question: 'What is the visa process for nurses in UAE?', answer: 'Your UAE employer sponsors your employment visa. Once you pass DHA/MOH/DOH exam and receive your professional license, the employer processes your work and residence visa. The entire process typically takes 4–8 weeks after job offer.' },
    ],
    relatedSlugs: ['dha-exam-application-guide', 'dubai-vs-germany-nursing'],
  },

  {
    slug: 'oet-vs-ielts-germany',
    title: 'OET vs IELTS for Germany Nursing — Which Should Indian Nurses Take?',
    metaDescription: 'OET vs IELTS comparison for Indian nurses going to Germany. Which test does Germany accept? Key differences, difficulty levels, and recommendation.',
    category: 'exam',
    country: 'Germany',
    readingTimeMinutes: 7,
    intro: 'Germany does NOT require OET or IELTS for nursing registration. Germany requires German language proficiency (B2 level). This guide clarifies the confusion and explains when OET or IELTS might still be relevant for Germany-bound nurses.',
    keyFacts: [
      { label: 'Germany Language Requirement', value: 'German B2 (not OET/IELTS)' },
      { label: 'OET Accepted in Germany?', value: 'No — not required for Berufsanerkennung' },
      { label: 'IELTS Accepted in Germany?', value: 'No — not required for nursing license' },
      { label: 'When OET Matters for Germany', value: 'Only if applying to UK/Australia/NZ as well' },
      { label: 'German Language Exam', value: 'Goethe B2 or telc B2' },
      { label: 'Common Confusion', value: 'Agencies sometimes mispresent requirements' },
    ],
    sections: [
      {
        heading: 'The Confusion — Why Indian Nurses Ask About OET/IELTS for Germany',
        content: 'The confusion arises because: (1) Some recruitment agencies market OET courses to Germany-bound nurses incorrectly. (2) Nurses who initially considered UK or Australia (which require OET/IELTS) later switched to Germany without updating their research. (3) Some articles conflate requirements across destinations. The reality is straightforward: Germany requires German B2, not English proficiency, for nursing recognition and licensing.',
      },
      {
        heading: 'What Germany Actually Requires',
        content: 'For nursing recognition (Berufsanerkennung) in Germany: German language at B2 level — proven by Goethe-Zertifikat B2, telc Deutsch B2, or equivalent. This replaces any English language requirement. Germany does not test or care about your English language proficiency for the nursing license. What matters is German, and only German.',
      },
      {
        heading: 'When Might OET Be Useful for a Germany-Bound Nurse?',
        content: 'OET (or IELTS) may be relevant if: (1) You are applying to multiple destinations simultaneously — UK, Australia, or Canada alongside Germany. OET/IELTS results for those countries are separate from Germany requirements. (2) Your German employer or German hospital has English-speaking departments or requires communication in English with international colleagues — but this is not a licensing requirement. (3) You are considering switching destination later.',
      },
      {
        heading: 'OET vs IELTS — The Comparison for Other Destinations',
        content: 'For nurses going to UK or Australia (not Germany): OET is healthcare-specific and generally easier for nurses because all content is clinical. IELTS Academic tests general and academic English — more abstract. Both are equally accepted by NMC UK and AHPRA Australia. OET Writing (referral letters) is more relevant to nursing practice than IELTS Writing (essays). Most nurses who switch from IELTS to OET report higher success rates. If you are going to UK or Australia, choose OET.',
      },
      {
        heading: 'Advice for German-Route Nurses — Focus on German Only',
        content: 'If Germany is your target: Do not waste time and money on OET or IELTS. Put all your energy into German language — enroll in German A1 immediately and aim for B2 in 14–18 months. Learn Fachsprache (nursing vocabulary in German) alongside general B2 preparation. Your exam sequence for Germany is: Goethe B2 → Berufsanerkennung → Visa. Not OET.',
      },
    ],
    faqs: [
      { question: 'My agency said I need OET for Germany — is that correct?', answer: 'No. Germany does not require OET or IELTS for nursing registration. If an agency is selling you OET courses for Germany, question their motives. The requirement is German B2 (Goethe or telc), not English proficiency.' },
      { question: 'I passed OET for UK but now want to go to Germany — do I need to start German from scratch?', answer: 'Yes, you must learn German regardless of OET results. OET has no relevance to German nursing registration. Start with A1 German and work towards B2 as your primary goal for Germany.' },
    ],
    relatedSlugs: ['german-b2-for-nurses', 'berufsanerkennung-guide', 'oet-for-nmc-uk'],
  },

  {
    slug: 'ahpra-registration-india',
    title: 'AHPRA Registration for Indian Nurses — Australia 2025 Guide',
    metaDescription: 'How Indian nurses can register with AHPRA for Australian nursing. Eligibility, documents, English requirements, skills assessment, and processing timeline.',
    category: 'registration',
    country: 'Australia',
    readingTimeMinutes: 10,
    intro: 'AHPRA (Australian Health Practitioner Regulation Agency) manages nursing registration in Australia through the Nursing and Midwifery Board of Australia (NMBA). Indian nurses must complete a qualification assessment, English language test, and provide supporting documentation before receiving Australian nursing registration.',
    keyFacts: [
      { label: 'Regulatory Body', value: 'AHPRA / NMBA (Nursing and Midwifery Board of Australia)' },
      { label: 'Application Fee', value: 'AUD 155 assessment + AUD 178 registration' },
      { label: 'English Requirement', value: 'OET Grade B or IELTS 7.0 all bands' },
      { label: 'Supervised Practice', value: 'May be required depending on assessment outcome' },
      { label: 'Processing Time', value: '4–12 months' },
      { label: 'Registration Type', value: 'General registration (same as Australian-trained nurses)' },
    ],
    sections: [
      {
        heading: 'AHPRA vs NCLEX — How Australia Differs from Canada/USA',
        content: 'Australia does not require a licensing exam like NCLEX-RN. Instead, AHPRA/NMBA conducts a qualification assessment to determine if your Indian nursing degree is equivalent to Australian standards. If assessed as equivalent, you receive general registration directly. If not, you may be asked to complete a period of supervised practice in Australia. This makes Australia\'s pathway different — and sometimes easier — than Canada\'s NCLEX-based system.',
      },
      {
        heading: 'Eligibility for AHPRA — Indian Nurse Requirements',
        content: 'You are eligible to apply for AHPRA registration if you: Hold a nursing degree from a recognised Indian institution (B.Sc. Nursing, M.Sc. Nursing, or GNM in some cases). Are currently registered with the Indian Nursing Council (INC) and/or State Nursing Council. Have no significant criminal history or professional conduct issues. Can demonstrate English proficiency. AHPRA assesses B.Sc. Nursing (4-year) very favourably. GNM (3-year diploma) is assessed on a case-by-case basis and sometimes requires supervised practice.',
      },
      {
        heading: 'Documents Required for AHPRA Application',
        content: 'The AHPRA application requires: Completed online application form. Certified copy of passport. Official transcripts (unit outlines, marks, clinical hours). Nursing degree certificate. Current registration certificate (INC and/or state council). Certificate of currency of registration. Two character/professional references. English language test results (OET or IELTS). All documents not in English require certified translation by a NAATI-certified translator.',
      },
      {
        heading: 'English Language Requirement for AHPRA',
        content: 'AHPRA accepts: OET: Grade B in all four sub-tests (Listening, Reading, Writing, Speaking). IELTS Academic: minimum 7.0 in each band, overall 7.0. TOEFL iBT: minimum 94 overall with specific sub-scores. PTE Academic: minimum 65 in each communicative skill. Tests must be taken within 3 years of the AHPRA application. OET is recommended for nurses — results are valid for 2 years from test date.',
      },
      {
        heading: 'AHPRA Assessment Outcomes and Supervised Practice',
        content: 'Possible outcomes from AHPRA assessment: (1) General registration — your qualification is assessed as substantially equivalent. You can work as a registered nurse immediately. (2) Supervised practice required — typically 3–6 months under supervision at an Australian facility. This is often required for GNM graduates or those with significant gaps in clinical experience. Most Indian B.Sc. Nursing graduates with recent clinical experience receive general registration directly.',
      },
      {
        heading: 'Australian Visa for Nurses',
        content: 'Common visa pathways for Indian nurses: Skilled Independent visa (subclass 189) — requires occupation on the skilled occupation list (RN is listed). Skilled Nominated visa (subclass 190) — state/territory nominates you. Employer-sponsored visa (subclass 482 TSS). Nursing is on the Short-term and Medium-long term Strategic Skills List (MLTSSL), making Australian PR accessible through points-based visas. Nurses with AHPRA registration and points score can obtain Australian PR through SkillSelect.',
      },
    ],
    faqs: [
      { question: 'Is Australia or UK easier to migrate to as an Indian nurse?', answer: 'Both have similar English requirements (OET Grade B). UK NMC registration requires CBT and OSCE exams; AHPRA does not require a licensing exam. However, UK processing can be faster with NHS employer support. Australia is often better for long-term settlement due to PR pathways.' },
      { question: 'Can I apply for AHPRA from India?', answer: 'Yes. The entire AHPRA application is done online. You submit documents online and receive results in India. The supervised practice component (if required) would need to be done in Australia.' },
      { question: 'How long does AHPRA registration take?', answer: 'AHPRA states 4–8 weeks processing time, but complex cases or incomplete documents can take 6–12 months. Starting the application early is essential as visa applications typically require AHPRA registration or approval in principle.' },
    ],
    relatedSlugs: ['australia-nurse-salary-2025', 'australia-vs-canada-nursing'],
  },

  {
    slug: 'germany-nurse-salary-guide',
    title: 'Germany Nurse Salary 2025 — Complete Guide for Indian Nurses',
    metaDescription: 'How much do nurses earn in Germany in 2025? TVöD salary tables, state comparison, net take-home pay, and benefits for Indian nurses explained.',
    category: 'salary',
    country: 'Germany',
    readingTimeMinutes: 9,
    intro: 'Germany is one of the highest-paying countries for nurses in Europe. Salaries are governed by collective agreements — primarily TVöD (Tarifvertrag öffentlicher Dienst) for public hospitals. Indian nurses in Germany typically earn between €3,200 and €5,500/month gross, translating to approximately ₹1.8L–3.1L/month after tax.',
    keyFacts: [
      { label: 'Starting Salary (Pflegefachmann)', value: '€3,200–3,800/month gross (TVöD P7/P8)' },
      { label: 'With 5 Years Experience', value: '€3,800–4,500/month gross' },
      { label: 'ICU/Specialist Bonus', value: '+€200–600/month' },
      { label: 'Net Take-Home (approx)', value: '€2,200–3,200/month' },
      { label: 'In INR (net)', value: '~₹2.0L–3.0L/month' },
      { label: 'Annual Holiday', value: '28–30 days paid leave' },
    ],
    sections: [
      {
        heading: 'TVöD Nursing Pay Scale — P Groups Explained',
        content: 'Most German public hospital nurses are paid under TVöD-P (Pflege — nursing). The relevant pay groups are: P7: Entry-level nursing assistant / newly qualified nurses during Berufsanerkennung process. P8: Fully recognised Pflegefachmann/Pflegefachfrau (typically where Indian nurses land after recognition). P9: Senior nurses with specialisation or team leadership. P13/P14: Nursing leadership. P8 entry level (Stufe 1): approximately €3,400/month gross. After 3 years in P8, nurses move to Stufe 2 (~€3,700), and so on. Pay increments happen automatically with service years.',
      },
      {
        heading: 'State-wise Salary Differences',
        content: 'German nurse salaries vary by hospital type and state: Bavaria (München): typically highest — major university hospitals pay up to €4,500–5,200 gross for senior nurses. North Rhine-Westphalia (NRW): strong base — €3,400–4,200 gross. Berlin: slightly lower base but high cost of living. Baden-Württemberg (Stuttgart, Freiburg): good salaries, popular with Indian nurses. Eastern Germany states: slightly lower salaries but lower cost of living. Recommendation: aim for Bavaria or Baden-Württemberg for best overall package.',
      },
      {
        heading: 'Net Salary After German Tax and Deductions',
        content: 'Germany has significant tax and social insurance deductions: Income tax: 14–42% (progressive). Church tax: 8–9% of income tax (only if registered in a church — most Indian nurses deregister). Pension insurance: 9.3% employee contribution. Health insurance: 7.3% + extra 1.3% average. Unemployment insurance: 1.2%. Nursing care insurance: 1.7–2.3%. Total deductions: approximately 35–40% of gross salary. Example: €3,500 gross → approximately €2,300–2,400 net. €4,000 gross → approximately €2,600–2,700 net.',
      },
      {
        heading: 'Additional Earnings — Overtime, Night Shifts, Specialist Premiums',
        content: 'German nurses earn more through: Night shift supplement: €1.28/hour (TVöD). Sunday supplement: 25% of hourly rate. Public holiday: 35% of hourly rate. Specialist allowance (ICU, Oncology, Operating Theatre): €46–184/month additional. On-call duty (Bereitschaftsdienst): additional payment depending on frequency. Christmas bonus (Weihnachtsgeld): approximately half a month\'s salary. A nurse working regular night shifts can add €300–500/month to their base salary.',
      },
      {
        heading: 'Cost of Living vs Salary in Germany',
        content: 'Germany\'s cost of living is high but manageable on a nursing salary: Rent (1-bedroom): €800–1,400/month in major cities. Munich and Frankfurt are most expensive. Groceries and food: €300–500/month. Transport: €80–120/month (monthly pass). Most Indian nurses in Germany manage to save €500–800/month net after all expenses in mid-tier cities. Many employers provide subsidised staff accommodation, which significantly improves savings potential.',
      },
    ],
    faqs: [
      { question: 'How does German nurse salary compare to India?', answer: 'Indian hospital nurse salaries range from ₹20,000–60,000/month in most states. A German nurse take-home of €2,300/month (₹2.1L/month) is 3–10x higher, making Germany extremely financially attractive despite higher living costs.' },
      { question: 'Do Indian nurses in Germany get pension benefits?', answer: 'Yes. Germany has a statutory pension system (Deutsche Rentenversicherung). Contributions are made during your working years and you receive a German pension on retirement. If you leave Germany before retirement, you can claim contributions back under certain conditions.' },
      { question: 'Is overtime mandatory in German hospitals?', answer: 'Not legally, but nursing shortages mean overtime is common. All overtime must be compensated either in pay or time off (Freizeitausgleich) under German labour law. You cannot be compelled to work excessive overtime without compensation.' },
    ],
    relatedSlugs: ['berufsanerkennung-guide', 'german-b2-for-nurses', 'dubai-vs-germany-nursing'],
  },

  {
    slug: 'australia-nurse-salary-2025',
    title: 'Australia Nurse Salary 2025 — State-wise Guide for Indian Nurses',
    metaDescription: 'How much do nurses earn in Australia in 2025? State nursing award rates, penalty rates, overtime, and take-home pay for Indian nurses. Updated for 2025.',
    category: 'salary',
    country: 'Australia',
    readingTimeMinutes: 8,
    intro: 'Australia offers some of the highest nurse salaries in the world, governed by state-based enterprise agreements and the Nurses Award. Registered nurses earn between AUD 65,000 and AUD 95,000 per year, with significant additional income from penalty rates for weekends, nights, and public holidays.',
    keyFacts: [
      { label: 'Starting RN Salary', value: 'AUD 65,000–72,000/year' },
      { label: 'Experienced RN (5+ years)', value: 'AUD 80,000–95,000/year' },
      { label: 'In INR', value: '~₹37L–55L/year gross' },
      { label: 'Best-Paying State', value: 'Western Australia, ACT, Victoria' },
      { label: 'Public Holiday Rate', value: '2.5x base hourly rate' },
      { label: 'Annual Leave', value: '4 weeks + 10 days personal leave' },
    ],
    sections: [
      {
        heading: 'State-wise RN Salary Comparison',
        content: 'New South Wales (NSW): AUD 69,000–92,000/year. Victoria (VIC): AUD 67,000–90,000/year. Queensland (QLD): AUD 65,000–88,000/year. Western Australia (WA): AUD 73,000–98,000/year — highest base rates. South Australia (SA): AUD 63,000–85,000/year. ACT: AUD 75,000–100,000/year. Tasmania: AUD 60,000–80,000/year. Western Australia and ACT consistently pay the highest base nurse salaries in Australia.',
      },
      {
        heading: 'Penalty Rates — Significant Additional Income',
        content: 'Australian nursing penalty rates are among the most generous in the world: Saturday: 1.5x base rate. Sunday: 2.0x base rate. Public Holiday: 2.5x base rate. Night shift (variable): 1.15–1.3x base rate. A nurse working two weekend shifts per fortnight can earn an extra AUD 800–1,500/month over their base salary. Many nurses specifically seek weekend shifts to maximise income.',
      },
      {
        heading: 'Public vs Private Hospital Salary',
        content: 'Public (Government) hospitals pay under state nursing awards — rates above apply. They offer excellent penalty rates, job security, and strong superannuation. Private hospitals may pay slightly less base but often offer other benefits. Agency nursing (casual pool): AUD 45–65/hour — highest hourly rates but no guaranteed shifts, no annual leave loading, no sick pay. Many experienced Indian nurses do agency shifts on top of their permanent hospital role to boost income.',
      },
      {
        heading: 'Net Take-Home Pay — Australian Tax',
        content: 'An Australian nurse earning AUD 80,000/year: Income tax: approximately AUD 18,500. Medicare Levy: AUD 1,600. Net salary: approximately AUD 59,900/year or AUD 4,992/month. Superannuation (11% employer contribution): AUD 8,800/year (this is additional — paid by employer on top of salary, not deducted). Australia\'s superannuation system is a significant benefit — it grows as an investment fund and is accessible at retirement.',
      },
      {
        heading: 'Cost of Living in Australia for Indian Nurses',
        content: 'Cost of living is high, particularly in Sydney and Melbourne. Rent (1-bedroom): AUD 2,000–2,800/month in Sydney; AUD 1,600–2,200 in Melbourne; significantly lower in regional areas. Many Indian nurses starting in Australia choose regional hospitals (with higher pay incentives and lower cost of living) before moving to major cities. Regional incentives include visa pathway advantages for PR applications.',
      },
    ],
    faqs: [
      { question: 'Do Indian nurses need a car in Australia?', answer: 'Yes, in most cases. Unlike UK cities, Australian hospitals are often not well-served by public transport. A car is practically necessary for shift work. Budget AUD 300–500/month for a reliable used car with insurance and fuel.' },
      { question: 'How does Australia compare to Canada for nurse salaries?', answer: 'Base salaries are comparable — both average around AUD/CAD 80,000/year. Australia\'s penalty rates are significantly more generous, meaning nurses who work weekends can earn substantially more. Canada wins on cold-weather lifestyle and proximity to the US.' },
      { question: 'Can nurses get PR in Australia easily?', answer: 'Yes. Nursing (ANZSCO 2544) is on Australia\'s MLTSSL, qualifying for PR through points-based visas. Most registered nurses with AHPRA registration, OET/IELTS, and 3+ years experience can accumulate sufficient points (65+) for PR through SkillSelect.' },
    ],
    relatedSlugs: ['ahpra-registration-india', 'australia-vs-canada-nursing'],
  },

  {
    slug: 'uk-vs-germany-nursing',
    title: 'UK vs Germany Nursing — Which is Better for Indian Nurses 2025?',
    metaDescription: 'UK vs Germany for Indian nurses — salary comparison, visa speed, language requirements, PR pathway, and which destination is better for your goals.',
    category: 'comparison',
    country: 'UK & Germany',
    readingTimeMinutes: 10,
    intro: 'UK and Germany are the two most chosen European destinations for Indian nurses. Both are excellent options but suit different priorities. UK is faster and English-speaking; Germany offers better long-term settlement and career stability. This guide breaks down every dimension so you can make the right decision.',
    keyFacts: [
      { label: 'UK Salary', value: '£28,407–42,618/year (NHS Bands 5–6)' },
      { label: 'Germany Salary', value: '€3,400–4,500/month gross' },
      { label: 'UK Language', value: 'English (OET or IELTS)' },
      { label: 'Germany Language', value: 'German B2 (14–18 months learning)' },
      { label: 'UK Timeline', value: '12–18 months to start working' },
      { label: 'Germany Timeline', value: '18–30 months to start working' },
    ],
    sections: [
      {
        heading: 'Language Requirement — The Biggest Difference',
        content: 'UK: Requires OET Grade B or IELTS 7.0. Most Indian nurses with strong English can prepare in 2–4 months. No new language to learn. Germany: Requires German B2 — a completely new language for most Indian nurses. Learning takes 14–18 months from scratch with full-time study, or 20–24 months part-time. This single factor makes UK significantly faster to migrate to and explains why more Indian nurses choose UK initially.',
      },
      {
        heading: 'Salary Comparison — Net Take-Home',
        content: 'UK Band 5 in London (with HCAS): ~£34,000/year gross → approximately £2,200–2,400/month net. UK Band 6: ~£38,000–42,000/year gross → approximately £2,500–2,800/month net. Germany P8 (fully recognised nurse): €3,400–4,000/month gross → approximately €2,300–2,700/month net (₹2.1L–2.5L). Germany net salary is comparable to UK Band 5/6 net salary at current exchange rates. However, Germany has stronger job security and annual increment structure.',
      },
      {
        heading: 'Registration Process — UK NMC vs Germany Berufsanerkennung',
        content: 'UK NMC: OET/IELTS → Document submission → NMC verification (3–6 months) → CBT exam → OSCE in UK. Total: 12–18 months from start to working. Germany: German B2 (12–18 months) → Document translation → Berufsanerkennung application (3–12 months) → Visa. Total: 18–30 months from start to working. Both processes require significant upfront investment in exams and document preparation. UK is faster due to English language advantage for Indian nurses.',
      },
      {
        heading: 'Long-term Settlement — PR and Citizenship',
        content: 'UK Indefinite Leave to Remain (ILR): After 5 years on Skilled Worker visa. British citizenship available 1 year after ILR (6 years total). Brexit has made EU freedom of movement no longer applicable from the UK. Germany Niederlassungserlaubnis (permanent residency): After 5 years. German citizenship: After 8 years (reduced to 5 years with exceptional integration). Germany then provides EU citizenship — you can work and live across all 27 EU member states. For Indian nurses wanting EU-wide mobility, Germany is substantially better.',
      },
      {
        heading: 'Working Conditions and Quality of Life',
        content: 'UK NHS: Strong union (RCN). Good pension (NHS Pension Scheme — one of the best in the world). NHS has staff shortages affecting workload. Recent NHS strikes indicate systemic pressure on nurses. Germany: Highly regulated working hours (maximum 48 hours/week by law). Very strong trade unions. 28–30 days annual leave. Germany generally has lower nurse-to-patient ratios than UK hospitals. Both countries score similarly on general quality of life, but Germany\'s social safety net is stronger.',
      },
    ],
    faqs: [
      { question: 'Should I start with UK and then move to Germany?', answer: 'A common strategy: go to UK first (faster, English-speaking, save money), learn German while working in UK, then move to Germany after 2–3 years. This gives you UK experience, English fluency, and a financial base to fund German language training and the transition.' },
      { question: 'Which country has more Indian nurses — UK or Germany?', answer: 'UK has by far the largest Indian nurse community in Europe. There are estimated 50,000+ Indian nurses in UK NHS. Germany has a growing Indian nursing community, particularly in Bayern and NRW, but the number is much smaller — approximately 5,000–10,000.' },
      { question: 'Is the UK or Germany better for family migration?', answer: 'Both allow family visas. UK: family dependants can work freely. Germany: family members can work but the process can be slower. Germany offers better public healthcare, free schooling, and childcare support. For families with children, Germany\'s social infrastructure is arguably superior.' },
    ],
    relatedSlugs: ['uk-nmc-registration-guide', 'uk-nurse-salary-bands', 'germany-nurse-salary-guide', 'berufsanerkennung-guide'],
  },

  {
    slug: 'australia-vs-canada-nursing',
    title: 'Australia vs Canada Nursing — Which is Better for Indian Nurses 2025?',
    metaDescription: 'Australia vs Canada for Indian nurses — AHPRA vs NCLEX, salary comparison, PR pathway, weather, and which destination suits you best.',
    category: 'comparison',
    country: 'Australia & Canada',
    readingTimeMinutes: 9,
    intro: 'Australia and Canada are both excellent long-term migration destinations for Indian nurses, offering high salaries, PR pathways, and large Indian communities. The right choice depends on your clinical background, language test preference, and lifestyle priorities.',
    keyFacts: [
      { label: 'Australia Salary', value: 'AUD 65,000–95,000/year' },
      { label: 'Canada Salary', value: 'CAD 65,000–95,000/year' },
      { label: 'Australia Licensing', value: 'AHPRA (no exam — qualification assessment)' },
      { label: 'Canada Licensing', value: 'NCLEX-RN (mandatory exam)' },
      { label: 'Both PR Pathways', value: 'Points-based immigration — both good' },
      { label: 'Australia Climate', value: 'Warm/hot (suits most Indians)' },
    ],
    sections: [
      {
        heading: 'Licensing Process — AHPRA vs NCLEX',
        content: 'This is the biggest practical difference. Australia (AHPRA): No licensing exam. AHPRA assesses your Indian qualification and if equivalent, grants direct registration. Most B.Sc. Nursing graduates get registration without any clinical exam. Faster if your credentials are in order. Canada (NCLEX-RN): Mandatory exam. 75–145 adaptive MCQ questions. Requires 3–6 months dedicated preparation. Pass rates for Indian nurses on first attempt: 60–70%. This exam is the primary hurdle for Canada-bound nurses. If you want to avoid a high-stakes exam, Australia is easier to enter.',
      },
      {
        heading: 'Salary and Take-Home Pay',
        content: 'Base salaries are very similar — both average CAD/AUD 75,000–85,000/year for mid-experience registered nurses. Key differences: Australia\'s penalty rates for weekends and public holidays are among the highest in the world (up to 2.5x on public holidays). Canadian nurses have strong union-negotiated increments and excellent pension plans (HOOPP in Ontario). Net take-home is similar: approximately CAD/AUD 4,800–5,500/month for mid-experience nurses after tax.',
      },
      {
        heading: 'PR and Immigration Pathways',
        content: 'Australia: Skilled Independent Visa (189), Skilled Nominated (190), or Employer Sponsored (482). Nursing is on the MLTSSL — one of the most immigration-friendly occupations. Points-based — age, IELTS, experience all factor in. Most nurses can score 65–80 points. Canada: Express Entry (FSW or CEC), PNP (Provincial Nominee Program). Nova Scotia has a specific nurses stream with no CRS minimum. Ontario, Alberta, and BC have healthcare worker pathways. Both countries offer realistic PR timelines of 2–4 years after initial arrival.',
      },
      {
        heading: 'Cost of Living and Lifestyle',
        content: 'Australia: Cost of living is high, particularly Sydney and Melbourne. Climate is warm — very appealing for most Indians. Large Indian community particularly in Melbourne, Sydney, and Brisbane. Canada: Climate is extreme — winters are very harsh (especially in Ontario, Alberta). However, Indian community is enormous and well-established. Vancouver has milder climate but is extremely expensive. Most Indian nurses prefer Australia\'s climate, while Canada\'s proximity to the US and established Indian communities are draws.',
      },
      {
        heading: 'Which Should You Choose?',
        content: 'Choose Australia if: You want to avoid NCLEX exam. You prefer warm weather. You can pass OET/IELTS and have 3+ years B.Sc. Nursing experience. You want to work in large cities near the beach. Choose Canada if: You are comfortable with NCLEX-RN preparation. You have family/community already in Canada. You prefer the North American lifestyle. You are interested in moving to USA later (Canadian nursing experience is valued). You target specific provinces with strong Indian communities (Ontario, BC).',
      },
    ],
    faqs: [
      { question: 'Which is easier for Indian nurses — Australia or Canada?', answer: 'Australia is generally easier to enter because AHPRA does not require a licensing exam. Canada requires NCLEX-RN which is a significant examination hurdle. However, once in Canada, the overall career pathway is equally strong.' },
      { question: 'Can I use OET for both Australia and Canada?', answer: 'OET is accepted by AHPRA (Australia) but not by all Canadian provinces for NCLEX eligibility or nursing registration. Most Canadian provinces accept IELTS. Check specific provincial requirements for Canada.' },
      { question: 'Do both Australia and Canada allow family immigration?', answer: 'Yes. Both countries have well-established family immigration pathways. Canada\'s family reunification process is considered slightly faster. Both allow dependent spouses to work with an open work permit.' },
    ],
    relatedSlugs: ['ahpra-registration-india', 'australia-nurse-salary-2025', 'canada-nclex-guide', 'canada-nurse-salary-guide'],
  },
]

export function getAllGuides(): GuideData[] {
  return GUIDES
}

export function getGuide(slug: string): GuideData | undefined {
  return GUIDES.find((g) => g.slug === slug)
}

export function getAllGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug)
}
