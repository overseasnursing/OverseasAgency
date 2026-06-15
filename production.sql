


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_blog_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_blog_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_mock_test_question_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE public.mock_tests
     SET total_questions = (SELECT COUNT(*) FROM public.mock_test_questions WHERE mock_test_id = COALESCE(NEW.mock_test_id, OLD.mock_test_id) AND is_active = true),
         updated_at = now()
   WHERE id = COALESCE(NEW.mock_test_id, OLD.mock_test_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."sync_mock_test_question_count"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_profile" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author_display_name" "text" DEFAULT ''::"text" NOT NULL,
    "author_slug" "text" DEFAULT ''::"text" NOT NULL,
    "author_role_title" "text" DEFAULT ''::"text" NOT NULL,
    "author_short_bio" "text" DEFAULT ''::"text" NOT NULL,
    "author_long_bio" "text" DEFAULT ''::"text" NOT NULL,
    "author_profile_photo" "text" DEFAULT ''::"text" NOT NULL,
    "author_years_experience" integer,
    "author_expertise_areas" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "author_content_specialties" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "author_linkedin_url" "text",
    "author_facebook_url" "text",
    "author_instagram_url" "text",
    "author_twitter_url" "text",
    "author_youtube_url" "text",
    "reviewer_display_name" "text" DEFAULT ''::"text" NOT NULL,
    "reviewer_slug" "text" DEFAULT ''::"text" NOT NULL,
    "reviewer_title" "text" DEFAULT ''::"text" NOT NULL,
    "reviewer_short_bio" "text" DEFAULT ''::"text" NOT NULL,
    "reviewer_long_bio" "text" DEFAULT ''::"text" NOT NULL,
    "reviewer_profile_photo" "text" DEFAULT ''::"text" NOT NULL,
    "reviewer_years_experience" integer,
    "reviewer_registration_number" "text",
    "reviewer_issuing_authority" "text",
    "reviewer_expertise_areas" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "reviewer_specialties" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "reviewer_credential_summary" "text" DEFAULT ''::"text" NOT NULL,
    "reviewer_linkedin_url" "text",
    "reviewer_facebook_url" "text",
    "reviewer_instagram_url" "text",
    "reviewer_twitter_url" "text",
    "reviewer_youtube_url" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "site_facebook_url" "text",
    "site_instagram_url" "text",
    "site_twitter_url" "text",
    "site_linkedin_url" "text",
    "site_youtube_url" "text",
    "site_whatsapp_url" "text",
    "sendpulse_api_id" "text",
    "sendpulse_api_secret" "text",
    "email_from_name" "text",
    "email_from_email" "text"
);


ALTER TABLE "public"."admin_profile" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agencies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "city" "text" NOT NULL,
    "state" "text" NOT NULL,
    "location" "text" NOT NULL,
    "established" integer,
    "trust_level" "text" DEFAULT 'unverified'::"text" NOT NULL,
    "rating" numeric(3,2),
    "review_count" integer DEFAULT 0 NOT NULL,
    "placement_count" integer DEFAULT 0 NOT NULL,
    "transparency_score" integer,
    "countries" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "exams_supported" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "pricing_min_lakhs" numeric(5,2),
    "pricing_max_lakhs" numeric(5,2),
    "pricing_is_approximate" boolean DEFAULT true NOT NULL,
    "hidden_charges_reported" integer DEFAULT 0 NOT NULL,
    "visa_sponsorship" boolean DEFAULT false NOT NULL,
    "average_timeline_months" "text",
    "tagline" "text",
    "featured" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "logo_url" "text",
    "description" "text",
    "email" "text",
    "website" "text",
    "whatsapp" "text",
    "recommendation_percent" integer,
    "visa_success_rate" integer,
    "language_training_offered" boolean DEFAULT false NOT NULL,
    "post_placement_support" boolean DEFAULT false NOT NULL,
    "services" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "pricing_includes" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "pricing_excludes" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "pricing_installment_available" boolean DEFAULT false NOT NULL,
    "pricing_installment_note" "text",
    "pricing_disclaimer" "text",
    "pricing_last_updated" "text",
    "related_slugs" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "featured_image_url" "text",
    "mea_license_no" "text",
    "mea_license_expiry" "date",
    "company_registration_no" "text",
    "certifications" "text"[] DEFAULT '{}'::"text"[],
    "language_institute_name" "text",
    "batch_type" "text",
    "class_schedule_note" "text",
    "video_testimonials" "text"[] DEFAULT '{}'::"text"[],
    "social_links" "jsonb" DEFAULT '{}'::"jsonb",
    "current_openings_url" "text",
    "google_place_id" "text",
    "google_rating" numeric(2,1),
    "google_review_count" integer,
    "pricing_is_free" boolean DEFAULT false NOT NULL,
    "pricing_free_note" "text",
    "mea_license_url" "text",
    "company_registration_url" "text",
    "seo_title" "text",
    "seo_description" "text",
    "is_claimed" boolean DEFAULT false NOT NULL,
    "claimed_by_user_id" "uuid",
    CONSTRAINT "agencies_trust_level_check" CHECK (("trust_level" = ANY (ARRAY['verified'::"text", 'trusted'::"text", 'unverified'::"text", 'scam-reported'::"text"])))
);


ALTER TABLE "public"."agencies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agency_faqs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "question" "text" NOT NULL,
    "answer" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."agency_faqs" OWNER TO "postgres";


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


CREATE TABLE IF NOT EXISTS "public"."agency_votes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "vote" boolean NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."agency_votes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "excerpt" "text",
    "content" "text",
    "cover_image_url" "text",
    "author_name" "text" DEFAULT 'OverseasNursing Team'::"text",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "published_at" timestamp with time zone,
    "seo_title" "text",
    "seo_description" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "faqs" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    CONSTRAINT "blog_posts_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text"])))
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."branches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "address" "text" NOT NULL,
    "city" "text" NOT NULL,
    "state" "text" NOT NULL,
    "country" "text" DEFAULT 'India'::"text" NOT NULL,
    "phone" "text",
    "whatsapp" "text",
    "email" "text",
    "google_maps_url" "text",
    "is_head_office" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "office_hours" "text",
    "latitude" numeric(10,7),
    "longitude" numeric(10,7),
    "pin_code" "text"
);


ALTER TABLE "public"."branches" OWNER TO "postgres";


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


CREATE TABLE IF NOT EXISTS "public"."mock_test_answers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "attempt_id" "uuid" NOT NULL,
    "question_id" "uuid" NOT NULL,
    "selected_answer" character(1),
    "is_correct" boolean,
    "marks_awarded" integer DEFAULT 0 NOT NULL,
    "answered_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "mock_test_answers_selected_answer_check" CHECK (("selected_answer" = ANY (ARRAY['A'::"bpchar", 'B'::"bpchar", 'C'::"bpchar", 'D'::"bpchar"])))
);


ALTER TABLE "public"."mock_test_answers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mock_test_attempts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "mock_test_id" "uuid" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "submitted_at" timestamp with time zone,
    "status" "text" DEFAULT 'in_progress'::"text" NOT NULL,
    "total_questions" integer DEFAULT 0 NOT NULL,
    "total_marks" integer DEFAULT 0 NOT NULL,
    "obtained_marks" integer DEFAULT 0 NOT NULL,
    "percentage" numeric(5,2),
    "time_taken_seconds" integer,
    "shuffled_question_order" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "display_name" "text",
    CONSTRAINT "mock_test_attempts_status_check" CHECK (("status" = ANY (ARRAY['in_progress'::"text", 'submitted'::"text", 'expired'::"text"])))
);


ALTER TABLE "public"."mock_test_attempts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mock_test_bookmarks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "question_id" "uuid" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."mock_test_bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mock_test_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "location_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "seo_title" "text",
    "seo_description" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."mock_test_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mock_test_category_guides" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "body" "text" DEFAULT ''::"text" NOT NULL,
    "last_updated" "text",
    "published_date" "text",
    "modified_date" "text",
    "author" "jsonb",
    "reviewer" "jsonb",
    "faqs" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "related_links" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "destination_overrides" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);


ALTER TABLE "public"."mock_test_category_guides" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mock_test_locations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "country_slug" "text"
);


ALTER TABLE "public"."mock_test_locations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mock_test_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "mock_test_id" "uuid" NOT NULL,
    "question_text" "text" NOT NULL,
    "option_a" "text" NOT NULL,
    "option_b" "text" NOT NULL,
    "option_c" "text" NOT NULL,
    "option_d" "text" NOT NULL,
    "correct_answer" character(1) NOT NULL,
    "explanation" "text",
    "explanation_image_url" "text",
    "learning_notes" "text",
    "difficulty" "text" DEFAULT 'medium'::"text" NOT NULL,
    "marks" integer DEFAULT 1 NOT NULL,
    "image_url" "text",
    "randomize_options" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "mock_test_questions_correct_answer_check" CHECK (("correct_answer" = ANY (ARRAY['A'::"bpchar", 'B'::"bpchar", 'C'::"bpchar", 'D'::"bpchar"]))),
    CONSTRAINT "mock_test_questions_difficulty_check" CHECK (("difficulty" = ANY (ARRAY['easy'::"text", 'medium'::"text", 'hard'::"text"]))),
    CONSTRAINT "mock_test_questions_marks_check" CHECK (("marks" >= 1))
);


ALTER TABLE "public"."mock_test_questions" OWNER TO "postgres";


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


CREATE TABLE IF NOT EXISTS "public"."mock_tests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "duration_minutes" integer DEFAULT 60 NOT NULL,
    "total_questions" integer DEFAULT 0 NOT NULL,
    "passing_percentage" integer DEFAULT 60 NOT NULL,
    "instructions" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "seo_title" "text",
    "seo_description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "leaderboard_enabled" boolean DEFAULT false NOT NULL,
    "is_premium" boolean DEFAULT false NOT NULL,
    "status" "text" DEFAULT 'published'::"text" NOT NULL,
    "publish_at" timestamp with time zone,
    CONSTRAINT "mock_tests_status_check" CHECK (("status" = ANY (ARRAY['published'::"text", 'draft'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."mock_tests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "payload" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "sent_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."notification_queue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid",
    "agency_slug" "text" NOT NULL,
    "agency_name" "text" NOT NULL,
    "user_id" "uuid",
    "author_name" "text" NOT NULL,
    "author_from" "text" NOT NULL,
    "country_placed" "text" NOT NULL,
    "exam_taken" "text",
    "timeline_months" integer,
    "actual_cost_paid" "text",
    "overall_rating" integer NOT NULL,
    "communication_rating" integer,
    "transparency_rating" integer,
    "speed_rating" integer,
    "review_text" "text" NOT NULL,
    "surprise_charges" "text",
    "advice" "text",
    "placed" boolean DEFAULT false NOT NULL,
    "recommends" boolean DEFAULT true NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "moderated_by" "uuid",
    "moderated_at" timestamp with time zone,
    "reject_reason" "text",
    "helpful_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "reviews_communication_rating_check" CHECK ((("communication_rating" >= 1) AND ("communication_rating" <= 5))),
    CONSTRAINT "reviews_overall_rating_check" CHECK ((("overall_rating" >= 1) AND ("overall_rating" <= 5))),
    CONSTRAINT "reviews_speed_rating_check" CHECK ((("speed_rating" >= 1) AND ("speed_rating" <= 5))),
    CONSTRAINT "reviews_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"]))),
    CONSTRAINT "reviews_transparency_rating_check" CHECK ((("transparency_rating" >= 1) AND ("transparency_rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."scam_evidence" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "scam_report_id" "uuid" NOT NULL,
    "storage_path" "text" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."scam_evidence" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."scam_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "agency_id" "uuid",
    "agency_slug" "text" NOT NULL,
    "agency_name" "text" NOT NULL,
    "user_id" "uuid",
    "reporter_name" "text" NOT NULL,
    "reporter_from" "text" NOT NULL,
    "category" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "country_promised" "text" NOT NULL,
    "amount_lost" numeric(10,2),
    "amount_paid" numeric(10,2),
    "amount_recovered" numeric(10,2),
    "incident_date" "date",
    "incident_text" "text" NOT NULL,
    "warning_signs_missed" "text"[],
    "lessons_learned" "text"[],
    "emotional_experience" "text",
    "resolved" boolean DEFAULT false NOT NULL,
    "agency_responded" boolean DEFAULT false NOT NULL,
    "agency_response_text" "text",
    "evidence_count" integer DEFAULT 0 NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "moderated_by" "uuid",
    "moderated_at" timestamp with time zone,
    "reject_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "scam_reports_category_check" CHECK (("category" = ANY (ARRAY['fee-fraud'::"text", 'fake-job'::"text", 'document-fraud'::"text", 'visa-fraud'::"text", 'abandonment'::"text", 'other'::"text"]))),
    CONSTRAINT "scam_reports_severity_check" CHECK (("severity" = ANY (ARRAY['critical'::"text", 'high'::"text", 'moderate'::"text"]))),
    CONSTRAINT "scam_reports_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."scam_reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "achievement_key" "text" NOT NULL,
    "unlocked_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_notification_preferences" (
    "user_id" "uuid" NOT NULL,
    "email_on_completion" boolean DEFAULT true NOT NULL,
    "email_on_achievement" boolean DEFAULT true NOT NULL,
    "email_streak_reminder" boolean DEFAULT false NOT NULL,
    "push_enabled" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_notification_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "full_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_streaks" (
    "user_id" "uuid" NOT NULL,
    "current_streak" integer DEFAULT 0 NOT NULL,
    "longest_streak" integer DEFAULT 0 NOT NULL,
    "last_study_date" "date",
    "total_study_days" integer DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_streaks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "display_name" "text",
    "role" "text" DEFAULT 'registered_user'::"text" NOT NULL,
    "is_banned" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "admin_name" "text",
    "admin_permissions" "text"[],
    CONSTRAINT "users_role_check" CHECK (("role" = ANY (ARRAY['registered_user'::"text", 'agency'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_profile"
    ADD CONSTRAINT "admin_profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agencies"
    ADD CONSTRAINT "agencies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agencies"
    ADD CONSTRAINT "agencies_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."agency_faqs"
    ADD CONSTRAINT "agency_faqs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agency_submissions"
    ADD CONSTRAINT "agency_submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agency_votes"
    ADD CONSTRAINT "agency_votes_agency_id_user_id_key" UNIQUE ("agency_id", "user_id");



ALTER TABLE ONLY "public"."agency_votes"
    ADD CONSTRAINT "agency_votes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."branches"
    ADD CONSTRAINT "branches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."claim_requests"
    ADD CONSTRAINT "claim_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_test_answers"
    ADD CONSTRAINT "mock_test_answers_attempt_id_question_id_key" UNIQUE ("attempt_id", "question_id");



ALTER TABLE ONLY "public"."mock_test_answers"
    ADD CONSTRAINT "mock_test_answers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_test_attempts"
    ADD CONSTRAINT "mock_test_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_test_bookmarks"
    ADD CONSTRAINT "mock_test_bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_test_bookmarks"
    ADD CONSTRAINT "mock_test_bookmarks_user_id_question_id_key" UNIQUE ("user_id", "question_id");



ALTER TABLE ONLY "public"."mock_test_categories"
    ADD CONSTRAINT "mock_test_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_test_categories"
    ADD CONSTRAINT "mock_test_categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."mock_test_category_guides"
    ADD CONSTRAINT "mock_test_category_guides_category_id_key" UNIQUE ("category_id");



ALTER TABLE ONLY "public"."mock_test_category_guides"
    ADD CONSTRAINT "mock_test_category_guides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_test_locations"
    ADD CONSTRAINT "mock_test_locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_test_locations"
    ADD CONSTRAINT "mock_test_locations_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."mock_test_questions"
    ADD CONSTRAINT "mock_test_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_test_reviews"
    ADD CONSTRAINT "mock_test_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_tests"
    ADD CONSTRAINT "mock_tests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mock_tests"
    ADD CONSTRAINT "mock_tests_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."notification_queue"
    ADD CONSTRAINT "notification_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scam_evidence"
    ADD CONSTRAINT "scam_evidence_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scam_reports"
    ADD CONSTRAINT "scam_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scam_reports"
    ADD CONSTRAINT "scam_reports_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_achievement_key_key" UNIQUE ("user_id", "achievement_key");



ALTER TABLE ONLY "public"."user_notification_preferences"
    ADD CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_streaks"
    ADD CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "blog_posts_slug_idx" ON "public"."blog_posts" USING "btree" ("slug");



CREATE INDEX "blog_posts_status_published_at_idx" ON "public"."blog_posts" USING "btree" ("status", "published_at" DESC);



CREATE INDEX "idx_achievements_user_id" ON "public"."user_achievements" USING "btree" ("user_id");



CREATE INDEX "idx_agencies_slug" ON "public"."agencies" USING "btree" ("slug");



CREATE INDEX "idx_agencies_trust_level" ON "public"."agencies" USING "btree" ("trust_level");



CREATE INDEX "idx_agency_faqs_agency_id" ON "public"."agency_faqs" USING "btree" ("agency_id");



CREATE INDEX "idx_agency_submissions_email" ON "public"."agency_submissions" USING "btree" ("contact_email");



CREATE INDEX "idx_agency_submissions_status" ON "public"."agency_submissions" USING "btree" ("status");



CREATE INDEX "idx_answers_attempt_id" ON "public"."mock_test_answers" USING "btree" ("attempt_id");



CREATE INDEX "idx_answers_question_id" ON "public"."mock_test_answers" USING "btree" ("question_id");



CREATE INDEX "idx_attempts_expires_at" ON "public"."mock_test_attempts" USING "btree" ("expires_at");



CREATE INDEX "idx_attempts_leaderboard" ON "public"."mock_test_attempts" USING "btree" ("mock_test_id", "percentage" DESC, "time_taken_seconds") WHERE ("status" = 'submitted'::"text");



CREATE INDEX "idx_attempts_status" ON "public"."mock_test_attempts" USING "btree" ("status");



CREATE INDEX "idx_attempts_test_id" ON "public"."mock_test_attempts" USING "btree" ("mock_test_id");



CREATE INDEX "idx_attempts_user_id" ON "public"."mock_test_attempts" USING "btree" ("user_id");



CREATE INDEX "idx_bookmarks_question_id" ON "public"."mock_test_bookmarks" USING "btree" ("question_id");



CREATE INDEX "idx_bookmarks_user_id" ON "public"."mock_test_bookmarks" USING "btree" ("user_id");



CREATE INDEX "idx_branches_agency_id" ON "public"."branches" USING "btree" ("agency_id");



CREATE INDEX "idx_claim_requests_agency_id" ON "public"."claim_requests" USING "btree" ("agency_id");



CREATE INDEX "idx_claim_requests_email" ON "public"."claim_requests" USING "btree" ("contact_email");



CREATE INDEX "idx_claim_requests_status" ON "public"."claim_requests" USING "btree" ("status");



CREATE INDEX "idx_mock_test_categories_location_id" ON "public"."mock_test_categories" USING "btree" ("location_id");



CREATE INDEX "idx_mock_test_questions_active" ON "public"."mock_test_questions" USING "btree" ("is_active");



CREATE INDEX "idx_mock_test_questions_difficulty" ON "public"."mock_test_questions" USING "btree" ("difficulty");



CREATE INDEX "idx_mock_test_questions_sort" ON "public"."mock_test_questions" USING "btree" ("mock_test_id", "sort_order");



CREATE INDEX "idx_mock_test_questions_test_id" ON "public"."mock_test_questions" USING "btree" ("mock_test_id");



CREATE INDEX "idx_mock_test_reviews_category" ON "public"."mock_test_reviews" USING "btree" ("category_id", "status", "created_at" DESC);



CREATE INDEX "idx_mock_test_reviews_test" ON "public"."mock_test_reviews" USING "btree" ("mock_test_id");



CREATE INDEX "idx_mock_tests_category_id" ON "public"."mock_tests" USING "btree" ("category_id");



CREATE INDEX "idx_mock_tests_premium" ON "public"."mock_tests" USING "btree" ("is_premium");



CREATE INDEX "idx_mock_tests_status" ON "public"."mock_tests" USING "btree" ("status");



CREATE INDEX "idx_notif_user_unsent" ON "public"."notification_queue" USING "btree" ("user_id", "sent_at") WHERE ("sent_at" IS NULL);



CREATE INDEX "idx_reviews_agency_slug" ON "public"."reviews" USING "btree" ("agency_slug");



CREATE INDEX "idx_reviews_status" ON "public"."reviews" USING "btree" ("status");



CREATE INDEX "idx_scam_reports_agency_slug" ON "public"."scam_reports" USING "btree" ("agency_slug");



CREATE INDEX "idx_scam_reports_status" ON "public"."scam_reports" USING "btree" ("status");



CREATE UNIQUE INDEX "idx_unique_active_attempt" ON "public"."mock_test_attempts" USING "btree" ("user_id", "mock_test_id") WHERE ("status" = 'in_progress'::"text");



CREATE OR REPLACE TRIGGER "blog_posts_updated_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."set_blog_updated_at"();



CREATE OR REPLACE TRIGGER "set_agencies_updated_at" BEFORE UPDATE ON "public"."agencies" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_reviews_updated_at" BEFORE UPDATE ON "public"."reviews" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_scam_reports_updated_at" BEFORE UPDATE ON "public"."scam_reports" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_sync_question_count" AFTER INSERT OR DELETE OR UPDATE ON "public"."mock_test_questions" FOR EACH ROW EXECUTE FUNCTION "public"."sync_mock_test_question_count"();



ALTER TABLE ONLY "public"."agencies"
    ADD CONSTRAINT "agencies_claimed_by_user_id_fkey" FOREIGN KEY ("claimed_by_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."agency_faqs"
    ADD CONSTRAINT "agency_faqs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."agency_submissions"
    ADD CONSTRAINT "agency_submissions_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."agency_votes"
    ADD CONSTRAINT "agency_votes_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."agency_votes"
    ADD CONSTRAINT "agency_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."branches"
    ADD CONSTRAINT "branches_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."claim_requests"
    ADD CONSTRAINT "claim_requests_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."claim_requests"
    ADD CONSTRAINT "claim_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."claim_requests"
    ADD CONSTRAINT "claim_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."mock_test_answers"
    ADD CONSTRAINT "mock_test_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "public"."mock_test_attempts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_answers"
    ADD CONSTRAINT "mock_test_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."mock_test_questions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_attempts"
    ADD CONSTRAINT "mock_test_attempts_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "public"."mock_tests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_attempts"
    ADD CONSTRAINT "mock_test_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_bookmarks"
    ADD CONSTRAINT "mock_test_bookmarks_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."mock_test_questions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_bookmarks"
    ADD CONSTRAINT "mock_test_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_categories"
    ADD CONSTRAINT "mock_test_categories_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."mock_test_locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_category_guides"
    ADD CONSTRAINT "mock_test_category_guides_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."mock_test_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_questions"
    ADD CONSTRAINT "mock_test_questions_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "public"."mock_tests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_reviews"
    ADD CONSTRAINT "mock_test_reviews_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."mock_test_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mock_test_reviews"
    ADD CONSTRAINT "mock_test_reviews_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "public"."mock_tests"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."mock_test_reviews"
    ADD CONSTRAINT "mock_test_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."mock_tests"
    ADD CONSTRAINT "mock_tests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."mock_test_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notification_queue"
    ADD CONSTRAINT "notification_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."scam_evidence"
    ADD CONSTRAINT "scam_evidence_scam_report_id_fkey" FOREIGN KEY ("scam_report_id") REFERENCES "public"."scam_reports"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."scam_reports"
    ADD CONSTRAINT "scam_reports_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."scam_reports"
    ADD CONSTRAINT "scam_reports_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."scam_reports"
    ADD CONSTRAINT "scam_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_notification_preferences"
    ADD CONSTRAINT "user_notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_streaks"
    ADD CONSTRAINT "user_streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Public can read active categories" ON "public"."mock_test_categories" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can read active locations" ON "public"."mock_test_locations" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can read active mock tests" ON "public"."mock_tests" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can read active questions" ON "public"."mock_test_questions" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public read guide" ON "public"."mock_test_category_guides" FOR SELECT USING (true);



CREATE POLICY "Service role write guide" ON "public"."mock_test_category_guides" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Users can insert own answers" ON "public"."mock_test_answers" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."mock_test_attempts" "a"
  WHERE (("a"."id" = "mock_test_answers"."attempt_id") AND ("a"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert own attempts" ON "public"."mock_test_attempts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own achievements" ON "public"."user_achievements" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own answers" ON "public"."mock_test_answers" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."mock_test_attempts" "a"
  WHERE (("a"."id" = "mock_test_answers"."attempt_id") AND ("a"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can read own attempts" ON "public"."mock_test_attempts" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own streak" ON "public"."user_streaks" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own answers" ON "public"."mock_test_answers" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."mock_test_attempts" "a"
  WHERE (("a"."id" = "mock_test_answers"."attempt_id") AND ("a"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update own attempts" ON "public"."mock_test_attempts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own bookmarks" ON "public"."mock_test_bookmarks" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own notification prefs" ON "public"."user_notification_preferences" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."admin_profile" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "admin_profile_anon_read" ON "public"."admin_profile" FOR SELECT USING (true);



ALTER TABLE "public"."agencies" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "agencies_admin_write" ON "public"."agencies" USING ("public"."is_admin"());



CREATE POLICY "agencies_select_active" ON "public"."agencies" FOR SELECT USING ((("is_active" = true) OR "public"."is_admin"()));



ALTER TABLE "public"."agency_faqs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agency_submissions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "agency_submissions_service_role_all" ON "public"."agency_submissions" USING (true);



ALTER TABLE "public"."agency_votes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "agency_votes_delete" ON "public"."agency_votes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "agency_votes_insert" ON "public"."agency_votes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "agency_votes_select" ON "public"."agency_votes" FOR SELECT USING (true);



CREATE POLICY "agency_votes_update" ON "public"."agency_votes" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "authenticated insert" ON "public"."mock_test_reviews" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "user_id") OR ("user_id" IS NULL)));



ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."branches" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "branches_public_read" ON "public"."branches" FOR SELECT USING (true);



ALTER TABLE "public"."claim_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "claim_requests_service_role_all" ON "public"."claim_requests" USING (true);



CREATE POLICY "faqs_public_read" ON "public"."agency_faqs" FOR SELECT USING (true);



ALTER TABLE "public"."mock_test_answers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mock_test_attempts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mock_test_bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mock_test_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mock_test_category_guides" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mock_test_locations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mock_test_questions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mock_test_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mock_tests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notification_queue" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public can read published blog posts" ON "public"."blog_posts" FOR SELECT USING (("status" = 'published'::"text"));



CREATE POLICY "public read approved" ON "public"."mock_test_reviews" FOR SELECT USING (("status" = 'approved'::"text"));



ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "reviews_insert_authenticated" ON "public"."reviews" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "reviews_select_approved" ON "public"."reviews" FOR SELECT USING ((("status" = 'approved'::"text") OR (("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())) OR "public"."is_admin"()));



CREATE POLICY "reviews_update_admin" ON "public"."reviews" FOR UPDATE USING ("public"."is_admin"());



ALTER TABLE "public"."scam_evidence" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "scam_evidence_insert" ON "public"."scam_evidence" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."scam_reports" "sr"
  WHERE (("sr"."id" = "scam_evidence"."scam_report_id") AND ("sr"."user_id" = "auth"."uid"())))));



CREATE POLICY "scam_evidence_select" ON "public"."scam_evidence" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."scam_reports" "sr"
  WHERE (("sr"."id" = "scam_evidence"."scam_report_id") AND (("sr"."status" = 'approved'::"text") OR "public"."is_admin"())))));



ALTER TABLE "public"."scam_reports" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "scam_reports_insert_authenticated" ON "public"."scam_reports" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "scam_reports_select_approved" ON "public"."scam_reports" FOR SELECT USING ((("status" = 'approved'::"text") OR (("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())) OR "public"."is_admin"()));



CREATE POLICY "scam_reports_update_admin" ON "public"."scam_reports" FOR UPDATE USING ("public"."is_admin"());



ALTER TABLE "public"."user_achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_notification_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_streaks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_select_own" ON "public"."users" FOR SELECT USING ((("id" = "auth"."uid"()) OR "public"."is_admin"()));



CREATE POLICY "users_update_own" ON "public"."users" FOR UPDATE USING (("id" = "auth"."uid"())) WITH CHECK ((("id" = "auth"."uid"()) AND ("role" = ( SELECT "users_1"."role"
   FROM "public"."users" "users_1"
  WHERE ("users_1"."id" = "auth"."uid"())))));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_blog_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_blog_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_blog_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_mock_test_question_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_mock_test_question_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_mock_test_question_count"() TO "service_role";



GRANT ALL ON TABLE "public"."admin_profile" TO "anon";
GRANT ALL ON TABLE "public"."admin_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_profile" TO "service_role";



GRANT ALL ON TABLE "public"."agencies" TO "anon";
GRANT ALL ON TABLE "public"."agencies" TO "authenticated";
GRANT ALL ON TABLE "public"."agencies" TO "service_role";



GRANT ALL ON TABLE "public"."agency_faqs" TO "anon";
GRANT ALL ON TABLE "public"."agency_faqs" TO "authenticated";
GRANT ALL ON TABLE "public"."agency_faqs" TO "service_role";



GRANT ALL ON TABLE "public"."agency_submissions" TO "anon";
GRANT ALL ON TABLE "public"."agency_submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."agency_submissions" TO "service_role";



GRANT SELECT,MAINTAIN ON TABLE "public"."agency_votes" TO "anon";
GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE "public"."agency_votes" TO "authenticated";
GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE "public"."agency_votes" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON TABLE "public"."branches" TO "anon";
GRANT ALL ON TABLE "public"."branches" TO "authenticated";
GRANT ALL ON TABLE "public"."branches" TO "service_role";



GRANT ALL ON TABLE "public"."claim_requests" TO "anon";
GRANT ALL ON TABLE "public"."claim_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."claim_requests" TO "service_role";



GRANT ALL ON TABLE "public"."mock_test_answers" TO "anon";
GRANT ALL ON TABLE "public"."mock_test_answers" TO "authenticated";
GRANT ALL ON TABLE "public"."mock_test_answers" TO "service_role";



GRANT ALL ON TABLE "public"."mock_test_attempts" TO "anon";
GRANT ALL ON TABLE "public"."mock_test_attempts" TO "authenticated";
GRANT ALL ON TABLE "public"."mock_test_attempts" TO "service_role";



GRANT MAINTAIN ON TABLE "public"."mock_test_bookmarks" TO "anon";
GRANT MAINTAIN ON TABLE "public"."mock_test_bookmarks" TO "authenticated";
GRANT MAINTAIN ON TABLE "public"."mock_test_bookmarks" TO "service_role";



GRANT ALL ON TABLE "public"."mock_test_categories" TO "anon";
GRANT ALL ON TABLE "public"."mock_test_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."mock_test_categories" TO "service_role";



GRANT ALL ON TABLE "public"."mock_test_category_guides" TO "anon";
GRANT ALL ON TABLE "public"."mock_test_category_guides" TO "authenticated";
GRANT ALL ON TABLE "public"."mock_test_category_guides" TO "service_role";



GRANT ALL ON TABLE "public"."mock_test_locations" TO "anon";
GRANT ALL ON TABLE "public"."mock_test_locations" TO "authenticated";
GRANT ALL ON TABLE "public"."mock_test_locations" TO "service_role";



GRANT ALL ON TABLE "public"."mock_test_questions" TO "anon";
GRANT ALL ON TABLE "public"."mock_test_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."mock_test_questions" TO "service_role";



GRANT ALL ON TABLE "public"."mock_test_reviews" TO "anon";
GRANT ALL ON TABLE "public"."mock_test_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."mock_test_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."mock_tests" TO "anon";
GRANT ALL ON TABLE "public"."mock_tests" TO "authenticated";
GRANT ALL ON TABLE "public"."mock_tests" TO "service_role";



GRANT MAINTAIN ON TABLE "public"."notification_queue" TO "anon";
GRANT MAINTAIN ON TABLE "public"."notification_queue" TO "authenticated";
GRANT MAINTAIN ON TABLE "public"."notification_queue" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."scam_evidence" TO "anon";
GRANT ALL ON TABLE "public"."scam_evidence" TO "authenticated";
GRANT ALL ON TABLE "public"."scam_evidence" TO "service_role";



GRANT ALL ON TABLE "public"."scam_reports" TO "anon";
GRANT ALL ON TABLE "public"."scam_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."scam_reports" TO "service_role";



GRANT MAINTAIN ON TABLE "public"."user_achievements" TO "anon";
GRANT MAINTAIN ON TABLE "public"."user_achievements" TO "authenticated";
GRANT MAINTAIN ON TABLE "public"."user_achievements" TO "service_role";



GRANT MAINTAIN ON TABLE "public"."user_notification_preferences" TO "anon";
GRANT MAINTAIN ON TABLE "public"."user_notification_preferences" TO "authenticated";
GRANT MAINTAIN ON TABLE "public"."user_notification_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT MAINTAIN ON TABLE "public"."user_streaks" TO "anon";
GRANT MAINTAIN ON TABLE "public"."user_streaks" TO "authenticated";
GRANT MAINTAIN ON TABLE "public"."user_streaks" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







