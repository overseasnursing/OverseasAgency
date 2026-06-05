import { redirect } from 'next/navigation'

// Agency compare tool removed — query-param URLs like ?a=X&b=Y were being indexed
// by Google as thousands of near-duplicate pages. All existing URLs redirect to
// the agencies listing where users can browse and find agencies.
export default function AgencyComparePage() {
  redirect('/agencies')
}
