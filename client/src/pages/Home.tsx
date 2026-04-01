/*
 * DESIGN: Soft Luxury — Pastel Elegance
 * Full page composition: Navbar → Hero → Testimonials → Products → About → CTA → Location → Contact → Footer
 * WhatsApp floating button always visible
 */
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";
import CTABanner from "@/components/CTABanner";
import LocationSection from "@/components/LocationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      <Navbar />
      <main>
        <HeroSection />
        <TestimonialsSection />
        <ProductsSection />
        <AboutSection />
        <CTABanner />
        <LocationSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
