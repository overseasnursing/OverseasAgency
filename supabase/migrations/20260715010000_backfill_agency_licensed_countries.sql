-- Jobs V2 — Data Backfill (Phase 4). Populates agency_licensed_countries
-- from each agency's existing source_country. Does not touch agencies or
-- jobs. Does not populate job_eligible_countries (Phase 5+). Safe to re-run
-- — ON CONFLICT DO NOTHING against the existing unique(agency_id, country).

INSERT INTO "public"."agency_licensed_countries" ("agency_id", "country")
SELECT "a"."id", "a"."source_country"
FROM "public"."agencies" "a"
INNER JOIN "public"."country_settings" "cs" ON "cs"."source_country" = "a"."source_country"
ON CONFLICT ("agency_id", "country") DO NOTHING;

-- Agencies whose source_country has no matching row in country_settings are
-- intentionally skipped here (would otherwise violate the FK) rather than
-- failing the whole migration — see migration summary for how to find them.
