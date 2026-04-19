'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/hooks/useSettings'

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
}

export default function Footer() {
  const settings = useSettings()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/categories?parentOnly=true')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data.slice(0, 6))
      })
      .catch(() => {})
  }, [])

  const waNumber = settings.whatsappNumber.replace(/[^0-9]/g, '')

  return (
    <footer className="bg-[#3d2c1e] text-[#e8e0d4] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Marka */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/birerteks-logo.png" alt="Birer Tekstil" className="h-8 w-8 object-contain"  />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">Birer Tekstil</h3>
                <p className="text-[10px] tracking-widest text-[#8b7355]">İSTANBUL</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#c4b49a]">
              20 yılı aşkın tecrübemizle İstanbul&apos;dan tüm Türkiye&apos;ye kaliteli ev tekstili sunuyoruz.
            </p>

            {/* Sosyal */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Merhaba, bilgi almak istiyorum.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                style={{ backgroundColor: '#25D366' }}
                aria-label="WhatsApp"
              >
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-80 transition-opacity"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Ürün Kategorileri */}
          <div>
            <h3 className="text-sm font-semibold text-[#a67c52] mb-4 uppercase tracking-wider">Ürün Kategorileri</h3>
            <nav className="flex flex-col gap-2">
              {categories.length > 0 ? categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/urunler/${cat.slug}`}
                  className="text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors"
                >
                  {cat.name}
                </Link>
              )) : (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-28 bg-white/5 rounded animate-pulse" />
                ))
              )}
            </nav>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-sm font-semibold text-[#a67c52] mb-4 uppercase tracking-wider">Hızlı Bağlantılar</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Hakkımızda', href: '/hakkimizda' },
                { label: 'Ürün Ara', href: '/arama' },
                { label: 'İletişim', href: '/#contact' },
                { label: 'Yönetim Paneli', href: '/admin' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-sm font-semibold text-[#a67c52] mb-4 uppercase tracking-wider">İletişim</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                className="flex items-start gap-2.5 text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors group"
              >
                <Phone className="h-4 w-4 mt-0.5 shrink-0 group-hover:text-[#a67c52]" />
                <span>{settings.phone}</span>
              </a>

              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Merhaba, bilgi almak istiyorum.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm text-[#c4b49a] hover:text-[#25D366] transition-colors group"
              >
                <svg className="h-4 w-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp İletişim</span>
              </a>

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-2.5 text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="break-all">{settings.email}</span>
                </a>
              )}

              <div className="flex items-start gap-2.5 text-sm text-[#c4b49a]">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-[#8b7355]/30" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8b7355]">
          <p>© {new Date().getFullYear()} Birer Tekstil. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <Link href="/arama" className="hover:text-[#a67c52] transition-colors">Ürün Ara</Link>
            <Link href="/hakkimizda" className="hover:text-[#a67c52] transition-colors">Hakkımızda</Link>
            <Link href="/admin" className="hover:text-[#a67c52] transition-colors">Yönetim</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
