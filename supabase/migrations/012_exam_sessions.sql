-- ── mock_test_attempts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mock_test_attempts (
  id                      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID         NOT NULL REFERENCES auth.users(id)       ON DELETE CASCADE,
  mock_test_id            UUID         NOT NULL REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  started_at              TIMESTAMPTZ  NOT NULL DEFAULT now(),
  expires_at              TIMESTAMPTZ  NOT NULL,
  submitted_at            TIMESTAMPTZ,
  status                  TEXT         NOT NULL DEFAULT 'in_progress'
                            CHECK (status IN ('in_progress', 'submitted', 'expired')),
  total_questions         INTEGER      NOT NULL DEFAULT 0,
  total_marks             INTEGER      NOT NULL DEFAULT 0,
  obtained_marks          INTEGER      NOT NULL DEFAULT 0,
  percentage              NUMERIC(5,2),
  time_taken_seconds      INTEGER,
  shuffled_question_order JSONB        NOT NULL DEFAULT '[]',
  created_at              TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Only one active attempt per user per test at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_attempt
  ON public.mock_test_attempts (user_id, mock_test_id)
  WHERE status = 'in_progress';

CREATE INDEX IF NOT EXISTS idx_attempts_user_id    ON public.mock_test_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_test_id    ON public.mock_test_attempts (mock_test_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status     ON public.mock_test_attempts (status);
CREATE INDEX IF NOT EXISTS idx_attempts_expires_at ON public.mock_test_attempts (expires_at);

ALTER TABLE public.mock_test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own attempts"
  ON public.mock_test_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON public.mock_test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts"
  ON public.mock_test_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- ── mock_test_answers ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mock_test_answers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      UUID        NOT NULL REFERENCES public.mock_test_attempts(id) ON DELETE CASCADE,
  question_id     UUID        NOT NULL REFERENCES public.mock_test_questions(id) ON DELETE CASCADE,
  selected_answer CHAR(1)     CHECK (selected_answer IN ('A','B','C','D')),
  is_correct      BOOLEAN,
  marks_awarded   INTEGER     NOT NULL DEFAULT 0,
  answered_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_attempt_id  ON public.mock_test_answers (attempt_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.mock_test_answers (question_id);

ALTER TABLE public.mock_test_answers ENABLE ROW LEVEL SECURITY;

-- Users can only access answers that belong to their own attempts
CREATE POLICY "Users can read own answers"
  ON public.mock_test_answers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.mock_test_attempts a
    WHERE a.id = attempt_id AND a.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own answers"
  ON public.mock_test_answers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.mock_test_attempts a
    WHERE a.id = attempt_id AND a.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own answers"
  ON public.mock_test_answers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.mock_test_attempts a
    WHERE a.id = attempt_id AND a.user_id = auth.uid()
  ));
