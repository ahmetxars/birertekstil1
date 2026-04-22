import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import StructuredData from '@/components/site/StructuredData'
import { getFeaturedProducts, getHomepageCategories, getSiteSettings } from '@/lib/catalog'
import { SITE_NAME, SITE_URL, buildPhoneHref } from '@/lib/site'
import TrackedExternalLink from '@/components/site/TrackedExternalLink'

export const metadata: Metadata = {
  title: `${SITE_NAME} | İstanbul'da Üreticiden Ev Tekstili`,
  description:
    "İstanbul'da üreticiden kaliteli ev tekstili ürünleri. Pike, nevresim, keten, saten ve daha fazlası için koleksiyonumuzu keşfedin.",
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {
  const [settings, categories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getHomepageCategories(),
    getFeaturedProducts(),
  ])

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: settings.email,
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Istanbul',
      addressCountry: 'TR',
      streetAddress: settings.address,
    },
    sameAs: [settings.instagramUrl].filter(Boolean),
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }

  return (
    <>
      <StructuredData data={[organizationJsonLd, websiteJsonLd]} />
      <Header />
      <main>
        <HeroSection
          heroTitle={settings.heroTitle}
          heroSubtitle={settings.heroSubtitle}
          whatsappNumber={settings.whatsappNumber}
          phone={settings.phone}
        />
        <StatsSection />
        <CategoriesSection categories={categories} />
        <FeaturedProducts
          products={featuredProducts}
          whatsappNumber={settings.whatsappNumber}
        />

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <div className="bg-white border border-[#e8e0d4] rounded-3xl p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-[#a67c52] mb-3">
                Neden Birer Tekstil?
              </p>
              <h2 className="text-3xl font-bold text-[#3d2c1e] mb-4">
                Hazır çalışan, güven veren ve müşteri toplamaya uygun bir vitrin
              </h2>
              <p className="text-[#8b7355] leading-relaxed mb-6">
                {settings.aboutText ||
                  'Birer Tekstil olarak İstanbul merkezli üretim ve tedarik tecrübemizle ev tekstili ürünlerini sade, hızlı ve güven veren bir yapıyla sunuyoruz.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-[#f8f5f0] border border-[#e8e0d4] p-4">
                  <p className="font-semibold text-[#3d2c1e] mb-1">Üretici avantajı</p>
                  <p className="text-[#8b7355]">Doğrudan fiyat ve hızlı iletişim</p>
                </div>
                <div className="rounded-2xl bg-[#f8f5f0] border border-[#e8e0d4] p-4">
                  <p className="font-semibold text-[#3d2c1e] mb-1">Hızlı teklif</p>
                  <p className="text-[#8b7355]">WhatsApp ve telefon üzerinden kolay lead akışı</p>
                </div>
              </div>
            </div>

            <div className="bg-[#3d2c1e] text-white rounded-3xl p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-[#c49a6c] mb-3">
                Hızlı İletişim
              </p>
              <h2 className="text-2xl font-bold mb-4">Fiyat ve ürün bilgisi için hemen ulaşın</h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Kategori veya ürün seçerek WhatsApp üzerinden yazabilir, dilerseniz doğrudan
                telefonla da bize ulaşabilirsiniz.
              </p>
              <div className="flex flex-col gap-3">
                <TrackedExternalLink
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Merhaba, ürünler hakkında bilgi almak istiyorum.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  leadType="whatsapp"
                  leadLabel="home_contact_card"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#25D366] px-5 py-4 text-white font-semibold transition-transform hover:scale-[1.01]"
                >
                  WhatsApp ile fiyat sor
                </TrackedExternalLink>
                <TrackedExternalLink
                  href={buildPhoneHref(settings.phone)}
                  leadType="phone"
                  leadLabel="home_contact_card"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-5 py-4 font-semibold text-white hover:bg-white/5"
                >
                  Telefonla ara
                </TrackedExternalLink>
              </div>
              <div className="mt-6 space-y-2 text-sm text-white/70">
                <p>{settings.phone}</p>
                <p>{settings.address}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
      <WhatsAppFloat whatsappNumber={settings.whatsappNumber} />
    </>
  )
}
