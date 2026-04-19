'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Home, Star, Eye, Share2, Check, Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { useSettings } from '@/hooks/useSettings'

interface Product {
  id: string
  name: string
  description: string | null
  image: string
  images: string   // JSON string: ["url1","url2",...]
  featured: boolean
  viewCount: number
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Props {
  productId: string
  categorySlug: string
}

export default function ProductDetail({ productId, categorySlug }: Props) {
  const router = useRouter()
  const settings = useSettings()
  const { isFavorite, toggle: toggleFavorite } = useFavorites()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data: Product) => {
        if (cancelled) return
        setProduct(data)
        setLoading(false)
        // Track view (fire-and-forget)
        fetch(`/api/products/${productId}/view`, { method: 'POST' }).catch(() => {})
        // Fetch related products
        return fetch(`/api/products?categoryId=${data.category.id}`).then((res) => res.json())
      })
      .then((related) => {
        if (cancelled || !related) return
        setRelatedProducts((related as Product[]).filter((p) => p.id !== productId).slice(0, 4))
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [productId])

  // Tüm görselleri birleştir: images JSON + image fallback
  const allImages = (() => {
    if (!product) return []
    let extras: string[] = []
    try { extras = JSON.parse(product.images ?? '[]') } catch { extras = [] }
    const combined = [...(product.image ? [product.image] : []), ...extras.filter(u => u && u !== product.image)]
    return combined.length > 0 ? combined : []
  })()

  const openWhatsApp = () => {
    if (!product) return
    const message = `Merhaba, şu ürün için fiyat almak istiyorum: ${product.name} — ${window.location.href}`
    const waNumber = settings.whatsappNumber.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleShare = async () => {
    if (!product) return
    const url = window.location.href
    const title = product.name
    const text = `${product.name} — Birer Tekstil`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch {
        // user cancelled or share failed, fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently fail
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6">
            {[80, 60, 120].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`h-4 w-${w === 80 ? '20' : w === 60 ? '16' : '32'} bg-[#f0ebe3] rounded animate-pulse`} />
                {i < 2 && <div className="h-4 w-3 bg-[#f0ebe3] rounded animate-pulse" />}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image skeleton */}
            <div className="aspect-square max-h-[500px] bg-[#f0ebe3] rounded-2xl animate-pulse" />
            {/* Info skeleton */}
            <div className="space-y-4 pt-4">
              <div className="h-6 w-24 bg-[#f0ebe3] rounded-full animate-pulse" />
              <div className="h-10 w-3/4 bg-[#f0ebe3] rounded animate-pulse" />
              <div className="h-px w-full bg-[#f0ebe3]" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#f0ebe3] rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-[#f0ebe3] rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-[#f0ebe3] rounded animate-pulse" />
              </div>
              <div className="h-14 w-full bg-[#f0ebe3] rounded-xl animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8b7355] text-lg mb-4">Ürün bulunamadı</p>
          <Button
            onClick={() => router.push(`/urunler/${categorySlug}`)}
            className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white"
          >
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
            onClick={() => router.push('/')}
            className="flex items-center gap-1 hover:text-[#a67c52] transition-colors"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </button>
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() => router.push(`/urunler/${categorySlug}`)}
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
          onClick={() => router.push(`/urunler/${categorySlug}`)}
          className="text-[#8b7355] hover:text-[#a67c52] mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kategoriye Dön
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            {/* Ana görsel */}
            <div className="relative w-full aspect-square max-h-[500px] bg-[#f0ebe3] rounded-2xl overflow-hidden border border-[#e8e0d4]">
              {allImages.length > 0 ? (
                <Image
                  src={allImages[activeImg]}
                  alt={`${product.name} - görsel ${activeImg + 1}`}
                  fill
                  className="object-cover transition-opacity duration-300"
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
              {/* Görsel sayacı */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {activeImg + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail şeridi */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {allImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImg ? 'border-[#a67c52] opacity-100' : 'border-[#e8e0d4] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={url} alt={`Görsel ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
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

            {/* Featured + view count + favorite */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {product.featured && (
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm text-amber-600 font-medium">Öne Çıkan Ürün</span>
                </div>
              )}
              {product.viewCount > 0 && (
                <div className="flex items-center gap-1.5 text-[#8b7355]">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{product.viewCount.toLocaleString('tr-TR')} görüntülenme</span>
                </div>
              )}
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  isFavorite(product.id)
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'border-[#e8e0d4] text-[#8b7355] hover:border-rose-300 hover:text-rose-500'
                }`}
                aria-label={isFavorite(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              >
                <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                {isFavorite(product.id) ? 'Favori' : 'Favorile'}
              </button>
            </div>

            <Separator className="my-4 bg-[#e8e0d4]" />

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[#3d2c1e] uppercase tracking-wider mb-3">
                  Ürün Açıklaması
                </h3>
                <p className="text-[#8b7355] leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* WhatsApp + Share Buttons */}
            <div className="mt-auto space-y-3">
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

              <Button
                size="lg"
                variant="outline"
                onClick={handleShare}
                className="w-full border-[#e8e0d4] text-[#8b7355] hover:border-[#a67c52] hover:text-[#a67c52] hover:bg-[#a67c52]/5 py-5"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-green-600">Bağlantı Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Ürünü Paylaş
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-[#8b7355]">
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
                  onClick={() => router.push(`/urunler/${rp.category.slug}/${rp.id}`)}
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
