CREATE TABLE blog_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  content         TEXT,
  cover_image_url TEXT,
  author_name     TEXT DEFAULT 'OverseasNursing Team',
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at    TIMESTAMPTZ,
  seo_title       TEXT,
  seo_description TEXT,
  tags            TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX blog_posts_status_published_at_idx ON blog_posts (status, published_at DESC);
CREATE INDEX blog_posts_slug_idx ON blog_posts (slug);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION set_blog_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_blog_updated_at();

-- RLS: public can read published posts; only service role can write
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');
