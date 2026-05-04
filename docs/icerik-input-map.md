# /uret — İçerik Input Haritası

> **Amaç:** `/uret` sayfasının 4 tab'ında (metin/görsel/video/sosyal) hangi input'un hangi state'den geldiğini, hangi API'a nasıl gittiğini ve prompt template'de nasıl kullanıldığını tek yerden görmek.
>
> **Okuma zamanı:** Bu tablo POST-HF-01 teşhisi sırasında yazılmıştır (2026-05-04). `❓` işareti = "gönderilmiyor veya doğrulanmamış aktarım" demektir.

---

## Paylaşılan Altyapı (Tüm Tab'lar)

### Ortak State (`app/uret/page.tsx`)

| State değişkeni | Tip | Default | Açıklama |
|---|---|---|---|
| `fotolar` | `string[]` | `[]` | Tek ürün fotoğrafı — tüm tab'lar paylaşır. `FileReader.readAsDataURL()` ile raw data URL olarak saklanır |
| `kullanici` | `Kullanici\|null` | `null` | Auth'dan gelen kullanıcı — id, kredi, ton, marka_adi içerir |
| `anaSekme` | `"metin"\|"gorsel"\|"video"\|"sosyal"\|null` | `null` | Aktif tab |

### Foto Yükleme (`tekFotoSec`)
```
Kullanıcı → input[type=file] → FileReader.readAsDataURL → fotolar[0] (raw base64 data URL)
```
- **Resize yok bu aşamada.** Her hook kendi `fetch()` çağrısından önce `resizeFoto(f, 1024)` çağırır.
- Sadece metin hook'u bunu yapmıyordu → POST-HF-01 fix ile eklendi (`claude/post-hf-01-incele`).

---

## Tab 1 — Metin (Listing Metni)

**State hook:** `lib/hooks/useMetinUretim.ts`  
**API:** `POST /api/uret/route.ts`

### Kullanıcı Input'ları

| Input adı | State değişkeni | Zorunlu / Opsiyonel | Default | API body field | Prompt'ta kullanım | Notlar |
|---|---|---|---|---|---|---|
| Ürün adı | `metin.urunAdi` | Zorunlu (manuel+barkod), opsiyonel (foto) | `""` | `urunAdi` | `Urun adi: ${urunAdi}` / `Product name: ${urunAdi}` (kullaniciBilgi) | Barkod modunda otomatik dolar |
| Kategori | `metin.kategori` | Zorunlu (manuel), opsiyonel (foto/barkod) | `""` | `kategori` | kullaniciBilgi'ye eklenir + `kategoriKoduBul()` ile kategori-spesifik sistem prompt kuralları seçilir | `kategoriKoduBul()` 8 kategoriyi eşler: kozmetik/elektronik/giyim/gida/ev/spor/cocuk/taki |
| Ürün detayları | `metin.ozellikler` | Opsiyonel | `""` | `ozellikler` | `Ek bilgi: ${ozellikler}` / `Additional details: ${ozellikler}` | Renk, beden, malzeme vb. |
| Hedef kitle | `metin.hedefKitle` | Opsiyonel | `"genel"` | `hedefKitle` | `Hedef kitle: ${hedefKitle}` (genel ise eklenmez) | Gelişmiş ayarlar altında |
| Fiyat segmenti | `metin.fiyatSegmenti` | Opsiyonel | `"orta"` | `fiyatSegmenti` | `FIYAT_SEGMENT_YONLENDIRME[fiyatSegmenti][dil]` sistem prompt'a eklenir | Gelişmiş ayarlar altında |
| Anahtar kelimeler | `metin.anahtarKelimeler` | Opsiyonel | `""` | `anahtarKelimeler` | `Oncelikli anahtar kelimeler: ${...}` / `Priority keywords: ${...}` | Görünür alan yok — ❓ UI'da exposed mı? |
| Markalı ürün | `metin.markaliUrun` | Opsiyonel | `false` | `markaliUrun` | `false` ise sistem prompt'a "hiçbir marka adı kullanma" kuralı eklenir | Görünür toggle yok — ❓ UI'da exposed mı? |
| Etsy etiketleri | `metin.etiketler` | Opsiyonel, max 13 | `[]` | `etiketler` | `Suggested tag ideas: ${join}` (sadece İngilizce/Etsy) | Sadece platform=etsy seçildiğinde görünür |
| Amazon backend terimleri | `metin.backendTerimler` | Opsiyonel, max 250 byte | `""` | `backendTerimler` | `Backend search term hints: ${...}` | Sadece amazon/amazon_usa'da görünür |
| Pazaryeri platform | `metin.platform` | Zorunlu | `"trendyol"` | `platform` | Sistem prompt seçer (kurallar, karakter limitleri, dil tr/en) | 7 seçenek: trendyol/hepsiburada/amazon/n11/etsy/amazon_usa/ciceksepeti |
| Giriş tipi | `metin.girisTipi` | Zorunlu | `"manuel"` | `girisTipi` | API'da `kullaniciBilgi` formatını belirler (foto/barkod/manuel dallanması) | "excel" seçeneği `/api/toplu`'ya gider, bu tabloya dahil değil |

### Fotoğraf Aktarımı

| Input adı | State değişkeni | Zorunlu / Opsiyonel | Default | API body field | Prompt'ta kullanım | Notlar |
|---|---|---|---|---|---|---|
| Ürün fotoğrafı | `fotolar` (shared) | Zorunlu (foto modu), opsiyonel (manuel) | `[]` | `fotolar` (base64 array) | Claude messages'a `image` content olarak eklenir (max 3 foto, 0-2 index) | **POST-HF-01 fix:** `resizeFoto(f, 1024)` çağrılarak boyut düşürülür |
| Barkod bilgi | `metin.barkodBilgi` | Barkod modunda zorunlu | `null` | `barkodBilgi` | `Urun adi / Marka / Kategori / Aciklama` olarak kullaniciBilgi'ye eklenir | `/api/barkod` endpoint'inden gelir |

### Dahili State (Kullanıcı Görmez)

| Input adı | State değişkeni | Default | API body field | Kullanım |
|---|---|---|---|---|
| Dil | `metin.dil` | `"tr"` | `dil` | `platformDil` hesaplamasında kullanılır (Etsy/Amazon USA → `"en"`) |
| Ücretsiz revize | internal ref | `false` | `ucretsizRevize` | `true` ise kredi düşülmez |
| Orijinal üretim ID | internal ref | `null` | `orijinalUretimId` | Ücretsiz revize DB doğrulaması için |
| Ton | `kullanici.ton` | `undefined` | `ton` | `sistemPromptOlustur()` içinde TON_TANIMLARI ile sistem prompt tonu seçilir |

### Marka Profili — `/api/uret` DB'den Okur

API, `userId` ile `profiles` tablosundan çektiği alanları `kullaniciBilgi`'ye "Marka baglami" bölümü olarak ekler.

| DB alanı | TR prompt | EN prompt | Boşsa davranış |
|---|---|---|---|
| `marka_adi` | `Marka: ${marka_adi}` | `Brand: ${marka_adi}` | Eklenmez |
| `hedef_kitle` | `Hedef kitle: ${hedef_kitle}` | `Target audience: ${hedef_kitle}` | Eklenmez |
| `vurgulanan_ozellikler` | `Vurgulanacak ozellikler: ${...}` | `Key selling points to emphasize: ${...}` | Eklenmez |
| `magaza_kategorileri` | `Mağaza kategorileri: ${join}` | `Store categories: ${join}` | Eklenmez |
| `fiyat_bandi` | `Fiyat bandı: ${fiyat_bandi}` | `Price segment: ${fiyat_bandi}` | Eklenmez |
| `teslimat_vurgulari` | `Hizmet vurguları: ${join}` | `Service highlights: ${join}` | Eklenmez |
| `benchmark_magaza` | `Referans mağaza tarzı: ${...}` | `Reference store style: ${...}` | Eklenmez |
| `ek_notlar` | `Ek marka notları: ${ek_notlar}` | `Additional brand notes: ${ek_notlar}` | Eklenmez |
| `ton` | *(sistem prompt'ta)* | *(sistem prompt'ta)* | `sistemPromptOlustur()` içinde TON_TANIMLARI lookup; boşsa tonsuz |

> **Not:** `ton` hem request body'den (`kullanici.ton`) hem DB'den (`profil.ton`) okunabilir. Route `ton` field'ını body'den alır; profil select'i `ton`'u içermiyor (HOTFIX'lerle eklenmedi). Tekillik için kontrol gerekli. ❓

### API Çıkışı

```json
{ "icerik": "...", "isAdmin": bool, "uretimId": "uuid", "skor": 0-100, "oneriler": ["..."], "uyarilar": ["..."] }
```

---

## Tab 2 — Görsel (Ürün Görseli)

**State hook:** `lib/hooks/useGorselUretim.ts`  
**API:** `POST /api/gorsel/route.ts`  
**Arka uç:** fal-ai/bria/product-shot (RMBG → Product Shot pipeline)

### Kullanıcı Input'ları

| Input adı | State değişkeni | Zorunlu / Opsiyonel | Default | API body field | Prompt'ta kullanım | Notlar |
|---|---|---|---|---|---|---|
| Ürün fotoğrafı | `fotolar[0]` (shared) | Zorunlu | — | `foto` (base64) | fal.storage.upload → RMBG → fal-ai/bria `image_url` | `resizeFoto(1024)` uygulanır |
| Stüdyo stili(ler) | `gorsel.seciliStiller` (Set) | Zorunlu, min 1 max 7 | `new Set()` | `stiller` (array) | Her stil için ayrı sahne prompt'u: `stilSahneleri[stil]` + brandContext | 7 stil: beyaz/koyu/lifestyle/mermer/ahsap/gradient/dogal + referans + ozel |
| Ek prompt | `gorsel.gorselEkPrompt` | Opsiyonel | `""` | `ekPrompt` | Sahne açıklamasına `, ${ekPrompt}` olarak eklenir | "Özel sahne" seçildiğinde tek girdi |
| Referans görsel | `gorsel.referansGorsel` | Opsiyonel (sadece "referans" stili) | `null` | `referansGorsel` | fal-ai `ref_image_url` olarak gönderilir | Sadece "referans" stili seçildiğinde aktif |
| Ürün adı | `metin.urunAdi` (shared) | — | — | ❓ **API'a gönderilmiyor** | Sadece GorselSekmesi UI'da bilgi olarak gösterilir | |
| Kategori | `metin.kategori` (shared) | — | — | ❓ **API'a gönderilmiyor** | Sadece GorselSekmesi UI'da gösterilir | |

### Marka Profili — `/api/gorsel` DB'den Okur

brandContext string'i oluşturulup sahne prompt'una eklenir (`, brand: X, tone: Y, ...`).

| DB alanı | brandContext katkısı | Boşsa |
|---|---|---|
| `marka_adi` | `brand: ${marka_adi}` | Eklenmez |
| `ton` | `TON_EN_MAP[ton]` — İngilizce ton açıklaması | Eklenmez |
| `hedef_kitle` | `targeted at: ${hedef_kitle}` | Eklenmez |
| `magaza_kategorileri` | `product categories: ${join}` | Eklenmez |
| `fiyat_bandi` | `price segment: ${fiyat_bandi}` | Eklenmez |
| `vurgulanan_ozellikler` | ❓ **Sorgulanmıyor** | — |
| `teslimat_vurgulari` | ❓ **Sorgulanmıyor** | — |
| `benchmark_magaza` | ❓ **Sorgulanmıyor** | — |
| `ek_notlar` | ❓ **Sorgulanmıyor** | — |

### API Çıkışı

```json
{ "jobs": [{ "requestId": "...", "label": "Beyaz Zemin", "stil": "beyaz" }], "isAdmin": bool }
```
Poll: `GET /api/gorsel/poll?requestId=...`

---

## Tab 3 — Video (Ürün Videosu)

**State hook:** `lib/hooks/useVideoUretim.ts`  
**API:** `POST /api/sosyal/video/route.ts`  
**Arka uç:** fal-ai/kling-video/v2.1/standard/image-to-video

### Kullanıcı Input'ları

| Input adı | State değişkeni | Zorunlu / Opsiyonel | Default | API body field | Prompt'ta kullanım | Notlar |
|---|---|---|---|---|---|---|
| Ürün fotoğrafı | `fotolar[0]` (shared) | Zorunlu | — | `foto` (base64) | fal.storage.upload → RMBG → Kling `image_url` | `resizeFoto(1024)` uygulanır |
| Video süresi | `video.videoSure` | Zorunlu | `"5"` | `sure` | Kling `duration` parametresi | `"5"` → 10 kredi, `"10"` → 20 kredi |
| Video formatı | `video.videoFormat` | Zorunlu | `"9:16"` | `format` | Kling `aspect_ratio` parametresi | `"9:16"\|"16:9"\|"1:1"` |
| Video prompt | `video.videoPrompt` | Opsiyonel | `""` | `prompt` | Doğrudan Kling `prompt` alanına gider | Boşsa API otomatik üretir (marka profili kullanarak) |
| Ürün adı | `metin.urunAdi` (shared) | — | — | ❓ **API'a gönderilmiyor** | Sadece VideoSekmesi UI'da gösterilir | |
| Kategori | `metin.kategori` (shared) | — | — | ❓ **API'a gönderilmiyor** | Sadece VideoSekmesi UI'da gösterilir | |

### Otomatik Prompt Üretimi (prompt boşsa)

API, request `prompt` boşsa `profiles` tablosundan marka bilgilerini çekip Kling prompt'u oluşturur:

```
${TON_VIDEO_MAP[ton] || default} for ${marka_adi}, appealing to ${hedef_kitle},
highlighting ${vurgulanan_ozellikler}, ${kategori} product,
camera slowly zooms in and holds on product, clean studio lighting, white background
```

| DB alanı | Otomatik prompt katkısı | Boşsa |
|---|---|---|
| `ton` | `TON_VIDEO_MAP[ton]` — stil ipucu | `TON_VIDEO_DEFAULT` |
| `marka_adi` | `for ${marka_adi}` | Atlanır |
| `hedef_kitle` | `appealing to ${hedef_kitle}` | Atlanır |
| `vurgulanan_ozellikler` | `highlighting ${vurgulanan_ozellikler}` | Atlanır |
| `magaza_kategorileri` | `${join} product` | Atlanır |
| `fiyat_bandi` | ❓ **Sorgulanmıyor** | — |
| `teslimat_vurgulari` | ❓ **Sorgulanmıyor** | — |
| `benchmark_magaza` | ❓ **Sorgulanmıyor** | — |
| `ek_notlar` | ❓ **Sorgulanmıyor** | — |

### API Çıkışı

```json
{ "requestId": "...", "isAdmin": bool, "kullanilanKredi": 10 }
```
Poll: `GET /api/sosyal/video/poll?requestId=...`

---

## Tab 4 — Sosyal Medya

**State hook:** `lib/hooks/useSosyalUretim.ts`  
3 bağımsız alt operasyon: caption / kit / sosyal görsel

---

### 4a. Caption Üret

**API:** `POST /api/sosyal/route.ts`

| Input adı | State değişkeni | Zorunlu / Opsiyonel | Default | API body field | Prompt'ta kullanım | Notlar |
|---|---|---|---|---|---|---|
| Ürün adı | `sosyal.sosyalUrunAdi` | Zorunlu | `""` | `urunAdi` | `Ürün: ${urunAdi}` | `metin.urunAdi` değiştiğinde otomatik sync olur |
| Ek bilgi | `sosyal.sosyalEkBilgi` | Opsiyonel | `""` | `ekBilgi` | `Ek bilgi: ${ekBilgi}` | |
| Sosyal platform | `sosyal.sosyalPlatform` | Zorunlu | `"instagram"` | `platform` | PLATFORM_KURALLAR lookup: uzunluk/hashtag/format kuralları | `"instagram"\|"tiktok"\|"facebook"\|"twitter"` |
| İçerik tonu | `sosyal.sosyalTon` | Zorunlu | `"tanitim"` | `ton` | "tanitim/indirim/hikaye" → kullanici mesajına ton açıklaması eklenir | |
| Sezon | `sosyal.sosyalSezon` | Opsiyonel | `"normal"` | `sezon` | SEZON_CONTEXT lookup → kullanici mesajına sezon bağlamı eklenir | 6 sezon: anneler_gunu/babalar_gunu/bayram/yilbasi/black_friday/sevgililer_gunu |

**Marka Profili — `/api/sosyal` DB'den Okur:**

| DB alanı | markaBaglami katkısı | Boşsa |
|---|---|---|
| `marka_adi` | `Marka adı: ${marka_adi}` | Eklenmez |
| `hedef_kitle` | `Hedef kitle: ${hedef_kitle}` | Eklenmez |
| `vurgulanan_ozellikler` | `Öne çıkarılacak özellikler: ${...}` | Eklenmez |
| `ton` (db) | `Marka tonu: ${ton || profil.ton}` | Eklenmez |
| `magaza_kategorileri` | `Mağaza kategorileri: ${join}` | Eklenmez |
| `teslimat_vurgulari` | `Hizmet vurguları: ${join}` | Eklenmez |
| `fiyat_bandi` | ❓ **Sorgulanmıyor** | — |
| `benchmark_magaza` | ❓ **Sorgulanmıyor** | — |
| `ek_notlar` | ❓ **Sorgulanmıyor** | — |

**Çıkış:** `{ "caption": "...", "hashtag": "..." }`

---

### 4b. Kit Üret (Tüm Platformlar Toplu)

**API:** `POST /api/sosyal/kit/route.ts`

| Input adı | State değişkeni | API body field | Notlar |
|---|---|---|---|
| Ürün adı | `sosyal.sosyalUrunAdi` | `urunAdi` | |
| Ek bilgi | `sosyal.sosyalEkBilgi` | `ekBilgi` | |
| İçerik tonu | `sosyal.sosyalTon` | `ton` | |
| Sezon | `sosyal.sosyalSezon` | `sezon` | |
| Foto | — | ❓ **Hook'tan gönderilmiyor** | Kit route `foto` field'ını kabul ediyor ama hook body'ye eklemiyor |
| Görsel format | — | ❓ **Hook'tan gönderilmiyor** | Route `gorselFormat` kabul ediyor, hook göndermez |
| Görsel stil | — | ❓ **Hook'tan gönderilmiyor** | Route `gorselStil` kabul ediyor, hook göndermez |

4 platform (instagram_tiktok/facebook/twitter/linkedin) için paralel caption üretir.

**Kredi:** `foto` varsa 4 kredi, yoksa 3 kredi.

**Marka profili:** caption üretimiyle aynı — `sosyal.route` ile aynı DB alanları.

**Çıkış:** `{ "captions": { "instagram_tiktok": {caption, hashtag}, ... }, "gorselUrls": [...], "kullanilanKredi": 3 }`

---

### 4c. Sosyal Görsel Üret

**API:** `POST /api/gorsel/route.ts` (Görsel tab ile aynı API)

| Input adı | State değişkeni | Zorunlu / Opsiyonel | Default | API body field | Notlar |
|---|---|---|---|---|---|
| Sosyal fotoğraf | `sosyal.sosyalFoto` | Zorunlu | `null` | `foto` | `resizeFoto(1024)` uygulanır; `fotolar[0]` otomatik sync |
| Görsel stili | `sosyal.sosyalGorselStil` | Zorunlu | `"beyaz"` | `stil` | 4 sosyal stil: beyaz/lifestyle/gradient/koyu |
| Ek prompt | `sosyal.sosyalGorselPrompt` | Opsiyonel | `""` | `ekPrompt` | |
| Görsel format | `sosyal.sosyalGorselFormat` | Zorunlu | `"1:1"` | `sosyalFormat` | `"1:1"\|"9:16"\|"16:9"` — `pozisyonSec()` ve shotSize'ı belirler |

Marka profili: Görsel tab ile aynı — `/api/gorsel` DB lookup.

---

## Marka Profili — 9 Alan, Tab Bazlı Kapsam

> `profiles` tablosundaki marka profili alanlarının hangi API'lar tarafından okunduğu ve prompt'a nasıl aktarıldığı.

| DB alanı | /api/uret (Metin) | /api/gorsel (Görsel/SosyalGörsel) | /api/sosyal/video (Video) | /api/sosyal (Caption) | /api/sosyal/kit (Kit) |
|---|:---:|:---:|:---:|:---:|:---:|
| `marka_adi` | ✅ kullaniciBilgi | ✅ brandContext | ✅ auto-prompt | ✅ markaBaglami | ✅ markaBaglami |
| `ton` | ✅ sistemPrompt | ✅ TON_EN_MAP | ✅ TON_VIDEO_MAP | ✅ markaBaglami | ✅ markaBaglami |
| `hedef_kitle` | ✅ kullaniciBilgi | ✅ brandContext | ✅ auto-prompt | ✅ markaBaglami | ✅ markaBaglami |
| `vurgulanan_ozellikler` | ✅ kullaniciBilgi | ❌ sorgulanmıyor | ✅ auto-prompt | ✅ markaBaglami | ✅ markaBaglami |
| `magaza_kategorileri` | ✅ kullaniciBilgi | ✅ brandContext | ✅ auto-prompt | ✅ markaBaglami | ✅ markaBaglami |
| `fiyat_bandi` | ✅ kullaniciBilgi | ✅ brandContext | ❌ sorgulanmıyor | ❌ sorgulanmıyor | ❌ sorgulanmıyor |
| `teslimat_vurgulari` | ✅ kullaniciBilgi | ❌ sorgulanmıyor | ❌ sorgulanmıyor | ✅ markaBaglami | ✅ markaBaglami |
| `benchmark_magaza` | ✅ kullaniciBilgi | ❌ sorgulanmıyor | ❌ sorgulanmıyor | ❌ sorgulanmıyor | ❌ sorgulanmıyor |
| `ek_notlar` | ✅ kullaniciBilgi | ❌ sorgulanmıyor | ❌ sorgulanmıyor | ❌ sorgulanmıyor | ❌ sorgulanmıyor |

---

## Pazaryeri Platform Seçimi

| Alan | State | Default | Endpoint | Nasıl kullanılır |
|---|---|---|---|---|
| Pazaryeri | `metin.platform` | `"trendyol"` | `/api/uret` body: `platform` | Sistem prompt seçer (PLATFORM_KURALLARI), dil (tr/en), karakter limitleri, yasaklı kelimeler |
| Sosyal platform | `sosyal.sosyalPlatform` | `"instagram"` | `/api/sosyal` body: `platform` | PLATFORM_KURALLAR lookup — tamamen bağımsız alan |

**Pazaryeri seçimi sadece metin tab'ına özeldir.** Görsel/video/sosyal tab'ları pazaryeri seçimini API'larına göndermez.

---

## ❓ Kontrol Gerek Listesi

Teşhis/geliştirme aşamasında doğrulanmamış veya tutarsız aktarımlar:

1. **`metin.anahtarKelimeler`** — State'de var, API body'e gidiyor ama `/uret` sayfası UI'da expose edilmiyor. Kullanılabilir durumda ama kullanıcı göremiyor.

2. **`metin.markaliUrun`** — State'de var, API body'e gidiyor (`false` = marka adı kullanma) ama UI'da toggle yok. Default `false` — tüm üretimler marka yasak kuralıyla çalışıyor.

3. **`metin.ton` vs `profil.ton`** — Route body'den `ton: kullanici.ton` alıyor. `kullanici` state'i login'de `profiles.ton` değerini çekiyor. Profiles select sorgusu `/api/uret`'te `ton` field'ını içermiyor (not: sadece `is_admin, is_test, marka_adi, hedef_kitle, vurgulanan_ozellikler, magaza_kategorileri, fiyat_bandi, teslimat_vurgulari, benchmark_magaza, ek_notlar`). Sistem prompt tonu body'den gelen ton'a göre seçiliyor, DB'den re-read yok.

4. **Görsel tab: `urunAdi` + `kategori` API'a gitmiyor** — GorselSekmesi UI'da bu bilgileri gösteriyor ama `/api/gorsel` body'e eklenmiyor. Sahne prompt'u ürün bilgisini içermiyor (sadece marka profili bağlamı var).

5. **Video tab: `urunAdi` + `kategori` API'a gitmiyor** — Aynı sorun. Auto-prompt'ta ürün adı yok, sadece marka adı var.

6. **Kit route `foto`/`gorselFormat`/`gorselStil` kabul ediyor ama hook göndermez** — Kit route bu field'larla görsel üretim yapabiliyor (`hasFoto = true` → 4 kredi, RMBG + product-shot pipeline). Ancak `kitUret()` hook'u bu field'ları body'e eklemiyor. "Görsel ile kit" özelliği tamamlanmamış görünüyor.

7. **`vurgulanan_ozellikler` görsel API'da eksik** — Müşterinin öne çıkan özelliklerini sahne prompt'una dahil etmek mümkün ama `/api/gorsel` bu alanı sorgulamıyor.

8. **`benchmark_magaza` + `ek_notlar` sadece metin API'da** — En zengin marka context sadece `/api/uret`'te. Görsel/video/sosyal API'larında referans mağaza tarzı ve ek notlar kullanılmıyor.

9. **`fiyat_bandi` sosyal/video API'larında eksik** — Fiyat segmenti metin'de hem kullanıcı inputu (`fiyatSegmenti`) hem marka profilinden (`fiyat_bandi`) geliyor. Sosyal ve video API'larında hiç yer almıyor.

---

## Akış Özeti (Metin Tab — Foto Modu)

```
Kullanıcı foto yükler → FileReader.readAsDataURL() → fotolar[0] (raw)
        ↓
"İçerik üret" tıklar → icerikUret()
        ↓
resizeFoto(fotolar[0], 1024) → fotolarResized[0] (max 1024px JPEG 0.85)
        ↓
POST /api/uret { fotolar: [fotolarResized[0]], girisTipi: "foto", ... }
        ↓
Route: base64 split → Claude messages image content
        ↓
Anthropic API: [image, text("Bu urun fotografina bakarak icerik uret...")] → sistemPrompt
        ↓
Response: { icerik, skor, oneriler, uretimId }
```

---

*Son güncelleme: 2026-05-04 — `claude/input-map-01` branch, POST-HF-01 teşhisi kapsamında*
