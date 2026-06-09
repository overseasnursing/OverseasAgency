import { getEmailConfig } from '@/lib/db/admin-profile'

const SENDPULSE_TOKEN_URL = 'https://api.sendpulse.com/oauth/access_token'
const SENDPULSE_SEND_URL  = 'https://api.sendpulse.com/smtp/emails'

async function getAccessToken(apiId: string, apiSecret: string): Promise<string> {
  const res = await fetch(SENDPULSE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: apiId, client_secret: apiSecret }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`SendPulse token error: ${res.status}`)
  const json = await res.json()
  if (!json.access_token) throw new Error('SendPulse: no access_token in response')
  return json.access_token as string
}

export interface EmailPayload {
  to: { name: string; email: string }
  subject: string
  html: string
  text?: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const config = await getEmailConfig()
  if (!config) throw new Error('Email not configured. Add SendPulse credentials in Admin → Settings.')

  const token = await getAccessToken(config.apiId, config.apiSecret)

  const body = {
    email: {
      html:    payload.html,
      text:    payload.text ?? '',
      subject: payload.subject,
      from:    { name: config.fromName, email: config.fromEmail },
      to:      [{ name: payload.to.name, email: payload.to.email }],
    },
  }

  const res = await fetch(SENDPULSE_SEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`SendPulse send error ${res.status}: ${err}`)
  }
}

// ── Email templates ───────────────────────────────────────────────────────────

export function otpEmailHtml(otp: string, agencyName: string): string {
  return `
<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f8fafc;padding:32px">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
  <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a">Verify your email</p>
  <p style="margin:0 0 24px;font-size:14px;color:#64748b">
    You requested to claim the listing for <strong>${agencyName}</strong> on OverseasNursing.com.
    Use the code below to verify your email address.
  </p>
  <div style="background:#f1f5f9;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
    <p style="margin:0;font-size:36px;font-weight:800;letter-spacing:10px;color:#0f172a">${otp}</p>
    <p style="margin:8px 0 0;font-size:12px;color:#94a3b8">Expires in 10 minutes</p>
  </div>
  <p style="margin:0;font-size:12px;color:#94a3b8">
    If you did not request this, you can safely ignore this email.
  </p>
</div>
</body></html>`
}

export function approvalEmailHtml(agencyName: string, setPasswordUrl: string): string {
  return `
<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f8fafc;padding:32px">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
  <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a">Your claim has been approved! 🎉</p>
  <p style="margin:0 0 24px;font-size:14px;color:#64748b">
    Congratulations! Your claim for <strong>${agencyName}</strong> on OverseasNursing.com has been approved.
    You can now manage your agency listing.
  </p>
  <a href="${setPasswordUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px;text-decoration:none;margin-bottom:24px">
    Set Your Password &amp; Sign In
  </a>
  <p style="margin:0;font-size:12px;color:#94a3b8">
    This link expires in 24 hours. If you have any issues, contact us at hello@overseasnursing.com.
  </p>
</div>
</body></html>`
}

export function rejectionEmailHtml(agencyName: string, reason?: string): string {
  return `
<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f8fafc;padding:32px">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
  <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a">Claim request update</p>
  <p style="margin:0 0 16px;font-size:14px;color:#64748b">
    We were unable to approve your claim request for <strong>${agencyName}</strong> at this time.
  </p>
  ${reason ? `<p style="margin:0 0 16px;font-size:14px;color:#64748b"><strong>Reason:</strong> ${reason}</p>` : ''}
  <p style="margin:0;font-size:14px;color:#64748b">
    If you believe this is an error or have additional information to provide,
    please contact us at hello@overseasnursing.com.
  </p>
</div>
</body></html>`
}
