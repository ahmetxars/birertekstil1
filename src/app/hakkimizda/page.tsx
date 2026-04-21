import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import StructuredData from '@/components/site/StructuredData'
import { getSiteSettings } from '@/lib/catalog'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'Birer Tekstil hakkında bilgi alın. İstanbul merkezli ev tekstili üretim ve tedarik tecrübemizi keşfedin.',
  alternates: {
    canonical: '/hakkimizda',
  },
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `${SITE_NAME} Hakkımızda`,
          url: `${SITE_URL}/hakkimizda`,
        }}
      />
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="bg-white border border-[#e8e0d4] rounded-3xl p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-[#a67c52] mb-3">Hakkımızda</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-5">
              İstanbul&apos;da üreticiden güven veren ev tekstili tedariki
            </h1>
            <div className="space-y-4 text-[#8b7355] leading-relaxed">
              <p>
                {settings.aboutText ||
                  'Birer Tekstil, İstanbul merkezli üretim ve tedarik deneyimiyle ev tekstili alanında düzenli, güvenilir ve hızlı iletişim odaklı bir hizmet sunar.'}
              </p>
              <p>
                Amacımız, ürünleri karmaşık bir katalog yerine kolay anlaşılır kategorilerle
                sunmak ve müşterinin hızlıca bilgi alabileceği sade bir iletişim akışı kurmaktır.
              </p>
              <p>
                Pike, nevresim, keten, saten ve özel dokuma ürünlerinde ürün gruplarını düzenli
                şekilde sergileyerek hem satış görüşmelerini hem de arama motoru görünürlüğünü
                destekleyen bir vitrin yapısı kuruyoruz.
              </p>
            </div>
          </section>

          <aside className="bg-[#3d2c1e] text-white rounded-3xl p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-[#c49a6c] mb-3">Güven Sinyalleri</p>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 p-4">
                <h2 className="font-semibold mb-1">20+ yıllık tecrübe</h2>
                <p className="text-sm text-white/70">Sektörü bilen, üretim ve tedarik dili güçlü bir yapı.</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <h2 className="font-semibold mb-1">WhatsApp odaklı hızlı dönüş</h2>
                <p className="text-sm text-white/70">Teklif ve ürün bilgisi için kısa ve pratik iletişim akışı.</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <h2 className="font-semibold mb-1">Kategori bazlı düzen</h2>
                <p className="text-sm text-white/70">Hem kullanıcı hem Google için daha anlaşılır ürün sunumu.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
