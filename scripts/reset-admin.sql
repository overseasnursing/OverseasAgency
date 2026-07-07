-- Resets the email + password of the current admin account (role = 'admin').
-- Safe to rerun. Requires pgcrypto (already enabled by the baseline migration).
--
-- Local usage (Docker):
--   docker exec -i supabase_db_OverseasAgency psql -U postgres -d postgres \
--     -v email="'admin@overseasnursing.com'" -v password="'NewStrongPassword123!'" \
--     -f scripts/reset-admin.sql
--
-- Remote/production usage:
--   psql "$(supabase status -o env | grep DB_URL)" \
--     -v email="'admin@overseasnursing.com'" -v password="'NewStrongPassword123!'" \
--     -f scripts/reset-admin.sql
--   (or connect with the production DB connection string from the Supabase dashboard)

BEGIN;

DO $$
DECLARE
  target_email    text := :email;
  target_password text := :password;
  target_id       uuid;
BEGIN
  SELECT id INTO target_id FROM public.users WHERE role = 'admin' LIMIT 1;

  IF target_id IS NULL THEN
    RAISE EXCEPTION 'No admin user found (public.users.role = ''admin''). Promote a user to admin first.';
  END IF;

  UPDATE auth.users
  SET email               = target_email,
      encrypted_password  = crypt(target_password, gen_salt('bf')),
      email_confirmed_at  = now(),
      updated_at          = now()
  WHERE id = target_id;

  UPDATE public.users
  SET email      = target_email,
      updated_at = now()
  WHERE id = target_id;

  -- No-op if this admin has no auth.identities row (e.g. created directly via SQL).
  UPDATE auth.identities
  SET identity_data = identity_data || jsonb_build_object('email', target_email, 'sub', target_id::text),
      updated_at    = now()
  WHERE user_id = target_id AND provider = 'email';

  RAISE NOTICE 'Admin % reset: email=%', target_id, target_email;
END $$;

COMMIT;
