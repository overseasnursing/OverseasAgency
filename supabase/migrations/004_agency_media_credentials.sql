-- ── New columns on agencies ────────────────────────────────────────────
ALTER TABLE agencies
  -- Featured image (shown above About section + on listing card)
  ADD COLUMN IF NOT EXISTS featured_image_url        TEXT,

  -- Legal & Credentials
  ADD COLUMN IF NOT EXISTS mea_license_no            TEXT,
  ADD COLUMN IF NOT EXISTS mea_license_expiry        DATE,
  ADD COLUMN IF NOT EXISTS company_registration_no   TEXT,
  ADD COLUMN IF NOT EXISTS certifications            TEXT[]  DEFAULT '{}',

  -- Language Academy
  ADD COLUMN IF NOT EXISTS language_institute_name   TEXT,
  ADD COLUMN IF NOT EXISTS batch_type                TEXT,   -- 'online' | 'offline' | 'hybrid'
  ADD COLUMN IF NOT EXISTS class_schedule_note       TEXT,

  -- Media & Social
  ADD COLUMN IF NOT EXISTS video_testimonials        TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS social_links              JSONB   DEFAULT '{}',

  -- Jobs
  ADD COLUMN IF NOT EXISTS current_openings_url      TEXT;

-- ── Storage bucket for agency images ──────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'agency-assets',
  'agency-assets',
  true,
  5242880,  -- 5 MB limit
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public read on all files in agency-assets
CREATE POLICY "agency_assets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'agency-assets');

-- Only service role (admin) can insert/update/delete
CREATE POLICY "agency_assets_admin_write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'agency-assets');

CREATE POLICY "agency_assets_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'agency-assets');

CREATE POLICY "agency_assets_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'agency-assets');
