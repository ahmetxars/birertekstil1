import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const category = await db.category.findFirst({
      where: { slug },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          orderBy: { order: 'asc' },
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Category by slug GET error:', error)
    return NextResponse.json({ error: 'Kategori yüklenirken hata oluştu' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { name, slug: newSlug, description, parentId } = body

    const category = await db.category.update({
      where: { slug },
      data: {
        ...(name !== undefined && { name }),
        ...(newSlug !== undefined && { slug: newSlug }),
        ...(description !== undefined && { description: description || null }),
        ...(parentId !== undefined && { parentId: parentId || null }),
      },
      include: {
        _count: { select: { products: true } },
        parent: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json(category)
  } catch (error: unknown) {
    console.error('Category PUT error:', error)
    const msg =
      (error as { code?: string })?.code === 'P2002'
        ? 'Bu slug zaten kullanılıyor'
        : 'Kategori güncellenirken hata oluştu'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const category = await db.category.findFirst({
      where: { slug },
      include: {
        _count: { select: { products: true } },
        children: { select: { id: true } },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 })
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `Bu kategoride ${category._count.products} ürün var. Önce ürünleri silin.` },
        { status: 400 }
      )
    }

    if (category.children.length > 0) {
      return NextResponse.json(
        { error: `Bu kategorinin ${category.children.length} alt kategorisi var. Önce alt kategorileri silin.` },
        { status: 400 }
      )
    }

    await db.category.delete({ where: { slug } })
    return NextResponse.json({ message: 'Kategori silindi' })
  } catch (error) {
    console.error('Category DELETE error:', error)
    return NextResponse.json({ error: 'Kategori silinirken hata oluştu' }, { status: 500 })
  }
}
