/*
 * DESIGN: Soft Luxury — lead capture form with warm beige background
 * Fields: Name, Phone/WhatsApp, Email, Message
 * WhatsApp quick contact button
 */
import { useState } from "react";
import { Send, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactSection() {
  const [form, setForm] = useState<FormData>({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission (static site — would connect to backend/email service)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F5EFE8]">
      <div className="container">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {/* Left: Info */}
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#B5541A] block mb-4">
              Teklif Alın
            </span>
            <h2 className="section-title mb-5">
              Hızlı Teklif
              <br />
              <span className="text-[#B5541A] italic">İsteyin</span>
            </h2>
            <p className="section-subtitle mb-8 max-w-md">
              İhtiyacınız olan ürünleri belirtin, size en kısa sürede geri dönelim. Toptan ve perakende talepler için 24 saat içinde yanıt garantisi.
            </p>

            {/* Quick contact options */}
            <div className="flex flex-col gap-4 mb-8">
              <a
                href="https://wa.me/902120000000?text=Merhaba%2C%20ev%20tekstili%20ürünleri%20hakkında%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl hover:bg-[#25D366]/20 transition-colors"
              >
                <div className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-[#2C1810] text-sm">WhatsApp ile Hızlı İletişim</div>
                  <div className="text-xs text-[#6B4F40]">Anında yanıt için WhatsApp'tan yazın</div>
                </div>
              </a>

              <a
                href="tel:+902120000000"
                className="flex items-center gap-4 p-4 bg-white border border-[#E8DDD0] rounded-xl hover:border-[#B5541A]/40 transition-colors"
              >
                <div className="w-11 h-11 bg-[#B5541A]/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-[#B5541A]" />
                </div>
                <div>
                  <div className="font-bold text-[#2C1810] text-sm">Telefon ile Arayın</div>
                  <div className="text-xs text-[#6B4F40]">+90 (212) 000 00 00</div>
                </div>
              </a>
            </div>

            {/* Urgency note */}
            <div className="flex items-center gap-2 text-sm text-[#6B4F40]">
              <div className="w-2 h-2 bg-[#B5541A] rounded-full animate-pulse" />
              <span>Ortalama yanıt süresi: <strong className="text-[#5C3D2E]">24 saat içinde</strong></span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8DDD0]">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                <div className="w-16 h-16 bg-[#B5541A]/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-[#B5541A]" />
                </div>
                <h3
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-2xl font-bold text-[#2C1810]"
                >
                  Talebiniz Alındı!
                </h3>
                <p className="text-[#6B4F40] max-w-xs">
                  En kısa sürede, 24 saat içinde sizinle iletişime geçeceğiz. Teşekkürler!
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", message: "" }); }}
                  className="text-sm text-[#B5541A] font-semibold hover:underline mt-2"
                >
                  Yeni Talep Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-xl font-bold text-[#2C1810] mb-1"
                >
                  Teklif Formu
                </h3>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#5C3D2E]">
                    Ad Soyad <span className="text-[#B5541A]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Adınız Soyadınız"
                    className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] bg-[#FDFAF6] text-[#2C1810] placeholder-[#B8A898] focus:outline-none focus:border-[#B5541A] focus:ring-2 focus:ring-[#B5541A]/20 transition-all text-sm"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#5C3D2E]">
                    Telefon / WhatsApp <span className="text-[#B5541A]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+90 (___) ___ __ __"
                    className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] bg-[#FDFAF6] text-[#2C1810] placeholder-[#B8A898] focus:outline-none focus:border-[#B5541A] focus:ring-2 focus:ring-[#B5541A]/20 transition-all text-sm"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#5C3D2E]">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] bg-[#FDFAF6] text-[#2C1810] placeholder-[#B8A898] focus:outline-none focus:border-[#B5541A] focus:ring-2 focus:ring-[#B5541A]/20 transition-all text-sm"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#5C3D2E]">
                    Mesajınız <span className="text-[#B5541A]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="İhtiyacınız olan ürünleri ve miktarı belirtin..."
                    className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] bg-[#FDFAF6] text-[#2C1810] placeholder-[#B8A898] focus:outline-none focus:border-[#B5541A] focus:ring-2 focus:ring-[#B5541A]/20 transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cta w-full justify-center text-base mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Hemen Teklif Al
                    </>
                  )}
                </button>

                <p className="text-xs text-[#8B6B5A] text-center">
                  Bilgileriniz gizli tutulur. 24 saat içinde yanıt verilir.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
