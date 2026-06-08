// Static FAQ fallback for mock test category pages that don't yet have full guide content.
// Keyed by exam type detection (slug substring match).
// When a category has guide content with its own FAQs, those take precedence.

export type FaqItem = { q: string; a: string }

const DHA_FAQS: FaqItem[] = [
  {
    q: 'What is the passing score for the DHA nursing exam?',
    a: 'The DHA (Dubai Health Authority) nursing exam requires a minimum passing score of 60% (90 out of 150 questions). Candidates who score below 60% must wait 90 days before retaking the exam.',
  },
  {
    q: 'How many questions are in the DHA nursing exam?',
    a: 'The DHA nursing exam consists of 150 multiple-choice questions covering clinical subjects including Medical-Surgical Nursing, Pediatrics, Obstetrics, Psychiatric Nursing, Community Health, and Pharmacology.',
  },
  {
    q: 'How long is the DHA nursing exam?',
    a: 'Candidates have 2 hours and 45 minutes (165 minutes) to complete the 150-question DHA nursing exam. This averages to approximately 66 seconds per question.',
  },
  {
    q: 'How long does it take to receive DHA exam results?',
    a: 'DHA exam results are typically available within 5–10 working days after the exam date. Results are sent to the candidate\'s registered email and are accessible via the Dubai Health Authority\'s online portal.',
  },
  {
    q: 'How many times can I retake the DHA nursing exam?',
    a: 'There is no limit on the number of times you can attempt the DHA exam. However, there is a mandatory 90-day waiting period between attempts if you do not pass.',
  },
  {
    q: 'What subjects are covered in the DHA nursing exam?',
    a: 'The DHA nursing exam covers: Medical-Surgical Nursing (30%), Pharmacology (15%), Pediatric Nursing (15%), Obstetrics and Gynecology (15%), Psychiatric and Mental Health Nursing (10%), Community and Public Health Nursing (10%), and Fundamentals of Nursing (5%).',
  },
  {
    q: 'How much does the DHA nursing exam cost?',
    a: 'The DHA exam fee is approximately AED 500–600 (around ₹11,000–13,000) for the examination. Additional fees may apply for DataFlow verification, document attestation, and eligibility processing — typically AED 1,000–1,500 total.',
  },
  {
    q: 'What documents are required to apply for the DHA nursing exam?',
    a: 'Required documents include: valid passport, nursing degree certificate with transcripts, registration certificate from your home country, experience certificates, a passport-size photo, and a valid DataFlow verification report. All documents must be attested.',
  },
]

const HAAD_FAQS: FaqItem[] = [
  {
    q: 'What is the HAAD / DOH nursing exam?',
    a: 'The HAAD exam (now called DOH — Department of Health Abu Dhabi) is the mandatory licensing examination for nurses wishing to practice in Abu Dhabi, UAE. Passing this exam is required to obtain your Abu Dhabi Health Authority (HAAD) license.',
  },
  {
    q: 'How many questions are in the HAAD nursing exam?',
    a: 'The HAAD nursing exam consists of 100 multiple-choice questions. Topics include Medical-Surgical Nursing, Fundamentals, Pharmacology, Pediatrics, Obstetrics, Psychiatry, and Community Health.',
  },
  {
    q: 'What is the passing score for the HAAD nursing exam?',
    a: 'The HAAD nursing exam requires a passing score of 60% or above. Candidates who do not pass must wait a minimum of 3 months before attempting again.',
  },
  {
    q: 'How long is the HAAD nursing exam?',
    a: 'Candidates are given 2 hours to complete the 100-question HAAD nursing exam, averaging 72 seconds per question.',
  },
  {
    q: 'How do I apply for the HAAD nursing exam from India?',
    a: 'The process involves: (1) Complete DataFlow primary source verification, (2) Submit your application via the DOH Sheryan portal, (3) Pay the exam fee, (4) Schedule your exam at an approved Prometric test centre. Most Indian nurses use a licensed recruitment agency to navigate this process.',
  },
  {
    q: 'What is the difference between DHA and HAAD / DOH exams?',
    a: 'DHA (Dubai Health Authority) is for nursing practice in Dubai, while HAAD/DOH (Department of Health) is for Abu Dhabi. Both are UAE licensing exams with similar format, but they are separate bodies — you need to pass the relevant exam for the emirate where you\'ll work.',
  },
  {
    q: 'How much does the HAAD / DOH nursing exam cost?',
    a: 'The exam fee is approximately AED 700–800. Combined with DataFlow verification (AED 700–900) and document processing, total costs are typically AED 1,500–2,000 (₹33,000–44,000).',
  },
]

const MOH_FAQS: FaqItem[] = [
  {
    q: 'What is the MOH nursing exam?',
    a: 'The MOH (Ministry of Health) exam is required for nurses seeking to practice in other UAE emirates including Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. It is administered by the UAE Ministry of Health and Prevention (MOHAP).',
  },
  {
    q: 'How many questions are in the MOH nursing exam?',
    a: 'The MOH nursing exam typically consists of 100 multiple-choice questions covering the same core clinical subjects as the DHA and HAAD exams.',
  },
  {
    q: 'What is the passing mark for the MOH nursing exam?',
    a: 'The MOH nursing exam requires a minimum passing score of 65%. Candidates must retake the full exam if they do not achieve this score.',
  },
  {
    q: 'How long is the MOH nursing exam?',
    a: 'The exam duration is 2 hours for 100 questions. Time management is important — practice completing questions within 72 seconds each.',
  },
  {
    q: 'Can I work in Dubai with an MOH nursing license?',
    a: 'No. The MOH license only covers the non-DHA, non-DOH emirates. To practice in Dubai you need a DHA license, and for Abu Dhabi you need a DOH/HAAD license. These are separate regulatory bodies.',
  },
  {
    q: 'How do I prepare for the MOH nursing exam?',
    a: 'Recommended preparation: (1) Review all core nursing subjects with focus on anatomy, pharmacology, and medical-surgical topics, (2) Practice with MOH-format mock tests (150 questions, 60% pass mark), (3) Study for 2–3 months minimum, (4) Focus on areas like wound care, drug calculations, and patient safety protocols.',
  },
]

const PROMETRIC_FAQS: FaqItem[] = [
  {
    q: 'What is the Prometric nursing exam?',
    a: 'Prometric is the test delivery service used for nursing licensing exams across multiple Middle Eastern countries including Saudi Arabia (SCFHS/NCLEX-style), Bahrain, Qatar, Oman, and Kuwait. Each country has its own syllabus but all use Prometric test centres for delivery.',
  },
  {
    q: 'How many questions are in the Prometric nursing exam?',
    a: 'This varies by country. Saudi Arabia (SCFHS): 100 questions, 2 hours. Qatar: 150 questions, 3.5 hours. Bahrain: 100 questions, 2.5 hours. Oman: 100 questions, 2 hours. Check the specific country\'s health authority for exact details.',
  },
  {
    q: 'What is the passing score for Prometric nursing exams?',
    a: 'Passing scores vary: Saudi Arabia SCFHS requires 60%, Qatar QCHP requires 60%, Bahrain NHRA requires 60%, Oman OMSB requires 65%. Always verify the current passing mark with the specific health authority.',
  },
  {
    q: 'How do I book a Prometric nursing exam?',
    a: 'After receiving your authorization-to-test (ATT) from the relevant health authority, visit the Prometric website (prometric.com), select your exam program, choose a test centre and date in your country. Test centres for Indian nurses are available in major cities.',
  },
  {
    q: 'How long is a Prometric exam result valid?',
    a: 'Passing scores are generally valid for 2 years from the exam date. You must complete your license registration within this period, otherwise you may need to reappear for the exam.',
  },
  {
    q: 'What subjects are covered in the Prometric nursing exam?',
    a: 'Core subjects include: Medical-Surgical Nursing, Pharmacology, Fundamentals of Nursing, Pediatric Nursing, Obstetrics and Gynecology, Psychiatric Nursing, and Community Health. Saudi SCFHS also tests leadership and management concepts.',
  },
]

const NCLEX_FAQS: FaqItem[] = [
  {
    q: 'What is the NCLEX-RN exam?',
    a: 'The NCLEX-RN (National Council Licensure Examination for Registered Nurses) is the standardized nursing licensing exam required to practice as a Registered Nurse in the USA and Canada. It is computer-adaptive (CAT) and administered by Pearson VUE.',
  },
  {
    q: 'How many questions are in the NCLEX-RN?',
    a: 'The Next Generation NCLEX (NGN) uses a computer-adaptive format with a minimum of 85 and maximum of 150 questions. The exam ends when the system has determined competence or incompetence with 95% confidence, or at the 150-question maximum.',
  },
  {
    q: 'What is the passing standard for NCLEX-RN?',
    a: 'NCLEX uses a pass/fail system based on ability estimation, not a fixed percentage score. The CAT algorithm determines if your demonstrated nursing knowledge meets the minimum competency standard. There is no "passing score" to target — sustained performance above the standard determines the pass decision.',
  },
  {
    q: 'How long do Indian nurses take to prepare for NCLEX?',
    a: 'Most Indian nurses require 3–6 months of focused preparation. Key resources include Saunders Comprehensive Review, UWorld question bank (minimum 2,000 practice questions), and Next Generation NCLEX (NGN) case study practice. Strong anatomy, pharmacology, and clinical judgment skills are essential.',
  },
  {
    q: 'What is the NCLEX exam fee for Indian nurses?',
    a: 'The NCLEX registration fee is USD 200 (approximately ₹16,600). You will also need to pay state nursing board application fees (USD 100–300), credential evaluation fees (typically through CGFNS), and English proficiency test costs (IELTS or TOEFL).',
  },
  {
    q: 'Can I take NCLEX in India?',
    a: 'Yes. Since 2023, Pearson VUE offers NCLEX testing at select centres in India. This eliminated the need to travel abroad for the exam. Check the Pearson VUE website for available test centre locations in India.',
  },
]

const OET_FAQS: FaqItem[] = [
  {
    q: 'What is the OET exam for nurses?',
    a: 'OET (Occupational English Test) is an English language proficiency exam specifically designed for healthcare professionals, including nurses. It is accepted by nursing regulatory bodies in UK, Ireland, Australia, New Zealand, Canada, UAE, and many other countries as proof of English proficiency.',
  },
  {
    q: 'What OET score do nurses need to pass?',
    a: 'Most nursing regulatory bodies require a Grade B (equivalent to IELTS 7.0) in all four sub-tests: Listening, Reading, Writing, and Speaking. Some authorities such as AHPRA (Australia) accept a Grade C+ in some sub-tests — always verify with the specific regulatory body.',
  },
  {
    q: 'How is OET different from IELTS for nurses?',
    a: 'OET uses healthcare-specific contexts throughout — the reading passages, listening clips, writing tasks, and speaking role plays all involve medical scenarios relevant to nursing. Many nurses find this more relevant and easier to prepare for than IELTS\'s general academic content. OET Writing requires producing a referral letter, not an essay.',
  },
  {
    q: 'How long does OET preparation take for Indian nurses?',
    a: 'With consistent study, most nurses need 2–4 months to prepare for OET. Key areas: build healthcare vocabulary, practice listening to medical conversations, master the referral letter format for Writing, and practice clinical role-play scenarios for Speaking.',
  },
  {
    q: 'How much does OET cost?',
    a: 'OET costs approximately USD 587 (around ₹49,000) for the full exam (all four sub-tests). Individual sub-tests can be retaken separately. OET on Computer is available at test centres across India.',
  },
  {
    q: 'Is OET or IELTS better for nurses going to Germany?',
    a: 'For Germany, neither OET nor IELTS is typically required for nursing registration — German B2 language proficiency (TestDaF or Goethe-Zertifikat) is required instead. OET and IELTS are primarily for English-speaking destination countries (UK, Australia, Canada, UAE).',
  },
]

const CBT_FAQS: FaqItem[] = [
  {
    q: 'What is the NMC CBT exam for nurses?',
    a: 'The NMC CBT (Nursing and Midwifery Council Computer Based Test) is the first of two tests required for internationally educated nurses to register with the NMC and practice as Registered Nurses in the UK. It tests theoretical nursing knowledge and is taken before the OSCE.',
  },
  {
    q: 'How many questions are in the NMC CBT?',
    a: 'The NMC CBT consists of 120 questions: 80 single-best-answer questions and 40 multiple-response questions, to be answered in 3 hours. Questions are based on the NMC Code and UK nursing standards.',
  },
  {
    q: 'What is the passing score for the NMC CBT?',
    a: 'The NMC CBT requires a minimum pass mark of 60% (72 out of 120 questions). Results are provided immediately after the exam. Candidates who do not pass can retake after a minimum wait time.',
  },
  {
    q: 'Where can Indian nurses take the NMC CBT exam?',
    a: 'The NMC CBT is available at Pearson VUE test centres. Centres are available in major Indian cities including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, and Kolkata. This means you do not need to travel to the UK to take the CBT.',
  },
  {
    q: 'What comes after passing the NMC CBT?',
    a: 'After passing the CBT, you must pass the OSCE (Objective Structured Clinical Examination), which is a practical clinical skills assessment taken at an NMC-approved assessment centre in the UK. This must be completed within the NMC application timeline.',
  },
  {
    q: 'How long is the NMC CBT result valid?',
    a: 'CBT results are valid for 2 years. You must complete your full NMC application, including passing the OSCE, within this 2-year window. If the CBT expires, you must retake it.',
  },
  {
    q: 'How do I prepare for the NMC CBT exam?',
    a: 'Focus on the NMC Code of Conduct, medicines management and drug calculations, UK safeguarding procedures, infection control, mental health Act provisions, and end-of-life care standards. Practice with CBT-format mock tests and study materials aligned to the NMC\'s published test blueprint.',
  },
]

// Map exam type by detecting keywords in the category slug
export function getFaqsForCategory(categorySlug: string): FaqItem[] {
  const s = categorySlug.toLowerCase()
  if (s.includes('dha'))                    return DHA_FAQS
  if (s.includes('haad') || s.includes('doh')) return HAAD_FAQS
  if (s.includes('moh'))                    return MOH_FAQS
  if (s.includes('prometric'))              return PROMETRIC_FAQS
  if (s.includes('nclex'))                  return NCLEX_FAQS
  if (s.includes('oet'))                    return OET_FAQS
  if (s.includes('cbt') || s.includes('nmc') || s.includes('osce')) return CBT_FAQS
  return []
}
