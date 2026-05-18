# SEO-FIX-PAKETI deploy talimatı

**Tarih:** 18 May 2026
**Sahip (sen):** Code (canlıya atan)
**Verilen:** Aziz
**Branch:** `claude/seo-fixes-gece-2026-05-18`
**Tahmini süre:** 30-45 dakika manuel + build + test

Cowork (Claude) gece SEO denetimi yapıp 19 fix uyguladı. Çoğu hazır — sadece **4 küçük manuel iş** kaldı çünkü Edit tool 4 büyük dosyada encoding bozması yaptı. Bu talimat onları kapatıyor.

**ÖNEMLİ:** Mevcut working tree'de 491 dosya değişmiş görünüyor — bunlar OneDrive sync timestamp değişikliği, Cowork değişiklikleri DEĞİL. Sen sadece **aşağıdaki belirli dosyaları** add et.

---

## Adım 0 — Branch hazırlığı

```bash
cd ~/OneDrive/Documents/yzliste

# Master temiz mi kontrol
git status --short | head -5

# Index lock varsa temizle
rm -f .git/index.lock

# Yeni branch
git checkout -b claude/seo-fixes-gece-2026-05-18

# (Eğer branch zaten varsa)
# git checkout claude/seo-fixes-gece-2026-05-18
```

---

## Adım 1 — `app/blog/[slug]/page.tsx` (3 küçük edit)

Bu dosyada şu **3 değişikliği** yap:

### 1a — `dynamicParams = false` ekle

Satır **20** civarındaki `export const revalidate = 3600;` satırının HEMEN ALTINA ekle:

```tsx
export const revalidate = 3600;
// P0-5 SEO fix: olmayan slug → Next.js 404 (soft 404 önlemi)
export const dynamicParams = false;
```

### 1b — `generateMetadata` içindeki `if (!yazi) return` bloğunu genişlet

Satır **34** civarında bul:

```tsx
if (!yazi) return { title: { absolute: "Yazı bulunamadı | yzliste" } };
```

Şununla değiştir:

```tsx
// P0-5: olmayan slug için noindex + canonical kaldır
if (!yazi) return {
  title: { absolute: "Yazı bulunamadı | yzliste" },
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};
```

### 1c — `ArticleJsonLd` schema'sını zenginleştir (P2-4)

Satır **81** civarındaki `function ArticleJsonLd({ yazi }: { yazi: BlogYazisi }) {` satırından sonra fonksiyonun **başına** bu hesaplamayı ekle:

```tsx
function ArticleJsonLd({ yazi }: { yazi: BlogYazisi }) {
  // P2-4 SEO fix: schema zenginleştir (wordCount, mainEntityOfPage, timeRequired)
  const bodyText = yazi.icerik
    .filter((b) => b.tip === "paragraf" || b.tip === "giris" || b.tip === "sonuc" || b.tip === "baslik")
    .map((b) => `${b.baslik ?? ""} ${b.metin ?? ""}`)
    .join(" ")
    .trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  return (
    <script
      ...
```

Sonra JSON-LD object'inde **`articleSection: yazi.kategori,` satırından sonra** şu 3 field'ı ekle:

```tsx
          articleSection: yazi.kategori,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.yzliste.com/blog/${yazi.slug}`,
          },
          wordCount,
          timeRequired: `PT${yazi.okumaSuresi}M`,
        }),
```

**Doğrulama:** Sonra `wc -l app/blog/[slug]/page.tsx` çıktısı **498-505 satır** civarı olmalı. `tail -3` ile dosya sonu `});\n}` ile bitmeli.

---

## Adım 2 — `app/sitemap.ts` (P1-6 kategori sayfaları)

### 2a — Import'a `kategoriler` ekle

Satır **2**'deki şunu değiştir:

```tsx
import { getYazilar } from "./blog/icerikler";
```

Şununla:

```tsx
import { getYazilar, kategoriler } from "./blog/icerikler";

// P1-6 SEO fix: kategori slug helper (page.tsx ile aynı mantık)
function kategoriToSlug(kategori: string): string {
  return kategori
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
```

### 2b — Dosya sonundaki `return` ifadesini değiştir

Satır **109** civarındaki:

```tsx
  return [...mainPages, ...blogPages];
}
```

Şununla değiştir:

```tsx
  // P1-6: kategori bazlı hub sayfaları
  const cats = await kategoriler();
  const kategoriPages: MetadataRoute.Sitemap = cats.map((kategori) => ({
    url: `${baseUrl}/blog/kategori/${kategoriToSlug(kategori)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    lastModified: new Date(),
  }));

  return [...mainPages, ...blogPages, ...kategoriPages];
}
```

**Doğrulama:** `wc -l app/sitemap.ts` ~115 satır. `tail -5` çıktısı `return [...mainPages, ...blogPages, ...kategoriPages];\n}` ile bitmeli.

---

## Adım 3 — Duplicate blog dosyası temizliği

Cowork yanlışlıkla `app/blog/posts/trendyol-satis-artirma-seo-rehberi.md` adında **stub dosya** bıraktı (içi yorum). Asıl yazı `blog-yazisi-1-trendyol.md` içinde, slug uyumsuz. Düzelt:

```bash
# Stub'ı sil
git rm app/blog/posts/trendyol-satis-artirma-seo-rehberi.md

# Asıl yazıyı slug ile uyumlu hale getir (rename)
git mv app/blog/posts/blog-yazisi-1-trendyol.md app/blog/posts/trendyol-satis-artirma-seo-rehberi.md
```

**Doğrulama:** `ls app/blog/posts/ | grep trendyol-satis` → 1 dosya (yeniden adlandırılmış olan), `ls app/blog/posts/blog-yazisi-1` → boş.

---

## Adım 4 — P1-1 next/image migration (opsiyonel ama tavsiye edilir)

Bu **gerçekten yapılması gereken** P1 işi. Cowork denedi ama Edit tool 4 dosyayı bozdu, geri aldı. Sen manuel yapmalısın.

### 4a — `components/SiteHeader.tsx` (header logo, LCP element)

Satır **1**'de import ekle:

```tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";  // ← bu satırı ekle
```

Satır **63-65** civarında `<img src="/yzliste_logo.png" ...>` bul:

```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src="/yzliste_logo.png" alt="yzliste" className={`h-9 transition-all duration-300 ${transparent ? "brightness-0 invert" : ""}`} />
```

Şununla değiştir:

```tsx
<Image
  src="/yzliste_logo.png"
  alt="yzliste"
  width={120}
  height={36}
  priority
  className={`h-9 w-auto transition-all duration-300 ${transparent ? "brightness-0 invert" : ""}`}
/>
```

### 4b — `components/sections/HeroBlock/AppScreenshotMockup.tsx`

Satır **3**'e ekle: `import Image from 'next/image'`

İki `<img>` var:
- `/ornek_beyaz.jpg` → `<Image src="/ornek_beyaz.jpg" alt="..." width={150} height={150} sizes="(max-width: 768px) 150px, 200px" className="..." />`
- `/ornek_once.jpg` (40×40 thumbnail) → `<Image src="/ornek_once.jpg" alt="..." width={40} height={40} className="..." />`

### 4c — `components/landing/InfoStrip.tsx`

Bu dosyada `Image as ImageIcon` lucide'dan geliyor, **çakışma var**. Çözüm: `NextImage` alias.

Satır **3** civarına ekle: `import NextImage from 'next/image'`

8 `<img src="/ornek_*.jpg" />` etiketini şununla değiştir:

```tsx
<NextImage src={...} alt={...} width={300} height={300} sizes="(max-width: 640px) 50vw, 25vw" className="..." />
```

### 4d — `components/tanitim/FeaturesTabbed.tsx`

Aynı 8 görsel. `Image` lucide'dan değil — direkt `import Image from "next/image"` (satır 3 civarı). 8 `<img>` → `<Image>` aynı parametrelerle.

**KESİN UYARI:** Edit tool ile değiştirirken **encoding bozma** riski var. Bu dosyalar Türkçe karakter içeriyor (ş, ğ, ü, ö). Edit yerine **kendi editör'ünde aç, manuel değiştir, kaydet** daha güvenli.

**Doğrulama:** Her dosya için
```bash
wc -l components/SiteHeader.tsx              # ~268 satır
wc -l components/sections/HeroBlock/AppScreenshotMockup.tsx  # ~185 satır
wc -l components/landing/InfoStrip.tsx       # ~495 satır
wc -l components/tanitim/FeaturesTabbed.tsx  # ~435 satır

# Hepsi `}` ile bitmeli
tail -1 components/SiteHeader.tsx
tail -1 components/landing/InfoStrip.tsx
# vb.
```

Eğer dosya kırılırsa:
```bash
git checkout HEAD -- components/SiteHeader.tsx  # vb.
```

---

## Adım 5 — Build kontrolü

```bash
# Type check
npx tsc --noEmit --skipLibCheck 2>&1 | grep -v "\.next/" | head -20

# Eğer temizse → 0 hata
# Eğer hata varsa → hangi dosya kontrol et

# Build (Next.js prod build)
npm run build
```

Build başarılı olmalı. Hata olursa:
- `dynamicParams=false` ile `generateStaticParams` döndüren slug listesi build sırasında kullanılır. Listede olmayan slug 404 olur — bu bekleneN.
- Eğer `kategoriler is not a function` hatası gelirse `app/blog/icerikler.ts` dosyasında `kategoriler` export'u olduğundan emin ol.

---

## Adım 6 — Commit + push

```bash
# Status kontrol — sadece bizim değiştirdiklerimiz görünmeli
git status --short

# Stage (tek tek)
git add lib/blog-parser.ts
git add next.config.ts
git add app/robots.ts
git add public/llms.txt
git add app/blog/kategori/
git add app/blog/posts/

# Manuel düzenlediklerin
git add app/blog/\[slug\]/page.tsx
git add app/sitemap.ts

# next/image yaptıysan
git add components/SiteHeader.tsx
git add components/sections/HeroBlock/AppScreenshotMockup.tsx
git add components/landing/InfoStrip.tsx
git add components/tanitim/FeaturesTabbed.tsx

# Dokümanlar
git add docs/seo-audit-2026-05-17.md
git add docs/seo-internal-linking-plan-2026-05-17.md
git add docs/seo-backlink-strategy-2026-05-17.md
git add docs/seo-title-rewrite-onerileri-2026-05-17.md
git add docs/seo-yasak-ifade-rapor-2026-05-18.json
git add docs/seo-uzun-baslik-rapor-2026-05-18.json
git add docs/seo-gece-calismasi-2026-05-18.md
git add docs/seo-deploy-talimat-2026-05-18.md

# Çerçeve
git add CHANGELOG.md
git add BACKLOG.md

# Status tekrar — beklenmedik dosya kalmamış olmalı
git status --short

# Commit
git commit -m "feat(seo): SEO-FIX-PAKETI gece çalışması — P0-1/2/3/5, P1-1/2/3/5/6/7/8, P2-4/5

P0-1: 130 yazıya pillar internal link (120 cluster + 5 pillar) — 165+ yeni link
P0-2: next.config Cache-Control public override (12 sayfa)
P0-3: blog-parser GİRİŞ/SONUÇ throw→warn + 6 yazıya GİRİŞ paragrafı
P0-5: blog/[slug] dynamicParams=false + noindex metadata (soft 404 fix)
P1-1: next/image migration (4 component, hero logo priority)
P1-2: 27 ozet 155 char limitine kısaltıldı (smart_truncate)
P1-3: curly apostrof (' → ' U+2019)
P1-5: 48 'en iyi/en çok' nötr ifadeye çevrildi (35 yazı)
P1-6: /blog/kategori/[slug] route + sitemap entry (5 kategori)
P1-7: public/llms.txt — AI visibility (Claude, ChatGPT, Perplexity)
P1-8: 5 top impression yazının title/ozet yenilendi
P2-4: BlogPosting schema zenginleştirildi (wordCount, mainEntityOfPage, timeRequired)
P2-5: AI bot explicit Allow (GPTBot/ClaudeBot/PerplexityBot/Google-Extended/...)

Bonus: blog-yazisi-1-trendyol.md → trendyol-satis-artirma-seo-rehberi.md rename

Dokümanlar (docs/seo-*):
- seo-audit-2026-05-17.md (ana rapor + GSC verisi)
- seo-internal-linking-plan-2026-05-17.md (P0-1 uygulandı)
- seo-backlink-strategy-2026-05-17.md (P0-6 manuel iş, Aziz)
- seo-title-rewrite-onerileri-2026-05-17.md (P1-8 uygulandı)
- seo-yasak-ifade-rapor-2026-05-18.json (P1-5 manuel review)
- seo-uzun-baslik-rapor-2026-05-18.json (P2-1 manuel review)
- seo-gece-calismasi-2026-05-18.md (sabah raporu)
- seo-deploy-talimat-2026-05-18.md (bu deploy talimatı)"

# Preview'a push
git push origin claude/seo-fixes-gece-2026-05-18
```

---

## Adım 7 — Preview deploy test

GitHub'da PR aç: `claude/seo-fixes-gece-2026-05-18` → `preview` (NOT main).

Vercel preview deploy URL'i oluşunca **MUTLAKA** şu 9 test komutunu çalıştır. Preview URL `https://yzliste-git-claude-seo-fixes-gece-2026-05-18-...vercel.app` benzeri olacak.

```bash
PREVIEW_URL="https://yzliste-git-claude-seo-fixes-gece-2026-05-18-aziz.vercel.app"
# (gerçek preview URL'i Vercel dashboard'undan al)

# 1) Cache-Control public oluyor mu (P0-2 — en kritik test)
curl -sI $PREVIEW_URL/ -A "Mozilla/5.0 (compatible; Googlebot/2.1)" | grep -i cache-control
# Beklenen: "public, max-age=0, s-maxage=3600, must-revalidate"
# ÖNEMLİ: Eğer hâlâ "private, no-cache, no-store" dönerse → middleware.ts override ediyor.
# O zaman P0-2 V2 mimari değişiklik gerekli (route-level force-static). Aziz'e haber ver.

# 2) Soft 404 — olmayan slug 404 dönüyor mu (P0-5)
curl -sI $PREVIEW_URL/blog/asla-olmayan-slug-12345
# Beklenen: HTTP/2 404

# 3) llms.txt erişilebilir mi (P1-7)
curl -sI $PREVIEW_URL/llms.txt
# Beklenen: HTTP/2 200

# 4) Kategori sayfaları render oluyor mu (P1-6)
curl -sI $PREVIEW_URL/blog/kategori/platform-rehberleri
curl -sI $PREVIEW_URL/blog/kategori/ai-ve-gorsel
# Beklenen: HTTP/2 200 her ikisi

# 5) Robots.txt AI bot kuralları (P2-5)
curl -s $PREVIEW_URL/robots.txt | grep -iE "gptbot|claudebot|perplexitybot|google-extended"
# Beklenen: 4+ bot adı

# 6) Sitemap kategori sayfaları (P1-6)
curl -s $PREVIEW_URL/sitemap.xml | grep -c "kategori/"
# Beklenen: 5 (5 kategori)

# 7) Internal link sayısı blog post içinde (P0-1)
curl -s $PREVIEW_URL/blog/trendyol-butik-nasil-acilir -A "Googlebot" | grep -c 'href="/blog/'
# Beklenen: ≥3 (1 pillar link + 2-3 diğer)

# 8) Schema markup zenginleşti mi (P2-4)
curl -s $PREVIEW_URL/blog/trendyol-listing-nasil-yazilir -A "Googlebot" | grep -oE "wordCount|timeRequired|mainEntityOfPage"
# Beklenen: 3 unique match

# 9) Curly apostrof title (P1-3)
curl -s $PREVIEW_URL/blog/trendyol-listing-nasil-yazilir -A "Googlebot" | grep -oP "<title[^>]*>[^<]*</title>"
# Beklenen: "'" (curly) görülmeli — düz apostrof "'" değil
```

**Eğer test 1 (Cache-Control) başarısızsa** — yani hâlâ `private, no-cache` dönüyorsa:
- middleware.ts'deki Supabase cookie response set işlemi next.config header'ını ezme ihtimali var
- Aziz'e haber ver, P0-2 V2 (route-level force-static) gerekli
- Bu durumda diğer fix'ler yine commit edilebilir, sadece P0-2 ayrıca takip işine alınır

---

## Adım 8 — preview → main merge

Preview test başarılıysa:

```bash
git checkout main
git pull origin main
git merge --no-ff claude/seo-fixes-gece-2026-05-18
git push origin main
```

Vercel main otomatik production'a deploy edecek. **Production deploy sonrası tekrar 9 test komutunu çalıştır** (bu sefer `https://www.yzliste.com` URL'i ile).

---

## Adım 9 — GSC URL Inspection (Aziz)

Production deploy tamamlandıktan sonra Aziz GSC'de **manuel olarak** şu 10 sayfa için "Request Indexing" tıklamalı:

**5 yeni kategori sayfası:**
- `https://www.yzliste.com/blog/kategori/platform-rehberleri`
- `https://www.yzliste.com/blog/kategori/ai-ve-gorsel`
- `https://www.yzliste.com/blog/kategori/isletme-ve-seo`
- `https://www.yzliste.com/blog/kategori/urun-rehberleri`
- `https://www.yzliste.com/blog/kategori/satis-stratejileri`

**5 title/meta yenilenen yazı:**
- `https://www.yzliste.com/blog/e-ticaret-urun-basligi-nasil-yazilir-platform-kurallari`
- `https://www.yzliste.com/blog/trendyol-iade-yonetimi-saticilar`
- `https://www.yzliste.com/blog/trendyol-butik-nasil-acilir`
- `https://www.yzliste.com/blog/ciceksepeti-satici-magaza-acma-rehberi`
- `https://www.yzliste.com/blog/trendyol-listing-nasil-yazilir`

---

## Beklenen sonuçlar

| Süre | Beklenen değişiklik | Ölçüm |
|---|---|---|
| Anında | Cache-Control public dönüyor | curl test 1 |
| Anında | llms.txt + kategori sayfaları erişilebilir | curl test 3, 4 |
| 1-2 hafta | GSC'de keşfedilen URL sayısı 40 → 100+ | GSC > Pages > Indexed |
| 2-4 hafta | Top impression sayfa CTR %0 → %2-5 | GSC > Performance > Pages |
| 4-8 hafta | Pillar yazıların ortalama position 10 → 6-8 | GSC > Performance > Pages |
| 8-12 hafta | External backlink 5+ (Aziz P0-6 yaparsa) | GSC > Links > External links |

---

## Hata kurtarma

Eğer **build kırılırsa**:
```bash
# Hangi dosyanın sorunlu olduğunu bul
npm run build 2>&1 | grep -E "error|Error" | head -10

# O dosyayı HEAD'e geri al, bağladığın commit'ten önceki haline
git checkout HEAD -- path/to/sorunlu.tsx

# Tekrar dene
npm run build
```

Eğer **TS hatası** verirse ama build hatası değilse:
```bash
# .next cache temizle
rm -rf .next
npm run build
```

Eğer **`generateStaticParams` ile `dynamicParams=false` çakışırsa**:
- 130 blog yazısının slug'ları doğru üretiliyor mu kontrol et: `npm run build` çıktısında "Generating static pages (X/Y)" sayısı 130+ olmalı
- Sorun varsa `dynamicParams=true`'ya çevir (P0-5'i yarı uygula, generateMetadata noindex kısmı yeterli)

---

## Eksik bırakılan işler (sen yapmayacaksın, Aziz / sonraki sprint)

- **SEO-P0-6** External backlink stratejisi — Aziz Product Hunt + G2 + Trustpilot listing açacak
- **SEO-P1-4** Blog H2/H3 yapısı zenginleştir — 2-3 günlük içerik refresh işi
- **SEO-P1-5 devam** 187 kaynaksız %X istatistik manuel review — JSON rapor hazır
- **SEO-P1-9** Hreflang + EN content — strateji kararı gerekli
- **SEO-P2-1** 100 yazı title >60 char — manuel kısaltma

Bunlar BACKLOG.md'de SEO-P0-6, SEO-P1-4, SEO-P1-5, SEO-P1-9, SEO-P2-1 olarak işaretli.

---

## Soru çıkarsa

- **Build hatası** → bana (Cowork) söyle, dosyayı debug ederim
- **Test 1 (Cache-Control) başarısız** → Aziz'e haber ver, P0-2 V2 gerekli
- **Internal link blockquote'ları akışı bozuyor** → 1-2 örnek paylaş, template'i değiştirebilirim
- **Genel SEO sorusu** → `docs/seo-audit-2026-05-17.md` ana referans

---

**Talimat sonu. İyi çalışmalar.**
