-- Extend agencies table with full detail fields
ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS logo_url                      TEXT,
  ADD COLUMN IF NOT EXISTS description                   TEXT,
  ADD COLUMN IF NOT EXISTS email                         TEXT,
  ADD COLUMN IF NOT EXISTS website                       TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp                      TEXT,
  ADD COLUMN IF NOT EXISTS recommendation_percent        INTEGER,
  ADD COLUMN IF NOT EXISTS visa_success_rate             INTEGER,
  ADD COLUMN IF NOT EXISTS language_training_offered     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS post_placement_support        BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS services                      TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pricing_includes              TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pricing_excludes              TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pricing_installment_available BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pricing_installment_note      TEXT,
  ADD COLUMN IF NOT EXISTS pricing_disclaimer            TEXT,
  ADD COLUMN IF NOT EXISTS pricing_last_updated          TEXT,
  ADD COLUMN IF NOT EXISTS related_slugs                 TEXT[]  NOT NULL DEFAULT '{}';

-- Office branches for each agency
CREATE TABLE IF NOT EXISTS public.branches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id       UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  country         TEXT NOT NULL DEFAULT 'India',
  phone           TEXT,
  whatsapp        TEXT,
  email           TEXT,
  google_maps_url TEXT,
  is_head_office  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAQ entries per agency
CREATE TABLE IF NOT EXISTS public.agency_faqs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id   UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_branches_agency_id    ON public.branches(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_faqs_agency_id ON public.agency_faqs(agency_id);
