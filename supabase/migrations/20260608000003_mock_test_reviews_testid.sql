-- Link reviews to a specific test within the category
ALTER TABLE public.mock_test_reviews
  ADD COLUMN IF NOT EXISTS mock_test_id uuid REFERENCES public.mock_tests(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_mock_test_reviews_test
  ON public.mock_test_reviews(mock_test_id);
