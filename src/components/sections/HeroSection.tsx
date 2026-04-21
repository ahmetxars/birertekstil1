'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TrackedExternalLink from '@/components/site/TrackedExternalLink'
import { buildPhoneHref } from '@/lib/site'

const typingText =
  'Pike, nevresim, saten, keten ve daha fazlası için hızlı fiyat desteği alın.'

function useTypingEffect(text: string, speed = 40, startDelay = 800, pauseDuration = 3000) {
  const [displayText, setDisplayText] = useState('')
  const [isPaused, setIsPaused] = useState(false)

  const startTyping = useCallback(() => {
    setIsPaused(false)
    setDisplayText('')
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index += 1
      } else {
        clearInterval(typeInterval)
        setIsPaused(true)
      }
    }, speed)

    return typeInterval
  }, [text, speed])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = startTyping()
      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [startTyping, startDelay])

  useEffect(() => {
    if (!isPaused) return

    const timeout = setTimeout(() => {
      const interval = startTyping()
      return () => clearInterval(interval)
    }, pauseDuration)

    return () => clearTimeout(timeout)
  }, [isPaused, pauseDuration, startTyping])

  return displayText
}

interface HeroSectionProps {
  heroTitle: string
  heroSubtitle: string
  whatsappNumber: string
  phone: string
}

export default function HeroSection({
  heroTitle,
  heroSubtitle,
  whatsappNumber,
  phone,
}: HeroSectionProps) {
  const displayText = useTypingEffect(typingText, 35, 1200, 4000)

  return (
    <section className="relative w-full h-[70vh] min-h-[540px] max-h-[820px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[#a67c52] text-sm md:text-base tracking-widest uppercase mb-4"
        >
          {heroSubtitle}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mb-6"
        >
          {heroTitle}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-white/80 text-base md:text-lg max-w-2xl mb-8 h-[56px] flex items-center justify-center"
        >
          <span>
            {displayText}
            <span className="inline-block w-0.5 h-5 bg-[#a67c52] ml-1 animate-pulse align-middle" />
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <TrackedExternalLink
            href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Merhaba, ürünler hakkında bilgi almak istiyorum.')}`}
            target="_blank"
            rel="noopener noreferrer"
            leadType="whatsapp"
            leadLabel="hero_whatsapp"
            className="inline-flex items-center justify-center rounded-md text-white font-semibold px-8 py-4 text-base shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundColor: '#25D366' }}
          >
            WhatsApp ile fiyat sor
          </TrackedExternalLink>
          <TrackedExternalLink
            href={buildPhoneHref(phone)}
            leadType="phone"
            leadLabel="hero_phone"
            className="inline-flex items-center justify-center rounded-md border border-white text-white hover:bg-white/10 bg-transparent font-semibold px-8 py-4 text-base"
          >
            Telefonla ara
          </TrackedExternalLink>
        </motion.div>
      </motion.div>
    </section>
  )
}
