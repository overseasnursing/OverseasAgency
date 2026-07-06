-- Performance fix: several frequently-filtered columns had no index at all,
-- forcing a sequential scan on every request that touches them. None of
-- these change query results — additive, safe, no behavior change.

-- agencies.is_active is filtered on nearly every public agency query
-- (listings, detail pages, sitemap, related-agencies widget, claim search).
-- Partial index since most rows are active — keeps the index small.
CREATE INDEX IF NOT EXISTS "idx_agencies_is_active"
  ON "public"."agencies" USING "btree" ("is_active")
  WHERE "is_active" = true;

-- reviews.agency_id / scam_reports.agency_id are FK columns Postgres does
-- NOT auto-index — getAgencyDetail() filters both by agency_id on every
-- single agency detail page load (the site's highest-traffic page type).
CREATE INDEX IF NOT EXISTS "idx_reviews_agency_id"
  ON "public"."reviews" USING "btree" ("agency_id");

CREATE INDEX IF NOT EXISTS "idx_scam_reports_agency_id"
  ON "public"."scam_reports" USING "btree" ("agency_id");

-- agencies.city / agencies.state back the "related agencies" widget shown
-- on every agency detail page (RelatedAgencies.tsx) and the state/city
-- directory pages.
CREATE INDEX IF NOT EXISTS "idx_agencies_city"
  ON "public"."agencies" USING "btree" ("city");

CREATE INDEX IF NOT EXISTS "idx_agencies_state"
  ON "public"."agencies" USING "btree" ("state");

-- jobs.posted_by_user_id / jobs.agency_id are FK columns used by
-- getJobsByUser() and getApplicationsByAgency()/agency-admin job listings.
CREATE INDEX IF NOT EXISTS "idx_jobs_posted_by_user_id"
  ON "public"."jobs" USING "btree" ("posted_by_user_id");

CREATE INDEX IF NOT EXISTS "idx_jobs_agency_id"
  ON "public"."jobs" USING "btree" ("agency_id");

-- mock_test_locations.is_active / mock_test_categories.is_active back
-- the sitemap generator and mock-test navigation queries.
CREATE INDEX IF NOT EXISTS "idx_mock_test_locations_is_active"
  ON "public"."mock_test_locations" USING "btree" ("is_active");

CREATE INDEX IF NOT EXISTS "idx_mock_test_categories_is_active"
  ON "public"."mock_test_categories" USING "btree" ("is_active");

-- agencies.name is searched via a leading-wildcard ILIKE (claim-listing
-- search, admin agency search) — a standard btree index can't accelerate
-- that pattern. pg_trgm + a GIN index does.
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE INDEX IF NOT EXISTS "idx_agencies_name_trgm"
  ON "public"."agencies" USING "gin" ("name" "public"."gin_trgm_ops");
