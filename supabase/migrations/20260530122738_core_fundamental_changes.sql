drop policy "admin_profile_anon_read" on "public"."admin_profile";

revoke delete on table "public"."admin_profile" from "anon";

revoke insert on table "public"."admin_profile" from "anon";

revoke references on table "public"."admin_profile" from "anon";

revoke select on table "public"."admin_profile" from "anon";

revoke trigger on table "public"."admin_profile" from "anon";

revoke truncate on table "public"."admin_profile" from "anon";

revoke update on table "public"."admin_profile" from "anon";

revoke delete on table "public"."admin_profile" from "authenticated";

revoke insert on table "public"."admin_profile" from "authenticated";

revoke references on table "public"."admin_profile" from "authenticated";

revoke select on table "public"."admin_profile" from "authenticated";

revoke trigger on table "public"."admin_profile" from "authenticated";

revoke truncate on table "public"."admin_profile" from "authenticated";

revoke update on table "public"."admin_profile" from "authenticated";

revoke delete on table "public"."admin_profile" from "service_role";

revoke insert on table "public"."admin_profile" from "service_role";

revoke references on table "public"."admin_profile" from "service_role";

revoke select on table "public"."admin_profile" from "service_role";

revoke trigger on table "public"."admin_profile" from "service_role";

revoke truncate on table "public"."admin_profile" from "service_role";

revoke update on table "public"."admin_profile" from "service_role";

alter table "public"."admin_profile" drop constraint "admin_profile_pkey";

drop index if exists "public"."admin_profile_pkey";

drop table "public"."admin_profile";


