import type { PlatformScamReport } from '@/types/scamReport'

export const SCAM_REPORTS: PlatformScamReport[] = [
  {
    id: 'sc-001',
    slug: 'heritage-medical-germany-visa-fraud-2024',
    agencySlug: 'heritage-medical-agency',
    agencyName: 'Heritage Medical Consultants',
    reporterName: 'Rinu A.',
    reporterInitials: 'RA',
    reporterFrom: 'Kottayam, Kerala',
    reportedDate: '2024-01-08',
    displayDate: 'January 2024',
    title: 'Heritage Medical took ₹3.8L using fabricated hospital offer letters — Germany visa never processed',
    category: 'document-fraud',
    severity: 'critical',
    amountLost: 380000,
    amountPaid: 380000,
    amountRecovered: 0,
    countryPromised: 'Germany',
    cityPromised: 'Hamburg',
    summary: 'Heritage Medical Consultants collected ₹3.8L over 9 months using forged hospital partnership letters. The claimed hospital partnerships did not exist. No visa was ever filed. The agency became unreachable after full payment was collected.',
    fullIncident: `I first contacted Heritage Medical Consultants in March 2023 after seeing their advertisement on Facebook. They had a professional website, Google reviews (which I later discovered were fake), and an office in Kochi.

At the first meeting, they showed me confirmation letters from two German hospitals — Asklepios Klinik Hamburg and Universitätsklinikum Hamburg-Eppendorf — stating they had 12 and 8 nursing vacancies respectively. The letters had hospital letterheads, signatures, and reference numbers. They looked completely authentic.

I was told the total cost would be ₹2.6L, payable in installments. I signed an agreement and paid the first installment of ₹1.1L.

Over the next 9 months, they kept requesting additional payments for what they described as mandatory charges: ₹35,000 for "apostille and document legalization," ₹25,000 for "CERPNO translation verification," ₹35,000 for "German Nursing Council registration" (which is not a real requirement), and ₹85,000 for "pre-visa processing fees." I paid all of these, trusting the process.

In October 2023, I became suspicious when I could not reach my case manager for 3 weeks. I called the German hospitals directly using numbers from their official websites. Both hospitals confirmed they had no partnership with Heritage Medical Consultants and had never issued such offer letters.

The offer letters I had been shown were fabricated. When I confronted the agency, a different staff member told me my case manager had "resigned" and promised placement was "one more month away." I stopped paying at that point.

By December 2023 the office was empty. The phone numbers were disconnected. I have since filed an FIR with Kottayam Police and a complaint with the Consumer Forum. A consumer attorney has taken my case. Multiple other nurses from my district have reported the same agency.`,
    timelineEvents: [
      { date: 'March 2023', event: 'First meeting with Heritage Medical Consultants. Shown hospital offer letters. Signed agreement.' },
      { date: 'March 2023', event: 'Paid first installment: ₹1.1L' },
      { date: 'May 2023', event: 'Paid "apostille fees": ₹35,000' },
      { date: 'June 2023', event: 'Paid "translation verification": ₹25,000' },
      { date: 'August 2023', event: 'Paid "German Nursing Council registration": ₹35,000' },
      { date: 'September 2023', event: 'Paid "pre-visa processing fees": ₹85,000. Total paid: ₹3.8L' },
      { date: 'October 2023', event: 'Case manager stops responding. Unable to reach agency for 3 weeks.' },
      { date: 'October 2023', event: 'Called German hospitals directly. Both confirmed no partnership with Heritage Medical existed.' },
      { date: 'November 2023', event: 'Confronted agency. New staff member promised placement "next month."' },
      { date: 'December 2023', event: 'Agency office found empty. All phone numbers disconnected.' },
      { date: 'January 2024', event: 'Filed FIR with Kottayam Police. Filed Consumer Forum complaint. Case taken by consumer attorney.' },
    ],
    warningSignsMissed: [
      'Hospital offer letters were never verified directly with the hospitals',
      'Additional charges kept appearing outside the original agreement',
      'No written explanation was provided for why new fees were necessary',
      'The "German Nursing Council registration" fee is not a real requirement',
      'No measurable progress (language training, credential submission) despite 9 months',
      'Google reviews appeared suspiciously uniformly positive with generic text',
    ],
    lessonsLearned: [
      'Always verify hospital partnerships by calling the hospital directly using numbers from the official hospital website',
      'Any charge not listed in the original signed agreement should be questioned and refused until written justification is provided',
      'Research what the actual required steps and fees are independently before trusting an agency',
      'If you cannot reach your case manager for more than one week, stop all payments immediately',
      'Join a verified nurses community group before signing — other nurses may already know the agency reputation',
    ],
    emotionalExperience: 'I felt completely shattered. I had borrowed money from family for this. The shame of telling them what happened was worse than losing the money. For months I could not sleep properly. I am slowly recovering but the trust I lost in people is not easy to rebuild.',
    resolved: false,
    verified: true,
    helpful: 201,
    evidenceCount: 7,
    relatedReportSlugs: ['heritage-medical-abandonment-2023'],
  },
  {
    id: 'sc-002',
    slug: 'heritage-medical-abandonment-2023',
    agencySlug: 'heritage-medical-agency',
    agencyName: 'Heritage Medical Consultants',
    reporterName: 'Santhosh K.',
    reporterInitials: 'SK',
    reporterFrom: 'Ernakulam, Kerala',
    reportedDate: '2023-11-15',
    displayDate: 'November 2023',
    title: 'Heritage Medical collected ₹5.2L for Australia placement, disappeared after full payment',
    category: 'abandonment',
    severity: 'critical',
    amountLost: 520000,
    amountPaid: 520000,
    amountRecovered: 0,
    countryPromised: 'Australia',
    cityPromised: 'Melbourne',
    summary: 'Heritage Medical Consultants promised Australia nursing placement, collected ₹5.2L in staged payments over 12 months, provided no actual services, and became completely unreachable.',
    fullIncident: `My wife is a registered nurse and we approached Heritage Medical Consultants in November 2022 specifically for Australia AHPRA registration and skilled visa support.

They presented a detailed process document and a signed service agreement promising AHPRA registration guidance, skills assessment, visa application support, and hospital placement in Melbourne. Total quoted fee: ₹4.5L. We eventually paid ₹5.2L after several "additional service" add-ons they introduced over the year.

For the first 4 months there was some activity — they collected documents, conducted a few orientation calls, sent a checklist. After that, progress stopped. We kept receiving reassurances that "the AHPRA application has been submitted" but when my wife tried to track the AHPRA application directly on the AHPRA website, no application existed under her name.

We escalated multiple times. Each time we were told there was a "processing delay." By month 10, the original contact person was gone. By month 12, the agency was not responding to calls or emails. We visited the office — it was closed.

We filed complaints with the Consumer Forum Ernakulam and the police. We are also in contact with 4 other nurses who have similar stories about this agency.`,
    timelineEvents: [
      { date: 'November 2022', event: 'Signed agreement with Heritage Medical. Paid first installment: ₹1.8L.' },
      { date: 'January 2023', event: 'Document collection phase. Orientation calls. Appeared legitimate.' },
      { date: 'March 2023', event: 'Progress stops. Reassurances given about "processing."' },
      { date: 'April 2023', event: 'Additional "AHPRA verification fee" charged: ₹35,000.' },
      { date: 'June 2023', event: 'Wife checked AHPRA website directly — no application found under her name.' },
      { date: 'August 2023', event: 'Additional "skills assessment expedite" fee: ₹45,000.' },
      { date: 'October 2023', event: 'Original contact person gone. New person says "case transferred."' },
      { date: 'November 2023', event: 'Agency stops responding entirely. Office found closed. FIR filed.' },
    ],
    warningSignsMissed: [
      'Did not independently verify AHPRA application status earlier',
      'Continued paying after the process stalled with no concrete evidence',
      'Did not ask for AHPRA lodgment receipt or reference number',
      '"Skills assessment expedite fee" is not a standard AHPRA cost',
    ],
    lessonsLearned: [
      'For AHPRA registration, always track your own application status on the AHPRA website using your own login — never depend on agency-provided updates',
      'Stop payments immediately when concrete evidence of service delivery cannot be produced',
      'Australia migration has specific, verifiable steps — know them independently so you can verify the agency is actually doing them',
    ],
    emotionalExperience: 'My wife wanted to migrate for years. Seeing her cry about this was unbearable. We had told our entire family. The humiliation was tremendous. We are still trying to recover financially and emotionally.',
    resolved: false,
    verified: true,
    helpful: 167,
    evidenceCount: 5,
    relatedReportSlugs: ['heritage-medical-germany-visa-fraud-2024'],
  },
  {
    id: 'sc-003',
    slug: 'skyline-healthcare-hidden-charges-2024',
    agencySlug: 'skyline-healthcare-abroad',
    agencyName: 'Skyline Healthcare Consultants',
    reporterName: 'Meena S.',
    reporterInitials: 'MS',
    reporterFrom: 'Malappuram, Kerala',
    reportedDate: '2024-03-20',
    displayDate: 'March 2024',
    title: 'Skyline Healthcare kept adding undisclosed charges — ₹95,000 above the signed agreement',
    category: 'fee-fraud',
    severity: 'high',
    amountLost: 95000,
    amountPaid: 350000,
    amountRecovered: 0,
    countryPromised: 'Germany',
    summary: 'Skyline Healthcare quoted ₹2.55L in a signed agreement but collected ₹3.5L through a pattern of undisclosed additional fees. No placement was achieved after 8 months.',
    fullIncident: `I signed an agreement with Skyline Healthcare Consultants in June 2023 for Germany nursing placement. The agreement clearly stated a total service fee of ₹2.55L.

Over the following 8 months, new charges appeared regularly: a "document apostille coordination" fee (₹35,000), "language institute registration" fee (₹25,000 — when I enrolled in the language course they recommended, I discovered the institute charged this separately, not as a pass-through), and "German work permit application processing" (₹35,000).

When I questioned why these were not in the original agreement, I was told they were "government fees and third-party costs" that "could not be included in the fixed agreement." This is not accurate — these were not direct government fees.

By March 2024 I had paid ₹3.5L and had no German language training certificate, no hospital interview scheduled, and no visa filed. I stopped all payments and demanded a refund of the excess charges. The agency refused.

I am pursuing a Consumer Forum case. The additional ₹95,000 beyond the signed agreement is the amount in dispute. I did receive some document preparation services so I am not claiming the entire amount.`,
    timelineEvents: [
      { date: 'June 2023', event: 'Signed agreement for ₹2.55L total. Paid ₹1.1L upfront.' },
      { date: 'July 2023', event: 'Charged "apostille coordination": ₹35,000' },
      { date: 'September 2023', event: 'Charged "language institute registration": ₹25,000' },
      { date: 'November 2023', event: 'Charged "work permit processing": ₹35,000' },
      { date: 'January 2024', event: 'Paid remaining balance. Total paid: ₹3.5L' },
      { date: 'March 2024', event: 'No placement progress after 8 months. Demanded excess refund. Refused.' },
      { date: 'March 2024', event: 'Consumer Forum complaint filed.' },
    ],
    warningSignsMissed: [
      'Did not push back on first extra charge — paying it signaled willingness to pay more',
      'The pattern of new charges should have triggered immediate stop on payments',
      '"Work permit application processing" is not a fee that agencies in India legitimately charge separately',
    ],
    lessonsLearned: [
      'The moment an agency requests payment not listed in your signed agreement, demand written justification and legal basis before paying',
      'Research independently what the actual government fees are — German nursing migration has specific, publicly known costs',
      'A signed agreement is legally binding — the agency cannot add fees unilaterally',
    ],
    emotionalExperience: 'I felt trapped. Each time they asked for money they said "just this one more charge and then your visa will be processed." I kept believing them because stopping felt like losing everything I had already paid.',
    resolved: false,
    agencyResponse: 'Skyline Healthcare disputes this account and states all fees were disclosed verbally during meetings.',
    verified: true,
    helpful: 78,
    evidenceCount: 4,
    relatedReportSlugs: ['skyline-healthcare-fake-job-2024'],
  },
  {
    id: 'sc-004',
    slug: 'skyline-healthcare-fake-job-2024',
    agencySlug: 'skyline-healthcare-abroad',
    agencyName: 'Skyline Healthcare Consultants',
    reporterName: 'Nisha V.',
    reporterInitials: 'NV',
    reporterFrom: 'Kozhikode, Kerala',
    reportedDate: '2024-05-02',
    displayDate: 'May 2024',
    title: 'Skyline Healthcare fabricated UK hospital job letter to collect upfront fee',
    category: 'fake-job',
    severity: 'critical',
    amountLost: 230000,
    amountPaid: 230000,
    amountRecovered: 0,
    countryPromised: 'UK',
    cityPromised: 'London',
    summary: 'Skyline Healthcare presented a fabricated NHS job offer letter to justify a large upfront payment. The NHS Trust named in the letter confirmed no such vacancy existed.',
    fullIncident: `In January 2024 Skyline Healthcare contacted me claiming they had a confirmed nursing vacancy at Royal London Hospital (Barts Health NHS Trust) and that they needed ₹2.3L upfront to "secure my placement" before another candidate took the position.

The urgency was a red flag I should have heeded. They showed me a letter on Royal London Hospital letterhead showing a Band 5 nursing vacancy with my name provisionally mentioned. This pressured me into paying quickly.

I paid ₹2.3L. After paying, I was told I would need to complete my NMC registration before the hospital could "formally confirm" — which would take another 3–4 months. This made no sense given the urgency they had just used to get my money.

I called Barts Health NHS Trust HR department directly. They confirmed they had no partnership with Skyline Healthcare and the letter was not genuine. The formatting and signature were fabricated.

I have filed a police complaint and shared the fabricated letter as evidence. Cybercrime police are investigating as this is document forgery.`,
    timelineEvents: [
      { date: 'January 2024', event: 'Skyline contacted with "confirmed vacancy" at Royal London Hospital.' },
      { date: 'January 2024', event: 'Shown fabricated NHS job offer letter. Pressured to pay urgently.' },
      { date: 'January 2024', event: 'Paid ₹2.3L "to secure placement."' },
      { date: 'February 2024', event: 'Told NMC registration must complete first — contradicting the urgency used earlier.' },
      { date: 'March 2024', event: 'Called Barts Health NHS Trust directly. Confirmed letter was fabricated.' },
      { date: 'May 2024', event: 'Police complaint filed. Cybercrime investigation initiated.' },
    ],
    warningSignsMissed: [
      'Urgency pressure ("pay now or lose the spot") is a classic fraud technique',
      'NHS does not allocate positions to individual candidates before NMC registration is complete',
      'Did not call the hospital before paying',
      'The large upfront amount before any process steps was unusual',
    ],
    lessonsLearned: [
      'NHS hospitals never offer positions to nurses who have not yet received their NMC PIN — any claim of a pre-NMC "secured vacancy" is false',
      'Urgency and scarcity pressure are manipulation tactics — legitimate agencies do not operate this way',
      'Call the hospital HR directly before paying any fee connected to a job offer',
      'Fabricating official government or hospital documents is a criminal offence — report to police immediately',
    ],
    emotionalExperience: 'I felt foolish. I am a healthcare professional and I let urgency override my judgment. It took months to tell my husband what happened. The shame is real but I am speaking out because others should not fall into this trap.',
    resolved: false,
    verified: true,
    helpful: 112,
    evidenceCount: 6,
    relatedReportSlugs: ['skyline-healthcare-hidden-charges-2024'],
  },
  {
    id: 'sc-005',
    slug: 'bright-path-consultants-nclex-fraud-2023',
    agencySlug: 'bright-path-consultants',
    agencyName: 'Bright Path Consultants',
    reporterName: 'Jinu M.',
    reporterInitials: 'JM',
    reporterFrom: 'Palakkad, Kerala',
    reportedDate: '2023-09-14',
    displayDate: 'September 2023',
    title: 'Bright Path promised NCLEX preparation but provided no support — refund denied',
    category: 'fee-fraud',
    severity: 'moderate',
    amountLost: 85000,
    amountPaid: 85000,
    amountRecovered: 0,
    countryPromised: 'USA',
    summary: 'Bright Path Consultants collected ₹85,000 for NCLEX preparation and US nursing license application support. They provided none of the promised study materials or guidance and refused refund.',
    fullIncident: `Bright Path Consultants offered an "NCLEX Premium Preparation Package" for ₹75,000 plus a ₹10,000 "application coordination fee." They promised UWorld access, weekly mock tests with a certified NCLEX instructor, application support for three US state nursing boards, and credential verification guidance.

After paying, I received one PDF study guide (which appeared to be a free resource available online) and a WhatsApp number for "support." When I messaged the support number, responses were delayed by days or weeks. The promised weekly mock tests never happened. The "NCLEX instructor" I was supposed to be connected with never contacted me.

When I asked about the state board applications, I was told they were "in process" but no evidence was provided. After 5 months I demanded a refund and was told the contract had a "no refund after processing begins" clause buried in the agreement.

I engaged a consumer lawyer. The lawyer has sent a legal notice to the agency. The matter is pending in Consumer Court.`,
    timelineEvents: [
      { date: 'April 2023', event: 'Signed agreement. Paid ₹85,000.' },
      { date: 'April 2023', event: 'Received one PDF guide. No other materials provided.' },
      { date: 'May–August 2023', event: 'Weekly mock tests never delivered. Support responses minimal.' },
      { date: 'August 2023', event: 'State board application status requested — no documentation provided.' },
      { date: 'September 2023', event: 'Requested refund. Denied citing "no refund" clause.' },
      { date: 'September 2023', event: 'Consumer Court complaint filed through lawyer.' },
    ],
    warningSignsMissed: [
      'Did not read the full contract before signing, specifically the refund policy',
      'Did not ask for evidence of NCLEX instructor credentials before paying',
      'Paid the full amount upfront instead of requesting milestone-based payment',
    ],
    lessonsLearned: [
      'Always read the refund policy in full before signing any agreement',
      'For NCLEX, free resources (NCLEX-RN official prep, NCSBN Learning Extension) are well-known — agencies should provide value beyond these',
      'Ask for the qualifications and contact information of promised instructors before paying',
      'Consider milestone-based payments where possible — pay for completed services, not promised ones',
    ],
    emotionalExperience: 'I felt naive. But I want other nurses to know: wanting to trust people is not a character flaw. The problem is with those who exploit that trust. Report them — silence lets them continue.',
    resolved: false,
    verified: true,
    helpful: 45,
    evidenceCount: 3,
    relatedReportSlugs: [],
  },
]

export function getAllScamReports(): PlatformScamReport[] {
  return SCAM_REPORTS
}

export function getScamReport(slug: string): PlatformScamReport | undefined {
  return SCAM_REPORTS.find((r) => r.slug === slug)
}

export function getScamReportsByAgency(agencySlug: string): PlatformScamReport[] {
  return SCAM_REPORTS.filter((r) => r.agencySlug === agencySlug)
}

export function getScamReportStats() {
  const total = SCAM_REPORTS.length
  const totalLost = SCAM_REPORTS.reduce((sum, r) => sum + r.amountLost, 0)
  const critical = SCAM_REPORTS.filter((r) => r.severity === 'critical').length
  const unresolved = SCAM_REPORTS.filter((r) => !r.resolved).length
  const agenciesReported = new Set(SCAM_REPORTS.map((r) => r.agencySlug)).size

  return { total, totalLost, critical, unresolved, agenciesReported }
}
