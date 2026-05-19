-- OverseasNursing.com Initial Schema
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  display_name  TEXT,
  role          TEXT NOT NULL DEFAULT 'registered_user' CHECK (role IN ('registered_user', 'agency', 'admin')),
  is_banned     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.agencies (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                    TEXT NOT NULL UNIQUE,
  name                    TEXT NOT NULL,
  city                    TEXT NOT NULL,
  state                   TEXT NOT NULL,
  location                TEXT NOT NULL,
  established             INTEGER,
  trust_level             TEXT NOT NULL DEFAULT 'unverified' CHECK (trust_level IN ('verified', 'trusted', 'unverified', 'scam-reported')),
  rating                  NUMERIC(3,2),
  review_count            INTEGER NOT NULL DEFAULT 0,
  placement_count         INTEGER NOT NULL DEFAULT 0,
  transparency_score      INTEGER,
  countries               TEXT[] NOT NULL DEFAULT '{}',
  exams_supported         TEXT[] NOT NULL DEFAULT '{}',
  pricing_min_lakhs       NUMERIC(5,2),
  pricing_max_lakhs       NUMERIC(5,2),
  pricing_is_approximate  BOOLEAN NOT NULL DEFAULT TRUE,
  hidden_charges_reported INTEGER NOT NULL DEFAULT 0,
  visa_sponsorship        BOOLEAN NOT NULL DEFAULT FALSE,
  average_timeline_months TEXT,
  tagline                 TEXT,
  featured                BOOLEAN NOT NULL DEFAULT FALSE,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.reviews (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id            UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  agency_slug          TEXT NOT NULL,
  agency_name          TEXT NOT NULL,
  user_id              UUID REFERENCES public.users(id) ON DELETE SET NULL,
  author_name          TEXT NOT NULL,
  author_from          TEXT NOT NULL,
  country_placed       TEXT NOT NULL,
  exam_taken           TEXT,
  timeline_months      INTEGER,
  actual_cost_paid     TEXT,
  overall_rating       INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  transparency_rating  INTEGER CHECK (transparency_rating BETWEEN 1 AND 5),
  speed_rating         INTEGER CHECK (speed_rating BETWEEN 1 AND 5),
  review_text          TEXT NOT NULL,
  surprise_charges     TEXT,
  advice               TEXT,
  placed               BOOLEAN NOT NULL DEFAULT FALSE,
  recommends           BOOLEAN NOT NULL DEFAULT TRUE,
  status               TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderated_by         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  moderated_at         TIMESTAMPTZ,
  reject_reason        TEXT,
  helpful_count        INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.scam_reports (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT NOT NULL UNIQUE,
  agency_id            UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  agency_slug          TEXT NOT NULL,
  agency_name          TEXT NOT NULL,
  user_id              UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reporter_name        TEXT NOT NULL,
  reporter_from        TEXT NOT NULL,
  category             TEXT NOT NULL CHECK (category IN ('fee-fraud', 'fake-job', 'document-fraud', 'visa-fraud', 'abandonment', 'other')),
  severity             TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'moderate')),
  country_promised     TEXT NOT NULL,
  amount_lost          NUMERIC(10,2),
  amount_paid          NUMERIC(10,2),
  amount_recovered     NUMERIC(10,2),
  incident_date        DATE,
  incident_text        TEXT NOT NULL,
  warning_signs_missed TEXT[],
  lessons_learned      TEXT[],
  emotional_experience TEXT,
  resolved             BOOLEAN NOT NULL DEFAULT FALSE,
  agency_responded     BOOLEAN NOT NULL DEFAULT FALSE,
  agency_response_text TEXT,
  evidence_count       INTEGER NOT NULL DEFAULT 0,
  status               TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderated_by         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  moderated_at         TIMESTAMPTZ,
  reject_reason        TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.scam_evidence (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scam_report_id  UUID NOT NULL REFERENCES public.scam_reports(id) ON DELETE CASCADE,
  storage_path    TEXT NOT NULL,
  file_name       TEXT NOT NULL,
  file_type       TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agencies_slug ON public.agencies(slug);
CREATE INDEX idx_agencies_trust_level ON public.agencies(trust_level);
CREATE INDEX idx_reviews_agency_slug ON public.reviews(agency_slug);
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_scam_reports_agency_slug ON public.scam_reports(agency_slug);
CREATE INDEX idx_scam_reports_status ON public.scam_reports(status);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_agencies_updated_at BEFORE UPDATE ON public.agencies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_scam_reports_updated_at BEFORE UPDATE ON public.scam_reports FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
