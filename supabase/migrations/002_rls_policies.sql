-- OverseasNursing.com RLS Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scam_evidence ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER: is_admin()
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- USERS policies
-- ============================================================
-- Anyone can read public user profiles (display_name only — no email)
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (id = auth.uid() OR public.is_admin());

CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (
    id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid())
  );

-- ============================================================
-- AGENCIES policies
-- ============================================================
-- Public read for active agencies
CREATE POLICY agencies_select_active ON public.agencies
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

-- Only admins can insert/update/delete agencies
CREATE POLICY agencies_admin_write ON public.agencies
  FOR ALL USING (public.is_admin());

-- ============================================================
-- REVIEWS policies
-- ============================================================
-- Anyone can read approved reviews
CREATE POLICY reviews_select_approved ON public.reviews
  FOR SELECT USING (status = 'approved' OR (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR public.is_admin());

-- Authenticated users can insert their own review
CREATE POLICY reviews_insert_authenticated ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Only admins can update (for moderation)
CREATE POLICY reviews_update_admin ON public.reviews
  FOR UPDATE USING (public.is_admin());

-- ============================================================
-- SCAM REPORTS policies
-- ============================================================
-- Anyone can read approved scam reports
CREATE POLICY scam_reports_select_approved ON public.scam_reports
  FOR SELECT USING (status = 'approved' OR (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR public.is_admin());

-- Authenticated users can submit scam reports
CREATE POLICY scam_reports_insert_authenticated ON public.scam_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Only admins can update (for moderation)
CREATE POLICY scam_reports_update_admin ON public.scam_reports
  FOR UPDATE USING (public.is_admin());

-- ============================================================
-- SCAM EVIDENCE policies
-- ============================================================
CREATE POLICY scam_evidence_select ON public.scam_evidence
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.scam_reports sr
      WHERE sr.id = scam_report_id AND (sr.status = 'approved' OR public.is_admin())
    )
  );

CREATE POLICY scam_evidence_insert ON public.scam_evidence
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.scam_reports sr
      WHERE sr.id = scam_report_id AND sr.user_id = auth.uid()
    )
  );
