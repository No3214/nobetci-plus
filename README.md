# Eczane+

Eczane+ (Nöbetçi+), Türkiye genelindeki nöbetçi eczaneleri en hızlı, reklamsız ve sade biçimde kullanıcıya sunmayı hedefleyen modern bir web uygulamasıdır.

## Ürün Vizyonu
Geleneksel nöbetçi eczane bulma süreçleri karmaşık reklamlar, yavaş yüklenen haritalar ve güvensiz tasarımlarla doludur. Eczane+, "Acil Rota Ekranı" felsefesiyle tasarlanmıştır.

- **Sade ve Reklamsız:** İlaç/indirim satışına değil, kullanıcının eczaneye en hızlı şekilde ulaşmasına odaklanır.
- **Modüler Sağlayıcı Mimarisi:** İzmir Açık Veri Portalı, CollectAPI, Supabase ve Mock Data katmanları sayesinde hiçbir zaman boş ekran göstermez. En güvenilir kaynaktan veri çeker.
- **Hızlı UX:** Kullanıcı cihazından aldığı konumla anında en yakın 3 eczaneyi gösterir. İstenirse Türkiye geneli il/ilçe seçimi sunar.

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18+)
- npm veya yarn

### Adımlar

1. Depoyu klonlayın ve bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Environment değişkenlerini ayarlayın:
   `.env.example` dosyasını kopyalayarak `.env.local` oluşturun.
   ```bash
   cp .env.example .env.local
   ```
   *Not: Uygulama API anahtarları eksik olsa dahi `MockProvider` ile demo veriler üzerinden çalışmaya devam eder.*

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## Mimari Yapı

Veri sağlayıcı (Provider) mimarisi `lib/providers/` altında bulunur:
1. `IzmirProvider` (Öncelik: 10) - Resmi İzmir Büyükşehir verisi.
2. `CollectApiProvider` (Öncelik: 20) - Ticari tüm Türkiye verisi (Anahtar gerektirir).
3. `SupabaseProvider` (Öncelik: 30) - Önbelleğe alınmış/yedeklenmiş veritabanı verisi.
4. `MockProvider` (Öncelik: 100) - Fallback demo verisi.

## Güvenlik
- API Raporlama Endpointleri (`/api/reports`) sıkı kimlik doğrulamasına (`ADMIN_SECRET_KEY`) sahiptir. Key olmadan endpoint çalışmaz ve 500 döner.
- Kullanıcıların konum verisi hiçbir şekilde uzak sunucularda saklanmaz, açık rıza ile hata bildirimine eklenir.

## SEO
Dinamik rotalar ile `/[city]/nobetci-eczane` sayfası SEO dostu linkleme yapısına imkan sağlar.

---
Mevcut kod standartlarını geliştirmeye yönelik her türlü katkıya (PR) açığız.
