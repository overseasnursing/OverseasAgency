-- Reviews for sunrise-overseas-health
INSERT INTO reviews (agency_id, agency_slug, agency_name, author_name, author_from, overall_rating, review_text, communication_rating, transparency_rating, speed_rating, recommends, placed, actual_cost_paid, timeline_months, country_placed, surprise_charges, status, created_at)
VALUES
  (
    (SELECT id FROM agencies WHERE slug='sunrise-overseas-health'),
    'sunrise-overseas-health', 'Sunrise Overseas Health',
    'Divya S.', 'Palakkad, Kerala', 4,
    'NCLEX coaching was really strong. The 16-week programme with UWorld question banks was thorough. I passed NCLEX on first attempt. The final cost was slightly higher than quoted — two additional fees (apostille and provincial registration) were not disclosed upfront. Still got to Toronto in 15 months. Would recommend but ask for full itemised costs first.',
    4, 3, 3, true, true, '₹6.1L', 15, 'Canada', 'yes', 'approved',
    NOW() - INTERVAL '4 months'
  ),
  (
    (SELECT id FROM agencies WHERE slug='sunrise-overseas-health'),
    'sunrise-overseas-health', 'Sunrise Overseas Health',
    'Lakshmi N.', 'Thrissur, Kerala', 3,
    'Mixed experience. The NCLEX preparation was good and I passed. However costs were higher than original quote by about Rs.70,000. The agency was responsive when I raised concerns. I am now working in Ontario. Would cautiously recommend for the NCLEX coaching specifically.',
    3, 2, 3, false, true, '₹5.8L', 18, 'Canada', 'yes', 'approved',
    NOW() - INTERVAL '2 months'
  );

-- Reviews for prime-nursing-abroad
INSERT INTO reviews (agency_id, agency_slug, agency_name, author_name, author_from, overall_rating, review_text, communication_rating, transparency_rating, speed_rating, recommends, placed, actual_cost_paid, timeline_months, country_placed, surprise_charges, status, created_at)
VALUES
  (
    (SELECT id FROM agencies WHERE slug='prime-nursing-abroad'),
    'prime-nursing-abroad', 'Prime Nursing Abroad',
    'Jisha T.', 'Delhi, Delhi', 4,
    'Placed in Dubai in 7 months for under Rs.2.5L. Not the most responsive agency but delivered what they promised. DHA exam guidance was solid. Good for Gulf placements if you want fast, affordable migration. Would not use them for Germany but for UAE they are fine.',
    3, 4, 4, true, true, '₹2.4L', 7, 'UAE', NULL, 'approved',
    NOW() - INTERVAL '6 months'
  ),
  (
    (SELECT id FROM agencies WHERE slug='prime-nursing-abroad'),
    'prime-nursing-abroad', 'Prime Nursing Abroad',
    'Reshma T.', 'Bangalore, Karnataka', 4,
    'Good agency for Gulf placements. I got a job offer in Qatar (Hamad Medical) in 8 months. They were hard to reach on weekends with 2-3 day response times. Total cost was within the quoted range. HAAD exam support was good.',
    3, 4, 4, true, true, '₹2.8L', 8, 'Qatar', NULL, 'approved',
    NOW() - INTERVAL '3 months'
  );

-- Reviews for skyline-healthcare-abroad
INSERT INTO reviews (agency_id, agency_slug, agency_name, author_name, author_from, overall_rating, review_text, communication_rating, transparency_rating, speed_rating, recommends, placed, actual_cost_paid, timeline_months, country_placed, surprise_charges, status, created_at)
VALUES
  (
    (SELECT id FROM agencies WHERE slug='skyline-healthcare-abroad'),
    'skyline-healthcare-abroad', 'Skyline Healthcare Abroad',
    'Sunitha B.', 'Hyderabad, Telangana', 3,
    'I ended up paying Rs.35,000 more than the quoted price. Agency was hard to reach once I had paid. Got placed eventually in Dubai but stressful experience. DHA exam support was adequate. Would not recommend due to transparency issues.',
    2, 2, 3, false, true, '₹2.1L', 8, 'UAE', 'yes', 'approved',
    NOW() - INTERVAL '7 months'
  ),
  (
    (SELECT id FROM agencies WHERE slug='skyline-healthcare-abroad'),
    'skyline-healthcare-abroad', 'Skyline Healthcare Abroad',
    'Preethi K.', 'Hyderabad, Telangana', 2,
    'Multiple fees appeared that were not in my original agreement. When I asked for receipts they were slow to provide them. Eventually placed in Saudi Arabia but the process was very stressful. There are better agencies with more transparency.',
    2, 1, 2, false, true, '₹2.6L', 10, 'Saudi Arabia', 'yes', 'approved',
    NOW() - INTERVAL '5 months'
  );

-- Reviews for heritage-medical-agency
INSERT INTO reviews (agency_id, agency_slug, agency_name, author_name, author_from, overall_rating, review_text, communication_rating, transparency_rating, speed_rating, recommends, placed, actual_cost_paid, timeline_months, country_placed, surprise_charges, status, created_at)
VALUES
  (
    (SELECT id FROM agencies WHERE slug='heritage-medical-agency'),
    'heritage-medical-agency', 'Heritage Medical Agency',
    'Meena L.', 'Mysore, Karnataka', 1,
    'Paid Rs.3L advance for Germany placement. Agency became unreachable after 3 months. Filed police complaint. The offer letters they showed were fake — I verified directly with German hospitals. Do not give them any money. Complete fraud.',
    1, 1, 1, false, false, '₹3.0L', 0, 'Placement failed', 'yes', 'approved',
    NOW() - INTERVAL '8 months'
  ),
  (
    (SELECT id FROM agencies WHERE slug='heritage-medical-agency'),
    'heritage-medical-agency', 'Heritage Medical Agency',
    'Anuja R.', 'Bangalore, Karnataka', 1,
    'Complete scam. Paid Rs.3.8L total over several months. Every payment was followed by another mandatory fee. Eventually the office closed and all contacts went silent. Filed FIR. This agency destroyed 18 months of my life and my savings.',
    1, 1, 1, false, false, '₹3.8L', 0, 'Placement failed', 'yes', 'approved',
    NOW() - INTERVAL '10 months'
  );

-- Reviews for careplus-migration
INSERT INTO reviews (agency_id, agency_slug, agency_name, author_name, author_from, overall_rating, review_text, communication_rating, transparency_rating, speed_rating, recommends, placed, actual_cost_paid, timeline_months, country_placed, surprise_charges, status, created_at)
VALUES
  (
    (SELECT id FROM agencies WHERE slug='careplus-migration'),
    'careplus-migration', 'CarePlus Migration',
    'Reshma N.', 'Pune, Maharashtra', 4,
    'Process was smooth but I had to pay Rs.45,000 extra for an apostille service they did not mention initially. Agency responded quickly when I flagged it. Eventually placed in Germany in 12 months. Good results overall but get everything in writing upfront.',
    4, 3, 3, true, true, '₹5.1L', 12, 'Germany', 'yes', 'approved',
    NOW() - INTERVAL '5 months'
  ),
  (
    (SELECT id FROM agencies WHERE slug='careplus-migration'),
    'careplus-migration', 'CarePlus Migration',
    'Vijay P.', 'Mumbai, Maharashtra', 4,
    'Good agency for UAE placement. Got placed in Abu Dhabi in 6 months. DHA exam support was helpful. The quote was mostly accurate — one extra fee for medical exam (Rs.6,000) was not mentioned initially. Overall satisfied with the result.',
    4, 3, 4, true, true, '₹3.2L', 6, 'UAE', 'yes', 'approved',
    NOW() - INTERVAL '3 months'
  );

-- Final verification
SELECT a.slug, COUNT(r.id) as reviews
FROM agencies a LEFT JOIN reviews r ON r.agency_id = a.id AND r.status = 'approved'
GROUP BY a.slug ORDER BY reviews DESC;
