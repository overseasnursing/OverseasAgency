'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient }      from '@/lib/supabase/server'
import { requireAdmin }      from '@/lib/require-admin'

export type NotificationType =
  | 'exam_complete'
  | 'achievement_unlocked'
  | 'streak_reminder'
  | 'score_report'

/* ── Queue a notification (send later via email/push provider) ─────── */
export async function queueNotification(
  userId:  string,
  type:    NotificationType,
  payload: Record<string, unknown>,
): Promise<void> {
  // Only the notification's own owner (or an admin) may queue it — prevents
  // spamming/poisoning another user's notification queue via a client-supplied id.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  await db.from('notification_queue').insert({
    user_id:    userId,
    type,
    payload,
    created_at: new Date().toISOString(),
  })
}

/* ── Mark a notification as sent (called by future email job) ──────── */
export async function markNotificationSent(notificationId: string): Promise<void> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  await db.from('notification_queue')
    .update({ sent_at: new Date().toISOString() })
    .eq('id', notificationId)
}

/* ── Get unsent notifications (called by future cron job) ─────────── */
export async function getPendingNotifications(limit = 50) {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any
  const { data } = await db
    .from('notification_queue')
    .select('*')
    .is('sent_at', null)
    .order('created_at', { ascending: true })
    .limit(limit)
  return data ?? []
}
