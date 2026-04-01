/*
 * DESIGN: Soft Luxury — asymmetric split hero
 * Left: headline + subheadline + CTA + trust badges
 * Right: large generated textile image
 * Background: warm off-white #FDFAF6
 */
import { ArrowRight, CheckCircle2, Factory, ShoppingBag, Truck } from "lucide-react";

const trustBadges = [
  { icon: Factory, label: "Yerel Üretici" },
  { icon: ShoppingBag, label: "Toptan & Perakende" },
  { icon: Truck, label: "Hızlı Teslimat" },
];

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663504475842/V35mdTAbcAaYYYAzaZoLnS/hero-textiles-XcbBNQHqMeBMy4bP4PzZKA.webp";

export default function HeroSection() {
  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16 md:pt-20 overflow-hidden bg-[#FDFAF6]"
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, oklch(0.90 0.018 70 / 0.6) 0%, transparent 60%), radial-gradient(circle at 10% 80%, oklch(0.90 0.018 70 / 0.4) 0%, transparent 50%)",
        }}
      />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)] py-12 lg:py-0">
          {/* Left: Content */}
          <div className="flex flex-col justify-center">
            {/* Pre-headline tag */}
            <div className="inline-flex items-center gap-2 mb-6 self-start">
              <span className="w-8 h-px bg-[#B5541A]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#B5541A]">
                İstanbul'dan Direkt
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C1810] leading-[1.1] mb-6"
            >
              İstanbul'dan
              <br />
              <span className="text-[#5C3D2E] italic">Premium</span>
              <br />
              Ev Tekstili
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[#6B4F40] leading-relaxed mb-8 max-w-lg font-light">
              Fabrikadan direkt fiyatlarla yüksek kaliteli yatak takımları, havlular ve ev tekstili ürünleri — işletmeler ve bireyler tarafından güvenle tercih ediliyor.
            </p>

            {/* Key Benefits */}
            <ul className="flex flex-col gap-3 mb-10">
              {[
                "Fabrikadan direkt fiyat (aracısız)",
                "Geniş ev tekstili ürün yelpazesi",
                "İstanbul'un güvenilir yerel tedarikçisi",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#B5541A] shrink-0" />
                  <span className="text-[#5C3D2E] font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="#contact" onClick={handleCTAClick} className="btn-cta text-base">
                Hemen Teklif Al
                <ArrowRight size={18} />
              </a>
              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#5C3D2E] text-[#5C3D2E] rounded font-bold text-base hover:bg-[#5C3D2E] hover:text-white transition-all duration-250"
              >
                Ürünleri Gör
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white/70 border border-[#E8DDD0] rounded-full px-4 py-2 shadow-sm"
                >
                  <Icon size={15} className="text-[#B5541A]" />
                  <span className="text-xs font-semibold text-[#5C3D2E] tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Decorative frame */}
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[#E8DDD0] rounded-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#E8DDD0]/50 rounded-2xl" />

              <img
                src={HERO_IMAGE}
                alt="Birer Tekstil premium ev tekstili ürünleri"
                className="relative z-10 w-full rounded-2xl shadow-2xl object-cover"
                style={{ aspectRatio: "4/3", maxHeight: "520px" }}
                loading="eager"
              />

              {/* Floating stat card */}
              <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-5 py-4 border border-[#E8DDD0]">
                <div
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-3xl font-bold text-[#B5541A]"
                >
                  100+
                </div>
                <div className="text-xs text-[#6B4F40] font-medium mt-0.5">
                  Memnun Müşteri
                </div>
              </div>

              {/* Floating urgency card */}
              <div className="absolute top-6 right-6 z-20 bg-[#B5541A] rounded-xl shadow-lg px-4 py-3">
                <div className="text-xs text-white/90 font-medium">
                  ⚡ 24 saat içinde yanıt
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#F5EFE8" />
        </svg>
      </div>
    </section>
  );
}
