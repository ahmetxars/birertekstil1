import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import { db } from '@/lib/db'

const BASE_URL = 'https://www.birertekstil.com'

export const metadata: Metadata = {
  title: 'Hakkımızda | Birer Tekstil İstanbul',
  description:
    "Birer Tekstil olarak İstanbul'da 20 yılı aşkın süredir ev tekstili sektöründe faaliyet gösteriyoruz. Üreticiden kaliteli ürün, güvenilir hizmet.",
  alternates: { canonical: `${BASE_URL}/hakkimizda` },
  openGraph: {
    title: 'Hakkımızda | Birer Tekstil İstanbul',
    description: "İstanbul'da 20+ yıllık ev tekstili deneyimi.",
    url: `${BASE_URL}/hakkimizda`,
    siteName: 'Birer Tekstil',
    type: 'website',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Hakkımızda', item: `${BASE_URL}/hakkimizda` },
  ],
}

const stats = [
  { value: '20+', label: 'Yıllık Deneyim' },
  { value: '500+', label: 'Ürün Çeşidi' },
  { value: '5', label: 'Marka' },
  { value: '1000+', label: 'Mutlu Müşteri' },
]

const values = [
  {
    icon: '🏭',
    title: 'Üreticiden Doğrudan',
    description: 'Aracısız üretici ilişkilerimiz sayesinde en uygun fiyatları sunuyoruz.',
  },
  {
    icon: '✅',
    title: 'Kalite Garantisi',
    description: 'Her ürün kalite kontrolünden geçerek müşterilerimize ulaşır.',
  },
  {
    icon: '🚀',
    title: 'Hızlı Teslimat',
    description: 'Aynı gün kargo imkânıyla siparişlerinizi en kısa sürede teslim ediyoruz.',
  },
  {
    icon: '💬',
    title: 'Güvenilir Hizmet',
    description: '20 yılı aşkın sektör tecrübemizle yanınızdayız.',
  },
]

export default async function HakkimizdaPage() {
  const settings = await db.siteSettings.findFirst()
  const aboutText = settings?.aboutText ||
    "Birer Tekstil olarak İstanbul'da 20 yılı aşkın süredir ev tekstili sektöründe faaliyet göstermekteyiz. Nevresim, pike, saten, keten ve kapitone ürünlerimizle müşterilerimize en kaliteli ev tekstilini üreticiden doğrudan sunuyoruz."

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#3d2c1e] text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#d4a96a] text-sm font-medium tracking-widest uppercase mb-4">
              Birer Tekstil
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Hakkımızda
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              İstanbul&apos;dan dünyaya kaliteli ev tekstili
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 bg-[#f8f5f0] border-b border-[#e8e0d4]">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold text-[#a67c52] mb-1">{s.value}</div>
                <div className="text-sm text-[#8b7355]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Hikaye */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#3d2c1e] mb-6">Hikayemiz</h2>
                <div className="space-y-4 text-[#8b7355] leading-relaxed">
                  {aboutText.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <a
                  href={`https://wa.me/${(settings?.whatsappNumber ?? '+905332423665').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Merhaba, bilgi almak istiyorum.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full text-white font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Bizimle İletişime Geçin
                </a>
              </div>

              {/* Logo dekoratif */}
              <div className="flex items-center justify-center">
                <div className="w-64 h-64 rounded-3xl bg-white border-2 border-[#e8e0d4] flex items-center justify-center shadow-2xl">
                  <img
                    src="/birerteks-logo.png"
                    alt="Birer Tekstil"
                    className="h-48 w-48 object-contain"
                    
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Değerlerimiz */}
        <section className="py-16 px-4 bg-[#f8f5f0]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#3d2c1e] text-center mb-10">Neden Birer Tekstil?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-6 border border-[#e8e0d4] shadow-sm">
                  <div className="text-3xl mb-4">{v.icon}</div>
                  <h3 className="text-lg font-bold text-[#3d2c1e] mb-2">{v.title}</h3>
                  <p className="text-[#8b7355] leading-relaxed text-sm">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
