import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE_URL = 'https://www.birertekstil.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    db.category.findMany({ select: { slug: true } }),
    db.product.findMany({
      select: { id: true, category: { select: { slug: true } } },
    }),
  ])

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/urunler/${cat.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/urunler/${product.category.slug}/${product.id}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    {
      url: BASE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...categoryUrls,
    ...productUrls,
  ]
}
