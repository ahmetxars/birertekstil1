import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from '@/lib/auth'
import { db } from '@/lib/db'

const categories = [
  {
    groupNumber: 1,
    name: 'Akfil, Pamuk Saten, Çizgili Pamuk Saten',
    slug: 'akfil-pamuk-saten',
    description: 'Premium pamuk saten ve akfil kumaşları',
    order: 1,
    products: [
      { name: 'Premium Pamuk Saten', description: 'Yüksek kaliteli %100 pamuk saten kumaş. Yumuşak dokusu ve parlak görünümü ile konforlu bir uyku deneyimi sunar.', image: '/uploads/products/pamuk-saten-1.jpg', featured: true },
      { name: 'Akfil Kumaş', description: 'İnce ve şeffaf dokusuyla mevsimlik kıyafetlerde tercih edilen doğal akfil kumaşı.', image: '/uploads/products/akfil-1.jpg', featured: false },
      { name: 'Çizgili Pamuk Saten', description: 'Şık çizgi deseni ile modern ve zarif bir görünüm sağlayan pamuk saten kumaş.', image: '/uploads/products/cizgili-pamuk-saten-1.jpg', featured: true },
    ]
  },
  {
    groupNumber: 2,
    name: 'Gardenya, Linen, Nicea Keten, Fay, Duck Bezi',
    slug: 'gardenya-linen-keten',
    description: 'Doğal keten ve özel kumaş çeşitleri',
    order: 2,
    products: [
      { name: 'Gardenya Kumaş', description: 'Çiçek desenli gardenya kumaş, yazlık elbise ve ev tekstili için idealdir.', image: '/uploads/products/gardenya-1.jpg', featured: false },
      { name: 'Linen Kumaş', description: 'Doğal keten liflerinden üretilen, nefes alabilen premium linen kumaş.', image: '/uploads/products/linen-1.jpg', featured: true },
      { name: 'Nicea Keten', description: 'Nicea bölgesine özgü kaliteli keten dokuma, dayanıklı ve şık.', image: '/uploads/products/nicea-keten-1.jpg', featured: false },
      { name: 'Fay Kumaş', description: 'Temiz ve ferah dokusuyla banyo ve mutfak tekstilinde tercih edilen fay bezi.', image: '/uploads/products/fay-1.jpg', featured: false },
      { name: 'Duck Bezi', description: 'Sık dokumalı, su geçirmez duck bezi. Dış giyim ve koruyucu tekstil için idealdir.', image: '/uploads/products/duck-bezi-1.jpg', featured: false },
    ]
  },
  {
    groupNumber: 3,
    name: 'Desenli Nevresim, 3D Dijital Nevresim',
    slug: 'desenli-nevresim',
    description: 'Desenli ve dijital baskılı nevresim takımları',
    order: 3,
    products: [
      { name: 'Desenli Nevresim Takımı', description: 'Geleneksel Osmanlı desenleriyle süslenmiş kaliteli nevresim takımı.', image: '/uploads/products/desenli-nevresim-1.jpg', featured: true },
      { name: '3D Dijital Nevresim', description: 'Son teknoloji dijital baskı ile üretilen, canlı renkleri uzun ömürlü 3D nevresim takımı.', image: '/uploads/products/3d-dijital-nevresim-1.jpg', featured: true },
    ]
  },
  {
    groupNumber: 4,
    name: 'Şönil Pike, Hera Pike, Limi Pike',
    slug: 'sonil-hera-limi-pike',
    description: 'Premium pike kumaş çeşitleri',
    order: 4,
    products: [
      { name: 'Şönil Pike', description: 'Yumuşak şönil dokusuyla lüks bir his veren premium pike kumaşı.', image: '/uploads/products/sonil-pike-1.jpg', featured: false },
      { name: 'Hera Pike', description: 'Eşsiz Hera dokusuyla dayanıklı ve şık pike kumaşı.', image: '/uploads/products/hera-pike-1.jpg', featured: true },
      { name: 'Limi Pike', description: 'İnce limi dokumasıyla hafif ve ferah, yaz ayları için ideal pike kumaşı.', image: '/uploads/products/limi-pike-1.jpg', featured: false },
    ]
  },
  {
    groupNumber: 5,
    name: 'Çizgili Pamuk Pike, Çizgili Baklava Pike, Örgü Pike',
    slug: 'cizgili-orgu-pike',
    description: 'Çizgili ve örgü pike modelleri',
    order: 5,
    products: [
      { name: 'Çizgili Pamuk Pike', description: 'Klasik çizgi deseniyle zamansız şıklık sunan pamuk pike kumaşı.', image: '/uploads/products/cizgili-pamuk-pike-1.jpg', featured: false },
      { name: 'Çizgili Baklava Pike', description: 'Baklava desenli çizgili pike, geleneksel ve modern tasarımın buluşması.', image: '/uploads/products/cizgili-baklava-pike-1.jpg', featured: true },
      { name: 'Örgü Pike', description: 'El örgüsü görünümünde, sıcak ve samimi bir atmosfer yaratan örgü pike.', image: '/uploads/products/orgu-pike-1.jpg', featured: false },
    ]
  },
  {
    groupNumber: 6,
    name: 'Osmanlı İpeği, Monoray, Markizet',
    slug: 'osmanli-ipek-monoray',
    description: 'İpek ve özel dokuma kumaşlar',
    order: 6,
    products: [
      { name: 'Osmanlı İpeği', description: 'Geleneksel Osmanlı ipek dokuma tekniğiyle üretilen, lüks ve eşsiz ipek kumaş.', image: '/uploads/products/osmanli-ipegi-1.jpg', featured: true },
      { name: 'Monoray Kumaş', description: 'Parlak yüzeyi ve premium dokusuyla öne çıkan monoray kumaş.', image: '/uploads/products/monoray-1.jpg', featured: false },
      { name: 'Markizet Kumaş', description: 'İnce ve hafif markizet dokuması, şeffaf ve zarif kumaş çeşidi.', image: '/uploads/products/markizet-1.jpg', featured: false },
    ]
  },
  {
    groupNumber: 7,
    name: 'Amerikan Bezi, Ham Bez',
    slug: 'amerikan-ham-bez',
    description: 'Amerikan bezi ve ham bez çeşitleri',
    order: 7,
    products: [
      { name: 'Amerikan Bezi', description: 'Dayanıklı ve kalın dokusuyla ünlü amerikan bezi, her türlü kullanıma uygundur.', image: '/uploads/products/amerikan-bezi-1.jpg', featured: false },
      { name: 'Ham Bez', description: 'Tamamen doğal, işlenmemiş pamuktan üretilen ham bez.', image: '/uploads/products/ham-bez-1.jpg', featured: false },
    ]
  },
  {
    groupNumber: 8,
    name: 'Kapitone, Elyaf',
    slug: 'kapitone-elyaf',
    description: 'Kapitone kumaş ve elyaf malzemeler',
    order: 8,
    products: [
      { name: 'Kapitone Kumaş', description: 'İçi dolgulu kapitone kumaş, yastık, yorgan ve mont üretiminde kullanılır.', image: '/uploads/products/kapitone-1.jpg', featured: false },
      { name: 'Elyaf', description: 'Yüksek kaliteli polyester elyaf, yorgan ve yastık dolgusu için ideal.', image: '/uploads/products/elyaf-1.jpg', featured: false },
    ]
  },
]

export async function POST() {
  const cookieStore = await cookies()
  if (!isValidAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    // Clear existing data
    await db.product.deleteMany()
    await db.category.deleteMany()

    for (const cat of categories) {
      const { products, ...categoryData } = cat

      await db.category.create({
        data: {
          ...categoryData,
          products: {
            create: products.map((p, idx) => ({
              ...p,
              order: idx,
            }))
          }
        },
      })
    }

    return NextResponse.json({ message: 'Veriler başarıyla yüklendi' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Veriler yüklenirken hata oluştu' }, { status: 500 })
  }
}
