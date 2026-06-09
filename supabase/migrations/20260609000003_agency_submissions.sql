CREATE TABLE IF NOT EXISTS public.agency_submissions (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Agency details
  agency_name       text        NOT NULL,
  city              text        NOT NULL,
  state             text        NOT NULL,
  website           text,
  email             text        NOT NULL,
  phone             text,
  whatsapp          text,
  description       text,
  countries_served  text[]      DEFAULT '{}',
  services          text[]      DEFAULT '{}',
  established_year  integer,

  -- Contact person
  contact_name      text        NOT NULL,
  contact_email     text        NOT NULL,
  contact_phone     text,
  designation       text        NOT NULL,

  -- Status
  status            text        NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason  text,
  reviewed_at       timestamptz,

  -- Set on approval
  agency_id         uuid        REFERENCES public.agencies(id) ON DELETE SET NULL,

  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agency_submissions_status ON public.agency_submissions(status);
CREATE INDEX IF NOT EXISTS idx_agency_submissions_email  ON public.agency_submissions(contact_email);

ALTER TABLE public.agency_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "agency_submissions_service_role_all"
    ON public.agency_submissions FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

GRANT ALL ON TABLE public.agency_submissions TO service_role;
