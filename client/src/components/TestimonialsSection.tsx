/*
 * DESIGN: Soft Luxury — testimonials with large quote marks, warm beige bg
 * 3 testimonial cards + stats row
 */
import { Star, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Mehmet Yılmaz",
    role: "Otel İşletmecisi, İstanbul",
    text: "Otelimiz için düzenli sipariş veriyoruz — harika kalite ve hızlı servis. Birer Tekstil ile çalışmak gerçekten çok kolay ve güvenilir.",
    rating: 5,
  },
  {
    name: "Ayşe Kaya",
    role: "İç Mimar",
    text: "Müşterilerim için en iyi ev tekstili tedarikçisini arıyordum. Birer Tekstil'in ürün kalitesi ve fiyat dengesi mükemmel. Kesinlikle tavsiye ederim.",
    rating: 5,
  },
  {
    name: "Hasan Demir",
    role: "Airbnb Ev Sahibi",
    text: "İstanbul'da güvenilir bir tekstil tedarikçisi bulmak zordu. Birer Tekstil hem kaliteli hem de uygun fiyatlı. Misafirlerim çok memnun.",
    rating: 5,
  },
  {
    name: "Fatma Şahin",
    role: "Toptan Alıcı",
    text: "Yıllardır çalıştığım en dürüst ve kaliteli tedarikçi. Toptan siparişlerde de bireysel ilgi gösteriyorlar. Çok teşekkürler.",
    rating: 5,
  },
];

const stats = [
  { value: "100+", label: "Memnun Müşteri" },
  { value: "15+", label: "Yıllık Deneyim" },
  { value: "500+", label: "Ürün Çeşidi" },
  { value: "24s", label: "Yanıt Süresi" },
];

function TestimonialCard({ testimonial, delay }: { testimonial: typeof testimonials[0]; delay: number }) {
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
    <div
      ref={ref}
      className="card-hover bg-white rounded-2xl p-7 shadow-sm border border-[#E8DDD0] flex flex-col gap-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {/* Quote icon */}
      <Quote size={28} className="text-[#E8DDD0]" />

      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={14} className="fill-[#B5541A] text-[#B5541A]" />
        ))}
      </div>

      {/* Text */}
      <p className="text-[#5C3D2E]/80 leading-relaxed text-[0.95rem] italic flex-1">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#E8DDD0]">
        <div className="w-10 h-10 rounded-full bg-[#E8DDD0] flex items-center justify-center shrink-0">
          <span
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-[#5C3D2E] font-bold text-sm"
          >
            {testimonial.name[0]}
          </span>
        </div>
        <div>
          <div className="font-bold text-[#2C1810] text-sm">{testimonial.name}</div>
          <div className="text-xs text-[#8B6B5A]">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
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

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#F5EFE8]">
      <div className="container">
        {/* Header */}
        <div
          ref={titleRef}
          className="text-center mb-14"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#B5541A] block mb-3">
            Müşteri Yorumları
          </span>
          <h2 className="section-title mb-4">
            Yerel İşletmeler & Müşteriler
            <br />
            <span className="text-[#B5541A]">Bize Güveniyor</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Yıllarca süren iş birliği ve memnun müşteriler, kalitemizin en iyi kanıtıdır.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center bg-white rounded-xl py-6 px-4 shadow-sm border border-[#E8DDD0]"
              style={{
                opacity: titleVisible ? 1 : 0,
                transform: titleVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
              }}
            >
              <div
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-3xl md:text-4xl font-bold text-[#B5541A] mb-1"
              >
                {stat.value}
              </div>
              <div className="text-xs text-[#6B4F40] font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
