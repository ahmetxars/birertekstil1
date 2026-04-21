import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { DEFAULT_CATEGORY_TREE } from '@/lib/default-taxonomy'

export async function POST() {
  const cookieStore = await cookies()
  if (!isValidAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    // Clear existing data
    await db.product.deleteMany()
    await db.category.deleteMany()

    for (const rootCategory of DEFAULT_CATEGORY_TREE) {
      const createdRoot = await db.category.create({
        data: {
          groupNumber: rootCategory.groupNumber,
          name: rootCategory.name,
          slug: rootCategory.slug,
          description: rootCategory.description,
          order: rootCategory.order,
          products: {
            create:
              rootCategory.products?.map((product, idx) => ({
                ...product,
                image: product.image || '',
                order: idx,
              })) || [],
          },
        },
      })

      for (const childCategory of rootCategory.children || []) {
        await db.category.create({
          data: {
            groupNumber: rootCategory.groupNumber,
            name: childCategory.name,
            slug: childCategory.slug,
            description: childCategory.description,
            order: childCategory.order,
            parentId: createdRoot.id,
            products: {
              create:
                childCategory.products?.map((product, idx) => ({
                  ...product,
                  image: product.image || '',
                  order: idx,
                })) || [],
            },
          },
        })
      }
    }

    return NextResponse.json({ message: 'Veriler başarıyla yüklendi' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Veriler yüklenirken hata oluştu' }, { status: 500 })
  }
}
