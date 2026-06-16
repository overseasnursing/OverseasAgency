-- Restores schema accidentally dropped by 20260615110042_my_feature.sql, which
-- was deleted after being identified as a destructive auto-generated migration.
-- This migration is purely additive (CREATE / ADD COLUMN only) — no drops.
-- Every object creation is guarded with an explicit existence check so this is
-- safe to run against a database that already has some/all of these objects
-- (e.g. local, via baseline.sql) as well as one missing all of them (production).
-- NOTE: this restores SCHEMA only. Row data deleted by the original DROP TABLE
-- statements (mock_test_reviews, claim_requests, agency_submissions, agency_votes)
-- is not recoverable through this migration.

-- ── agencies: re-add dropped columns ──────────────────────────────────────────

ALTER TABLE "public"."agencies" ADD COLUMN IF NOT EXISTS "pricing_is_free" boolean DEFAULT false NOT NULL;
ALTER TABLE "public"."agencies" ADD COLUMN IF NOT EXISTS "pricing_free_note" "text";
ALTER TABLE "public"."agencies" ADD COLUMN IF NOT EXISTS "mea_license_url" "text";
ALTER TABLE "public"."agencies" ADD COLUMN IF NOT EXISTS "company_registration_url" "text";
ALTER TABLE "public"."agencies" ADD COLUMN IF NOT EXISTS "seo_title" "text";
ALTER TABLE "public"."agencies" ADD COLUMN IF NOT EXISTS "seo_description" "text";
ALTER TABLE "public"."agencies" ADD COLUMN IF NOT EXISTS "is_claimed" boolean DEFAULT false NOT NULL;
ALTER TABLE "public"."agencies" ADD COLUMN IF NOT EXISTS "claimed_by_user_id" "uuid";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agencies_claimed_by_user_id_fkey') THEN
    ALTER TABLE ONLY "public"."agencies"
      ADD CONSTRAINT "agencies_claimed_by_user_id_fkey" FOREIGN KEY ("claimed_by_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
  END IF;
END $$;

-- ── admin_profile: re-add dropped columns ─────────────────────────────────────

ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "site_facebook_url" "text";
ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "site_instagram_url" "text";
ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "site_twitter_url" "text";
ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "site_linkedin_url" "text";
ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "site_youtube_url" "text";
ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "site_whatsapp_url" "text";
ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "sendpulse_api_id" "text";
ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "sendpulse_api_secret" "text";
ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "email_from_name" "text";
ALTER TABLE "public"."admin_profile" ADD COLUMN IF NOT EXISTS "email_from_email" "text";

-- ── users: re-add dropped columns ─────────────────────────────────────────────

ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "admin_name" "text";
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "admin_permissions" "text"[];

-- ── blog_posts / branches / mock_test_category_guides: re-add dropped columns ─

ALTER TABLE "public"."blog_posts" ADD COLUMN IF NOT EXISTS "faqs" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL;
ALTER TABLE "public"."branches" ADD COLUMN IF NOT EXISTS "pin_code" "text";
ALTER TABLE "public"."mock_test_category_guides" ADD COLUMN IF NOT EXISTS "destination_overrides" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL;

-- ── agency_submissions: recreate dropped table ────────────────────────────────

CREATE TABLE IF NOT EXISTS "public"."agency_submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_name" "text" NOT NULL,
    "city" "text" NOT NULL,
    "state" "text" NOT NULL,
    "website" "text",
    "email" "text" NOT NULL,
    "phone" "text",
    "whatsapp" "text",
    "description" "text",
    "countries_served" "text"[] DEFAULT '{}'::"text"[],
    "services" "text"[] DEFAULT '{}'::"text"[],
    "established_year" integer,
    "contact_name" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "contact_phone" "text",
    "designation" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "rejection_reason" "text",
    "reviewed_at" timestamp with time zone,
    "agency_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "agency_submissions_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);

ALTER TABLE "public"."agency_submissions" OWNER TO "postgres";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agency_submissions_pkey') THEN
    ALTER TABLE ONLY "public"."agency_submissions" ADD CONSTRAINT "agency_submissions_pkey" PRIMARY KEY ("id");
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agency_submissions_agency_id_fkey') THEN
    ALTER TABLE ONLY "public"."agency_submissions"
      ADD CONSTRAINT "agency_submissions_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_agency_submissions_email" ON "public"."agency_submissions" USING "btree" ("contact_email");
CREATE INDEX IF NOT EXISTS "idx_agency_submissions_status" ON "public"."agency_submissions" USING "btree" ("status");

ALTER TABLE "public"."agency_submissions" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agency_submissions' AND policyname = 'agency_submissions_service_role_all') THEN
    CREATE POLICY "agency_submissions_service_role_all" ON "public"."agency_submissions" USING (true);
  END IF;
END $$;

GRANT ALL ON TABLE "public"."agency_submissions" TO "anon";
GRANT ALL ON TABLE "public"."agency_submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."agency_submissions" TO "service_role";

-- ── agency_votes: recreate dropped table ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS "public"."agency_votes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "vote" boolean NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."agency_votes" OWNER TO "postgres";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agency_votes_pkey') THEN
    ALTER TABLE ONLY "public"."agency_votes" ADD CONSTRAINT "agency_votes_pkey" PRIMARY KEY ("id");
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agency_votes_agency_id_user_id_key') THEN
    ALTER TABLE ONLY "public"."agency_votes" ADD CONSTRAINT "agency_votes_agency_id_user_id_key" UNIQUE ("agency_id", "user_id");
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agency_votes_agency_id_fkey') THEN
    ALTER TABLE ONLY "public"."agency_votes"
      ADD CONSTRAINT "agency_votes_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agency_votes_user_id_fkey') THEN
    ALTER TABLE ONLY "public"."agency_votes"
      ADD CONSTRAINT "agency_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
  END IF;
END $$;

ALTER TABLE "public"."agency_votes" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agency_votes' AND policyname = 'agency_votes_delete') THEN
    CREATE POLICY "agency_votes_delete" ON "public"."agency_votes" FOR DELETE USING (("auth"."uid"() = "user_id"));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agency_votes' AND policyname = 'agency_votes_insert') THEN
    CREATE POLICY "agency_votes_insert" ON "public"."agency_votes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agency_votes' AND policyname = 'agency_votes_select') THEN
    CREATE POLICY "agency_votes_select" ON "public"."agency_votes" FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agency_votes' AND policyname = 'agency_votes_update') THEN
    CREATE POLICY "agency_votes_update" ON "public"."agency_votes" FOR UPDATE USING (("auth"."uid"() = "user_id"));
  END IF;
END $$;

GRANT SELECT,MAINTAIN ON TABLE "public"."agency_votes" TO "anon";
GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE "public"."agency_votes" TO "authenticated";
GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE "public"."agency_votes" TO "service_role";

-- ── claim_requests: recreate dropped table ────────────────────────────────────

CREATE TABLE IF NOT EXISTS "public"."claim_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "contact_name" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "contact_phone" "text",
    "designation" "text" NOT NULL,
    "message" "text",
    "status" "text" DEFAULT 'pending_verification'::"text" NOT NULL,
    "otp_hash" "text",
    "otp_expires_at" timestamp with time zone,
    "otp_verified_at" timestamp with time zone,
    "user_id" "uuid",
    "reviewed_by" "uuid",
    "reviewed_at" timestamp with time zone,
    "rejection_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "claim_requests_status_check" CHECK (("status" = ANY (ARRAY['pending_verification'::"text", 'pending_approval'::"text", 'rejected'::"text", 'approved'::"text"])))
);

ALTER TABLE "public"."claim_requests" OWNER TO "postgres";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'claim_requests_pkey') THEN
    ALTER TABLE ONLY "public"."claim_requests" ADD CONSTRAINT "claim_requests_pkey" PRIMARY KEY ("id");
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'claim_requests_agency_id_fkey') THEN
    ALTER TABLE ONLY "public"."claim_requests"
      ADD CONSTRAINT "claim_requests_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'claim_requests_reviewed_by_fkey') THEN
    ALTER TABLE ONLY "public"."claim_requests"
      ADD CONSTRAINT "claim_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'claim_requests_user_id_fkey') THEN
    ALTER TABLE ONLY "public"."claim_requests"
      ADD CONSTRAINT "claim_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_claim_requests_agency_id" ON "public"."claim_requests" USING "btree" ("agency_id");
CREATE INDEX IF NOT EXISTS "idx_claim_requests_email" ON "public"."claim_requests" USING "btree" ("contact_email");
CREATE INDEX IF NOT EXISTS "idx_claim_requests_status" ON "public"."claim_requests" USING "btree" ("status");

ALTER TABLE "public"."claim_requests" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'claim_requests' AND policyname = 'claim_requests_service_role_all') THEN
    CREATE POLICY "claim_requests_service_role_all" ON "public"."claim_requests" USING (true);
  END IF;
END $$;

GRANT ALL ON TABLE "public"."claim_requests" TO "anon";
GRANT ALL ON TABLE "public"."claim_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."claim_requests" TO "service_role";

-- ── mock_test_reviews: recreate dropped table (schema only — prior rows are gone) ─

CREATE TABLE IF NOT EXISTS "public"."mock_test_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "reviewer_name" "text" DEFAULT 'Anonymous Nurse'::"text" NOT NULL,
    "rating" integer NOT NULL,
    "difficulty" "text" NOT NULL,
    "review_text" "text",
    "status" "text" DEFAULT 'approved'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "review_title" "text",
    "reviewer_country" "text",
    "mock_test_id" "uuid",
    CONSTRAINT "mock_test_reviews_difficulty_check" CHECK (("difficulty" = ANY (ARRAY['easy'::"text", 'medium'::"text", 'hard'::"text"]))),
    CONSTRAINT "mock_test_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "mock_test_reviews_review_text_check" CHECK ((("review_text" IS NULL) OR ("length"("review_text") <= 2000))),
    CONSTRAINT "mock_test_reviews_review_title_check" CHECK ((("review_title" IS NULL) OR ("length"("review_title") <= 120))),
    CONSTRAINT "mock_test_reviews_reviewer_country_check" CHECK ((("reviewer_country" IS NULL) OR ("length"("reviewer_country") <= 100))),
    CONSTRAINT "mock_test_reviews_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);

ALTER TABLE "public"."mock_test_reviews" OWNER TO "postgres";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mock_test_reviews_pkey') THEN
    ALTER TABLE ONLY "public"."mock_test_reviews" ADD CONSTRAINT "mock_test_reviews_pkey" PRIMARY KEY ("id");
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mock_test_reviews_category_id_fkey') THEN
    ALTER TABLE ONLY "public"."mock_test_reviews"
      ADD CONSTRAINT "mock_test_reviews_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."mock_test_categories"("id") ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mock_test_reviews_mock_test_id_fkey') THEN
    ALTER TABLE ONLY "public"."mock_test_reviews"
      ADD CONSTRAINT "mock_test_reviews_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "public"."mock_tests"("id") ON DELETE SET NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mock_test_reviews_user_id_fkey') THEN
    ALTER TABLE ONLY "public"."mock_test_reviews"
      ADD CONSTRAINT "mock_test_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_mock_test_reviews_category" ON "public"."mock_test_reviews" USING "btree" ("category_id", "status", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_mock_test_reviews_test" ON "public"."mock_test_reviews" USING "btree" ("mock_test_id");

ALTER TABLE "public"."mock_test_reviews" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mock_test_reviews' AND policyname = 'authenticated insert') THEN
    CREATE POLICY "authenticated insert" ON "public"."mock_test_reviews" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "user_id") OR ("user_id" IS NULL)));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mock_test_reviews' AND policyname = 'public read approved') THEN
    CREATE POLICY "public read approved" ON "public"."mock_test_reviews" FOR SELECT USING (("status" = 'approved'::"text"));
  END IF;
END $$;

GRANT ALL ON TABLE "public"."mock_test_reviews" TO "anon";
GRANT ALL ON TABLE "public"."mock_test_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."mock_test_reviews" TO "service_role";
