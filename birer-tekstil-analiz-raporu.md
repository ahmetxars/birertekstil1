# Birer Tekstil Projesi Analiz ve Strateji Raporu

**Hazırlayan:** Manus AI  
**Tarih:** 14 Nisan 2026  

## 1. Proje İncelemesi ve Mevcut Durum

Birer Tekstil için hazırlanan e-ticaret ve katalog sitesi teknik altyapı olarak modern ve güçlü bir temele sahiptir. Sistem Next.js 16, React 19, TypeScript ve TailwindCSS kullanılarak inşa edilmiştir. Veritabanı olarak yerel dosya tabanlı SQLite tercih edilmiş olup, veri yönetimi Prisma ORM üzerinden sağlanmaktadır. Tasarım dili olarak sıcak toprak tonları kullanılmış ve WhatsApp entegrasyonu başarıyla sisteme dahil edilmiştir.

Sitenin ön yüzünde dinamik bir hero animasyonu, istatistikler bölümü, kategoriler ve öne çıkan ürünler listelenmektedir. Yönetim arayüzü ise beş ana sekmeden (Gösterge Paneli, Ürünler, Kategoriler, İçerik, Ayarlar) oluşan kapsamlı bir admin paneline sahiptir. Ancak, bu panelin işlevselliği konusunda bazı kritik bulgular tespit edilmiştir.

### Kritik Bulgu: Yönetim Paneli ve Gerçek Site Bağlantısı

Yönetim panelindeki "İçerik" ve "Ayarlar" sekmelerinde yer alan veriler şu anda sitenin ön yüzünde kullanılmamaktadır. Sitenin birçok yerinde metinler ve iletişim bilgileri statik (hardcoded) olarak kodlanmıştır.

Aşağıdaki tabloda, admin panelinde düzenlenebilir gibi görünen ancak aslında koda gömülü olan alanlar özetlenmiştir:

| Alan Adı | Dosya Konumu | Mevcut Durum | Admin Panel Etkisi |
| :--- | :--- | :--- | :--- |
| Hero Başlığı | `HeroSection.tsx` | Sabit metin ("Birer Tekstil İstanbul") | Etkisiz |
| Telefon Numarası | `ContactSection.tsx`, `Footer.tsx`, vb. | Sabit numara (+905332423665) | Etkisiz |
| SEO Başlık ve Açıklamaları | `layout.tsx` | Sabit metin ("Birer Tekstil İstanbul | Ev Tekstili...") | Etkisiz |
| Kategori Arka Planları | `CategoriesSection.tsx` | Sabit Unsplash URL'leri | Etkisiz |

Bu durum, kodlama bilmeyen bir müşterinin siteyi devraldıktan sonra içerik güncellemelerini yapamamasına neden olacaktır. Satış öncesinde bu verilerin veritabanından okunacak şekilde dinamik hale getirilmesi kesinlikle gereklidir.

## 2. SEO ve Domain Stratejisi

"Birer Tekstil" aramalarında sitenizin üst sıralarda çıkması için doğru domain seçimi ve güçlü bir SEO stratejisi uygulamak şarttır. Şu anda projede temel düzeyde SEO ayarları (robots.txt, temel meta etiketler) bulunsa da, rekabetçi bir arama performansı için bu yapı geliştirilmelidir.

### Domain Seçimi

Domain seçimi marka bilinirliği ve arama motoru optimizasyonu açısından kritik bir karardır. Proje için önerilen yaklaşım, markayı merkeze alan bir domain seçimidir.

**Önerilen Domain Yaklaşımları:**

1. **Marka Odaklı Domain (Önerilen):** `birertekstil.com` veya `birertekstil.com.tr` kullanımı, markalaşma açısından en güçlü seçenektir. Arama motorları, doğrudan marka adını içeren domainleri marka aramalarında önceliklendirir.
2. **Anahtar Kelime Odaklı Domain:** `evtekstilistanbul.com` gibi domainler sektörel aramalarda avantaj sağlasa da, "Birer Tekstil" markasını arayan kullanıcılar için güvenilirlik sorunları yaratabilir.
3. **Hibrit Yaklaşım:** Ana domain olarak `birertekstil.com` kullanılıp, sektörel aramalar için alınan ikincil domainlerin (örn. `tekstiltoptan.com`) ana siteye yönlendirilmesi stratejisi uygulanabilir.

### "Birer Tekstil" Aramasında Çıkmak İçin SEO Adımları

Sitenin normal bir satış/katalog sitesi olması ve blog içermemesi SEO açısından bir engel değildir. E-ticaret ve kurumsal siteler için uygulanan yerel ve teknik SEO stratejileri ile başarılı sonuçlar elde edilebilir.

Öncelikle, Google Business Profile (Google Benim İşletmem) kaydı oluşturulmalı ve işletmenin İstanbul'daki fiziksel adresi doğrulanmalıdır. Bu adım, bölgesel aramalarda ve marka aramalarında sağ tarafta çıkan bilgi panelinin (Knowledge Panel) oluşmasını sağlayacaktır.

Site içi SEO (On-Page SEO) açısından, ana sayfadaki H1 etiketinin ve başlık etiketlerinin (Title Tags) marka adını ve temel anahtar kelimeleri içerecek şekilde düzenlenmesi gerekmektedir. Şu anda `layout.tsx` dosyasında bulunan statik meta etiketlerin, her sayfa için özel olarak dinamik üretilecek şekilde yapılandırılması arama motoru botlarının siteyi daha iyi anlamasını sağlayacaktır.

Teknik SEO tarafında ise, arama motorlarının siteyi eksiksiz tarayabilmesi için bir `sitemap.xml` dosyası oluşturulmalıdır. Ayrıca, ürünler ve işletme bilgileri için Schema.org (Structured Data) işaretlemelerinin eklenmesi, Google'ın ürün fiyatlarını, stok durumlarını ve işletme detaylarını arama sonuçlarında zengin snippet'ler olarak göstermesine olanak tanır.

## 3. Müşteri Yönetimi ve Satış Stratejisi

Siteyi kodlama bilmeyen bir müşteriye satacağınız için, sistemin tamamen kullanıcı dostu ve güvenli olması büyük önem taşımaktadır.

### Satış Öncesi Kritik Düzenlemeler

Sistemi teslim etmeden önce çözülmesi gereken en acil konu, yönetim panelinin güvenliğidir. Şu anda admin paneline erişim herhangi bir şifreleme veya yetkilendirme mekanizması olmadan açıktır. NextAuth veya benzeri bir kimlik doğrulama sistemi entegre edilerek panele yetkisiz erişimler engellenmelidir.

Bununla birlikte, daha önce belirtildiği gibi, "İçerik" ve "Ayarlar" sekmelerindeki verilerin sitenin ön yüzüne bağlanması işlemi tamamlanmalıdır. Müşteri, WhatsApp numarasını veya site başlığını değiştirmek istediğinde bunu panel üzerinden sorunsuzca yapabilmelidir.

### Fiyatlandırma ve Destek

Projenin mevcut özellikleri (özel tasarım, yönetim paneli, WhatsApp entegrasyonu, ürün yönetimi) göz önüne alındığında, satış için katmanlı bir fiyatlandırma stratejisi sunulabilir. Sadece kaynak kodların teslim edildiği temel bir paket, domain ve bir yıllık hosting hizmetinin dahil edildiği profesyonel bir paket ve belirli bir süre teknik desteğin de eklendiği premium bir paket oluşturulabilir.

Müşterinin kodlama bilmemesi nedeniyle, yönetim panelinin nasıl kullanılacağını anlatan kısa bir eğitim videosu veya ekran görüntüleri içeren bir PDF kılavuzu hazırlamak, satış sonrası müşteri memnuniyetini artıracak ve size gelecek destek taleplerini azaltacaktır. Ayrıca, SQLite veritabanı dosyasının düzenli olarak yedeklenmesi için basit bir prosedür belirlenmeli ve müşteriye aktarılmalıdır.

## 4. Sonuç ve Eylem Planı

Birer Tekstil projesi görsel ve işlevsel olarak başarılı bir noktadadır. Satışa hazır hale gelmesi için temel olarak veri bağlama eksikliklerinin giderilmesi ve güvenlik önlemlerinin alınması gerekmektedir. Domain olarak markayı yansıtan `birertekstil.com` tercih edilmeli ve Google İşletme kaydı ile desteklenmelidir.

Bu adımlar tamamlandığında, arkadaşınız veya herhangi bir müşteri için, ürünlerini kolayca sergileyebileceği, WhatsApp üzerinden sipariş alabileceği ve tamamen kendi yönetebileceği profesyonel bir e-ticaret platformu ortaya çıkmış olacaktır.
