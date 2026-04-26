# AI Denetim Raporu — 02

```
Ben (AI QC) → Cowork → Claude Code
denetim/brief   BACKLOG     kod
```

> Bu dosyayı **Cowork okur** ve içeriğindeki "Cowork için aksiyon listesi" bölümünü `BACKLOG.md`'ye iş kartı olarak çevirir. Claude Code de bu kartlardan kod değişikliğini yapar. AI QC kendisi BACKLOG'a yazmaz, kod değiştirmez.

**Tarih:** 2026-04-26
**Önceki rapor:** `specs/ai-denetim-01.md` (boş — ilk gerçek doküman bu)
**Kapsam:** `app/api/uret/*`, `app/api/sosyal/*`, `app/api/gorsel/*`, `app/api/studio/*`, `app/api/chat/route.ts`, `app/api/toplu/route.ts`, `lib/prompts/*`, `lib/constants*`, `lib/paketler.ts`, `lib/studio-constants.ts`, blog içerik bütünlüğü.

---

## 1. İcmal

Genel sağlık skoru: **7,5/10** (kabul edilebilir, kritik yok ama içerik tutarsızlıkları var).

Önceki turdan beri (BACKLOG'dan okuduğum kadarıyla AI-01..AI-12) yapılan iyileştirmeler büyük ölçüde tamamlanmış. Merkezi `lib/ai-config.ts`, 7 ton tanımı, platform limit tek-kaynak, post-generation validation aktif. Bu turda kritik AI route bug'ı yok. **Asıl sorun içerik düzleminde:** chatbot ile blog içerikleri arasında fiyat/paket/platform sayısı çelişkileri var, özellikle `yzliste-kredi-sistemi-paketler.md` blog yazısı tamamen yanlış (Pro/Enterprise paket adları, "kullan ya da kaybet", 5 platform iddiaları). Bunlar üretimde kullanıcı şikayetine açık.

İkinci öncelikli gözlem: `/chat` endpoint'inde rate limit yok — para yakacak risk, prompt injection veya brute force ile.

Üçüncü gözlem: `/uret/duzenle` route'u marka bağlamı ekliyor ama **kategori kuralları (KATEGORI_KURALLARI) ve yasaklı kelime listesi (YASAKLI_KELIMELER) eklemiyor**. Bu yüzden düzenleme çıktısında pazaryeri yasaklı kelimesi kazara sızabilir. AI-04 daha önce kapanmış görünüyor ama yarım kapanmış.

---

## 2. Önceki denetimle kıyas

`specs/ai-denetim-01.md` boş olduğu için BACKLOG'daki AI-01..AI-12 satırlarına bakarak durum tablosu çıkarıyorum.

| ID | Başlık | Önceki durum | Bu hafta bulgu |
|---|---|---|---|
| AI-01 | Chatbot SYSTEM_PROMPT — fiyat/platform/stil/yzstudio | Kapandı | Fiyatlar dinamik (PAKET_LISTESI), tonlar/stiller doğru. **Yeni bulgu:** Sosyal kit fotoğraflı senaryo (4 kredi) chat'te yok; sadece "3 kredi" yazıyor. Bkz §P1-1 |
| AI-02 | Merkezi `lib/ai-config.ts` | Kapandı | 6 LLM çağrısının 6'sı `AI_MODELS` + `AI_TEMPERATURES` kullanıyor. ✓ |
| AI-03 | (BACKLOG'da yok ama numaralı) | — | Atlanmış görünüyor |
| AI-04 | /duzenle marka bağlamı + kategori kuralları + yasaklı | "Tamamlandı" yazıyor | **Yarım kapanmış:** marka bağlamı eklenmiş, KATEGORI_KURALLARI ve YASAKLI_KELIMELER eklenmemiş. Bkz §P1-2 |
| AI-05 | Hepsiburada 100→150 tek kaynak | Kapandı | 3 dosyada da 150 ✓ |
| AI-06 | TON_TANIMLARI 7 tona genişletildi | Kapandı | metin.ts + ton.ts + TON_VIDEO_MAP hepsinde 7 ton ✓ |
| AI-07 | max_tokens platform bazlı + stop_reason | "Tamamlandı" | max_tokens platform bazlı ✓ ama **`stop_reason: "max_tokens"` hâlâ yakalanmıyor** — log/uyarı yok. Bkz §P2-1 |
| AI-08 | Çıktı doğrulama — limit + yasaklı | Kapandı | `/uret`'te `uyarilar[]` aktif ✓; ama `/uret/duzenle`, `/sosyal`, `/sosyal/kit`, `/toplu`'da aynı validasyon yok. Bkz §P2-2 |
| AI-09 | Sosyal üretim DB kaydına prompt_version | Kapandı | sosyal/route.ts ✓; sosyal/kit/route.ts'te `prompt_version` DB'ye yazılmıyor. Bkz §P2-3 |
| AI-10 | /toplu sistemPromptOlustur paylaşsın | Kapandı | `sistemPromptOlustur(platformKey, dil, ton)` çağrılıyor ✓; ama kategori param'ı verilmiyor — kategori kuralları toplu modda devrede değil. Bkz §P2-4 |
| AI-11 | "Bilinen ürün özellikleri" kuralı kaldır | Kapandı | `ICERIK_KURALLARI` "Kullanicinin verdigi bilgileri temel al ... uydurma" diyor ✓ |
| AI-12 | /studio/manken promptuna profil ton + hedefKitle | Kapandı | manken/route.ts `promptOlustur` ton + hedefKitle alıyor ✓ |

---

## 3. P0 sorunlar

P0 yok bu turda. Çalışan AI rotalarında veri kaybına yol açacak bug bulamadım.

---

## 4. P1 sorunlar

### P1-1 — Blog yazıları gerçek paket modeliyle çelişiyor (içerik bütünlüğü)

**Dosya:** `app/blog/posts/yzliste-kredi-sistemi-paketler.md` ve kısmen `app/blog/posts/yzliste-ile-ilk-listing-2-dakikada.md`, `app/blog/posts/yzliste-dashboard-kullanim-rehberi.md`.

Tespit edilen yanlışlar (gerçek tek kaynak: `lib/paketler.ts` + `app/api/chat/route.ts` SYSTEM_PROMPT):

1. **Pro / Enterprise paket adları kullanılmış** — gerçek paketler: Başlangıç (₺49 / 10 kredi), Popüler (₺129 / 30 kredi), Büyük (₺299 / 100 kredi). Pro / Enterprise diye paket yok.
2. **"Aylık 50–100 kredi", "Aylık 300–500 kredi" gibi abonelik mantığı yansıtılmış** — yzliste tek seferlik kredi paketi satıyor, abonelik değil.
3. **"Ay sonuna kadar tüketilmeyen krediler bir sonraki aya devretmiyor; kullan ya da kaybet"** — chat ve `lib/paketler.ts` "Krediler süresizdir, sona ermez" diyor. Doğrudan çelişki.
4. **"Sosyal medya kiti (5 platform): 3-5 kredi"** — gerçek: 4 platform (instagram_tiktok, facebook, twitter, linkedin), 3 kredi (fotoğrafsız) / 4 kredi (fotoğraflı).
5. **"Listing üretimi (3+ pazaryeri için): 2-3 kredi"** — her pazaryeri ayrı üretim, 1 kredi/üretim. 3 pazaryeri = 3 kredi (2-3 değil).
6. **"Görsel üretimi (model giydirme, lifestyle sahne): 2-3 kredi"** — lifestyle 1 kredi/stil, mankene giydirme 3 kredi/sample. Karıştırılmış.
7. **"Video üretimi: 5-10 kredi"** — gerçek: 10 kredi (5sn) / 20 kredi (10sn).
8. **`yzliste-coklu-pazaryeri-tek-panel.md` ve diğer 5 yazıda "7 platform" iddiası** — ürün 6 platforma çıkıyor (Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA). UX-18 değişikliğiyle UI'da "6 Pazaryeri"ne döndü, blog yazıları geride kaldı.

**Risk:** Kullanıcı chatbot'a "Pro paketi nedir" diye sorduğunda chatbot "öyle paket yok" diyecek; blog yazısı pazarlama vaadi tutmayacak; KVKK / TKHK açısından da yanıltıcı reklam riski.

**Etkilenen dosyalar:** Yukarıdaki 3 blog dosyası + audit gereken diğer 4 blog.

### P1-2 — `/uret/duzenle` kategori kuralları ve yasaklı kelime eklemiyor

**Dosya:** `app/api/uret/duzenle/route.ts`

`DUZENLE_SISTEM_PROMPT` jenerik. Marka bağlamı (`marka_adi`, `hedef_kitle`, vb.) ekleniyor ✓ ama:
- `KATEGORI_KURALLARI` (kozmetik medikal iddia yok, gıda allerjen, çocuk yaş aralığı vb.) **eklenmemiş**.
- `YASAKLI_KELIMELER[platform]` listesi **eklenmemiş**.

Sonuç: kullanıcı "yeniden üret" veya "ton samimi yap" derse, ilk üretimdeki yasaklı-kelime/medikal-iddia koruması düzenleme adımında kayboluyor. AI-04 yarı kapanmış.

**Düzeltme:** `lib/prompts/metin.ts`'ten `KATEGORI_KURALLARI` ve `YASAKLI_KELIMELER` import edilmeli, system prompt'una `kategoriKoduBul(kategori)` ve `YASAKLI_KELIMELER[platform]` eklenmeli.

### P1-3 — `/api/chat` rate limit yok

**Dosya:** `app/api/chat/route.ts`

`/uret` route'u Upstash sliding-window ile per-user 60/dk + 500/gün korunuyor; `/chat` korumasız. Anthropic Haiku ucuz olsa da botla 1 dakikada binlerce istek atılırsa hem para yakar hem `ANTHROPIC_API_KEY` hız limitine takılır.

**Düzeltme:** `/uret`'teki Ratelimit pattern'ini `/chat`'e taşı; per-user 30 req/dk + per-IP 60 req/dk yeterli.

---

## 5. P2 sorunlar

### P2-1 — `stop_reason: "max_tokens"` hiçbir route'ta yakalanmıyor

**Dosyalar:** `app/api/uret/route.ts`, `app/api/uret/duzenle/route.ts`, `app/api/sosyal/route.ts`, `app/api/sosyal/kit/route.ts`, `app/api/toplu/route.ts`, `app/api/chat/route.ts`.

Anthropic response'da `stop_reason` alanı dönüyor; "max_tokens" gelirse çıktı yarıda kesilmiş demek (özellikle Etsy/Amazon USA'da 13 etiket veya 5 bullet eksik). Şu an sessizce kaydediliyor, kullanıcıya "tam içerik üretildi" gibi görünüyor.

**Düzeltme:** `data.stop_reason === "max_tokens"` ise:
- log: `logger.warn({ platform, urunAdi }, "max_tokens hit")`
- response'a `uyarilar.push("İçerik max_tokens limitine takıldı, tekrar üretmeyi dene")`
- üretim logunda `truncated: true` flag.

### P2-2 — Çıktı doğrulama (`uyarilar[]`) tek route'ta var

**Dosya:** `app/api/uret/route.ts` satır 256–269.

Karakter limiti + yasaklı kelime regex check'i sadece `/uret`'te. `/uret/duzenle` (yeniden_uret_context, kisalt, genislet, ton_samimi, ton_resmi) çalıştığında validasyon yok — kullanıcı yasaklı kelime sızdıran düzenleme alabilir. `/sosyal` ve `/toplu` da aynı durumda.

**Düzeltme:** `lib/prompts/metin.ts`'e `cikiyiDogrula(icerik, platform): { uyarilar: string[] }` helper'ı çıkar, 4 route'tan da çağır.

### P2-3 — `sosyal/kit/route.ts` `prompt_version` DB'ye yazmıyor

**Dosya:** `app/api/sosyal/kit/route.ts`

`/sosyal/route.ts` sosyal_uretimler tablosuna `prompt_version: SOSYAL_PROMPT_VERSION` yazıyor ✓.
`/sosyal/kit/route.ts` ise hiçbir DB insert yapmıyor — caption ve görseller üretilip dönüyor ama hiçbir log kalmıyor. Sonuç: prompt regression yakalama, A/B test ve maliyet attribution mümkün değil.

**Düzeltme:** Kit'te de her platform caption'ını `sosyal_uretimler`'e fire-and-forget insert et, `tip: "kit"` flag'iyle.

### P2-4 — `/toplu` route kategori kuralları kullanmıyor

**Dosya:** `app/api/toplu/route.ts` satır 44.

`sistemPromptOlustur(platformKey, dil, ton)` çağrılıyor; **3. parametre `kategoriKodu` boş** — toplu üretimde 100 ürünlük Excel'de kozmetik allerjen / gıda sağlık iddiası kuralları devreye girmiyor.

**Düzeltme:** her satır için `kategoriKoduBul(satir.kategori || "")` çağır, sistemPromptOlustur'a 4. param olarak ver. Performans etkisi yok; bağlam küçük.

### P2-5 — Sosyal kit fotoğraflı kredi (4) chatbot prompt'unda yok

**Dosya:** `app/api/chat/route.ts`

Chatbot SYSTEM_PROMPT'ta:
```
- Sosyal medya: 1 kredi/platform · Kit (4 platform): 3 kredi
```
Gerçek: kit fotoğrafsız 3 kredi, fotoğraflı 4 kredi (kit/route.ts satır 59).

Kullanıcı "kit kaç kredi" diye soruyor, "3 kredi" cevabı alıyor; sonra fotoğraf yüklediğinde 4 kredi düşüyor → şikayet.

**Düzeltme:** chat prompt'a `Sosyal medya kiti: 3 kredi (fotoğrafsız) · 4 kredi (fotoğraf yüklenmişse)` ekle.

### P2-6 — `lib/constants.ts` GORSEL_STILLER label'larında emoji + Tailwind default rengi var

**Dosya:** `lib/constants.ts` satır 12-17 (PLATFORM_BILGI `renk` alanı `bg-orange-50 text-orange-700` vb.) ve satır 51-59 (GORSEL_STILLER `label` alanı `⬜ Beyaz Zemin`, `🏠 Lifestyle` vb.).

`CLAUDE.md` UI kuralları net: emoji yok, Tailwind default `bg-blue-*`/`bg-orange-*` yok. Bu sabitler UI'a sızıyor.

Kapsam dışı sayılabilir (UI sorumluluğunda) ama AI denetimi sırasında `GORSEL_STILLER` değerlerinin chatbot prompt'unda da kullanıldığını gördüm — chat şu an "beyaz zemin, koyu zemin..." metniyle yazıyor (emojisiz, manuel). Yani direkt kırılma yok ama sabit kaynak olarak duruyor.

**Düzeltme:** label'lardan emojiyi sök, ikon component'ini `lucide-react`'tan ayrı veri olarak ver. PLATFORM_BILGI'deki Tailwind default renkleri proje paletinden hex'e çevir.

---

## 6. Cowork için aksiyon listesi

> Cowork bu maddeleri `BACKLOG.md`'ye AI-13..AI-18 olarak işleyebilir; bir kısmı CONTENT-* prefix'i daha doğru.

### AI-13 — Blog paket/kredi/platform iddialarını gerçeklikle hizala (P1)

**Tek cümle:** `yzliste-kredi-sistemi-paketler.md` başta olmak üzere blog yazılarındaki Pro/Enterprise paket adlarını, "kullan ya da kaybet" iddiasını, "5 platform sosyal kit", "7 platform" gibi yanlış sayıları gerçek paket modeliyle (Başlangıç/Popüler/Büyük + süresiz kredi + 4 platform sosyal kit + 6 pazaryeri) değiştir.

**Bağlam:** chat SYSTEM_PROMPT (kaynak `lib/paketler.ts` + `lib/studio-constants.ts`) ile blog içerikleri direkt çelişiyor. Pazarlama vaadi tutmuyor, KVKK/TKHK yanıltıcı reklam riski.

**Etkilenen dosyalar:**
- `app/blog/posts/yzliste-kredi-sistemi-paketler.md` (tamamen yeniden yaz)
- `app/blog/posts/yzliste-ile-ilk-listing-2-dakikada.md` (Pro/Enterprise satırı düzelt)
- `app/blog/posts/yzliste-dashboard-kullanim-rehberi.md` ("5 platform" → "4 platform")
- `app/blog/posts/yzliste-coklu-pazaryeri-tek-panel.md` ve `ai-ile-toplu-listing-olusturma-zaman-tasarrufu.md`, `ai-metin-ureticileri-karsilastirma.md` ("7 platform" → "6 platform")

### AI-14 — `/uret/duzenle` kategori kuralları + yasaklı kelime ekle (P1)

**Tek cümle:** `app/api/uret/duzenle/route.ts` system prompt'una platform yasaklı kelime listesi ve kategori bazlı kuralları ekle.

**Bağlam:** AI-04 yarı kapanmış. İlk üretim YASAKLI_KELIMELER ve KATEGORI_KURALLARI ile korunuyor; "yeniden üret" / "ton değiştir" sonrası bu koruma kayboluyor.

**Etkilenen dosyalar:**
- `app/api/uret/duzenle/route.ts` — `YASAKLI_KELIMELER`, `KATEGORI_KURALLARI`, `kategoriKoduBul` import et, system prompt'a ekle.

### AI-15 — `/api/chat` rate limit ekle (P1)

**Tek cümle:** `/uret`'teki Upstash sliding-window pattern'ini `/api/chat` route'una uygula (per-user 30 req/dk).

**Bağlam:** Tek korunmasız LLM endpoint; bot/spam ile API kotası ve para yakar. Chat IP-bazlı bile değil.

**Etkilenen dosyalar:**
- `app/api/chat/route.ts`

### AI-16 — `stop_reason: "max_tokens"` yakala ve uyarı dön (P2)

**Tek cümle:** 6 LLM route'unda `data.stop_reason === "max_tokens"` kontrolü ekle, hem log'a düş hem üretim kaydında `truncated` flag tut.

**Bağlam:** Etsy 13 etiket veya Amazon USA 5 bullet eksikse kullanıcı sessizce yarım çıktı görüyor.

**Etkilenen dosyalar:**
- `app/api/uret/route.ts`, `app/api/uret/duzenle/route.ts`, `app/api/sosyal/route.ts`, `app/api/sosyal/kit/route.ts`, `app/api/toplu/route.ts`, `app/api/chat/route.ts`

### AI-17 — Çıktı doğrulamayı (`cikiyiDogrula`) helper'a çıkar ve 4 route'tan çağır (P2)

**Tek cümle:** `lib/prompts/metin.ts`'e `cikiyiDogrula(icerik, platform): { uyarilar: string[] }` helper ekle, `/uret/duzenle`, `/sosyal`, `/sosyal/kit`, `/toplu` route'larından çağır.

**Bağlam:** Şu an sadece `/uret` validasyon yapıyor. Düzenleme/toplu/sosyal akışlarında yasaklı kelime sızıntısı yakalanmıyor.

**Etkilenen dosyalar:**
- `lib/prompts/metin.ts` (helper ekle)
- 4 route dosyası

### AI-18 — `/sosyal/kit` DB log + `/toplu` kategori prompt + chat prompt fotoğraflı kit kredisi (P2 birleşik)

**Tek cümle:** Üç küçük tutarlılık fix'i: `sosyal/kit/route.ts` her caption'ı `sosyal_uretimler`'e logla; `toplu/route.ts` `sistemPromptOlustur`'a `kategoriKoduBul(satir.kategori)` ver; chat prompt'a "kit fotoğraflı 4 kredi" satırı ekle.

**Bağlam:** Üçü de küçük ama prompt kalitesi ve kullanıcı şikayet zinciri için önemli.

**Etkilenen dosyalar:**
- `app/api/sosyal/kit/route.ts`
- `app/api/toplu/route.ts`
- `app/api/chat/route.ts`

---

## 7. Pozitif bulgular

- **Merkezi `lib/ai-config.ts` çok iyi çalışıyor** — 6 LLM route'u da buradan çekiyor, hardcoded model ismi yok, temperature ve cost tek yerde. Önceki çalışmanın temizliği.
- **Marka bağlamı `/uret`'te tam:** `marka_adi`, `hedef_kitle`, `vurgulanan_ozellikler`, `magaza_kategorileri`, `fiyat_bandi`, `teslimat_vurgulari`, `benchmark_magaza` — yedi alan da prompt'a düşüyor. EN/TR çift dil de doğru.
- **Atomik kredi düşümü** her route'ta `gte("kredi", n)` ile, race condition yok.
- **Krediyi LLM çağrısından ÖNCE düşüp hata olursa iade etme** pattern'i tutarlı uygulanmış (502/500 dönüşlerinde refund çağrısı var).
- **Post-generation validation `/uret`'te** karakter limiti ve yasaklı kelime kontrolü ile çalışıyor; uyarı kullanıcıya dönüyor.
- **TON tanımları 7 ton × TR/EN + video map + görsel map** tüm route'larda tutarlı.
- **`prompt_version` kayıt** hem listing hem sosyal (single) tarafında DB'ye düşüyor — A/B test altyapısı hazır.

---

## 8. Metodoloji

- 14 maddelik checklist statik kod analiziyle geçildi (grep + dosya okuma).
- `lib/paketler.ts` + `lib/studio-constants.ts` + `lib/constants.ts` "tek kaynak" kabul edildi; karşı tarafta chatbot prompt + blog içerik + UI sayfaları check edildi.
- DB sorgusu yapılmadı (scheduled task, kullanıcı yok); maliyet trendi (madde 12) ve son 100 üretim örneklem (madde 10) bu turda çalıştırılmadı — bir sonraki manuel turda Aziz çalıştırırsa ekleyebiliriz.
- Prompt injection (madde 14): kod tarafında defansif sanitizasyon yok; system prompt'taki "Hiç ama hiç başka bir platform... konuşma" yönergesi savunma değil, niyet ifadesi. Risk düşük (chat'te kredi düşmüyor) ama §AI-15 rate limit'le birlikte değerlendirilmeli.

---

## 9. Sonraki hafta izlenecekler

1. AI-13'ün ne kadarı kapandı — blog yazıları gerçekten yeniden yazıldı mı, yoksa sadece kelime değiştirildi mi?
2. AI-14 sonrası `/uret/duzenle` çıktısında yasaklı kelime sızıyor mu — DB'den son 100 düzenleme örneklem alınmalı.
3. AI-15 sonrası `/chat` 429 dönüş oranı (Sentry'den).
4. AI-16 sonrası `truncated: true` üretim oranı — özellikle Etsy/Amazon USA için. %5'in üstündeyse max_tokens'ı 3000'e çıkar.
5. PROMPT_VERSION'ları artırma alışkanlığı: METIN ya da SOSYAL prompt değişirse `metin-v1.3` / `sosyal-v1.2` yapılmalı (bu turda atlandı, yeni eklenen düzenleme/toplu fix'leri prompt değiştirmiyor ama alışkanlık konsolide edilmeli).
6. Chatbot prompt'unda **referans paket adlarının tam doğru yazıldığını** her hafta otomatize doğrula (basit eşitlik: PAKET_LISTESI.map(p => p.isim) chat prompt içinde geçiyor mu).
