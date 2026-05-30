
UPDATE auth.users
SET encrypted_password = crypt('AKshubin1!', gen_salt('bf'))
WHERE email = 'shubin@gmail.com';