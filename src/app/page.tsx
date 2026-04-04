'use client'

import { useStore } from '@/store/useStore'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import ContactSection from '@/components/sections/ContactSection'
import CategoryProducts from '@/components/sections/CategoryProducts'
import ProductDetail from '@/components/sections/ProductDetail'
import AdminPanel from '@/components/admin/AdminPanel'

export default function Home() {
  const { page } = useStore()
  const isAdmin = page === 'admin'

  const renderContent = () => {
    switch (page) {
      case 'home':
        return (
          <>
            <HeroSection />
            <StatsSection />
            <CategoriesSection />
            <FeaturedProducts />
            <ContactSection />
          </>
        )
      case 'category':
        return <CategoryProducts />
      case 'product':
        return <ProductDetail />
      case 'admin':
        return <AdminPanel />
      default:
        return (
          <>
            <HeroSection />
            <StatsSection />
            <CategoriesSection />
            <FeaturedProducts />
            <ContactSection />
          </>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Header />}
      <main className="flex-1">{renderContent()}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}
    </div>
  )
}
