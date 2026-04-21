import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from '@/lib/auth'
import { db } from '@/lib/db'

function isAuthorized(request: NextRequest) {
  return isValidAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product GET error:', error)
    return NextResponse.json({ error: 'Ürün yüklenirken hata oluştu' }, { status: 500 })
  }
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
    const { name, description, image, images, categoryId, featured, order } = body

    const product = await db.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(images !== undefined && { images: typeof images === 'string' ? images : JSON.stringify(images) }),
        ...(categoryId !== undefined && { categoryId }),
        ...(featured !== undefined && { featured }),
        ...(order !== undefined && { order }),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product PUT error:', error)
    return NextResponse.json({ error: 'Ürün güncellenirken hata oluştu' }, { status: 500 })
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

    await db.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Ürün başarıyla silindi' })
  } catch (error) {
    console.error('Product DELETE error:', error)
    return NextResponse.json({ error: 'Ürün silinirken hata oluştu' }, { status: 500 })
  }
}
