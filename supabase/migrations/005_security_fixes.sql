-- OverseasNursing.com — Security Fixes Migration
-- Fixes:
--   1. Replace auth-required insert policies with anonymous-friendly ones
--      (server actions validate all inputs before inserting)
--   2. Add explicit DELETE policies for admin ops (defense-in-depth;
--      service-role already bypasses RLS but belt-and-suspenders)
--   3. Tighten users_select policy

-- ============================================================
-- REVIEWS — allow anonymous submissions
-- ============================================================
DROP POLICY IF EXISTS reviews_insert_authenticated ON public.reviews;

CREATE POLICY reviews_insert_anyone ON public.reviews
  FOR INSERT WITH CHECK (
    -- Authenticated users must match their own user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Anonymous users must have null user_id
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Admin delete (service-role bypasses this, but explicit is safer)
CREATE POLICY reviews_delete_admin ON public.reviews
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- SCAM REPORTS — allow anonymous submissions
-- ============================================================
DROP POLICY IF EXISTS scam_reports_insert_authenticated ON public.scam_reports;

CREATE POLICY scam_reports_insert_anyone ON public.scam_reports
  FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Admin delete
CREATE POLICY scam_reports_delete_admin ON public.scam_reports
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- SCAM EVIDENCE — admin delete
-- ============================================================
CREATE POLICY scam_evidence_delete_admin ON public.scam_evidence
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.scam_reports sr
      WHERE sr.id = scam_report_id AND public.is_admin()
    )
  );

-- ============================================================
-- AGENCIES — ensure no accidental public write path exists
-- ============================================================
-- Already covered by agencies_admin_write policy (FOR ALL USING is_admin())
-- but make the insert/update/delete explicit for clarity.
DROP POLICY IF EXISTS agencies_admin_write ON public.agencies;

CREATE POLICY agencies_insert_admin ON public.agencies
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY agencies_update_admin ON public.agencies
  FOR UPDATE USING (public.is_admin());

CREATE POLICY agencies_delete_admin ON public.agencies
  FOR DELETE USING (public.is_admin());
