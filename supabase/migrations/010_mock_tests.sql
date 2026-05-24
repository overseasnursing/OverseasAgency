-- Mock Test Locations (Level 1)
CREATE TABLE IF NOT EXISTS public.mock_test_locations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mock Test Categories (Level 2)
CREATE TABLE IF NOT EXISTS public.mock_test_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id     UUID NOT NULL REFERENCES public.mock_test_locations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mock Tests (Level 3)
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id         UUID NOT NULL REFERENCES public.mock_test_categories(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  duration_minutes    INTEGER NOT NULL DEFAULT 60,
  total_questions     INTEGER NOT NULL DEFAULT 0,
  passing_percentage  INTEGER NOT NULL DEFAULT 60,
  instructions        TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  seo_title           TEXT,
  seo_description     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mock_test_categories_location_id ON public.mock_test_categories(location_id);
CREATE INDEX IF NOT EXISTS idx_mock_tests_category_id ON public.mock_tests(category_id);

-- RLS
ALTER TABLE public.mock_test_locations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests           ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can read active locations"   ON public.mock_test_locations  FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active categories"  ON public.mock_test_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active mock tests"  ON public.mock_tests           FOR SELECT USING (is_active = true);
