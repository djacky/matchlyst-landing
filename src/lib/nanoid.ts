/**
 * Generate a short, URL-safe unique ID for referral codes.
 * Uses crypto.getRandomValues for secure randomness.
 * Output: 10-char alphanumeric string (e.g., "k3xB7mP9nQ").
 */
export function nanoid(size = 10): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
