-- Jobs V2 — Schema Foundation (Phase 3). Purely additive: no existing
-- column removed or renamed, no existing query affected, no application
-- code reads these objects yet. See jobs module migration notes for the
-- full phased rollout this belongs to.

-- ── jobs.eligibility_mode ───────────────────────────────────────────────────
-- Explicit sentinel so "no eligibility rows yet" is never ambiguous between
-- "not configured" and "open to everyone."
--
-- Backfill vs. going-forward default are deliberately different: adding the
-- column with DEFAULT 'worldwide' backfills EXISTING jobs to 'worldwide',
-- which accurately reflects their current real-world behaviour (unrestricted,
-- per the Phase 1 hotfix). Immediately changing the column default afterward
-- does not touch those already-written values — it only changes what a
-- FUTURE insert gets if it omits the column. New jobs must fail closed
-- ('specific_countries' + zero eligible-country rows = eligible for nobody)
-- rather than silently inheriting 'worldwide' before Phase 5's picker exists.
-- Worldwide must always be an explicit choice, never an omission default.

ALTER TABLE "public"."jobs"
  ADD COLUMN IF NOT EXISTS "eligibility_mode" "text" DEFAULT 'worldwide'::"text" NOT NULL;

ALTER TABLE "public"."jobs"
  ALTER COLUMN "eligibility_mode" SET DEFAULT 'specific_countries'::"text";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jobs_eligibility_mode_check') THEN
    ALTER TABLE ONLY "public"."jobs"
      ADD CONSTRAINT "jobs_eligibility_mode_check" CHECK (("eligibility_mode" = ANY (ARRAY['specific_countries'::"text", 'worldwide'::"text"])));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_jobs_eligibility_mode" ON "public"."jobs" USING "btree" ("eligibility_mode");

-- ── job_eligible_countries ──────────────────────────────────────────────────
-- Populated only when jobs.eligibility_mode = 'specific_countries'. Empty for
-- a 'worldwide' job by design, not by omission.

CREATE TABLE IF NOT EXISTS "public"."job_eligible_countries" (
    "id"         "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id"     "uuid" NOT NULL,
    "country"    "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "job_eligible_countries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "job_eligible_countries_job_id_country_key" UNIQUE ("job_id", "country"),
    CONSTRAINT "job_eligible_countries_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE,
    CONSTRAINT "job_eligible_countries_country_fkey" FOREIGN KEY ("country") REFERENCES "public"."country_settings"("source_country")
);

ALTER TABLE "public"."job_eligible_countries" OWNER TO "postgres";

CREATE INDEX IF NOT EXISTS "idx_job_eligible_countries_job_id" ON "public"."job_eligible_countries" USING "btree" ("job_id");
CREATE INDEX IF NOT EXISTS "idx_job_eligible_countries_country" ON "public"."job_eligible_countries" USING "btree" ("country");

-- ── agency_licensed_countries ───────────────────────────────────────────────
-- Regulatory fact about the agency (which markets it's authorised to
-- recruit from), independent of any single job's own eligibility. Effective
-- visibility for a nurse = intersection of this table and
-- job_eligible_countries, computed by application code in a later phase.

CREATE TABLE IF NOT EXISTS "public"."agency_licensed_countries" (
    "id"         "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id"  "uuid" NOT NULL,
    "country"    "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "agency_licensed_countries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "agency_licensed_countries_agency_id_country_key" UNIQUE ("agency_id", "country"),
    CONSTRAINT "agency_licensed_countries_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE,
    CONSTRAINT "agency_licensed_countries_country_fkey" FOREIGN KEY ("country") REFERENCES "public"."country_settings"("source_country")
);

ALTER TABLE "public"."agency_licensed_countries" OWNER TO "postgres";

CREATE INDEX IF NOT EXISTS "idx_agency_licensed_countries_agency_id" ON "public"."agency_licensed_countries" USING "btree" ("agency_id");
CREATE INDEX IF NOT EXISTS "idx_agency_licensed_countries_country" ON "public"."agency_licensed_countries" USING "btree" ("country");

-- RLS enabled, no policies — matches "no public consumer yet." All current
-- and near-term access goes through the service-role client, which bypasses
-- RLS regardless, so this only closes off anon/authenticated PostgREST
-- access; it does not affect this codebase's own read/write paths. Real
-- policies get added in the phase that introduces a public consumer.
-- (country_settings has the same pre-existing gap but is out of this
-- migration's scope — unchanged here.)

ALTER TABLE "public"."job_eligible_countries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."agency_licensed_countries" ENABLE ROW LEVEL SECURITY;
