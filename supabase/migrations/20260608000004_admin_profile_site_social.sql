-- Add site-level social media link columns to admin_profile
ALTER TABLE public.admin_profile
  ADD COLUMN IF NOT EXISTS site_facebook_url  text,
  ADD COLUMN IF NOT EXISTS site_instagram_url text,
  ADD COLUMN IF NOT EXISTS site_twitter_url   text,
  ADD COLUMN IF NOT EXISTS site_linkedin_url  text,
  ADD COLUMN IF NOT EXISTS site_youtube_url   text,
  ADD COLUMN IF NOT EXISTS site_whatsapp_url  text;
