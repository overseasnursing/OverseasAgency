-- ── SendPulse email config on admin_profile ─────────────────────────────────
ALTER TABLE public.admin_profile
  ADD COLUMN IF NOT EXISTS sendpulse_api_id     text,
  ADD COLUMN IF NOT EXISTS sendpulse_api_secret text,
  ADD COLUMN IF NOT EXISTS email_from_name      text,
  ADD COLUMN IF NOT EXISTS email_from_email     text;

-- ── Claim status on agencies ─────────────────────────────────────────────────
ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS is_claimed           boolean DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS claimed_by_user_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- ── Claim requests table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.claim_requests (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id         uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  contact_name      text NOT NULL,
  contact_email     text NOT NULL,
  contact_phone     text,
  designation       text NOT NULL,
  message           text,
  status            text NOT NULL DEFAULT 'pending_verification'
                      CHECK (status IN ('pending_verification','pending_approval','approved','rejected')),
  otp_hash          text,
  otp_expires_at    timestamptz,
  otp_verified_at   timestamptz,
  user_id           uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at       timestamptz,
  rejection_reason  text,
  created_at        timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_claim_requests_agency_id     ON public.claim_requests(agency_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_status        ON public.claim_requests(status);
CREATE INDEX IF NOT EXISTS idx_claim_requests_email         ON public.claim_requests(contact_email);

ALTER TABLE public.claim_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "claim_requests_service_role_all"
    ON public.claim_requests FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

GRANT ALL ON TABLE public.claim_requests TO service_role;
