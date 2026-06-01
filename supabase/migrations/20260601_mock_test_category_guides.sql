-- Guide content for mock test category pages (SEO long-form content)
-- Each category can have at most one guide (UNIQUE on category_id)

CREATE TABLE IF NOT EXISTS mock_test_category_guides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID NOT NULL REFERENCES mock_test_categories(id) ON DELETE CASCADE,
  body            TEXT NOT NULL DEFAULT '',
  last_updated    TEXT,
  published_date  TEXT,
  modified_date   TEXT,
  author          JSONB,
  reviewer        JSONB,
  faqs            JSONB NOT NULL DEFAULT '[]',
  related_links   JSONB NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id)
);

ALTER TABLE mock_test_category_guides ENABLE ROW LEVEL SECURITY;

-- Public can read (needed for the public category page)
CREATE POLICY "Public read guide"
  ON mock_test_category_guides FOR SELECT
  USING (true);

-- Only service role (admin) can write
CREATE POLICY "Service role write guide"
  ON mock_test_category_guides FOR ALL
  USING (auth.role() = 'service_role');
