import { execSync } from 'child_process'

/**
 * Returns the date of the most recent git commit that touched `filePath`,
 * in YYYY-MM-DD format. Returns null if git is unavailable or the file has
 * no commit history (new/untracked file).
 *
 * Reliable in CI/CD because it reads git history, not filesystem mtime
 * (which CI environments reset to checkout time).
 */
export function getGitFileDate(filePath: string): string | null {
  try {
    // %ai = author date in ISO 8601 format, e.g. "2026-06-15 14:32:01 +0530"
    const out = execSync(`git log -1 --format=%ai -- "${filePath}"`, {
      cwd:      process.cwd(),
      encoding: 'utf-8',
      stdio:    ['pipe', 'pipe', 'pipe'],
    }).trim()

    if (!out) return null
    // Take only the YYYY-MM-DD portion — safe regardless of timezone offset
    return out.split(' ')[0] ?? null
  } catch {
    return null
  }
}
