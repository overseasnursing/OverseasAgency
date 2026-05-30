// Centralized freshness dates for datasets that do not carry their own lastUpdated field.
// When a dataset is reviewed, update the corresponding entry here.
// Datasets with their own lastUpdated field (pricing, exams, salaries) use that field directly
// and must NOT be duplicated here — see each data file for the authoritative date.
export const LAST_REVIEWED = {
  // countries.ts has no lastUpdated field; update this when country data is reviewed.
  countries: 'May 2026',
  // comparisons.ts has no lastUpdated field; update this when comparison data is reviewed.
  comparisons: 'May 2026',
  // agency data has no lastUpdated field; update this when agency profiles are reviewed.
  agencies: 'May 2026',
} as const

export type ReviewedDataset = keyof typeof LAST_REVIEWED
