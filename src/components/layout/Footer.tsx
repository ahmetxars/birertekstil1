import Link from 'next/link'
import { Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import TrackedExternalLink from '@/components/site/TrackedExternalLink'
import { GOOGLE_MAPS_URL, buildPhoneHref } from '@/lib/site'

interface FooterProps {
  settings: {
    whatsappNumber: string
    phone: string
    address: string
    email: string
    instagramUrl: string
  }
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#3d2c1e] text-[#e8e0d4] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#a67c52] mb-2">Birer Tekstil</h3>
            <p className="text-xs tracking-widest text-[#8b7355] mb-4">İSTANBUL</p>
            <p className="text-sm leading-relaxed text-[#c4b49a]">
              İstanbul merkezli üretici gücüyle ev tekstili ürünlerini sade, güvenilir ve hızlı
              teklif akışıyla sunuyoruz.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#a67c52] mb-4">Sayfalar</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors">
                Ana Sayfa
              </Link>
              <Link href="/#categories" className="text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors">
                Ürün Grupları
              </Link>
              <Link href="/hakkimizda" className="text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors">
                Hakkımızda
              </Link>
              <Link href="/iletisim" className="text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors">
                İletişim
              </Link>
              <Link href="/gizlilik-ve-kvkk" className="text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors">
                Gizlilik ve KVKK
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#a67c52] mb-4">İletişim Bilgileri</h3>
            <div className="flex flex-col gap-3">
              <TrackedExternalLink
                href={buildPhoneHref(settings.phone)}
                leadType="phone"
                leadLabel="footer_phone"
                className="flex items-center gap-2 text-sm text-[#c4b49a] hover:text-[#25D366] transition-colors"
              >
                <Phone className="h-4 w-4" />
                {settings.phone}
              </TrackedExternalLink>
              <TrackedExternalLink
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Merhaba, ürünler hakkında bilgi almak istiyorum.')}`}
                target="_blank"
                rel="noopener noreferrer"
                leadType="whatsapp"
                leadLabel="footer_whatsapp"
                className="flex items-center gap-2 text-sm text-[#c4b49a] hover:text-[#25D366] transition-colors"
              >
                <Mail className="h-4 w-4" />
                WhatsApp ile fiyat sor
              </TrackedExternalLink>
              <TrackedExternalLink
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                leadType="location"
                leadLabel="footer_location"
                className="flex items-start gap-2 text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </TrackedExternalLink>
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-[#8b7355]/30" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8b7355]">
          <p>© {new Date().getFullYear()} Birer Tekstil. Tüm hakları saklıdır.</p>
          <p>Google görünürlüğüne uygun, hızlı teklif akışlı vitrin sitesi.</p>
        </div>
      </div>
    </footer>
  )
}
