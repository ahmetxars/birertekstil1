/*
 * DESIGN: Soft Luxury — product category cards with hover lift effect
 * 5 categories: Bedding, Towels, Curtains, Blankets, Custom Orders
 * Generated images for first 4, icon for Custom Orders
 */
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const products = [
  {
    id: "bedding",
    title: "Yatak Takımları",
    description: "Otel kalitesinde pamuklu nevresim takımları, çarşaflar ve yastık kılıfları. Tek ve çift kişilik seçenekler.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663504475842/V35mdTAbcAaYYYAzaZoLnS/product-bedding-aeZ3U65CojnQPbBJno7Hp3.webp",
    tag: "En Çok Satan",
  },
  {
    id: "towels",
    title: "Havlu & Banyo Tekstili",
    description: "Yumuşak ve emici pamuklu banyolu havlular, el havluları ve bornozlar. Toptan ve perakende.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663504475842/V35mdTAbcAaYYYAzaZoLnS/product-towels-LvEb3a3E2yEE7qYeuEktBf.webp",
    tag: "Otel Tercihi",
  },
  {
    id: "curtains",
    title: "Perdeler",
    description: "Keten, tül ve blackout perde seçenekleri. Evinize özel ölçü ve renk alternatifleri.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663504475842/V35mdTAbcAaYYYAzaZoLnS/product-curtains-ganMbxKmv9PC3W5NySuraP.webp",
    tag: null,
  },
  {
    id: "blankets",
    title: "Battaniyeler",
    description: "Dört mevsim battaniyeler, pike ve yorgan takımları. Sıcak tutan ve nefes alan kumaşlar.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663504475842/V35mdTAbcAaYYYAzaZoLnS/product-blankets-KkgMYakq5Tz7cwLgkubCa8.webp",
    tag: null,
  },
  {
    id: "custom",
    title: "Özel Siparişler",
    description: "Logo baskılı havlular, özel ölçü yatak takımları ve kurumsal tekstil çözümleri. Otel, Airbnb ve işletmelere özel.",
    image: null,
    tag: "B2B",
  },
];

function ProductCard({ product, delay }: { product: typeof products[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleCTA = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={ref}
      className="card-hover bg-white rounded-2xl overflow-hidden border border-[#E8DDD0] shadow-sm flex flex-col"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F5EFE8]" style={{ aspectRatio: "4/3" }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <Sparkles size={40} className="text-[#B5541A]/40" />
            <span className="text-sm text-[#8B6B5A] font-medium">Özel Tasarım</span>
          </div>
        )}

        {/* Tag badge */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-[#B5541A] text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.tag}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-lg font-bold text-[#2C1810] mb-2"
        >
          {product.title}
        </h3>
        <p className="text-sm text-[#6B4F40] leading-relaxed flex-1 mb-5">
          {product.description}
        </p>
        <a
          href="#contact"
          onClick={handleCTA}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#B5541A] hover:text-[#8B3A10] transition-colors group"
        >
          Teklif Al
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCTA = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="products" className="py-20 md:py-28 bg-[#FDFAF6]">
      <div className="container">
        {/* Header */}
        <div
          ref={titleRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#B5541A] block mb-3">
              Ürün Kategorileri
            </span>
            <h2 className="section-title">
              Ürünlerimiz
            </h2>
            <p className="section-subtitle mt-3 max-w-lg">
              Fabrikadan direkt, geniş ürün yelpazesiyle ev ve işletmeniz için en kaliteli tekstil çözümleri.
            </p>
          </div>
          <a href="#contact" onClick={handleCTA} className="btn-cta shrink-0">
            Tüm Ürünler İçin Teklif Al
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
