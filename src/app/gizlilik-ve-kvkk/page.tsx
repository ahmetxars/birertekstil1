import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Gizlilik ve KVKK',
  description: 'Birer Tekstil gizlilik ve KVKK aydınlatma metni.',
  alternates: {
    canonical: '/gizlilik-ve-kvkk',
  },
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-4xl mx-auto bg-white border border-[#e8e0d4] rounded-3xl p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[#a67c52] mb-3">Gizlilik / KVKK</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-6">
            Gizlilik ve kişisel verilerin korunması
          </h1>
          <div className="space-y-5 text-[#8b7355] leading-relaxed">
            <p>
              Birer Tekstil, iletişim sırasında paylaşılan isim, telefon ve e-posta gibi bilgileri
              yalnızca teklif hazırlama, iletişime geri dönüş ve müşteri sürecini yürütme amacıyla
              kullanır.
            </p>
            <p>
              Paylaşılan bilgiler üçüncü taraflarla ticari amaçla paylaşılmaz. Yasal zorunluluklar
              dışında veriler yalnızca hizmet ve iletişim amacıyla saklanır.
            </p>
            <p>
              WhatsApp, telefon veya e-posta üzerinden bizimle iletişime geçen kullanıcılar, bu
              verilerin iletişim amaçlı kullanılmasını kabul etmiş sayılır.
            </p>
            <p>
              Verilerinizle ilgili güncelleme, silme veya bilgi talepleriniz için {settings.email}{' '}
              adresi üzerinden bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
