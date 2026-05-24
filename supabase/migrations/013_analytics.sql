-- ── Phase 6: Analytics additions ────────────────────────────────────────

-- Leaderboard toggle per test
ALTER TABLE public.mock_tests
  ADD COLUMN IF NOT EXISTS leaderboard_enabled BOOLEAN NOT NULL DEFAULT false;

-- Display name stored on each attempt (populated at session start)
ALTER TABLE public.mock_test_attempts
  ADD COLUMN IF NOT EXISTS display_name TEXT;

-- ── Index for leaderboard queries ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard
  ON public.mock_test_attempts (mock_test_id, percentage DESC, time_taken_seconds ASC)
  WHERE status = 'submitted';
