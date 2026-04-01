/*
 * DESIGN: Soft Luxury — dark footer with warm brown background
 * Business name, address, Google Maps link, phone/WhatsApp
 */
import { MapPin, Phone, Clock, ExternalLink, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#2C1810] text-white">
      {/* Main Footer */}
      <div className="container py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-2xl font-bold text-white block"
              >
                Birer Tekstil
              </span>
              <span className="text-xs text-white/50 tracking-widest uppercase">
                Ev Tekstil Ürünleri
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              İstanbul'un güvenilir ev tekstili tedarikçisi. Fabrikadan direkt fiyatlarla yüksek kaliteli yatak takımları, havlular ve daha fazlası.
            </p>
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/902120000000?text=Merhaba%2C%20ev%20tekstili%20ürünleri%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B5541A] text-white text-sm font-bold rounded-lg hover:bg-[#9A4515] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp ile Yazın
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-base font-bold text-white mb-5"
            >
              Hızlı Bağlantılar
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Ürünlerimiz", href: "#products" },
                { label: "Hakkımızda", href: "#about" },
                { label: "Müşteri Yorumları", href: "#testimonials" },
                { label: "Konumumuz", href: "#location" },
                { label: "Teklif Al", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-white/60 hover:text-[#E8DDD0] transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-base font-bold text-white mb-5"
            >
              İletişim
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#B5541A] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm text-white/70 leading-relaxed">
                    BİRER TEKSTİL Ev Tekstil Ürünleri
                    <br />
                    İstanbul, Türkiye
                  </div>
                  <a
                    href="https://www.google.com/maps/place/B%C4%B0RER+TEKST%C4%B0L+Ev+Tekstil+%C3%9Cr%C3%BCnleri/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#B5541A] hover:text-[#E8A080] mt-1 transition-colors"
                  >
                    Haritada Gör <ExternalLink size={10} />
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-[#B5541A] shrink-0" />
                <a href="tel:+902120000000" className="text-sm text-white/70 hover:text-white transition-colors">
                  +90 (212) 000 00 00
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={15} className="text-[#B5541A] mt-0.5 shrink-0" />
                <div className="text-sm text-white/70">
                  <div>Pzt – Cmt: 09:00 – 18:00</div>
                  <div className="text-white/40">Pazar: Kapalı</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {currentYear} Birer Tekstil. Tüm hakları saklıdır.</span>
          <span className="flex items-center gap-2">
            <span>home textile Istanbul</span>
            <span className="text-white/20">·</span>
            <span>bedding supplier Turkey</span>
            <span className="text-white/20">·</span>
            <span>towel wholesale Istanbul</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
