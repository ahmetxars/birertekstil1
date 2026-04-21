'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { buildCategoryPath } from '@/lib/site'

interface HomeCategory {
  id: string
  groupNumber: number
  name: string
  slug: string
  description: string | null
  _count: { products: number }
  children: Array<{
    id: string
    name: string
    slug: string
    _count: { products: number }
  }>
}

const categoryBgImages: Record<number, string[]> = {
  1: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80',
  ],
  2: [
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
    'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=800&q=80',
  ],
  3: [
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
    'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80',
  ],
  4: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80',
  ],
  5: [
    'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
  ],
  6: [
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
  ],
  7: [
    'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=800&q=80',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
  ],
  8: [
    'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80',
    'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80',
  ],
}

export default function CategoriesSection({ categories }: { categories: HomeCategory[] }) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)

  const filters = [{ label: 'Tümü', id: null }, ...categories.map((category) => ({ label: category.name, id: category.id }))]

  const filteredCategories = activeCategoryId
    ? categories.filter((category) => category.id === activeCategoryId)
    : categories

  return (
    <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
          <p className="text-[#8b7355] max-w-2xl mx-auto">
            Kategori bazlı ürün görünürlüğü ve hızlı teklif akışı için sadeleştirilmiş ev
            tekstili koleksiyonumuzu keşfedin.
          </p>
        </motion.div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide justify-center flex-wrap">
          {filters.map((group) => (
            <button
              key={group.id ?? 'all'}
              onClick={() => setActiveCategoryId(group.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
                activeCategoryId === group.id
                  ? 'bg-[#a67c52] text-white shadow-md'
                  : 'bg-white text-[#3d2c1e] border border-[#e8e0d4] hover:bg-[#f0ebe3] hover:border-[#a67c52]/30'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId ?? 'all'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCategories.map((category, index) => {
              const bgImages = categoryBgImages[category.groupNumber] || categoryBgImages[1]

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  className="group"
                >
                  <Link
                    href={buildCategoryPath(category.slug)}
                    className="relative block h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={bgImages[0]}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors duration-300" />

                    <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-[#a67c52] text-white font-bold text-lg flex items-center justify-center shadow-lg z-10">
                      {category.groupNumber}
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#3d2c1e] z-10">
                      {category.children.length > 0
                        ? `${category.children.length} alt kategori`
                        : `${category._count.products} ürün`}
                    </div>

                    {category.children.length > 0 && (
                      <div className="absolute top-14 right-4 flex flex-wrap gap-1.5 z-10 max-w-[55%] justify-end">
                        {category.children.slice(0, 3).map((child) => (
                          <span
                            key={child.id}
                            className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[#3d2c1e]"
                          >
                            {child.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-2 group-hover:text-[#a67c52] transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-white/70 text-sm line-clamp-2 mb-3">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center text-white/80 group-hover:text-[#a67c52] transition-colors text-sm font-medium">
                        <span>
                          {category.children.length > 0 ? 'Alt kategorileri gör' : 'Kategoriye git'}
                        </span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
