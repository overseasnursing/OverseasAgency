-- Agency thumbs-up / thumbs-down votes
-- One vote per user per agency (upsert to change vote)

CREATE TABLE IF NOT EXISTS public.agency_votes (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id  UUID        NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES public.users(id)    ON DELETE CASCADE,
  vote       BOOLEAN     NOT NULL, -- true = thumbs up, false = thumbs down
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (agency_id, user_id)
);

ALTER TABLE public.agency_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_votes_select" ON public.agency_votes
  FOR SELECT USING (true);

CREATE POLICY "agency_votes_insert" ON public.agency_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "agency_votes_update" ON public.agency_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "agency_votes_delete" ON public.agency_votes
  FOR DELETE USING (auth.uid() = user_id);
