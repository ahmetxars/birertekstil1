'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'

interface Product {
  id: string
  name: string
  description: string | null
  image: string
  category: { id: string; name: string; slug: string }
}

function AramaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQ)
  const [inputValue, setInputValue] = useState(initialQ)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialQ) doSearch(initialQ)
  }, [initialQ, doSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = inputValue.trim()
    setQuery(q)
    router.replace(`/arama?q=${encodeURIComponent(q)}`, { scroll: false })
    doSearch(q)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[#8b7355] hover:text-[#a67c52] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Geri Dön
      </button>

      <h1 className="text-2xl font-bold text-[#3d2c1e] mb-6">Ürün Arama</h1>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a67c52]" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nevresim, pike, saten..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#e8e0d4] bg-white text-[#3d2c1e] placeholder:text-[#c4b49a] focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30 focus:border-[#a67c52] transition text-sm shadow-sm"
            autoFocus
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(''); setQuery(''); setResults([]); setSearched(false) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4b49a] hover:text-[#8b7355]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#a67c52] text-white font-medium text-sm hover:bg-[#a67c52]/90 transition-colors shadow-sm shrink-0"
        >
          Ara
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl bg-[#f0ebe3] animate-pulse h-52" />
          ))}
        </div>
      )}

      {/* Sonuçlar */}
      {!loading && searched && (
        <>
          <p className="text-sm text-[#8b7355] mb-4">
            {results.length > 0
              ? <><span className="font-semibold text-[#3d2c1e]">&quot;{query}&quot;</span> için {results.length} sonuç bulundu</>
              : <><span className="font-semibold text-[#3d2c1e]">&quot;{query}&quot;</span> için sonuç bulunamadı</>
            }
          </p>

          {results.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#f0ebe3] flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-[#a67c52]/50" />
              </div>
              <p className="text-[#8b7355] font-medium mb-2">Sonuç bulunamadı</p>
              <p className="text-sm text-[#c4b49a]">Farklı anahtar kelimeler deneyin</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/urunler/${product.category.slug}/${product.id}`)}
                  className="group rounded-xl border border-[#e8e0d4] bg-white overflow-hidden hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative w-full h-40 bg-[#f0ebe3]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="h-10 w-10 text-[#a67c52]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#a67c52] mb-1 truncate">{product.category.name}</p>
                    <p className="text-sm font-medium text-[#3d2c1e] group-hover:text-[#a67c52] transition-colors line-clamp-2">
                      {product.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* İlk açılışta hint */}
      {!loading && !searched && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#f0ebe3] flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-[#a67c52]/50" />
          </div>
          <p className="text-[#8b7355]">Aramak istediğiniz ürünü yazın</p>
          <p className="text-sm text-[#c4b49a] mt-1">Nevresim, pike, saten, keten...</p>
        </div>
      )}

    </div>
  )
}

export default function AramaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="h-8 w-32 bg-[#f0ebe3] rounded animate-pulse mb-6" />
            <div className="h-10 w-48 bg-[#f0ebe3] rounded animate-pulse mb-6" />
            <div className="flex gap-3 mb-8">
              <div className="flex-1 h-12 bg-[#f0ebe3] rounded-xl animate-pulse" />
              <div className="w-20 h-12 bg-[#f0ebe3] rounded-xl animate-pulse" />
            </div>
          </div>
        }>
          <AramaContent />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
