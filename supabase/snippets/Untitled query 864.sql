-- Step 1: Wipe the remote migration tracking history table clean
TRUNCATE TABLE _supabase.migrations;

-- Step 2: Insert your new baseline so it matches your local file
INSERT INTO _supabase.migrations (version) VALUES ('20260606000000');