'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  category: {
    id: string
    name: string
    slug: string
    groupNumber: number
  }
}

interface FeaturedProductsProps {
  products: FeaturedProduct[]
  whatsappNumber: string
}

export default function FeaturedProducts({ products, whatsappNumber }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    })
  }

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
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="border-[#e8e0d4] text-[#3d2c1e] hover:bg-[#f0ebe3]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="border-[#e8e0d4] text-[#3d2c1e] hover:bg-[#f0ebe3]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="shrink-0 w-72 snap-start"
            >
              <Card className="overflow-hidden border-[#e8e0d4] hover:shadow-lg transition-shadow h-full flex flex-col">
                <Link href={buildProductPath(product.name, product.id)} className="relative w-full h-56 bg-[#f0ebe3] overflow-hidden block">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={`${product.name} ürün görseli`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
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
                </Link>

                <CardContent className="p-4 flex flex-col gap-3 flex-1">
                  <span className="text-xs text-[#a67c52] font-medium bg-[#a67c52]/10 px-2 py-1 rounded-full self-start">
                    {product.category.name}
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
          ))}
        </div>
      </div>
    </section>
  )
}
