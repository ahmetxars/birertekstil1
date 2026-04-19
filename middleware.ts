import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from './src/lib/auth'

// Bu endpoint'ler auth olmadan çağrılabilir (public write)
const PUBLIC_API_WRITES = [
  '/api/auth/login',
  '/api/contact',
]

function isPublicApiWrite(pathname: string): boolean {
  if (PUBLIC_API_WRITES.includes(pathname)) return true
  // Ürün view tracking: POST /api/products/[id]/view
  if (/^\/api\/products\/[^/]+\/view$/.test(pathname)) return true
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value
  const isAuthenticated = await verifyToken(token)

  // ── Admin sayfaları (/admin/login hariç) ──────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname.startsWith('/admin/login')) {
      // Zaten giriş yapılmışsa doğrudan admin'e yönlendir
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }

    if (!isAuthenticated) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // ── API write endpoint koruması ───────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const method = request.method
    const isWrite = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

    if (isWrite && !isPublicApiWrite(pathname)) {
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: 'Yetkisiz erişim' },
          { status: 401 }
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/:path*',
  ],
}
