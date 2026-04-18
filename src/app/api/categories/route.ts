import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentOnly = searchParams.get('parentOnly') === 'true'

    if (parentOnly) {
      // Return only parent categories with their children (for home page)
      const categories = await db.category.findMany({
        where: { parentId: null },
        orderBy: { order: 'asc' },
        include: {
          children: {
            orderBy: { order: 'asc' },
            include: {
              _count: { select: { products: true } },
            },
          },
          _count: { select: { products: true } },
        },
      })

      // Compute total product count = own products + all children's products
      const enriched = categories.map((cat) => ({
        ...cat,
        totalProductCount:
          cat._count.products +
          cat.children.reduce((sum, child) => sum + child._count.products, 0),
      }))

      return NextResponse.json(enriched)
    }

    // Default: all categories flat (for admin panel dropdowns etc.)
    const categories = await db.category.findMany({
      orderBy: [{ groupNumber: 'asc' }, { order: 'asc' }],
      include: {
        _count: { select: { products: true } },
        parent: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json({ error: 'Kategoriler yüklenirken hata oluştu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, groupNumber, parentId, order } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Ad ve slug zorunludur' }, { status: 400 })
    }

    // Auto-assign groupNumber if not provided
    let finalGroupNumber = groupNumber
    if (!finalGroupNumber) {
      const max = await db.category.aggregate({ _max: { groupNumber: true } })
      finalGroupNumber = (max._max.groupNumber ?? 0) + 1
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        description: description || null,
        groupNumber: finalGroupNumber,
        order: order ?? finalGroupNumber,
        parentId: parentId || null,
      },
      include: {
        _count: { select: { products: true } },
        parent: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: unknown) {
    console.error('Category POST error:', error)
    const msg =
      (error as { code?: string })?.code === 'P2002'
        ? 'Bu slug zaten kullanılıyor'
        : 'Kategori oluşturulurken hata oluştu'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
