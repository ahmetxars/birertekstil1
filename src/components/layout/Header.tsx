'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const navItems = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Kategoriler', href: '/#categories' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'İletişim', href: '/iletisim' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8e0d4] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/birerteks-logo.png"
              alt="Birer Tekstil"
              width={240}
              height={80}
              priority
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : item.href.startsWith('/#')
                    ? pathname === '/'
                    : pathname === item.href

              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={`text-[#3d2c1e] hover:text-[#a67c52] hover:bg-[#f0ebe3] ${
                    isActive ? 'text-[#a67c52] font-semibold' : ''
                  }`}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              )
            })}
          </nav>

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
                  <Image
                    src="/birerteks-logo.png"
                    alt="Birer Tekstil"
                    width={220}
                    height={74}
                    className="h-11 w-auto"
                  />
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex-1 py-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center w-full px-4 py-3 text-left text-[#3d2c1e] hover:bg-[#f0ebe3] transition-colors text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
