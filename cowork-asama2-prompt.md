# yzliste — Emoji Temizliği ve İkon Sistemi

## Amaç

Siteyi iki katmanlı bir ikon sistemine geçiriyoruz:
- **Marketing yerlerinde** (Landing, özellik tanıtımları): 3dicons.co'dan 3D PNG ikonlar
- **Fonksiyonel UI'da** (butonlar, durum göstergeleri, tablolar): Lucide ikonları

Bu değişiklik kalıcı bir kural haline gelecek. Projeye `CLAUDE.md` ekleyeceksin; bundan sonra emoji kullanmayacaksın, bu sisteme uyacaksın.

---

## ADIM 1 — 3D ikon dosyalarını indir

Şu 15 ikonu `public/icons/3d/` klasörüne indir. Hepsi CC0 lisanslı, ücretsiz.

URL formatı: `https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/{HASH}-{NAME}/dynamic/512/color.webp`

İndirilecek ikonlar (HASH-NAME formatında, dosya adı kısaltılmış):

```
brain        → 3dicons.co'dan "brain" ara, 512px color.webp indir     → public/icons/3d/brain.webp
flash        → "flash"        → public/icons/3d/flash.webp
target       → "target"       → public/icons/3d/target.webp
money-bag    → "money-bag"    → public/icons/3d/money-bag.webp
cube         → "cube"         → public/icons/3d/cube.webp
bag          → "bag"          → public/icons/3d/bag.webp
magic-trick  → "magic-trick"  → public/icons/3d/magic-trick.webp
shield       → "shield"       → public/icons/3d/shield.webp
star         → "star"         → public/icons/3d/star.webp
painting-kit → "painting-kit" → public/icons/3d/painting-kit.webp
bulb         → "bulb"         → public/icons/3d/bulb.webp
pin          → "pin"          → public/icons/3d/pin.webp
bookmark     → "bookmark"     → public/icons/3d/bookmark.webp
pencil       → "pencil"       → public/icons/3d/pencil.webp
mobile       → "mobile"       → public/icons/3d/mobile.webp
3d-coin      → "3d-coin"      → public/icons/3d/coin.webp
camera       → "camera"       → public/icons/3d/camera.webp
video-cam    → "video-cam"    → public/icons/3d/video-cam.webp
```

**Not:** Dosyaları indirirken 3dicons.co API'sine doğrudan HTTP isteği yapman gerekebilir. Eğer direkt indirme başarısız olursa, bana söyle — ikonları senin için indirip yükleyeceğim.

---

## ADIM 2 — Icon3D helper component oluştur

`components/ui/Icon3D.tsx` dosyasını oluştur:

```tsx
import Image from "next/image";

type Icon3DProps = {
  name: "brain" | "flash" | "target" | "money-bag" | "cube" | "bag" 
      | "magic-trick" | "shield" | "star" | "painting-kit" | "bulb" 
      | "pin" | "bookmark" | "pencil" | "mobile" | "coin"
      | "camera" | "video-cam";
  size?: number;
  bgColor?: string;
  className?: string;
};

export function Icon3D({ name, size = 40, bgColor, className = "" }: Icon3DProps) {
  const iconSize = Math.round(size * 0.72);
  const padding = Math.round(size * 0.14);
  
  if (bgColor) {
    return (
      <div 
        className={`inline-flex items-center justify-center rounded-2xl ${className}`}
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: bgColor,
          padding: padding 
        }}
      >
        <Image 
          src={`/icons/3d/${name}.webp`} 
          alt="" 
          width={iconSize} 
          height={iconSize}
          unoptimized
        />
      </div>
    );
  }
  
  return (
    <Image 
      src={`/icons/3d/${name}.webp`} 
      alt="" 
      width={size} 
      height={size}
      className={className}
      unoptimized
    />
  );
}
```

---

## ADIM 3 — 3D ikon değişiklikleri (Marketing bölgeleri)

### components/tanitim/BenefitsGrid.tsx
- Satır 4: 🧠 → `<Icon3D name="brain" size={56} bgColor="#EEEDFE" />`
- Satır 5: ⚡ → `<Icon3D name="flash" size={56} bgColor="#FAEEDA" />`
- Satır 6: 🎯 → `<Icon3D name="target" size={56} bgColor="#FBEAF0" />`
- Satır 7: 💰 → `<Icon3D name="money-bag" size={56} bgColor="#E1F5EE" />`

### components/tanitim/HowItWorks.tsx
- Satır 2: 📦 → `<Icon3D name="cube" size={56} bgColor="#E6F1FB" />`
- Satır 3: 🛒 → `<Icon3D name="bag" size={56} bgColor="#FAEEDA" />`
- Satır 4: ✨ → `<Icon3D name="magic-trick" size={56} bgColor="#EEEDFE" />`

### components/tanitim/TrustBand.tsx
- Satır 9: 🔒 → `<Icon3D name="shield" size={40} />` (arka plansız, inline)

### components/tanitim/BrandProfile.tsx
- Satır 8: ✨ (badge) → `<Icon3D name="star" size={20} />` (küçük, arka plansız)
- Satır 18: 🏪 → `<Icon3D name="bag" size={48} bgColor="#EEEDFE" />`
- Satır 19: 🎯 → `<Icon3D name="target" size={48} bgColor="#FBEAF0" />`
- Satır 20: 🎨 → `<Icon3D name="painting-kit" size={48} bgColor="#E6F1FB" />`
- Satır 21: 💡 → `<Icon3D name="bulb" size={48} bgColor="#FAEEDA" />`
- Satır 53: ✓ (alt not) → Bu Lucide'a gidecek (ADIM 4'te)

### components/tanitim/FeaturesTabbed.tsx (sadece bölüm başlığı ikonları, içerik değil)
- Satır 16, 51, 86 (📌 bölüm başlığı ikonu) → `<Icon3D name="pin" size={32} />`
- Satır 38, 73, 108 (🏷️ etiket bölümü başlığı) → `<Icon3D name="bookmark" size={32} />`
- Satır 118 (📝 sekme ikonu) → `<Icon3D name="pencil" size={20} />`
- Satır 121 (📱 sekme ikonu) → `<Icon3D name="mobile" size={20} />`

**ÖNEMLİ:** FeaturesTabbed.tsx içindeki örnek listing metinlerindeki emoji'lere DOKUNMA (satır 24-28, 94-96, 267, 302-304, 320-321, 357, 368-369, 387). Bunlar kullanıcıya "AI böyle çıktı üretir" demek için örnek metin — gerçekçi görünmesi için emoji kalmalı.

### components/SiteHeader.tsx
- Satır 116, 209 (💳 kredi badge) → `<Icon3D name="coin" size={16} />`
- Satır 14 (Dropdown 📝 Listing) → `<Icon3D name="pencil" size={18} />`
- Satır 17 (Dropdown 📱 Sosyal) → `<Icon3D name="mobile" size={18} />`

### ⚠️ ÖNEMLİ EK: "Tek platformda 4 içerik türü" bölümü

Bu bölüm ilk Cowork raporunda yoktu ama sitede ana sayfada BÜYÜK bir bölüm. Büyük ihtimalle `components/tanitim/` altında bir dosyada (muhtemelen `ContentTypes.tsx`, `AraclarGrid.tsx` veya benzeri). GREP komutu ile bul: `grep -rn "Listing Metni" components/` veya `grep -rn "🎬 Video" components/`.

Bulduğun dosyada 4 kart var:
- 📝 Listing Metni → `<Icon3D name="pencil" size={48} bgColor="#E6F1FB" />`
- 📷 Görsel → `<Icon3D name="camera" size={48} bgColor="#EEEDFE" />`
- 🎬 Video → `<Icon3D name="video-cam" size={48} bgColor="#FAEEDA" />`
- 📱 Sosyal Medya → `<Icon3D name="mobile" size={48} bgColor="#E1F5EE" />`

### ⚠️ ÖNEMLİ EK: app/fiyatlar/page.tsx'de ek emoji'ler

İlk raporda sadece satır 43, 49, 67, 199 geçiyordu. Ama sayfada 4 paket var ve her pakette bu 4 emoji var. Aslında muhtemelen `lib/paketler.ts`'den geliyor (raporda belirtilmiş) ama `fiyatlar/page.tsx`'de de doğrudan render eden bir bölüm var. Sayfanın tümünü gözden geçir:

- 📝 Listing metni → `<Icon3D name="pencil" size={32} />` (küçük, liste içi)
- 📷 AI görsel → `<Icon3D name="camera" size={32} />`
- 🎬 Video → `<Icon3D name="video-cam" size={32} />`
- 📱 Sosyal medya → `<Icon3D name="mobile" size={32} />`

Paket kart başlığındaki büyük ikon varsa size={56}, bgColor ile. Liste satırında küçük boy, bgColor'suz.

### ⚠️ ÖNEMLİ EK: Hero bölümü ve footer emoji'leri

**Ana sayfa hero:**
- ✨ "Yeni özellik" badge'i (BrandProfile içinde) → Zaten `star` olarak yukarıda işlendi
- Hero altındaki 4 ✓ bullet'ları küçük yuvarlak içinde → Lucide `Check` (size-3)
- 🆕 "Video + Sosyal Medya" badge'i varsa → `<Icon3D name="star" size={14} />` VEYA Lucide `Sparkles` (marka kuralı: marketing alanı, tercih 3D)

**Footer — her sayfada:**
- 🔒 "256-bit şifreleme" → Lucide `Lock` (küçük, inline, text içinde). Bu bir satır içi ikon, 3D yapmaya değmez.

**Mobil header — her sayfada:**
- ☰ mobil menü butonu (SiteHeader.tsx içinde) → Lucide `Menu` (`<Menu className="h-6 w-6" />`)

---

## ADIM 4 — Lucide ikon değişiklikleri (Fonksiyonel UI)

Aşağıdaki TÜM fonksiyonel emoji'leri Lucide React ikonlarına dönüştür.

Kurulum kontrol: `package.json`'da `lucide-react` var mı bak, yoksa ekle (büyük ihtimalle shadcn/ui ile zaten kurulu).

Tüm bu değişikliklerde kullanım formatı:
```tsx
import { Check } from "lucide-react";
// emoji yerine:
<Check className="h-4 w-4" />
```

Stroke/renk için Tailwind: `text-green-500`, `text-amber-500`, `text-red-500` vb. Bağlama göre seç.

### Emoji → Lucide eşleme tablosu (TÜM dosyalarda uygula)

| Emoji | Lucide | Renk önerisi |
|---|---|---|
| ✓ ✅ | `Check` | `text-green-500` veya nötr |
| ⏳ | `Loader2` + `animate-spin` className | mevcut text rengi |
| ⚠️ | `AlertTriangle` | `text-amber-500` |
| 🔒 | `Lock` veya `ShieldCheck` | nötr |
| ⬇️ ⬇ | `Download` | nötr |
| 🔍 | `Search` | nötr |
| 💳 (kredi dışındaki yerler) | `CreditCard` | nötr |
| 🏷️ | `Tag` | nötr |
| 📝 | `FileText` veya `Pencil` | nötr |
| 📱 | `Smartphone` | nötr |
| 📸 | `Camera` | nötr |
| 🖼️ | `Image` | nötr |
| 🎁 | `Gift` | `text-pink-500` veya marka rengi |
| 💡 | `Lightbulb` | `text-amber-500` |
| ✨ | `Sparkles` | marka rengi |
| 📦 | `Package` | nötr |
| 🔄 | `RefreshCw` | nötr |
| 📋 | `ClipboardList` | nötr |
| 🏪 | `Store` | nötr |
| 📊 | `BarChart3` | nötr |
| 📧 | `Mail` | nötr |
| 🔗 | `Link` | nötr |
| 💬 | `MessageCircle` | nötr |
| 💎 | `Gem` | nötr |
| ⚙️ | `Settings` | nötr |
| 🏆 | `Trophy` | nötr |
| 🚀 | `Rocket` | nötr |
| 🐦 | `Twitter` | marka rengi |
| ✏️ | `Pencil` | nötr |
| 🖥️ | `Monitor` | nötr |
| 🎨 | `Palette` | nötr |
| 📐 | `Ruler` | nötr |
| 📷 | `Camera` | nötr |
| ⚡ | `Zap` | `text-amber-500` |
| 🔵 | `Circle` fill | marka rengi |
| ❤️ | `Heart` | `text-red-500` |
| 🔥 | `Flame` | `text-orange-500` |
| 🎞️ | `Film` | nötr |
| ☰ | `Menu` | nötr (mobil header) |
| ❌ | `X` | `text-red-500` |
| ⬜ ⬛ | küçük `<div>` renkli kare | beyaz/siyah |
| 🪨 🪵 🌿 🏠 👕 🍽️ 💍 🎈 🌱 (constants.ts preset'leri) | DOKUNMA — bırak | — |

### Uygulanacak dosyalar

Raporda listelenen şu dosyalarda emoji'leri yukarıdaki eşlemeye göre Lucide'a çevir:

- components/tanitim/BrandProfile.tsx (satır 53)
- components/tanitim/AuthHero.tsx (satır 52)
- components/tanitim/FeaturesTabbed.tsx (satır 218 — sadece bu satır, geri kalan örnek metinler kalsın)
- app/uret/page.tsx (tüm fonksiyonel emoji'ler)
- components/GorselSekmesi.tsx (tümü)
- components/VideoSekmesi.tsx (tümü)
- components/SosyalSekmesi.tsx (tüm fonksiyonel olanlar; mood ve kampanya emoji'leri — 🔥 ❤️ — Lucide'a çevrilebilir)
- app/fiyatlar/page.tsx (tümü)
- app/hesap/page.tsx (tümü — stat kartlarındaki 📝💳🏆🚀 dahil)
- app/hesap/profil/page.tsx (tümü)
- app/hesap/ayarlar/page.tsx (tümü)
- app/hesap/uretimler/page.tsx (satır 122 boş durum ikonu ve satır 22-30 regex parse'a DOKUNMA)
- app/hesap/faturalar/page.tsx (tümü)
- app/toplu/page.tsx (tümü)
- app/admin/page.tsx (tümü)
- app/admin/feedback/page.tsx (tümü)
- app/odeme/basarili/page.tsx
- app/error.tsx, app/global-error.tsx
- components/KrediButon.tsx, KopyalaButon.tsx, FotoThumbnail.tsx, CopyButton.tsx, GenerationFeedback.tsx
- components/ChatWidget.tsx
- components/RefDavetBolumu.tsx, RefBanner.tsx
- components/PaketModal.tsx, @modal/kredi-yukle/page.tsx
- components/BlogListesi.tsx
- components/paketler.ts (satır 38,41,42,59,62,63,79,82,83: 📝📱✅ → ilgili Lucide isimleri string olarak tut, render tarafında Lucide component'e çevir)

---

## ADIM 5 — DOKUNULMAYACAK dosyalar

Bunlara KESİNLİKLE müdahale etme, sistem kırılır:

1. **lib/listing-utils.ts** (satır 37-45) — regex parse için emoji ayırıcılar
2. **lib/excel-parser.ts** (satır 131-134) — aynı regex
3. **app/api/uret/route.ts** (satır 543, 556) — AI'a giden prompt içindeki format talimatları
4. **lib/constants.ts** — Görsel stilleri (satır 51-59) ve video presetleri (satır 74-87). Bu emoji'ler kullanıcının seçim yaptığı görsel kategorileri temsil ediyor, her biri için 3D ikon yapmak kapsam dışı, Lucide'a çevirmek ise seçim deneyimini zayıflatır.
5. **Blog md dosyaları** (content/blog/*.md) — 💡 ipucu paragrafları içerik
6. **docs/marka-sesi.md, blog _TEMPLATE.md, _ORNEK.md, _DETAYLI_SABLON.md** — iç belge
7. **FeaturesTabbed.tsx içindeki örnek listing metinleri** (satır 24-28, 94-96, 267, 302-304, 320-321, 357, 368-369, 387) — bunlar AI çıktısı örneği, emoji olması gerçekçilik için önemli

---

## ADIM 6 — CLAUDE.md oluştur (KALICI KURALLAR)

Proje kök dizinine `CLAUDE.md` dosyası oluştur. Bu, bundan sonra Cowork (ve diğer AI asistanları) projeyi açtığında okuyup uyacağı kurallar dosyasıdır.

İçerik:

```markdown
# yzliste - Proje Kuralları

## İkon Sistemi (ÖNEMLİ)

Bu projede iki katmanlı ikon sistemi kullanıyoruz. YENİ KART/BÖLÜM/UI EKLERKEN mutlaka bu kurala uyun:

### 1. Marketing bölgeleri için — 3D ikonlar

Landing page, özellik tanıtımları, "Neden biz?" benzeri satış odaklı alanlar için:

\`\`\`tsx
import { Icon3D } from "@/components/ui/Icon3D";

<Icon3D name="brain" size={56} bgColor="#EEEDFE" />
\`\`\`

Mevcut ikonlar (`public/icons/3d/` altında): brain, flash, target, money-bag, cube, bag, magic-trick, shield, star, painting-kit, bulb, pin, bookmark, pencil, mobile, coin.

Daha fazla ikon gerekirse 3dicons.co'dan indirip aynı klasöre ekleyin ve `Icon3D.tsx`'deki type'a ekleyin.

**Pastel arka plan paleti:**
- Mor: `#EEEDFE`
- Amber: `#FAEEDA`
- Pembe: `#FBEAF0`
- Yeşil: `#E1F5EE`
- Mavi: `#E6F1FB`

### 2. Fonksiyonel UI için — Lucide React

Buton ikonları, durum göstergeleri (onay, yükleniyor, hata), form içi ikonlar, tablo satır ikonları, hesap paneli vb. için:

\`\`\`tsx
import { Check, Loader2, AlertTriangle } from "lucide-react";

<Check className="h-4 w-4" />
<Loader2 className="h-4 w-4 animate-spin" />
<AlertTriangle className="h-4 w-4 text-amber-500" />
\`\`\`

### YASAK: Emoji

UI'da emoji kullanma. Tek istisna:
- Blog markdown dosyalarında içerik parçası olarak (💡 İpucu gibi)
- AI prompt'larında veya AI çıktı parse regex'lerinde (mevcut listing-utils.ts vb.)
- Kullanıcıya gösterilen örnek listing metinlerinde (gerçekçilik için)

### Karar kuralı

"Bu bir satış/tanıtım alanı mı, yoksa uygulamanın içinde fonksiyonel bir UI mi?"
- Satış/tanıtım → `<Icon3D />`
- Fonksiyonel → Lucide

Emin değilsen Lucide'ı seç (daha güvenli varsayılan).
```

---

## ADIM 7 — Test

Değişiklikler tamamlandığında:

1. `npm run dev` ile lokalde çalıştır
2. Anasayfa, /uret, /fiyatlar, /hesap sayfalarında emoji kalmadığını doğrula
3. Üretim akışı (metin + görsel + sosyal) hala düzgün çalışıyor mu test et — özellikle listing-utils.ts dokunulmadıysa AI çıktısı parse hala çalışmalı
4. `npm run build` çalıştır, hata vermezse deploy hazır

---

## Öncelik sırası (eğer hepsini tek seferde yapmak zorsa)

1. ADIM 1-2 (ikon indirme + helper)
2. ADIM 3 (3D ikonlar — en görünür etki)
3. ADIM 6 (CLAUDE.md — kalıcılık için kritik)
4. ADIM 4 (Lucide dönüşümü — uzun ama tekrarlı iş)
5. ADIM 7 (test)

İş çok fazla. Eğer kredi/zaman kısıtın varsa adım adım gidelim, her adım sonrası bana rapor ver.
