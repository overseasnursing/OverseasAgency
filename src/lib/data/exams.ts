import type { ExamPageData } from '@/types/exam'

const EXAMS: ExamPageData[] = [
  {
    slug: 'oet-guide',
    examName: 'OET',
    examFullName: 'Occupational English Test',
    examType: 'language',
    applicableCountries: ['United Kingdom', 'Australia', 'New Zealand', 'Ireland'],
    applicableCountrySlugs: ['uk', 'australia'],
    headline: 'OET Exam Guide 2025 — Complete Preparation for Indian Nurses Migrating to UK & Australia',
    tagline: 'Healthcare-specific English test accepted by NMC, AHPRA, and nursing bodies across 5 countries',
    overview:
      'The Occupational English Test (OET) is a healthcare-specific English proficiency exam designed for medical and nursing professionals. Unlike IELTS which is a general academic test, OET tests your English ability in a healthcare context — clinical communication, patient interaction, medical report writing, and case-based listening. It is the preferred test for nursing migration to the UK (NMC), Australia (AHPRA), and several other countries.',
    isMandatory: true,
    validity: '2 years from the date of results',
    registrationFeeINR: 26000,
    prepTimeMonths: { min: 2, max: 4 },
    passingScore: 'Grade B in all four sub-tests (Listening, Reading, Writing, Speaking)',
    passRate: 'Approximately 65-70% in first attempt for Indian nurses with 2-3 months preparation',
    registrationUrl: 'https://oet.com',
    sections: [
      {
        name: 'Listening',
        description: 'Healthcare-specific audio passages. Consultations, ward briefings, clinical discussions. 40 minutes.',
        scoreRequired: 'Grade B (score 350+)',
        duration: '40 minutes',
      },
      {
        name: 'Reading',
        description: 'Healthcare texts — research articles, patient letters, clinical guidelines. 60 minutes.',
        scoreRequired: 'Grade B (score 350+)',
        duration: '60 minutes',
      },
      {
        name: 'Writing',
        description: 'Write a referral letter or discharge summary based on clinical case notes. 45 minutes.',
        scoreRequired: 'Grade B (score 350+)',
        duration: '45 minutes',
      },
      {
        name: 'Speaking',
        description: 'Role-play consultation with a trained interlocutor. Two role plays of 5 minutes each.',
        scoreRequired: 'Grade B (score 350+)',
        duration: '~20 minutes',
      },
    ],
    prepTips: [
      'Start with the official OET preparation materials from oet.com — they are the most accurate representation of the actual exam',
      'Practice the Writing sub-test daily — referral letters have a specific format that must be memorised',
      'Listening practice should focus on healthcare-specific vocabulary, not general English audio',
      'For Speaking, practice clinical communication scenarios with a partner or record yourself',
      'Read NHS clinical guidelines, patient information leaflets, and medical journals regularly',
      'Take at least 3 full-length mock tests before the actual exam under timed conditions',
      'If you fail one sub-test, you can re-take only that sub-test without repeating others',
    ],
    commonMistakes: [
      'Using informal language in the Writing sub-test — always use formal clinical letter format',
      'Writing too much in the Writing task — the letter should be concise and structured, not exhaustive',
      'Not reading the Speaking role-play card carefully before starting',
      'Focusing only on IELTS preparation materials instead of OET-specific resources',
      'Not practising enough clinical vocabulary in the weeks before the exam',
    ],
    faqs: [
      {
        question: 'Is OET or IELTS better for Indian nurses going to the UK?',
        answer:
          'OET is generally preferred because it tests English in a healthcare context — the same scenarios you will encounter daily as a nurse. Many Indian nurses find OET easier than IELTS because the vocabulary is familiar from clinical training. The NMC (UK) accepts both OET Grade B and IELTS 7.0 in all bands. Most agencies recommend OET.',
      },
      {
        question: 'What is the passing score for OET for UK nursing (NMC)?',
        answer:
          'The NMC requires Grade B in all four OET sub-tests (Listening, Reading, Writing, Speaking). Grade B corresponds to a score of 350 on each sub-test (maximum 500). This is a strict requirement — a Grade C in even one sub-test means the overall test does not meet NMC requirements.',
      },
      {
        question: 'How long does OET preparation take for Indian nurses?',
        answer:
          'Most Indian nurses with strong English from nursing education need 2-4 months of focused preparation. The Writing sub-test format is specific and requires dedicated practice. Nurses who struggle with English may need 4-6 months. Starting preparation before approaching an agency is strongly recommended.',
      },
      {
        question: 'How much does the OET exam cost in India?',
        answer:
          'The OET exam fee is approximately USD 310-320 per sitting, which is approximately ₹26,000 at current exchange rates. If you need to retake individual sub-tests, each sub-test retake is approximately USD 95 (₹8,000). The total cost including one full attempt and potential retake of one section is typically ₹26,000–₹35,000.',
      },
      {
        question: 'Can OET results be used for Australia as well as UK?',
        answer:
          'Yes. OET results are accepted by AHPRA (Australia), NMC (UK), NMBI (Ireland), Nursing Council of New Zealand, and several others. One OET attempt with qualifying scores can support applications in multiple countries. Results are valid for 2 years from the date of testing.',
      },
    ],
    relatedExamSlugs: ['ielts-guide', 'cbse-osce-guide', 'ahpra-registration-guide'],
    relatedCountrySlugs: ['uk', 'australia'],
    lastUpdated: 'January 2025',
  },
  {
    slug: 'nclex-rn-guide',
    examName: 'NCLEX-RN',
    examFullName: 'National Council Licensure Examination — Registered Nurse',
    examType: 'licensing',
    applicableCountries: ['United States', 'Canada'],
    applicableCountrySlugs: ['canada'],
    headline: 'NCLEX-RN Guide 2025 — Complete Preparation for Indian Nurses Migrating to Canada & USA',
    tagline: 'North America\'s nursing licensure exam — required for Canada and USA nursing registration',
    overview:
      'The NCLEX-RN (National Council Licensure Examination for Registered Nurses) is the licensing examination required to practice nursing in the United States and Canada. For Indian nurses migrating to Canada, passing NCLEX-RN is required as part of the provincial nursing college registration process. The exam uses Computerized Adaptive Testing (CAT) which adjusts question difficulty based on your performance.',
    isMandatory: true,
    validity: 'NCLEX results do not expire once passed',
    registrationFeeINR: 21000,
    prepTimeMonths: { min: 2, max: 5 },
    passingScore: 'Pass/Fail — determined by NCSBN algorithm (CAT system)',
    passRate: 'Approximately 50-60% for internationally educated nurses on first attempt',
    sections: [
      {
        name: 'Safe and Effective Care Environment',
        description: 'Management of Care (17-23%), Safety and Infection Control (9-15%). Priority setting, delegation, infection control.',
      },
      {
        name: 'Health Promotion and Maintenance',
        description: 'Prevention, early detection, health promotion. Expected lifespan development.',
        duration: '6-12% of questions',
      },
      {
        name: 'Psychosocial Integrity',
        description: 'Mental health, coping, therapeutic communication, crisis intervention.',
        duration: '6-12% of questions',
      },
      {
        name: 'Physiological Integrity',
        description: 'Basic Care (6-12%), Pharmacology (12-18%), Reduction of Risk (9-15%), Physiological Adaptation (11-17%). Largest section.',
      },
    ],
    prepTips: [
      'Use UWorld NCLEX-RN Question Bank — widely considered the gold standard for NCLEX preparation',
      'Practice clinical judgment and priority-setting questions — these dominate the modern NCLEX',
      'The Next Generation NCLEX (NGN) introduced in 2023 emphasises critical thinking over memorization',
      'Focus on pharmacology — drug classes, side effects, and nursing interventions are heavily tested',
      'Complete at least 3,000-4,000 practice questions with detailed review of rationales',
      'Understand Maslow\'s hierarchy and ABC (Airway, Breathing, Circulation) priority framework',
      'Take Kaplan or Hurst NCLEX review course — comprehensive review courses significantly improve pass rates',
    ],
    commonMistakes: [
      'Memorising facts without understanding clinical reasoning — NCLEX tests application, not recall',
      'Rushing through questions without reading all options carefully',
      'Ignoring pharmacology — it comprises 12-18% of the exam',
      'Not practising the new Next Generation NCLEX item types (case studies, extended drag-and-drop)',
      'Underestimating the time needed for international nursing graduates',
    ],
    faqs: [
      {
        question: 'Is NCLEX required for nursing in Canada?',
        answer:
          'Yes. Most Canadian provincial nursing colleges (CRNBC in BC, CNO in Ontario, CARNA in Alberta, etc.) require internationally educated nurses to pass NCLEX-RN as part of registration. Canada adopted NCLEX in 2015, replacing the CRNE. A pass in any province is generally recognised across Canada for registration purposes.',
      },
      {
        question: 'How hard is NCLEX-RN for Indian nurses?',
        answer:
          'NCLEX-RN is challenging for internationally educated nurses because it emphasises clinical decision-making and priority-setting rather than factual recall. The pass rate for internationally educated nurses is approximately 50-60% on first attempt. With 2-5 months of structured preparation using quality resources (UWorld, Kaplan), most Indian nurses with strong clinical foundation can pass.',
      },
      {
        question: 'How many questions are in NCLEX-RN?',
        answer:
          'NCLEX-RN uses Computerized Adaptive Testing (CAT). The exam stops when the system determines with 95% confidence that you are above or below the passing standard. The minimum is 75 questions and maximum is 145 questions. You cannot predict your result from the number of questions — stopping at 75 can mean pass or fail.',
      },
      {
        question: 'How much does NCLEX cost for Indian nurses applying to Canada?',
        answer:
          'The NCLEX-RN fee charged by NCSBN is USD 200 (approximately ₹16,700). Additionally, you must pay the registration fee to the Canadian provincial nursing college (varies by province, typically CAD $400–$1,000). Total NCLEX-related costs are approximately ₹21,000–₹35,000 before other migration costs.',
      },
    ],
    relatedExamSlugs: ['oet-guide', 'ielts-guide'],
    relatedCountrySlugs: ['canada'],
    lastUpdated: 'January 2025',
  },
  {
    slug: 'dha-exam-guide',
    examName: 'DHA Exam',
    examFullName: 'Dubai Health Authority Licensing Examination',
    examType: 'licensing',
    applicableCountries: ['Dubai / UAE'],
    applicableCountrySlugs: ['dubai'],
    headline: 'DHA Exam Guide 2025 — Complete Preparation for Indian Nurses Going to Dubai',
    tagline: 'Required for nursing practice in Dubai — computer-based MCQ exam with 70% passing threshold',
    overview:
      'The Dubai Health Authority (DHA) licensing exam is mandatory for all foreign-trained nurses who want to practice in Dubai. It is a computer-based multiple choice exam that tests clinical nursing knowledge. The DHA exam is considered one of the easier licensing exams compared to NCLEX or OSCE, and most Indian nurses with structured preparation clear it in the first attempt.',
    isMandatory: true,
    validity: 'DHA license valid for 2 years, renewable',
    registrationFeeINR: 12000,
    prepTimeMonths: { min: 1, max: 3 },
    passingScore: '70% or above',
    passRate: 'Approximately 75-80% for Indian nurses with 6-8 weeks preparation',
    sections: [
      {
        name: 'Clinical Nursing Knowledge',
        description: 'Medical-surgical nursing, pharmacology, patient assessment, clinical procedures. Majority of questions.',
      },
      {
        name: 'Professional and Ethical Practice',
        description: 'Nursing ethics, UAE healthcare regulations, professional standards.',
      },
      {
        name: 'Community and Preventive Health',
        description: 'Public health principles, health promotion, UAE-specific health policies.',
      },
    ],
    prepTips: [
      'Use DHA-specific MCQ banks available online — there are several well-known banks used by candidates',
      'Focus on pharmacology — drug actions, side effects, and dosage calculations are heavily tested',
      'Study UAE nursing scope of practice and DHA regulations separately — these appear in professional sections',
      'Practice 500-800 MCQs with rationale review before attempting the exam',
      'Join online groups of nurses who have recently passed DHA — they share current question patterns',
      'Most agencies provide DHA preparation support or can recommend coaching centres',
    ],
    commonMistakes: [
      'Underestimating UAE-specific regulations and scope of practice questions',
      'Not practising pharmacology calculations — dosage questions appear regularly',
      'Using outdated question banks — DHA updates its question pool periodically',
    ],
    faqs: [
      {
        question: 'What is the difference between DHA, MOH, and HAAD exams for Indian nurses?',
        answer:
          'DHA (Dubai Health Authority) is for working in Dubai specifically. HAAD (Health Authority Abu Dhabi) was for Abu Dhabi and has now merged into DOH (Department of Health Abu Dhabi). MOH (Ministry of Health) covers all other emirates (Sharjah, Ras Al Khaimah, Fujairah, Ajman, Umm Al Quwain). Each exam is separate. Your license from one authority may not transfer to another emirate automatically.',
      },
      {
        question: 'How difficult is the DHA exam for Indian nurses?',
        answer:
          'The DHA exam is considered moderately difficult and more manageable than NCLEX or OSCE. The pass rate for Indian nurses is approximately 75-80% with 6-8 weeks of structured preparation. The exam tests clinical nursing knowledge with a strong emphasis on pharmacology and professional practice. Most Indian nurses with a strong clinical background pass in the first attempt.',
      },
      {
        question: 'Can I take the DHA exam from India?',
        answer:
          'The DHA exam must be taken at an authorized Pearson VUE test centre. There are Pearson VUE centres in several Indian cities. You do not need to travel to Dubai to take the exam. After passing, your license is processed by DHA and you can then travel to Dubai to start work.',
      },
    ],
    relatedExamSlugs: ['oet-guide', 'nclex-rn-guide'],
    relatedCountrySlugs: ['dubai'],
    lastUpdated: 'January 2025',
  },
  {
    slug: 'ahpra-registration-guide',
    examName: 'AHPRA Registration',
    examFullName: 'Australian Health Practitioner Regulation Agency Nursing Registration',
    examType: 'registration',
    applicableCountries: ['Australia'],
    applicableCountrySlugs: ['australia'],
    headline: 'AHPRA Nursing Registration Guide 2025 — Complete Process for Indian Nurses Migrating to Australia',
    tagline: 'Australia\'s nursing registration process — the gateway to one of the world\'s highest-paying nursing markets',
    overview:
      'AHPRA (Australian Health Practitioner Regulation Agency) is the national registration authority for nursing in Australia. All nurses working in Australia must be registered with AHPRA and hold an ANMAC (Australian Nursing and Midwifery Accreditation Council) skills assessment. The process is complex and often involves a bridging program if your Indian nursing qualification does not fully meet Australian standards.',
    isMandatory: true,
    validity: 'AHPRA registration renewed annually',
    registrationFeeINR: 28000,
    prepTimeMonths: { min: 6, max: 12 },
    passingScore: 'Full or Provisional registration granted after ANMAC skills assessment + AHPRA review',
    sections: [
      {
        name: 'ANMAC Skills Assessment',
        description: 'Assessment of your Indian nursing qualification against Australian standards. Most Indian BSc Nursing degrees qualify. May result in requirement for bridging program.',
      },
      {
        name: 'English Proficiency',
        description: 'OET Grade B (all four sub-tests) or IELTS Academic 7.0 in all bands. Required for international applicants.',
      },
      {
        name: 'AHPRA Application',
        description: 'Submit application with qualification documents, ANMAC assessment, English test results, statutory declaration, and references.',
      },
      {
        name: 'Bridging Program (if required)',
        description: 'Some applicants must complete a supervised bridging program at an Australian healthcare facility before full registration is granted.',
      },
    ],
    prepTips: [
      'Start the ANMAC skills assessment BEFORE approaching an agency — it takes 8-16 weeks',
      'Prepare your OET or IELTS while waiting for ANMAC results — do not wait',
      'Gather all credential documents early: degree certificate, transcripts, nursing council registration, clinical experience letters',
      'Understand that a bridging program requirement can add 3-6 months to your timeline — factor this into planning',
      'Work with an AHPRA-experienced agency — the application process is detailed and documentation errors cause delays',
      'Check the AHPRA website directly for current processing times — they change regularly',
    ],
    commonMistakes: [
      'Starting the AHPRA application before ANMAC assessment is complete',
      'Submitting documents without notarisation — AHPRA requires certified copies of all qualifications',
      'Not accounting for a possible bridging program in the timeline or budget',
      'Using an agency without Australia-specific AHPRA experience',
    ],
    faqs: [
      {
        question: 'How long does AHPRA registration take for Indian nurses?',
        answer:
          'The full AHPRA registration process takes 8-18 months for Indian nurses. ANMAC skills assessment alone takes 8-16 weeks. AHPRA application review takes a further 4-8 weeks. If a bridging program is required, add another 3-6 months. Total process from starting documents to receiving AHPRA registration number is typically 10-18 months.',
      },
      {
        question: 'Do Indian BSc Nursing graduates qualify for AHPRA registration?',
        answer:
          'Most Indian BSc Nursing (4-year) graduates are eligible for AHPRA registration, but ANMAC will assess whether a bridging program is required. Indian nursing certificates (3-year diploma) may face more scrutiny. ANMAC assessments have become stricter — the bridging program requirement has increased for international applicants in recent years.',
      },
      {
        question: 'What is the total cost of AHPRA registration for Indian nurses?',
        answer:
          'ANMAC skills assessment: AUD $400 (≈₹22,000). AHPRA application fee: AUD $100 (≈₹5,500). English test (OET): approximately ₹26,000. Total direct AHPRA-related costs: approximately ₹54,000–₹60,000. This is separate from agency fees, visa costs, and living expenses during the process.',
      },
    ],
    relatedExamSlugs: ['oet-guide', 'ielts-guide'],
    relatedCountrySlugs: ['australia'],
    lastUpdated: 'January 2025',
  },
  {
    slug: 'cbse-osce-guide',
    examName: 'CBT + OSCE',
    examFullName: 'Computer-Based Test + Objective Structured Clinical Examination (NMC UK)',
    examType: 'nursing-competency',
    applicableCountries: ['United Kingdom'],
    applicableCountrySlugs: ['uk'],
    headline: 'CBT and OSCE Guide 2025 — NMC Test of Competence for Indian Nurses Migrating to UK',
    tagline: 'UK NMC\'s two-part clinical competency test — the final step before your NMC PIN',
    overview:
      'The NMC Test of Competence has two parts: the Computer-Based Test (CBT) and the Objective Structured Clinical Examination (OSCE). The CBT tests theoretical nursing knowledge. The OSCE is a practical clinical assessment conducted in the UK at approved assessment centres. Both must be passed to receive your NMC PIN and practice legally in the UK.',
    isMandatory: true,
    validity: 'CBT: 2 years. OSCE: must be taken within 2 years of passing CBT.',
    registrationFeeINR: 35000,
    prepTimeMonths: { min: 2, max: 5 },
    passingScore: 'CBT: varies by version (typically 60-65%). OSCE: Pass in all stations.',
    passRate: 'CBT: ~80% first attempt. OSCE: ~60-65% first attempt for Indian nurses.',
    sections: [
      {
        name: 'CBT (Computer-Based Test)',
        description: 'Multiple choice questions. Tests clinical knowledge, pharmacology, professional practice, ethics. Taken in India at Pearson VUE centres.',
        duration: 'Approximately 3 hours',
      },
      {
        name: 'OSCE (Objective Structured Clinical Examination)',
        description: '16 clinical stations. Tests practical nursing skills — vital signs, medication administration, wound care, communication, infection control. Conducted in the UK.',
        duration: 'Approximately 3.5 hours across 16 stations',
      },
    ],
    prepTips: [
      'For CBT: practice NMC-specific question banks available through Pearson VUE and specialist providers',
      'For OSCE: practice clinical skills systematically — each station has a specific mark scheme',
      'Focus heavily on clinical communication — NMC OSCE assesses your ability to communicate with patients in British healthcare context',
      'Infection control and medication administration are in every OSCE — practice these to automaticity',
      'The OSCE is conducted in the UK — your agency should help arrange travel and accommodation',
      'Many nurses find the OSCE harder than expected — first-attempt pass rate is 60-65%. Do not be discouraged if a retake is needed',
      'Watch NMC OSCE YouTube preparation videos — visual learning is very effective for station preparation',
    ],
    commonMistakes: [
      'Underestimating the communication requirements of OSCE — clinical knowledge alone is insufficient',
      'Not practising the CBT in timed conditions',
      'Failing to understand the British English context of questions — some clinical terminology differs from Indian training',
      'Not preparing for the "communication" and "professional practice" OSCE stations, focusing only on clinical skills stations',
    ],
    faqs: [
      {
        question: 'Can I take the CBT in India before travelling to UK?',
        answer:
          'Yes. The CBT can be taken at Pearson VUE test centres in India. Most major Indian cities have Pearson VUE centres. This means you do not need to travel to the UK for the CBT — only for the OSCE. Passing the CBT before arriving in the UK is standard practice for Indian nurses.',
      },
      {
        question: 'How many times can I retake the OSCE?',
        answer:
          'NMC allows three attempts at the OSCE within a 2-year period from passing your CBT. If you fail all three OSCE attempts, your application lapses and you must start the process again. Most nurses pass within 1-2 attempts. A second attempt is common and not a significant setback.',
      },
      {
        question: 'What happens at an OSCE station?',
        answer:
          'Each OSCE station is 7-10 minutes and assesses a specific clinical skill or scenario. Stations include: vital signs measurement, medication administration, wound care, aseptic technique, patient assessment, handover (SBAR), communication scenarios, and professional practice situations. An assessor marks your performance against a pre-defined mark scheme.',
      },
    ],
    relatedExamSlugs: ['oet-guide', 'ielts-guide'],
    relatedCountrySlugs: ['uk'],
    lastUpdated: 'January 2025',
  },
]

export function getAllExams(): ExamPageData[] {
  return EXAMS
}

export function getExam(slug: string): ExamPageData | undefined {
  return EXAMS.find((e) => e.slug === slug)
}

export function getAllExamSlugs(): string[] {
  return EXAMS.map((e) => e.slug)
}
