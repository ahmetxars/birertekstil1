import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { slugify } from '@/lib/site'

function isAuthorized(request: NextRequest) {
  return isValidAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const name = String(body.name || '').trim()
    const description = String(body.description || '').trim() || null
    const image = String(body.image || '').trim()
    const requestedSlug = String(body.slug || '').trim()
    const parentId = body.parentId || null
    const order = Number(body.order) || 0

    if (!name) {
      return NextResponse.json({ error: 'Kategori adı zorunludur' }, { status: 400 })
    }

    let groupNumber = Number(body.groupNumber) || 0

    if (parentId) {
      if (parentId === id) {
        return NextResponse.json({ error: 'Kategori kendi üst kategorisi olamaz' }, { status: 400 })
      }

      const parent = await db.category.findUnique({
        where: { id: parentId },
        select: { id: true, groupNumber: true, parentId: true },
      })

      if (!parent) {
        return NextResponse.json({ error: 'Üst kategori bulunamadı' }, { status: 400 })
      }

      if (parent.parentId) {
        return NextResponse.json({ error: 'Alt kategoriyi tekrar üst kategori yapamazsınız' }, { status: 400 })
      }

      groupNumber = parent.groupNumber
    }

    if (!groupNumber) {
      return NextResponse.json({ error: 'Ana kategori için grup numarası zorunludur' }, { status: 400 })
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name,
        slug: slugify(requestedSlug || name),
        description,
        image,
        parentId,
        order,
        groupNumber,
      },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: true,
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Category PUT error:', error)
    return NextResponse.json({ error: 'Kategori güncellenirken hata oluştu' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const { id } = await params

    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 })
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'Bu kategoriye bağlı ürünler var. Önce ürünleri taşıyın veya silin.' },
        { status: 400 }
      )
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: 'Bu kategoriye bağlı alt kategoriler var. Önce alt kategorileri silin.' },
        { status: 400 }
      )
    }

    await db.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Category DELETE error:', error)
    return NextResponse.json({ error: 'Kategori silinirken hata oluştu' }, { status: 500 })
  }
}
