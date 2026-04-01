/*
 * DESIGN: Soft Luxury — location section with embedded Google Maps
 * Builds trust by showing real business presence
 */
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function LocationSection() {
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

  return (
    <section id="location" className="py-20 md:py-28 bg-[#FDFAF6]">
      <div className="container">
        {/* Header */}
        <div
          ref={ref}
          className="text-center mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#B5541A] block mb-3">
            Konumumuz
          </span>
          <h2 className="section-title mb-4">
            Bizi Ziyaret Edin
          </h2>
          <p className="section-subtitle max-w-lg mx-auto">
            İstanbul'un tekstil merkezinde sizleri bekliyoruz. Mağazamıza gelin, ürünlerimizi yerinde inceleyin.
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
          }}
        >
          {/* Info Cards */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-[#B5541A]/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#B5541A]" />
                </div>
                <div>
                  <div className="font-bold text-[#2C1810] mb-1">Adres</div>
                  <p className="text-sm text-[#6B4F40] leading-relaxed">
                    BİRER TEKSTİL Ev Tekstil Ürünleri
                    <br />
                    İstanbul, Türkiye
                  </p>
                  <a
                    href="https://www.google.com/maps/place/B%C4%B0RER+TEKST%C4%B0L+Ev+Tekstil+%C3%9Cr%C3%BCnleri/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#B5541A] font-semibold mt-2 hover:underline"
                  >
                    Google Maps'te Aç
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-[#B5541A]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-[#B5541A]" />
                </div>
                <div>
                  <div className="font-bold text-[#2C1810] mb-1">İletişim</div>
                  <a
                    href="tel:+902120000000"
                    className="text-sm text-[#6B4F40] hover:text-[#B5541A] transition-colors block"
                  >
                    +90 (212) 000 00 00
                  </a>
                  <a
                    href="https://wa.me/902120000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#B5541A] font-semibold mt-2 hover:underline"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp ile Yaz
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-[#B5541A]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-[#B5541A]" />
                </div>
                <div>
                  <div className="font-bold text-[#2C1810] mb-1">Çalışma Saatleri</div>
                  <div className="text-sm text-[#6B4F40] space-y-1">
                    <div className="flex justify-between gap-6">
                      <span>Pazartesi – Cumartesi</span>
                      <span className="font-medium text-[#5C3D2E]">09:00 – 18:00</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span>Pazar</span>
                      <span className="font-medium text-[#8B6B5A]">Kapalı</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-[#E8DDD0]" style={{ height: "420px" }}>
            <iframe
              title="Birer Tekstil Konumu"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9e7a7777c43%3A0x4c76cf3b4b4b4b4b!2zQsSwUkVSIFRFS1NUxLBMIEV2IFRla3N0aWwgw5xyw7xubGVyaQ!5e0!3m2!1str!2str!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
