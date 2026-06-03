alter table "public"."agencies"
  add column if not exists "pricing_is_free"   boolean not null default false,
  add column if not exists "pricing_free_note" text;
