drop policy "agency_votes_delete" on "public"."agency_votes";

drop policy "agency_votes_insert" on "public"."agency_votes";

drop policy "agency_votes_select" on "public"."agency_votes";

drop policy "agency_votes_update" on "public"."agency_votes";

revoke delete on table "public"."agency_votes" from "anon";

revoke insert on table "public"."agency_votes" from "anon";

revoke references on table "public"."agency_votes" from "anon";

revoke select on table "public"."agency_votes" from "anon";

revoke trigger on table "public"."agency_votes" from "anon";

revoke truncate on table "public"."agency_votes" from "anon";

revoke update on table "public"."agency_votes" from "anon";

revoke delete on table "public"."agency_votes" from "authenticated";

revoke insert on table "public"."agency_votes" from "authenticated";

revoke references on table "public"."agency_votes" from "authenticated";

revoke select on table "public"."agency_votes" from "authenticated";

revoke trigger on table "public"."agency_votes" from "authenticated";

revoke truncate on table "public"."agency_votes" from "authenticated";

revoke update on table "public"."agency_votes" from "authenticated";

revoke delete on table "public"."agency_votes" from "service_role";

revoke insert on table "public"."agency_votes" from "service_role";

revoke references on table "public"."agency_votes" from "service_role";

revoke select on table "public"."agency_votes" from "service_role";

revoke trigger on table "public"."agency_votes" from "service_role";

revoke truncate on table "public"."agency_votes" from "service_role";

revoke update on table "public"."agency_votes" from "service_role";

alter table "public"."agency_votes" drop constraint "agency_votes_agency_id_fkey";

alter table "public"."agency_votes" drop constraint "agency_votes_agency_id_user_id_key";

alter table "public"."agency_votes" drop constraint "agency_votes_user_id_fkey";

alter table "public"."agency_votes" drop constraint "agency_votes_pkey";

drop index if exists "public"."agency_votes_agency_id_user_id_key";

drop index if exists "public"."agency_votes_pkey";

drop table "public"."agency_votes";


