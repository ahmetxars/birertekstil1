import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetail from '@/components/sections/ProductDetail'
import StructuredData from '@/components/site/StructuredData'
import {
  getAllProductRouteParams,
  getProductByRouteParam,
  getRelatedProducts,
  getSiteSettings,
} from '@/lib/catalog'
import { SITE_NAME, SITE_URL, buildProductPath } from '@/lib/site'

export async function generateStaticParams() {
  const products = await getAllProductRouteParams()
  return products.map((product) => ({
    product: buildProductPath(product.name, product.id).split('/').pop() as string,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>
}): Promise<Metadata> {
  const { product: routeParam } = await params
  const product = await getProductByRouteParam(routeParam)

  if (!product) {
    return {
      title: 'Ürün bulunamadı',
    }
  }

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} ürünü için detayları inceleyin ve WhatsApp ile hızlı fiyat talep edin.`,
    alternates: {
      canonical: buildProductPath(product.name, product.id),
    },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description:
        product.description ||
        `${product.name} ürünü için detay ve teklif alın.`,
      url: `${SITE_URL}${buildProductPath(product.name, product.id)}`,
      images: product.image
        ? [
            {
              url: product.image,
              alt: `${product.name} ürün görseli`,
            },
          ]
        : undefined,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string }>
}) {
  const { product: routeParam } = await params
  const [settings, product] = await Promise.all([
    getSiteSettings(),
    getProductByRouteParam(routeParam),
  ])

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category.id, product.id)

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description:
            product.description ||
            `${product.name} ürünü için detay ve fiyat bilgisi Birer Tekstil üzerinden alınabilir.`,
          image: product.image ? [`${SITE_URL}${product.image}`] : undefined,
          category: product.category.name,
          brand: {
            '@type': 'Brand',
            name: SITE_NAME,
          },
        }}
      />
      <Header />
      <main>
        <ProductDetail
          product={product}
          relatedProducts={relatedProducts}
          whatsappNumber={settings.whatsappNumber}
        />
      </main>
      <Footer settings={settings} />
    </>
  )
}
