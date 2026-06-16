-- Adds structured fields for job posting filters: state (optional), a numeric
-- minimum experience in years, and a structured currency + amount salary.
-- Purely additive — existing "experience_required" and "salary" text columns
-- are left untouched (unused going forward, but not dropped).

ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "state" "text";
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "experience_years" integer;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "salary_currency" "text";
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "salary_amount" integer;

CREATE INDEX IF NOT EXISTS "idx_jobs_experience_years" ON "public"."jobs" USING "btree" ("experience_years");
CREATE INDEX IF NOT EXISTS "idx_jobs_salary_currency" ON "public"."jobs" USING "btree" ("salary_currency");
