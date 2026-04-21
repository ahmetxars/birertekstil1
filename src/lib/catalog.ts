import { db } from '@/lib/db'
import { extractProductIdFromParam } from '@/lib/site'

export async function getSiteSettings() {
  return db.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' },
  })
}

export async function getHomepageCategories() {
  return db.category.findMany({
    where: { parentId: null },
    orderBy: [{ groupNumber: 'asc' }, { order: 'asc' }],
    include: {
      _count: {
        select: { products: true },
      },
      children: {
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        include: {
          _count: {
            select: { products: true },
          },
        },
      },
    },
  })
}

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: { featured: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          groupNumber: true,
        },
      },
    },
  })
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
          groupNumber: true,
        },
      },
      children: {
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        include: {
          _count: {
            select: { products: true },
          },
        },
      },
      _count: {
        select: { products: true },
      },
    },
  })
}

export async function getCategoryProducts(categoryId: string) {
  const category = await db.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      children: {
        select: { id: true },
      },
    },
  })

  const categoryIds = category
    ? [category.id, ...category.children.map((child) => child.id)]
    : [categoryId]

  return db.product.findMany({
    where: {
      categoryId: {
        in: categoryIds,
      },
    },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          groupNumber: true,
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
  })
}

export async function getProductByRouteParam(param: string) {
  return db.product.findUnique({
    where: { id: extractProductIdFromParam(param) },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          groupNumber: true,
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
  })
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  return db.product.findMany({
    where: {
      categoryId,
      NOT: { id: excludeId },
    },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    take: 4,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          groupNumber: true,
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
  })
}

export async function getAllCategorySlugs() {
  return db.category.findMany({
    select: { slug: true },
    orderBy: [{ groupNumber: 'asc' }, { order: 'asc' }],
  })
}

export async function getAllProductRouteParams() {
  return db.product.findMany({
    select: { id: true, name: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
}
