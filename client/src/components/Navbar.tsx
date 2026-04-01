/*
 * DESIGN: Soft Luxury — sticky top nav, warm off-white bg, deep tea text
 * Smooth scroll navigation to page sections
 */
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Ürünlerimiz", href: "#products" },
  { label: "Hakkımızda", href: "#about" },
  { label: "Müşteri Yorumları", href: "#testimonials" },
  { label: "İletişim", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FDFAF6]/95 backdrop-blur-sm shadow-sm border-b border-[#E8DDD0]"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex flex-col leading-tight"
          >
            <span
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-xl md:text-2xl font-bold text-[#5C3D2E] tracking-tight"
            >
              Birer Tekstil
            </span>
            <span className="text-xs text-[#8B6B5A] font-light tracking-widest uppercase">
              Ev Tekstil Ürünleri
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-[#5C3D2E]/80 hover:text-[#B5541A] transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+902120000000"
              className="flex items-center gap-1.5 text-sm text-[#5C3D2E]/70 hover:text-[#B5541A] transition-colors"
            >
              <Phone size={14} />
              <span className="font-medium">Bizi Arayın</span>
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="btn-cta text-sm py-2 px-5"
            >
              Teklif Al
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-[#5C3D2E]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menüyü aç/kapat"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FDFAF6] border-t border-[#E8DDD0] shadow-lg">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-[#5C3D2E] hover:text-[#B5541A] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="btn-cta text-sm justify-center mt-2"
            >
              Teklif Al
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
