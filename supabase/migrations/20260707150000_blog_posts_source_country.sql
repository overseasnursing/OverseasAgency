-- Source Country Foundation (Phase 5): lets a blog post optionally be
-- authored for one specific source country. NULL (the default for every
-- existing and new row) means "global" — applies to every visitor, and is
-- always the fallback when no country-specific content exists. This is
-- deliberately nullable rather than DEFAULT 'India' like agencies.source_country
-- — most content is genuinely global, and NULL is what "gracefully fall back
-- to global content" means throughout the recommendation layer.

ALTER TABLE "public"."blog_posts"
  ADD COLUMN IF NOT EXISTS "source_country" "text";
