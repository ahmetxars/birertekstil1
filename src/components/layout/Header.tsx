'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Home, Grid3X3, Phone, Star, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import Image from 'next/image'

const navItems = [
  { label: 'Ana Sayfa', icon: Home, href: '/' },
  { label: 'Öne Çıkan', icon: Star, href: '/', scroll: 'featured', highlight: true },
  { label: 'Ürünler', icon: Grid3X3, href: '/', scroll: 'categories' },
  { label: 'Hakkımızda', icon: Info, href: '/', scroll: 'hakkimizda' },
  { label: 'İletişim', icon: Phone, href: '/', scroll: 'contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleNav = (item: (typeof navItems)[0]) => {
    setOpen(false)
    if (item.scroll) {
      if (pathname === '/') {
        const el = document.getElementById(item.scroll)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      } else {
        router.push('/')
        setTimeout(() => {
          const el = document.getElementById(item.scroll!)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
    } else {
      router.push(item.href)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8e0d4] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="hover:opacity-80 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/birerteks-logo.png"
              alt="Birer Tekstil"
              className="h-14 w-auto object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.highlight ? (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-[#a67c52] text-white hover:bg-[#a67c52]/90 transition-colors shadow-sm mx-1"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              ) : (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNav(item)}
                  className={`text-[#3d2c1e] hover:text-[#a67c52] hover:bg-[#f0ebe3] ${
                    pathname === item.href && !item.scroll ? 'text-[#a67c52] font-semibold' : ''
                  }`}
                >
                  {item.label}
                </Button>
              )
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-[#3d2c1e]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white p-0">
              <SheetTitle className="sr-only">Menü</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-[#e8e0d4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/birerteks-logo.png"
                    alt="Birer Tekstil"
                    className="h-12 w-auto object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex-1 py-2">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNav(item)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                        item.highlight
                          ? 'text-[#a67c52] bg-[#a67c52]/5 font-semibold'
                          : 'text-[#3d2c1e] hover:bg-[#f0ebe3]'
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${item.highlight ? 'text-[#a67c52]' : 'text-[#a67c52]'}`}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.highlight && (
                        <span className="ml-auto text-xs bg-[#a67c52] text-white px-2 py-0.5 rounded-full">
                          Yeni
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
                <div className="p-4 border-t border-[#e8e0d4]">
                  <a
                    href="https://wa.me/905332423665?text=Merhaba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-white font-medium text-sm"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp ile İletişim
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
