'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Home, ArrowRight, SlidersHorizontal, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useSettings } from '@/hooks/useSettings'
import { useFavorites } from '@/hooks/useFavorites'

interface SubCategory {
  id: string
  name: string
  slug: string
  description: string | null
  _count: { products: number }
}

interface Product {
  id: string
  name: string
  description: string | null
  image: string
  featured: boolean
  viewCount: number
  createdAt: string
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  groupNumber: number
  name: string
  slug: string
  description: string | null
  parentId: string | null
  parent: { id: string; name: string; slug: string } | null
  children: SubCategory[]
}

interface Props {
  categorySlug: string
}

// Subcategory card background images
const subCategoryBgs = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80',
  'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=600&q=80',
  'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&q=80',
  'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&q=80',
]

export default function CategoryProducts({ categorySlug }: Props) {
  const router = useRouter()
  const { whatsappNumber } = useSettings()
  const { isFavorite, toggle: toggleFavorite } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<'default' | 'az' | 'za' | 'featured'>('default')

  const isNew = (createdAt: string) => {
    const diffMs = Date.now() - new Date(createdAt).getTime()
    return diffMs < 30 * 24 * 60 * 60 * 1000 // 30 gün
  }
  const isPopular = (viewCount: number) => viewCount >= 50

  useEffect(() => {
    let cancelled = false

    fetch(`/api/categories/${categorySlug}`)
      .then((res) => res.json())
      .then((cat: Category) => {
        if (cancelled) return
        setCategory(cat)

        // If this is a leaf category (no children), fetch its products
        if (!cat.children || cat.children.length === 0) {
          return fetch(`/api/products?categoryId=${cat.id}`).then((res) => res.json())
        }
        // Parent category: no direct products to fetch
        return []
      })
      .then((productsData) => {
        if (cancelled || !productsData) return
        setProducts(Array.isArray(productsData) ? productsData : [])
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [categorySlug])

  const sortedProducts = useMemo(() => {
    const arr = [...products]
    if (sort === 'az') return arr.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    if (sort === 'za') return arr.sort((a, b) => b.name.localeCompare(a.name, 'tr'))
    if (sort === 'featured') return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return arr // default: server order
  }, [products, sort])

  const openWhatsApp = (product: Product) => {
    const waClean = whatsappNumber.replace(/[^0-9]/g, '')
    const message = `Merhaba, şu ürün için fiyat almak istiyorum: ${product.name} — ${window.location.href}`
    window.open(`https://wa.me/${waClean}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const isParentCategory = category && category.children && category.children.length > 0

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-[#8b7355] mb-6 flex-wrap"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 hover:text-[#a67c52] transition-colors"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </button>

          {category?.parent && (
            <>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <button
                onClick={() => router.push(`/urunler/${category.parent!.slug}`)}
                className="hover:text-[#a67c52] transition-colors"
              >
                {category.parent.name}
              </button>
            </>
          )}

          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-[#3d2c1e] font-medium">{category?.name || 'Kategori'}</span>
        </motion.nav>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-2">
            {category?.name}
          </h1>
          {category?.description && (
            <p className="text-[#8b7355] max-w-2xl">{category.description}</p>
          )}
          {!loading && (
            <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
              <p className="text-sm text-[#8b7355]">
                {isParentCategory
                  ? `${category.children.length} alt kategori`
                  : `${products.length} ürün bulundu`}
              </p>
              {/* Sort filter — only for leaf categories with products */}
              {!isParentCategory && products.length > 1 && (
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#8b7355] shrink-0" />
                  <div className="flex gap-1 flex-wrap">
                    {([
                      { value: 'default', label: 'Varsayılan' },
                      { value: 'featured', label: 'Öne Çıkanlar' },
                      { value: 'az', label: 'A → Z' },
                      { value: 'za', label: 'Z → A' },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSort(opt.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                          sort === opt.value
                            ? 'bg-[#a67c52] text-white border-[#a67c52]'
                            : 'bg-white text-[#8b7355] border-[#e8e0d4] hover:border-[#a67c52] hover:text-[#a67c52]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-[#f0ebe3] animate-pulse" />
            ))}
          </div>
        )}

        {/* Parent Category: Show Subcategory Cards */}
        {!loading && isParentCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {category.children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
                className="group"
              >
                <div
                  onClick={() => router.push(`/urunler/${child.slug}`)}
                  className="relative h-52 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-400 border border-[#e8e0d4]"
                >
                  {/* Background */}
                  <div className="absolute inset-0">
                    <Image
                      src={subCategoryBgs[index % subCategoryBgs.length]}
                      alt={child.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

                  {/* Product count */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-[#3d2c1e]">
                    {child._count.products} ürün
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white text-base mb-1 group-hover:text-[#d4a96a] transition-colors line-clamp-2">
                      {child.name}
                    </h3>
                    {child.description && (
                      <p className="text-white/65 text-xs line-clamp-1 mb-2">
                        {child.description}
                      </p>
                    )}
                    <div className="flex items-center text-white/80 group-hover:text-[#d4a96a] transition-colors text-sm font-medium">
                      <span>İncele</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Leaf Category: Show Products */}
        {!loading && !isParentCategory && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#f0ebe3] flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-[#8b7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-[#8b7355] text-lg mb-4">Bu kategoride henüz ürün bulunmuyor.</p>
            <Button onClick={() => router.push('/')} className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white">
              Ana Sayfaya Dön
            </Button>
          </div>
        )}

        {!loading && !isParentCategory && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Card
                  className="overflow-hidden border-[#e8e0d4] hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col"
                  onClick={() => router.push(`/urunler/${categorySlug}/${product.id}`)}
                >
                  {/* Product Image */}
                  <div className="relative w-full h-64 bg-[#f0ebe3] overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-14 h-14 mx-auto rounded-full bg-[#a67c52]/10 flex items-center justify-center mb-2">
                            <svg className="h-7 w-7 text-[#a67c52]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-xs text-[#8b7355]">Ürün Görseli</span>
                        </div>
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.featured && (
                        <Badge className="bg-[#a67c52] text-white text-[10px] px-2 py-0.5">
                          <svg className="h-2.5 w-2.5 mr-1 fill-white" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          Öne Çıkan
                        </Badge>
                      )}
                      {isNew(product.createdAt) && (
                        <Badge className="bg-emerald-500 text-white text-[10px] px-2 py-0.5">
                          Yeni
                        </Badge>
                      )}
                      {isPopular(product.viewCount) && (
                        <Badge className="bg-rose-500 text-white text-[10px] px-2 py-0.5">
                          🔥 Popüler
                        </Badge>
                      )}
                    </div>

                    {/* Favorite button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm transition-all ${
                        isFavorite(product.id)
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/90 text-[#8b7355] hover:text-rose-500'
                      }`}
                      aria-label={isFavorite(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  <CardContent className="p-4 flex flex-col gap-3 flex-1">
                    <h3 className="font-semibold text-[#3d2c1e] group-hover:text-[#a67c52] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-[#8b7355] line-clamp-2 flex-1">
                        {product.description}
                      </p>
                    )}
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openWhatsApp(product)
                      }}
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
    </div>
  )
}
