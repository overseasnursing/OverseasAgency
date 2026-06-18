const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const HOST = 'overseasnursing.com'

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad request — invalid format or missing required field',
  403: 'Forbidden — API key not found at keyLocation or domain mismatch',
  422: 'Unprocessable entity — invalid URL(s) in urlList',
  429: 'Too many requests — slow down submissions',
}

/**
 * Submits URLs to IndexNow so search engines (Bing, Yandex, etc.) index
 * them immediately.  Reads INDEXNOW_API_KEY from the environment.
 *
 * @param urls  Absolute URLs to submit (e.g. ["https://overseasnursing.com/country/germany"])
 * @returns     true on success, false on any failure
 */
export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  const apiKey = process.env.INDEXNOW_API_KEY
  if (!apiKey) {
    console.error('[IndexNow] INDEXNOW_API_KEY env variable is not set')
    return false
  }

  if (urls.length === 0) {
    console.warn('[IndexNow] submitToIndexNow called with empty URL list — skipping')
    return false
  }

  const payload = {
    host: HOST,
    key: apiKey,
    keyLocation: `https://${HOST}/${apiKey}.txt`,
    urlList: urls,
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log(`[IndexNow] Submitted ${urls.length} URL(s) successfully (HTTP ${response.status})`)
      return true
    }

    const reason = STATUS_MESSAGES[response.status] ?? `Unexpected status ${response.status}`
    console.error(`[IndexNow] Submission failed: ${reason}`)
    return false
  } catch (err) {
    console.error('[IndexNow] Network error during submission:', err)
    return false
  }
}
