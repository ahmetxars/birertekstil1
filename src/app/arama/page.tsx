import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import SearchPageClient from '@/components/sections/SearchPageClient'
import { getSiteSettings } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

export default async function AramaPage() {
  const settings = await getSiteSettings()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SearchPageClient />
      </main>
      <Footer settings={settings} />
      <WhatsAppFloat whatsappNumber={settings.whatsappNumber} />
    </div>
  )
}
