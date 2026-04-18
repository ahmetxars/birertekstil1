import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import ProductDetail from '@/components/sections/ProductDetail'

const BASE_URL = 'https://www.birertekstil.com'

interface Props {
  params: Promise<{ slug: string; productId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId, slug } = await params
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { category: { include: { parent: true } } },
  })

  if (!product) return { title: 'Ürün Bulunamadı' }

  const title = `${product.name} | Birer Tekstil İstanbul`
  const description =
    product.description ||
    `${product.name} — ${product.category.name}. İstanbul'dan üreticiden kaliteli ev tekstili.`

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/urunler/${slug}/${productId}`,
    },
    openGraph: {
      title,
      description,
      siteName: 'Birer Tekstil',
      type: 'website',
      url: `${BASE_URL}/urunler/${slug}/${productId}`,
      ...(product.image ? { images: [{ url: product.image, width: 800, height: 600 }] } : {}),
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug, productId } = await params
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { category: { include: { parent: true } } },
  })

  if (!product || product.category.slug !== slug) notFound()

  const parent = product.category.parent

  // Breadcrumb schema
  const breadcrumbItems = [
    { position: 1, name: 'Ana Sayfa', item: BASE_URL },
    ...(parent
      ? [{ position: 2, name: parent.name, item: `${BASE_URL}/urunler/${parent.slug}` }]
      : []),
    {
      position: parent ? 3 : 2,
      name: product.category.name,
      item: `${BASE_URL}/urunler/${slug}`,
    },
    {
      position: parent ? 4 : 3,
      name: product.name,
      item: `${BASE_URL}/urunler/${slug}/${productId}`,
    },
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      ...(item.item ? { item: item.item } : {}),
    })),
  }

  // Product schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description:
      product.description ||
      `${product.name} — ${product.category.name}. İstanbul'dan üreticiden kaliteli ev tekstili.`,
    ...(product.image ? { image: product.image } : {}),
    brand: {
      '@type': 'Brand',
      name: 'Birer Tekstil',
    },
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'TRY',
      seller: {
        '@type': 'Organization',
        name: 'Birer Tekstil',
        url: BASE_URL,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Header />
      <main className="flex-1">
        <ProductDetail productId={productId} categorySlug={slug} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
