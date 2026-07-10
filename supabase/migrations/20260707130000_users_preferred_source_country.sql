-- Source Country Foundation (Phase 2): lets a logged-in user's source-country
-- choice persist to their profile, per the resolver's priority chain
-- (profile -> cookie -> geo-suggested cookie -> default). Additive only,
-- nullable — absence means "no preference set yet", which
-- resolveSourceCountry() already treats correctly by falling through to the
-- next signal in the chain.

ALTER TABLE "public"."users"
  ADD COLUMN IF NOT EXISTS "preferred_source_country" "text";

-- No FK/check constraint against country_settings here on purpose — validity
-- and enablement are already enforced in the application layer
-- (resolveSourceCountry() / isSourceCountryEnabled()), and this column is
-- read-through-app only, never queried directly.
