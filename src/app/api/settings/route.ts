import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_SETTINGS = {
  id: 'main',
  whatsappNumber: '+905332423665',
  phone: '+90 533 242 36 65',
  address: 'İstanbul, Türkiye',
  email: '',
  instagramUrl: '',
  heroTitle: "İstanbul'da Üreticiden Kaliteli Ev Tekstili Ürünleri",
  heroSubtitle: 'Birer Tekstil İstanbul',
  aboutText:
    "Birer Tekstil olarak İstanbul'da 20 yılı aşkın süredir ev tekstili sektöründe faaliyet göstermekteyiz. Nevresim takımları, pike, ipek ürünler, keten, kapito ve daha birçok kategoriyle geniş bir ürün yelpazesi sunuyoruz.",
}

export async function GET() {
  try {
    let settings = await db.siteSettings.findUnique({ where: { id: 'main' } })
    if (!settings) {
      settings = await db.siteSettings.create({ data: DEFAULT_SETTINGS })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const settings = await db.siteSettings.upsert({
      where: { id: 'main' },
      update: {
        ...(body.whatsappNumber !== undefined && { whatsappNumber: body.whatsappNumber }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.instagramUrl !== undefined && { instagramUrl: body.instagramUrl }),
        ...(body.heroTitle !== undefined && { heroTitle: body.heroTitle }),
        ...(body.heroSubtitle !== undefined && { heroSubtitle: body.heroSubtitle }),
        ...(body.aboutText !== undefined && { aboutText: body.aboutText }),
      },
      create: { ...DEFAULT_SETTINGS, ...body, id: 'main' },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json({ error: 'Ayarlar kaydedilirken hata oluştu' }, { status: 500 })
  }
}
