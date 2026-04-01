/*
 * DESIGN: Soft Luxury — about section with asymmetric layout
 * Left: image with decorative elements, Right: content
 */
import { Award, MapPin, Users, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const highlights = [
  {
    icon: Award,
    title: "Kalite Odaklı",
    desc: "Her üründe en yüksek kalite standartlarını uyguluyoruz.",
  },
  {
    icon: Users,
    title: "Bireysel & Kurumsal",
    desc: "Hem bireysel müşterilere hem de işletmelere hizmet veriyoruz.",
  },
  {
    icon: MapPin,
    title: "İstanbul Merkezli",
    desc: "İstanbul'un tekstil merkezinde konumlanan güvenilir yerel işletme.",
  },
  {
    icon: Layers,
    title: "Geniş Ürün Yelpazesi",
    desc: "Yatak takımından havluya, perdeden battaniyeye geniş koleksiyon.",
  },
];

const ABOUT_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663504475842/V35mdTAbcAaYYYAzaZoLnS/hero-textiles-XcbBNQHqMeBMy4bP4PzZKA.webp";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 bg-[#F5EFE8]">
      <div className="container">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center"
        >
          {/* Left: Image */}
          <div
            className="relative"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-28px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {/* Decorative background shape */}
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#E8DDD0] rounded-3xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#B5541A]/10 rounded-2xl -z-10" />

            <img
              src={ABOUT_IMAGE}
              alt="Birer Tekstil atölyesi ve ürünleri"
              className="w-full rounded-2xl shadow-xl object-cover"
              style={{ aspectRatio: "4/3" }}
              loading="lazy"
            />

            {/* Floating badge */}
            <div className="absolute -bottom-5 left-8 bg-white rounded-xl shadow-lg px-6 py-4 border border-[#E8DDD0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#B5541A]/10 rounded-full flex items-center justify-center">
                  <MapPin size={18} className="text-[#B5541A]" />
                </div>
                <div>
                  <div className="text-xs text-[#8B6B5A] font-medium">Konum</div>
                  <div className="text-sm font-bold text-[#2C1810]">İstanbul, Türkiye</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(28px)",
              transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
            }}
          >
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#B5541A] block mb-4">
              Hakkımızda
            </span>
            <h2 className="section-title mb-6">
              Birer Tekstil
              <br />
              <span className="text-[#B5541A] italic">Ev Tekstil Ürünleri</span>
            </h2>

            <div className="space-y-4 mb-8">
              <p className="text-[#5C3D2E] leading-relaxed">
                <strong>Birer Tekstil</strong>, İstanbul'un köklü tekstil merkezinde faaliyet gösteren, ev tekstili alanında uzmanlaşmış güvenilir bir yerel işletmedir. Yılların deneyimiyle, kalite ve güvenilirliği her zaman ön planda tutarak hizmet vermekteyiz.
              </p>
              <p className="text-[#5C3D2E]/80 leading-relaxed">
                Yatak takımlarından havlulara, perdelerden battaniyelere kadar geniş ürün yelpazemizle hem bireysel müşterilere hem de oteller, Airbnb işletmecileri ve toptan alıcılara fabrikadan direkt fiyatlarla hizmet sunuyoruz.
              </p>
              <p className="text-[#5C3D2E]/80 leading-relaxed">
                İstanbul'un tekstil merkezinde konumlanan işletmemiz, aracısız tedarik zinciriyle müşterilerimize en rekabetçi fiyatları sunmaktadır.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className="flex gap-3 p-4 bg-white/70 rounded-xl border border-[#E8DDD0]"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.5s ease ${0.3 + i * 0.1}s, transform 0.5s ease ${0.3 + i * 0.1}s`,
                  }}
                >
                  <div className="w-9 h-9 bg-[#B5541A]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#B5541A]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#2C1810] mb-0.5">{title}</div>
                    <div className="text-xs text-[#6B4F40] leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
