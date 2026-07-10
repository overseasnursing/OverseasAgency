-- Source Country Foundation (Phase 1): minimal Config layer for which source
-- countries are enabled. Additive only — does not touch agencies.source_country
-- or agencies.pricing_currency, both already added by
-- 20260706140000_multi_country_readiness.sql.
--
-- Deliberately minimal: no feature_flags/homepage_config/seo_settings columns
-- yet. Those belong to later phases (homepage personalization, search
-- personalization, etc.) that are explicitly out of scope for Phase 1. Add
-- them as additive columns when a real feature needs them, not preemptively.

CREATE TABLE IF NOT EXISTS "public"."country_settings" (
    "source_country" "text" NOT NULL,
    "enabled"        boolean NOT NULL DEFAULT true,
    "created_at"     timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at"     timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "country_settings_pkey" PRIMARY KEY ("source_country")
);

ALTER TABLE "public"."country_settings" OWNER TO "postgres";

-- RLS auto-enables on this table via the existing rls_auto_enable() event
-- trigger (see baseline migration). No policies are added — matching the
-- admin_profile / claim_requests lockdown precedent (20260706120000): every
-- read/write goes through Next.js server code using the service-role client
-- (createAdminClient()), which bypasses RLS. anon/authenticated get no access
-- by default, which is correct here — there is no public consumer yet.

INSERT INTO "public"."country_settings" ("source_country", "enabled")
VALUES
    ('India', true),
    ('Philippines', true)
ON CONFLICT ("source_country") DO NOTHING;
