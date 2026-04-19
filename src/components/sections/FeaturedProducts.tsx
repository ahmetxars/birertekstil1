'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string | null
  image: string
  featured: boolean
  category: {
    id: string
    name: string
  }
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const openWhatsApp = (product: Product) => {
    const message = `Merhaba, şu ürün için fiyat almak istiyorum: ${product.name} ${window.location.href}`
    const url = `https://wa.me/905332423665?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #3d2c1e 0%, #5c3d2e 100%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#a67c52] text-xs font-semibold tracking-widest uppercase">Seçkimiz</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-white/60">
              En çok tercih edilen ürünlerimizi inceleyin
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Products Scroll */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shrink-0 w-72 h-[420px] rounded-xl bg-[#f0ebe3] animate-pulse" />
            ))}
          </div>
        ) : (
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
                  {/* Product Image */}
                  <div className="relative w-full h-56 bg-[#f0ebe3] overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="288px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto rounded-full bg-[#a67c52]/10 flex items-center justify-center mb-2">
                            <svg className="h-8 w-8 text-[#a67c52]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-xs text-[#8b7355]">Ürün Görseli</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 flex flex-col gap-3 flex-1">
                    {/* Category Badge */}
                    <span className="text-xs text-[#a67c52] font-medium bg-[#a67c52]/10 px-2 py-1 rounded-full self-start">
                      {product.category.name}
                    </span>

                    {/* Product Name */}
                    <h3 className="font-semibold text-[#3d2c1e] line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#8b7355] line-clamp-2 flex-1">
                      {product.description || 'Detaylı bilgi için iletişime geçiniz.'}
                    </p>

                    {/* WhatsApp Button */}
                    <Button
                      size="sm"
                      onClick={() => openWhatsApp(product)}
                      className="w-full text-white font-medium mt-auto"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp ile Fiyat Sor
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
