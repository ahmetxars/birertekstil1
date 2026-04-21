import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, getAdminCredentials } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body as { username?: string; password?: string }
    const credentials = getAdminCredentials()

    if (username !== credentials.username || password !== credentials.password) {
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(credentials.username), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Giriş sırasında bir hata oluştu' }, { status: 500 })
  }
}
