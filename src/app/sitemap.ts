import type { MetadataRoute } from 'next'
import { getAllCategorySlugs, getAllProductRouteParams } from '@/lib/catalog'
import { buildCategoryPath, buildProductPath, SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getAllCategorySlugs(),
    getAllProductRouteParams(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/hakkimizda',
    '/iletisim',
    '/gizlilik-ve-kvkk',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}${buildCategoryPath(category.slug)}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}${buildProductPath(product.name, product.id)}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...productPages]
}
