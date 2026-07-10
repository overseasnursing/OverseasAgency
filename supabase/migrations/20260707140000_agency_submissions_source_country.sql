-- Source Country Foundation (Phase 4): the public agency submission form now
-- records which source country the submitting agency is for, defaulted from
-- the visitor's resolved Market Context. Mirrors agencies.source_country
-- exactly (20260706140000_multi_country_readiness.sql) — additive, defaults
-- to 'India' so existing rows and the existing submission flow are unaffected.

ALTER TABLE "public"."agency_submissions"
  ADD COLUMN IF NOT EXISTS "source_country" "text" DEFAULT 'India' NOT NULL;
