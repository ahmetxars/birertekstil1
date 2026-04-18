import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
          { name: 'Çiçek Desenli Nevresim Takımı', description: 'Şık çiçek motifleriyle süslenmiş, %100 pamuk nevresim takımı.', featured: true },
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
          { name: '3D Orman Manzaralı Nevresim', description: 'Gerçekçi orman manzarası dijital baskılı nevresim takımı.', featured: true },
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
          { name: 'Şönil Pike Yatak Örtüsü - Krem', description: 'Krem rengi yumuşak şönil pike.', featured: true },
          { name: 'Şönil Pike - Vizon', description: 'Vizon tonlarında şık şönil pike yatak örtüsü.', featured: false },
        ],
      },
      {
        name: 'Limi Pike',
        slug: 'limi-pike',
        description: 'Limi markasının özel pike koleksiyonu',
        order: 2,
        products: [
          { name: 'Limi Pike - Beyaz', description: 'Limi markalı premium pike yatak örtüsü, saf beyaz renk seçeneği.', featured: true },
          { name: 'Limi Pike - Açık Gri', description: 'Limi markalı açık gri renk pike.', featured: false },
        ],
      },
      {
        name: 'Hera Pike',
        slug: 'hera-pike',
        description: 'Hera serisinin özel dokuma pike çeşitleri',
        order: 3,
        products: [
          { name: 'Hera Pike - Bej', description: 'Hera serisinin bej tonlarında özel pike yatak örtüsü.', featured: true },
          { name: 'Hera Pike Çift Kişilik Set', description: 'Hera pike, yastık kılıfı dahil komple set.', featured: false },
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
          { name: 'Gonca Örgü Pike - Gri', description: 'Modern örgü deseniyle Gonca gri pike.', featured: false },
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
          { name: 'Akfil Pamuk Saten - Beyaz', description: 'Akfil üretimi, %100 pamuk saten kumaş. 150 cm en.', featured: true },
          { name: 'Akfil Pamuk Saten - Krem', description: 'Akfil krem rengi pamuk saten kumaş.', featured: false },
        ],
      },
      {
        name: 'Çizgili Pamuk Saten',
        slug: 'cizgili-pamuk-saten',
        description: 'Çizgi desenli pamuk saten kumaş çeşitleri',
        order: 2,
        products: [
          { name: 'İnce Çizgili Saten', description: 'İnce çizgi deseniyle şık pamuk saten kumaş.', featured: true },
          { name: 'Geniş Çizgili Saten', description: 'Belirgin çizgi desenli saten kumaş.', featured: false },
        ],
      },
      {
        name: 'Kristal Parlak Saten',
        slug: 'kristal-parlak-saten',
        description: 'Parlak yüzeyli kristal saten kumaşlar',
        order: 3,
        products: [
          { name: 'Kristal Saten - Lacivert', description: 'Parlak yüzeyli kristal saten, premium kumaş.', featured: true },
          { name: 'Kristal Saten - Bordo', description: 'Bordo rengi kristal parlak saten.', featured: false },
        ],
      },
      {
        name: 'Mat Saten',
        slug: 'mat-saten',
        description: 'Mat yüzeyli saten kumaşlar',
        order: 4,
        products: [
          { name: 'Mat Saten - Gri', description: 'Mat yüzeyli gri saten kumaş.', featured: false },
          { name: 'Mat Saten - Bej', description: 'Bej rengi mat saten.', featured: false },
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
          { name: 'Gardenya Keten 1.70 - Naturel', description: 'Gardenya markasının 1.70 cm eninde naturel keten kumaşı.', featured: true },
          { name: 'Gardenya Keten 1.70 - Beyaz', description: '1.70 en, beyaz renk Gardenya keten kumaş.', featured: false },
        ],
      },
      {
        name: 'Gardenya Keten (3.05 En)',
        slug: 'gardenya-keten-305',
        description: 'Gardenya 3.05 metre eninde geniş keten kumaş',
        order: 2,
        products: [
          { name: 'Gardenya Keten 3.05 - Naturel', description: '3.05 cm geniş eniyle Gardenya keten kumaş.', featured: true },
          { name: 'Gardenya Keten 3.05 - Krem', description: 'Geniş formatlı krem rengi keten.', featured: false },
        ],
      },
      {
        name: 'Simli Gardenya',
        slug: 'simli-gardenya',
        description: 'Sim detaylı Gardenya keten koleksiyonu',
        order: 3,
        products: [
          { name: 'Simli Gardenya - Gold', description: 'Altın sim ipliği ile dokunan Gardenya keten kumaş.', featured: true },
          { name: 'Simli Gardenya - Gümüş', description: 'Gümüş sim detaylı Gardenya keten.', featured: false },
        ],
      },
      {
        name: 'Linen Keten',
        slug: 'linen-keten',
        description: 'Doğal linen keten kumaşlar',
        order: 4,
        products: [
          { name: 'Linen Keten - Doğal', description: 'Saf doğal linen keten kumaş.', featured: false },
          { name: 'Linen Keten - Açık Gri', description: 'Açık gri tonlarında linen keten.', featured: false },
        ],
      },
      {
        name: 'Etuval Nicea Keten',
        slug: 'etuval-nicea-keten',
        description: 'Etuval Nicea serisi özel keten kumaşlar',
        order: 5,
        products: [
          { name: 'Etuval Nicea Keten - Naturel', description: 'Etuval Nicea serisi özel dokuma keten.', featured: true },
          { name: 'Etuval Nicea Keten - Bej', description: 'Nicea serisi bej rengi keten kumaş.', featured: false },
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
          { name: 'Amerikan Bezi - 140 gr', description: 'Standart 140 gr/m² ağırlığında amerikan bezi.', featured: false },
          { name: 'Amerikan Bezi - 160 gr', description: 'Daha kalın 160 gr/m² amerikan bezi.', featured: false },
        ],
      },
      {
        name: 'Ham Bez',
        slug: 'ham-bez',
        description: 'Doğal işlenmemiş ham bez çeşitleri',
        order: 2,
        products: [
          { name: 'Ham Bez - İnce', description: 'İnce dokumalı, doğal beyaz ham bez.', featured: false },
          { name: 'Ham Bez - Orta Kalınlık', description: 'Orta kalınlıkta ham bez.', featured: false },
        ],
      },
      {
        name: 'Küçükçalık Duck Bezi',
        slug: 'kucukcalik-duck-bezi',
        description: 'Küçükçalık kalitesinde sıkı dokunmuş duck bezi',
        order: 3,
        products: [
          { name: 'Duck Bezi - 8 Oz', description: 'Hafif 8 oz duck bezi.', featured: false },
          { name: 'Duck Bezi - 12 Oz', description: '12 oz ağırlığında dayanıklı duck bezi.', featured: true },
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
          { name: 'Osmanlı İpeği - Bordo', description: 'Geleneksel Osmanlı ipek dokuma tekniğiyle üretilen bordo rengi kumaş.', featured: true },
          { name: 'Osmanlı İpeği - Lacivert', description: 'El işçiliğiyle üretilmiş lacivert Osmanlı ipeği.', featured: false },
        ],
      },
      {
        name: 'Monoray',
        slug: 'monoray',
        description: 'Parlak yüzeyli premium monoray kumaşlar',
        order: 2,
        products: [
          { name: 'Monoray - Beyaz', description: 'Parlak yüzeyli beyaz monoray kumaş.', featured: false },
          { name: 'Monoray - Siyah', description: 'Siyah rengi monoray.', featured: false },
        ],
      },
      {
        name: 'Etuval Markizet',
        slug: 'etuval-markizet',
        description: 'İnce ve şeffaf etuval markizet kumaşlar',
        order: 3,
        products: [
          { name: 'Etuval Markizet - Beyaz', description: 'İnce ve hafif beyaz markizet.', featured: false },
          { name: 'Etuval Markizet - Ekru', description: 'Ekru rengi markizet kumaş.', featured: false },
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
          { name: 'Yerli Saten Kapitone - Beyaz 70gr', description: '70gr elyaf dolgulu, yerli üretim saten kapitone.', featured: true },
          { name: 'Yerli Saten Kapitone - Ekru 70gr', description: 'Ekru rengi 70gr yerli saten kapitone.', featured: false },
        ],
      },
      {
        name: 'Kapitone İthal Saten (120GR Elyaf)',
        slug: 'kapitone-ithal-saten-120gr',
        description: '120 gr elyaf dolgulu ithal saten kapitone kumaş',
        order: 2,
        products: [
          { name: 'İthal Saten Kapitone - Beyaz 120gr', description: '120gr ithal elyaf dolgulu saten kapitone.', featured: true },
          { name: 'İthal Saten Kapitone - Gri 120gr', description: 'Gri rengi ithal saten kapitone, 120gr elyaf dolgu.', featured: false },
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

async function main() {
  console.log('🌱 Seed başlatılıyor...')

  // Clear in FK-safe order
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  console.log('🗑️  Mevcut veriler temizlendi')

  // Create brands
  for (const brand of brands) {
    await prisma.brand.create({ data: brand })
  }
  console.log(`✅ ${brands.length} marka oluşturuldu`)

  let totalCategories = 0
  let totalProducts = 0

  for (const parent of seedData) {
    const { children, ...parentData } = parent
    const parentCat = await prisma.category.create({ data: parentData })
    totalCategories++

    for (const child of children) {
      const { products, ...childData } = child
      const childCat = await prisma.category.create({
        data: {
          ...childData,
          groupNumber: parentCat.groupNumber,
          parentId: parentCat.id,
        },
      })
      totalCategories++

      for (let i = 0; i < products.length; i++) {
        await prisma.product.create({
          data: {
            ...products[i],
            categoryId: childCat.id,
            order: i,
          },
        })
        totalProducts++
      }
    }
  }

  console.log(`✅ ${totalCategories} kategori oluşturuldu (7 ana + alt kategoriler)`)
  console.log(`✅ ${totalProducts} ürün oluşturuldu`)
  console.log('🎉 Seed tamamlandı!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
