drop policy "agencies_delete_admin" on "public"."agencies";

drop policy "agencies_insert_admin" on "public"."agencies";

drop policy "agencies_update_admin" on "public"."agencies";

drop policy "reviews_delete_admin" on "public"."reviews";

drop policy "reviews_insert_anyone" on "public"."reviews";

drop policy "scam_evidence_delete_admin" on "public"."scam_evidence";

drop policy "scam_reports_delete_admin" on "public"."scam_reports";

drop policy "scam_reports_insert_anyone" on "public"."scam_reports";

alter table "public"."agency_faqs" enable row level security;

alter table "public"."branches" enable row level security;


  create policy "agencies_admin_write"
  on "public"."agencies"
  as permissive
  for all
  to public
using (public.is_admin());



  create policy "faqs_public_read"
  on "public"."agency_faqs"
  as permissive
  for select
  to public
using (true);



  create policy "branches_public_read"
  on "public"."branches"
  as permissive
  for select
  to public
using (true);



  create policy "reviews_insert_authenticated"
  on "public"."reviews"
  as permissive
  for insert
  to public
with check (((auth.uid() IS NOT NULL) AND (user_id = auth.uid())));



  create policy "scam_reports_insert_authenticated"
  on "public"."scam_reports"
  as permissive
  for insert
  to public
with check (((auth.uid() IS NOT NULL) AND (user_id = auth.uid())));



