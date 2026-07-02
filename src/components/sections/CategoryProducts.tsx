'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDownUp, Funnel, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { buildProductPath } from '@/lib/site'
import type { ProductVariantOption } from '@/lib/product-variants'

interface Product {
  id: string
  name: string
  description: string | null
  image: string
  images: string[]
  variantOptions: ProductVariantOption[]
  featured: boolean
  inStock: boolean
  category: {
    id: string
    name: string
    slug: string
    parent?: {
      id: string
      name: string
      slug: string
    } | null
  }
}

interface Category {
  id: string
  groupNumber: number
  name: string
  slug: string
  description: string | null
}

interface CategoryProductsProps {
  category: Category
  products: Product[]
}

type SortMode = 'featured' | 'alphabetical'

function ProductListCard({ product }: { product: Product }) {
  const productHref = buildProductPath(product.name, product.id)
  const [imageIndex, setImageIndex] = useState(0)
  const gallery = product.images?.length ? product.images : product.image ? [product.image] : []
  const activeImage = gallery[imageIndex] || product.image || ''
  const variantCount = product.variantOptions?.length || gallery.length
  const topLabel = product.category.parent?.name || product.category.name

  const handleImageError = () => {
    setImageIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : prev))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="overflow-hidden rounded-[1.75rem] border border-[#eadfce] bg-white shadow-[0_14px_35px_rgba(93,67,37,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(93,67,37,0.12)] sm:rounded-3xl">
        <Link href={productHref} className="group block h-full">
          <div className="relative aspect-[0.84] bg-[#f0ebe3] sm:h-96 sm:aspect-auto">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={`${product.name} ürün görseli`}
                fill
                className={`object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
                  product.inStock ? '' : 'grayscale brightness-50'
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={handleImageError}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-[#8b7355]">Ürün görseli hazırlanıyor</span>
              </div>
            )}

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-4">
              {product.featured ? (
                <Badge className="border-0 bg-[#9b7a3e] px-2.5 py-1 text-[10px] font-medium text-white shadow-sm sm:px-3 sm:text-xs">
                  Öne Çıkan
                </Badge>
              ) : <span />}
            </div>

            {!product.inStock && (
              <div className="absolute inset-x-0 bottom-0 bg-red-600 px-3 py-2 text-center text-xs font-bold tracking-[0.2em] text-white">
                STOK YOK
              </div>
            )}
          </div>

          <CardContent className="space-y-3 p-3.5 sm:p-5">
            {variantCount > 1 && (
              <div className="-mt-8 flex justify-end pr-2 sm:-mt-9">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-[#4a3826] shadow-[0_8px_16px_rgba(93,67,37,0.14)] ring-1 ring-[#efe5d6]">
                  <span className="flex items-center gap-0.5">
                    <span className="h-3.5 w-3.5 rounded-full bg-[linear-gradient(135deg,#5f7cff,#56d9ff)]" />
                    <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-[linear-gradient(135deg,#9cf79a,#f7d66e)] ring-2 ring-white" />
                    <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-[linear-gradient(135deg,#ff87d5,#ffd48c)] ring-2 ring-white" />
                  </span>
                  +{variantCount - 1} Renk
                </span>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[13px] font-medium text-[#8b7355]">
                {topLabel}
              </p>
              <h2 className="line-clamp-2 text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#3d2c1e] transition-colors group-hover:text-[#a67c52] sm:text-2xl">
                {product.name}
              </h2>
            </div>
            {product.description && (
              <p className="line-clamp-3 text-[0.98rem] leading-relaxed text-[#8b7355] sm:line-clamp-4 sm:text-base">
                {product.description}
              </p>
            )}
            <div className="pt-1">
              <span className="text-sm font-medium text-[#9b7a3e] transition-colors group-hover:text-[#805f2c]">
                Detaylari gor
              </span>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  )
}

export default function CategoryProducts({
  category,
  products,
}: CategoryProductsProps) {
  const [sortMode, setSortMode] = useState<SortMode>('featured')
  const [stockOnly, setStockOnly] = useState(false)

  const visibleProducts = [...products]
    .filter((product) => (stockOnly ? product.inStock : true))
    .sort((first, second) => {
      if (sortMode === 'alphabetical') {
        return first.name.localeCompare(second.name, 'tr')
      }

      if (first.featured !== second.featured) {
        return Number(second.featured) - Number(first.featured)
      }

      return first.name.localeCompare(second.name, 'tr')
    })

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 text-sm text-[#8b7355]"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-[#a67c52] transition-colors">
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-[#3d2c1e] font-medium">{category.name}</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#a67c52] text-lg font-bold text-white sm:h-10 sm:w-10">
              {category.groupNumber}
            </div>
            <div className="space-y-2">
              <h1 className="text-balance text-[2.4rem] font-bold leading-[0.98] tracking-[-0.05em] text-[#3d2c1e] sm:text-3xl md:text-4xl">
                {category.name}
              </h1>
              <p className="text-base text-[#8b7355] sm:hidden">
                {visibleProducts.length} urun bulundu
              </p>
            </div>
          </div>
          {category.description && (
            <p className="ml-[60px] hidden max-w-2xl text-[#8b7355] sm:block">{category.description}</p>
          )}
          <p className="ml-[52px] mt-2 hidden text-sm text-[#8b7355] sm:block">
            {visibleProducts.length} ürün bulundu
          </p>
        </motion.div>

        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 grid grid-cols-2 gap-3 sm:hidden"
          >
            <button
              type="button"
              onClick={() => setSortMode((current) => current === 'featured' ? 'alphabetical' : 'featured')}
              className="flex items-center justify-center gap-2 rounded-none bg-[#92763a] px-4 py-4 text-sm font-semibold uppercase tracking-[0.06em] text-white transition-transform duration-200 active:scale-[0.98]"
            >
              <ArrowDownUp className="h-4 w-4" />
              {sortMode === 'featured' ? 'Siralama' : 'A-Z Siralama'}
            </button>
            <button
              type="button"
              onClick={() => setStockOnly((current) => !current)}
              className={`flex items-center justify-center gap-2 rounded-none px-4 py-4 text-sm font-semibold uppercase tracking-[0.06em] transition-transform duration-200 active:scale-[0.98] ${
                stockOnly ? 'bg-[#3d2c1e] text-white' : 'bg-[#92763a] text-white'
              }`}
            >
              <Funnel className="h-4 w-4" />
              {stockOnly ? 'Stokta Olanlar' : 'Filtreleme'}
            </button>
          </motion.div>
        )}

        {visibleProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#8b7355] text-lg mb-4">
              {products.length === 0
                ? 'Bu kategoride henüz ürün bulunmuyor.'
                : 'Secili filtreye uygun ürün bulunmuyor.'}
            </p>
            <Button asChild className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white">
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductListCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
