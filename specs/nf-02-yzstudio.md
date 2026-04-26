### NF-02: yzstudio — Premium / Deneysel Araçlar Sayfası (P1 — yeni sayfa)

> **KARAR (20 Nisan 2026):** Eski NF-02 (görsel sekmesine try-on ekleme) iptal edildi.
> Yerine: bağımsız `/yzstudio` sayfası — pahalı/deneysel modeller burada yaşar.
> Ana site (`/uret`) standart araçlarla sınırlı kalır, yzstudio premium tier olur.

---

#### MİMARİ GENEL BAKIŞ

**İsim:** yzstudio (marka kimliği — "premium" geçici his verir, "studio" kalıcı)

**Erişim:**
- URL: `/yzstudio` — şimdilik navigasyonda link yok, sadece URL ile erişim
- Auth zorunlu (middleware'e ekle)
- İleride ana sayfadan "🧪 yzstudio" badge'i ile keşfedilebilir

**Sayfa yapısı — Sekme tabanlı multi-tool:**
```
/yzstudio
├── Sekme 1: 👗 Mankene Giydirme (Virtual Try-On) ← ilk model
├── Sekme 2: [gelecek model — örn. Seedance Premium Video]
├── Sekme 3: [gelecek model — örn. AI Background Replace]
└── ...genişleyebilir
```

Her sekme bağımsız bir tool — kendi input/output/kredi mantığı var.
Sekmeler arası paylaşılan: auth, kredi bakiyesi, kredi yükleme modal, header.

**Neden ayrı sayfa (ve /uret içine gömmemek):**
1. Maliyet farkı çok büyük: try-on 3 kredi, görsel 1 kredi — aynı arayüzde karışır
2. İleride başka premium modeller eklenecek (Seedance, background replace, vb.)
3. UX: ana üretim akışı basit kalmalı, deneysel araçlar ayrı bir "lab" hissi vermeli
4. Fiyatlama esnekliği: yzstudio araçları farklı kredi paketleriyle fiyatlanabilir

---

#### ROUTE & DOSYA YAPISI

```
app/
├── yzstudio/
│   ├── layout.tsx          ← Auth guard + yzstudio shell (header, kredi, sekmeler)
│   ├── page.tsx             ← Ana sayfa: sekme yönetimi + içerik render
│   └── components/
│       ├── StudioHeader.tsx  ← "yzstudio" logosu + kredi bakiye + sekme nav
│       ├── StudioSekmeler.tsx ← Sekme listesi (dinamik, STUDIO_TOOLS constant'tan)
│       └── tryon/
│           ├── TryonSekmesi.tsx      ← Ana try-on UI (tüm akış)
│           ├── GarmentUpload.tsx     ← Kıyafet fotoğrafı yükleme alanı
│           ├── ModelPicker.tsx       ← Manken seçimi (stok grid + özel yükleme)
│           ├── TryonAyarlar.tsx      ← Kategori, kalite modu, num_samples seçimi
│           ├── TryonSonuc.tsx        ← Sonuç galerisi + indirme
│           └── useTryonUretim.ts     ← Custom hook (state + API çağrıları)
│
api/
├── studio/
│   └── tryon/
│       ├── route.ts          ← POST: kredi düş → fal.ai FASHN çağır → requestId dön
│       └── poll/route.ts     ← GET: job durumu sorgula → sonuç URL'leri dön
```

**Neden `api/studio/tryon/` (ve `api/gorsel/tryon/` değil):**
yzstudio araçları ana üretim API'sinden ayrı namespace'te olmalı. İleride `api/studio/premium-video/`, `api/studio/bg-replace/` vb. eklenecek.

---

#### FASHN v1.6 API — TAM PARAMETRE HARİTASI

**Endpoint:** `fal-ai/fashn/tryon/v1.6`
**Maliyet:** $0.075/görsel (num_samples'tan bağımsız — her sample ayrı ücret)
**Çıktı:** 864×1296 px native (v1.6), PNG URL array

| Parametre | Tip | Varsayılan | Kullanıcıya Aç | Açıklama |
|---|---|---|---|---|
| `model_image` | URL | zorunlu | ✅ stok seç veya yükle | Manken fotoğrafı |
| `garment_image` | URL | zorunlu | ✅ yükle | Kıyafet fotoğrafı |
| `category` | enum | `"auto"` | ✅ dropdown | `tops`, `bottoms`, `one-pieces`, `auto` |
| `garment_photo_type` | enum | `"auto"` | ✅ radio | `model` (mankendeki), `flat-lay` (düz/askı), `auto` |
| `mode` | enum | `"balanced"` | ✅ radio | `performance` (hızlı), `balanced` (önerilen), `quality` (en iyi) |
| `num_samples` | int | 1 | ✅ slider 1-4 | Üretilecek varyasyon sayısı |
| `seed` | int | random | ❌ gizli | Tekrarlanabilirlik için (sadece debug) |
| `segmentation_free` | bool | true | ❌ gizli | v1.6'da her zaman true |
| `moderation_level` | enum | `"permissive"` | ❌ gizli | İçerik denetimi — biz "permissive" sabit tutarız |

---

#### KREDİ & FİYATLAMA — DİNAMİK HESAPLAMA

**Temel birim:** 3 kredi = 1 görsel (1 sample)
**num_samples ile ölçekleme:**

| num_samples | API Maliyeti | Kredi | Büyük Paket Fiyatı | Marj |
|---|---|---|---|---|
| 1 | $0.075 | 3 kredi | ₺7.47 | +122% |
| 2 | $0.150 | 6 kredi | ₺14.94 | +122% |
| 3 | $0.225 | 9 kredi | ₺22.41 | +122% |
| 4 | $0.300 | 12 kredi | ₺29.88 | +122% |

**Dinamik hesaplama formülü:**
```typescript
// lib/constants.ts veya lib/studio-constants.ts
export const STUDIO_KREDI = {
  tryon: {
    birimKredi: 3,  // 1 sample = 3 kredi
    minSamples: 1,
    maxSamples: 4,
    hesapla: (numSamples: number) => numSamples * 3,
  },
  // gelecek modeller buraya eklenir
} as const;
```

**Frontend'de gerçek zamanlı kredi gösterimi:**
Kullanıcı num_samples slider'ını kaydırdıkça buton dinamik güncellenir:
- `num_samples=1` → `[Mankene Giydirme — 3 kredi]`
- `num_samples=2` → `[Mankene Giydirme — 6 kredi]`
- `num_samples=4` → `[Mankene Giydirme — 12 kredi]`

**Not:** `mode` (performance/balanced/quality) fiyatı ETKİLEMEZ — sadece hız/kalite tradeoff. API maliyeti aynı.

---

#### KULLANICI AKIŞI (TryonSekmesi.tsx)

**Adım 1 — Kıyafet Fotoğrafı:**
```
┌─────────────────────────────────────────────┐
│  👕 Kıyafet Fotoğrafı                       │
│  ┌─────────────────────────────┐            │
│  │                             │            │
│  │   [Fotoğraf yükle veya     │            │
│  │    sürükle bırak]          │            │
│  │                             │            │
│  └─────────────────────────────┘            │
│                                              │
│  Fotoğraf Tipi: (●) Otomatik  ○ Düz/Askı   │
│                 ○ Mankendeki                 │
│                                              │
│  Kategori: (●) Otomatik ○ Üst ○ Alt        │
│            ○ Tek Parça (elbise/tulum)       │
└─────────────────────────────────────────────┘
```

**Adım 2 — Manken Seçimi:**
```
┌─────────────────────────────────────────────┐
│  👤 Manken Seçimi                            │
│                                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │Kadın │ │Kadın │ │Erkek │ │Erkek │       │
│  │  1   │ │  2   │ │  1   │ │  2   │       │
│  │  ✓   │ │      │ │      │ │      │       │
│  └──────┘ └──────┘ └──────┘ └──────┘       │
│                                              │
│  ┌──────┐                                    │
│  │  +   │  Kendi mankeninizi yükleyin       │
│  └──────┘                                    │
└─────────────────────────────────────────────┘
```

**Adım 3 — Ayarlar + Üret:**
```
┌─────────────────────────────────────────────┐
│  ⚙️ Ayarlar                                  │
│                                              │
│  Kalite: ○ Hızlı  (●) Dengeli  ○ En İyi    │
│                                              │
│  Varyasyon: [===●======] 1                   │
│             1 varyasyon = 3 kredi            │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  👗 Mankene Giydirme — 3 kredi      │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ℹ️ Kalan bakiye: 27 kredi                   │
└─────────────────────────────────────────────┘
```

**Adım 4 — Sonuç:**
```
┌─────────────────────────────────────────────┐
│  ✅ Sonuç (1/1 varyasyon)                    │
│                                              │
│  ┌─────────────────────┐                    │
│  │                     │                    │
│  │   [Giydirme sonucu] │                    │
│  │   864×1296 px       │                    │
│  │                     │                    │
│  └─────────────────────┘                    │
│                                              │
│  [⬇️ İndir]  [🔄 Tekrar Üret]              │
└─────────────────────────────────────────────┘
```

---

#### API ROUTE — `app/api/studio/tryon/route.ts`

```typescript
// POST /api/studio/tryon
// Input: { garmentImage: base64, modelImage: base64|stockId, category, garmentPhotoType, mode, numSamples, userId }

// Akış:
// 1. Auth doğrula (supabase admin)
// 2. Stok manken mi özel yükleme mi? → stockId ise public/mankenler/ URL'i al
// 3. Her iki görseli fal.storage.upload() ile yükle
// 4. Opsiyonel: garment_image'a RMBG uygula (arka plan temizleme — kaliteyi artırır)
// 5. Kredi hesapla: numSamples * 3
// 6. Atomik kredi düşümü (mevcut krediDus helper)
// 7. fal.queue.submit("fal-ai/fashn/tryon/v1.6", { input: { ... } })
// 8. Hata durumunda: krediIade()
// 9. Return { requestId, kullanilanKredi }
```

**Stok manken yönetimi:**
```typescript
// lib/studio-constants.ts
export const STOK_MANKENLER = [
  { id: "kadin-1", label: "Kadın 1", url: "/mankenler/kadin-1.jpg", cinsiyet: "kadin" },
  { id: "kadin-2", label: "Kadın 2", url: "/mankenler/kadin-2.jpg", cinsiyet: "kadin" },
  { id: "erkek-1", label: "Erkek 1", url: "/mankenler/erkek-1.jpg", cinsiyet: "erkek" },
  { id: "erkek-2", label: "Erkek 2", url: "/mankenler/erkek-2.jpg", cinsiyet: "erkek" },
] as const;
```

**Stok fotoğraf gereksinimleri:**
- Tam boy (baş-ayak), düz arka plan (beyaz veya açık gri)
- 1000×1500 px minimum, dikey oryantasyon
- Doğal poz — cepheden, hafif açı OK, oturma yok
- Yüz görünür (FASHN identity koruma için gerekli)
- Ticari lisanslı stok fotoğraf (Unsplash, Pexels veya satın alınmış)
- 4 adet: kadın×2 (farklı vücut tipi), erkek×2 (farklı vücut tipi)
- Dosya yolu: `public/mankenler/kadin-1.jpg`, `kadin-2.jpg`, `erkek-1.jpg`, `erkek-2.jpg`

---

#### POLL ROUTE — `app/api/studio/tryon/poll/route.ts`

```typescript
// GET /api/studio/tryon/poll?requestId=xxx
// Mevcut gorsel/poll pattern'ini takip et:
// fal.queue.status() → { status, result }
// status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED"
// result.images: [{ url, content_type }]
```

**Frontend polling (useTryonUretim.ts):**
- Interval: 3 saniye (FASHN v1.6 balanced ~15-30 sn, quality ~30-60 sn)
- Max retry: 60 (= 3 dakika timeout)
- Progress feedback: "Kıyafetiniz giydiriliyor..." → "Sonuçlar hazırlanıyor..."

---

#### HOOK — `useTryonUretim.ts`

```typescript
interface TryonState {
  // Input
  garmentFoto: string | null;           // base64
  garmentPhotoType: "auto" | "flat-lay" | "model";
  category: "auto" | "tops" | "bottoms" | "one-pieces";
  modelSecimi: string | null;           // stockId veya base64 (özel yükleme)
  modelKaynagi: "stok" | "ozel";
  mode: "performance" | "balanced" | "quality";
  numSamples: number;                   // 1-4

  // Output
  sonuclar: { url: string; index: number }[];
  yukleniyor: boolean;
  hata: string | null;
  ilerleme: string;                     // "Kıyafet hazırlanıyor..." vb.

  // Computed
  toplamKredi: number;                  // numSamples * 3
}
```

---

#### VIDEO TRY-ON — 2 Aşamalı Pipeline (FASHN → Kling)

> **Konsept:** Tek seferde video try-on yapan bir model yok. Ama çok daha iyi bir şey var:
> FASHN ile giydirme sonucu al (statik görsel) → o görseli Kling v2.1'e ver → manken kıyafetle yürüsün.
> Kullanıcı önce statik sonucu görür, beğenirse "Videoya Dönüştür" der.

**Neden ayrı sekme DEĞİL:**
Bu, try-on'un doğal uzantısı — ayrı bir araç değil. Kullanıcı try-on sonucunu gördükten sonra "bunu videoya çevir" demek istiyor. Ayrı sekmeye gidip tekrar aynı görseli yüklemek anlamsız.

**Akış (TryonSonuc.tsx içinde):**

```
┌─────────────────────────────────────────────┐
│  ✅ Giydirme Sonucu                          │
│                                              │
│  ┌─────────────────────┐                    │
│  │                     │                    │
│  │   [Manken + kıyafet]│                    │
│  │   864×1296 px       │                    │
│  │                     │                    │
│  └─────────────────────┘                    │
│                                              │
│  [⬇️ İndir]  [🔄 Tekrar Üret]              │
│                                              │
│  ────────────────────────────────────────    │
│                                              │
│  🎬 Bu görseli videoya dönüştür              │
│                                              │
│  Hareket Stili:                              │
│  (●) Podyum Yürüyüşü   ○ 360° Dönüş       │
│  ○ Doğal Poz            ○ Rüzgar Efekti     │
│                                              │
│  Süre: (●) 5 saniye [10 kredi]              │
│        ○ 10 saniye [20 kredi]               │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  🎬 Videoya Dönüştür — 10 kredi     │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ℹ️ Giydirme sonucu videoda canlandırılır    │
└─────────────────────────────────────────────┘
```

**Video sonrası:**
```
┌─────────────────────────────────────────────┐
│  🎬 Video Hazır                              │
│                                              │
│  ┌─────────────────────┐                    │
│  │                     │                    │
│  │   ▶ [Video player]  │                    │
│  │   5 sn              │                    │
│  │                     │                    │
│  └─────────────────────┘                    │
│                                              │
│  [⬇️ Video İndir]                           │
└─────────────────────────────────────────────┘
```

**Teknik pipeline:**
1. Kullanıcı try-on sonucunu alır (FASHN v1.6 → statik görsel, 3 kredi zaten harcanmış)
2. "Videoya Dönüştür" tıklar → hareket stili + süre seçer
3. API: try-on sonuç URL'ini alır → Kling v2.1 Standard image-to-video'ya gönderir
4. Prompt: hareket stiline göre fashion-specific prompt (aşağıda detay)
5. Sonuç: 5 veya 10 saniyelik video

**Maliyet tablosu:**

| İşlem | API Maliyeti | Kredi | Açıklama |
|---|---|---|---|
| Try-on (statik) | $0.075 | 3 kredi | FASHN v1.6 |
| Video 5sn | $0.28 | 10 kredi | Kling v2.1 Std |
| Video 10sn | $0.56 | 20 kredi | Kling v2.1 Std |
| **Toplam: try-on + 5sn video** | **$0.355** | **13 kredi** | **₺32.37 @ Büyük** |
| **Toplam: try-on + 10sn video** | **$0.635** | **23 kredi** | **₺57.27 @ Büyük** |

**Neden krediyi ayrı düşüyoruz (kombine paket DEĞİL):**
- Kullanıcı her try-on'u videoya dönüştürmek istemeyebilir
- Önce statik sonucu görüp kaliteyi değerlendirmeli
- Kombine paket "ya video kötü çıkarsa" riskini kullanıcıya yıkar

**Fashion Video Presets (moda-spesifik promptlar):**

```typescript
// lib/studio-constants.ts
export const TRYON_VIDEO_PRESETLER = [
  {
    id: "podyum",
    etiket: "Podyum Yürüyüşü",
    ikon: "👠",
    aciklama: "Manken kameraya doğru özgüvenli yürür",
    prompt: "Fashion model walking confidently towards camera on a clean white runway, professional catwalk stride, subtle hip movement, garment flowing naturally with each step, studio lighting, fashion show atmosphere",
  },
  {
    id: "donus",
    etiket: "360° Dönüş",
    ikon: "🔄",
    aciklama: "Manken yerinde dönerek kıyafeti her açıdan gösterir",
    prompt: "Fashion model slowly turning 360 degrees in place, showing the garment from all angles, smooth rotation, clean studio background, soft directional lighting, full body visible",
  },
  {
    id: "dogal",
    etiket: "Doğal Poz",
    ikon: "🧍",
    aciklama: "Hafif hareketlerle doğal duruş",
    prompt: "Fashion model in a relaxed natural pose, subtle weight shifting, gentle hand movement, soft smile, clean studio background, lifestyle feel, natural lighting",
  },
  {
    id: "ruzgar",
    etiket: "Rüzgar Efekti",
    ikon: "💨",
    aciklama: "Kumaş rüzgarda hareketlenir, dramatik his",
    prompt: "Fashion model standing with wind blowing through the garment, fabric flowing dramatically, hair moving gently, cinematic studio lighting, editorial fashion photography feel",
  },
] as const;
```

**API Route — `app/api/studio/tryon/video/route.ts`:**

```typescript
// POST /api/studio/tryon/video
// Input: { tryonImageUrl: string, preset: string, sure: "5"|"10", userId: string }

// Akış:
// 1. Auth doğrula
// 2. tryonImageUrl geçerli mi kontrol et (fal.ai URL olmalı)
// 3. Kredi hesapla: VIDEO_KREDI[sure] (10 veya 20)
// 4. Atomik kredi düşümü
// 5. TRYON_VIDEO_PRESETLER'den prompt al
// 6. fal.queue.submit("fal-ai/kling-video/v2.1/standard/image-to-video", {
//      input: {
//        image_url: tryonImageUrl,
//        prompt: preset.prompt,
//        duration: sure === "5" ? "5" : "10",
//        aspect_ratio: "9:16",  // dikey — moda için en uygun
//      }
//    })
// 7. Return { requestId, kullanilanKredi }
```

**Poll:** Mevcut `api/studio/tryon/poll/route.ts` yeniden kullanılabilir — veya ayrı `api/studio/tryon/video/poll/route.ts` endpoint.

**Hook güncellemesi — `useTryonUretim.ts` genişletmesi:**

```typescript
interface TryonState {
  // ... mevcut try-on state (yukarıda tanımlı)

  // Video ek state
  videoAktif: boolean;              // "Videoya Dönüştür" bölümü açık mı
  videoPreset: string;              // "podyum" | "donus" | "dogal" | "ruzgar"
  videoSure: "5" | "10";
  videoSonuc: { url: string } | null;
  videoYukleniyor: boolean;
  videoHata: string | null;
  videoIlerleme: string;
  videoKredi: number;               // computed: VIDEO_KREDI[videoSure]
}
```

---

#### DOSYA YAPISI GÜNCELLEMESİ (Video Try-On dahil)

```
app/
├── yzstudio/
│   ├── layout.tsx
│   ├── page.tsx
│   └── components/
│       ├── StudioHeader.tsx
│       ├── StudioSekmeler.tsx
│       └── tryon/
│           ├── TryonSekmesi.tsx
│           ├── GarmentUpload.tsx
│           ├── ModelPicker.tsx
│           ├── TryonAyarlar.tsx
│           ├── TryonSonuc.tsx          ← statik sonuç + "Videoya Dönüştür" bölümü
│           ├── TryonVideoAyarlar.tsx   ← YENİ: preset seçimi, süre, kredi gösterimi
│           ├── TryonVideoSonuc.tsx     ← YENİ: video player + indirme
│           └── useTryonUretim.ts       ← genişletildi: video state + API
│
api/
├── studio/
│   └── tryon/
│       ├── route.ts                    ← POST: FASHN try-on (statik)
│       ├── poll/route.ts               ← GET: try-on job polling
│       └── video/
│           ├── route.ts                ← POST: Kling video (try-on sonucundan)
│           └── poll/route.ts           ← GET: video job polling
```

---

#### LAYOUT — `app/yzstudio/layout.tsx`

```typescript
// Auth guard + yzstudio shell
// 1. Server-side: kullanıcı yoksa /giris?redirect=/yzstudio
// 2. Ortak header: "yzstudio" logo + kredi bakiye + kredi yükle butonu
// 3. Ortak footer: bilgi notu "yzstudio deneysel araçlar içerir"
// 4. Children render (page.tsx sekme içeriği)
```

**StudioHeader tasarımı:**
- Sol: "yzstudio" yazısı (Geist font, indigo-400, küçük "beta" badge)
- Orta: Sekme navigasyon (tek sekme şimdilik, ileride büyüyecek)
- Sağ: Kredi bakiyesi + [Kredi Yükle] butonu
- Stil: koyu arka plan (slate-900), ana siteden farklı his — "lab" ortamı

---

#### MIDDLEWARE GÜNCELLEMESİ

`middleware.ts` → PROTECTED_PATHS dizisine `/yzstudio` ekle:
```typescript
const PROTECTED_PATHS = ['/app', '/hesap', '/kredi-yukle', '/admin', '/yzstudio']
```

---

#### İMPLEMENTASYON SIRASI (Claude Code İçin)

**Faz 1 — Altyapı (önce yap):**
- [ ] `middleware.ts` → `/yzstudio` koruma ekle
- [ ] `lib/studio-constants.ts` → STUDIO_KREDI, STOK_MANKENLER, STUDIO_TOOLS tanımla
- [ ] `app/yzstudio/layout.tsx` → Auth guard + shell
- [ ] `app/yzstudio/page.tsx` → Sekme yönetimi (şimdilik tek sekme: tryon)
- [ ] `app/yzstudio/components/StudioHeader.tsx` → Logo + kredi + sekme nav

**Faz 2 — API (backend):**
- [ ] `app/api/studio/tryon/route.ts` → POST handler (kredi düş → fal FASHN çağır)
- [ ] `app/api/studio/tryon/poll/route.ts` → GET handler (job durumu sorgula)
- [ ] `app/api/studio/tryon/video/route.ts` → POST handler (try-on sonucu → Kling video)
- [ ] `app/api/studio/tryon/video/poll/route.ts` → GET handler (video job polling)
- [ ] RMBG ön-işleme: garment_image'a `rmbgUygula()` çağır (mevcut helper)
- [ ] Stok manken URL'lerini fal.storage'a yükleme logic'i (veya public URL direkt kullan)

**Faz 3 — Frontend (UI):**
- [ ] `app/yzstudio/components/tryon/GarmentUpload.tsx` → Drag-drop kıyafet yükleme
- [ ] `app/yzstudio/components/tryon/ModelPicker.tsx` → Stok grid + özel yükleme
- [ ] `app/yzstudio/components/tryon/TryonAyarlar.tsx` → Kategori, mod, num_samples
- [ ] `app/yzstudio/components/tryon/TryonSonuc.tsx` → Sonuç galerisi + indirme + "Videoya Dönüştür" bölümü
- [ ] `app/yzstudio/components/tryon/TryonVideoAyarlar.tsx` → Video preset seçimi, süre, dinamik kredi
- [ ] `app/yzstudio/components/tryon/TryonVideoSonuc.tsx` → Video player + indirme
- [ ] `app/yzstudio/components/tryon/TryonSekmesi.tsx` → Ana container (tüm parçaları birleştir)
- [ ] `lib/hooks/useTryonUretim.ts` → Custom hook (try-on + video state + API + polling)

**Faz 4 — Assets + Polish:**
- [ ] Stok manken görselleri hazırla: `public/mankenler/` (4 adet, ticari lisanslı)
- [ ] Kredi onay dialogu (NF-06 pattern'i): "Bu işlem X kredi harcar. Devam?"
- [ ] Hata mesajları Türkçe: yetersiz kredi, yükleme hatası, API timeout
- [ ] Loading state: skeleton/spinner + ilerleme mesajları
- [ ] Responsive: mobilde de çalışsın (tek kolon layout)

**Faz 5 — Production Test Planı**

> **Önkoşul:** Test hesabı (test@gmail.com / 111111), en az 60 kredi yüklü.
> **URL:** yzliste.com/yzstudio

**Blok A — Temel try-on akışı (önce bunları geç)**

- [ ] A1: Flat-lay t-shirt + Kadın 1 manken + balanced + 1 sample → 3 kredi düşmeli, ~20-40 sn sonuç
- [ ] A2: On-model kıyafet (garment_photo_type=model) + Erkek 1 manken → sonuç kalitesini gözlemle
- [ ] A3: Elbise (kategori=one-pieces) + Kadın 2 manken → kategori doğru algılanmalı
- [ ] A4: Pantolon (kategori=bottoms) + Erkek 2 manken → kredi 3 düşmeli, sonuç makul görünmeli
- [ ] A5: num_samples=2 → Kadın 3 manken + flat-lay → **6 kredi** düşmeli, **2 görsel** gelmeli

**Blok B — Özel manken yükleme**

- [ ] B1: Kendi fotoğrafını manken olarak yükle (düz arka plan, tam boy) → try-on çalışmalı
- [ ] B2: Uygunsuz görsel yükle (yatay, kesik görüntü) → hata mesajı Türkçe gelsin

**Blok C — Video dönüşüm (A1 sonucunu kullan)**

- [ ] C1: A1 sonucu → Podyum Yürüyüşü → 5sn → **10 kredi** düşmeli, MP4 inmeli
- [ ] C2: A1 sonucu → 360° Dönüş → 10sn → **20 kredi** düşmeli, video gelsin
- [ ] C3: Doğal Poz preset → 5sn → video çalışsın
- [ ] C4: Rüzgar Efekti preset → 5sn → video çalışsın

**Blok D — Kredi ve hata durumları**

- [ ] D1: Hesap sayfasında kredi geçmişini kontrol et — her üretim ayrı kayıt olarak görünmeli
- [ ] D2: 2 krediyle try-on dene → "Yetersiz kredi" uyarısı görmeli, kredi düşmemeli
- [ ] D3: Try-on sonrası 2 kredi kalan durum → video butonu devre dışı veya uyarı vermeli
- [ ] D4: Onay dialogu → "Bu işlem 3 kredi harcar. Devam et?" → Hayır deyince kredi düşmemeli

**Blok E — Edge case ve responsive**

- [ ] E1: 10 MB+ görsel yükle → yükleme kabul etmeli veya net hata vermeli (timeout değil)
- [ ] E2: Performance mod ile quality mod karşılaştır — sonuç kalite farkı değerlendirilebilir mi?
- [ ] E3: Mobil 375px — kıyafet yükleme, manken seçimi, üret butonu kullanılabilir olmalı
- [ ] E4: API timeout simülasyonu — çok büyük RMBG görseli yükle → "Tekrar dene" çıkmalı

**Kabul kriteri:** A bloğu tamamen geçerse NF-02 "Done" sayılır. B-E blokları bulgu ile kapanabilir.

**Dosyalar:** `app/yzstudio/` (tüm yeni), `app/api/studio/tryon/` (yeni, video/ alt-route dahil), `lib/studio-constants.ts` (yeni), `lib/hooks/useTryonUretim.ts` (yeni), `middleware.ts` (güncelle), `public/mankenler/` (yeni assets)

