// Custom currency glyph (combining mark U+20C1). Attaches to preceding char.
export const CURRENCY = "⃁";

export function formatPrice(n: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 2;
  const safe = Number.isFinite(n) ? n : 0;
  // Number first, glyph after — combining mark renders against last digit.
  return `${safe.toFixed(decimals)}${CURRENCY}`;
}
