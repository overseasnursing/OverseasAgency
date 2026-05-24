-- Add is_premium and status columns to mock_tests
ALTER TABLE public.mock_tests
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS status     TEXT    NOT NULL DEFAULT 'published';

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_mock_tests_status ON public.mock_tests(status);
