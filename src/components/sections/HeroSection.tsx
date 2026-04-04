'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const typingText = "Akfil, Pamuk Saten, Keten, Pike ve daha fazlası... 20 yılı aşkın tecrübemizle size en kaliteli ürünleri sunuyoruz."

function useTypingEffect(text: string, speed: number = 40, startDelay: number = 800, pauseDuration: number = 3000) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const startTyping = useCallback(() => {
    setIsTyping(true)
    setIsPaused(false)
    setDisplayText('')
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        setIsPaused(true)
      }
    }, speed)

    return typeInterval
  }, [text, speed])

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const typeInterval = startTyping()

      return () => clearInterval(typeInterval)
    }, startDelay)

    return () => clearTimeout(startTimeout)
  }, [startTyping, startDelay])

  // Loop: after pause, restart typing
  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setDisplayText('')
        let index = 0
        const typeInterval = setInterval(() => {
          if (index < text.length) {
            setDisplayText(text.slice(0, index + 1))
            index++
          } else {
            clearInterval(typeInterval)
            setIsPaused(true)
          }
        }, speed)
      }, pauseDuration)

      return () => clearTimeout(pauseTimeout)
    }
  }, [isPaused, text, speed, pauseDuration])

  return { displayText, isTyping }
}

export default function HeroSection() {
  const scrollToCategories = () => {
    const el = document.getElementById('categories')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const { displayText } = useTypingEffect(typingText, 35, 1200, 4000)

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
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
          Birer Tekstil İstanbul
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mb-6"
        >
          İstanbul&apos;da Üreticiden Kaliteli{' '}
          <span className="text-[#a67c52]">Ev Tekstili</span> Ürünleri
        </motion.h1>

        {/* Typing Animation Text */}
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
          <a
            href="https://wa.me/905332423665?text=Merhaba"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="text-white font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp ile İletişim
            </Button>
          </a>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToCategories}
            className="border-white text-white hover:bg-white/10 bg-transparent font-semibold px-8 py-6 text-base"
          >
            Ürünleri Keşfet
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
