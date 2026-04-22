import Link from 'next/link'
import { Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import TrackedExternalLink from '@/components/site/TrackedExternalLink'
import { buildPhoneHref } from '@/lib/site'

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/B%C4%B0RER+TEKST%C4%B0L+Ev+Tekstil+%C3%9Cr%C3%BCnleri/@41.0149831,28.9668684,16.84z/data=!4m10!1m2!2m1!1sbirer+tekstil!3m6!1s0x14cab908453b746d:0xdbd49a0cfa41b5df!8m2!3d41.0153495!4d28.9704608!15sCg1iaXJlciB0ZWtzdGlsWg8iDWJpcmVyIHRla3N0aWySARFmYWJyaWNfd2hvbGVzYWxlcpoBRENpOURRVWxSUVVOdlpFTm9kSGxqUmpsdlQydGFhbHBYZUZaalJXeExURmh3VjFWc1pFNU5iR2hHWWtoV1JsVXhSUkFC4AEA-gEECAAQMw!16s%2Fg%2F11myhn3q33?entry=ttu&g_ep=EgoyMDI2MDQxOS4wIKXMDSoASAFQAw%3D%3D'

interface FooterProps {
  settings?: {
    whatsappNumber: string
    phone: string
    address: string
    email: string
    instagramUrl: string
  }
}

export default function Footer({ settings }: FooterProps) {
  const safeSettings = settings ?? {
    whatsappNumber: '+905332423665',
    phone: '+90 533 242 36 65',
    address: 'Istanbul, Türkiye',
    email: 'info@birertekstil.com',
    instagramUrl: '',
  }

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
                href={buildPhoneHref(safeSettings.phone)}
                leadType="phone"
                leadLabel="footer_phone"
                className="flex items-center gap-2 text-sm text-[#c4b49a] hover:text-[#25D366] transition-colors"
              >
                <Phone className="h-4 w-4" />
                {safeSettings.phone}
              </TrackedExternalLink>
              <TrackedExternalLink
                href={`https://wa.me/${safeSettings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Merhaba, ürünler hakkında bilgi almak istiyorum.')}`}
                target="_blank"
                rel="noopener noreferrer"
                leadType="whatsapp"
                leadLabel="footer_whatsapp"
                className="flex items-center gap-2 text-sm text-[#c4b49a] hover:text-[#25D366] transition-colors"
              >
                <Mail className="h-4 w-4" />
                WhatsApp ile fiyat sor
              </TrackedExternalLink>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-[#c4b49a] hover:text-[#a67c52] transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{safeSettings.address}</span>
              </a>
              {safeSettings.instagramUrl && (
                <a
                  href={safeSettings.instagramUrl}
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
