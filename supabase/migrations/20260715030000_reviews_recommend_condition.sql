-- "Would you recommend this agency?" has a "With conditions" option, but
-- there was nowhere to capture what those conditions actually were.
alter table public.reviews
  add column if not exists recommend_condition text default null;

comment on column public.reviews.recommend_condition is 'Reviewer-provided conditions when recommends = true but wouldRecommend was answered "With conditions"';
