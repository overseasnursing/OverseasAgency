-- Exam Difficulty was removed from both mock-test review submission forms
-- (post-exam quick review + inline category-page review). New reviews no
-- longer collect a difficulty rating, so the column can no longer be
-- guaranteed a value on insert.
ALTER TABLE "public"."mock_test_reviews" ALTER COLUMN "difficulty" DROP NOT NULL;
