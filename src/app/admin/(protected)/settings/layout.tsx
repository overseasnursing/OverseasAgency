import { requirePermission } from '@/lib/require-admin'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  await requirePermission('settings')
  return <>{children}</>
}
