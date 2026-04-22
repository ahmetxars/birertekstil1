'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string | null
  image: string
  category: { id: string; name: string; slug: string }
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQ)
  const [inputValue, setInputValue] = useState(initialQ)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      return
    }
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
    void doSearch(q)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-[#8b7355] transition-colors hover:text-[#a67c52]"
      >
        <ArrowLeft className="h-4 w-4" /> Geri Dön
      </button>

      <h1 className="mb-6 text-2xl font-bold text-[#3d2c1e]">Ürün Arama</h1>

      <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a67c52]" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nevresim, pike, saten..."
            className="w-full rounded-xl border border-[#e8e0d4] bg-white py-3 pl-10 pr-10 text-sm text-[#3d2c1e] placeholder:text-[#c4b49a] shadow-sm transition focus:border-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
            autoFocus
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('')
                setQuery('')
                setResults([])
                setSearched(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4b49a] hover:text-[#8b7355]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-[#a67c52] px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#a67c52]/90"
        >
          Ara
        </button>
      </form>

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl bg-[#f0ebe3]" />
          ))}
        </div>
      )}

      {!loading && searched && (
        <>
          <p className="mb-4 text-sm text-[#8b7355]">
            {results.length > 0 ? (
              <>
                <span className="font-semibold text-[#3d2c1e]">&quot;{query}&quot;</span> için{' '}
                {results.length} sonuç bulundu
              </>
            ) : (
              <>
                <span className="font-semibold text-[#3d2c1e]">&quot;{query}&quot;</span> için
                sonuç bulunamadı
              </>
            )}
          </p>

          {results.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0ebe3]">
                <Search className="h-8 w-8 text-[#a67c52]/50" />
              </div>
              <p className="mb-2 font-medium text-[#8b7355]">Sonuç bulunamadı</p>
              <p className="text-sm text-[#c4b49a]">Farklı anahtar kelimeler deneyin</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/urunler/${product.category.slug}/${product.id}`)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-[#e8e0d4] bg-white transition-all hover:shadow-md"
                >
                  <div className="relative h-40 w-full bg-[#f0ebe3]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="h-10 w-10 text-[#a67c52]/30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="mb-1 truncate text-xs text-[#a67c52]">{product.category.name}</p>
                    <p className="line-clamp-2 text-sm font-medium text-[#3d2c1e] transition-colors group-hover:text-[#a67c52]">
                      {product.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !searched && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0ebe3]">
            <Search className="h-8 w-8 text-[#a67c52]/50" />
          </div>
          <p className="text-[#8b7355]">Aramak istediğiniz ürünü yazın</p>
          <p className="mt-1 text-sm text-[#c4b49a]">Nevresim, pike, saten, keten...</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPageClient() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6 h-8 w-32 animate-pulse rounded bg-[#f0ebe3]" />
          <div className="mb-6 h-10 w-48 animate-pulse rounded bg-[#f0ebe3]" />
          <div className="mb-8 flex gap-3">
            <div className="h-12 flex-1 animate-pulse rounded-xl bg-[#f0ebe3]" />
            <div className="h-12 w-20 animate-pulse rounded-xl bg-[#f0ebe3]" />
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
