-- Add Google review fallback fields to agencies
ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS google_place_id     TEXT,
  ADD COLUMN IF NOT EXISTS google_rating       NUMERIC(2, 1),
  ADD COLUMN IF NOT EXISTS google_review_count INTEGER;
