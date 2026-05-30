-- Admin profile: single-row table for site author and reviewer credentials.
-- The row is pre-seeded with a fixed UUID; the admin settings page upserts into it.

create table if not exists public.admin_profile (
  id                          uuid primary key default gen_random_uuid(),

  -- Author fields
  author_display_name         text not null default '',
  author_slug                 text not null default '',
  author_role_title           text not null default '',
  author_short_bio            text not null default '',
  author_long_bio             text not null default '',
  author_profile_photo        text not null default '',
  author_years_experience     integer,
  author_expertise_areas      text[] not null default '{}',
  author_content_specialties  text[] not null default '{}',
  author_linkedin_url         text,
  author_facebook_url         text,
  author_instagram_url        text,
  author_twitter_url          text,
  author_youtube_url          text,

  -- Reviewer fields
  reviewer_display_name       text not null default '',
  reviewer_slug               text not null default '',
  reviewer_title              text not null default '',
  reviewer_short_bio          text not null default '',
  reviewer_long_bio           text not null default '',
  reviewer_profile_photo      text not null default '',
  reviewer_years_experience   integer,
  reviewer_registration_number text,
  reviewer_issuing_authority  text,
  reviewer_expertise_areas    text[] not null default '{}',
  reviewer_specialties        text[] not null default '{}',
  reviewer_credential_summary text not null default '',
  reviewer_linkedin_url       text,
  reviewer_facebook_url       text,
  reviewer_instagram_url      text,
  reviewer_twitter_url        text,
  reviewer_youtube_url        text,

  updated_at                  timestamptz default now()
);

-- Seed the single fixed row
insert into public.admin_profile (id)
values ('00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

-- RLS: allow anon reads (content attribution is public), restrict writes to service role
alter table public.admin_profile enable row level security;

create policy "admin_profile_anon_read"
  on public.admin_profile for select
  using (true);

-- Service role bypasses RLS; no additional write policy needed for authenticated admin writes via service role key.
