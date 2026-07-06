-- Security fix: a handful of RLS policies from earlier migrations were named
-- "*_service_role_all" but were created with no TO/FOR clause, so they
-- actually applied to every role (including anon) and every command —
-- combined with GRANT ALL ... TO anon, this let unauthenticated API callers
-- read/write these tables directly via the Supabase REST API.
--
-- The application never relies on anon/authenticated RLS access to these
-- three tables: every read/write goes through Next.js server actions using
-- the service-role client (createAdminClient()), which bypasses RLS
-- entirely. Locking these down to admin-only breaks no existing feature.

-- admin_profile: anon could SELECT SendPulse email-API credentials in plaintext.
DROP POLICY IF EXISTS "admin_profile_anon_read" ON "public"."admin_profile";
CREATE POLICY "admin_profile_admin_only" ON "public"."admin_profile"
  USING (public.is_admin());

-- agency_submissions: anon could read submitter PII and approve/reject/delete
-- any pending agency submission (no FOR clause = all commands).
DROP POLICY IF EXISTS "agency_submissions_service_role_all" ON "public"."agency_submissions";
CREATE POLICY "agency_submissions_admin_only" ON "public"."agency_submissions"
  USING (public.is_admin());

-- claim_requests: anon could read OTP hashes and flip status to "approved"
-- with an arbitrary user_id — a direct agency-ownership takeover path.
DROP POLICY IF EXISTS "claim_requests_service_role_all" ON "public"."claim_requests";
CREATE POLICY "claim_requests_admin_only" ON "public"."claim_requests"
  USING (public.is_admin());

-- Defense in depth: revoke the blanket grants that made the above reachable.
-- service_role (used by every server action touching these tables) is a
-- separate grant and is unaffected.
REVOKE ALL ON TABLE "public"."admin_profile"      FROM "anon", "authenticated";
REVOKE ALL ON TABLE "public"."agency_submissions" FROM "anon", "authenticated";
REVOKE ALL ON TABLE "public"."claim_requests"      FROM "anon", "authenticated";

-- Harden SECURITY DEFINER functions against search_path hijacking, matching
-- the pattern already used by rls_auto_enable() in the baseline migration.
ALTER FUNCTION "public"."is_admin"() SET "search_path" TO 'pg_catalog', 'public';
ALTER FUNCTION "public"."handle_new_user"() SET "search_path" TO 'pg_catalog', 'public';

-- claim_requests OTP verification had no attempt limit — an attacker could
-- brute-force a 6-digit OTP (900k combinations, 10-min expiry) to hijack an
-- agency claim. Add a counter the app enforces a max on.
ALTER TABLE "public"."claim_requests"
  ADD COLUMN IF NOT EXISTS "otp_attempts" integer DEFAULT 0 NOT NULL;
