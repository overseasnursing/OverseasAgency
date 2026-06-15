

-- ── jobs ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "country" "text" NOT NULL,
    "city" "text",
    "agency_id" "uuid",
    "posted_by_user_id" "uuid" NOT NULL,
    "job_type" "text" NOT NULL,
    "experience_required" "text",
    "salary" "text",
    "description" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "expiry_date" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "jobs_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'hold'::"text", 'expired'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


-- ── job_applications ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "public"."job_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "current_country" "text" NOT NULL,
    "cv_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."job_applications" OWNER TO "postgres";


-- ── Primary keys ──────────────────────────────────────────────────────────────

ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_job_id_user_id_key" UNIQUE ("job_id", "user_id");


-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX "idx_jobs_status" ON "public"."jobs" USING "btree" ("status");



CREATE INDEX "idx_jobs_country" ON "public"."jobs" USING "btree" ("country");



CREATE INDEX "idx_jobs_slug" ON "public"."jobs" USING "btree" ("slug");



CREATE INDEX "idx_jobs_expiry_date" ON "public"."jobs" USING "btree" ("expiry_date");



CREATE INDEX "idx_job_applications_job_id" ON "public"."job_applications" USING "btree" ("job_id");



CREATE INDEX "idx_job_applications_user_id" ON "public"."job_applications" USING "btree" ("user_id");


-- ── Triggers ──────────────────────────────────────────────────────────────────

CREATE OR REPLACE TRIGGER "set_jobs_updated_at" BEFORE UPDATE ON "public"."jobs" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


-- ── Foreign keys ──────────────────────────────────────────────────────────────

ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_posted_by_user_id_fkey" FOREIGN KEY ("posted_by_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_applications" ENABLE ROW LEVEL SECURITY;


-- jobs: anyone can read approved; owners can read their own; admins read all
CREATE POLICY "jobs_select_approved" ON "public"."jobs" FOR SELECT USING (
    (("status" = 'approved'::"text") OR (("auth"."uid"() IS NOT NULL) AND ("posted_by_user_id" = "auth"."uid"())) OR "public"."is_admin"())
);



-- jobs: authenticated users can post their own jobs
CREATE POLICY "jobs_insert_authenticated" ON "public"."jobs" FOR INSERT WITH CHECK (
    (("auth"."uid"() IS NOT NULL) AND ("posted_by_user_id" = "auth"."uid"()))
);



-- jobs: only admins can update or delete
CREATE POLICY "jobs_update_admin" ON "public"."jobs" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "jobs_delete_admin" ON "public"."jobs" FOR DELETE USING ("public"."is_admin"());



-- job_applications: authenticated users can submit their own application
CREATE POLICY "job_applications_insert_authenticated" ON "public"."job_applications" FOR INSERT WITH CHECK (
    (("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"()))
);



-- job_applications: users can read their own; admins read all
CREATE POLICY "job_applications_select_own" ON "public"."job_applications" FOR SELECT USING (
    ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())) OR "public"."is_admin"())
);



-- job_applications: users can delete their own; admins can delete any
CREATE POLICY "job_applications_delete_own" ON "public"."job_applications" FOR DELETE USING (
    ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())) OR "public"."is_admin"())
);


-- ── Grants ────────────────────────────────────────────────────────────────────

GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON TABLE "public"."job_applications" TO "anon";
GRANT ALL ON TABLE "public"."job_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."job_applications" TO "service_role";
