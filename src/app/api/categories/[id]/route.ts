import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from '@/lib/auth'
import { normalizeTopLevelCategoryGroups } from '@/lib/category-groups'
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

    const requestedGroupNumber = Number(body.groupNumber) || 0
    let groupNumber = requestedGroupNumber

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

    const category = await db.$transaction(async (tx) => {
      const existingCategory = await tx.category.findUnique({
        where: { id },
        select: {
          id: true,
          groupNumber: true,
          parentId: true,
          _count: {
            select: {
              children: true,
            },
          },
        },
      })

      if (!existingCategory) {
        throw new Error('CATEGORY_NOT_FOUND')
      }

      const wasTopLevel = !existingCategory.parentId
      const willBeTopLevel = !parentId

      if (wasTopLevel && parentId && existingCategory._count.children > 0) {
        throw new Error('TOP_LEVEL_WITH_CHILDREN_CANNOT_BE_NESTED')
      }

      const updatedCategory = await tx.category.update({
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

      if (willBeTopLevel) {
        await normalizeTopLevelCategoryGroups(tx, {
          movedCategoryId: id,
          requestedGroupNumber,
        })
      } else if (wasTopLevel) {
        await normalizeTopLevelCategoryGroups(tx)
      }

      return tx.category.findUniqueOrThrow({
        where: { id: updatedCategory.id },
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
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'CATEGORY_NOT_FOUND') {
        return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 })
      }

      if (error.message === 'TOP_LEVEL_WITH_CHILDREN_CANNOT_BE_NESTED') {
        return NextResponse.json(
          { error: 'Alt kategorileri olan bir ana kategoriyi alt kategoriye ceviremezsiniz.' },
          { status: 400 }
        )
      }
    }

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

    await db.$transaction(async (tx) => {
      await tx.category.delete({
        where: { id },
      })

      if (!category.parentId) {
        await normalizeTopLevelCategoryGroups(tx)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Category DELETE error:', error)
    return NextResponse.json({ error: 'Kategori silinirken hata oluştu' }, { status: 500 })
  }
}
