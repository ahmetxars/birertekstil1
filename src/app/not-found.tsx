import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/catalog'

export default async function NotFound() {
  const settings = await getSiteSettings()

  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-xl text-center bg-white border border-[#e8e0d4] rounded-3xl p-10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[#a67c52] mb-3">404</p>
          <h1 className="text-3xl font-bold text-[#3d2c1e] mb-4">Aradığınız sayfa bulunamadı</h1>
          <p className="text-[#8b7355] mb-6">
            Ürün, kategori veya sayfa kaldırılmış olabilir. Ana sayfaya dönerek devam
            edebilirsiniz.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-[#a67c52] px-6 py-3 text-white font-semibold hover:bg-[#a67c52]/90"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
