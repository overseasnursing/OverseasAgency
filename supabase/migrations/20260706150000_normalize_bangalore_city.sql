-- Data-quality fix: the country-state-city npm package's raw India dataset
-- lists Karnataka's cities as "Bengaluru", "Bangalore Urban", and
-- "Bangalore Rural" as three separate entries (mixing the official renamed
-- city with administrative district names), with no plain "Bangalore" entry
-- at all. Every admin dropdown fed from that dataset has now been fixed at
-- the source (see src/lib/data/cityNormalization.ts and its call sites), but
-- these existing rows were written before that fix existed and need a
-- one-time cleanup so the site doesn't keep showing duplicate city pages.
--
-- "Bangalore Rural" is folded into "Bangalore" here too (rather than left
-- as-is) because leaving an agency's city as an excluded/unselectable value
-- would make it permanently inconsistent with the new canonical city list —
-- see the conversation this migration came from for the specific row this
-- affects (Educaro India).

UPDATE "public"."agencies"
SET "city" = 'Bangalore'
WHERE "city" IN ('Bengaluru', 'Bangalore Urban', 'Bengaluru Urban', 'Bangalore Rural');

-- location is a free-text "City, State" display string that embeds the same
-- un-normalized city name — fix the prefix only, leave the rest (state and
-- anything after the first comma) untouched.
UPDATE "public"."agencies"
SET "location" = regexp_replace("location", '^(Bengaluru|Bangalore Urban|Bengaluru Urban|Bangalore Rural)\s*,', 'Bangalore,')
WHERE "location" ~ '^(Bengaluru|Bangalore Urban|Bengaluru Urban|Bangalore Rural)\s*,';

UPDATE "public"."branches"
SET "city" = 'Bangalore'
WHERE "city" IN ('Bengaluru', 'Bangalore Urban', 'Bengaluru Urban', 'Bangalore Rural');
