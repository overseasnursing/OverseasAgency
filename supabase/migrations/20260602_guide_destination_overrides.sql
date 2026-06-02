-- Allows admins to manually override the auto-generated destination link cards
-- on each mock test category page (Migration Guide, Salary, Eligibility, Official Portal)
ALTER TABLE mock_test_category_guides
  ADD COLUMN IF NOT EXISTS destination_overrides JSONB NOT NULL DEFAULT '{}';
