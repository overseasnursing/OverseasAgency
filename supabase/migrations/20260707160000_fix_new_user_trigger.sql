-- handle_new_user() has existed since the baseline migration but was never
-- bound to auth.users, so no public.users row was ever created on signup.
-- This adds the missing trigger and backfills any auth.users rows that are
-- missing their public.users counterpart.

DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users";

CREATE TRIGGER "on_auth_user_created"
  AFTER INSERT ON "auth"."users"
  FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();

INSERT INTO public.users (id, email, display_name)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1))
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
