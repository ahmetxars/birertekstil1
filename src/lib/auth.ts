// Web Crypto API — hem Edge (middleware) hem Node.js (API routes) ile çalışır

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 gün
export const COOKIE_NAME = 'bt-admin-token'

function getSecret(): string {
  return process.env.AUTH_SECRET ?? 'dev-secret-change-in-production'
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return arr
}

// ── Token oluştur ─────────────────────────────────────────────────────────
export async function createToken(): Promise<string> {
  const payload = `admin:${Date.now()}`
  const key = await getHmacKey(getSecret())
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  const token = `${payload}:${toHex(sig)}`
  return btoa(token)
}

// ── Token doğrula ─────────────────────────────────────────────────────────
export async function verifyToken(token?: string | null): Promise<boolean> {
  if (!token) return false
  try {
    const decoded = atob(token)
    const lastColon = decoded.lastIndexOf(':')
    if (lastColon === -1) return false

    const payload = decoded.substring(0, lastColon)
    const sigHex = decoded.substring(lastColon + 1)

    // Süre kontrolü
    const issuedAt = parseInt(payload.split(':')[1] ?? '0', 10)
    if (isNaN(issuedAt) || Date.now() - issuedAt > TOKEN_TTL_MS) return false

    // İmza doğrulama
    const key = await getHmacKey(getSecret())
    const sig = fromHex(sigHex)
    return await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(payload))
  } catch {
    return false
  }
}

// ── Kullanıcı adı / şifre kontrolü ───────────────────────────────────────
// Timing-safe olmayan basit karşılaştırma (brute-force'a login endpoint'teki 800ms bekleme karşı koyar)
export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.ADMIN_USERNAME ?? 'birertekstil1'
  const validPass = process.env.ADMIN_PASSWORD ?? 'berat25Erzurum.'
  return username === validUser && password === validPass
}
