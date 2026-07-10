DO $$
DECLARE
  target_email    text := 'shubin@gmail.com';   -- new admin email
  target_password text := 'AKshubin1!';       -- new admin password
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

  -- No-op if this admin has no auth.identities row.
  UPDATE auth.identities
  SET identity_data = identity_data || jsonb_build_object('email', target_email, 'sub', target_id::text),
      updated_at    = now()
  WHERE user_id = target_id AND provider = 'email';

  RAISE NOTICE 'Admin % reset: email=%', target_id, target_email;
END $$;
