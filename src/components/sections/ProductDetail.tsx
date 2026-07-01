'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Home, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import TrackedExternalLink from '@/components/site/TrackedExternalLink'
import type { ProductVariantOption } from '@/lib/product-variants'
import { buildCategoryPath, buildProductPath } from '@/lib/site'

interface Product {
  id: string
  name: string
  description: string | null
  usageAreas?: string | null
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

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
  whatsappNumber: string
}

function extractUsageAreas(description?: string | null, usageAreas?: string | null) {
  const explicitUsageAreas = usageAreas?.trim()
  if (explicitUsageAreas) {
    return {
      descriptionText: description?.trim() || '',
      usageAreasText: explicitUsageAreas,
    }
  }

  if (!description) {
    return { descriptionText: '', usageAreasText: '' }
  }

  const normalized = description.replace(/\s+/g, ' ').trim()
  const match = normalized.match(/(.*?)(?:kullanım alanları\s*[:;-]\s*)(.*)/i)

  if (!match) {
    return { descriptionText: normalized, usageAreasText: '' }
  }

  return {
    descriptionText: match[1]?.trim() || '',
    usageAreasText: match[2]?.trim() || '',
  }
}

function parseUsageAreaItems(value: string) {
  return value
    .split(/[-,;|•]+/g)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function ProductDetail({
  product,
  relatedProducts,
  whatsappNumber,
}: ProductDetailProps) {
  const topCategory = product.category.parent ?? product.category
  const galleryImages = product.images?.length ? product.images : product.image ? [product.image] : []
  const [selectedImage, setSelectedImage] = useState('')
  const [failedImages, setFailedImages] = useState<string[]>([])
  const { descriptionText, usageAreasText } = extractUsageAreas(
    product.description,
    product.usageAreas
  )
  const usageAreaItems = parseUsageAreaItems(usageAreasText)

  const visibleImages = galleryImages.filter((image) => !failedImages.includes(image))
  const activeImage =
    selectedImage && visibleImages.includes(selectedImage)
      ? selectedImage
      : visibleImages[0] || ''
  const activeVariant =
    product.variantOptions.find((option) => option.image === activeImage) ||
    product.variantOptions[0] ||
    null
  const isActiveVariantInStock = activeVariant ? activeVariant.inStock : product.inStock
  const whatsappMessage = activeVariant?.label
    ? `Merhaba, ${product.name} urununun ${activeVariant.label} rengi icin fiyat almak istiyorum.`
    : `Merhaba, ${product.name} ürünü için fiyat almak istiyorum.`

  const handleImageError = (image: string) => {
    setFailedImages((prev) => (prev.includes(image) ? prev : [...prev, image]))
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-[#8b7355] mb-6 flex-wrap"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-[#a67c52] transition-colors">
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={buildCategoryPath(topCategory.slug)}
            className="hover:text-[#a67c52] transition-colors"
          >
            {topCategory.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#3d2c1e] font-medium truncate max-w-[200px]">{product.name}</span>
        </motion.nav>

        <Button asChild variant="ghost" className="text-[#8b7355] hover:text-[#a67c52] mb-6 -ml-2">
          <Link href={buildCategoryPath(topCategory.slug)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kategoriye Dön
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full aspect-square max-h-[500px] bg-[#f0ebe3] rounded-2xl overflow-hidden border border-[#e8e0d4]">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={`${product.name} ürün görseli`}
                  fill
                  className={isActiveVariantInStock ? 'object-cover' : 'object-cover grayscale brightness-50'}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  onError={() => handleImageError(activeImage)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-[#8b7355]">Gorsel yuklenemedi</span>
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-x-0 bottom-0 bg-red-600 px-4 py-3 text-center text-sm font-bold tracking-[0.2em] text-white">
                  STOK YOK
                </div>
              )}
              {product.inStock && activeVariant && !activeVariant.inStock && (
                <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  {activeVariant.label} bitti
                </div>
              )}
            </div>
            {visibleImages.length > 1 && (
              <div className="mt-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8b7355]">
                  Renk Seçenekleri
                </p>
                <div className="flex flex-wrap gap-3">
                  {visibleImages.map((image, index) => {
                    const variant =
                      product.variantOptions.find((option) => option.image === image) || null

                    return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`relative h-20 w-20 overflow-hidden rounded-xl border transition-all ${
                        activeImage === image
                          ? 'border-[#a67c52] ring-2 ring-[#a67c52]/20'
                          : 'border-[#e8e0d4] hover:border-[#c9b08d]'
                      }`}
                    >
                        <Image
                          src={image}
                          alt={`${product.name} renk secenegi ${index + 1}`}
                          fill
                          className={variant?.inStock === false ? 'object-cover grayscale brightness-75' : 'object-cover'}
                          sizes="80px"
                          onError={() => handleImageError(image)}
                        />
                        {variant?.inStock === false && (
                          <span className="absolute inset-x-1 bottom-1 rounded-full bg-red-600 px-1 py-0.5 text-[9px] font-semibold text-white">
                            Bitti
                          </span>
                        )}
                        <span className="absolute left-1 top-1 rounded-full bg-black/65 px-1.5 py-0.5 text-[9px] text-white">
                          {variant?.label || `Renk ${index + 1}`}
                        </span>
                    </button>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <Badge className="self-start bg-[#a67c52]/10 text-[#a67c52] border-[#a67c52]/20 mb-4 px-3 py-1">
              {topCategory.name}
            </Badge>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#3d2c1e] mb-4">
              {product.name}
            </h1>

            {product.featured && (
              <div className="flex items-center gap-1.5 mb-4">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm text-amber-600 font-medium">Öne Çıkan Ürün</span>
              </div>
            )}

            {!product.inStock && (
              <Badge className="mb-4 self-start border-0 bg-red-600 px-3 py-1 text-white">
                STOK YOK
              </Badge>
            )}
            {product.inStock && activeVariant && !activeVariant.inStock && (
              <Badge className="mb-4 self-start border-0 bg-red-100 px-3 py-1 text-red-700">
                Secili renk stokta degil
              </Badge>
            )}

            <Separator className="my-4 bg-[#e8e0d4]" />

            <div className="mb-6">
              <h2 className="text-sm font-semibold text-[#3d2c1e] uppercase tracking-wider mb-3">
                Ürün Açıklaması
              </h2>
              <p className="text-[#8b7355] leading-relaxed">
                {descriptionText ||
                  'Bu ürün için fiyat, kullanım alanı ve sipariş detaylarını WhatsApp üzerinden hızlıca öğrenebilirsiniz.'}
              </p>
            </div>

            {usageAreaItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-[#3d2c1e] uppercase tracking-wider mb-3">
                  Kullanim Alanlari
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {usageAreaItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full border border-[#e8e0d4] bg-[#f8f5f0] px-3 py-1.5 text-sm font-medium text-[#6f5a45]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto space-y-3">
              <TrackedExternalLink
                href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                leadType="whatsapp"
                leadLabel={`product_${product.id}`}
                className="inline-flex items-center justify-center w-full rounded-md px-4 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: '#25D366' }}
              >
                WhatsApp ile fiyat sor
              </TrackedExternalLink>
              {activeVariant?.label && (
                <p className="text-xs text-center text-[#8b7355]">
                  Secili renk: <span className="font-medium text-[#3d2c1e]">{activeVariant.label}</span>
                </p>
              )}
              <p className="text-xs text-center text-[#8b7355]">
                Ürünün fiyat ve stok bilgisini aynı gün içinde iletebiliriz
              </p>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#3d2c1e] mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden border-[#e8e0d4] hover:shadow-md transition-all group"
                >
                  <Link href={buildProductPath(relatedProduct.name, relatedProduct.id)}>
                    <div className="relative w-full h-32 bg-[#f0ebe3] overflow-hidden">
                      {relatedProduct.image ? (
                        <Image
                          src={relatedProduct.image}
                          alt={`${relatedProduct.name} ürün görseli`}
                          fill
                          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                            relatedProduct.inStock ? '' : 'grayscale brightness-50'
                          }`}
                          sizes="(max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-[#8b7355]">Görsel yok</span>
                        </div>
                      )}
                      {!relatedProduct.inStock && (
                        <div className="absolute inset-x-0 bottom-0 bg-red-600 px-2 py-1.5 text-center text-[10px] font-bold tracking-[0.18em] text-white">
                          STOK YOK
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-medium text-[#3d2c1e] group-hover:text-[#a67c52] transition-colors line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
