create extension if not exists "pg_net" with schema "extensions";

drop policy "agency_submissions_service_role_all" on "public"."agency_submissions";

drop policy "agency_votes_delete" on "public"."agency_votes";

drop policy "agency_votes_insert" on "public"."agency_votes";

drop policy "agency_votes_select" on "public"."agency_votes";

drop policy "agency_votes_update" on "public"."agency_votes";

drop policy "claim_requests_service_role_all" on "public"."claim_requests";

drop policy "authenticated insert" on "public"."mock_test_reviews";

drop policy "public read approved" on "public"."mock_test_reviews";

revoke delete on table "public"."agency_submissions" from "anon";

revoke insert on table "public"."agency_submissions" from "anon";

revoke references on table "public"."agency_submissions" from "anon";

revoke select on table "public"."agency_submissions" from "anon";

revoke trigger on table "public"."agency_submissions" from "anon";

revoke truncate on table "public"."agency_submissions" from "anon";

revoke update on table "public"."agency_submissions" from "anon";

revoke delete on table "public"."agency_submissions" from "authenticated";

revoke insert on table "public"."agency_submissions" from "authenticated";

revoke references on table "public"."agency_submissions" from "authenticated";

revoke select on table "public"."agency_submissions" from "authenticated";

revoke trigger on table "public"."agency_submissions" from "authenticated";

revoke truncate on table "public"."agency_submissions" from "authenticated";

revoke update on table "public"."agency_submissions" from "authenticated";

revoke delete on table "public"."agency_submissions" from "service_role";

revoke insert on table "public"."agency_submissions" from "service_role";

revoke references on table "public"."agency_submissions" from "service_role";

revoke select on table "public"."agency_submissions" from "service_role";

revoke trigger on table "public"."agency_submissions" from "service_role";

revoke truncate on table "public"."agency_submissions" from "service_role";

revoke update on table "public"."agency_submissions" from "service_role";

revoke delete on table "public"."claim_requests" from "anon";

revoke insert on table "public"."claim_requests" from "anon";

revoke references on table "public"."claim_requests" from "anon";

revoke select on table "public"."claim_requests" from "anon";

revoke trigger on table "public"."claim_requests" from "anon";

revoke truncate on table "public"."claim_requests" from "anon";

revoke update on table "public"."claim_requests" from "anon";

revoke delete on table "public"."claim_requests" from "authenticated";

revoke insert on table "public"."claim_requests" from "authenticated";

revoke references on table "public"."claim_requests" from "authenticated";

revoke select on table "public"."claim_requests" from "authenticated";

revoke trigger on table "public"."claim_requests" from "authenticated";

revoke truncate on table "public"."claim_requests" from "authenticated";

revoke update on table "public"."claim_requests" from "authenticated";

revoke delete on table "public"."claim_requests" from "service_role";

revoke insert on table "public"."claim_requests" from "service_role";

revoke references on table "public"."claim_requests" from "service_role";

revoke select on table "public"."claim_requests" from "service_role";

revoke trigger on table "public"."claim_requests" from "service_role";

revoke truncate on table "public"."claim_requests" from "service_role";

revoke update on table "public"."claim_requests" from "service_role";

revoke delete on table "public"."mock_test_reviews" from "anon";

revoke insert on table "public"."mock_test_reviews" from "anon";

revoke references on table "public"."mock_test_reviews" from "anon";

revoke select on table "public"."mock_test_reviews" from "anon";

revoke trigger on table "public"."mock_test_reviews" from "anon";

revoke truncate on table "public"."mock_test_reviews" from "anon";

revoke update on table "public"."mock_test_reviews" from "anon";

revoke delete on table "public"."mock_test_reviews" from "authenticated";

revoke insert on table "public"."mock_test_reviews" from "authenticated";

revoke references on table "public"."mock_test_reviews" from "authenticated";

revoke select on table "public"."mock_test_reviews" from "authenticated";

revoke trigger on table "public"."mock_test_reviews" from "authenticated";

revoke truncate on table "public"."mock_test_reviews" from "authenticated";

revoke update on table "public"."mock_test_reviews" from "authenticated";

revoke delete on table "public"."mock_test_reviews" from "service_role";

revoke insert on table "public"."mock_test_reviews" from "service_role";

revoke references on table "public"."mock_test_reviews" from "service_role";

revoke select on table "public"."mock_test_reviews" from "service_role";

revoke trigger on table "public"."mock_test_reviews" from "service_role";

revoke truncate on table "public"."mock_test_reviews" from "service_role";

revoke update on table "public"."mock_test_reviews" from "service_role";

alter table "public"."agencies" drop constraint "agencies_claimed_by_user_id_fkey";

alter table "public"."agency_submissions" drop constraint "agency_submissions_agency_id_fkey";

alter table "public"."agency_submissions" drop constraint "agency_submissions_status_check";

alter table "public"."agency_votes" drop constraint "agency_votes_agency_id_fkey";

alter table "public"."agency_votes" drop constraint "agency_votes_agency_id_user_id_key";

alter table "public"."agency_votes" drop constraint "agency_votes_user_id_fkey";

alter table "public"."claim_requests" drop constraint "claim_requests_agency_id_fkey";

alter table "public"."claim_requests" drop constraint "claim_requests_reviewed_by_fkey";

alter table "public"."claim_requests" drop constraint "claim_requests_status_check";

alter table "public"."claim_requests" drop constraint "claim_requests_user_id_fkey";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_category_id_fkey";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_difficulty_check";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_mock_test_id_fkey";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_rating_check";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_review_text_check";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_review_title_check";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_reviewer_country_check";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_status_check";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_user_id_fkey";

drop function if exists "public"."rls_auto_enable"();

alter table "public"."agency_submissions" drop constraint "agency_submissions_pkey";

alter table "public"."agency_votes" drop constraint "agency_votes_pkey";

alter table "public"."claim_requests" drop constraint "claim_requests_pkey";

alter table "public"."mock_test_reviews" drop constraint "mock_test_reviews_pkey";

drop index if exists "public"."agency_submissions_pkey";

drop index if exists "public"."agency_votes_agency_id_user_id_key";

drop index if exists "public"."agency_votes_pkey";

drop index if exists "public"."claim_requests_pkey";

drop index if exists "public"."idx_agency_submissions_email";

drop index if exists "public"."idx_agency_submissions_status";

drop index if exists "public"."idx_claim_requests_agency_id";

drop index if exists "public"."idx_claim_requests_email";

drop index if exists "public"."idx_claim_requests_status";

drop index if exists "public"."idx_mock_test_reviews_category";

drop index if exists "public"."idx_mock_test_reviews_test";

drop index if exists "public"."mock_test_reviews_pkey";

drop table "public"."agency_submissions";

drop table "public"."agency_votes";

drop table "public"."claim_requests";

drop table "public"."mock_test_reviews";

alter table "public"."admin_profile" drop column "email_from_email";

alter table "public"."admin_profile" drop column "email_from_name";

alter table "public"."admin_profile" drop column "sendpulse_api_id";

alter table "public"."admin_profile" drop column "sendpulse_api_secret";

alter table "public"."admin_profile" drop column "site_facebook_url";

alter table "public"."admin_profile" drop column "site_instagram_url";

alter table "public"."admin_profile" drop column "site_linkedin_url";

alter table "public"."admin_profile" drop column "site_twitter_url";

alter table "public"."admin_profile" drop column "site_whatsapp_url";

alter table "public"."admin_profile" drop column "site_youtube_url";

alter table "public"."agencies" drop column "claimed_by_user_id";

alter table "public"."agencies" drop column "company_registration_url";

alter table "public"."agencies" drop column "is_claimed";

alter table "public"."agencies" drop column "mea_license_url";

alter table "public"."agencies" drop column "pricing_free_note";

alter table "public"."agencies" drop column "pricing_is_free";

alter table "public"."branches" drop column "pin_code";

alter table "public"."mock_test_category_guides" drop column "destination_overrides";

alter table "public"."users" drop column "admin_name";

alter table "public"."users" drop column "admin_permissions";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sync_mock_test_question_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.mock_tests
  SET total_questions = (
      SELECT COUNT(*)
      FROM public.mock_test_questions
      WHERE mock_test_id = COALESCE(NEW.mock_test_id, OLD.mock_test_id)
        AND is_active = true
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.mock_test_id, OLD.mock_test_id);

  RETURN COALESCE(NEW, OLD);
END;
$function$
;

grant delete on table "public"."mock_test_bookmarks" to "anon";

grant insert on table "public"."mock_test_bookmarks" to "anon";

grant references on table "public"."mock_test_bookmarks" to "anon";

grant select on table "public"."mock_test_bookmarks" to "anon";

grant trigger on table "public"."mock_test_bookmarks" to "anon";

grant truncate on table "public"."mock_test_bookmarks" to "anon";

grant update on table "public"."mock_test_bookmarks" to "anon";

grant delete on table "public"."mock_test_bookmarks" to "authenticated";

grant insert on table "public"."mock_test_bookmarks" to "authenticated";

grant references on table "public"."mock_test_bookmarks" to "authenticated";

grant select on table "public"."mock_test_bookmarks" to "authenticated";

grant trigger on table "public"."mock_test_bookmarks" to "authenticated";

grant truncate on table "public"."mock_test_bookmarks" to "authenticated";

grant update on table "public"."mock_test_bookmarks" to "authenticated";

grant delete on table "public"."mock_test_bookmarks" to "service_role";

grant insert on table "public"."mock_test_bookmarks" to "service_role";

grant references on table "public"."mock_test_bookmarks" to "service_role";

grant select on table "public"."mock_test_bookmarks" to "service_role";

grant trigger on table "public"."mock_test_bookmarks" to "service_role";

grant truncate on table "public"."mock_test_bookmarks" to "service_role";

grant update on table "public"."mock_test_bookmarks" to "service_role";

grant delete on table "public"."notification_queue" to "anon";

grant insert on table "public"."notification_queue" to "anon";

grant references on table "public"."notification_queue" to "anon";

grant select on table "public"."notification_queue" to "anon";

grant trigger on table "public"."notification_queue" to "anon";

grant truncate on table "public"."notification_queue" to "anon";

grant update on table "public"."notification_queue" to "anon";

grant delete on table "public"."notification_queue" to "authenticated";

grant insert on table "public"."notification_queue" to "authenticated";

grant references on table "public"."notification_queue" to "authenticated";

grant select on table "public"."notification_queue" to "authenticated";

grant trigger on table "public"."notification_queue" to "authenticated";

grant truncate on table "public"."notification_queue" to "authenticated";

grant update on table "public"."notification_queue" to "authenticated";

grant delete on table "public"."notification_queue" to "service_role";

grant insert on table "public"."notification_queue" to "service_role";

grant references on table "public"."notification_queue" to "service_role";

grant select on table "public"."notification_queue" to "service_role";

grant trigger on table "public"."notification_queue" to "service_role";

grant truncate on table "public"."notification_queue" to "service_role";

grant update on table "public"."notification_queue" to "service_role";

grant delete on table "public"."user_achievements" to "anon";

grant insert on table "public"."user_achievements" to "anon";

grant references on table "public"."user_achievements" to "anon";

grant select on table "public"."user_achievements" to "anon";

grant trigger on table "public"."user_achievements" to "anon";

grant truncate on table "public"."user_achievements" to "anon";

grant update on table "public"."user_achievements" to "anon";

grant delete on table "public"."user_achievements" to "authenticated";

grant insert on table "public"."user_achievements" to "authenticated";

grant references on table "public"."user_achievements" to "authenticated";

grant select on table "public"."user_achievements" to "authenticated";

grant trigger on table "public"."user_achievements" to "authenticated";

grant truncate on table "public"."user_achievements" to "authenticated";

grant update on table "public"."user_achievements" to "authenticated";

grant delete on table "public"."user_achievements" to "service_role";

grant insert on table "public"."user_achievements" to "service_role";

grant references on table "public"."user_achievements" to "service_role";

grant select on table "public"."user_achievements" to "service_role";

grant trigger on table "public"."user_achievements" to "service_role";

grant truncate on table "public"."user_achievements" to "service_role";

grant update on table "public"."user_achievements" to "service_role";

grant delete on table "public"."user_notification_preferences" to "anon";

grant insert on table "public"."user_notification_preferences" to "anon";

grant references on table "public"."user_notification_preferences" to "anon";

grant select on table "public"."user_notification_preferences" to "anon";

grant trigger on table "public"."user_notification_preferences" to "anon";

grant truncate on table "public"."user_notification_preferences" to "anon";

grant update on table "public"."user_notification_preferences" to "anon";

grant delete on table "public"."user_notification_preferences" to "authenticated";

grant insert on table "public"."user_notification_preferences" to "authenticated";

grant references on table "public"."user_notification_preferences" to "authenticated";

grant select on table "public"."user_notification_preferences" to "authenticated";

grant trigger on table "public"."user_notification_preferences" to "authenticated";

grant truncate on table "public"."user_notification_preferences" to "authenticated";

grant update on table "public"."user_notification_preferences" to "authenticated";

grant delete on table "public"."user_notification_preferences" to "service_role";

grant insert on table "public"."user_notification_preferences" to "service_role";

grant references on table "public"."user_notification_preferences" to "service_role";

grant select on table "public"."user_notification_preferences" to "service_role";

grant trigger on table "public"."user_notification_preferences" to "service_role";

grant truncate on table "public"."user_notification_preferences" to "service_role";

grant update on table "public"."user_notification_preferences" to "service_role";

grant delete on table "public"."user_streaks" to "anon";

grant insert on table "public"."user_streaks" to "anon";

grant references on table "public"."user_streaks" to "anon";

grant select on table "public"."user_streaks" to "anon";

grant trigger on table "public"."user_streaks" to "anon";

grant truncate on table "public"."user_streaks" to "anon";

grant update on table "public"."user_streaks" to "anon";

grant delete on table "public"."user_streaks" to "authenticated";

grant insert on table "public"."user_streaks" to "authenticated";

grant references on table "public"."user_streaks" to "authenticated";

grant select on table "public"."user_streaks" to "authenticated";

grant trigger on table "public"."user_streaks" to "authenticated";

grant truncate on table "public"."user_streaks" to "authenticated";

grant update on table "public"."user_streaks" to "authenticated";

grant delete on table "public"."user_streaks" to "service_role";

grant insert on table "public"."user_streaks" to "service_role";

grant references on table "public"."user_streaks" to "service_role";

grant select on table "public"."user_streaks" to "service_role";

grant trigger on table "public"."user_streaks" to "service_role";

grant truncate on table "public"."user_streaks" to "service_role";

grant update on table "public"."user_streaks" to "service_role";


