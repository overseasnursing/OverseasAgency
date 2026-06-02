-- Add country_slug to mock_test_locations
-- Used for DB-driven internal linking (agency cards, salary guide, migration guide)
-- instead of guessing from the location URL slug.
ALTER TABLE mock_test_locations ADD COLUMN IF NOT EXISTS country_slug text;
