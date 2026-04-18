import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.birertekstil.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Birer Tekstil İstanbul | Ev Tekstili Ürünleri",
    template: "%s | Birer Tekstil İstanbul",
  },
  description:
    "İstanbul'da üreticiden kaliteli ev tekstili ürünleri. Nevresim, pike, saten, keten, kapitone ve daha fazlası. 20+ yıllık deneyim, aynı gün kargo.",
  keywords: [
    "ev tekstili", "nevresim takımı", "pike", "saten kumaş", "keten kumaş",
    "kapitone", "İstanbul tekstil", "Birer Tekstil", "toptan tekstil",
    "Gardenya keten", "Akfil saten", "Gonca pike", "Hera pike", "Limi pike",
  ],
  authors: [{ name: "Birer Tekstil" }],
  creator: "Birer Tekstil",
  publisher: "Birer Tekstil",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Birer Tekstil İstanbul | Ev Tekstili Ürünleri",
    description:
      "İstanbul'da üreticiden kaliteli ev tekstili ürünleri. 20+ yıllık deneyim, aynı gün kargo.",
    siteName: "Birer Tekstil",
    type: "website",
    url: BASE_URL,
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birer Tekstil İstanbul | Ev Tekstili Ürünleri",
    description: "İstanbul'da üreticiden kaliteli ev tekstili ürünleri.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#business`,
  name: "Birer Tekstil",
  description:
    "İstanbul'da üreticiden kaliteli ev tekstili ürünleri. Nevresim, pike, saten, keten, kapitone ve daha fazlası.",
  url: BASE_URL,
  telephone: "+90-533-242-3665",
  priceRange: "₺₺",
  image: `${BASE_URL}/birerteks-logo.png`,
  logo: `${BASE_URL}/birerteks-logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "İstanbul",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.0082,
    longitude: 28.9784,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+90-533-242-3665",
    contactType: "customer service",
    availableLanguage: "Turkish",
    contactOption: "TollFree",
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Birer Tekstil",
  url: BASE_URL,
  inLanguage: "tr-TR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/urunler/{search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#f8f5f0', color: '#3d2c1e' }}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
