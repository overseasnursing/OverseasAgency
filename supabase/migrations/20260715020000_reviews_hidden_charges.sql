-- The review form collects "Did you experience hidden charges?" (Yes/No)
-- and an optional amount, but reviews only ever had surprise_charges (a
-- freeform "what surprised you" text field) — there was nowhere to store
-- the actual hidden-charges answer, so it was silently dropped on submit.
alter table public.reviews
  add column if not exists hidden_charges boolean default null;

alter table public.reviews
  add column if not exists hidden_charges_amount numeric default null;

comment on column public.reviews.hidden_charges is 'Whether the reviewer reported experiencing hidden/undisclosed charges (null = not answered, legacy row)';
comment on column public.reviews.hidden_charges_amount is 'Reported hidden charges amount in rupees, if provided';
