-- Questions table for mock tests
CREATE TABLE IF NOT EXISTS public.mock_test_questions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mock_test_id          UUID NOT NULL REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  question_text         TEXT NOT NULL,
  option_a              TEXT NOT NULL,
  option_b              TEXT NOT NULL,
  option_c              TEXT NOT NULL,
  option_d              TEXT NOT NULL,
  correct_answer        CHAR(1) NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
  explanation           TEXT,
  explanation_image_url TEXT,
  learning_notes        TEXT,
  difficulty            TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  marks                 INTEGER NOT NULL DEFAULT 1 CHECK (marks >= 1),
  image_url             TEXT,
  randomize_options     BOOLEAN NOT NULL DEFAULT false,
  is_active             BOOLEAN NOT NULL DEFAULT true,
  sort_order            INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mock_test_questions_test_id   ON public.mock_test_questions(mock_test_id);
CREATE INDEX IF NOT EXISTS idx_mock_test_questions_sort      ON public.mock_test_questions(mock_test_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_mock_test_questions_difficulty ON public.mock_test_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_mock_test_questions_active    ON public.mock_test_questions(is_active);

-- RLS
ALTER TABLE public.mock_test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active questions"
  ON public.mock_test_questions FOR SELECT USING (is_active = true);

-- Auto-update mock_tests.total_questions on question change
CREATE OR REPLACE FUNCTION sync_mock_test_question_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.mock_tests
     SET total_questions = (
           SELECT COUNT(*) FROM public.mock_test_questions
           WHERE mock_test_id = COALESCE(NEW.mock_test_id, OLD.mock_test_id)
             AND is_active = true
         ),
         updated_at = now()
   WHERE id = COALESCE(NEW.mock_test_id, OLD.mock_test_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_question_count ON public.mock_test_questions;
CREATE TRIGGER trg_sync_question_count
  AFTER INSERT OR UPDATE OR DELETE ON public.mock_test_questions
  FOR EACH ROW EXECUTE FUNCTION sync_mock_test_question_count();
