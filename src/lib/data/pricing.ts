import type { PricingPageData } from '@/types/pricingDetail'

const SHARED_HIDDEN_CHARGES = {
  retake: {
    title: 'Exam Retake Fees',
    description: 'Agency fee is quoted as "including OET" but covers only one attempt. Each retake costs ₹25,000 and is billed separately — never mentioned in the initial quote.',
    typicalAmount: '₹25,000 per retake',
    severity: 'warning' as const,
    howToAvoid: 'Explicitly ask: "How many exam attempts does your fee cover?" Get this in writing before signing.',
  },
  courier: {
    title: 'Document Courier Charges',
    description: 'Apostilled documents need to be physically couriered to the destination country\'s nursing board or embassy. Agencies often exclude this from the quoted fee.',
    typicalAmount: '₹8,000–₹18,000',
    severity: 'warning' as const,
    howToAvoid: 'Ask for a fully itemized quote including all courier and shipping expenses.',
  },
  accommodation: {
    title: 'Accommodation Search Fees',
    description: 'Some agencies charge ₹30,000–₹60,000 as a "housing search fee" to help you find accommodation at destination — a service that reputable agencies provide free as part of their post-placement support.',
    typicalAmount: '₹30,000–₹60,000',
    severity: 'critical' as const,
    howToAvoid: 'Verify whether post-placement support (including accommodation guidance) is included. This should not be a paid add-on.',
  },
  vague: {
    title: 'Vague "Processing" or "Service" Fees',
    description: 'Charges labeled as "processing fees," "file management fees," or "service continuation charges" with no clear explanation of what services they cover. These are often pretexts for extracting additional money mid-process.',
    typicalAmount: '₹20,000–₹50,000',
    severity: 'critical' as const,
    howToAvoid: 'Refuse to pay any charge that cannot be explained with a specific service description. Legitimate costs always have documentation.',
  },
}

const GERMANY: PricingPageData = {
  countrySlug: 'germany',
  countryName: 'Germany',
  flag: '🇩🇪',

  totalMin: 542000,
  totalMax: 944000,
  totalTypical: 720000,
  transparencyStatement: 'Germany migration costs are dominated by agency fees and German language training. Language (B2) adds 8–14 months and ₹70,000–₹1.5L that most agencies do not mention in their headline fee.',
  lastUpdated: 'May 2026',

  costLineItems: [
    { label: 'Agency Fee', category: 'agency', min: 350000, max: 550000, notes: 'End-to-end service: employer matching, Berufsanerkennung support, visa filing', optional: false },
    { label: 'OET Coaching + Exam (2 attempts)', category: 'exam', min: 40000, max: 70000, notes: 'Coaching 3–4 months + 2 exam sittings at ₹25,000 each', optional: false },
    { label: 'German B2 Coaching + Goethe Exam (2 attempts)', category: 'language', min: 70000, max: 150000, notes: 'A1 to B2 — typically 12 months at ₹5,000–₹12,000/month + exam fees', optional: false },
    { label: 'Credential Recognition (Berufsanerkennung)', category: 'documentation', min: 15000, max: 25000, notes: 'State nursing board application fee + supporting documents', optional: false },
    { label: 'Apostille + Notarization', category: 'documentation', min: 20000, max: 40000, notes: 'All Indian documents (degree, registration, experience letters) apostilled', optional: false },
    { label: 'German Skilled Worker Visa', category: 'visa', min: 14000, max: 14000, notes: 'Fixed consulate fee (€75) — no variation', optional: false },
    { label: 'VFS Global + Biometrics + Medical Test', category: 'visa', min: 7500, max: 12000, notes: 'VFS service charge + blood tests + chest X-ray', optional: false },
    { label: 'Economy Flight (India → Germany)', category: 'travel', min: 55000, max: 90000, notes: 'Varies by departure city and booking timing', optional: false },
    { label: 'First Month Accommodation + Deposit', category: 'setup', min: 60000, max: 120000, notes: '2 months rent upfront common in Germany. Employer may partially support.', optional: false },
    { label: 'Setup Costs (SIM, transport, essentials)', category: 'setup', min: 10000, max: 20000, notes: 'German SIM, monthly public transport pass, initial groceries and supplies', optional: false },
  ],

  agencyComparison: [
    { slug: 'global-nursing-solutions', name: 'Global Nursing Solutions', feeMin: 350000, feeMax: 550000, installmentAvailable: true, installmentNote: '40% on signing, 60% post-visa', hiddenChargesReported: 0, transparencyScore: 91, includedServices: ['OET coaching (1 attempt)', 'Employer matching', 'Berufsanerkennung support', 'Visa filing', 'Pre-departure briefing'], trustLevel: 'verified', rating: 4.8 },
    { slug: 'medworld-overseas', name: 'Medworld Overseas', feeMin: 400000, feeMax: 600000, installmentAvailable: true, installmentNote: '35% upfront, balance on job offer', hiddenChargesReported: 0, transparencyScore: 88, includedServices: ['OET coaching (2 attempts)', 'Employer matching', 'German orientation support', 'Visa filing'], trustLevel: 'verified', rating: 4.6 },
    { slug: 'nursepath-international', name: 'NursePath International', feeMin: 350000, feeMax: 500000, installmentAvailable: false, hiddenChargesReported: 0, transparencyScore: 86, includedServices: ['Language guidance', 'Employer matching', 'Credential verification support', 'Visa application'], trustLevel: 'verified', rating: 4.7 },
    { slug: 'prime-nursing-abroad', name: 'Prime Nursing Abroad', feeMin: 300000, feeMax: 500000, installmentAvailable: true, hiddenChargesReported: 1, transparencyScore: 74, includedServices: ['Employer matching', 'Visa filing', 'Post-arrival support'], trustLevel: 'trusted', rating: 4.1 },
    { slug: 'skyline-healthcare-abroad', name: 'Skyline Healthcare Abroad', feeMin: 250000, feeMax: 400000, installmentAvailable: false, hiddenChargesReported: 4, transparencyScore: 52, includedServices: ['Employer matching', 'Basic document support'], trustLevel: 'unverified', rating: 3.6 },
  ],

  hiddenChargePatterns: [
    SHARED_HIDDEN_CHARGES.retake,
    {
      title: 'German Language Training Exclusion',
      description: 'The single most common hidden cost in Germany migration. Agency headline fee rarely includes German B2 coaching. A1 to B2 over 12 months at a coaching center costs ₹70,000–₹1.5L — more than the visa fee itself.',
      typicalAmount: '₹70,000–₹1,50,000',
      severity: 'critical',
      howToAvoid: 'Always ask: "Does your fee include German language coaching from A1 to B2?" If not, get a separate written estimate for this cost before comparing agencies.',
    },
    SHARED_HIDDEN_CHARGES.courier,
    {
      title: 'Adaptation Period Support Fees',
      description: 'When Berufsanerkennung results in partial recognition, you enter a supervised Anpassungsqualifikation (adaptation period) at the hospital. Some agencies charge ₹30,000–₹60,000 for "support" during this period — which should be basic communication assistance, not a paid service.',
      typicalAmount: '₹30,000–₹60,000',
      severity: 'warning',
      howToAvoid: 'Confirm in your agency contract what support is provided during the adaptation period and whether there are any charges for it.',
    },
    SHARED_HIDDEN_CHARGES.accommodation,
    SHARED_HIDDEN_CHARGES.vague,
  ],

  nurseCostExperiences: [
    {
      id: 'de-ce-1',
      authorName: 'Anitha Krishnan',
      authorInitials: 'AK',
      authorFrom: 'Thrissur, Kerala',
      date: 'Feb 2025',
      expectedCostINR: 500000,
      actualCostINR: 720000,
      biggestSurprise: 'German language training — nobody told me it would cost ₹1.1L for 12 months of classes plus ₹24,000 for two B2 attempts.',
      advice: 'Budget at least ₹1.2L specifically for German language before you even think about the agency fee. It\'s the real cost nobody tells you about.',
      quote: 'My agency quoted ₹4.5L "all-in." What they didn\'t mention: German classes weren\'t included. Spent ₹1.1L on A1–B2 coaching over 12 months, ₹24,000 on two Goethe attempts, and ₹35,000 on document apostille. Total came to ₹7.2L. Still worth it — earning €3,800/month now — but I wish someone had told me the real number upfront.',
      destinationCity: 'Munich',
      timelineMonths: 16,
      verified: true,
    },
    {
      id: 'de-ce-2',
      authorName: 'Saju Thomas',
      authorInitials: 'ST',
      authorFrom: 'Kottayam, Kerala',
      date: 'Nov 2024',
      expectedCostINR: 700000,
      actualCostINR: 850000,
      biggestSurprise: 'I failed B2 once (₹12,000 retake) and during the Anpassungsqualifikation there was a 6-week gap where I had no income — needed ₹80,000 savings to survive.',
      advice: 'Keep a ₹1L emergency buffer beyond your migration budget. The adaptation period gap is real — your Indian family expenses continue while you wait for full German registration.',
      quote: 'I thought I\'d budgeted perfectly at ₹7L. The B2 failure cost ₹12,000 extra. Then the adaptation period — my hospital paid me during it, thankfully, but there was a 6-week gap between arriving and the period starting where I had zero income. My agency didn\'t warn me. Keep ₹1L as pure emergency buffer.',
      destinationCity: 'Frankfurt',
      timelineMonths: 18,
      verified: true,
    },
    {
      id: 'de-ce-3',
      authorName: 'Meera Nair',
      authorInitials: 'MN',
      authorFrom: 'Kozhikode, Kerala',
      date: 'Aug 2024',
      expectedCostINR: 700000,
      actualCostINR: 680000,
      biggestSurprise: 'I actually came in under budget because my German employer reimbursed ₹60,000 of my flight and setup costs. Ask your employer about relocation allowances — many pay them.',
      advice: 'Research your target employer\'s relocation policy before signing with an agency. Government hospital groups often provide relocation support of €500–€1,500.',
      quote: 'I prepared well: 12 months of German, OET on first attempt, chose an agency that included 2 OET attempts in their fee. Total came to ₹6.8L — slightly under my ₹7L budget. My Munich hospital also reimbursed €700 for flights. Many nurses don\'t know to ask their employer for this.',
      destinationCity: 'Berlin',
      timelineMonths: 15,
      verified: true,
    },
  ],

  pricingTimeline: [
    {
      stageNumber: 1,
      stageName: 'Language Preparation',
      timingLabel: 'Month 1–12',
      description: 'The most time-intensive and often costliest phase that agencies understate. German B2 is mandatory — start immediately.',
      costs: [
        { label: 'German A1–B2 coaching (12 months)', range: '₹70,000–₹1,50,000', optional: false },
        { label: 'OET coaching (3–4 months)', range: '₹15,000–₹35,000', optional: false },
        { label: 'OET exam (1–2 attempts)', range: '₹25,000–₹50,000', optional: false },
        { label: 'Goethe B2 exam (1–2 attempts)', range: '₹12,000–₹24,000', optional: false },
      ],
      stageTotal: '₹1.2L–₹2.6L',
      paymentType: 'upfront',
      warning: 'Most agencies do not include German coaching in their fee. This stage cost must be budgeted separately before you even approach an agency.',
    },
    {
      stageNumber: 2,
      stageName: 'Agency Engagement & Documentation',
      timingLabel: 'Month 10–14',
      description: 'Sign with an agency after clearing B2. Initial fee payment and document preparation begin.',
      costs: [
        { label: 'Agency initial payment (30–50% of fee)', range: '₹1.0L–₹2.5L', optional: false },
        { label: 'Apostille + notarization of Indian documents', range: '₹20,000–₹40,000', optional: false },
        { label: 'Credential recognition fee (Berufsanerkennung)', range: '₹15,000–₹25,000', optional: false },
        { label: 'Document courier to German nursing board', range: '₹8,000–₹15,000', optional: false },
      ],
      stageTotal: '₹1.4L–₹3.3L',
      paymentType: 'installment',
    },
    {
      stageNumber: 3,
      stageName: 'Visa Application',
      timingLabel: 'Month 12–16',
      description: 'German consulate visa filing, biometrics, and medical fitness test. Remaining agency balance typically due here.',
      costs: [
        { label: 'Agency balance payment (50–70%)', range: '₹2.5L–₹4.5L', optional: false },
        { label: 'German Skilled Worker Visa fee', range: '₹14,000', optional: false },
        { label: 'VFS Global + biometrics', range: '₹3,500–₹5,000', optional: false },
        { label: 'Medical fitness test', range: '₹4,000–₹6,000', optional: false },
      ],
      stageTotal: '₹2.7L–₹4.8L',
      paymentType: 'installment',
      warning: 'Verify with your agency exactly when the balance payment is due — some collect before visa grant, others after. The former is higher risk.',
    },
    {
      stageNumber: 4,
      stageName: 'Pre-Departure',
      timingLabel: 'Month 15–17',
      description: 'Book flights, arrange initial accommodation, prepare essentials for arrival.',
      costs: [
        { label: 'Economy flight (India → Germany)', range: '₹55,000–₹90,000', optional: false },
        { label: 'Pre-departure medical and travel insurance', range: '₹5,000–₹8,000', optional: false },
      ],
      stageTotal: '₹60,000–₹98,000',
      paymentType: 'upfront',
    },
    {
      stageNumber: 5,
      stageName: 'Germany Arrival & Setup',
      timingLabel: 'Week 1–4 after landing',
      description: 'First-month costs in Germany. Your German salary begins within 2–4 weeks of starting work.',
      costs: [
        { label: 'First month rent + 2-month deposit', range: '₹60,000–₹1,20,000', optional: false },
        { label: 'Groceries and household setup', range: '₹15,000–₹30,000', optional: false },
        { label: 'German SIM + monthly transit pass', range: '₹5,000–₹8,000', optional: false },
        { label: 'Employer relocation allowance (if applicable)', range: '−₹40,000 to −₹90,000', optional: true },
      ],
      stageTotal: '₹80,000–₹1.6L',
      paymentType: 'post-arrival',
      warning: 'Ask your employer if they offer a relocation allowance (Umzugskostenpauschale). Many German hospital groups provide €500–€1,500 for international nurses.',
    },
  ],

  whatShouldBeIncluded: [
    'OET or IELTS coaching (minimum 1 exam attempt)',
    'German B2 coaching or clear written exclusion statement',
    'Employer matching and contract negotiation',
    'Berufsanerkennung (credential recognition) filing support',
    'German visa application preparation and filing',
    'Pre-departure orientation briefing',
    'Post-arrival support for minimum 30 days',
    'Emergency contact in India and Germany',
  ],

  redFlagPhrases: [
    '"We\'ll give you the full cost breakdown after you sign up and pay the registration fee"',
    '"Pay ₹50,000 now to secure your slot — refundable if we can\'t place you"',
    '"German B2 is not required if we process your case" — this is false',
    '"Guaranteed visa approval"',
    '"100% success rate for all applicants"',
    '"No need for written contract — we work on trust"',
    '"Our fee is all-inclusive" (without specifying what is included in writing)',
  ],

  questionsToAsk: [
    'What exactly is and is not included in your quoted fee? Please provide a written itemized list.',
    'How many OET or IELTS attempts does your fee cover?',
    'Does your fee include German B2 language coaching? If not, what is the separate estimate?',
    'What is your policy if my visa application is rejected?',
    'What is your policy if my Berufsanerkennung results in partial recognition?',
    'When exactly is the balance payment due — before or after visa grant?',
    'Can I speak with 3 nurses you placed in Germany in the last 12 months?',
    'Do you have a written agreement specifying all costs and services?',
  ],

  faqs: [
    {
      question: 'What is the real total cost of migrating to Germany as a nurse from India?',
      answer: 'The realistic total ranges from ₹5.4L to ₹9.4L, with most nurses spending ₹7L–₹7.5L. This includes agency fee (₹3.5L–₹5.5L), German B2 language training (₹70,000–₹1.5L — often excluded from agency quotes), OET coaching and exams (₹40,000–₹70,000), credential recognition fees (₹15,000–₹25,000), apostille and documentation (₹20,000–₹40,000), visa (₹14,000), and first-month Germany expenses (₹80,000–₹1.5L).',
    },
    {
      question: 'Why is the German language training cost not in most agency quotes?',
      answer: 'German language training (A1 to B2) typically costs ₹70,000–₹1.5L over 10–14 months of coaching, plus ₹12,000–₹24,000 for Goethe Institut exam fees. Most agencies exclude this because it happens before you formally sign with them — you\'re expected to have started learning German independently. However, reputable agencies will include this estimate in their total cost projection when you ask. If an agency won\'t tell you the German training cost, walk away.',
    },
    {
      question: 'Is the Berufsanerkennung fee included in agency fees?',
      answer: 'It varies by agency. Some include the Berufsanerkennung (credential recognition) application fee of approximately ₹15,000–₹25,000 in their service fee. Others list it as a government fee paid separately. Always clarify this in writing. The more important cost question is whether they support you through the entire Berufsanerkennung process — which can take 3–6 months — or just file the initial application.',
    },
    {
      question: 'Can I negotiate agency fees for Germany migration?',
      answer: 'Agency fees are somewhat negotiable, especially if you already have OET Grade B and German B2 (since you\'ve reduced their risk). You can legitimately negotiate on: number of exam attempts included, payment schedule (more flexibility on installments), post-placement support duration, and whether documentation costs are included. Avoid negotiating on core services like employer matching, Berufsanerkennung support, and visa filing — these need to be done properly.',
    },
    {
      question: 'Will my German employer pay any of my migration costs?',
      answer: 'Many German hospital groups and care facilities offer relocation support (Umzugskostenpauschale) of €500–€1,500 for international nurses. Some also reimburse part of the Berufsanerkennung fee. Ask your prospective employer directly before accepting the offer. Additionally, the German employer pays for your health and social insurance from day one — this is a significant benefit worth approximately €500–€700/month in value.',
    },
    {
      question: 'What payment schedule is normal for Germany agency fees?',
      answer: 'Reputable German migration agencies typically charge 30–50% on signing the service agreement, and the remaining 50–70% upon visa grant or arrival in Germany. Never pay 100% upfront. Some agencies now offer EMI/installment plans across 12–18 months at 0% interest for qualified applicants. Agencies demanding full payment before the visa application stage are a red flag.',
    },
  ],

  relatedCountrySlugs: ['uk', 'canada', 'australia'],
  relatedGuides: [
    { slug: 'germany-nurse-salary-guide', title: 'Germany Nurse Salary Guide 2025', description: 'What you\'ll earn after migration — TVöD pay scales, take-home after tax, and growth trajectory.', category: 'salary', readingTimeMinutes: 8 },
    { slug: 'german-b2-for-nurses', title: 'German B2 Language Exam Guide', description: 'How to prepare for the Goethe B2 exam — timeline, resources, coaching centers, costs.', category: 'exam', readingTimeMinutes: 11 },
    { slug: 'oet-vs-ielts-germany', title: 'OET vs IELTS — Which is Better for Germany?', description: 'Score requirements, difficulty comparison, and which to choose for your Germany nursing visa.', category: 'comparison', readingTimeMinutes: 6 },
    { slug: 'berufsanerkennung-guide', title: 'Berufsanerkennung Explained', description: 'Everything about the German credential recognition process — timeline, documents, partial recognition, and adaptation period.', category: 'process', readingTimeMinutes: 9 },
  ],
}

const UK: PricingPageData = {
  countrySlug: 'uk',
  countryName: 'United Kingdom',
  flag: '🇬🇧',

  totalMin: 400000,
  totalMax: 750000,
  totalTypical: 560000,
  transparencyStatement: 'UK migration is relatively straightforward in cost — no secondary language needed. The main variable is whether your NHS employer covers OSCE fees and relocation allowances, which can reduce total cost by ₹60,000–₹1L.',
  lastUpdated: 'May 2026',

  costLineItems: [
    { label: 'Agency Fee', category: 'agency', min: 300000, max: 500000, notes: 'NMC registration support, CBT coaching, employer matching, visa filing', optional: false },
    { label: 'OET Coaching + Exam (2 attempts)', category: 'exam', min: 40000, max: 70000, notes: 'OET preferred for NMC. Grade B required in all 4 components.', optional: false },
    { label: 'NMC CBT Exam', category: 'exam', min: 10000, max: 13000, notes: 'Fixed NMC fee at Pearson VUE — can be taken in India', optional: false },
    { label: 'NMC Application + Registration Fee', category: 'documentation', min: 10500, max: 12000, notes: 'NMC charges approx £115 for initial registration application', optional: false },
    { label: 'Primary Source Verification', category: 'documentation', min: 12000, max: 20000, notes: 'Verification of Indian nursing degree and registration through NMC-approved providers', optional: false },
    { label: 'Health & Care Worker Visa', category: 'visa', min: 30000, max: 40000, notes: 'Visa application fee varies by NHS vs private employer. NHS employers qualify for the reduced NHS surcharge.', optional: false },
    { label: 'VFS + Biometrics + TB Test', category: 'visa', min: 6000, max: 10000, notes: 'VFS service fee + tuberculosis test (mandatory for India)', optional: false },
    { label: 'Economy Flight (India → UK)', category: 'travel', min: 50000, max: 80000, notes: 'Varies by departure city. Kochi/Bangalore to London/Manchester.', optional: false },
    { label: 'OSCE Preparation + Exam', category: 'exam', min: 0, max: 70000, notes: 'Many NHS trusts cover OSCE fully. Private sector may charge. Verify before accepting offer.', optional: true },
    { label: 'First Month Accommodation + Deposit', category: 'setup', min: 55000, max: 120000, notes: 'London is significantly more expensive. Manchester, Birmingham, Leeds are 40–60% cheaper.', optional: false },
    { label: 'Setup Costs (SIM, Oyster, essentials)', category: 'setup', min: 10000, max: 20000, optional: false },
  ],

  agencyComparison: [
    { slug: 'global-nursing-solutions', name: 'Global Nursing Solutions', feeMin: 300000, feeMax: 500000, installmentAvailable: true, installmentNote: '40% on signing, 60% post-visa', hiddenChargesReported: 0, transparencyScore: 91, includedServices: ['OET coaching (1 attempt)', 'NMC CBT support', 'Employer matching', 'Health & Care Worker Visa'], trustLevel: 'verified', rating: 4.8 },
    { slug: 'nursepath-international', name: 'NursePath International', feeMin: 350000, feeMax: 500000, installmentAvailable: false, hiddenChargesReported: 0, transparencyScore: 86, includedServices: ['OET coaching (2 attempts)', 'NMC registration support', 'NHS employer matching', 'Visa filing'], trustLevel: 'verified', rating: 4.7 },
    { slug: 'medlink-solutions', name: 'MedLink Solutions', feeMin: 300000, feeMax: 450000, installmentAvailable: true, hiddenChargesReported: 0, transparencyScore: 82, includedServices: ['CBT coaching', 'Employer matching', 'Visa filing', '30-day post-arrival support'], trustLevel: 'trusted', rating: 4.3 },
    { slug: 'skyline-healthcare-abroad', name: 'Skyline Healthcare Abroad', feeMin: 200000, feeMax: 380000, installmentAvailable: false, hiddenChargesReported: 4, transparencyScore: 52, includedServices: ['Basic employer matching', 'Visa document support'], trustLevel: 'unverified', rating: 3.6 },
  ],

  hiddenChargePatterns: [
    SHARED_HIDDEN_CHARGES.retake,
    {
      title: 'NHS Surcharge Not Included in Agency Quote',
      description: 'The Immigration Health Surcharge (IHS) for a 3-year Health and Care Worker Visa is approximately £624 (₹66,000). Many agency quotes show only the visa fee (£247) and exclude the IHS surcharge. Always ask for the total immigration cost.',
      typicalAmount: '₹55,000–₹70,000',
      severity: 'warning',
      howToAvoid: 'Ask: "Does your quoted visa cost include the Immigration Health Surcharge (IHS)?" If not, add approximately ₹60,000 to the quoted visa cost.',
    },
    SHARED_HIDDEN_CHARGES.courier,
    {
      title: 'OSCE Fee Passed to Candidate',
      description: 'OSCE (Objective Structured Clinical Examination) conducted in the UK costs approximately £794 (₹84,000). Reputable NHS employers typically cover this — but some agencies place nurses at private hospitals or smaller trusts that charge OSCE fees to the candidate.',
      typicalAmount: '₹70,000–₹90,000',
      severity: 'critical',
      howToAvoid: 'Confirm with your specific employer whether they cover OSCE. Ask to see this in writing in your employment offer letter before accepting.',
    },
    SHARED_HIDDEN_CHARGES.vague,
  ],

  nurseCostExperiences: [
    {
      id: 'uk-ce-1',
      authorName: 'Priya Mathew',
      authorInitials: 'PM',
      authorFrom: 'Ernakulam, Kerala',
      date: 'Mar 2025',
      expectedCostINR: 500000,
      actualCostINR: 580000,
      biggestSurprise: 'The Immigration Health Surcharge — ₹66,000 that nobody mentioned in the initial agency quote.',
      advice: 'Always ask for the total visa cost including the IHS. It\'s not optional and can be ₹60,000–₹70,000 on top of the basic visa fee.',
      quote: 'My agency quoted visa costs at ₹35,000. What they didn\'t mention: the NHS surcharge of ₹66,000 on top. My OSCE was covered by my NHS trust. Overall spent ₹5.8L vs my ₹5L budget — manageable because my NHS trust paid me from day one and OSCE was done on company time.',
      destinationCity: 'London',
      timelineMonths: 10,
      verified: true,
    },
    {
      id: 'uk-ce-2',
      authorName: 'Binu George',
      authorInitials: 'BG',
      authorFrom: 'Palakkad, Kerala',
      date: 'Jan 2025',
      expectedCostINR: 550000,
      actualCostINR: 510000,
      biggestSurprise: 'My Manchester NHS trust gave me a ₹60,000 relocation allowance that my agency never mentioned was available. Research employer benefits before signing.',
      advice: 'Apply to NHS trusts outside London — same salary, 40% lower cost of living, and often more generous relocation support for international nurses.',
      quote: 'Chose Manchester over London based on advice from a friend. Cost of living difference is massive. NHS trust gave me £650 relocation support. Total spent ₹5.1L vs expected ₹5.5L. Passed OET first attempt — that saved ₹25,000 too. The CBT was straightforward with 6 weeks of focused prep.',
      destinationCity: 'Manchester',
      timelineMonths: 9,
      verified: true,
    },
  ],

  pricingTimeline: [
    { stageNumber: 1, stageName: 'OET / Language Preparation', timingLabel: 'Month 1–4', description: 'Clear OET first — the fastest path since English is already your working language.', costs: [{ label: 'OET coaching (2–3 months)', range: '₹15,000–₹35,000', optional: false }, { label: 'OET exam (1–2 attempts)', range: '₹25,000–₹50,000', optional: false }], stageTotal: '₹40,000–₹85,000', paymentType: 'upfront' },
    { stageNumber: 2, stageName: 'NMC CBT & Registration', timingLabel: 'Month 3–6', description: 'Apply to NMC and sit the CBT exam. This can overlap with OET preparation.', costs: [{ label: 'NMC CBT exam at Pearson VUE', range: '₹10,000–₹13,000', optional: false }, { label: 'NMC application and primary source verification', range: '₹22,000–₹32,000', optional: false }], stageTotal: '₹32,000–₹45,000', paymentType: 'upfront' },
    { stageNumber: 3, stageName: 'Agency Engagement & Job Offer', timingLabel: 'Month 4–7', description: 'Engage agency after CBT pass. Initial agency payment and employer matching.', costs: [{ label: 'Agency initial payment (40–50%)', range: '₹1.2L–₹2.5L', optional: false }, { label: 'Apostille and document authentication', range: '₹12,000–₹20,000', optional: false }], stageTotal: '₹1.3L–₹2.7L', paymentType: 'installment' },
    { stageNumber: 4, stageName: 'Visa & Pre-Departure', timingLabel: 'Month 7–10', description: 'Health and Care Worker Visa application, biometrics, and flight booking.', costs: [{ label: 'Agency balance payment', range: '₹1.8L–₹3.0L', optional: false }, { label: 'Health & Care Worker Visa + IHS surcharge', range: '₹90,000–₹1.1L', optional: false }, { label: 'TB test + VFS + biometrics', range: '₹6,000–₹10,000', optional: false }, { label: 'Economy flight to UK', range: '₹50,000–₹80,000', optional: false }], stageTotal: '₹3.4L–₹5.0L', paymentType: 'installment' },
    { stageNumber: 5, stageName: 'UK Arrival & OSCE', timingLabel: 'Week 1–4', description: 'Arrive, complete OSCE (usually employer-funded), begin working.', costs: [{ label: 'First month accommodation + deposit', range: '₹55,000–₹1.2L', optional: false }, { label: 'OSCE (if not covered by employer)', range: '₹70,000–₹90,000', optional: true }, { label: 'Setup and essentials', range: '₹10,000–₹20,000', optional: false }], stageTotal: '₹65,000–₹2.3L', paymentType: 'post-arrival', warning: 'Verify OSCE coverage in your employment offer before arriving. Many NHS trusts cover it fully.' },
  ],

  whatShouldBeIncluded: [
    'OET coaching (at minimum 1 exam attempt)',
    'NMC CBT preparation materials and guidance',
    'NMC application support and document verification',
    'NHS or private employer matching with certificate of sponsorship',
    'Health and Care Worker Visa application filing',
    'Pre-departure briefing specific to UK (NHS system, banking, registration)',
    'Minimum 30 days post-arrival support',
  ],

  redFlagPhrases: [
    '"We can get you NMC registration without OET or IELTS" — this is impossible under current NMC rules',
    '"Guaranteed NHS placement within 4 weeks"',
    '"Pay the full agency fee upfront to lock in your spot"',
    '"We have special connections inside the NHS" — no agency has this',
    '"No written contract needed"',
  ],

  questionsToAsk: [
    'Does your fee include the Immigration Health Surcharge (IHS) in the visa cost?',
    'Will my employer cover the OSCE fee? Can I see this confirmed in the employment offer?',
    'How many OET attempts does your fee include?',
    'What is your refund policy if my visa is rejected?',
    'Can I speak with nurses you placed at my specific NHS trust?',
    'What is the exact payment schedule — when is each installment due?',
  ],

  faqs: [
    { question: 'What is the total cost of UK nursing migration from India?', answer: 'The realistic total ranges from ₹4L to ₹7.5L with most nurses spending ₹5.5L–₹6L. This includes agency fee (₹3L–₹5L), OET coaching and exams (₹40,000–₹70,000), NMC registration (₹22,000–₹35,000), visa + IHS surcharge (₹90,000–₹1.1L), flight (₹50,000–₹80,000), and first-month UK expenses (₹65,000–₹1.4L). OSCE cost (₹70,000–₹90,000) is often covered by NHS employers.' },
    { question: 'Does the NHS pay for OSCE?', answer: 'Most NHS trusts cover the full OSCE cost (approximately £794) as part of their international nurse onboarding program. Some also pay nurses their full Band 5 salary from day one of employment, including during the OSCE preparation period. However, some private sector employers and smaller trusts charge OSCE fees to candidates. Always confirm OSCE cost coverage in writing in your employment offer letter before accepting.' },
    { question: 'What is the Immigration Health Surcharge and how much is it?', answer: 'The Immigration Health Surcharge (IHS) is a mandatory fee paid by migrants to access NHS healthcare in the UK. For a 3-year Health and Care Worker Visa, the IHS is approximately £624 (₹66,000). This is a government charge separate from the basic visa fee of £247 (₹26,000). Total immigration cost is approximately ₹92,000–₹1.1L including both. Many agencies quote only the visa fee in their initial summary — always ask for the total immigration cost including IHS.' },
    { question: 'Can I negotiate agency fees for UK nursing migration?', answer: 'Yes — UK migration has shorter timelines and lower risk for agencies (no language barrier, English exams only), so fees are somewhat negotiable. Negotiate on: number of OET attempts included, flexibility of payment schedule, post-placement support duration, and whether OSCE prep materials are included. Agencies should not charge extra for basic document collection or NMC CBT guidance.' },
    { question: 'Is London or other UK cities better for cost management?', answer: 'Manchester, Birmingham, Leeds, Sheffield, and Nottingham offer 30–50% lower living costs than London while paying similar NHS Band 5–6 salaries. Some NHS trusts in these cities also provide more generous relocation allowances (£500–£1,000). For Indian nurses prioritizing savings and financial recovery from migration costs, cities outside London are significantly better value.' },
  ],

  relatedCountrySlugs: ['germany', 'canada', 'australia'],
  relatedGuides: [
    { slug: 'uk-nmc-registration-guide', title: 'UK NMC Registration Complete Guide', description: 'CBT, OSCE, document verification, and NMC PIN — step by step.', category: 'process', readingTimeMinutes: 10 },
    { slug: 'uk-nurse-salary-bands', title: 'NHS Pay Bands for Indian Nurses (2025)', description: 'Band 5–7 salary breakdown, London weighting, and take-home pay after tax.', category: 'salary', readingTimeMinutes: 7 },
    { slug: 'oet-for-nmc-uk', title: 'OET Grade B — Complete Preparation Guide', description: 'How to pass OET for NMC registration — format, tips, and resources.', category: 'exam', readingTimeMinutes: 8 },
  ],
}

const CANADA: PricingPageData = {
  countrySlug: 'canada',
  countryName: 'Canada',
  flag: '🇨🇦',

  totalMin: 620000,
  totalMax: 1100000,
  totalTypical: 820000,
  transparencyStatement: 'Canada has higher immigration processing fees than UK or Germany and the highest relocation costs due to long-haul flights and expensive cities. However, the PR pathway and world-class quality of life make it the strongest long-term value proposition.',
  lastUpdated: 'May 2026',

  costLineItems: [
    { label: 'Agency Fee', category: 'agency', min: 400000, max: 600000, notes: 'NCLEX coaching, Express Entry profile, provincial registration, employer matching', optional: false },
    { label: 'IELTS General Training (2 attempts)', category: 'exam', min: 30000, max: 40000, notes: 'IELTS General Training version for Express Entry. Higher scores improve CRS ranking.', optional: false },
    { label: 'NCLEX-RN Exam', category: 'exam', min: 15000, max: 20000, notes: 'Pearson VUE exam — can be taken in India. Next Generation NCLEX format since 2023.', optional: false },
    { label: 'Provincial Nursing Registration', category: 'documentation', min: 12000, max: 20000, notes: 'CNO (Ontario), BCCNM (BC), CARNA (Alberta) etc. — province-specific fees', optional: false },
    { label: 'WES Credential Assessment', category: 'documentation', min: 16000, max: 22000, notes: 'World Education Services — evaluates Indian nursing degree equivalence for Express Entry', optional: false },
    { label: 'Express Entry / PR Application', category: 'visa', min: 20000, max: 30000, notes: 'Government processing fee for Permanent Residence application (CAD $850 principal + CAD $500 per dependent)', optional: false },
    { label: 'IRCC Medical Exam', category: 'visa', min: 10000, max: 15000, notes: 'Mandatory medical examination by IRCC-approved physician in India', optional: false },
    { label: 'Long-haul Flight (India → Canada)', category: 'travel', min: 70000, max: 130000, notes: 'Significantly higher than UK/Germany due to distance. Kochi/Bangalore to Toronto/Calgary.', optional: false },
    { label: 'First Month Accommodation + Deposit', category: 'setup', min: 80000, max: 160000, notes: 'Toronto and Vancouver are very expensive. Calgary, Edmonton, Winnipeg significantly cheaper.', optional: false },
    { label: 'Setup Costs (SIM, transport, essentials)', category: 'setup', min: 15000, max: 30000, optional: false },
  ],

  agencyComparison: [
    { slug: 'medworld-overseas', name: 'Medworld Overseas', feeMin: 400000, feeMax: 600000, installmentAvailable: true, installmentNote: '35% upfront, 65% post-PR/visa', hiddenChargesReported: 0, transparencyScore: 88, includedServices: ['NCLEX coaching', 'IELTS coaching', 'Express Entry CRS strategy', 'Employer matching'], trustLevel: 'verified', rating: 4.6 },
    { slug: 'careplus-migration', name: 'CarePlus Migration', feeMin: 350000, feeMax: 500000, installmentAvailable: true, hiddenChargesReported: 0, transparencyScore: 80, includedServices: ['NCLEX prep materials', 'Provincial registration support', 'Job search assistance'], trustLevel: 'trusted', rating: 4.2 },
    { slug: 'sunrise-overseas-health', name: 'Sunrise Overseas Health', feeMin: 380000, feeMax: 520000, installmentAvailable: false, hiddenChargesReported: 1, transparencyScore: 76, includedServices: ['NCLEX coaching', 'Immigration guidance', 'Employer matching'], trustLevel: 'trusted', rating: 4.5 },
  ],

  hiddenChargePatterns: [
    SHARED_HIDDEN_CHARGES.retake,
    { title: 'Immigration Consultant Fees', description: 'Some agencies outsource the actual PR application to a third-party Regulated Canadian Immigration Consultant (RCIC) and charge separately for this — ₹50,000–₹1.5L — when this should be included in the core agency fee.', typicalAmount: '₹50,000–₹1,50,000', severity: 'critical', howToAvoid: 'Confirm whether your agency has an in-house RCIC or outsources. Get the total cost including all immigration consulting in writing.' },
    { title: 'Provincial Registration Top-Up Fees', description: 'After arriving in Canada, some provinces require additional assessments or bridging programs for internationally educated nurses. Some agencies charge to support this — others don\'t mention it at all.', typicalAmount: '₹20,000–₹60,000', severity: 'warning', howToAvoid: 'Ask specifically: "What is your target province and what additional costs might arise after arrival for provincial registration?"' },
    SHARED_HIDDEN_CHARGES.vague,
  ],

  nurseCostExperiences: [
    {
      id: 'ca-ce-1',
      authorName: 'Deepa Varghese',
      authorInitials: 'DV',
      authorFrom: 'Alappuzha, Kerala',
      date: 'Apr 2025',
      expectedCostINR: 800000,
      actualCostINR: 920000,
      biggestSurprise: 'The long-haul flight and first-month Calgary expenses were higher than I estimated. Also, my PR application had a document issue that cost ₹40,000 extra to resolve.',
      advice: 'Budget CAD $3,000 (₹1.8L) for your first month in Canada regardless of which city. Also keep ₹50,000 as a PR document contingency fund.',
      quote: 'Came to Calgary via the work permit route. Total spend was ₹9.2L vs my ₹8L estimate — the difference was the flight (₹1.1L when I had budgeted ₹80K), first month rent (Calgary is more expensive than I thought), and an IRCC document clarification request that cost ₹40K extra. Now earning CAD $78K/year and got PR in 22 months.',
      destinationCity: 'Calgary',
      timelineMonths: 20,
      verified: true,
    },
  ],

  pricingTimeline: [
    { stageNumber: 1, stageName: 'IELTS + NCLEX Preparation', timingLabel: 'Month 1–5', description: 'Clear both tests simultaneously — IELTS for immigration, NCLEX for nursing registration.', costs: [{ label: 'IELTS coaching + 2 attempts', range: '₹25,000–₹40,000', optional: false }, { label: 'NCLEX-RN exam', range: '₹15,000–₹20,000', optional: false }], stageTotal: '₹40,000–₹60,000', paymentType: 'upfront' },
    { stageNumber: 2, stageName: 'Agency + Documentation', timingLabel: 'Month 4–8', description: 'Engage agency, complete credential assessment, provincial registration application.', costs: [{ label: 'Agency initial payment', range: '₹1.4L–₹2.1L', optional: false }, { label: 'WES credential assessment', range: '₹16,000–₹22,000', optional: false }, { label: 'Provincial registration (CNO, BCCNM etc.)', range: '₹12,000–₹20,000', optional: false }], stageTotal: '₹1.7L–₹2.8L', paymentType: 'installment' },
    { stageNumber: 3, stageName: 'Express Entry / PR Application', timingLabel: 'Month 6–18', description: 'Create Express Entry profile, receive ITA, apply for PR. Timeline varies significantly.', costs: [{ label: 'Agency balance payment', range: '₹2.6L–₹3.9L', optional: false }, { label: 'PR application fee (government)', range: '₹20,000–₹30,000', optional: false }, { label: 'IRCC medical exam', range: '₹10,000–₹15,000', optional: false }], stageTotal: '₹3.0L–₹4.4L', paymentType: 'installment' },
    { stageNumber: 4, stageName: 'Travel to Canada', timingLabel: 'Month 16–24', description: 'Once PR or work permit received — long-haul flights are significantly more expensive than Europe routes.', costs: [{ label: 'Long-haul flight (India → Canada)', range: '₹70,000–₹1,30,000', optional: false }], stageTotal: '₹70,000–₹1.3L', paymentType: 'upfront' },
    { stageNumber: 5, stageName: 'Canada Setup', timingLabel: 'Month 1 in Canada', description: 'First-month costs vary enormously by province. Toronto and Vancouver are 2–3x more expensive than smaller cities.', costs: [{ label: 'First month rent + deposit', range: '₹80,000–₹1,60,000', optional: false }, { label: 'Essentials and setup', range: '₹15,000–₹30,000', optional: false }], stageTotal: '₹95,000–₹1.9L', paymentType: 'post-arrival', warning: 'Consider settling in Calgary, Edmonton, or Winnipeg initially. Same nursing wages, dramatically lower cost of living.' },
  ],

  whatShouldBeIncluded: ['NCLEX-RN coaching and prep materials', 'IELTS coaching and strategy', 'WES credential assessment guidance', 'Express Entry CRS score optimization strategy', 'Provincial nursing body registration support', 'Employer matching and job offer coordination', 'PR application filing (or licensed RCIC service)'],
  redFlagPhrases: ['"Guaranteed Express Entry draw invitation"', '"We can get you PR in 6 months" — unrealistic', '"Pay full fee upfront"', '"Our RCIC fee is separate and extra"'],
  questionsToAsk: ['Is RCIC (immigration consultant) service included in your fee or separate?', 'Which province do you target for placement and why?', 'What CRS score can I realistically expect based on my profile?', 'What happens if I fail NCLEX?', 'What is the payment schedule relative to major milestones?'],

  faqs: [
    { question: 'What is the total cost of Canada nursing migration from India?', answer: 'Realistically ₹6.2L–₹11L with most nurses spending ₹8L–₹9L. This includes agency fee (₹4L–₹6L), IELTS and NCLEX exams (₹45,000–₹60,000), WES credential assessment (₹16,000–₹22,000), provincial registration (₹12,000–₹20,000), PR application fees (₹20,000–₹30,000), medical exam (₹10,000–₹15,000), long-haul flight (₹70,000–₹1.3L), and first-month Canada expenses (₹95,000–₹1.9L).' },
    { question: 'Is Canada worth the higher migration cost compared to UK or Germany?', answer: 'For long-term settlement, yes. Canada offers PR in 2–3 years (faster than Germany\'s 4 years), excellent healthcare, multicultural cities with large Indian communities, and one of the world\'s clearest permanent residency paths to citizenship. The higher upfront cost (₹8L vs ₹5.5L for UK) is offset by a faster PR pathway and potentially higher total lifetime earnings. For nurses prioritizing rapid income with lower upfront cost, UK or Dubai are more efficient short-term choices.' },
    { question: 'Which province in Canada is most cost-effective for Indian nurses?', answer: 'Alberta (Calgary, Edmonton) offers the best balance: nursing salaries of CAD $75,000–$90,000, no provincial income tax on certain income brackets, and cost of living 40–50% lower than Toronto or Vancouver. Manitoba and Saskatchewan have even lower costs and active healthcare recruitment programs. British Columbia has the highest salaries but also the highest living costs.' },
  ],

  relatedCountrySlugs: ['uk', 'germany', 'australia'],
  relatedGuides: [
    { slug: 'canada-nclex-guide', title: 'NCLEX-RN Guide for Indian Nurses', description: 'Registration, NGN format, study resources, and passing strategy.', category: 'exam', readingTimeMinutes: 12 },
    { slug: 'express-entry-nurses', title: 'Express Entry for Nurses — CRS Strategy', description: 'How to maximize your CRS score for Canadian PR as an internationally educated nurse.', category: 'visa', readingTimeMinutes: 9 },
    { slug: 'canada-nurse-salary', title: 'Canada Nurse Salary by Province (2025)', description: 'Province-by-province salary comparison for Indian nurses.', category: 'salary', readingTimeMinutes: 8 },
  ],
}

const AUSTRALIA: PricingPageData = {
  countrySlug: 'australia',
  countryName: 'Australia',
  flag: '🇦🇺',

  totalMin: 690000,
  totalMax: 1200000,
  totalTypical: 940000,
  transparencyStatement: 'Australia has the highest visa fees of all major nursing destinations — the subclass 482/190 visa alone costs ₹90,000+. However, Australian government hospitals frequently provide relocation allowances and some cover AHPRA costs.',
  lastUpdated: 'May 2026',

  costLineItems: [
    { label: 'Agency Fee', category: 'agency', min: 400000, max: 700000, notes: 'AHPRA support, visa application, employer matching, skills assessment', optional: false },
    { label: 'OET Coaching + Exam (2 attempts)', category: 'exam', min: 40000, max: 70000, notes: 'AHPRA accepts OET Grade B. All 4 components required.', optional: false },
    { label: 'AHPRA Registration Assessment', category: 'documentation', min: 25000, max: 35000, notes: 'Australian Health Practitioner Regulation Agency assessment of Indian nursing qualification', optional: false },
    { label: 'ANMAC Skills Assessment', category: 'documentation', min: 15000, max: 22000, notes: 'Australian Nursing and Midwifery Accreditation Council skills assessment — for visa pathway', optional: false },
    { label: 'Skilled Worker Visa (482 or 190)', category: 'visa', min: 90000, max: 120000, notes: 'Department of Home Affairs visa application fee. Highest visa fee of all major nursing destinations.', optional: false },
    { label: 'Medical Examination', category: 'visa', min: 12000, max: 18000, notes: 'Mandatory HAP medical exam by DIBP-approved physician in India', optional: false },
    { label: 'Economy Flight (India → Australia)', category: 'travel', min: 65000, max: 120000, notes: 'Kochi/Bangalore to Sydney/Melbourne/Brisbane. Longer than Europe routes.', optional: false },
    { label: 'First Month Accommodation + Deposit', category: 'setup', min: 75000, max: 150000, notes: 'Sydney and Melbourne very expensive. Brisbane, Adelaide, Perth significantly cheaper.', optional: false },
    { label: 'Setup Costs', category: 'setup', min: 15000, max: 30000, optional: false },
  ],

  agencyComparison: [
    { slug: 'global-nursing-solutions', name: 'Global Nursing Solutions', feeMin: 400000, feeMax: 700000, installmentAvailable: true, installmentNote: '40% on signing, 60% post-visa', hiddenChargesReported: 0, transparencyScore: 91, includedServices: ['OET coaching', 'AHPRA application', 'Visa filing', 'Employer matching'], trustLevel: 'verified', rating: 4.8 },
    { slug: 'medworld-overseas', name: 'Medworld Overseas', feeMin: 450000, feeMax: 650000, installmentAvailable: true, hiddenChargesReported: 0, transparencyScore: 88, includedServices: ['OET coaching (2 attempts)', 'AHPRA and ANMAC support', 'Skilled visa application'], trustLevel: 'verified', rating: 4.6 },
    { slug: 'prime-nursing-abroad', name: 'Prime Nursing Abroad', feeMin: 380000, feeMax: 580000, installmentAvailable: true, hiddenChargesReported: 1, transparencyScore: 74, includedServices: ['Employer matching', 'Visa support', 'Post-arrival guidance'], trustLevel: 'trusted', rating: 4.1 },
  ],

  hiddenChargePatterns: [
    SHARED_HIDDEN_CHARGES.retake,
    { title: 'Visa Levy (Skilling Australians Fund)', description: 'Employers sponsoring workers on the subclass 482 visa must pay a Skilling Australians Fund (SAF) levy of AUD $1,200–$1,800 annually. Some employers pass this cost to the sponsored nurse — which is technically possible contractually but ethically questionable.', typicalAmount: '₹55,000–₹1,00,000 per year', severity: 'critical', howToAvoid: 'Confirm in your employment contract that the SAF levy is employer-paid. Do not accept an arrangement where you bear this cost.' },
    SHARED_HIDDEN_CHARGES.accommodation,
    SHARED_HIDDEN_CHARGES.vague,
  ],

  nurseCostExperiences: [
    {
      id: 'au-ce-1',
      authorName: 'Reshma Jacob',
      authorInitials: 'RJ',
      authorFrom: 'Trivandrum, Kerala',
      date: 'Feb 2025',
      expectedCostINR: 900000,
      actualCostINR: 890000,
      biggestSurprise: 'The Australian visa fee is genuinely shocking — ₹90,000+ just for the visa itself. No other country comes close. But my hospital partially reimbursed it.',
      advice: 'The Australian visa fee is unavoidable. Budget ₹1L specifically for visa and medical costs. Ask your prospective employer if they cover any part of it.',
      quote: 'Australia was expensive but manageable. The visa fee was the biggest shock — ₹90,000+ for the visa alone, plus ₹15,000 for the HAP medical exam. My Brisbane hospital reimbursed AUD $500 of the visa cost. Total came to ₹8.9L — within my ₹9L estimate. The OET was my only real challenge. Now earning AUD $82,000 and loving Brisbane.',
      destinationCity: 'Brisbane',
      timelineMonths: 17,
      verified: true,
    },
  ],

  pricingTimeline: [
    { stageNumber: 1, stageName: 'OET Preparation', timingLabel: 'Month 1–4', description: 'OET Grade B required by AHPRA. All 4 components must be B or above.', costs: [{ label: 'OET coaching (3 months)', range: '₹15,000–₹35,000', optional: false }, { label: 'OET exam (1–2 attempts)', range: '₹25,000–₹50,000', optional: false }], stageTotal: '₹40,000–₹85,000', paymentType: 'upfront' },
    { stageNumber: 2, stageName: 'AHPRA + ANMAC Assessment', timingLabel: 'Month 3–7', description: 'Apply for AHPRA registration and ANMAC skills assessment — can run in parallel.', costs: [{ label: 'AHPRA assessment application', range: '₹25,000–₹35,000', optional: false }, { label: 'ANMAC skills assessment', range: '₹15,000–₹22,000', optional: false }], stageTotal: '₹40,000–₹57,000', paymentType: 'upfront' },
    { stageNumber: 3, stageName: 'Agency + Employer Matching', timingLabel: 'Month 6–10', description: 'Engage agency for employer matching and visa sponsorship.', costs: [{ label: 'Agency initial payment', range: '₹1.6L–₹2.8L', optional: false }], stageTotal: '₹1.6L–₹2.8L', paymentType: 'installment' },
    { stageNumber: 4, stageName: 'Visa Application', timingLabel: 'Month 9–14', description: 'Skilled Worker Visa — highest visa fee of all nursing destinations.', costs: [{ label: 'Agency balance payment', range: '₹2.4L–₹4.2L', optional: false }, { label: 'Skilled Worker Visa fee', range: '₹90,000–₹1,20,000', optional: false }, { label: 'HAP medical exam', range: '₹12,000–₹18,000', optional: false }], stageTotal: '₹3.5L–₹5.8L', paymentType: 'installment', warning: 'Australian visa fee is the highest of all major destinations. Confirm if your employer offers any reimbursement.' },
    { stageNumber: 5, stageName: 'Australia Arrival + Setup', timingLabel: 'Week 1–4', description: 'Long-haul flight + first month costs. Supervised practice period begins.', costs: [{ label: 'Long-haul flight', range: '₹65,000–₹1,20,000', optional: false }, { label: 'First month rent + deposit', range: '₹75,000–₹1,50,000', optional: false }, { label: 'Essentials setup', range: '₹15,000–₹30,000', optional: false }], stageTotal: '₹1.6L–₹3.0L', paymentType: 'post-arrival' },
  ],

  whatShouldBeIncluded: ['OET coaching (1 exam attempt minimum)', 'AHPRA registration application support', 'ANMAC skills assessment support', 'Employer matching with sponsoring facility', 'Subclass 482 or 190 visa application', 'Pre-departure Australia orientation', 'Supervised practice period guidance (post-arrival)'],
  redFlagPhrases: ['"We can bypass the AHPRA assessment"', '"Guaranteed permanent residency"', '"Pay the full fee before we file your visa"', '"The SAF levy is your responsibility"'],
  questionsToAsk: ['Does your fee include both AHPRA and ANMAC assessment support?', 'Will my employer pay the SAF (Skilling Australians Fund) levy?', 'Does my employer offer any visa cost reimbursement?', 'What is your refund policy if the visa is rejected?', 'Which Australian state do you target and what is the demand level there?'],

  faqs: [
    { question: 'Why is the Australian visa so expensive?', answer: 'The Australian Skilled Worker Visa (subclass 482 or 190) has a government application fee of AUD $1,495 (approximately ₹82,000) plus the Skilling Australians Fund levy paid by employers (AUD $1,200/year) and other charges. Total immigration costs reach ₹90,000–₹1.2L. This is 4–6x higher than UK or Germany visa fees. Additionally, mandatory medical exams cost ₹12,000–₹18,000. Many Australian government hospitals reimburse part of the visa cost — confirm this in your offer letter.' },
    { question: 'What is the AHPRA assessment and how long does it take?', answer: 'AHPRA (Australian Health Practitioner Regulation Agency) assesses whether your Indian nursing qualification meets Australian nursing standards. The assessment typically takes 8–12 weeks and costs approximately AUD $280 (₹15,000). Most Indian BSc Nursing graduates receive conditional registration requiring a supervised practice period of 3–6 months at an Australian hospital. During this supervised period, you are employed and paid normally — the supervision is done by a registered Australian nurse alongside your regular work.' },
    { question: 'Is Australia worth the higher cost compared to UK?', answer: 'For lifestyle and work-life balance, Australia consistently ranks higher than UK. The 38-hour work week is strictly observed, annual leave is 20–25 days, and the climate and quality of life are exceptional. Salary per hour is comparable to UK. The higher migration cost (₹9.4L vs ₹5.5L for UK) is partially offset by Australian employers who more frequently offer relocation allowances and may cover AHPRA costs. If long-term lifestyle quality is the priority over cost efficiency, Australia wins.' },
  ],

  relatedCountrySlugs: ['uk', 'canada', 'germany'],
  relatedGuides: [
    { slug: 'ahpra-registration-india', title: 'AHPRA Registration for Indian Nurses', description: 'Step-by-step AHPRA application, document requirements, and skills assessment process.', category: 'process', readingTimeMinutes: 10 },
    { slug: 'australia-nurse-salary-2025', title: 'Australia Nurse Salary 2025', description: 'State-by-state salary, award rates, overtime, and take-home pay.', category: 'salary', readingTimeMinutes: 8 },
  ],
}

const DUBAI: PricingPageData = {
  countrySlug: 'dubai',
  countryName: 'Dubai (UAE)',
  flag: '🇦🇪',

  totalMin: 160000,
  totalMax: 460000,
  totalTypical: 270000,
  transparencyStatement: 'Dubai offers the lowest migration cost of any major nursing destination. Many employers cover visa and medical fees directly, reducing out-of-pocket costs further. The low cost combined with tax-free salary makes Dubai the fastest ROI destination.',
  lastUpdated: 'May 2026',

  costLineItems: [
    { label: 'Agency Fee', category: 'agency', min: 100000, max: 300000, notes: 'DHA/MOH exam support, DataFlow, employer matching, visa coordination', optional: false },
    { label: 'DHA / MOH / HAAD Exam', category: 'exam', min: 6000, max: 8000, notes: 'Prometric computer-based test. Very straightforward — most nurses pass first attempt.', optional: false },
    { label: 'DataFlow Verification', category: 'documentation', min: 12000, max: 18000, notes: 'Primary source verification mandatory for UAE health authority licensing', optional: false },
    { label: 'Employment Visa (employer-sponsored)', category: 'visa', min: 6000, max: 12000, notes: 'Visa fees often paid by employer. When self-funded: visa + entry permit + status change', optional: false },
    { label: 'Medical Fitness Test (India)', category: 'visa', min: 3000, max: 6000, notes: 'Blood tests + chest X-ray required for UAE visa. MOH-approved clinic in India.', optional: false },
    { label: 'Economy Flight (India → UAE)', category: 'travel', min: 25000, max: 45000, notes: 'Kochi/Mumbai to Dubai. Short distance, competitive fares.', optional: false },
    { label: 'First Month Accommodation + Setup', category: 'setup', min: 30000, max: 80000, notes: 'Many employers provide accommodation or accommodation allowance. Confirm in offer letter.', optional: false },
  ],

  agencyComparison: [
    { slug: 'medlink-solutions', name: 'MedLink Solutions', feeMin: 100000, feeMax: 200000, installmentAvailable: true, hiddenChargesReported: 0, transparencyScore: 82, includedServices: ['DHA/MOH exam prep', 'DataFlow support', 'Employer matching', 'Visa coordination'], trustLevel: 'trusted', rating: 4.3 },
    { slug: 'prime-nursing-abroad', name: 'Prime Nursing Abroad', feeMin: 80000, feeMax: 180000, installmentAvailable: true, hiddenChargesReported: 1, transparencyScore: 74, includedServices: ['Exam prep materials', 'DataFlow guidance', 'Employer matching'], trustLevel: 'trusted', rating: 4.1 },
    { slug: 'sunrise-overseas-health', name: 'Sunrise Overseas Health', feeMin: 100000, feeMax: 220000, installmentAvailable: false, hiddenChargesReported: 1, transparencyScore: 76, includedServices: ['DHA/MOH coaching', 'DataFlow', 'Job placement'], trustLevel: 'trusted', rating: 4.5 },
  ],

  hiddenChargePatterns: [
    { title: 'DataFlow Fees Billed Separately', description: 'Some agencies exclude DataFlow verification (₹12,000–₹18,000) from their headline fee and bill it separately mid-process. DataFlow is mandatory for all UAE health authority licensing.', typicalAmount: '₹12,000–₹18,000', severity: 'warning', howToAvoid: 'Confirm whether DataFlow verification is included in the agency fee before signing.' },
    { title: 'Emirates ID / PRO Fees', description: 'Emirates ID registration and PRO (Public Relations Officer) service charges are sometimes billed to the nurse instead of the employer. These should always be employer expenses.', typicalAmount: '₹5,000–₹15,000', severity: 'warning', howToAvoid: 'These are employer responsibilities. Do not accept employment with a company that charges you for Emirates ID registration.' },
    SHARED_HIDDEN_CHARGES.vague,
  ],

  nurseCostExperiences: [
    {
      id: 'ae-ce-1',
      authorName: 'Sini Mathew',
      authorInitials: 'SM',
      authorFrom: 'Idukki, Kerala',
      date: 'Jan 2025',
      expectedCostINR: 250000,
      actualCostINR: 230000,
      biggestSurprise: 'My employer covered the visa fee and Emirates ID charges. Total out-of-pocket was less than I expected.',
      advice: 'Ask every UAE employer upfront: "What costs do you cover for new international hires?" Many cover visa, Emirates ID, and even the first month of accommodation.',
      quote: 'Dubai was fast and cheap. DHA exam took 5 weeks of prep. Agency charged ₹1.5L all-in. My hospital covered the visa (₹8,000 value) and Emirates ID (₹3,000). Total out-of-pocket: ₹2.3L vs my expected ₹2.5L. Now saving AED 4,500/month after rent — sending ₹1.1L home every month.',
      destinationCity: 'Dubai',
      timelineMonths: 3,
      verified: true,
    },
    {
      id: 'ae-ce-2',
      authorName: 'Lijo Abraham',
      authorInitials: 'LA',
      authorFrom: 'Pathanamthitta, Kerala',
      date: 'Nov 2024',
      expectedCostINR: 200000,
      actualCostINR: 195000,
      biggestSurprise: 'Everything was cheaper than expected. I compared Dubai to Germany migration costs and it\'s 4x cheaper for 60% of the salary — but tax-free. The savings rate is what matters.',
      advice: 'If your goal is to save ₹1L/month quickly for 3–4 years before going to Germany or Canada, Dubai is the smartest stepping stone. Migration cost recovery happens in 2–3 months.',
      quote: 'I used Dubai as a financial launchpad. ₹1.95L total migration cost, recovered in just 2 months of saving. AED 8,100/month salary, spending AED 3,500 on rent and food, saving AED 4,600 (₹1.04L) every month. In 3 years I\'ll have ₹37L saved — enough to fund Germany or Canada without any loans.',
      destinationCity: 'Dubai',
      timelineMonths: 2,
      verified: true,
    },
  ],

  pricingTimeline: [
    { stageNumber: 1, stageName: 'DHA/MOH Exam', timingLabel: 'Week 1–6', description: 'Fastest exam of any major nursing destination. Straightforward computer-based test.', costs: [{ label: 'DHA/MOH exam prep materials', range: '₹2,000–₹5,000', optional: false }, { label: 'Prometric exam fee', range: '₹6,000–₹8,000', optional: false }], stageTotal: '₹8,000–₹13,000', paymentType: 'upfront' },
    { stageNumber: 2, stageName: 'DataFlow + Agency', timingLabel: 'Week 4–8', description: 'Primary source verification runs in parallel with agency engagement and employer matching.', costs: [{ label: 'DataFlow verification', range: '₹12,000–₹18,000', optional: false }, { label: 'Agency fee (full or initial)', range: '₹1.0L–₹3.0L', optional: false }], stageTotal: '₹1.1L–₹3.2L', paymentType: 'upfront' },
    { stageNumber: 3, stageName: 'Visa + Medical', timingLabel: 'Week 6–10', description: 'Employment visa processing — often managed fully by employer.', costs: [{ label: 'Medical fitness test (India)', range: '₹3,000–₹6,000', optional: false }, { label: 'Visa fee (if not employer-covered)', range: '₹6,000–₹12,000', optional: true }], stageTotal: '₹3,000–₹18,000', paymentType: 'upfront', warning: 'Many UAE employers cover visa fees. Confirm this before accepting any job offer.' },
    { stageNumber: 4, stageName: 'Arrival + Setup', timingLabel: 'Week 8–12', description: 'Short flight, quick setup. Many employers provide accommodation or allowance.', costs: [{ label: 'Economy flight (India → Dubai)', range: '₹25,000–₹45,000', optional: false }, { label: 'First month accommodation + setup', range: '₹30,000–₹80,000', optional: false }], stageTotal: '₹55,000–₹1.25L', paymentType: 'post-arrival', warning: 'Ask your employer if they provide accommodation or an accommodation allowance — many UAE hospitals do.' },
  ],

  whatShouldBeIncluded: ['DHA/MOH/HAAD exam preparation support', 'DataFlow primary source verification', 'Employer matching in your target emirate', 'Visa coordination with employer', 'Pre-departure UAE orientation (banking, accommodation, laws)', 'Minimum 2 weeks post-arrival support'],
  redFlagPhrases: ['"We can get you hired without DataFlow — it takes too long"', '"Pay ₹3L+ for a Dubai placement" — Dubai agency fees above ₹2.5L are unreasonable', '"We have exclusive hospital contracts" — verify this claim', '"No contract needed for Dubai, it\'s informal"'],
  questionsToAsk: ['Is DataFlow verification included in your fee?', 'Does your fee include the exam — or just preparation materials?', 'Will my employer cover visa fees and Emirates ID?', 'Does my employer provide accommodation or an allowance?', 'Can I see actual job offer letters from your recent Dubai placements?'],

  faqs: [
    { question: 'What is the total cost of moving to Dubai as a nurse from India?', answer: 'Dubai is the most affordable major nursing destination. Total costs range from ₹1.6L to ₹4.6L, with most nurses spending ₹2.5L–₹3L. This includes agency fee (₹1L–₹3L), DHA/MOH exam (₹8,000–₹13,000), DataFlow verification (₹12,000–₹18,000), flight (₹25,000–₹45,000), and first-month setup (₹30,000–₹80,000). Many UAE employers cover visa fees and sometimes accommodation, reducing out-of-pocket costs further.' },
    { question: 'How quickly can I recover my Dubai migration cost?', answer: 'At AED 6,000–8,000/month (₹1.3L–₹1.8L), with typical Dubai living costs of AED 2,500–3,500/month, a nurse can save AED 2,500–5,000/month (₹55,000–₹1.1L). At this rate, migration costs of ₹2.5L are recovered in 2–4 months. Dubai offers the fastest ROI of any nursing destination, making it an excellent financial launchpad.' },
    { question: 'Are Dubai agency fees for nursing too high if above ₹2.5L?', answer: 'Yes — Dubai migration involves a relatively simple process: DHA/MOH exam (straightforward), DataFlow (standard), and employer matching (high demand, many openings). Agency fees above ₹2.5L for Dubai placement are difficult to justify. Reputable agencies charge ₹1L–₹2.5L. If an agency quotes ₹3L+ for Dubai, negotiate down or compare with other agencies. The complexity and risk in Dubai migration is significantly lower than Germany or Canada.' },
  ],

  relatedCountrySlugs: ['germany', 'uk', 'canada'],
  relatedGuides: [
    { slug: 'dha-exam-guide', title: 'DHA Exam Complete Guide', description: 'Registration, syllabus, and preparation strategy for the Dubai Health Authority exam.', category: 'exam', readingTimeMinutes: 7 },
    { slug: 'dubai-vs-germany-nursing', title: 'Dubai vs Germany — Financial Comparison', description: 'Salary, savings rate, migration cost, and long-term career value compared.', category: 'comparison', readingTimeMinutes: 8 },
    { slug: 'uae-nurse-salary-guide', title: 'UAE Nurse Salary Guide 2025', description: 'DHA, MOH, and HAAD salary ranges and actual take-home pay.', category: 'salary', readingTimeMinutes: 6 },
  ],
}

const PRICING_MAP: Record<string, PricingPageData> = {
  germany: GERMANY,
  uk: UK,
  canada: CANADA,
  australia: AUSTRALIA,
  dubai: DUBAI,
}

export function getPricingData(country: string): PricingPageData | null {
  return PRICING_MAP[country] ?? null
}

export function getAllPricingCountrySlugs(): string[] {
  return Object.keys(PRICING_MAP)
}

export function getAllPricingData(): PricingPageData[] {
  return Object.values(PRICING_MAP)
}
