import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { buildProductImageGallery, serializeProductImages } from '@/lib/product-images'
import {
  parseProductVariantOptions,
  serializeProductVariantOptions,
} from '@/lib/product-variants'

function isAuthorized(request: NextRequest) {
  return isValidAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
}

function normalizeProductResponse<
  T extends {
    image: string
    images: string
    variantOptions: string
  },
>(product: T) {
  const gallery = buildProductImageGallery(product.image, product.images)

  return {
    ...product,
    images: gallery,
    variantOptions: parseProductVariantOptions(product.variantOptions, gallery),
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (featured === 'true') {
      where.featured = true
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    })

    return NextResponse.json(products.map(normalizeProductResponse))
  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json({ error: 'Ürünler yüklenirken hata oluştu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name,
      description,
      usageAreas,
      image,
      images,
      variantOptions,
      categoryId,
      featured,
      inStock,
      order,
    } = body

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Ad ve kategori alanları zorunludur' }, { status: 400 })
    }

    const gallery = buildProductImageGallery(image, images)

    const product = await db.product.create({
      data: {
        name,
        description: description || null,
        usageAreas: usageAreas || null,
        image: gallery[0] || image || '',
        images: serializeProductImages(gallery),
        variantOptions: serializeProductVariantOptions(variantOptions || [], gallery),
        categoryId,
        featured: featured || false,
        inStock: inStock ?? true,
        order: order || 0,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(normalizeProductResponse(product), { status: 201 })
  } catch (error) {
    console.error('Products POST error:', error)
    return NextResponse.json({ error: 'Ürün oluşturulurken hata oluştu' }, { status: 500 })
  }
}
