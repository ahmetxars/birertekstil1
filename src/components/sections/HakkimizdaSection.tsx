'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Users, Package, Handshake } from 'lucide-react'

const defaultValues = [
  { icon: Award, title: '20+ Yıllık Deneyim', desc: 'Sektörde iki dekatı aşkın bilgi birikimi' },
  { icon: Package, title: 'Geniş Ürün Yelpazesi', desc: '500+ ürün çeşidi, 8 farklı kategori' },
  { icon: Users, title: 'Üreticiden Direkt', desc: 'Aracısız, fabrikadan taze ürünler' },
  { icon: Handshake, title: '7/24 Destek', desc: 'WhatsApp üzerinden anında yanıt' },
]

export default function HakkimizdaSection() {
  const [aboutText, setAboutText] = useState(
    'Birer Tekstil olarak İstanbul\'da 20 yılı aşkın süredir ev tekstili sektöründe faaliyet göstermekteyiz. Nevresim takımları, pike, ipek ürünler, keten, kapito ve daha birçok kategoriyle geniş bir ürün yelpazesi sunuyoruz. Üreticiden direkt satış anlayışıyla müşterilerimize en kaliteli ürünleri en uygun fiyatlarla ulaştırmayı hedefliyoruz.'
  )

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.aboutText) setAboutText(data.aboutText)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="hakkimizda" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f8f5f0]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#a67c52] text-sm font-semibold tracking-widest uppercase mb-3">
              Birer Tekstil
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-6 leading-tight">
              Hakkımızda
            </h2>
            <p className="text-[#8b7355] leading-relaxed text-base md:text-lg mb-6">
              {aboutText}
            </p>

            {/* Divider */}
            <div className="w-16 h-1 rounded-full bg-[#a67c52]" />
          </motion.div>

          {/* Right — Values grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {defaultValues.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-[#e8e0d4] hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#a67c52]/10 flex items-center justify-center mb-3">
                  <item.icon className="h-5 w-5 text-[#a67c52]" />
                </div>
                <h3 className="font-semibold text-[#3d2c1e] text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-[#8b7355] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
