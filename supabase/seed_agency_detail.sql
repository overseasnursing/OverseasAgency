-- ── Enable RLS on new tables (admin client bypasses it, anon is blocked) ──────
ALTER TABLE public.branches    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read on branches (same as agencies)
CREATE POLICY "branches_public_read" ON public.branches
  FOR SELECT USING (true);

-- Allow public read on faqs
CREATE POLICY "faqs_public_read" ON public.agency_faqs
  FOR SELECT USING (true);

-- ── 1. Global Nursing Solutions ────────────────────────────────────────────────
UPDATE agencies SET
  description              = 'Global Nursing Solutions is one of India''s most trusted overseas nursing consultancies, established in Kochi in 2011. With over 1,420 successful placements across Germany, the UK, Canada, and Australia, we specialise in end-to-end migration support — from OET/IELTS coaching and document apostille to employer matching and visa processing. Our transparent pricing model means every cost is published upfront with a written itemised quote. No surprises, no hidden fees.',
  email                    = 'contact@globalnursingsolutions.in',
  website                  = 'https://globalnursingsolutions.in',
  whatsapp                 = '+919876543210',
  recommendation_percent   = 96,
  visa_success_rate        = 94,
  services                 = ARRAY['OET / IELTS Coaching', 'Document Apostille', 'Credential Recognition', 'Employer Matching', 'Visa Processing', 'Pre-Departure Orientation', 'Post-Arrival Support'],
  language_training_offered= true,
  post_placement_support   = true,
  pricing_min_lakhs        = 3.5,
  pricing_max_lakhs        = 5.5,
  pricing_is_approximate   = false,
  pricing_includes         = ARRAY['OET/IELTS coaching (2 attempts)', 'Document attestation & apostille', 'Credential recognition filing', 'Employer sourcing & job matching', 'Visa application support', 'Pre-departure orientation', '12-month post-arrival helpline'],
  pricing_excludes         = ARRAY['Flight tickets', 'Accommodation (first month)', 'Medical exam fees', 'Embassy VISA fees (paid to embassy)'],
  pricing_installment_available = true,
  pricing_installment_note = '50% at enrollment, 30% after employer match, 20% after visa approval',
  pricing_disclaimer       = 'Prices are in INR and are quoted before service. Any change requires written approval.',
  pricing_last_updated     = '2025-04-01',
  related_slugs            = ARRAY['nursepath-international', 'medworld-overseas', 'medlink-solutions'],
  tagline                  = 'Over 1,400 nurses placed in Germany and UK. No hidden fees — every cost published upfront.'
WHERE slug = 'global-nursing-solutions';

-- Branches
INSERT INTO branches (agency_id, name, address, city, state, country, phone, whatsapp, email, google_maps_url, is_head_office)
VALUES (
  (SELECT id FROM agencies WHERE slug='global-nursing-solutions'),
  'Kochi Head Office',
  'MG Road, Near Lulu Mall, Edappally',
  'Kochi', 'Kerala', 'India',
  '+914842345678', '+919876543210', 'kochi@globalnursingsolutions.in',
  'https://maps.google.com/?q=Global+Nursing+Solutions+Kochi',
  true
), (
  (SELECT id FROM agencies WHERE slug='global-nursing-solutions'),
  'Thiruvananthapuram Branch',
  'Statue Junction, Vazhuthacaud',
  'Thiruvananthapuram', 'Kerala', 'India',
  '+914712234567', '+919876501234', 'tvm@globalnursingsolutions.in',
  NULL,
  false
);

-- FAQs
INSERT INTO agency_faqs (agency_id, question, answer, sort_order) VALUES
  ((SELECT id FROM agencies WHERE slug='global-nursing-solutions'), 'How long does the Germany placement process take?', 'The typical timeline from enrolment to receiving your visa is 12–16 months. This includes 6–8 months for German language preparation (B2), 3–4 months for credential recognition (Berufsanerkennung), and 2–3 months for visa processing. We give you a detailed month-by-month roadmap on the first consultation.', 1),
  ((SELECT id FROM agencies WHERE slug='global-nursing-solutions'), 'Do you guarantee job placement?', 'We have a 94% visa success rate and guarantee employer matching for all enrolled candidates — meaning we will continue searching until you receive a valid job offer from a licensed German or UK employer. We do not guarantee the timeline as it depends on your language exam progress.', 2),
  ((SELECT id FROM agencies WHERE slug='global-nursing-solutions'), 'What is included in the ₹3.5–5.5L fee?', 'The fee covers OET/IELTS coaching (up to 2 attempts), all document attestation and apostille work, credential recognition filing with the German state authority, employer sourcing and job matching, visa application support, and a 12-month post-arrival helpline. Excluded: flight tickets, embassy visa fee, first-month accommodation.', 3),
  ((SELECT id FROM agencies WHERE slug='global-nursing-solutions'), 'Is German language training included?', 'Yes. We partner with certified Goethe-Institut approved institutes for A1 through B2 German training. The cost of language classes up to B2 level is included in our standard package. If you need C1 for certain hospital employers we guide you to the right resources at an additional cost.', 4),
  ((SELECT id FROM agencies WHERE slug='global-nursing-solutions'), 'Can I bring my family to Germany?', 'Yes. Once you receive your recognition and work visa, you are eligible to apply for family reunification (Familiennachzug). We provide guidance on this process at no additional charge. Most of our nurses bring their families within 18–24 months of arriving in Germany.', 5);

-- ── 2. Medworld Overseas ────────────────────────────────────────────────────────
UPDATE agencies SET
  description              = 'Medworld Overseas, based in Chennai, is a specialist UK and Australia nursing consultancy established in 2014. With 890 successful placements to UK NHS trusts and Australian hospitals, we focus exclusively on English-speaking destinations. Our in-house CBT and OSCE coaching team has helped nurses achieve a 78% first-attempt OSCE pass rate — well above the national average. We are UKVI-authorised and AHPRA-registered consultant partners.',
  email                    = 'info@medworldoverseas.com',
  website                  = 'https://medworldoverseas.com',
  whatsapp                 = '+919845123456',
  recommendation_percent   = 91,
  visa_success_rate        = 89,
  services                 = ARRAY['NMC Registration Support', 'CBT Coaching', 'OSCE Preparation', 'Employer Matching (NHS)', 'Visa & Immigration Support', 'AHPRA Registration (Australia)', 'Accommodation Guidance'],
  language_training_offered= false,
  post_placement_support   = true,
  pricing_min_lakhs        = 2.8,
  pricing_max_lakhs        = 4.5,
  pricing_is_approximate   = false,
  pricing_includes         = ARRAY['NMC application support', 'CBT coaching (2 attempts)', 'OSCE preparation programme', 'Employer matching (NHS trusts)', 'Tier 2 Health & Care Visa support', 'AHPRA registration support (Australia package)'],
  pricing_excludes         = ARRAY['NMC application fee (£140)', 'OSCE exam fee (£794)', 'Flight tickets', 'English test (OET/IELTS)'],
  pricing_installment_available = true,
  pricing_installment_note = '40% at enrolment, 60% after employer offer letter',
  pricing_disclaimer       = 'NHS employer fees (if any) are charged by the employer, not by Medworld. We do not charge referral fees.',
  pricing_last_updated     = '2025-03-15',
  related_slugs            = ARRAY['global-nursing-solutions', 'nursepath-international', 'prime-nursing-abroad'],
  tagline                  = 'Specialised in UK NHS placements. OSCE preparation included. 890+ nurses placed.'
WHERE slug = 'medworld-overseas';

INSERT INTO branches (agency_id, name, address, city, state, country, phone, whatsapp, email, google_maps_url, is_head_office)
VALUES (
  (SELECT id FROM agencies WHERE slug='medworld-overseas'),
  'Chennai Head Office',
  'Anna Salai, Teynampet',
  'Chennai', 'Tamil Nadu', 'India',
  '+914423456789', '+919845123456', 'chennai@medworldoverseas.com',
  'https://maps.google.com/?q=Medworld+Overseas+Chennai',
  true
), (
  (SELECT id FROM agencies WHERE slug='medworld-overseas'),
  'Coimbatore Branch',
  'Avinashi Road, Peelamedu',
  'Coimbatore', 'Tamil Nadu', 'India',
  '+914222345678', '+919845100001', 'coimbatore@medworldoverseas.com',
  NULL, false
);

INSERT INTO agency_faqs (agency_id, question, answer, sort_order) VALUES
  ((SELECT id FROM agencies WHERE slug='medworld-overseas'), 'What is the UK nursing registration process?', 'The process is: 1) OET/IELTS — score required; 2) NMC online application — we help with documents; 3) CBT (Computer Based Test) — we provide coaching; 4) OSCE (Objective Structured Clinical Examination) — we run 4-week intensive preparation; 5) Employer offer letter; 6) Tier 2 Health & Care Visa. Total timeline is 9–14 months depending on your exam speed.', 1),
  ((SELECT id FROM agencies WHERE slug='medworld-overseas'), 'Is there a hidden document fee?', 'One document-related cost that some clients have reported as unexpected is the apostille fee for Indian nursing certificates. This ranges from ₹8,000–12,000 depending on which state your certificates are from. We now disclose this clearly at the point of enrolment so you are not surprised.', 2),
  ((SELECT id FROM agencies WHERE slug='medworld-overseas'), 'Do you help with Australia placements too?', 'Yes. We have a dedicated Australia package covering AHPRA (Australian Health Practitioner Regulation Agency) registration support, IELTS preparation, employer matching, and skilled visa support (subclass 482 or 186). Australia timelines are longer — typically 18–24 months from start to visa.', 3),
  ((SELECT id FROM agencies WHERE slug='medworld-overseas'), 'What NHS trusts do you work with?', 'We have active partnerships with 14 NHS trusts across England and Scotland, including NHS Lothian (Edinburgh), Birmingham Community Healthcare, and several London trusts. Our job matching team will align your specialisation (ICU, OT, general medical) with appropriate trust openings.', 4);

-- ── 3. NursePath International ─────────────────────────────────────────────────
UPDATE agencies SET
  description              = 'NursePath International, founded in 2009 in Thiruvananthapuram, is India''s leading Germany-specialist nursing consultancy. With 2,100 placements, we have the highest Germany placement count of any Indian agency. We run our own in-house German language institute with batch sizes capped at 15 students per batch for quality. Our 94/100 transparency score reflects our policy of publishing every cost, every step of the process on our website.',
  email                    = 'contact@nursepath.in',
  website                  = 'https://nursepath.in',
  whatsapp                 = '+919847654321',
  recommendation_percent   = 97,
  visa_success_rate        = 96,
  services                 = ARRAY['German Language Training (A1–B2)', 'Credential Recognition (Berufsanerkennung)', 'Employer Matching (Germany, Austria, Switzerland)', 'Visa Processing', 'Pre-Departure Orientation', 'Post-Arrival Integration Support', 'German Driving License Support'],
  language_training_offered= true,
  post_placement_support   = true,
  pricing_min_lakhs        = 3.2,
  pricing_max_lakhs        = 4.8,
  pricing_is_approximate   = false,
  pricing_includes         = ARRAY['German language A1–B2 (all classes & exams)', 'Document apostille & translation', 'Credential recognition filing', 'Employer matching & job contract review', 'Visa application support', 'Pre-departure orientation (3-day residential)', 'One year post-arrival support hotline'],
  pricing_excludes         = ARRAY['Flight tickets', 'Embassy VISA fee', 'First month accommodation in Germany'],
  pricing_installment_available = true,
  pricing_installment_note = '30% at enrolment, 40% after B2 pass, 30% after visa approval',
  pricing_disclaimer       = 'All prices are fixed and published. We do not charge additional fees at any stage without written agreement.',
  pricing_last_updated     = '2025-04-10',
  related_slugs            = ARRAY['global-nursing-solutions', 'medworld-overseas', 'careplus-migration'],
  tagline                  = 'Germany specialists since 2009. 2,100 placements. Language training included. 96% visa success.'
WHERE slug = 'nursepath-international';

INSERT INTO branches (agency_id, name, address, city, state, country, phone, whatsapp, email, google_maps_url, is_head_office)
VALUES (
  (SELECT id FROM agencies WHERE slug='nursepath-international'),
  'Thiruvananthapuram Head Office',
  'Statue Junction, Medical College Road',
  'Thiruvananthapuram', 'Kerala', 'India',
  '+914712345678', '+919847654321', 'info@nursepath.in',
  'https://maps.google.com/?q=NursePath+International+Thiruvananthapuram',
  true
), (
  (SELECT id FROM agencies WHERE slug='nursepath-international'),
  'Kochi Branch',
  'Palarivattom, NH Bypass',
  'Kochi', 'Kerala', 'India',
  '+914842456789', '+919847600001', 'kochi@nursepath.in',
  NULL, false
), (
  (SELECT id FROM agencies WHERE slug='nursepath-international'),
  'Kozhikode Branch',
  'Mavoor Road, Medical College Junction',
  'Kozhikode', 'Kerala', 'India',
  '+914952567890', '+919847600002', 'kozhikode@nursepath.in',
  NULL, false
);

INSERT INTO agency_faqs (agency_id, question, answer, sort_order) VALUES
  ((SELECT id FROM agencies WHERE slug='nursepath-international'), 'How long does German B2 take for a working nurse?', 'For a working nurse starting from zero German knowledge, B2 typically takes 8–10 months studying 2 hours per day on weekdays. Our batches are structured for nurses who are still working — we schedule classes in early morning and evening slots. We have had nurses pass B2 in 6 months and some in 12 months. Average is 8 months.', 1),
  ((SELECT id FROM agencies WHERE slug='nursepath-international'), 'What is Berufsanerkennung (credential recognition)?', 'Berufsanerkennung is the process where the German state authority evaluates your Indian nursing qualification against German standards. If there are gaps (called a "deficiency notice"), you complete an adaptation course (Anpassungsqualifizierung) in a German hospital — typically 3–6 months. We handle all paperwork and guide you through the deficiency course if required.', 2),
  ((SELECT id FROM agencies WHERE slug='nursepath-international'), 'Which German states do you place nurses in?', 'We place nurses across all major German states — Bavaria (Munich), North Rhine-Westphalia (Cologne, Düsseldorf), Baden-Württemberg (Stuttgart, Freiburg), Berlin, and Hamburg. State choice depends on your specialisation and the employers we match you with. Salary ranges are similar across states.', 3),
  ((SELECT id FROM agencies WHERE slug='nursepath-international'), 'What salary can I expect in Germany?', 'Entry-level nurses in Germany earn €2,800–3,200 net per month (after tax and social contributions). With experience and German language skill, this rises to €3,500–4,500+. Nurses in ICU, operating theatre, or dialysis specialisations typically start at the higher end. We provide a salary guide for each state during consultation.', 4),
  ((SELECT id FROM agencies WHERE slug='nursepath-international'), 'Is the 3-day pre-departure orientation really useful?', 'Yes — we designed it based on feedback from nurses who felt unprepared for life in Germany. It covers: opening a German bank account, registering at the Einwohnermeldeamt (residents'' office), German health insurance (Krankenversicherung), supermarket basics, winter gear, commuting, and cultural dos and don''ts. Past participants consistently rate it 4.8/5.', 5);

-- ── 4. Sunrise Overseas Health ─────────────────────────────────────────────────
UPDATE agencies SET
  description              = 'Sunrise Overseas Health, based in Thrissur, is a Canada and Australia nursing specialist established in 2016. With 620 placements, we are known for our strong NCLEX pass rate (89% first-attempt) for Canada-bound nurses. We provide structured 16-week NCLEX coaching with mock exams. Note: some clients have reported additional fees beyond the initial quote — we are actively working to improve our pricing transparency.',
  email                    = 'info@sunriseoverseas.com',
  website                  = 'https://sunriseoverseas.com',
  whatsapp                 = '+919895123456',
  recommendation_percent   = 84,
  visa_success_rate        = 82,
  services                 = ARRAY['NCLEX Coaching (16-week)', 'IELTS/OET Preparation', 'Canada PR Pathway', 'Australia Skilled Visa', 'Employer Matching', 'Document Preparation'],
  language_training_offered= false,
  post_placement_support   = true,
  pricing_min_lakhs        = 4.0,
  pricing_max_lakhs        = 7.5,
  pricing_is_approximate   = true,
  pricing_includes         = ARRAY['NCLEX coaching programme', 'IELTS preparation (1 module)', 'Employer matching', 'Immigration filing support'],
  pricing_excludes         = ARRAY['NCLEX exam fee ($200 USD)', 'IELTS exam fee', 'Document apostille', 'Flight tickets', 'Accommodation', 'Canada PR government fees'],
  pricing_installment_available = true,
  pricing_installment_note = '50% upfront, 50% after NCLEX pass',
  pricing_disclaimer       = 'Total costs vary based on province and employer. Some clients have experienced additional charges. Get a written itemised quote before paying.',
  pricing_last_updated     = '2025-02-20',
  related_slugs            = ARRAY['global-nursing-solutions', 'medworld-overseas'],
  tagline                  = 'Canada & Australia specialists. Strong NCLEX coaching. 89% first-attempt pass rate.'
WHERE slug = 'sunrise-overseas-health';

INSERT INTO branches (agency_id, name, address, city, state, country, phone, whatsapp, email, google_maps_url, is_head_office)
VALUES (
  (SELECT id FROM agencies WHERE slug='sunrise-overseas-health'),
  'Thrissur Head Office',
  'Round North, Near Sakthan Thampuran Palace',
  'Thrissur', 'Kerala', 'India',
  '+914872345678', '+919895123456', 'info@sunriseoverseas.com',
  'https://maps.google.com/?q=Sunrise+Overseas+Health+Thrissur',
  true
);

INSERT INTO agency_faqs (agency_id, question, answer, sort_order) VALUES
  ((SELECT id FROM agencies WHERE slug='sunrise-overseas-health'), 'What is the Canada nursing immigration pathway?', 'The most common pathway is: 1) Pass NCLEX-RN; 2) Get registered with a provincial nursing body (e.g., CNO in Ontario); 3) Get a job offer from a Canadian employer; 4) Apply for a Temporary Work Permit; 5) After 1–2 years, apply for PR under Express Entry or Provincial Nominee Program. Total timeline from start to landing in Canada: 18–24 months.', 1),
  ((SELECT id FROM agencies WHERE slug='sunrise-overseas-health'), 'What extra costs should I budget for?', 'Based on feedback from past clients, you should budget for: document apostille (₹15,000–25,000), NCLEX exam fee (~₹17,000), provincial registration fee ($400–600 CAD), and first month accommodation in Canada. We now disclose these clearly upfront to avoid surprises.', 2),
  ((SELECT id FROM agencies WHERE slug='sunrise-overseas-health'), 'What is your NCLEX pass rate?', 'Our coached candidates have an 89% first-attempt NCLEX-RN pass rate over the past three years. Our 16-week programme uses UWorld + Kaplan question banks with weekly mock exams. We also provide a study schedule and weekly 1:1 progress reviews.', 3);

-- ── 5. CarePlus Migration ──────────────────────────────────────────────────────
UPDATE agencies SET
  description              = 'CarePlus Migration, based in Mumbai, serves nurses targeting Germany, Canada, and the Gulf (UAE). Established in 2017, we have placed 340 nurses and work with 60+ hospitals across Europe and the Middle East. We handle DHA/HAAD exam registration for Gulf placements and German recognition for Europe. Note: 3 hidden charge complaints have been filed — we recommend requesting an itemised quote.',
  email                    = 'contact@careplusmigration.com',
  website                  = 'https://careplusmigration.com',
  whatsapp                 = '+919820123456',
  recommendation_percent   = 79,
  visa_success_rate        = 83,
  services                 = ARRAY['Germany Placement', 'UAE/DHA Exam Support', 'Canada NCLEX Pathway', 'Document Preparation', 'Employer Matching', 'Visa Processing'],
  language_training_offered= false,
  post_placement_support   = false,
  pricing_min_lakhs        = 3.0,
  pricing_max_lakhs        = 6.0,
  pricing_is_approximate   = true,
  pricing_includes         = ARRAY['Employer matching', 'Visa application support', 'Document guidance'],
  pricing_excludes         = ARRAY['Language training', 'Exam fees', 'Apostille fees', 'Flight tickets', 'Accommodation'],
  pricing_installment_available = false,
  pricing_installment_note = NULL,
  pricing_disclaimer       = 'Prices are approximate. Some additional service charges may apply. Request a written itemised quote before paying any amount.',
  pricing_last_updated     = '2025-01-10',
  related_slugs            = ARRAY['nursepath-international', 'global-nursing-solutions'],
  tagline                  = 'Germany, Canada, and Gulf placements. 60+ hospital partners across Europe and Middle East.'
WHERE slug = 'careplus-migration';

INSERT INTO branches (agency_id, name, address, city, state, country, phone, whatsapp, email, google_maps_url, is_head_office)
VALUES (
  (SELECT id FROM agencies WHERE slug='careplus-migration'),
  'Mumbai Head Office',
  'Andheri West, Near DN Nagar Metro',
  'Mumbai', 'Maharashtra', 'India',
  '+912226789012', '+919820123456', 'contact@careplusmigration.com',
  'https://maps.google.com/?q=CarePlus+Migration+Mumbai',
  true
), (
  (SELECT id FROM agencies WHERE slug='careplus-migration'),
  'Pune Branch',
  'FC Road, Shivajinagar',
  'Pune', 'Maharashtra', 'India',
  '+912025678901', '+919820100001', 'pune@careplusmigration.com',
  NULL, false
);

INSERT INTO agency_faqs (agency_id, question, answer, sort_order) VALUES
  ((SELECT id FROM agencies WHERE slug='careplus-migration'), 'Do you place nurses in UAE and other Gulf countries?', 'Yes. For UAE placements we assist with DHA (Dubai Health Authority) and HAAD (Abu Dhabi) exam registration, employer matching, and employment visa processing. Gulf placements are typically the fastest — 3–6 months. Salary ranges from AED 5,500–8,000/month (tax-free).', 1),
  ((SELECT id FROM agencies WHERE slug='careplus-migration'), 'Why have there been hidden charge complaints?', 'In 2023–2024, some clients were charged for apostille services and a document handling fee that was not clearly stated upfront. We have revised our intake process and now provide a written itemised quote. We recommend all prospective clients ask for this document before paying anything.', 2);

-- ── 6. Prime Nursing Abroad ────────────────────────────────────────────────────
UPDATE agencies SET
  description              = 'Prime Nursing Abroad, operating from New Delhi since 2015, specialises in UK and Gulf nursing placements. With 510 placements, we are known for our fast timelines (6–10 months) and low upfront costs, making us a good option for nurses wanting a cost-effective entry into international nursing. Our focus is on UAE, Qatar, and UK NHS placements. One hidden-charge complaint on record.',
  email                    = 'info@primenursingabroad.com',
  website                  = 'https://primenursingabroad.com',
  whatsapp                 = '+919811234567',
  recommendation_percent   = 82,
  visa_success_rate        = 85,
  services                 = ARRAY['UK NHS Placement', 'UAE/Qatar Placement', 'IELTS Support', 'HAAD/DHA Exam Registration', 'Visa Processing', 'NMC Application Support'],
  language_training_offered= false,
  post_placement_support   = false,
  pricing_min_lakhs        = 1.5,
  pricing_max_lakhs        = 3.5,
  pricing_is_approximate   = true,
  pricing_includes         = ARRAY['Employer matching', 'Visa application support', 'HAAD/DHA registration guidance'],
  pricing_excludes         = ARRAY['IELTS/OET exam fees', 'NMC fee (£140)', 'OSCE fee (£794)', 'Flight tickets', 'Accommodation'],
  pricing_installment_available = false,
  pricing_installment_note = NULL,
  pricing_disclaimer       = 'Quote varies by destination country. Full breakdown provided at consultation.',
  pricing_last_updated     = '2024-12-01',
  related_slugs            = ARRAY['medworld-overseas', 'careplus-migration'],
  tagline                  = 'Fast UK and Gulf placements. Low upfront cost. 6–10 month timelines. Delhi-based.'
WHERE slug = 'prime-nursing-abroad';

INSERT INTO branches (agency_id, name, address, city, state, country, phone, whatsapp, email, google_maps_url, is_head_office)
VALUES (
  (SELECT id FROM agencies WHERE slug='prime-nursing-abroad'),
  'New Delhi Head Office',
  'Connaught Place, Near Rajiv Chowk Metro',
  'New Delhi', 'Delhi', 'India',
  '+911123456789', '+919811234567', 'info@primenursingabroad.com',
  'https://maps.google.com/?q=Prime+Nursing+Abroad+Delhi',
  true
);

INSERT INTO agency_faqs (agency_id, question, answer, sort_order) VALUES
  ((SELECT id FROM agencies WHERE slug='prime-nursing-abroad'), 'What is the fastest country option for Indian nurses?', 'Gulf countries (UAE, Qatar, Bahrain) are fastest — typically 3–6 months. Reasons: DHA/HAAD exams are straightforward, no complex credential recognition, and employers hire quickly. UK is 9–14 months. Germany is 12–18 months. If speed is your priority, we recommend UAE as a first step with a longer-term plan to move to Europe later.', 1),
  ((SELECT id FROM agencies WHERE slug='prime-nursing-abroad'), 'What is the hidden charge that was reported?', 'In 2024, one client reported an unexpected ₹22,000 document translation and notarisation fee that was not in the original quote. We have since included this in our standard quote. Always ask us for an itemised cost estimate before signing.', 2);

-- ── 7. MedLink Solutions ───────────────────────────────────────────────────────
UPDATE agencies SET
  description              = 'MedLink Solutions is a boutique nursing consultancy based in Kochi, specialising in Germany and UAE placements. Founded in 2018, we keep batch sizes small — no more than 20 active candidates per counsellor — ensuring personal attention throughout. With 290 placements and zero hidden charge reports, we focus on quality over volume. Our clients consistently cite personal responsiveness as our strongest quality.',
  email                    = 'hello@medlinksolutions.in',
  website                  = 'https://medlinksolutions.in',
  whatsapp                 = '+919946123456',
  recommendation_percent   = 87,
  visa_success_rate        = 86,
  services                 = ARRAY['Germany Placement (B1/B2 pathway)', 'UAE/DHA Placement', 'OET Preparation', 'Document Apostille', 'Employer Matching', 'Visa Support'],
  language_training_offered= true,
  post_placement_support   = true,
  pricing_min_lakhs        = 3.8,
  pricing_max_lakhs        = 5.2,
  pricing_is_approximate   = false,
  pricing_includes         = ARRAY['German language preparation (A1–B1)', 'OET coaching', 'Document apostille', 'Employer matching', 'Visa application support', 'Post-arrival WhatsApp support (6 months)'],
  pricing_excludes         = ARRAY['German B2 exam fees', 'Flight tickets', 'Accommodation', 'Embassy visa fees'],
  pricing_installment_available = true,
  pricing_installment_note = '50% at enrolment, 50% after employer offer',
  pricing_disclaimer       = 'All fees are in writing before any payment is taken. We do not accept cash.',
  pricing_last_updated     = '2025-03-01',
  related_slugs            = ARRAY['global-nursing-solutions', 'nursepath-international'],
  tagline                  = 'Boutique agency — personal support, small batches, zero hidden charges. Germany & UAE specialist.'
WHERE slug = 'medlink-solutions';

INSERT INTO branches (agency_id, name, address, city, state, country, phone, whatsapp, email, google_maps_url, is_head_office)
VALUES (
  (SELECT id FROM agencies WHERE slug='medlink-solutions'),
  'Kochi Head Office',
  'Kakkanad, Infopark Road',
  'Kochi', 'Kerala', 'India',
  '+914842678901', '+919946123456', 'hello@medlinksolutions.in',
  'https://maps.google.com/?q=MedLink+Solutions+Kochi',
  true
);

INSERT INTO agency_faqs (agency_id, question, answer, sort_order) VALUES
  ((SELECT id FROM agencies WHERE slug='medlink-solutions'), 'Why choose a boutique agency over a large one?', 'Large agencies often assign a single counsellor to 100+ candidates. With MedLink, your counsellor handles a maximum of 20 active candidates. This means you can reach them on WhatsApp, get replies within the hour on working days, and feel like a person — not a number. Past clients consistently cite personal attention as the reason they recommend us.', 1),
  ((SELECT id FROM agencies WHERE slug='medlink-solutions'), 'Do you provide German language training?', 'We partner with Goethe-Institut approved institutes and can enrol you from A1. We cover A1 and A2 preparation costs in our package. B1 and B2 exam fees are separate (approximately €200 each). We do not run an in-house language school but we closely track your progress and switch tutors if needed.', 2),
  ((SELECT id FROM agencies WHERE slug='medlink-solutions'), 'What is the Dubai DHA pathway?', 'For UAE/Dubai placements: 1) Verify your DataFlow (primary source verification) — we handle this; 2) Register and pass the DHA exam; 3) We match you with a Dubai private hospital or clinic; 4) Employment visa is sponsored by your employer. Timeline: 4–6 months. Salary: AED 5,500–8,000/month tax-free.', 3);

-- ── 8. Skyline Healthcare Abroad ───────────────────────────────────────────────
UPDATE agencies SET
  description              = 'Skyline Healthcare Abroad, Hyderabad, specialises in Gulf placements (UAE, Qatar, Saudi Arabia). Established in 2019, they are a newer agency with 120 placements. Warning: 4 hidden charge complaints have been filed and the transparency score is 48/100. Multiple clients have reported being charged extra fees after paying the initial quote. Proceed with caution and request a full written cost breakdown before paying.',
  email                    = 'info@skylinehealthcare.in',
  website                  = NULL,
  whatsapp                 = '+919989123456',
  recommendation_percent   = 61,
  visa_success_rate        = 72,
  services                 = ARRAY['UAE/DHA Placement', 'Qatar/PROMETRIC Placement', 'Saudi Arabia Placement', 'DataFlow Verification', 'Visa Processing'],
  language_training_offered= false,
  post_placement_support   = false,
  pricing_min_lakhs        = 1.0,
  pricing_max_lakhs        = 2.5,
  pricing_is_approximate   = true,
  pricing_includes         = ARRAY['Employer matching (Gulf)', 'DataFlow registration guidance', 'Basic visa support'],
  pricing_excludes         = ARRAY['DataFlow fees (~₹15,000)', 'Exam registration fees', 'Medical tests', 'Flight tickets', 'Accommodation'],
  pricing_installment_available = false,
  pricing_installment_note = NULL,
  pricing_disclaimer       = 'CAUTION: Multiple clients have reported undisclosed fees. Always request a complete written cost breakdown. Do not pay in cash.',
  pricing_last_updated     = '2024-10-01',
  related_slugs            = ARRAY['prime-nursing-abroad', 'careplus-migration'],
  tagline                  = 'CAUTION: 4 hidden charge reports. Low headline fee but multiple additional charges reported. Gulf specialist.'
WHERE slug = 'skyline-healthcare-abroad';

INSERT INTO branches (agency_id, name, address, city, state, country, phone, whatsapp, email, google_maps_url, is_head_office)
VALUES (
  (SELECT id FROM agencies WHERE slug='skyline-healthcare-abroad'),
  'Hyderabad Head Office',
  'Himayatnagar, Near MJ Market',
  'Hyderabad', 'Telangana', 'India',
  '+914023456789', '+919989123456', 'info@skylinehealthcare.in',
  NULL, true
);

INSERT INTO agency_faqs (agency_id, question, answer, sort_order) VALUES
  ((SELECT id FROM agencies WHERE slug='skyline-healthcare-abroad'), 'What are the extra costs I should know about?', 'Reported additional costs based on past client feedback: DataFlow verification (~₹15,000), DHA/HAAD exam fee (~₹8,000), mandatory medical exam (~₹5,000), police clearance (~₹2,000). Always ask for a fully itemised cost sheet before paying any amount to this agency.', 1);

-- ── 9. Heritage Medical Agency ─────────────────────────────────────────────────
UPDATE agencies SET
  description              = 'IMPORTANT NOTICE: Heritage Medical Agency has 8 scam reports filed with our platform. Multiple nurses have reported paying advance fees of ₹1.5L–3L and receiving no placement or refund. The agency has not responded to our verification requests. We strongly advise against engaging with this agency until these complaints are resolved. The agency claims to place nurses in Germany and UK.',
  email                    = 'heritage.medical@gmail.com',
  website                  = NULL,
  whatsapp                 = '+919980123456',
  recommendation_percent   = 12,
  visa_success_rate        = 15,
  services                 = ARRAY['Germany Placement (claimed)', 'UK Placement (claimed)'],
  language_training_offered= false,
  post_placement_support   = false,
  pricing_min_lakhs        = 2.5,
  pricing_max_lakhs        = 4.0,
  pricing_is_approximate   = true,
  pricing_includes         = ARRAY[],
  pricing_excludes         = ARRAY[],
  pricing_installment_available = false,
  pricing_installment_note = NULL,
  pricing_disclaimer       = 'SCAM WARNING: Do not pay any advance to this agency. 8 nurses have reported non-refunded advance payments. Verify this agency independently before engaging.',
  pricing_last_updated     = '2024-08-01',
  related_slugs            = ARRAY[],
  tagline                  = 'CAUTION: 8 scam reports. Multiple nurses report advance payment fraud. Proceed with extreme caution.'
WHERE slug = 'heritage-medical-agency';

INSERT INTO branches (agency_id, name, address, city, state, country, phone, whatsapp, email, google_maps_url, is_head_office)
VALUES (
  (SELECT id FROM agencies WHERE slug='heritage-medical-agency'),
  'Bangalore Office (reported address)',
  'Jayanagar, 4th Block',
  'Bangalore', 'Karnataka', 'India',
  '+918023456789', '+919980123456', 'heritage.medical@gmail.com',
  NULL, true
);

-- ── Update reviews to ensure they have required fields ─────────────────────────
UPDATE reviews SET
  communication_rating = overall_rating,
  transparency_rating  = CASE WHEN overall_rating >= 4 THEN overall_rating ELSE overall_rating + 1 END,
  speed_rating         = overall_rating,
  placed               = (overall_rating >= 3),
  recommends           = (overall_rating >= 4)
WHERE communication_rating IS NULL OR transparency_rating IS NULL;

-- Set realistic actual_cost_paid on reviews missing values
UPDATE reviews SET actual_cost_paid = '₹4.8L'
  WHERE actual_cost_paid IS NULL AND agency_id = (SELECT id FROM agencies WHERE slug='global-nursing-solutions')
  AND id = (SELECT id FROM reviews WHERE actual_cost_paid IS NULL AND agency_id = (SELECT id FROM agencies WHERE slug='global-nursing-solutions') LIMIT 1);

UPDATE reviews SET actual_cost_paid = '₹3.8L'
  WHERE actual_cost_paid IS NULL AND agency_id = (SELECT id FROM agencies WHERE slug='medworld-overseas')
  AND id = (SELECT id FROM reviews WHERE actual_cost_paid IS NULL AND agency_id = (SELECT id FROM agencies WHERE slug='medworld-overseas') LIMIT 1);

UPDATE reviews SET actual_cost_paid = '₹4.2L'
  WHERE actual_cost_paid IS NULL AND agency_id = (SELECT id FROM agencies WHERE slug='nursepath-international')
  AND id = (SELECT id FROM reviews WHERE actual_cost_paid IS NULL AND agency_id = (SELECT id FROM agencies WHERE slug='nursepath-international') LIMIT 1);

UPDATE reviews SET actual_cost_paid = '₹2.3L'
  WHERE actual_cost_paid IS NULL AND agency_id = (SELECT id FROM agencies WHERE slug='medlink-solutions')
  AND id = (SELECT id FROM reviews WHERE actual_cost_paid IS NULL AND agency_id = (SELECT id FROM agencies WHERE slug='medlink-solutions') LIMIT 1);
