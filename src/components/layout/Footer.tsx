'use client'

import { useStore } from '@/store/useStore'
import { Phone, Mail, MapPin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  const { navigate } = useStore()

  return (
    <footer className="bg-[#3d2c1e] text-[#e8e0d4] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-[#a67c52] mb-2">Birer Tekstil</h3>
            <p className="text-xs tracking-widest text-[#8b7355] mb-4">İSTANBUL</p>
            <p className="text-sm leading-relaxed text-[#c4b49a]">
              20 yılı aşkın tecrübemizle İstanbul&apos;dan tüm Türkiye&apos;ye kaliteli ev tekstili
              ürünleri sunuyoruz. Üreticiden direkt fiyat avantajı ile hizmetinizdeyiz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#a67c52] mb-4">Hızlı Bağlantılar</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Ana Sayfa', action: () => navigate('home') },
                { label: 'Ürün Gruplarımız', action: () => { navigate('home'); setTimeout(() => { document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }) }, 100) } },
                { label: 'Öne Çıkan Ürünler', action: () => { navigate('home'); setTimeout(() => { document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }) }, 100) } },
                { label: 'İletişim', action: () => { navigate('home'); setTimeout(() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }, 100) } },
                { label: 'Yönetim Paneli', action: () => navigate('admin') },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-[#a67c52] mb-4">İletişim Bilgileri</h3>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+905332423665"
                className="flex items-center gap-2 text-sm text-[#c4b49a] hover:text-[#25D366] transition-colors"
              >
                <Phone className="h-4 w-4" />
                +90 533 242 36 65
              </a>
              <a
                href="https://wa.me/905332423665?text=Merhaba"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#c4b49a] hover:text-[#25D366] transition-colors"
              >
                <Mail className="h-4 w-4" />
                WhatsApp İletişim
              </a>
              <div className="flex items-start gap-2 text-sm text-[#c4b49a]">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-[#8b7355]/30" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8b7355]">
          <p>© {new Date().getFullYear()} Birer Tekstil. Tüm hakları saklıdır.</p>
          <p>İstanbul&apos;dan sevgiyle üretildi.</p>
        </div>
      </div>
    </footer>
  )
}
