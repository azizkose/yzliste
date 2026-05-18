# P1-8 — Top impression sayfaları için title/meta rewrite önerileri

**Tarih:** 17 May 2026
**Bağlı rapor:** `docs/seo-audit-2026-05-17.md`
**Hedef:** 0 click alan yüksek impression sayfaların CTR'ını yükselt

GSC verisi: 59-39-6-6 impression alan ama 0 click. Title/snippet tıklanmıyor. Aşağıda her sayfa için **3 yeni başlık varyantı + meta description**. Aziz favorisini seçip markdown frontmatter'ında güncellesin, sonra preview deploy ile A/B karar versin.

---

## 1. `e-ticaret-urun-basligi-nasil-yazilir-platform-kurallari`

**Mevcut (75 char):**
```
E-Ticarette Ürün Başlığı Nasıl Yazılır? Platform Kuralları 2026
```
Mevcut: 59 impression / 0 click. **En yüksek impression alan sayfa.**

**Problem:** Title generic, "platform kuralları" muğlak, hangi platform belli değil. CTR çekici değil.

**Yeni başlık varyantları:**

| # | Başlık | Char | Hedef |
|---|---|---|---|
| A | Trendyol, Amazon, Etsy için ürün başlığı yazımı (2026) | 53 | Platform isimlerini başa al, "kural" yerine somut |
| B | Ürün başlığı yazma rehberi: 5 pazaryeri karakter limiti | 56 | Sayı + somut bilgi (karakter limiti) |
| C | Pazaryeri ürün başlığı formülü (Trendyol/Amazon/Etsy) | 53 | "Formül" kelimesi mantık öneren CTR çekici |

**Önerilen:** **B** — sayı + somut bilgi en güçlü click trigger.

**Yeni meta description (155 char hedef):**

| # | Meta description | Char |
|---|---|---|
| A | Trendyol 100, Amazon 200, Etsy 140, N11 65 karakter — her pazaryerinin ürün başlığı kuralları ve dönüşüm yüksek yazım formülleri tek rehberde. | 142 |
| B | Hangi pazaryerinde kaç karakter? Trendyol, Hepsiburada, Amazon, N11, Etsy için ürün başlığı karakter limitleri ve yazma stratejileri. | 138 |

**Önerilen:** **A** — sayılarla başlamak SERP'te dikkat çeker.

---

## 2. `trendyol-iade-yonetimi-saticilar`

**Mevcut (70 char):**
```
Trendyol İade Yönetimi: Satıcılar İçin Kapsamlı Rehber ve Pratikler
```
Mevcut: 39 impression / 0 click.

**Problem:** "Kapsamlı Rehber ve Pratikler" jenerik, "öğrenirsem bana ne kazandırır" sinyali yok.

**Yeni başlık varyantları:**

| # | Başlık | Char |
|---|---|---|
| A | Trendyol iade oranını düşürme: 8 satıcı taktiği | 49 |
| B | Trendyol'da iade nasıl yönetilir? Pratik satıcı rehberi | 53 |
| C | Trendyol iade süreci: başvuru, itiraz, oran düşürme | 53 |

**Önerilen:** **A** — "iade oranını düşürme" yüksek-intent (problem çözen başlık), 8 sayı somut.

**Yeni meta description:**

```
Trendyol satıcı iade sürecini adım adım açıklıyoruz. İade itirazı, müşteri iletişimi ve iade oranını düşüren 8 pratik taktik — operasyonel maliyeti azaltın.
```
(155 char)

---

## 3. `trendyol-butik-nasil-acilir`

**Mevcut (62 char):**
```
Trendyol Butik Nasıl Açılır? Kendi Koleksiyon Sayfanla Satış Yap
```
Mevcut: 6 impression / 0 click.

**Problem:** "Kendi Koleksiyon Sayfanla" muğlak.

**Yeni başlık varyantları:**

| # | Başlık | Char |
|---|---|---|
| A | Trendyol Butik nasıl açılır? Başvuru ve koşullar (2026) | 53 |
| B | Trendyol Butik mağaza açma: koşullar, başvuru, avantaj | 53 |
| C | Trendyol Butik açma rehberi: 5 adımda mağaza | 44 |

**Önerilen:** **A** — yıl ekleyince "güncel rehber" sinyali.

**Yeni meta description:**

```
Trendyol Butik mağaza açma süreci 2026: başvuru koşulları, gerekli evraklar, vergi tipi, koleksiyon kategorisi. Onay aldıktan sonra ilk adımlar.
```

---

## 4. `ciceksepeti-satici-magaza-acma-rehberi`

**Mevcut (84 char — uzun):**
```
Çiçeksepeti'nde Satıcı Olmak: Mağaza Açma, Listeleme ve Kategori Stratejileri
```
Mevcut: 6 impression / 0 click. **Başlık 60 char limitini aşıyor — SERP'te kırpılıyor.**

**Yeni başlık varyantları:**

| # | Başlık | Char |
|---|---|---|
| A | Çiçeksepeti'nde satış: mağaza açma + kategori seçimi | 51 |
| B | Çiçeksepeti satıcı olma rehberi (2026 güncel) | 45 |
| C | Çiçeksepeti'nde satıcı olmak: başvuru ve adımlar | 47 |

**Önerilen:** **B** — kısa + güncel sinyali.

**Yeni meta description:**

```
Çiçeksepeti'nde satıcı olmak için başvuru koşulları, vergi tipi, kategori seçimi, listing kuralları ve hediye odaklı satışın incelikleri.
```

---

## 5. `trendyol-listing-nasil-yazilir` (sadece meta description rewrite)

**Mevcut: 50 impression / 1 click — CTR %2.** Title iyi çalışıyor (uzun olsa da pillar yazısı için OK), ama meta description çekici değil.

**Mevcut meta description (193 char — uzun, kırpılıyor):**
```
Trendyol algoritmasının öne çıkardığı listing formatını adım adım öğren. Başlık, özellikler, açıklama ve etiket yazımında dikkat edilmesi gereken her şey bu rehberde.
```

**Yeni meta description varyantları:**

| # | Meta | Char |
|---|---|---|
| A | Trendyol başlık 100, özellik 5, açıklama 300 kelime — algoritmanın öne çıkardığı listing formatını adım adım öğren. | 121 |
| B | Trendyol listing yazımı 2026: 100 karakter başlık formülü, 5 özellik kuralı, etiket stratejisi ve A+ açıklama yazma. | 120 |

**Önerilen:** **A** — sayılarla başlıyor, kısa ve doğrudan.

---

## Diğer 0 click sayfalar (kısa öneri)

| Slug | Impression | Hızlı öneri |
|---|---|---|
| `/blog` (hub) | 9 | Meta'da "130+ rehber" gibi sayı ekle |
| `/fiyatlar` | 6 | Title: "yzliste fiyatlar: 39 TL'den başlayan kredi paketleri" |
| `/blog/marka-hikayesi-olusturma...` | 1 | Bu yazı sitemap'ten düştü — P0-3'le ilk fix edilmeli |

---

## Uygulama adımları

1. Bu doküman üzerinden geç, her başlık için **kendi favori versiyonunu seç** veya kendi formuluni yaz.
2. `app/blog/posts/{slug}.md` dosyasında frontmatter'daki `baslik:` ve `ozet:` field'ını değiştir.
3. Build et — title + meta description otomatik güncellenecek.
4. Preview deploy → GSC > URL Inspection > Request Indexing tıkla (her sayfa için).
5. 1-2 hafta sonra GSC > Performance'ta CTR değişimine bak.

---

## Doğrulama checklist

- [ ] Yeni title ≤60 karakter (SERP kırpma sınırı)
- [ ] Yeni meta description ≤155 karakter (SERP kırpma sınırı)
- [ ] Brand "yzliste" title'da geçmiyorsa OK (`| yzliste` suffix layout'ta ekleniyor)
- [ ] CLAUDE.md yasaklı ifadeler ("%X kaynaksız", "katla", "en iyi") yok
- [ ] Sentence case kuralı uygulandı (title case değil)
- [ ] Build geçer — TypeScript hatası yok
- [ ] Preview URL'de yeni title HTML kaynak'ta görünüyor

---

**Doküman sonu.**
