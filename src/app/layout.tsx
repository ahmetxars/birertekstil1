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

export const metadata: Metadata = {
  title: "Birer Tekstil İstanbul | Ev Tekstili Ürünleri",
  description: "İstanbul'da üreticiden kaliteli ev tekstili ürünleri. Nevresim, pike, ipek, keten, kapito ve daha fazlası. 20+ yıllık deneyim.",
  keywords: ["ev tekstili", "nevresim", "pike", "ipek", "keten", "kapito", "İstanbul", "Türkiye", "Birer Tekstil"],
  authors: [{ name: "Birer Tekstil" }],
  icons: {
    icon: "/hero-bg.png",
  },
  openGraph: {
    title: "Birer Tekstil İstanbul | Ev Tekstili Ürünleri",
    description: "İstanbul'da üreticiden kaliteli ev tekstili ürünleri. 20+ yıllık deneyim.",
    siteName: "Birer Tekstil",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
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
