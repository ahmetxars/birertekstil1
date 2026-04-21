'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Home, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import TrackedExternalLink from '@/components/site/TrackedExternalLink'
import { buildCategoryPath, buildProductPath } from '@/lib/site'

interface Product {
  id: string
  name: string
  description: string | null
  image: string
  featured: boolean
  category: {
    id: string
    name: string
    slug: string
  }
}

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
  whatsappNumber: string
}

export default function ProductDetail({
  product,
  relatedProducts,
  whatsappNumber,
}: ProductDetailProps) {
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
            href={buildCategoryPath(product.category.slug)}
            className="hover:text-[#a67c52] transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#3d2c1e] font-medium truncate max-w-[200px]">{product.name}</span>
        </motion.nav>

        <Button asChild variant="ghost" className="text-[#8b7355] hover:text-[#a67c52] mb-6 -ml-2">
          <Link href={buildCategoryPath(product.category.slug)}>
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
              {product.image ? (
                <Image
                  src={product.image}
                  alt={`${product.name} ürün görseli`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-[#8b7355]">Ürün Görseli</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <Badge className="self-start bg-[#a67c52]/10 text-[#a67c52] border-[#a67c52]/20 mb-4 px-3 py-1">
              {product.category.name}
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

            <Separator className="my-4 bg-[#e8e0d4]" />

            <div className="mb-8">
              <h2 className="text-sm font-semibold text-[#3d2c1e] uppercase tracking-wider mb-3">
                Ürün Açıklaması
              </h2>
              <p className="text-[#8b7355] leading-relaxed">
                {product.description ||
                  'Bu ürün için fiyat, kullanım alanı ve sipariş detaylarını WhatsApp üzerinden hızlıca öğrenebilirsiniz.'}
              </p>
            </div>

            <div className="mt-auto space-y-3">
              <TrackedExternalLink
                href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Merhaba, ${product.name} ürünü için fiyat almak istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                leadType="whatsapp"
                leadLabel={`product_${product.id}`}
                className="inline-flex items-center justify-center w-full rounded-md px-4 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: '#25D366' }}
              >
                WhatsApp ile fiyat sor
              </TrackedExternalLink>
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
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-[#8b7355]">Görsel yok</span>
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
