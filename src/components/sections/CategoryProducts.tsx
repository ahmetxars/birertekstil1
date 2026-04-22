'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import TrackedExternalLink from '@/components/site/TrackedExternalLink'
import { buildCategoryPath, buildProductPath } from '@/lib/site'

interface Product {
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
  parent?: {
    id: string
    name: string
    slug: string
  } | null
}

interface ChildCategory {
  id: string
  name: string
  slug: string
  description: string | null
  _count: { products: number }
}

interface CategoryProductsProps {
  category: Category
  products: Product[]
  childCategories: ChildCategory[]
  whatsappNumber: string
}

export default function CategoryProducts({
  category,
  products,
  childCategories,
  whatsappNumber,
}: CategoryProductsProps) {
  const hasChildren = childCategories.length > 0

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
          {category.parent && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={buildCategoryPath(category.parent.slug)}
                className="hover:text-[#a67c52] transition-colors"
              >
                {category.parent.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
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
            {hasChildren ? `${childCategories.length} alt kategori bulundu` : `${products.length} ürün bulundu`}
          </p>
        </motion.div>

        {hasChildren ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {childCategories.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Card className="border-[#e8e0d4] hover:shadow-lg transition-all h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <Badge className="self-start bg-[#a67c52]/10 text-[#a67c52] border-0 mb-4">
                      Alt Kategori
                    </Badge>
                    <h2 className="text-xl font-semibold text-[#3d2c1e] mb-3">{child.name}</h2>
                    <p className="text-sm text-[#8b7355] leading-relaxed mb-4 flex-1">
                      {child.description || 'Bu alt kategorideki ürünleri inceleyin.'}
                    </p>
                    <p className="text-sm text-[#8b7355] mb-4">{child._count.products} ürün</p>
                    <Button asChild className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white">
                      <Link href={buildCategoryPath(child.slug)}>Alt kategoriyi aç</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#8b7355] text-lg mb-4">Bu kategoride henüz ürün bulunmuyor.</p>
            <Button asChild className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white">
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Card className="overflow-hidden border-[#e8e0d4] hover:shadow-lg transition-all group h-full flex flex-col">
                  <Link href={buildProductPath(product.name, product.id)} className="relative w-full h-64 bg-[#f0ebe3] overflow-hidden block">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={`${product.name} ürün görseli`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-[#8b7355]">Ürün Görseli</span>
                      </div>
                    )}
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-[#a67c52] text-white">
                        Öne Çıkan
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-x-0 bottom-0 bg-red-600 px-3 py-2 text-center text-xs font-bold tracking-[0.2em] text-white">
                        STOK YOK
                      </div>
                    )}
                  </Link>

                  <CardContent className="p-4 flex flex-col gap-3 flex-1">
                    <Link
                      href={buildProductPath(product.name, product.id)}
                      className="font-semibold text-[#3d2c1e] group-hover:text-[#a67c52] transition-colors line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    {product.description && (
                      <p className="text-sm text-[#8b7355] line-clamp-3 flex-1">
                        {product.description}
                      </p>
                    )}
                    <div className="flex flex-col gap-2 mt-auto">
                      <Button asChild variant="outline" className="border-[#e8e0d4] hover:bg-[#f8f5f0]">
                        <Link href={buildProductPath(product.name, product.id)}>Ürünü incele</Link>
                      </Button>
                      <TrackedExternalLink
                        href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Merhaba, ${product.name} ürünü için fiyat almak istiyorum.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        leadType="whatsapp"
                        leadLabel={`category_${product.category.slug}_${product.id}`}
                        className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white"
                        style={{ backgroundColor: '#25D366' }}
                      >
                        WhatsApp ile fiyat sor
                      </TrackedExternalLink>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Button asChild variant="ghost" className="text-[#8b7355] hover:text-[#a67c52]">
            <Link href={buildCategoryPath(category.slug)}>Bu kategoriyi paylaş</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
