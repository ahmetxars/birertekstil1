import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import CategoriesSection from '@/components/sections/CategoriesSection'
import HakkimizdaSection from '@/components/sections/HakkimizdaSection'
import ContactSection from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturedProducts />
        <CategoriesSection />
        <HakkimizdaSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
