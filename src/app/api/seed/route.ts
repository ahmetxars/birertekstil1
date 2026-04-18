import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const seedData = [
  {
    groupNumber: 1,
    name: 'Nevresim Takımları',
    slug: 'nevresim-takimlari',
    description: 'Yüksek kaliteli pamuk ve dijital baskılı nevresim takımları',
    order: 1,
    children: [
      {
        name: 'Desenli Nevresim',
        slug: 'desenli-nevresim',
        description: 'Geleneksel ve modern desenlerle üretilmiş nevresim takımları',
        order: 1,
        products: [
          { name: 'Çiçek Desenli Nevresim Takımı', description: 'Şık çiçek motifleriyle süslenmiş, %100 pamuk nevresim takımı. Çift kişilik seçenekler mevcuttur.', featured: true },
          { name: 'Geometrik Desenli Nevresim', description: 'Modern geometrik desenlerle üretilmiş, dayanıklı ve yumuşak pamuklu nevresim takımı.', featured: false },
          { name: 'Klasik Çizgili Nevresim', description: 'Zamansız çizgili desen, her yatak odasına uyan klasik nevresim takımı.', featured: false },
        ],
      },
      {
        name: '3D Dijital Nevresim',
        slug: '3d-dijital-nevresim',
        description: 'Son teknoloji dijital baskı ile üretilen canlı renkli nevresim takımları',
        order: 2,
        products: [
          { name: '3D Orman Manzaralı Nevresim', description: 'Gerçekçi orman manzarası dijital baskılı, canlı renkli nevresim takımı. Yıkamaya dayanıklı boya.', featured: true },
          { name: '3D Şelale Desenli Nevresim', description: 'Huzur veren şelale manzarası, yüksek çözünürlüklü dijital baskı ile üretilmiştir.', featured: false },
        ],
      },
    ],
  },
  {
    groupNumber: 2,
    name: 'Pike & Yatak Örtüsü',
    slug: 'pike-yatak-ortusu',
    description: 'Şönil, limi, hera ve gonca pike çeşitleri',
    order: 2,
    children: [
      {
        name: 'Şönil Pike',
        slug: 'sonil-pike',
        description: 'Yumuşak şönil dokusuyla lüks bir his veren pike kumaşları',
        order: 1,
        products: [
          { name: 'Şönil Pike Yatak Örtüsü - Krem', description: 'Krem rengi yumuşak şönil pike, çift ve tek kişilik seçenekler mevcut.', featured: true },
          { name: 'Şönil Pike - Vizon', description: 'Vizon tonlarında şık şönil pike yatak örtüsü, modern yatak odaları için ideal.', featured: false },
        ],
      },
      {
        name: 'Limi Pike',
        slug: 'limi-pike',
        description: 'Limi markasının özel pike koleksiyonu',
        order: 2,
        products: [
          { name: 'Limi Pike - Beyaz', description: 'Limi markalı premium pike yatak örtüsü, saf beyaz renk seçeneği.', featured: true },
          { name: 'Limi Pike - Açık Gri', description: 'Limi markalı açık gri renk pike, minimalist yatak odası tasarımı için.', featured: false },
        ],
      },
      {
        name: 'Hera Pike',
        slug: 'hera-pike',
        description: 'Hera serisinin özel dokuma pike çeşitleri',
        order: 3,
        products: [
          { name: 'Hera Pike - Bej', description: 'Hera serisinin bej tonlarında özel pike yatak örtüsü, dayanıklı doku.', featured: true },
          { name: 'Hera Pike Çift Kişilik Set', description: 'Hera pike, yastık kılıfı dahil komple set. Çift kişilik.', featured: false },
        ],
      },
      {
        name: 'Gonca Pamuk Pike',
        slug: 'gonca-pamuk-pike',
        description: 'Gonca markasının %100 pamuk pike koleksiyonu',
        order: 4,
        products: [
          { name: 'Gonca Pamuk Pike - Çiçek', description: 'Gonca markasının çiçek desenli pamuklu pike yatak örtüsü.', featured: true },
          { name: 'Gonca Pamuk Pike - Düz', description: 'Gonca markasının sade ve şık düz renkli pamuklu pike.', featured: false },
        ],
      },
      {
        name: 'Gonca Örgü Pike',
        slug: 'gonca-orgu-pike',
        description: 'Gonca markasının el örgüsü görünümlü pike çeşitleri',
        order: 5,
        products: [
          { name: 'Gonca Örgü Pike - Ekru', description: 'Gonca markasının ekru rengi örgü desen pike yatak örtüsü.', featured: true },
          { name: 'Gonca Örgü Pike - Gri', description: 'Modern örgü deseniyle Gonca gri pike, yatak odanıza sıcaklık katar.', featured: false },
        ],
      },
    ],
  },
  {
    groupNumber: 3,
    name: 'Saten Kumaşlar',
    slug: 'saten-kumaslar',
    description: 'Pamuk saten, kristal saten ve mat saten çeşitleri',
    order: 3,
    children: [
      {
        name: 'Pamuk Saten',
        slug: 'pamuk-saten',
        description: '%100 pamuktan üretilen yumuşak saten kumaş',
        order: 1,
        products: [
          { name: 'Akfil Pamuk Saten - Beyaz', description: 'Akfil üretimi, %100 pamuk saten kumaş. 150 cm en. Yumuşak ve nefes alan yapı.', featured: true },
          { name: 'Akfil Pamuk Saten - Krem', description: 'Akfil krem rengi pamuk saten kumaş, nevresim ve çarşaf üretimi için ideal.', featured: false },
        ],
      },
      {
        name: 'Çizgili Pamuk Saten',
        slug: 'cizgili-pamuk-saten',
        description: 'Çizgi desenli pamuk saten kumaş çeşitleri',
        order: 2,
        products: [
          { name: 'İnce Çizgili Saten', description: 'İnce çizgi deseniyle şık pamuk saten kumaş, yatak takımları için tercih edilir.', featured: true },
          { name: 'Geniş Çizgili Saten', description: 'Belirgin çizgi desenli saten kumaş, otel ve ev tekstili için uygun.', featured: false },
        ],
      },
      {
        name: 'Kristal Parlak Saten',
        slug: 'kristal-parlak-saten',
        description: 'Parlak yüzeyli kristal saten kumaşlar',
        order: 3,
        products: [
          { name: 'Kristal Saten - Lacivert', description: 'Parlak yüzeyli kristal saten, şık görünüm için tercih edilen premium kumaş.', featured: true },
          { name: 'Kristal Saten - Bordo', description: 'Bordo rengi kristal parlak saten, özel davet ve gece tekstili için idealdir.', featured: false },
        ],
      },
      {
        name: 'Mat Saten',
        slug: 'mat-saten',
        description: 'Mat yüzeyli saten kumaşlar',
        order: 4,
        products: [
          { name: 'Mat Saten - Gri', description: 'Mat yüzeyli gri saten kumaş, modern minimalist tasarımlar için tercih edilir.', featured: false },
          { name: 'Mat Saten - Bej', description: 'Bej rengi mat saten, doğal görünümlü ev tekstili üretimi için ideal.', featured: false },
        ],
      },
    ],
  },
  {
    groupNumber: 4,
    name: 'Keten Kumaşlar',
    slug: 'keten-kumaslar',
    description: 'Gardenya, linen ve etuval keten kumaş çeşitleri',
    order: 4,
    children: [
      {
        name: 'Gardenya Keten (1.70 En)',
        slug: 'gardenya-keten-170',
        description: 'Gardenya 1.70 metre eninde keten kumaş',
        order: 1,
        products: [
          { name: 'Gardenya Keten 1.70 - Naturel', description: 'Gardenya markasının 1.70 cm eninde naturel keten kumaşı. Perdeler ve masa örtüleri için idealdir.', featured: true },
          { name: 'Gardenya Keten 1.70 - Beyaz', description: '1.70 en, beyaz renk Gardenya keten kumaş. Ev tekstilinde çok yönlü kullanım.', featured: false },
        ],
      },
      {
        name: 'Gardenya Keten (3.05 En)',
        slug: 'gardenya-keten-305',
        description: 'Gardenya 3.05 metre eninde geniş keten kumaş',
        order: 2,
        products: [
          { name: 'Gardenya Keten 3.05 - Naturel', description: '3.05 cm geniş eniyle Gardenya keten kumaş, tül ve perde üretimi için özel.', featured: true },
          { name: 'Gardenya Keten 3.05 - Krem', description: 'Geniş formatlı krem rengi keten, salon perdeleri için ideal seçim.', featured: false },
        ],
      },
      {
        name: 'Simli Gardenya',
        slug: 'simli-gardenya',
        description: 'Sim detaylı Gardenya keten koleksiyonu',
        order: 3,
        products: [
          { name: 'Simli Gardenya - Gold', description: 'Altın sim ipliği ile dokunan Gardenya keten kumaş. Özel günler ve dekoratif tekstil için.', featured: true },
          { name: 'Simli Gardenya - Gümüş', description: 'Gümüş sim detaylı Gardenya keten, modern ve şık perdelik kumaş.', featured: false },
        ],
      },
      {
        name: 'Linen Keten',
        slug: 'linen-keten',
        description: 'Doğal linen keten kumaşlar',
        order: 4,
        products: [
          { name: 'Linen Keten - Doğal', description: 'Saf doğal linen keten kumaş, nefes alan yapısıyla yaz dönemine uygun.', featured: false },
          { name: 'Linen Keten - Açık Gri', description: 'Açık gri tonlarında linen keten, minimalist ev dekorasyonu için tercih edilir.', featured: false },
        ],
      },
      {
        name: 'Etuval Nicea Keten',
        slug: 'etuval-nicea-keten',
        description: 'Etuval Nicea serisi özel keten kumaşlar',
        order: 5,
        products: [
          { name: 'Etuval Nicea Keten - Naturel', description: 'Etuval Nicea serisi özel dokuma keten. Kalın ve dayanıklı yapısıyla uzun ömürlü kullanım.', featured: true },
          { name: 'Etuval Nicea Keten - Bej', description: 'Nicea serisi bej rengi keten kumaş, koltuk ve mobilya kaplamasında da kullanılabilir.', featured: false },
        ],
      },
    ],
  },
  {
    groupNumber: 5,
    name: 'Ham & Temel Kumaşlar',
    slug: 'ham-temel-kumaslar',
    description: 'Amerikan bezi, ham bez ve duck bezi çeşitleri',
    order: 5,
    children: [
      {
        name: 'Amerikan Bezi',
        slug: 'amerikan-bezi',
        description: 'Dayanıklı ve çok amaçlı amerikan bezi',
        order: 1,
        products: [
          { name: 'Amerikan Bezi - 140 gr', description: 'Standart 140 gr/m² ağırlığında amerikan bezi. Gömlek ve bluz üretiminde yaygın kullanım.', featured: false },
          { name: 'Amerikan Bezi - 160 gr', description: 'Daha kalın 160 gr/m² amerikan bezi, dış giysi ve kıyafet üretimi için tercih edilir.', featured: false },
        ],
      },
      {
        name: 'Ham Bez',
        slug: 'ham-bez',
        description: 'Doğal işlenmemiş ham bez çeşitleri',
        order: 2,
        products: [
          { name: 'Ham Bez - İnce', description: 'İnce dokumalı, doğal beyaz ham bez. Boyama ve baskı için ideal zemin kumaş.', featured: false },
          { name: 'Ham Bez - Orta Kalınlık', description: 'Orta kalınlıkta ham bez, çeşitli tekstil uygulamaları için kullanılır.', featured: false },
        ],
      },
      {
        name: 'Küçükçalık Duck Bezi',
        slug: 'kucukcalik-duck-bezi',
        description: 'Küçükçalık kalitesinde sıkı dokunmuş duck bezi',
        order: 3,
        products: [
          { name: 'Duck Bezi - 8 Oz', description: 'Hafif 8 oz duck bezi, çanta ve aksesuarlar için uygun sıkı dokuma.', featured: false },
          { name: 'Duck Bezi - 12 Oz', description: '12 oz ağırlığında dayanıklı duck bezi, dış mekan ve koruyucu tekstil uygulamaları için.', featured: true },
        ],
      },
    ],
  },
  {
    groupNumber: 6,
    name: 'Özel Kumaşlar',
    slug: 'ozel-kumaslar',
    description: 'Osmanlı ipeği, monoray ve markizet özel kumaş çeşitleri',
    order: 6,
    children: [
      {
        name: 'Osmanlı İpeği',
        slug: 'osmanli-ipegi',
        description: 'Geleneksel Osmanlı ipek dokuma tekniğiyle üretilen lüks kumaşlar',
        order: 1,
        products: [
          { name: 'Osmanlı İpeği - Bordo', description: 'Geleneksel Osmanlı ipek dokuma tekniğiyle üretilen, lüks ve eşsiz bordo rengi kumaş.', featured: true },
          { name: 'Osmanlı İpeği - Lacivert', description: 'El işçiliğiyle üretilmiş lacivert Osmanlı ipeği, şal ve atkı için ideal.', featured: false },
        ],
      },
      {
        name: 'Monoray',
        slug: 'monoray',
        description: 'Parlak yüzeyli premium monoray kumaşlar',
        order: 2,
        products: [
          { name: 'Monoray - Beyaz', description: 'Parlak yüzeyli beyaz monoray kumaş, astar ve iç giyim tekstilinde kullanılır.', featured: false },
          { name: 'Monoray - Siyah', description: 'Siyah rengi monoray, şık görünümüyle gece kıyafetleri ve dekoru için idealdir.', featured: false },
        ],
      },
      {
        name: 'Etuval Markizet',
        slug: 'etuval-markizet',
        description: 'İnce ve şeffaf etuval markizet kumaşlar',
        order: 3,
        products: [
          { name: 'Etuval Markizet - Beyaz', description: 'İnce ve hafif beyaz markizet, tül perde ve yazlık kıyafetler için tercih edilir.', featured: false },
          { name: 'Etuval Markizet - Ekru', description: 'Ekru rengi markizet kumaş, şeffaf ve zarif görünümüyle salon perdeleri için uygun.', featured: false },
        ],
      },
    ],
  },
  {
    groupNumber: 7,
    name: 'Kapitone (Dolgu Ürünler)',
    slug: 'kapitone-dolgu-urunler',
    description: 'Yerli ve ithal saten kapitone kumaş çeşitleri',
    order: 7,
    children: [
      {
        name: 'Kapitone Yerli Saten (70GR Elyaf)',
        slug: 'kapitone-yerli-saten-70gr',
        description: '70 gr elyaf dolgulu yerli saten kapitone kumaş',
        order: 1,
        products: [
          { name: 'Yerli Saten Kapitone - Beyaz 70gr', description: '70gr elyaf dolgulu, yerli üretim saten kapitone. Mont ve mont astarı üretiminde kullanılır.', featured: true },
          { name: 'Yerli Saten Kapitone - Ekru 70gr', description: 'Ekru rengi 70gr yerli saten kapitone, yatak ve yorgan yapımında tercih edilir.', featured: false },
        ],
      },
      {
        name: 'Kapitone İthal Saten (120GR Elyaf)',
        slug: 'kapitone-ithal-saten-120gr',
        description: '120 gr elyaf dolgulu ithal saten kapitone kumaş',
        order: 2,
        products: [
          { name: 'İthal Saten Kapitone - Beyaz 120gr', description: '120gr ithal elyaf dolgulu saten kapitone. Daha ağır ve ısı tutucu yapısıyla kışlık ürünler için ideal.', featured: true },
          { name: 'İthal Saten Kapitone - Gri 120gr', description: 'Gri rengi ithal saten kapitone, 120gr elyaf dolgu, premium yorgan üretimi için.', featured: false },
        ],
      },
    ],
  },
]

const brands = [
  { name: 'Akfil', slug: 'akfil' },
  { name: 'Gonca', slug: 'gonca' },
  { name: 'Hera', slug: 'hera' },
  { name: 'Limi', slug: 'limi' },
  { name: 'Gardenya', slug: 'gardenya' },
]

export async function POST() {
  try {
    // Clear existing data in order (FK constraints)
    await db.product.deleteMany()
    await db.category.deleteMany()
    await db.brand.deleteMany()

    // Create brands
    for (const brand of brands) {
      await db.brand.upsert({
        where: { slug: brand.slug },
        update: brand,
        create: brand,
      })
    }

    // Create parent categories with their children and products
    for (const parent of seedData) {
      const { children, ...parentData } = parent

      // Create parent category
      const parentCat = await db.category.create({
        data: {
          ...parentData,
        },
      })

      // Create child categories and their products
      for (const child of children) {
        const { products, ...childData } = child

        const childCat = await db.category.create({
          data: {
            ...childData,
            groupNumber: parentCat.groupNumber,
            parentId: parentCat.id,
          },
        })

        // Create products for this child category
        for (let i = 0; i < products.length; i++) {
          await db.product.create({
            data: {
              ...products[i],
              categoryId: childCat.id,
              order: i,
            },
          })
        }
      }
    }

    const totalCategories = await db.category.count()
    const totalProducts = await db.product.count()
    const totalBrands = await db.brand.count()

    return NextResponse.json({
      message: 'Veriler başarıyla yüklendi',
      stats: { categories: totalCategories, products: totalProducts, brands: totalBrands },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Veriler yüklenirken hata oluştu' }, { status: 500 })
  }
}
