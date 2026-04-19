import { NextRequest, NextResponse } from 'next/server'
import { checkCredentials, createToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre gerekli' }, { status: 400 })
    }

    if (!checkCredentials(username, password)) {
      // Kısa bekleme — brute-force'u yavaşlatır
      await new Promise((r) => setTimeout(r, 800))
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 })
    }

    const token = await createToken()

    const response = NextResponse.json({ ok: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
