'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Home, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/useStore'
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

export default function ProductDetail() {
  const { selectedProductId, selectedCategoryId, navigate } = useStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!selectedProductId) return
    let cancelled = false

    fetch(`/api/products/${selectedProductId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setProduct(data)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    if (selectedCategoryId) {
      fetch(`/api/products?categoryId=${selectedCategoryId}`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return
          setRelatedProducts(data.filter((p: Product) => p.id !== selectedProductId).slice(0, 4))
        })
        .catch(() => {})
    }

    return () => { cancelled = true }
  }, [selectedProductId, selectedCategoryId])

  const openWhatsApp = () => {
    if (!product) return
    const message = `Merhaba, şu ürün için fiyat almak istiyorum: ${product.name} ${window.location.href}`
    const url = `https://wa.me/905332423665?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (!selectedProductId) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#f0ebe3] mb-4" />
          <p className="text-[#8b7355]">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8b7355] text-lg mb-4">Ürün bulunamadı</p>
          <Button onClick={() => navigate('category', selectedCategoryId!)} className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white">
            Kategoriye Dön
          </Button>
        </div>
      </div>
    )
  }

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
            onClick={() => navigate('home')}
            className="flex items-center gap-1 hover:text-[#a67c52] transition-colors"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </button>
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() => navigate('category', product.category.id)}
            className="hover:text-[#a67c52] transition-colors"
          >
            {product.category.name}
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#3d2c1e] font-medium truncate max-w-[200px]">{product.name}</span>
        </motion.nav>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('category', product.category.id)}
          className="text-[#8b7355] hover:text-[#a67c52] mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kategoriye Dön
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full aspect-square max-h-[500px] bg-[#f0ebe3] rounded-2xl overflow-hidden border border-[#e8e0d4]">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-[#a67c52]/10 flex items-center justify-center mb-4">
                      <svg className="h-12 w-12 text-[#a67c52]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#8b7355]">Ürün Görseli</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category Badge */}
            <Badge className="self-start bg-[#a67c52]/10 text-[#a67c52] border-[#a67c52]/20 mb-4 px-3 py-1">
              {product.category.name}
            </Badge>

            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#3d2c1e] mb-4">
              {product.name}
            </h1>

            {/* Featured */}
            {product.featured && (
              <div className="flex items-center gap-1.5 mb-4">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm text-amber-600 font-medium">Öne Çıkan Ürün</span>
              </div>
            )}

            <Separator className="my-4 bg-[#e8e0d4]" />

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[#3d2c1e] uppercase tracking-wider mb-3">
                  Ürün Açıklaması
                </h3>
                <p className="text-[#8b7355] leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* WhatsApp Button */}
            <div className="mt-auto">
              <Button
                size="lg"
                onClick={openWhatsApp}
                className="w-full text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: '#25D366' }}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp ile Fiyat Sor
              </Button>
              <p className="text-xs text-center text-[#8b7355] mt-2">
                Fiyat bilgisi için WhatsApp üzerinden bize yazabilirsiniz
              </p>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#3d2c1e] mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Card
                  key={rp.id}
                  className="overflow-hidden border-[#e8e0d4] hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate('product', rp.category.id, rp.id)}
                >
                  <div className="relative w-full h-32 bg-[#f0ebe3] overflow-hidden">
                    {rp.image ? (
                      <Image
                        src={rp.image}
                        alt={rp.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#a67c52]/10 flex items-center justify-center">
                          <svg className="h-5 w-5 text-[#a67c52]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="text-sm font-medium text-[#3d2c1e] group-hover:text-[#a67c52] transition-colors line-clamp-2">
                      {rp.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
