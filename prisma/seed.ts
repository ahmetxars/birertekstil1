import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = [
    {
      groupNumber: 1,
      name: 'Nevresim Takımları',
      slug: 'nevresim-takimlari',
      description: 'Yüksek kaliteli pamuk ve pamuk saten nevresim takımları. Farklı desen ve renk seçenekleri ile yatak odanıza şıklık katın.',
      order: 1,
    },
    {
      groupNumber: 2,
      name: 'Pike Takımları',
      slug: 'pike-takimlari',
      description: 'Yaz ayları için hafif ve serin pike takımları. Pamuk ve keten karışımlı seçenekler mevcuttur.',
      order: 2,
    },
    {
      groupNumber: 3,
      name: 'İpek Ürünler',
      slug: 'ipek-urunler',
      description: 'Doğal ipekten üretilen lüks yatak örtüleri ve yastık kılıfları. Zarif ve şık tasarımlar.',
      order: 3,
    },
    {
      groupNumber: 4,
      name: 'Bez ve Battaniye',
      slug: 'bez-ve-battaniye',
      description: 'Soğuk kış günleri için sıcak tutan kaliteli battaniye ve bezler. Pamuklu ve yünlü seçenekler.',
      order: 4,
    },
    {
      groupNumber: 5,
      name: 'Kapitone Ürünler',
      slug: 'kapitone-urunler',
      description: 'Kapitone yatak örtüleri, yastıklar ve alezler. Konforlu ve dayanıklı ürünler.',
      order: 5,
    },
    {
      groupNumber: 6,
      name: 'Yatak Örtüleri',
      slug: 'yatak-ortuleri',
      description: 'Çeşitli kumaş ve desenlerde yatak örtüleri. Yatak odanıza dekoratif dokunuş.',
      order: 6,
    },
    {
      groupNumber: 7,
      name: 'Banyo Tekstili',
      slug: 'banyo-tekstili',
      description: 'Havlu, bornoz ve banyo takımları. Yüksek emicilik ve yumuşak dokunuş.',
      order: 7,
    },
    {
      groupNumber: 8,
      name: 'Masa Örtüleri',
      slug: 'masa-ortuleri',
      description: 'Örgü, dantel ve kumaş masa örtüleri. Şık sofra düzenlemeleri için ideal.',
      order: 8,
    },
  ]

  const createdCategories = []
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
    createdCategories.push(created)
  }

  // Create products for each category
  const products = [
    // Nevresim Takımları (1)
    {
      name: 'Royal Pamuk Saten Nevresim Takımı',
      description: '100% uzun elyaf pamuk saten kumaştan üretilmiştir. 300 iplik sayısı ile son derece yumuşak ve dayanıklıdır. Lüks otel konforunu evinize taşır.',
      image: '/uploads/products/royal-pamuk-saten.jpg',
      categoryId: createdCategories[0].id,
      featured: true,
      order: 1,
    },
    {
      name: 'Akfil Premium Nevresim Takımı',
      description: 'Geleneksel akfil dokuma tekniği ile üretilmiştir. Doğal nefes alan yapı, antialerjik özellik. Sağlıklı ve konforlu uyku deneyimi.',
      image: '/uploads/products/akfil-premium.jpg',
      categoryId: createdCategories[0].id,
      featured: true,
      order: 2,
    },
    {
      name: 'Keten Karışım Nevresim Takımı',
      description: 'Doğal keten ve pamuk karışımı kumaş. Ferah ve serin tutar. Özel günler için hediye kutusu seçeneği mevcuttur.',
      image: '/uploads/products/keten-karisim.jpg',
      categoryId: createdCategories[0].id,
      featured: false,
      order: 3,
    },
    {
      name: 'Jakarlı Desenli Nevresim Seti',
      description: 'Zarif jakar desenli nevresim takımı. 200 iplik sayısı, kolay ütüleme özelliği. Çift ve tek kişilik seçenekler.',
      image: '/uploads/products/jakarli-nevresim.jpg',
      categoryId: createdCategories[0].id,
      featured: false,
      order: 4,
    },

    // Pike Takımları (2)
    {
      name: 'Saten Pike Takımı - Lale Desen',
      description: 'Yumuşak saten dokumalı pike takımı. Geleneksel lale motifleri ile süslenmiştir. Yaz mevsimi için ideal.',
      image: '/uploads/products/saten-pike-lale.jpg',
      categoryId: createdCategories[1].id,
      featured: true,
      order: 1,
    },
    {
      name: 'Pamuk Pike Takımı - Çiçek Motifli',
      description: '100% pamuktan üretilmiş, hafif ve serin pike takımı. Renkli çiçek desenleri ile canlı bir görünüm.',
      image: '/uploads/products/pamuk-pike-cicek.jpg',
      categoryId: createdCategories[1].id,
      featured: false,
      order: 2,
    },
    {
      name: 'Keten Pike Takımı - Naturel',
      description: 'Doğal keten kumaştan üretilmiş, ferah ve şık pike takımı. Naturel renk seçenekleri.',
      image: '/uploads/products/keten-pike-naturel.jpg',
      categoryId: createdCategories[1].id,
      featured: false,
      order: 3,
    },

    // İpek Ürünler (3)
    {
      name: 'Doğal İpek Yatak Örtüsü',
      description: 'Saf doğal ipekten üretilmiş lüks yatak örtüsü. El işçiliği ile süslenmiş, özel dikim detayları.',
      image: '/uploads/products/ipek-yatak-ortusu.jpg',
      categoryId: createdCategories[2].id,
      featured: true,
      order: 1,
    },
    {
      name: 'İpek Yastık Kılıfı Seti',
      description: 'Saf ipekten üretilmiş yastık kılıfları. Cilt dostu, anti-alerjik özellik. 2 adet set halinde.',
      image: '/uploads/products/ipek-yastik-kilifi.jpg',
      categoryId: createdCategories[2].id,
      featured: false,
      order: 2,
    },

    // Bez ve Battaniye (4)
    {
      name: 'Pamuklu Bez Battaniye - Bej',
      description: 'Kaliteli pamuktan üretilmiş, sıcak tutan bez battaniye. Bej rengi ile her odaya uyum sağlar.',
      image: '/uploads/products/pamuklu-bez-battaniye.jpg',
      categoryId: createdCategories[3].id,
      featured: true,
      order: 1,
    },
    {
      name: 'Yünlü Kış Battaniyesi',
      description: 'Doğal yün karışımlı, ekstra sıcak kış battaniyesi. Ağır ve yumuşak dokunuş. Kış ayları için ideal.',
      image: '/uploads/products/yunlu-battaniye.jpg',
      categoryId: createdCategories[3].id,
      featured: false,
      order: 2,
    },
    {
      name: 'Bez Çarşaf Seti',
      description: 'Kaliteli bez kumaştan üretilmiş çarşaf seti. Üst çarşaf ve alt çarşaf dahil. Kolay ütüleme.',
      image: '/uploads/products/bez-carsaf-seti.jpg',
      categoryId: createdCategories[3].id,
      featured: false,
      order: 3,
    },

    // Kapitone Ürünler (5)
    {
      name: 'Kapito Yatak Örtüsü - Krem',
      description: 'Krem rengi kapito yatak örtüsü. İç dolgulu, sıcak ve yumuşak. Dökümlü tasarım.',
      image: '/uploads/products/kapito-yatak-ortusu-krem.jpg',
      categoryId: createdCategories[4].id,
      featured: true,
      order: 1,
    },
    {
      name: 'Kapitone Alez - Su Geçirmez',
      description: 'Su geçirmez kapitone alez. Hijyenik koruma sağlar. Yatak boyutlarına göre seçenekler mevcut.',
      image: '/uploads/products/kapitone-alez.jpg',
      categoryId: createdCategories[4].id,
      featured: false,
      order: 2,
    },

    // Yatak Örtüleri (6)
    {
      name: 'Çiçek Desenli Yatak Örtüsü',
      description: 'Zarif çiçek desenleriyle süslenmiş yatak örtüsü. Kumaş kalitesi üst düzey, kolay bakım.',
      image: '/uploads/products/cicek-yatak-ortusu.jpg',
      categoryId: createdCategories[5].id,
      featured: false,
      order: 1,
    },
    {
      name: 'Dantel Kenarlı Yatak Örtüsü',
      description: 'El yapımı dantel kenar detaylı yatak örtüsü. Vintage görünüm, premium kumaş.',
      image: '/uploads/products/dantel-yatak-ortusu.jpg',
      categoryId: createdCategories[5].id,
      featured: false,
      order: 2,
    },

    // Banyo Tekstili (7)
    {
      name: 'Pamuklu Havlu Takımı - 6 Parça',
      description: '100% pamuk, yüksek emicilikli havlu takımı. Banyo havlusu, el havlusu ve yüz havlusu dahil.',
      image: '/uploads/products/pamuklu-havlu-takimi.jpg',
      categoryId: createdCategories[6].id,
      featured: true,
      order: 1,
    },
    {
      name: 'Bornoz - Pamuklu Kaban',
      description: 'Yumuşak pamuklu bornoz. Bel kuşağı ve cep detayı. Oteller için de ideal.',
      image: '/uploads/products/bornoz.jpg',
      categoryId: createdCategories[6].id,
      featured: false,
      order: 2,
    },

    // Masa Örtüleri (8)
    {
      name: 'Örgü Masa Örtüsü - Yuvarlak',
      description: 'El örgüsü yuvarlak masa örtüsü. Zarif desenler, doğal iplik. Özel sipariş boyutları mevcut.',
      image: '/uploads/products/orgu-masa-ortusu.jpg',
      categoryId: createdCategories[7].id,
      featured: false,
      order: 1,
    },
    {
      name: 'Ketem Masa Örtüsü - Dikdörtgen',
      description: 'Kaliteli keten kumaştan dikdörtgen masa örtüsü. Şık ve zarif görünüm. Kolay ütüleme.',
      image: '/uploads/products/ketem-masa-ortusu.jpg',
      categoryId: createdCategories[7].id,
      featured: false,
      order: 2,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: `${product.categoryId}-${product.order}` },
      update: product,
      create: { id: `${product.categoryId}-${product.order}`, ...product },
    })
  }

  console.log('✅ Seed completed successfully!')
  console.log(`Created ${createdCategories.length} categories and ${products.length} products`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
