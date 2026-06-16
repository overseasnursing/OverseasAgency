-- Adds an optional employer logo (admin-posted jobs only) and an apply
-- method: 'direct' (internal apply flow, default) or 'redirect' (external
-- application URL, used when admin posts a job sourced from elsewhere).
-- Purely additive.

ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "logo_url" "text";
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "apply_type" "text" DEFAULT 'direct'::"text" NOT NULL;
ALTER TABLE "public"."jobs" ADD COLUMN IF NOT EXISTS "redirect_url" "text";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jobs_apply_type_check') THEN
    ALTER TABLE ONLY "public"."jobs"
      ADD CONSTRAINT "jobs_apply_type_check" CHECK (("apply_type" = ANY (ARRAY['direct'::"text", 'redirect'::"text"])));
  END IF;
END $$;
