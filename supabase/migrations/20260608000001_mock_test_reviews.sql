-- Mock test reviews: submitted by users after completing an exam attempt

CREATE TABLE IF NOT EXISTS public.mock_test_reviews (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id   uuid        NOT NULL REFERENCES public.mock_test_categories(id) ON DELETE CASCADE,
  user_id       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name text        NOT NULL DEFAULT 'Anonymous Nurse',
  rating        integer     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  difficulty    text        NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  review_text   text        CHECK (review_text IS NULL OR length(review_text) <= 1000),
  status        text        NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mock_test_reviews_category
  ON public.mock_test_reviews(category_id, status, created_at DESC);

ALTER TABLE public.mock_test_reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public read approved"
    ON public.mock_test_reviews FOR SELECT
    USING (status = 'approved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "authenticated insert"
    ON public.mock_test_reviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

GRANT SELECT                ON public.mock_test_reviews TO anon;
GRANT SELECT, INSERT        ON public.mock_test_reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mock_test_reviews TO service_role;
