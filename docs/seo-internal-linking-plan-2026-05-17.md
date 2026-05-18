# P0-1 — Blog internal linking uygulama planı

**Tarih:** 17 Mayıs 2026
**Bağlı rapor:** `docs/seo-audit-2026-05-17.md`
**Hedef:** 130 blog yazısını pillar-cluster yapısına bağla, internal link sayısını 0'dan ~600+'e çıkar

---

## Strateji

**Pillar-cluster modeli:**
- Her ana konu için 1 pillar yazı
- Her cluster yazısı → pillar'a 1 link
- Pillar yazısı → tüm cluster'lara link (ilgili yazılar bölümü değil, doğal in-content)
- Cluster yazıları aralarında → yakın komşulara 1-2 link

**Hedef link sayısı:**
- Her cluster yazısı: 3 internal link (1 pillar + 2 komşu cluster)
- Her pillar yazısı: 8-15 internal link (cluster'lara)
- Site geneli: ~500-600 yeni internal link

---

## 10 Pillar haritası

| # | Pillar | Cluster sayısı | Aksiyon |
|---|---|---|---|
| 1 | `trendyol-listing-nasil-yazilir` | 15 | İçeriği zenginleştir + linkle |
| 2 | `amazon-a9-algoritmasi` | 14 | İçeriği zenginleştir + linkle |
| 3 | `hepsiburada-katalog-ve-listing-kurallari` | 7 | Pillar haline getir |
| 4 | `etsy-satis-baslangic-rehberi-2026` | 7 | Pillar haline getir |
| 5 | `n11-satis-rehberi-magaza-puani-ve-listing` | 2 | Cluster zayıf — daha çok n11 yazısı gerek (BLOG-02'de N11 65char title var) |
| 6 | `ciceksepeti-satici-magaza-acma-rehberi` | 0 | Cluster yok — yeni cluster yazıları gerek |
| 7 | `e-ticaret-icin-ai-urun-fotografciligi` | 6 | Pillar haline getir |
| 8 | `ai-urun-videosu-hareket-secenekleri` | 1 | Cluster çok zayıf |
| 9 | `sosyal-medya-urun-tanitimi-instagram-tiktok-stratejileri` | 23 | Büyük pillar, organizasyon önemli |
| 10 | `e-ticaret-seo-anahtar-kelime-arastirma-rehberi` | 8 | Pillar haline getir |

---

## Pillar 1: Trendyol (15 cluster)

**Pillar slug:** `trendyol-listing-nasil-yazilir`
**Pillar mevcut başlık:** "Trendyol'da Satışları Artıran Listing Nasıl Yazılır? (2026 Güncel Rehber)"

**Cluster yazıları → pillar'a link verecek anchor text önerileri:**

| Cluster slug | Anchor text önerisi (in-content) |
|---|---|
| trendyol-butik-nasil-acilir | "[Trendyol'da listing nasıl yazılır rehberimizi](/blog/trendyol-listing-nasil-yazilir) okuyup gerçek bir ürün için adım adım uygulayabilirsiniz" |
| trendyol-anahtar-kelime-arastirma | "Bulduğunuz kelimeleri başlığa nasıl yerleştireceğinizi [Trendyol listing rehberinde](/blog/trendyol-listing-nasil-yazilir) anlatıyoruz" |
| trendyol-express-tex-kullanim | "Hızlı kargo etiketinin başlık üzerindeki etkisini [Trendyol listing yazma rehberinde](/blog/trendyol-listing-nasil-yazilir) bulabilirsiniz" |
| trendyol-kargo-gonderim-surecleri | "Kargo süresinin listing performansına etkisini [Trendyol listing nasıl yazılır yazımızda](/blog/trendyol-listing-nasil-yazilir) ele almıştık" |
| trendyol-reklam-optimizasyonu-rehberi | "Reklam başarısı için listing kalitesi önemli — [Trendyol listing rehberi](/blog/trendyol-listing-nasil-yazilir)" |
| trendyol-iade-yonetimi-saticilar | "İade oranını düşürmek için doğru beklenti yaratan listing yazımı: [rehberi okuyun](/blog/trendyol-listing-nasil-yazilir)" |
| trendyol-komisyon-iadesi-talep-rehberi | "Listing kalitesi komisyon talebinde de değerlendiriliyor — [Trendyol listing rehberi](/blog/trendyol-listing-nasil-yazilir)" |
| trendyol-smart-listing-akilli-urun-onerileri | "Akıllı öneriler kaliteli listing'i tercih ediyor — [yazma rehberi](/blog/trendyol-listing-nasil-yazilir)" |
| trendyol-yorum-alma-stratejileri | "Yorum almaya başlamadan önce listing temelini sağlam atın: [rehber](/blog/trendyol-listing-nasil-yazilir)" |
| marka-tescili-pazaryeri-avantajlari | "Marka tescili sonrası listing'inizi nasıl düzenleyeceğinizi [Trendyol listing rehberinde](/blog/trendyol-listing-nasil-yazilir) bulabilirsiniz" |
| cross-listing-coklu-pazaryeri-yonetimi | "Trendyol için özel kuralları [bu rehberden](/blog/trendyol-listing-nasil-yazilir) öğrenebilirsiniz" |
| yzliste-ile-ilk-listing-2-dakikada | "Manuel yazım için [Trendyol listing rehberini](/blog/trendyol-listing-nasil-yazilir) inceleyebilirsiniz" |
| trendyol-hepsiburada-amazon-karsilastirma | "Trendyol için detaylı yazım rehberi: [Trendyol listing nasıl yazılır](/blog/trendyol-listing-nasil-yazilir)" |
| trendyol-magaza-puani-ve-performans-metrikleri | "Performans metriklerini iyileştiren listing yapısı için [rehbere bakın](/blog/trendyol-listing-nasil-yazilir)" |
| trendyol-satis-artirma-seo-rehberi | "SEO'nun başlangıcı listing — [Trendyol listing rehberi](/blog/trendyol-listing-nasil-yazilir)" |

**Pillar yazısı içinden cluster'lara link (önerilen yeni bölüm):**

Pillar yazısının sonuna "Trendyol satıcıları için diğer rehberler" başlığı ekle (HTML olarak değil, doğal akış içinde):

> Trendyol'da satış yapmaya devam ettikçe karşılaşacağınız diğer konular:
> butik açma süreci için [Trendyol'da butik nasıl açılır](/blog/trendyol-butik-nasil-acilir),
> anahtar kelime stratejisi için [Trendyol anahtar kelime araştırması](/blog/trendyol-anahtar-kelime-arastirma),
> reklam yönetimi için [Trendyol reklam optimizasyonu](/blog/trendyol-reklam-optimizasyonu-rehberi),
> iade oranını düşürmek için [iade yönetimi rehberi](/blog/trendyol-iade-yonetimi-saticilar),
> mağaza puanını yükseltmek için [Trendyol mağaza puanı ve performans metrikleri](/blog/trendyol-magaza-puani-ve-performans-metrikleri).

---

## Pillar 2: Amazon (14 cluster)

**Pillar slug:** `amazon-a9-algoritmasi`

| Cluster slug | Anchor text önerisi |
|---|---|
| amazon-fba-turkiye-kullanim | "FBA + A9 birlikte çalışıyor — [A9 algoritması rehberimiz](/blog/amazon-a9-algoritmasi)" |
| amazon-brand-registry-kilavuz | "Brand registry sonrası A9'da öne çıkma için: [Amazon A9 rehberi](/blog/amazon-a9-algoritmasi)" |
| amazon-fbm-fba-karsilastirma-hangisi-uygun | "Hangi modeli seçerseniz seçin, A9 algoritmasına uygun listing şart — [rehber](/blog/amazon-a9-algoritmasi)" |
| amazon-tr-ppc-reklam-optimizasyonu | "PPC reklam organik sıralamayı besler, A9 nasıl çalışır: [rehber](/blog/amazon-a9-algoritmasi)" |
| amazon-usa-ppc-reklam-stratejisi | "ABD'de A9 nasıl çalışır: [Amazon A9 algoritması rehberi](/blog/amazon-a9-algoritmasi)" |
| amazon-turkiye-satici-olma-rehberi-2026 | "Satıcı olduktan sonra ilk yapmanız gereken: A9'a uygun listing — [rehber](/blog/amazon-a9-algoritmasi)" |
| amazon-usa-satis-rehberi-turkiye-satici | "Amerika pazarında A9 davranışı için: [Amazon A9 algoritması rehberi](/blog/amazon-a9-algoritmasi)" |
| amazon-storefront-vitrin-sayfasi-rehberi | "Storefront trafiği listing'lere yönlendiriyor — A9 hazırlığı: [rehber](/blog/amazon-a9-algoritmasi)" |
| amazonda-satis-artiran-listing-stratejileri | "Tüm stratejilerin temeli A9'u anlamak — [algoritma rehberi](/blog/amazon-a9-algoritmasi)" |
| a-plus-content-zengin-icerik-pazaryeri-rehberi | "A+ Content'in A9 üzerindeki etkisi için: [Amazon A9 rehberi](/blog/amazon-a9-algoritmasi)" |
| amazon-usa-etsy-karsilastirma-ihracat | "Amazon tarafı için A9 davranışı: [rehbere bakın](/blog/amazon-a9-algoritmasi)" |
| trendyol-hepsiburada-amazon-karsilastirma | "Amazon tarafında A9 detayları için: [Amazon A9 algoritması rehberi](/blog/amazon-a9-algoritmasi)" |
| yzliste-coklu-pazaryeri-tek-panel | "Amazon platformunun arama algoritmasını [A9 algoritması rehberinde](/blog/amazon-a9-algoritmasi) detaylandırdık" |
| ebay-turkiye-satis-rehberi | "Pazaryeri algoritmaları farklılaşır — Amazon için [A9 rehberi](/blog/amazon-a9-algoritmasi)" |

---

## Pillar 3: Hepsiburada (7 cluster)

**Pillar slug:** `hepsiburada-katalog-ve-listing-kurallari`

Cluster'lar:
- hepsiburada-one-cikan-urun-stratejisi
- hepsiburada-kampanya-yonetimi
- hepsiburada-premium-satici
- hepsiburada-reklam-butce-yonetimi
- hepsiburada-buybox-rehberi
- hepsiburada-satici-paneli-ipuclari
- pazaryeri-komisyon-oranlari-karsilastirma-2026

Her birinden pillar'a 1 link — anchor text: "Hepsiburada listing kurallarına detaylıca [bu rehberde](/blog/hepsiburada-katalog-ve-listing-kurallari) baktık" gibi varyantlar.

---

## Pillar 4: Etsy (7 cluster)

**Pillar slug:** `etsy-satis-baslangic-rehberi-2026`

Cluster'lar:
- etsy-baslik-tag-yazim-kurallari
- etsy-ads-reklam-yonetimi
- etsy-turk-el-yapimi-urun-satma-rehberi
- etsy-seo-etiket-stratejisi-uluslararasi-satis
- amazon-usa-etsy-karsilastirma-ihracat (cross-link Amazon pillar'ına da)
- ai-coklu-dil-urun-aciklamasi-uretimi
- global-pazar-yerlerine-acilmanin-anahtari-ai-listeleme

---

## Pillar 5: N11 — cluster yetersiz

**Pillar slug:** `n11-satis-rehberi-magaza-puani-ve-listing`

Sadece 2 cluster: `n11-kategori-optimizasyonu`, `n11-magaza-puani-artirma`.

**Aksiyon:** BACKLOG'da `BLOG-02 — 5 blog başlığı (pazaryeri-spesifik)` var. N11 için "N11 65 char title" yazısı planda. Buna 2 yazı daha eklemek (N11 reklam, N11 kargo politikası gibi) cluster'ı 5'e çıkarır.

---

## Pillar 6: Çiçeksepeti — cluster yok

**Pillar slug:** `ciceksepeti-satici-magaza-acma-rehberi`

0 cluster. Bu pillar henüz pillar değil, **stand-alone yazı**.

**Aksiyon:** BLOG-02'de "Çiçeksepeti rehber" planlı. Buna 3-4 yazı daha eklemek gerek (Çiçeksepeti kategori kuralları, Çiçeksepeti mağaza puanı, Çiçeksepeti reklam, vb.). Şimdilik pillar olarak işaretle ama internal linking için yapay kümeleme yapma.

---

## Pillar 7: AI Ürün Fotoğrafçılığı (6 cluster)

**Pillar slug:** `e-ticaret-icin-ai-urun-fotografciligi`

Cluster'lar:
- ai-urun-gorseli-uretme-studyosuz
- ai-mucevher-taki-urun-fotografi-rehberi
- ai-yemek-gida-urun-fotografi-rehberi (sosyal pillar'a da link verebilir)
- ai-urun-fotografi-golge-isik-duzenleme
- ai-urun-fotografi-beyaz-arka-plan-standartlari (sitemap'te eksik — P0-3 ile düzeltilecek)
- ai-urun-karusel-coklu-gorsel-set-uretimi

Manuel atama eklemeli: `ai-urun-mockup-olusturma-rehberi`, `lifestyle-urun-fotografi-ai`, `profesyonel-urun-fotografi-ai-studyo`, `telefon-urun-fotografi-ai-duzeltme`, `urun-fotografi-cekim-ipuclari-telefon-ile`, `urun-gorseli-arka-plan-degistirme` — bunlar AI fotoğraf cluster'ına dahil olabilir.

---

## Pillar 8: AI Video (1 cluster)

**Pillar slug:** `ai-urun-videosu-hareket-secenekleri`

Tek cluster: `ai-video-listing-kisa-klip-urun-tanitim` (sitemap'te eksik).

**Aksiyon:** Cluster zayıf — şimdilik standalone. İleride video içerik genişlerse pillar haline gelir.

---

## Pillar 9: Sosyal Medya (23 cluster — büyük)

**Pillar slug:** `sosyal-medya-urun-tanitimi-instagram-tiktok-stratejileri`

Bu pillar çok büyük — alt-pillar yapısı düşünülmeli:
- **Alt-pillar A**: Instagram (instagram-satis-stratejileri, instagram-butikleri-icin-ai-icerik-yonetimi)
- **Alt-pillar B**: TikTok (tiktok-shop-urun-listeleme-rehberi-2026)
- **Alt-pillar C**: Sosyal medya genel (sosyal-medya-pazaryeri-trafik, ai-sosyal-medya-icerik-uretimi)
- **Alt-pillar D**: Influencer/email (influencer-pazarlama-e-ticaret-stratejisi, email-pazarlama-e-ticaret-rehberi)

**Aksiyon:** Bu pillar'ı 2-3 yıllık plan haline getir. İlk fazda ana pillar ile cluster'ları bağla, sonra alt-pillar'ları aç.

---

## Pillar 10: E-Ticaret SEO (8 cluster)

**Pillar slug:** `e-ticaret-seo-anahtar-kelime-arastirma-rehberi`

Cluster'lar:
- gorsel-seo-alt-text-dosya-adi
- yzliste-seo-skoru-nasil-calisir (sitemap'te eksik)
- ai-urun-aciklamasi-sinirlari
- e-ticaret-urun-basligi-nasil-yazilir-platform-kurallari
- urun-aciklamasi-10-hata-duzeltme
- urun-aciklamasi-yazma-teknikleri-satisi-artiran-metin
- shopify-turkiye-magaza-acma-rehberi

---

## Manuel atama gereken 4 yazı

Hiç pillar sinyali olmayan yazılar (genel iş/strateji):

| Slug | Önerilen pillar |
|---|---|
| capraz-satis-upsell-teknikleri | e-ticaret-seo-anahtar-kelime-arastirma-rehberi (genel strateji) |
| e-ticarette-iade-oranlarini-icerikle-dusurun | e-ticaret-seo-anahtar-kelime-arastirma-rehberi |
| e-ticarette-is-yukunu-azaltma-stratejileri | sosyal-medya-urun-tanitimi-instagram-tiktok-stratejileri (operasyon/strateji) |
| elektronik-urunler-listing-teknik-ozellik-yazma | e-ticaret-seo-anahtar-kelime-arastirma-rehberi |

---

## Cross-pillar bağlantılar (önemli)

Bazı yazılar 2 pillar'a aitmiş gibi davranıyor — her ikisine de link versin:

| Yazı | Birincil pillar | İkincil pillar |
|---|---|---|
| trendyol-hepsiburada-amazon-karsilastirma | Trendyol | Amazon + Hepsiburada |
| amazon-usa-etsy-karsilastirma-ihracat | Etsy | Amazon |
| pazaryeri-komisyon-oranlari-karsilastirma-2026 | Hepsiburada | Tüm 6 pazaryeri (homepage'e referans) |
| cross-listing-coklu-pazaryeri-yonetimi | Trendyol | yzliste ürün sayfası `/uret` (CTA) |
| yzliste-coklu-pazaryeri-tek-panel | Amazon | yzliste ürün sayfası `/uret` (CTA) |

---

## Uygulama yöntemi — 3 yaklaşım

### Yaklaşım A — Manuel (en güvenli, en yavaş)

- Her cluster yazısını aç
- 1. paragrafın sonuna veya ilgili bir paragrafa pillar link'i ekle
- 2-3 komşu cluster'a doğal link ekle
- Build et, sayfanın okunabilirliğini ve link kalitesini gör

**Süre:** 130 yazı × ~3 dakika = ~6.5 saat. 2 oturuma yayılabilir.

### Yaklaşım B — Semi-otomatik (Claude Code script)

- Script: her .md dosyasının frontmatter'ına `pillar:` field ekle
- Markdown parser'ı genişlet: `pillar` field varsa içerik sonuna otomatik "İlgili rehberler" bölümü append etsin (`app/blog/[slug]/page.tsx` veya `lib/blog-parser.ts` içinde)
- Bu yöntemde **in-content link** olmaz, sadece bölüm-sonu link olur. Bu **yarı-değerli** — Google bunu "boilerplate" olarak da görebilir.

**Süre:** Script + uygulama 1 gün.

### Yaklaşım C — Hibrit (önerilen)

1. **Faz 1 (1-2 gün):** Otomatik script ile her yazıya 1 pillar link doğal yere yerleştir (1. veya 2. paragrafın sonuna, contextual anchor text ile). Script LLM (yzliste mevcut OpenAI API'sini kullanabilir) ile her yazı için kişiselleştirilmiş anchor önerisi üretsin.
2. **Faz 2 (3-5 gün):** Manuel — pillar yazılarının içine "İlgili konular" doğal akış paragrafı yaz (yukarıdaki Pillar 1 örneğindeki gibi). Bu adım otomatize edilmemeli, kalite için.
3. **Faz 3 (haftalara yayılır):** Cluster yazıları arasındaki komşu link'ler (her cluster yazısı 2 komşusuna link versin). Bunu manuel + AI öneri ile yap.

---

## Otomatik Faz 1 için script taslağı

`scripts/add-pillar-links.ts` benzeri bir dosya:

```typescript
// PSEUDO-KOD — manuel adapte et
import fs from 'fs/promises';
import path from 'path';

const PILLAR_MAP: Record<string, string> = {
  'trendyol-butik-nasil-acilir': 'trendyol-listing-nasil-yazilir',
  'trendyol-anahtar-kelime-arastirma': 'trendyol-listing-nasil-yazilir',
  // ... (yukarıdaki tüm cluster → pillar haritası)
};

const PILLAR_LABELS: Record<string, string> = {
  'trendyol-listing-nasil-yazilir': 'Trendyol\'da listing nasıl yazılır',
  'amazon-a9-algoritmasi': 'Amazon A9 algoritması',
  'hepsiburada-katalog-ve-listing-kurallari': 'Hepsiburada katalog ve listing kuralları',
  'etsy-satis-baslangic-rehberi-2026': 'Etsy satış başlangıç rehberi',
  // ...
};

async function main() {
  const postsDir = 'app/blog/posts';
  const files = await fs.readdir(postsDir);

  for (const file of files) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;
    const slug = file.replace('.md', '');
    const pillar = PILLAR_MAP[slug];
    if (!pillar) continue;

    const filePath = path.join(postsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // İlgili rehber notu — eğer zaten varsa skip
    if (content.includes(`/blog/${pillar}`)) {
      console.log(`SKIP (already linked): ${slug}`);
      continue;
    }

    // İçeriği parse et (frontmatter + body)
    const [, fm, body] = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) || [];
    if (!body) continue;

    // İlk H2'den önce, giriş paragrafının sonuna ekle
    const linkText = `\n\n> İlgili rehber: bu konuyu derinlemesine ele aldığımız [${PILLAR_LABELS[pillar]}](/blog/${pillar}) yazısı, listing yazımında karşılaştığınız çoğu soruyu yanıtlıyor.\n`;
    const firstH2Index = body.indexOf('\n## ');
    if (firstH2Index === -1) continue;

    const newBody = body.slice(0, firstH2Index) + linkText + body.slice(firstH2Index);
    const newContent = `---\n${fm}\n---\n${newBody}`;

    await fs.writeFile(filePath, newContent, 'utf-8');
    console.log(`UPDATED: ${slug} → ${pillar}`);
  }
}

main().catch(console.error);
```

**Önemli notlar:**
- Önce 5 yazıda test et, sonuç beğenilirse genişle.
- `> ` ile blockquote yapmak okunabilirlik için iyi.
- Eğer yazıda zaten link varsa atla (idempotent).
- Çalıştırmadan önce `git status` temiz olmalı, ardından commit "feat(blog): pillar internal linking — faz 1".

---

## Kabul kriterleri — bittiğinde kontrol

### Build sonrası
- [ ] `npm run build` hata vermiyor
- [ ] Preview deploy'da random 5 blog post açılıp link'ler çalışıyor mu (anchor text doğal mı, target slug var mı)
- [ ] Build çıktısında broken link uyarısı yok mu

### SEO sinyalleri (deploy + 1 hafta sonra)
- [ ] `curl -s https://www.yzliste.com/blog/trendyol-anahtar-kelime-arastirma | grep -c 'href="/blog/'` ≥ 1
- [ ] GSC > Internal links raporunda yzliste içindeki top-linked URL'ler arasında pillar'lar görünüyor mu

### Kalite kontrolü
- [ ] Anchor text "burada", "tıklayın" değil — semantic phrase
- [ ] Aynı yazıdan aynı pillar'a 3+ link verilmemiş (over-linking değil)
- [ ] Pillar yazılarına 8+ cluster link var
- [ ] Hiç yazı tamamen orphan kalmadı (her yazıdan en az 1 link var)

### CLAUDE.md kuralları
- [ ] Yeni eklenen text emoji içermiyor
- [ ] Sentence case başlık kullanılmadıysa (mevcut başlıklara dokunulmuyor)
- [ ] Hardcoded renk yok
- [ ] Yasak ifade ("en iyi", "katla") eklenmemiş

---

## Tahmini etki (kanıt-bazlı, garanti yok)

Pillar-cluster modelinin endüstri verisi:
- HubSpot kendi sitesinde uyguladığında %200+ organic traffic artışı raporladı (kaynak: HubSpot blog, 2017). Bu özel durum, garantilemiyor.
- Genel beklenti: 30-90 günde indexlenme + crawl artar, 60-180 günde ranking sinyali güçlenir.
- yzliste için: BACKLOG'daki "3 ay 6 click" durumu çıkış noktası olarak çok düşük olduğu için **görece** büyük artış görme ihtimali yüksek.

**Ama:** ranking artışı tek başına pillar-cluster ile değil, içerik kalitesi + backlinks + brand signals ile gelir. Bu işin tek başına trafik artışını çözmesi beklenmemeli.

---

## Sıralama önerisi

1. **Bugün/yarın:** Bu plan üzerinden geç, anchor text önerilerini onayla/düzelt
2. **Bu hafta:** Faz 1 script'i hazırla, 5 yazıda test et
3. **Önümüzdeki hafta:** Tüm 130 yazıya Faz 1 uygula, preview deploy
4. **2 hafta sonra:** Faz 2 — pillar yazıları manuel zenginleştir
5. **3+ hafta:** Faz 3 — komşu cluster linkleri

---

**Plan sonu.**
