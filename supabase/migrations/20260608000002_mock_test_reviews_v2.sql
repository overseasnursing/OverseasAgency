-- Extend mock_test_reviews: add review_title, reviewer_country; increase text limit to 2000

ALTER TABLE public.mock_test_reviews
  ADD COLUMN IF NOT EXISTS review_title      text CHECK (review_title IS NULL OR length(review_title) <= 120),
  ADD COLUMN IF NOT EXISTS reviewer_country  text CHECK (reviewer_country IS NULL OR length(reviewer_country) <= 100);

-- Widen the text limit from 1000 → 2000
ALTER TABLE public.mock_test_reviews
  DROP CONSTRAINT IF EXISTS mock_test_reviews_review_text_check;

ALTER TABLE public.mock_test_reviews
  ADD CONSTRAINT mock_test_reviews_review_text_check
  CHECK (review_text IS NULL OR length(review_text) <= 2000);
