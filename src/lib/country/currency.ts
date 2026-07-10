/**
 * Currency Foundation (Phase 7) — display-layer preparation only.
 *
 * agencies.pricing_currency has existed since Phase 1 (derived automatically
 * from source_country whenever an agency is saved — see saveAgency() /
 * submitAgency()) but nothing renders it: every price in the UI today still
 * hardcodes ₹/lakhs formatting, because that's the only currency real data
 * has ever existed in. This function is the formatter future work will call
 * once a UI surface actually needs to render a non-INR price — it does not,
 * by itself, change what any page displays.
 *
 * Deliberately not wired into any component this phase: "no UI redesign, no
 * conversion engine, foundation only." No FX conversion happens here either
 * — this only formats an amount that's already in the given currency's own
 * units (matching how pricing_min_lakhs/pricing_max_lakhs are already
 * stored in whatever currency the agency itself quotes in, per
 * pricing_currency — see the multi_country_readiness migration).
 */

/** Native Intl.NumberFormat — no new dependency, matches every locale/currency pair correctly. */
export function formatCurrencyAmount(amount: number, currencyCode: string, locale = 'en-IN'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
  } catch {
    // Unknown/invalid currency code — fall back to a plain number rather
    // than throwing and breaking whatever page called this.
    return amount.toLocaleString(locale)
  }
}
