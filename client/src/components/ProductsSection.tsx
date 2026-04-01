/*
 * DESIGN: Soft Luxury — product grid with featured badge, hover effects
 * Fetches products from tRPC API
 */
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";

function ProductCard({ product, delay }: { product: any; delay: number }) {
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
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <Sparkles size={40} className="text-[#B5541A]/40" />
            <span className="text-sm text-[#8B6B5A] font-medium">Resim Yok</span>
          </div>
        )}

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 bg-[#B5541A] text-white text-xs font-bold px-3 py-1 rounded-full">
            Öne Çıkartılmış
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
        {product.description && (
          <p className="text-sm text-[#6B4F40] leading-relaxed flex-1 mb-5">
            {product.description}
          </p>
        )}
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
  const { data: products, isLoading } = trpc.products.list.useQuery();

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#B5541A]" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} delay={i * 80} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#8B6B5A]">Henüz ürün eklenmemiş</p>
          </div>
        )}
      </div>
    </section>
  );
}
