import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import GoogleAnalytics from '@/components/site/GoogleAnalytics'
import { SITE_NAME, SITE_URL } from '@/lib/site'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | İstanbul'da Üreticiden Ev Tekstili`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "İstanbul'da üreticiden kaliteli ev tekstili ürünleri. Pike, nevresim, keten, saten ve daha fazlası için Birer Tekstil koleksiyonunu inceleyin.",
  keywords: [
    'ev tekstili',
    'nevresim',
    'pike',
    'ipek',
    'keten',
    'İstanbul',
    'Türkiye',
    'Birer Tekstil',
  ],
  authors: [{ name: SITE_NAME }],
  icons: {
    icon: [
      { url: '/birerteks-logo.png', type: 'image/png' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/birerteks-logo.png',
    apple: '/birerteks-logo.png',
  },
  openGraph: {
    title: `${SITE_NAME} | İstanbul'da Üreticiden Ev Tekstili`,
    description:
      "İstanbul'da üreticiden kaliteli ev tekstili ürünleri. 20 yılı aşkın tecrübe ve WhatsApp üzerinden hızlı fiyat desteği.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/hero-bg.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} ana görseli`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | İstanbul'da Üreticiden Ev Tekstili`,
    description:
      "İstanbul'da üreticiden kaliteli ev tekstili ürünleri. WhatsApp üzerinden hızlı fiyat desteği alın.",
    images: ['/hero-bg.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#f8f5f0', color: '#3d2c1e' }}
      >
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
