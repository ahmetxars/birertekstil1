import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isValidAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/auth'

function ensureAuthorized(request: NextRequest) {
  return isValidAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function GET(request: NextRequest) {
  if (!ensureAuthorized(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  const settings = await db.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' },
  })

  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  if (!ensureAuthorized(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const settings = await db.siteSettings.upsert({
      where: { id: 'main' },
      update: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        aboutText: body.aboutText,
        whatsappNumber: body.whatsappNumber,
        phone: body.phone,
        address: body.address,
        email: body.email,
        instagramUrl: body.instagramUrl,
      },
      create: {
        id: 'main',
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        aboutText: body.aboutText,
        whatsappNumber: body.whatsappNumber,
        phone: body.phone,
        address: body.address,
        email: body.email,
        instagramUrl: body.instagramUrl,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Site settings update error:', error)
    return NextResponse.json({ error: 'Ayarlar kaydedilirken hata oluştu' }, { status: 500 })
  }
}
