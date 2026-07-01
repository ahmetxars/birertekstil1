'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
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

function ProductListCard({ product }: { product: Product }) {
  const productHref = buildProductPath(product.name, product.id)
  const [imageIndex, setImageIndex] = useState(0)
  const gallery = product.images?.length ? product.images : product.image ? [product.image] : []
  const activeImage = gallery[imageIndex] || product.image || ''
  const variantCount = product.variantOptions?.length || gallery.length

  const handleImageError = () => {
    setImageIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : prev))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="overflow-hidden border-[#e8e0d4] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <Link href={productHref} className="group block h-full">
          <div className="relative h-80 bg-[#f0ebe3] sm:h-96">
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

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
              {product.featured ? (
                <Badge className="bg-[#a67c52] text-white shadow-sm">Öne Çıkan</Badge>
              ) : <span />}
              {variantCount > 1 && (
                <Badge className="border-0 bg-white/95 text-[#3d2c1e] shadow-sm">
                  +{variantCount - 1} renk
                </Badge>
              )}
            </div>

            {!product.inStock && (
              <div className="absolute inset-x-0 bottom-0 bg-red-600 px-3 py-2 text-center text-xs font-bold tracking-[0.2em] text-white">
                STOK YOK
              </div>
            )}
          </div>

          <CardContent className="space-y-3 p-5">
            <h2 className="text-2xl font-semibold leading-tight text-[#3d2c1e] transition-colors group-hover:text-[#a67c52]">
              {product.name}
            </h2>
            {product.description && (
              <p className="line-clamp-4 text-base leading-relaxed text-[#8b7355]">
                {product.description}
              </p>
            )}
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
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-[#8b7355] mb-6"
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
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#a67c52] text-white font-bold text-lg shrink-0">
              {category.groupNumber}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#3d2c1e]">{category.name}</h1>
          </div>
          {category.description && (
            <p className="text-[#8b7355] max-w-2xl ml-[52px]">{category.description}</p>
          )}
          <p className="text-sm text-[#8b7355] ml-[52px] mt-2">
            {products.length} ürün bulundu
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#8b7355] text-lg mb-4">Bu kategoride henüz ürün bulunmuyor.</p>
            <Button asChild className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white">
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductListCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
