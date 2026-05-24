-- =====================================================
-- SAFE MIGRATION: 20260524070801_safe_changes
-- Fixes policy duplication issues without touching dropped tables
-- =====================================================

set check_function_bodies = off;

-- =====================================================
-- FUNCTION: sync_mock_test_question_count
-- =====================================================
CREATE OR REPLACE FUNCTION public.sync_mock_test_question_count()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.mock_tests
  SET total_questions = (
      SELECT COUNT(*)
      FROM public.mock_test_questions
      WHERE mock_test_id = COALESCE(NEW.mock_test_id, OLD.mock_test_id)
        AND is_active = true
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.mock_test_id, OLD.mock_test_id);

  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- =====================================================
-- POLICIES: agencies
-- =====================================================
DROP POLICY IF EXISTS "agencies_admin_write" ON public.agencies;

CREATE POLICY "agencies_admin_write"
ON public.agencies
AS PERMISSIVE
FOR ALL
TO public
USING (public.is_admin());

-- =====================================================
-- POLICIES: agency_faqs
-- =====================================================
DROP POLICY IF EXISTS "faqs_public_read" ON public.agency_faqs;

CREATE POLICY "faqs_public_read"
ON public.agency_faqs
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- =====================================================
-- POLICIES: branches
-- =====================================================
DROP POLICY IF EXISTS "branches_public_read" ON public.branches;

CREATE POLICY "branches_public_read"
ON public.branches
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- =====================================================
-- POLICIES: reviews
-- =====================================================
DROP POLICY IF EXISTS "reviews_insert_authenticated" ON public.reviews;

CREATE POLICY "reviews_insert_authenticated"
ON public.reviews
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_id = auth.uid()
);

-- =====================================================
-- POLICIES: scam_reports
-- =====================================================
DROP POLICY IF EXISTS "scam_reports_insert_authenticated" ON public.scam_reports;

CREATE POLICY "scam_reports_insert_authenticated"
ON public.scam_reports
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_id = auth.uid()
);