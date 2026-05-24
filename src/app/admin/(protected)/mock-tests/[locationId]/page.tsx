import { redirect } from 'next/navigation'

export default async function LocationRedirect({ params }: { params: Promise<{ locationId: string }> }) {
  const { locationId } = await params
  redirect(`/admin/mock-tests/${locationId}/categories`)
}
