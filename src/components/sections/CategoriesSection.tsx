'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface SubCategory {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

interface Category {
  id: string
  groupNumber: number
  name: string
  slug: string
  description: string | null
  totalProductCount: number
  children: SubCategory[]
}

// Category background images by groupNumber
const categoryBgImages: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  2: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
  3: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
  4: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  5: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80',
  6: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80',
  7: 'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=800&q=80',
}

const categoryEmojis: Record<number, string> = {
  1: '🛏️',
  2: '🧺',
  3: '🧵',
  4: '🌿',
  5: '🧶',
  6: '🏛️',
  7: '🛠️',
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/categories?parentOnly=true')
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-3">
            Ürün Gruplarımız
          </h2>
          <p className="text-[#8b7355] max-w-xl mx-auto">
            7 farklı kategoride geniş ürün yelpazemizi keşfedin
          </p>
        </motion.div>

        {/* Category Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-[#f0ebe3] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat, index) => {
              const bgImage = categoryBgImages[cat.groupNumber] || categoryBgImages[1]
              const emoji = categoryEmojis[cat.groupNumber] || '📦'

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07, duration: 0.4 }}
                  className="group"
                >
                  <div
                    onClick={() => router.push(`/urunler/${cat.slug}`)}
                    className="relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={bgImage}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 group-hover:from-black/75 transition-colors duration-300" />

                    {/* Emoji Badge */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl z-10 border border-white/20">
                      {emoji}
                    </div>

                    {/* Product Count Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#3d2c1e] z-10">
                      {cat.totalProductCount} ürün
                    </div>

                    {/* Content at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-[#d4a96a] transition-colors">
                        {cat.name}
                      </h3>

                      {/* Subcategory pills */}
                      {cat.children.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {cat.children.slice(0, 2).map((child) => (
                            <span
                              key={child.id}
                              className="text-[10px] bg-white/15 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-full border border-white/20"
                            >
                              {child.name}
                            </span>
                          ))}
                          {cat.children.length > 2 && (
                            <span className="text-[10px] bg-white/15 backdrop-blur-sm text-white/70 px-2 py-0.5 rounded-full border border-white/20">
                              +{cat.children.length - 2} daha
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center text-white/80 group-hover:text-[#d4a96a] transition-colors text-sm font-medium">
                        <span>Ürünleri Gör</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://wa.me/905332423665?text=Merhaba, ürünleriniz hakkında bilgi almak istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Tüm Ürünler İçin WhatsApp ile İletişime Geçin
          </a>
        </motion.div>
      </div>
    </section>
  )
}
