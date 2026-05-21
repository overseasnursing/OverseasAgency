UPDATE public.agencies
SET
  city  = TRIM(SPLIT_PART(location, ',', 1)),
  state = TRIM(SPLIT_PART(location, ',', 2))
WHERE (city IS NULL OR city = '')
   OR (state IS NULL OR state = '');
