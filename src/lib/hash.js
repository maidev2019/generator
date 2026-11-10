export async function sha256(text) {
  if (!globalThis.crypto?.subtle) throw new Error('SHA-256 requires HTTPS or localhost (Web Crypto API)');
  const bytes = new TextEncoder().encode(text);
  const buffer = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
}
