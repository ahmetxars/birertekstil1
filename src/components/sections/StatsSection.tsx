'use client'

import { motion } from 'framer-motion'
import { Package, Award, Layers, MessageCircle } from 'lucide-react'

const stats = [
  {
    number: '500+',
    title: 'Ürün Çeşidi',
    description: 'Geniş ürün yelpazesi',
    icon: Package,
  },
  {
    number: '20+',
    title: 'Yıllık Deneyim',
    description: 'Sektör tecrübesi',
    icon: Award,
  },
  {
    number: '8',
    title: 'Ürün Grubu',
    description: 'Farklı kategori',
    icon: Layers,
  },
  {
    number: '7/24',
    title: 'WhatsApp Destek',
    description: 'Anında iletişim',
    icon: MessageCircle,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function StatsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-4 md:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-[#f8f5f0] border border-[#e8e0d4] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#a67c52]/10 mb-4">
                <stat.icon className="h-6 w-6 text-[#a67c52]" />
              </div>
              <span className="text-3xl md:text-4xl font-bold text-[#a67c52] mb-1">
                {stat.number}
              </span>
              <span className="text-base font-semibold text-[#3d2c1e] mb-1">
                {stat.title}
              </span>
              <span className="text-sm text-[#8b7355]">
                {stat.description}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
