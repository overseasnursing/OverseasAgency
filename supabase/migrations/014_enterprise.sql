-- ── Phase 7: Enterprise Enhancement Layer ───────────────────────────────

-- Bookmark questions
CREATE TABLE IF NOT EXISTS public.mock_test_bookmarks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id)              ON DELETE CASCADE,
  question_id UUID        NOT NULL REFERENCES public.mock_test_questions(id) ON DELETE CASCADE,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id     ON public.mock_test_bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_question_id ON public.mock_test_bookmarks (question_id);

ALTER TABLE public.mock_test_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON public.mock_test_bookmarks
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id          UUID    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak   INT     NOT NULL DEFAULT 0,
  longest_streak   INT     NOT NULL DEFAULT 0,
  last_study_date  DATE,
  total_study_days INT     NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own streak" ON public.user_streaks
  FOR SELECT USING (auth.uid() = user_id);
-- Streaks are updated via service role only

-- Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key TEXT        NOT NULL,
  unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_key)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.user_achievements (user_id);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);
-- Achievements inserted by service role only

-- Notification infrastructure
CREATE TABLE IF NOT EXISTS public.notification_queue (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       TEXT        NOT NULL,  -- 'exam_complete' | 'achievement' | 'streak_reminder' | 'score'
  payload    JSONB       NOT NULL DEFAULT '{}',
  sent_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_user_unsent ON public.notification_queue (user_id, sent_at)
  WHERE sent_at IS NULL;

ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
-- Managed by service role only

-- User notification preferences
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  user_id               UUID    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_on_completion   BOOLEAN NOT NULL DEFAULT true,
  email_on_achievement  BOOLEAN NOT NULL DEFAULT true,
  email_streak_reminder BOOLEAN NOT NULL DEFAULT false,
  push_enabled          BOOLEAN NOT NULL DEFAULT false,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notification prefs" ON public.user_notification_preferences
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Premium flag + publication status on mock_tests
ALTER TABLE public.mock_tests
  ADD COLUMN IF NOT EXISTS is_premium   BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS status       TEXT      NOT NULL DEFAULT 'published'
    CHECK (status IN ('published', 'draft', 'archived')),
  ADD COLUMN IF NOT EXISTS publish_at   TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_mock_tests_status   ON public.mock_tests (status);
CREATE INDEX IF NOT EXISTS idx_mock_tests_premium  ON public.mock_tests (is_premium);
