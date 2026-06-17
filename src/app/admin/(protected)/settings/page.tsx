import { getAdminProfileForSettings } from '@/lib/db/admin-profile'
import { SettingsForm } from './_components/SettingsForm'

export default async function AdminSettingsPage() {
  const profile = await getAdminProfileForSettings()
  return <SettingsForm defaultProfile={profile} />
}
