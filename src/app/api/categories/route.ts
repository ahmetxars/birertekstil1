import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { slugify } from '@/lib/site'

function isAuthorized(request: NextRequest) {
  return isValidAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: [{ groupNumber: 'asc' }, { parentId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          orderBy: [{ order: 'asc' }, { name: 'asc' }],
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json({ error: 'Kategoriler yüklenirken hata oluştu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parentId = body.parentId || null
    const name = String(body.name || '').trim()
    const description = String(body.description || '').trim() || null
    const image = String(body.image || '').trim()
    const order = Number(body.order) || 0
    const requestedSlug = String(body.slug || '').trim()

    if (!name) {
      return NextResponse.json({ error: 'Kategori adı zorunludur' }, { status: 400 })
    }

    let groupNumber = Number(body.groupNumber) || 0

    if (parentId) {
      const parent = await db.category.findUnique({
        where: { id: parentId },
        select: { id: true, groupNumber: true },
      })

      if (!parent) {
        return NextResponse.json({ error: 'Üst kategori bulunamadı' }, { status: 400 })
      }

      groupNumber = parent.groupNumber
    }

    if (!groupNumber) {
      return NextResponse.json({ error: 'Ana kategori için grup numarası zorunludur' }, { status: 400 })
    }

    const slug = slugify(requestedSlug || name)

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        image,
        order,
        groupNumber,
        parentId,
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

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Categories POST error:', error)
    return NextResponse.json({ error: 'Kategori oluşturulurken hata oluştu' }, { status: 500 })
  }
}
