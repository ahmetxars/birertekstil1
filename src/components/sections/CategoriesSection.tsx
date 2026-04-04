'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import Image from 'next/image'

interface Category {
  id: string
  groupNumber: number
  name: string
  slug: string
  description: string | null
  _count: { products: number }
}

interface Product {
  id: string
  name: string
  image: string
  featured: boolean
}

// Unsplash background images for each category group
const categoryBgImages: Record<number, string[]> = {
  1: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
  ],
  2: [
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
    'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=800&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
  ],
  3: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
    'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80',
  ],
  4: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
  ],
  5: [
    'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  ],
  6: [
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
  ],
  7: [
    'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=800&q=80',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
  ],
  8: [
    'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80',
  ],
}

const mainGroups = [
  { label: 'Tümü', filter: null },
  { label: 'Saten & Akfil', filter: [1] },
  { label: 'Keten & Linen', filter: [2] },
  { label: 'Nevresim', filter: [3] },
  { label: 'Pike', filter: [4, 5] },
  { label: 'İpek & Özel', filter: [6] },
  { label: 'Bez', filter: [7] },
  { label: 'Kapitone & Elyaf', filter: [8] },
]

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({})
  const [activeGroup, setActiveGroup] = useState<number[] | null>(null)
  const [loading, setLoading] = useState(true)
  const { navigate } = useStore()

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((res) => res.json()),
      fetch('/api/products').then((res) => res.json()),
    ])
      .then(([categoriesData, productsData]) => {
        setCategories(categoriesData)
        // Group products by category
        const grouped: Record<string, Product[]> = {}
        for (const product of productsData) {
          if (!grouped[product.categoryId]) {
            grouped[product.categoryId] = []
          }
          grouped[product.categoryId].push(product)
        }
        setCategoryProducts(grouped)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredCategories = activeGroup
    ? categories.filter((c) => activeGroup.includes(c.groupNumber))
    : categories

  return (
    <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8">
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
            8 farklı kategoride geniş ürün yelpazemizi keşfedin
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide justify-center flex-wrap">
          {mainGroups.map((group) => (
            <button
              key={group.label}
              onClick={() => setActiveGroup(group.filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
                activeGroup === group.filter
                  ? 'bg-[#a67c52] text-white shadow-md'
                  : 'bg-white text-[#3d2c1e] border border-[#e8e0d4] hover:bg-[#f0ebe3] hover:border-[#a67c52]/30'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* Category Cards - Large Visual Layout */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-[#f0ebe3] animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGroup ? activeGroup.join(',') : 'all'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCategories.map((cat, index) => {
                const bgImages = categoryBgImages[cat.groupNumber] || categoryBgImages[1]
                const products = categoryProducts[cat.id] || []

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.4 }}
                    className="group"
                  >
                    <div
                      onClick={() => navigate('category', cat.id)}
                      className="relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      {/* Background Images - Multiple layered */}
                      <div className="absolute inset-0">
                        <Image
                          src={bgImages[0]}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors duration-300" />

                      {/* Group Number Badge */}
                      <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-[#a67c52] text-white font-bold text-lg flex items-center justify-center shadow-lg z-10">
                        {cat.groupNumber}
                      </div>

                      {/* Product Count Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#3d2c1e] z-10">
                        {cat._count.products} ürün
                      </div>

                      {/* Small Product Thumbnails */}
                      {products.length > 0 && (
                        <div className="absolute top-14 right-4 flex gap-1.5 z-10">
                          {products.slice(0, 3).map((product, pIdx) => (
                            <div
                              key={product.id}
                              className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/80 shadow-sm"
                            >
                              {product.image && !product.image.includes('unsplash') ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#f0ebe3]" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Content at Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-2 group-hover:text-[#a67c52] transition-colors">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-white/70 text-sm line-clamp-1 mb-3">
                            {cat.description}
                          </p>
                        )}
                        <div className="flex items-center text-white/80 group-hover:text-[#a67c52] transition-colors text-sm font-medium">
                          <span>Ürünleri Gör</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
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
