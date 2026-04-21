import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CategoryProducts from '@/components/sections/CategoryProducts'
import StructuredData from '@/components/site/StructuredData'
import { getAllCategorySlugs, getCategoryBySlug, getCategoryProducts, getSiteSettings } from '@/lib/catalog'
import { SITE_NAME, SITE_URL, buildCategoryPath } from '@/lib/site'

export async function generateStaticParams() {
  const categories = await getAllCategorySlugs()
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Kategori bulunamadı',
    }
  }

  return {
    title: `${category.name} Kategorisi`,
    description:
      category.description ||
      `${category.name} kategorisindeki ev tekstili ürünlerini inceleyin ve WhatsApp ile hızlı fiyat alın.`,
    alternates: {
      canonical: buildCategoryPath(category.slug),
    },
    openGraph: {
      title: `${category.name} | ${SITE_NAME}`,
      description:
        category.description ||
        `${category.name} kategorisindeki ürünleri inceleyin ve teklif alın.`,
      url: `${SITE_URL}${buildCategoryPath(category.slug)}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [settings, category] = await Promise.all([getSiteSettings(), getCategoryBySlug(slug)])

  if (!category) {
    notFound()
  }

  const products = await getCategoryProducts(category.id)

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${category.name} kategorisi`,
          url: `${SITE_URL}${buildCategoryPath(category.slug)}`,
          description: category.description,
        }}
      />
      <Header />
      <main>
        <CategoryProducts
          category={category}
          products={products}
          whatsappNumber={settings.whatsappNumber}
        />
      </main>
      <Footer settings={settings} />
    </>
  )
}
