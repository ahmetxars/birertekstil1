import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_PATH, LOGIN_PATH } from '@/lib/site'

export const ADMIN_SESSION_COOKIE = 'birer_admin_session'

function getEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} env değişkeni tanımlı değil`)
  }
  return value
}

export function getAdminCredentials() {
  return {
    username: getEnv('ADMIN_USERNAME'),
    password: getEnv('ADMIN_PASSWORD'),
    secret: getEnv('AUTH_SECRET'),
  }
}

function createSignature(username: string, secret: string) {
  return createHmac('sha256', secret).update(username).digest('hex')
}

export function createAdminSessionToken(username: string) {
  const { secret } = getAdminCredentials()
  return `${username}.${createSignature(username, secret)}`
}

export function isValidAdminSessionToken(token?: string | null) {
  if (!token) return false

  const [username, signature] = token.split('.')
  if (!username || !signature) return false

  const { username: expectedUsername, secret } = getAdminCredentials()
  if (username !== expectedUsername) return false

  const expected = createSignature(username, secret)
  if (signature.length !== expected.length) return false

  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return isValidAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function requireAdminUser() {
  if (!(await isAdminAuthenticated())) {
    redirect(`${LOGIN_PATH}?next=${encodeURIComponent(ADMIN_PATH)}`)
  }
}
