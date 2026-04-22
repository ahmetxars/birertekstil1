import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TrackedExternalLink from '@/components/site/TrackedExternalLink'
import StructuredData from '@/components/site/StructuredData'
import { getSiteSettings } from '@/lib/catalog'
import {
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_URL,
  SITE_NAME,
  SITE_URL,
  buildPhoneHref,
} from '@/lib/site'

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Birer Tekstil ile WhatsApp, telefon veya konum üzerinden iletişime geçin.',
  alternates: {
    canonical: '/iletisim',
  },
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: `${SITE_NAME} İletişim`,
          url: `${SITE_URL}/iletisim`,
        }}
      />
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-[#a67c52] mb-3">İletişim</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-4">
              Fiyat ve ürün bilgisi için hızlıca ulaşın
            </h1>
            <p className="text-[#8b7355] max-w-2xl mx-auto">
              Sipariş öncesi ürün detayları, kategori bilgisi ve fiyat talepleri için WhatsApp
              veya telefon üzerinden hızlı destek alabilirsiniz.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <TrackedExternalLink
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Merhaba, ürünler hakkında bilgi almak istiyorum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              leadType="whatsapp"
              leadLabel="contact_page_whatsapp"
              className="rounded-3xl border border-[#e8e0d4] bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-[#25D366] mb-3">WhatsApp</p>
              <h2 className="text-2xl font-bold text-[#3d2c1e] mb-3">WhatsApp ile fiyat sor</h2>
              <p className="text-[#8b7355] mb-4">
                Ürün linkini ya da kategori adını göndererek hızlı teklif alın.
              </p>
              <span className="font-semibold text-[#25D366]">Mesaj gönder</span>
            </TrackedExternalLink>

            <TrackedExternalLink
              href={buildPhoneHref(settings.phone)}
              leadType="phone"
              leadLabel="contact_page_phone"
              className="rounded-3xl border border-[#e8e0d4] bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-[#a67c52] mb-3">Telefon</p>
              <h2 className="text-2xl font-bold text-[#3d2c1e] mb-3">{settings.phone}</h2>
              <p className="text-[#8b7355] mb-4">
                Doğrudan arayarak stok, ürün bilgisi ve yönlendirme alabilirsiniz.
              </p>
              <span className="font-semibold text-[#a67c52]">Hemen ara</span>
            </TrackedExternalLink>

            <div className="rounded-3xl border border-[#e8e0d4] bg-white p-4 shadow-sm">
              <p className="px-4 pt-4 text-sm uppercase tracking-[0.2em] text-[#a67c52] mb-3">
                Konum
              </p>
              <div className="overflow-hidden rounded-2xl border border-[#f3ece3]">
                <iframe
                  title="Birer Tekstil Konumu"
                  src={GOOGLE_MAPS_EMBED_URL}
                  className="h-[320px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <TrackedExternalLink
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                leadType="location"
                leadLabel="contact_page_location"
                className="block px-4 pb-4 pt-4 font-semibold text-[#a67c52] hover:text-[#8b5e34] transition-colors"
              >
                Google Maps'te ac
              </TrackedExternalLink>
            </div>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
