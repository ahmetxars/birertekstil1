import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import CategoryProducts from '@/components/sections/CategoryProducts'

const BASE_URL = 'https://www.birertekstil.com'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await db.category.findFirst({
    where: { slug },
    include: { parent: true },
  })

  if (!category) return { title: 'Kategori Bulunamadı' }

  const title = `${category.name} | Birer Tekstil İstanbul`
  const description =
    category.description ||
    `${category.name} ürünlerimizi inceleyin. İstanbul'dan üreticiden kaliteli ev tekstili.`

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/urunler/${slug}`,
    },
    openGraph: {
      title,
      description,
      siteName: 'Birer Tekstil',
      type: 'website',
      url: `${BASE_URL}/urunler/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await db.category.findFirst({
    where: { slug },
    include: { parent: true },
  })

  if (!category) notFound()

  const parent = category.parent

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
      ...(parent
        ? [{ '@type': 'ListItem', position: 2, name: parent.name, item: `${BASE_URL}/urunler/${parent.slug}` }]
        : []),
      {
        '@type': 'ListItem',
        position: parent ? 3 : 2,
        name: category.name,
        item: `${BASE_URL}/urunler/${slug}`,
      },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="flex-1">
        <CategoryProducts categorySlug={slug} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
