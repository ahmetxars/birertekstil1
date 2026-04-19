'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin, Mail, Instagram, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

import { useSettings } from '@/hooks/useSettings'

export default function ContactSection() {
  const settings = useSettings()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      toast.error('Lütfen tüm alanları doldurun')
      return
    }

    const waNumber = settings.whatsappNumber.replace(/[^0-9]/g, '')
    const text = `Merhaba, ben ${form.name}.\nTelefon: ${form.phone}\n\n${form.message}`
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    toast.success('WhatsApp açılıyor...')
    setForm({ name: '', phone: '', message: '' })
  }

  const waNumber = settings.whatsappNumber.replace(/[^0-9]/g, '')

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-3">
            İletişime Geçin
          </h2>
          <p className="text-[#8b7355] max-w-xl mx-auto">
            Sorularınız ve siparişleriniz için bize ulaşın
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form → sends via WhatsApp */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-[#e8e0d4]">
              <CardContent className="p-6">
                <p className="text-sm text-[#8b7355] mb-5">
                  Formu doldurun — WhatsApp üzerinden bize iletilsin.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#3d2c1e] font-medium">
                      Adınız Soyadınız
                    </Label>
                    <Input
                      id="name"
                      placeholder="Adınızı giriniz"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="border-[#e8e0d4] focus:border-[#a67c52]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#3d2c1e] font-medium">
                      Telefon Numaranız
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0 5XX XXX XX XX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="border-[#e8e0d4] focus:border-[#a67c52]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#3d2c1e] font-medium">
                      Mesajınız
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Mesajınızı yazınız..."
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="border-[#e8e0d4] focus:border-[#a67c52] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white font-semibold py-5"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp ile Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-5"
          >
            {/* Google Maps */}
            <Card className="border-[#e8e0d4] overflow-hidden">
              <CardContent className="p-0">
                <div className="w-full h-56">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.8!2d28.9!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9baf18b5581%3A0x9e51df6ee75a5517!2sB%C4%B0RER%20TEKST%C4%B0L%20Ev%20Tekstil%20%C3%9Cr%C3%BCnleri!5e0!3m2!1str!2str!4v1743820000000!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Birer Tekstil Konum"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Phone */}
              <Card className="border-[#e8e0d4]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#a67c52]/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-[#a67c52]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#8b7355]">Telefon</p>
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, '')}`}
                      className="text-sm font-semibold text-[#3d2c1e] hover:text-[#a67c52] truncate block"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="border-[#e8e0d4]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#a67c52]/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-[#a67c52]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#8b7355]">Adres</p>
                    <p className="text-sm font-semibold text-[#3d2c1e] leading-tight">{settings.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Email — only shown if set */}
              {settings.email ? (
                <Card className="border-[#e8e0d4]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#a67c52]/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-[#a67c52]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#8b7355]">E-posta</p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-sm font-semibold text-[#3d2c1e] hover:text-[#a67c52] truncate block"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Instagram — only shown if set */}
              {settings.instagramUrl ? (
                <Card className="border-[#e8e0d4]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center shrink-0">
                      <Instagram className="h-5 w-5 text-pink-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#8b7355]">Instagram</p>
                      <a
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#3d2c1e] hover:text-pink-500 truncate block"
                      >
                        {settings.instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\/?/, '@').replace(/\/$/, '')}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            {/* WhatsApp direct CTA */}
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Merhaba, bilgi almak istiyorum.')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="w-full text-white font-semibold py-6 text-base"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp ile Hemen Yazın
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
