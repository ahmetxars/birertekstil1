'use client'

import { useState, useEffect } from 'react'

export interface SiteSettings {
  whatsappNumber: string
  phone: string
  address: string
  email: string
  heroTitle: string
  heroSubtitle: string
  aboutText: string
  instagramUrl: string
}

export const defaultSettings: SiteSettings = {
  whatsappNumber: '+905332423665',
  phone: '+90 533 242 36 65',
  address: 'İstanbul, Türkiye',
  email: '',
  heroTitle: "İstanbul'da Üreticiden Kaliteli Ev Tekstili Ürünleri",
  heroSubtitle: 'Birer Tekstil İstanbul',
  aboutText: '',
  instagramUrl: '',
}

export function useSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setSettings({ ...defaultSettings, ...data })
      })
      .catch(() => {})
  }, [])

  return settings
}
