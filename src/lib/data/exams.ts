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
    lastUpdated: 'May 2026',
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
    lastUpdated: 'May 2026',
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
    lastUpdated: 'May 2026',
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
    lastUpdated: 'May 2026',
  },
  {
    slug: 'ielts-guide',
    examName: 'IELTS Academic',
    examFullName: 'International English Language Testing System — Academic',
    examType: 'language',
    applicableCountries: ['United Kingdom', 'Australia', 'Germany', 'Canada'],
    applicableCountrySlugs: ['uk', 'australia', 'germany', 'canada'],
    headline: 'IELTS Exam Guide 2025 — Complete Preparation for Indian Nurses Going to UK, Australia & Germany',
    tagline: 'Academic IELTS 7.0 — the most widely accepted English proficiency test for nursing migration across 4 countries',
    overview:
      "IELTS Academic (International English Language Testing System) is the world's most widely recognised English proficiency exam for nursing migration. For Indian nurses, IELTS Academic is accepted by the UK NMC, Australian AHPRA, and nursing regulators in Germany and Canada. The exam tests Listening, Reading, Writing, and Speaking across four separate sub-tests. A minimum score of 7.0 in every band is required for NMC (UK) and AHPRA (Australia) registration. Unlike OET, IELTS is a general academic test not specific to healthcare — but it is accepted by more countries and more immigration bodies.",
    isMandatory: true,
    validity: '2 years from the date of results',
    registrationFeeINR: 16500,
    prepTimeMonths: { min: 2, max: 4 },
    passingScore: '7.0 in all four bands — Listening, Reading, Writing, and Speaking (Academic IELTS only)',
    passRate: 'Approximately 65-72% for Indian nurses achieving 7.0 in all bands on first attempt with 2-3 months preparation',
    registrationUrl: 'https://www.ielts.org',
    sections: [
      {
        name: 'Listening',
        description: 'Four recordings — two conversations and two monologues on social and academic topics. 40 questions. Recordings play once only.',
        scoreRequired: '7.0 band (approximately 30/40 correct answers)',
        duration: '30 minutes + 10 minutes transfer time',
      },
      {
        name: 'Reading (Academic)',
        description: 'Three long reading passages from academic journals, books, or magazines. Includes True/False/Not Given, matching, sentence completion, and multiple choice.',
        scoreRequired: '7.0 band (approximately 30/40 correct answers)',
        duration: '60 minutes',
      },
      {
        name: 'Writing (Academic)',
        description: 'Task 1: Describe a graph, chart, diagram, or map in at least 150 words. Task 2: Essay responding to a point of view or argument in at least 250 words.',
        scoreRequired: '7.0 band — requires coherent argument, vocabulary range, and grammatical accuracy',
        duration: '60 minutes',
      },
      {
        name: 'Speaking',
        description: 'Three-part interview with a certified IELTS examiner. Part 1: personal questions. Part 2: long turn on a given topic card. Part 3: abstract discussion related to Part 2 topic.',
        scoreRequired: '7.0 band — requires fluency, coherence, and lexical resource',
        duration: '11–14 minutes',
      },
    ],
    prepTips: [
      'Use the official Cambridge IELTS Practice Tests (books 1–18) — the closest simulation of actual exam content',
      'Focus on IELTS Academic, not IELTS General Training — nursing registration bodies require Academic only',
      'Writing Task 1 is the most underestimated section — practise describing graphs, charts, and process diagrams daily',
      'Reading requires time management — spend no more than 20 minutes per passage',
      'Listening recordings play once only — practise active listening with British and Australian English accents',
      'For Speaking, practise answering questions fluently for 1-2 minutes without long pauses',
      'Take at least 3 full-length timed mock tests before the actual exam — each section must be done under real conditions',
      'Target 7.5 in your strongest bands to create a buffer against weaker bands — you need 7.0 in every single band',
    ],
    commonMistakes: [
      'Achieving 7.0 overall but scoring 6.5 in one band — even one band below 7.0 fails NMC and AHPRA requirements',
      'Practising General Training IELTS instead of Academic — different Reading and Writing tasks',
      'Writing under 250 words in Task 2 — automatic band penalty',
      'Not practising Writing Task 1 enough — nurses who prepare only Task 2 essays often fail Task 1',
      'Waiting until IELTS is passed before starting agency or visa applications — start paperwork in parallel',
      'Not considering OET as an alternative — OET is healthcare-specific and many Indian nurses find it easier than IELTS',
    ],
    faqs: [
      {
        question: 'What IELTS score is required for UK nursing (NMC)?',
        answer:
          'The NMC requires a minimum of 7.0 in all four IELTS Academic bands: Listening, Reading, Writing, and Speaking. The overall band score must also be 7.0 or above. A score of 6.5 in any single band — even if the overall is 7.5 — does not meet the NMC requirement. Results must be from IELTS Academic, not IELTS General Training.',
      },
      {
        question: 'Is IELTS or OET better for Indian nurses going to the UK?',
        answer:
          "Both are accepted by the NMC. OET is healthcare-specific and many Indian nurses find the clinical context (patient letters, ward briefings) more familiar than IELTS's academic essays and graph descriptions. However, IELTS is accepted by more immigration pathways and countries simultaneously. If you only plan to go to the UK, OET may be easier. If you want to keep options open for Germany or Canada, IELTS score supports more applications.",
      },
      {
        question: 'What IELTS score does AHPRA require for Australia?',
        answer:
          'AHPRA requires a minimum of 7.0 in all four IELTS Academic bands. The requirement is identical to the NMC: each of Listening, Reading, Writing, and Speaking must score 7.0 individually. One IELTS result can satisfy both NMC (UK) and AHPRA (Australia) if you are considering both countries.',
      },
      {
        question: 'How long does IELTS preparation take for Indian nurses?',
        answer:
          'Most Indian nurses need 2-4 months of structured preparation to achieve 7.0 in all bands. The Writing sub-test — particularly Task 1 graph descriptions — requires the most targeted practice. Nurses with strong English from English-medium nursing colleges often clear IELTS in 2 months. Those who studied in regional-medium institutions may need 4-6 months.',
      },
      {
        question: 'How much does the IELTS exam cost in India in 2025?',
        answer:
          'The IELTS Academic exam fee in India is approximately ₹16,500–₹17,000 per sitting, administered by the British Council or IDP. If you retake the full exam, the fee applies again. You can also apply for a Section Re-sit (EOR — Enquiry on Results) if you believe a band was marked incorrectly, but this costs approximately ₹9,000 and rarely changes scores significantly.',
      },
    ],
    relatedExamSlugs: ['oet-guide', 'nclex-rn-guide', 'ahpra-registration-guide', 'cbse-osce-guide'],
    relatedCountrySlugs: ['uk', 'australia', 'germany', 'canada'],
    lastUpdated: 'May 2026',
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
    lastUpdated: 'May 2026',
  },
  {
    slug: 'haad-exam-guide',
    examName: 'DOH / HAAD',
    examFullName: 'Department of Health Abu Dhabi — Prometric Licensing Examination (formerly HAAD)',
    examType: 'licensing',
    applicableCountries: ['United Arab Emirates'],
    applicableCountrySlugs: ['dubai'],
    headline: 'DOH / HAAD Exam Guide 2025 — Abu Dhabi Nursing License for Indian Nurses',
    tagline: 'Abu Dhabi licensing exam for nurses — required before you can work in any Abu Dhabi health facility',
    overview:
      'The Department of Health Abu Dhabi (DOH) — formerly the Health Authority Abu Dhabi (HAAD) — runs the Prometric-based licensing examination for nurses and other healthcare professionals wishing to practice in Abu Dhabi. HAAD officially merged into DOH in 2018, but the exam is still widely referred to as the HAAD exam. If you plan to work in Abu Dhabi (as opposed to Dubai or other emirates), you must pass the DOH exam and obtain a DOH licence before beginning work. Indian nurses with a BSc in Nursing and minimum two years of clinical experience are eligible to apply.',
    isMandatory: true,
    validity: '3 years from date of licensure (renewable)',
    registrationFeeINR: 12000,
    prepTimeMonths: { min: 1, max: 3 },
    passingScore: '65% or above (Prometric adaptive scoring — exact pass mark varies by version)',
    passRate: 'Approximately 55-65% first-attempt pass rate for Indian nurses with 4-6 weeks focused preparation',
    registrationUrl: 'https://doh.gov.ae',
    sections: [
      {
        name: 'Prometric Computer-Based Exam',
        description: 'Multiple choice questions covering clinical nursing, pharmacology, infection control, patient safety, and professional ethics. The exam is adaptive — question difficulty adjusts based on your answers.',
        duration: 'Approximately 2.5–3 hours',
      },
    ],
    prepTips: [
      'Use the official DOH candidate handbook to understand the exam blueprint before starting preparation',
      'Practice with Prometric nursing question banks — the question style is US-NCLEX adjacent, favouring critical thinking over rote recall',
      'Focus on pharmacology and drug calculations — these appear heavily in Gulf licensing exams',
      'Infection control, patient safety, and ethical/legal nursing are high-weightage domains',
      'HAAD/DOH questions often use scenario-based format — practice identifying the best nursing action, not just the correct fact',
      'Many Indian nurses complete preparation in 4-6 weeks of focused study using Gulf-specific question banks',
      'Book your Prometric slot early — centres in India (Pearson VUE) can fill up in busy months',
    ],
    commonMistakes: [
      'Preparing using Indian exam question banks only — Gulf licensing exams use a US/international standard that differs from Indian BSc curricula',
      'Ignoring pharmacology — drug-name recognition and safe dosage calculations are regularly tested',
      'Underestimating infection control content — WHO hand hygiene protocol and standard precautions appear frequently',
      'Confusing DOH (Abu Dhabi) jurisdiction with DHA (Dubai) — they are separate licences for separate emirates',
      'Not checking eligibility before booking — DOH requires a minimum of two years post-graduation clinical experience',
    ],
    faqs: [
      {
        question: 'Is the HAAD exam the same as the DOH exam?',
        answer:
          'Yes. HAAD (Health Authority Abu Dhabi) merged into DOH (Department of Health Abu Dhabi) in 2018. The licensing examination was transferred to DOH and is now officially called the DOH exam, though it is still commonly referred to as the HAAD exam. The format, Prometric delivery, and preparation approach are the same.',
      },
      {
        question: 'Can I take the DOH exam in India?',
        answer:
          'Yes. The exam is administered by Prometric at their authorised test centres in India. Most major cities have Prometric centres. You do not need to travel to the UAE to sit the exam.',
      },
      {
        question: 'What is the difference between DOH (HAAD), DHA, and MOH licences?',
        answer:
          'Each UAE licensing authority covers a different jurisdiction. DOH (formerly HAAD) covers Abu Dhabi emirate. DHA (Dubai Health Authority) covers Dubai emirate only. MOH (Ministry of Health) covers all remaining emirates — Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. You need the licence that matches the emirate where you will work. Most Indian nurses in Dubai hold a DHA licence.',
      },
      {
        question: 'How long is the DOH licence valid?',
        answer:
          'The DOH nursing licence is valid for three years and must be renewed before expiry. Renewal requires proof of continuing professional development (CPD) hours completed during the licence period.',
      },
      {
        question: 'What documents do Indian nurses need to apply for the DOH exam?',
        answer:
          'You will need: a valid nursing degree certificate (BSc Nursing or equivalent), transcripts, a Good Standing Certificate from the State Nursing Council, proof of minimum two years post-graduation clinical experience, a valid passport copy, and a recent passport photograph. All documents must be attested as required by DOH.',
      },
    ],
    relatedExamSlugs: ['dha-exam-guide', 'moh-exam-guide'],
    relatedCountrySlugs: ['dubai'],
    lastUpdated: 'May 2026',
  },
  {
    slug: 'moh-exam-guide',
    examName: 'MOH UAE',
    examFullName: 'Ministry of Health UAE — Prometric Nursing Licensing Examination',
    examType: 'licensing',
    applicableCountries: ['United Arab Emirates'],
    applicableCountrySlugs: ['dubai'],
    headline: 'MOH UAE Exam Guide 2025 — Northern Emirates Nursing Licence for Indian Nurses',
    tagline: 'Required for nursing practice in Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain',
    overview:
      'The Ministry of Health (MOH) UAE Prometric exam is the nursing licensing examination for the Northern Emirates — Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. It is distinct from the DHA licence (Dubai only) and the DOH / HAAD licence (Abu Dhabi only). Indian nurses who secure employment in hospitals, clinics, or healthcare facilities in any of the Northern Emirates must obtain an MOH licence before starting work. The exam is computer-based and delivered through Prometric at centres in India and the UAE.',
    isMandatory: true,
    validity: '2 years from date of registration (renewable)',
    registrationFeeINR: 10000,
    prepTimeMonths: { min: 1, max: 3 },
    passingScore: '60% or above (Prometric scoring — pass mark confirmed in candidate handbook)',
    passRate: 'Approximately 60-70% first-attempt pass rate for Indian nurses with 4-6 weeks preparation',
    registrationUrl: 'https://mohap.gov.ae',
    sections: [
      {
        name: 'Prometric Computer-Based Exam',
        description: 'Multiple choice questions covering adult health nursing, paediatric nursing, obstetric and gynaecological nursing, mental health nursing, community health, pharmacology, and professional ethics.',
        duration: 'Approximately 2–2.5 hours',
      },
    ],
    prepTips: [
      'Download the MOH exam blueprint from the MOHAP portal — it lists the exact content domains and weightages',
      'Use Prometric-style nursing question banks — MOH questions are scenario-based and reward clinical judgement over memory',
      'Pay particular attention to obstetric and paediatric nursing — these are weighted more heavily in the MOH exam than in DHA or NCLEX',
      'Community health and primary care content appears frequently — revise preventive care, health promotion, and immunisation schedules',
      'Pharmacology is a high-yield domain — focus on safe drug administration, contraindications, and common drug classes used in clinical nursing',
      'Most Indian nurses find 4-6 weeks of daily study sufficient for a first-attempt pass',
      'The MOH exam is generally considered slightly more accessible than the DHA exam — preparation time requirements are similar',
    ],
    commonMistakes: [
      'Assuming MOH and DHA preparation are identical — MOH has a different exam blueprint with different domain weightings',
      'Neglecting maternal and child health content — this is a significantly larger section in the MOH exam than in Gulf peers',
      'Using NCLEX-only question banks — while helpful, NCLEX does not cover the MOH-specific obstetric and community health weightings',
      'Not verifying which emirate your employer is in before choosing which licence to pursue — MOH does not cover Dubai or Abu Dhabi',
      'Delaying document attestation — MOH requires attested documents and this process can take several weeks from India',
    ],
    faqs: [
      {
        question: 'Which emirates require the MOH licence?',
        answer:
          'The MOH licence covers Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. It does not cover Dubai (DHA jurisdiction) or Abu Dhabi (DOH / HAAD jurisdiction). Check with your employer which emirate your facility is in before applying for the correct licence.',
      },
      {
        question: 'Can I use my MOH licence to work in Dubai?',
        answer:
          'No. The MOH licence is not valid in Dubai. Dubai is covered exclusively by the DHA (Dubai Health Authority). If you wish to transfer to a Dubai facility, you will need to obtain a DHA licence separately. Some nurses hold both — MOH for a Northern Emirates position and DHA if they later transfer to Dubai.',
      },
      {
        question: 'Can I take the MOH exam in India?',
        answer:
          'Yes. The MOH exam is administered by Prometric at authorised test centres across India. You can book through the Prometric portal once your MOH application is approved and you receive an authorisation-to-test.',
      },
      {
        question: 'What is the difference in difficulty between DHA, MOH, and DOH exams?',
        answer:
          'All three use Prometric delivery and similar multiple-choice formats. The DHA exam is widely considered the most challenging due to a larger question bank and more complex clinical scenarios. The MOH exam has heavier maternal and child health content. The DOH exam is similar in difficulty to DHA but specific to Abu Dhabi\'s healthcare standards. Most nurses who study with Prometric-specific question banks for 4-6 weeks pass on the first attempt regardless of which exam they sit.',
      },
      {
        question: 'How do I verify my State Nursing Council registration for MOH attestation?',
        answer:
          'Your State Nursing Council registration certificate must be attested by the State Home Department, then by the Ministry of External Affairs (MEA) in India, and finally by the UAE Embassy in India. This process typically takes 2-4 weeks depending on your state. Some agencies assist with the attestation process — confirm this with your recruitment agency before signing a contract.',
      },
    ],
    relatedExamSlugs: ['dha-exam-guide', 'haad-exam-guide'],
    relatedCountrySlugs: ['dubai'],
    lastUpdated: 'May 2026',
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

// Keywords that identify a mock-test location as belonging to each exam.
const EXAM_LOCATION_KEYWORDS: Record<string, string[]> = {
  'oet-guide':                  ['oet'],
  'ielts-guide':                ['ielts'],
  'nclex-rn-guide':             ['nclex'],
  'dha-exam-guide':             ['dha'],
  'haad-exam-guide':            ['haad'],
  'moh-exam-guide':             ['moh'],
  'cbse-osce-guide':            ['cbse', 'osce', 'nmc', 'cbt'],
  'ahpra-registration-guide':   ['ahpra'],
}

// Returns exam guides whose keywords match a given mock-test location slug/name.
// Used to render reciprocal exam-guide links on mock-test pages.
export function getExamGuidesForLocation(
  locationSlug: string,
  locationName: string,
): ExamPageData[] {
  const haystack = `${locationSlug} ${locationName}`.toLowerCase()
  return EXAMS.filter((exam) => {
    const keywords = EXAM_LOCATION_KEYWORDS[exam.slug] ?? []
    return keywords.some((kw) => haystack.includes(kw))
  })
}
