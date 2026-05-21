-- Add office hours and coordinates to branches
ALTER TABLE public.branches
  ADD COLUMN IF NOT EXISTS office_hours TEXT,
  ADD COLUMN IF NOT EXISTS latitude     NUMERIC(10, 7),
  ADD COLUMN IF NOT EXISTS longitude    NUMERIC(10, 7);
