-- Global-expansion readiness: additive schema changes only. Nothing here
-- renames or removes an existing column, so every existing row, query, and
-- piece of application code keeps working exactly as today. This closes the
-- specific gap where the schema had literally no way to record which
-- country an agency recruits FROM (as opposed to `countries`, which is the
-- destination countries it serves) or what currency its fees are quoted in.
--
-- NOT done here (deliberately, see the architecture audit report):
-- renaming `pricing_min_lakhs`/`pricing_max_lakhs` to currency-neutral
-- names — that's a breaking change touching dozens of call sites and needs
-- its own dedicated, carefully-sequenced migration, not a bolt-on here.

-- Which country this agency recruits nurses FROM. Defaults to 'India' so
-- every existing agency's meaning is unchanged — only new agencies from
-- other source countries need this set explicitly.
ALTER TABLE "public"."agencies"
  ADD COLUMN IF NOT EXISTS "source_country" "text" DEFAULT 'India' NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_agencies_source_country"
  ON "public"."agencies" USING "btree" ("source_country");

-- Currency the agency's fee fields (pricing_min_lakhs/pricing_max_lakhs)
-- are quoted in. Defaults to 'INR' to match the existing "lakhs" unit for
-- every current row.
ALTER TABLE "public"."agencies"
  ADD COLUMN IF NOT EXISTS "pricing_currency" "text" DEFAULT 'INR' NOT NULL;

-- agencies.countries (destination countries served) is filtered via
-- array-containment (`@>`/`&&`) once destination filtering becomes a
-- primary nav path at 100+ regions — a plain btree index doesn't accelerate
-- that; GIN does.
CREATE INDEX IF NOT EXISTS "idx_agencies_countries_gin"
  ON "public"."agencies" USING "gin" ("countries");
