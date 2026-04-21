export interface SeedProduct {
  name: string
  description: string
  image?: string
  featured?: boolean
}

export interface SeedCategoryNode {
  groupNumber: number
  name: string
  slug: string
  description: string
  order: number
  products?: SeedProduct[]
  children?: Array<{
    name: string
    slug: string
    description: string
    order: number
    products?: SeedProduct[]
  }>
}

export const DEFAULT_CATEGORY_TREE: SeedCategoryNode[] = [
  {
    groupNumber: 1,
    name: '%100 Pamuk Nevresim Çeşitleri',
    slug: '100-pamuk-nevresim-cesitleri',
    description: 'Pamuk bazlı nevresim ve saten gruplarını bir araya getiren ana kategori.',
    order: 1,
    children: [
      {
        name: 'Pamuk Saten',
        slug: 'pamuk-saten',
        description: 'Yumuşak dokulu ve parlak yüzeyli pamuk saten ürünleri.',
        order: 1,
        products: [
          {
            name: 'Premium Pamuk Saten',
            description: 'Yüksek kaliteli pamuk saten kumaş. Yumuşak dokusu ve parlak görünümü ile öne çıkar.',
            image: '/uploads/products/pamuk-saten-1.jpg',
            featured: true,
          },
        ],
      },
      {
        name: 'Akfil',
        slug: 'akfil',
        description: 'İnce ve hafif yapısıyla öne çıkan akfil kumaş grubu.',
        order: 2,
        products: [
          {
            name: 'Akfil Kumaş',
            description: 'Mevsimlik kullanım için tercih edilen hafif ve doğal akfil kumaşı.',
            image: '/uploads/products/akfil-1.jpg',
          },
        ],
      },
      {
        name: 'Çizgili Pamuk Saten',
        slug: 'cizgili-pamuk-saten',
        description: 'Çizgili desenli pamuk saten nevresim ürünleri.',
        order: 3,
        products: [
          {
            name: 'Çizgili Pamuk Saten',
            description: 'Şık çizgili yüzeyiyle öne çıkan pamuk saten ürün grubu.',
            image: '/uploads/products/cizgili-pamuk-saten-1.jpg',
            featured: true,
          },
        ],
      },
    ],
  },
  {
    groupNumber: 2,
    name: 'Pike ve Yatak Örtüsü Çeşitleri',
    slug: 'pike-ve-yatak-ortusu-cesitleri',
    description: 'Klasik pike ve yatak örtüsü gruplarını kapsayan ana kategori.',
    order: 2,
    children: [
      {
        name: 'Şönil Pike',
        slug: 'sonil-pike',
        description: 'Yumuşak ve gösterişli şönil pike seçenekleri.',
        order: 1,
        products: [
          {
            name: 'Şönil Pike',
            description: 'Yumuşak dokusu ile yatak örtüsü ve pike kullanımına uygundur.',
            image: '/uploads/products/sonil-pike-1.jpg',
          },
        ],
      },
      {
        name: 'Limi Pike',
        slug: 'limi-pike',
        description: 'Hafif ve ferah yapılı limi pike grubu.',
        order: 2,
        products: [
          {
            name: 'Limi Pike',
            description: 'Hafif yapısıyla yaz aylarında tercih edilen pike modeli.',
            image: '/uploads/products/limi-pike-1.jpg',
          },
        ],
      },
      {
        name: 'Hera Pike',
        slug: 'hera-pike',
        description: 'Dayanıklı dokusu ile öne çıkan Hera pike ürünleri.',
        order: 3,
        products: [
          {
            name: 'Hera Pike',
            description: 'Güçlü doku ve şık görünüm sunan Hera pike seçeneği.',
            image: '/uploads/products/hera-pike-1.jpg',
            featured: true,
          },
        ],
      },
    ],
  },
  {
    groupNumber: 3,
    name: 'Pamuk Pike Yatak Örtüsü Çeşitleri',
    slug: 'pamuk-pike-yatak-ortusu-cesitleri',
    description: 'Pamuk bazlı çizgili ve desenli pike alt grupları.',
    order: 3,
    children: [
      {
        name: 'Çizgili Pike',
        slug: 'cizgili-pike',
        description: 'Pamuk pike çizgili modelleri.',
        order: 1,
        products: [
          {
            name: 'Çizgili Pamuk Pike',
            description: 'Zamansız çizgi deseniyle pamuk pike grubu.',
            image: '/uploads/products/cizgili-pamuk-pike-1.jpg',
          },
        ],
      },
      {
        name: 'Baklava Dilim Pike',
        slug: 'baklava-dilim-pike',
        description: 'Baklava desenli pike ve yatak örtüsü ürünleri.',
        order: 2,
        products: [
          {
            name: 'Çizgili Baklava Pike',
            description: 'Baklava desenli yüzeyiyle dikkat çeken pike modeli.',
            image: '/uploads/products/cizgili-baklava-pike-1.jpg',
            featured: true,
          },
        ],
      },
      {
        name: 'Örgü Pike',
        slug: 'orgu-pike',
        description: 'Örgü görünümlü pike ve yatak örtüsü ürünleri.',
        order: 3,
        products: [
          {
            name: 'Örgü Pike',
            description: 'El örgüsü görünümü ile dekoratif pike seçeneği.',
            image: '/uploads/products/orgu-pike-1.jpg',
          },
        ],
      },
    ],
  },
  {
    groupNumber: 4,
    name: 'Masa Örtülük Keten Çeşitleri',
    slug: 'masa-ortuluk-keten-cesitleri',
    description: 'Masa örtüsü ve dekoratif kullanım için keten tabanlı ana kategori.',
    order: 4,
    children: [
      {
        name: 'Gardenya',
        slug: 'gardenya',
        description: 'Dekoratif kullanım için gardenya desenli keten grubu.',
        order: 1,
        products: [
          {
            name: 'Gardenya Kumaş',
            description: 'Masa örtüsü ve dekoratif kullanım için gardenya desenli keten.',
            image: '/uploads/products/gardenya-1.jpg',
          },
        ],
      },
      {
        name: 'İsviçre Keteni',
        slug: 'isvicre-keteni',
        description: 'Daha rafine dokulu masa örtülük İsviçre keteni.',
        order: 2,
        products: [
          {
            name: 'İsviçre Keteni',
            description: 'İnce dokulu ve şık görünümlü İsviçre keteni.',
            image: '/uploads/products/linen-1.jpg',
          },
        ],
      },
      {
        name: 'Nicea Keten',
        slug: 'nicea-keten',
        description: 'Dayanıklı ve dekoratif Nicea keten grubu.',
        order: 3,
        products: [
          {
            name: 'Nicea Keten',
            description: 'Masa örtülük ve çok amaçlı kullanım için Nicea keteni.',
            image: '/uploads/products/nicea-keten-1.jpg',
          },
        ],
      },
      {
        name: 'Linen',
        slug: 'linen',
        description: 'Doğal keten hissi sunan linen ürünleri.',
        order: 4,
        products: [
          {
            name: 'Linen Kumaş',
            description: 'Doğal görünümlü ve nefes alan linen grubu.',
            image: '/uploads/products/linen-1.jpg',
            featured: true,
          },
        ],
      },
      {
        name: 'Fay',
        slug: 'fay',
        description: 'Temiz ve ferah dokulu fay ürün grubu.',
        order: 5,
        products: [
          {
            name: 'Fay Kumaş',
            description: 'Masa örtüsü ve mutfak kullanımı için fay kumaş.',
            image: '/uploads/products/fay-1.jpg',
          },
        ],
      },
      {
        name: 'Nazende',
        slug: 'nazende',
        description: 'Şık sunumlar için dekoratif keten alternatifi.',
        order: 6,
        products: [
          {
            name: 'Nazende Keten',
            description: 'Özel sunumlar için dekoratif görünümlü nazende keten.',
            image: '/uploads/products/gardenya-1.jpg',
          },
        ],
      },
    ],
  },
  {
    groupNumber: 5,
    name: 'Desenli Nevresim Çeşitleri',
    slug: 'desenli-nevresim-cesitleri',
    description: 'Desenli ve dijital baskılı nevresim alt kategorileri.',
    order: 5,
    children: [
      {
        name: '3D Dijital Nevresim',
        slug: '3d-dijital-nevresim',
        description: 'Canlı baskılı dijital nevresim ürünleri.',
        order: 1,
        products: [
          {
            name: '3D Dijital Nevresim',
            description: 'Canlı renkli dijital baskı nevresim grubu.',
            image: '/uploads/products/3d-dijital-nevresim-1.jpg',
            featured: true,
          },
        ],
      },
      {
        name: '%100 Pamuk Desenli Nevresim',
        slug: '100-pamuk-desenli-nevresim',
        description: 'Pamuk bazlı desenli nevresim ürünleri.',
        order: 2,
        products: [
          {
            name: '%100 Pamuk Desenli Nevresim',
            description: 'Pamuk dokulu ve desenli nevresim takımı seçeneği.',
            image: '/uploads/products/desenli-nevresim-1.jpg',
            featured: true,
          },
        ],
      },
    ],
  },
  {
    groupNumber: 6,
    name: 'Bohça, Seccade ve Gamboç Çeşitleri',
    slug: 'bohca-seccade-gamboc-cesitleri',
    description: 'Özel kullanım ve dekoratif amaçlı ürün grupları.',
    order: 6,
    children: [
      {
        name: 'Osmanlı İpeği',
        slug: 'osmanli-ipegi',
        description: 'Bohça ve özel kullanım için Osmanlı ipeği ürün grubu.',
        order: 1,
        products: [
          {
            name: 'Osmanlı İpeği',
            description: 'Özel gün bohça ve dekoratif kullanım için gösterişli dokuma.',
            image: '/uploads/products/osmanli-ipegi-1.jpg',
            featured: true,
          },
        ],
      },
      {
        name: 'Monoray',
        slug: 'monoray',
        description: 'Seccade ve dekoratif kullanım için monoray ürünleri.',
        order: 2,
        products: [
          {
            name: 'Monoray Kumaş',
            description: 'Parlak yüzeyi ile özel kullanım alanlarına uygun monoray kumaş.',
            image: '/uploads/products/monoray-1.jpg',
          },
        ],
      },
    ],
  },
  {
    groupNumber: 7,
    name: 'Poly Saten Kumaş Çeşitleri',
    slug: 'poly-saten-kumas-cesitleri',
    description: 'Parlak ve mat yüzeyli poly saten alt grupları.',
    order: 7,
    children: [
      {
        name: 'Parlak Saten',
        slug: 'parlak-saten',
        description: 'Parlak yüzeyli poly saten kumaş ürünleri.',
        order: 1,
        products: [
          {
            name: 'Parlak Saten',
            description: 'Parlak yüzeyi ile dikkat çeken poly saten ürün grubu.',
            image: '/uploads/products/monoray-1.jpg',
          },
        ],
      },
      {
        name: 'Mat Saten',
        slug: 'mat-saten',
        description: 'Daha sakin görünüm sunan mat saten kumaşlar.',
        order: 2,
        products: [
          {
            name: 'Mat Saten',
            description: 'Mat yüzeyi ile sade ve şık kullanım sunan saten grubu.',
            image: '/uploads/products/pamuk-saten-1.jpg',
          },
        ],
      },
    ],
  },
  {
    groupNumber: 8,
    name: 'Sofra Bezi ve Mutfak Takımları',
    slug: 'sofra-bezi-ve-mutfak-takimlari',
    description: 'Mutfak ve sofra düzenine yönelik kumaş alt kategorileri.',
    order: 8,
    children: [
      {
        name: 'Düz Renk Duck',
        slug: 'duz-renk-duck',
        description: 'Sade renkli duck kumaş mutfak ve sofra grubu.',
        order: 1,
        products: [
          {
            name: 'Düz Renk Duck',
            description: 'Sofra bezi ve mutfak takımlarında kullanılabilecek düz renk duck kumaş.',
            image: '/uploads/products/duck-bezi-1.jpg',
          },
        ],
      },
      {
        name: 'Desenli Duck Bezi',
        slug: 'desenli-duck-bezi',
        description: 'Desenli yüzeyli duck bezi ürünleri.',
        order: 2,
        products: [
          {
            name: 'Desenli Duck Bezi',
            description: 'Desenli sunumlar için duck bezi seçeneği.',
            image: '/uploads/products/duck-bezi-1.jpg',
          },
        ],
      },
    ],
  },
  {
    groupNumber: 9,
    name: 'Hurç ve Dolap içi Örtüsü',
    slug: 'hurc-ve-dolap-ici-ortusu',
    description: 'Hurç ve dolap içi kullanım için kapitone alt grupları.',
    order: 9,
    children: [
      {
        name: 'Kapitone 70gr Yerli Saten',
        slug: 'kapitone-70gr-yerli-saten',
        description: 'Hurç ve dolap içi örtü kullanımına uygun yerli saten kapitone.',
        order: 1,
        products: [
          {
            name: 'Kapitone 70gr Yerli Saten',
            description: 'Dolap içi örtü ve hurç için hafif gramajlı kapitone saten.',
            image: '/uploads/products/kapitone-1.jpg',
          },
        ],
      },
      {
        name: 'Kapitone 120gr İthal Saten',
        slug: 'kapitone-120gr-ithal-saten',
        description: 'Daha yoğun yapılı ithal saten kapitone grubu.',
        order: 2,
        products: [
          {
            name: 'Kapitone 120gr İthal Saten',
            description: 'Daha dolgun yapı isteyen kullanım alanları için ithal saten kapitone.',
            image: '/uploads/products/kapitone-1.jpg',
          },
        ],
      },
    ],
  },
  {
    groupNumber: 10,
    name: 'Tül Çeşitleri',
    slug: 'tul-cesitleri',
    description: 'Tül ve markizet ürün gruplarını kapsayan ana kategori.',
    order: 10,
    children: [
      {
        name: 'Ankara Tülü (Markizet)',
        slug: 'ankara-tulu-markizet',
        description: 'İnce ve hafif yapılı tül grubu.',
        order: 1,
        products: [
          {
            name: 'Ankara Tülü (Markizet)',
            description: 'Şeffaf ve hafif yapısıyla tül kullanımına uygun markizet.',
            image: '/uploads/products/markizet-1.jpg',
          },
        ],
      },
    ],
  },
  {
    groupNumber: 11,
    name: 'Elyaf 150gr',
    slug: 'elyaf-150gr',
    description: 'Dolgu ve yardımcı malzeme olarak kullanılan elyaf grubu.',
    order: 11,
    products: [
      {
        name: 'Elyaf 150gr',
        description: 'Yorgan, yastık ve tekstil destek ürünlerinde kullanılabilecek 150gr elyaf.',
        image: '/uploads/products/elyaf-1.jpg',
      },
    ],
  },
]
