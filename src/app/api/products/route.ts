import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')?.trim()

    const where: Record<string, unknown> = {}

    if (categoryId) where.categoryId = categoryId
    if (featured === 'true') where.featured = true
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json({ error: 'Ürünler yüklenirken hata oluştu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image, images, categoryId, featured, order } = body

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Ad ve kategori alanları zorunludur' }, { status: 400 })
    }

    const product = await db.product.create({
      data: {
        name,
        description: description || null,
        image: image || '',
        images: typeof images === 'string' ? images : JSON.stringify(images ?? []),
        categoryId,
        featured: featured || false,
        order: order || 0,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Products POST error:', error)
    return NextResponse.json({ error: 'Ürün oluşturulurken hata oluştu' }, { status: 500 })
  }
}
