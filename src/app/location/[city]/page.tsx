import { notFound, redirect } from 'next/navigation'
import { getAllLocationCitiesFromDb, getLocationPageData, toSlug } from '@/lib/data/getLocationData'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  const cities = await getAllLocationCitiesFromDb()
  return cities.map((c) => ({ city: c.slug }))
}

// 301 permanent redirect to the canonical URL at /agencies/[stateSlug]/[citySlug]
export default async function LocationPageRedirect({ params }: PageProps) {
  const { city } = await params
  const data = await getLocationPageData(city)
  if (!data) notFound()
  redirect(`/agencies/${toSlug(data.state)}/${data.citySlug}`)
}
