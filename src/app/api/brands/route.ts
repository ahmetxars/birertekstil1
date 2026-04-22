import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    })
    return NextResponse.json(brands)
  } catch (error) {
    console.error('Brands GET error:', error)
    return NextResponse.json({ error: 'Markalar yüklenirken hata oluştu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Ad ve slug zorunludur' }, { status: 400 })
    }

    const brand = await db.brand.create({
      data: { name, slug },
      include: { _count: { select: { products: true } } },
    })

    return NextResponse.json(brand, { status: 201 })
  } catch (error: unknown) {
    console.error('Brand POST error:', error)
    const msg =
      (error as { code?: string })?.code === 'P2002'
        ? 'Bu marka adı veya slug zaten kullanılıyor'
        : 'Marka oluşturulurken hata oluştu'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
