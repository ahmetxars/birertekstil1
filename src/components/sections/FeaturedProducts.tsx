'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import TrackedExternalLink from '@/components/site/TrackedExternalLink'
import { buildProductPath } from '@/lib/site'

interface FeaturedProduct {
  id: string
  name: string
  description: string | null
  image: string
  featured: boolean
  inStock: boolean
  category: {
    id: string
    name: string
    slug: string
    groupNumber: number
    parent?: {
      id: string
      name: string
      slug: string
    } | null
  }
}

interface FeaturedProductsProps {
  products: FeaturedProduct[]
  whatsappNumber: string
}

export default function FeaturedProducts({ products, whatsappNumber }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null
  }

  const marqueeProducts = products.length > 1 ? [...products, ...products] : products
  const animationDuration = Math.max(products.length * 8, 28)

  return (
    <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-2">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-[#8b7355]">
              Hızlı teklif almak için en çok ilgi gören ürünleri inceleyin
            </p>
          </div>
        </motion.div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-16" />

          <div
            className="flex w-max gap-4 pb-4 will-change-transform hover:[animation-play-state:paused]"
            style={{
              animation: products.length > 1 ? `featured-marquee ${animationDuration}s linear infinite` : 'none',
            }}
          >
          {marqueeProducts.map((product, index) => {
            const topCategory = product.category.parent ?? product.category

            return (
            <motion.div
              key={`${product.id}-${index}`}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index, products.length - 1) * 0.08, duration: 0.4 }}
              className="w-[16.75rem] shrink-0 sm:w-72"
            >
              <Card className="overflow-hidden border-[#e8e0d4] hover:shadow-lg transition-shadow h-full flex flex-col">
                <Link href={buildProductPath(product.name, product.id)} className="relative w-full h-56 bg-[#f0ebe3] overflow-hidden block">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={`${product.name} ürün görseli`}
                      fill
                      className={`object-cover transition-transform duration-500 hover:scale-105 ${
                        product.inStock ? '' : 'grayscale brightness-50'
                      }`}
                      sizes="288px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[#a67c52]/10 flex items-center justify-center mb-2" />
                        <span className="text-xs text-[#8b7355]">Ürün Görseli</span>
                      </div>
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-x-0 bottom-0 bg-red-600 px-3 py-2 text-center text-xs font-bold tracking-[0.2em] text-white">
                      STOK YOK
                    </div>
                  )}
                </Link>

                <CardContent className="p-4 flex flex-col gap-3 flex-1">
                  <span className="text-xs text-[#a67c52] font-medium bg-[#a67c52]/10 px-2 py-1 rounded-full self-start">
                    {topCategory.name}
                  </span>

                  <Link
                    href={buildProductPath(product.name, product.id)}
                    className="font-semibold text-[#3d2c1e] line-clamp-2 hover:text-[#a67c52] transition-colors"
                  >
                    {product.name}
                  </Link>

                  <p className="text-sm text-[#8b7355] line-clamp-3 flex-1">
                    {product.description || 'Detaylı bilgi ve fiyat için WhatsApp üzerinden yazın.'}
                  </p>

                  <TrackedExternalLink
                    href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Merhaba, ${product.name} ürünü için fiyat almak istiyorum.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    leadType="whatsapp"
                    leadLabel={`featured_${product.id}`}
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white mt-auto"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    WhatsApp ile fiyat sor
                  </TrackedExternalLink>
                </CardContent>
              </Card>
            </motion.div>
            )
          })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes featured-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </section>
  )
}
