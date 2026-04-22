'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'bt-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(new Set(JSON.parse(stored) as string[]))
      }
    } catch {
      // ignore
    }
  }, [])

  const toggle = useCallback((productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (productId: string) => mounted && favorites.has(productId),
    [favorites, mounted]
  )

  return { favorites, toggle, isFavorite, count: favorites.size }
}
