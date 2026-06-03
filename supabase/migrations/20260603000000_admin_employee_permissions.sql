-- Add employee permission fields to users table.
-- admin_permissions = NULL  → super admin (full access)
-- admin_permissions = '{}'  → employee with no permissions yet
-- admin_permissions = '{"agencies","reviews"}' → employee with those pages only
alter table "public"."users"
  add column if not exists "admin_name"        text,
  add column if not exists "admin_permissions" text[];
