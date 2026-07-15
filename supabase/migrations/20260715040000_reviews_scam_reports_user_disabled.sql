-- Lets a user hide their own review/scam report from public view without
-- deleting it — hidden ones are excluded from public listings and from
-- every derived stat (ratings, hidden-charges counts, scam counts).
alter table public.reviews
  add column if not exists user_disabled boolean not null default false;

alter table public.scam_reports
  add column if not exists user_disabled boolean not null default false;

comment on column public.reviews.user_disabled is 'True if the submitting user has hidden this review from public view (self-service, not admin moderation)';
comment on column public.scam_reports.user_disabled is 'True if the submitting user has hidden this report from public view (self-service, not admin moderation)';
