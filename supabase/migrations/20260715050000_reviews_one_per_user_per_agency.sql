-- A logged-in user may only have one review per agency (edit the existing
-- one instead of creating another). Anonymous submissions (user_id null)
-- are excluded — this only constrains reviews tied to a real account.
create unique index if not exists reviews_one_per_user_per_agency
  on public.reviews (user_id, agency_slug)
  where user_id is not null;
