# Ticket · Üretim ekranı (/uret) redesign

**Dosya:** `src/app/uret/page.tsx` (yol tahmini — repoda kontrol et)
**Öncelik:** Yüksek
**Tahmini efor:** 1-2 gün (tek ekran, mevcut fonksiyonalite korunur, sadece UI değişir)
**Bağımlı dosya:** `yzliste-design-tokens.md` (renkler, font, spacing)
**Prototipi:** `yzliste-uret-prototype.tsx`

---

## Kapsam

Mevcut `/uret` sayfasının görsel tasarımı design system v2'ye göre yeniden yapılandırılacak. **Hiçbir backend/API akışı değişmez.** Değişen sadece: görsel dil, ikon sistemi, renk paleti, tipografi.

## Bu ticket NE DEĞİL

- Yeni özellik eklemek değil
- Backend değişikliği değil
- Üretim akışını değiştirmek değil (platform seç → ürün gir → üret akışı aynı)
- Fiyat/kredi yapısını değiştirmek değil

## Bu ticket NE

- Emoji'leri Lucide ikonlarla değiştirmek
- 6 farklı vurgu rengini (blue/violet/amber/emerald/indigo/green) tek marka mavisine indirmek
- `rounded-2xl` yerine `rounded-xl` kullanmak
- `shadow-sm` / `shadow` kullanımlarını kaldırmak, `border` ile değiştirmek
- Font'u Geist'ten Inter'e geçirmek
- "Stage direction" metinlerini kaldırmak (↑ Önce fotoğraf yükle gibi)
- font-weight 600/700 → 500
- Başlık formatlarını "Emoji + İki Kelime Title Case" yerine sentence case'e geçirmek

---

## Ön hazırlık (tek seferlik)

### 1. Lucide paketini ekle

```bash
npm install lucide-react
```

### 2. Font değişikliği (global)

**Eski (`app/layout.tsx`):**
```tsx
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
```

**Yeni (`app/layout.tsx`):**
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

// body className'e inter.variable eklenir
```

Tailwind config'de fontFamily güncellenir:
```js
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
}
```

---

## Değişiklik listesi (üretim ekranı)

### A. Sekme (içerik tipi seçimi)

**Şu an:**
```tsx
<button className="bg-blue-500 text-white shadow-sm">📝 Metin</button>
<button>📷 Görsel</button>
<button>📱 Sosyal Medya</button>
<button>🎬 Video</button>
```
- Her sekme için emoji
- Aktif sekme renkli zemin + gölge

**Olacak:**
```tsx
import { FileText, Image, Share2, Video } from 'lucide-react'

<button className="... active-tab-styles">
  <FileText size={16} strokeWidth={1.5} />
  <span>Metin</span>
</button>
```
- Emoji yerine Lucide ikon
- Aktif sekme: alt çizgi (`border-b-2 border-[#1E4DD8]`) — zemin rengi değil
- Gölge yok

**Detay prototipte:** `yzliste-uret-prototype.tsx` → `<Tabs>` bloğu

### B. Platform seçici (Trendyol, Hepsiburada, vs.)

**Şu an:**
```tsx
<optgroup label="🇹🇷 Türk Pazaryerleri">
<optgroup label="🌍 Yabancı Pazaryerleri (İngilizce)">
```

**Olacak:**
```tsx
<optgroup label="Türk pazaryerleri">
<optgroup label="Yabancı pazaryerleri (İngilizce)">
```

Bayrak emojileri kaldırılır. Platform isimleri zaten "Trendyol, Hepsiburada, Amazon TR, N11, Etsy" — Türk vs yabancı ayrımı zaten isimle anlaşılıyor.

### C. Platform kuralları info-bar

**Şu an:**
```tsx
<div className="bg-orange-50 text-orange-700 border-orange-200">
  <span>📌 Max 100 karakter başlık</span>
  <span>·</span>
  <span>🔹 5 özellik</span>
  <span>·</span>
  <span>🏷️ 10 etiket</span>
  <span>·</span>
  <span>🇹🇷 Türkçe çıktı</span>
</div>
```
Turuncu zemin, 4 farklı emoji.

**Olacak:**
```tsx
<div className="bg-[#F1F0EB] text-[#5A5852] text-xs px-3 py-2 rounded-lg flex items-center gap-3">
  <span>Başlık 100 karakter</span>
  <span className="text-[#D8D6CE]">·</span>
  <span>5 özellik maddesi</span>
  <span className="text-[#D8D6CE]">·</span>
  <span>10 arama etiketi</span>
  <span className="text-[#D8D6CE]">·</span>
  <span>Türkçe çıktı</span>
</div>
```
Sıcak gri zemin, emoji yok, ikon yok. Bilgi net, dekorasyon yok.

### D. Fotoğraf yükleme alanı

**Şu an:**
```tsx
<div className="border-2 border-dashed">
  <span className="text-xl">📷</span>
  <p>Ürün fotoğrafı yükle</p>
  <p>Metin, Görsel, Video ve Sosyal sekmelerin hepsinde kullanılır</p>
</div>
```

**Olacak:**
```tsx
import { ImagePlus } from 'lucide-react'

<label className="border border-dashed border-[#D8D6CE] hover:border-[#1E4DD8] rounded-xl p-4 cursor-pointer transition-colors flex items-center gap-3">
  <div className="w-12 h-12 rounded-lg bg-[#F1F0EB] flex items-center justify-center flex-shrink-0">
    <ImagePlus size={20} strokeWidth={1.5} className="text-[#5A5852]" />
  </div>
  <div className="flex-1">
    <p className="text-sm font-medium text-[#1A1A17]">Ürün fotoğrafı yükle</p>
    <p className="text-xs text-[#908E86] mt-0.5">Tüm içerik türlerinde kullanılır</p>
  </div>
  <span className="text-xs text-[#908E86]">Seç</span>
</label>
```
- Border 1px dashed (2px değil)
- Emoji yerine Lucide `ImagePlus` ikonu
- Metin daha kısa

### E. Listing üret paneli başlığı

**Şu an:**
```tsx
<h2 className="text-base font-semibold text-gray-800">📋 Listing İçeriği Üret</h2>
<span className="text-xs text-blue-500 font-medium">1 içerik üretim kredisi</span>
```

**Olacak:**
```tsx
<h2 className="text-base font-medium text-[#1A1A17]">Listing metni</h2>
<span className="text-xs text-[#5A5852] font-mono">1 kredi</span>
```
- Emoji kaldırıldı
- font-semibold (600) → font-medium (500)
- "Listing İçeriği Üret" → "Listing metni" (sentence case, daha kısa)
- "1 içerik üretim kredisi" → "1 kredi" (mono font ile) — detay gerekli değil

### F. Giriş yöntemi butonları (Manuel / Fotoğraf / Barkod / Excel)

**Şu an:**
```tsx
<button className="border-blue-400 bg-blue-50 text-blue-600">✏️ Manuel</button>
<button>📷 Fotoğraf</button>
<button>🔍 Barkod</button>
<button>📊 Excel</button>
```

**Olacak:**
```tsx
import { Edit3, Camera, ScanLine, FileSpreadsheet } from 'lucide-react'

<button className="active: border-b-2 border-[#1E4DD8] text-[#1A1A17] inactive: text-[#908E86]">
  <Edit3 size={14} strokeWidth={1.5} />
  <span>Manuel</span>
</button>
```
- Emoji yerine Lucide ikonları
- Aktif sekme alt çizgi ile gösterilir, zemin boyaması yok
- Daha az görsel gürültü

### G. Ana "Üret" butonu

**Şu an:**
```tsx
<button className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl">
  ✨ Metin Üret — Giriş Gerekli
</button>
```

**Olacak:**
```tsx
<button
  disabled={!user}
  className="w-full bg-[#1E4DD8] hover:bg-[#163B9E] disabled:bg-[#D8D6CE] disabled:text-[#908E86] text-white font-medium text-sm py-3 rounded-lg transition-colors"
>
  {user ? 'Üret' : 'Giriş yap ve başla'}
</button>
```
- Sparkle emoji ✨ kaldırıldı — ChatGPT imzası
- font-semibold → font-medium
- "Metin Üret — Giriş Gerekli" → "Üret" (login'liyse) ya da "Giriş yap ve başla" (değilse)
- rounded-xl → rounded-lg

### H. Görsel sekmesi — stil galerisi

**Şu an:** Her stil için emoji + başlık
```tsx
<p className="text-xs font-semibold text-gray-700">⬜ Beyaz Zemin</p>
<p className="text-xs font-semibold text-gray-700">⬛ Koyu Zemin</p>
<p className="text-xs font-semibold text-gray-700">🏠 Lifestyle</p>
<p className="text-xs font-semibold text-gray-700">🪨 Mermer</p>
...
```

**Olacak:** Sadece görsel + sentence case başlık
```tsx
<p className="text-xs font-medium text-[#1A1A17]">Beyaz zemin</p>
<p className="text-xs text-[#908E86]">Trendyol standart</p>
```
- Başlardaki emojiler tamamen silinir
- Görselin kendisi zaten ne olduğunu anlatıyor
- Seçili durumda border rengi `#1E4DD8` olur (violet-400 yerine)

### I. Video sekmesi — hareket tarifleri

**Şu an:**
```tsx
<p className="text-xs font-semibold text-gray-700">🔄 360° Dönüş</p>
<p className="text-xs font-semibold text-gray-700">🔍 Zoom Yaklaşım</p>
<p className="text-xs font-semibold text-gray-700">💡 Dramatik Işık</p>
<p className="text-xs font-semibold text-gray-700">🌿 Doğal Ortam</p>
<p className="text-xs font-semibold text-gray-700">🔬 Detay Tarama</p>
```

**Olacak:**
```tsx
import { RotateCw, ZoomIn, Lightbulb, Leaf, Search } from 'lucide-react'

<div className="flex items-center gap-2">
  <RotateCw size={14} strokeWidth={1.5} className="text-[#5A5852]" />
  <p className="text-xs font-medium text-[#1A1A17]">360° dönüş</p>
</div>
```
- Emoji → Lucide ikon
- font-semibold → font-medium
- "360° Dönüş" → "360° dönüş" (sentence case)

### J. "Kredi üretilince düşer" uyarı kutusu

**Şu an:**
```tsx
<div className="bg-amber-50 border border-amber-200 rounded-xl">
  <span className="text-amber-500">⚡</span>
  <p className="text-xs font-semibold text-amber-700">Kredi üretilince düşer</p>
  <p className="text-xs text-amber-600">Video AI işlem gücü gerektiriyor. Üretim ~2 dakika sürer.</p>
</div>
```

**Olacak:**
```tsx
import { Zap } from 'lucide-react'

<div className="bg-[#FEF4E7] rounded-lg p-3 flex items-start gap-2.5">
  <Zap size={16} strokeWidth={1.5} className="text-[#8B4513] flex-shrink-0 mt-0.5" />
  <div>
    <p className="text-xs font-medium text-[#8B4513]">Kredi üretim anında düşer</p>
    <p className="text-xs text-[#8B4513]/80 mt-0.5">AI işlem ~2 dakika sürer</p>
  </div>
</div>
```
- Emoji yerine Lucide `Zap`
- border kaldırıldı (zemin zaten ayırıyor)
- Warning semantic renkler uygulandı (#8B4513)

### K. "↑ Önce fotoğraf yükle" boş durum kutusu

**Şu an:**
```tsx
<div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-5 text-center">
  <p className="text-sm font-medium text-amber-700">↑ Önce ürün fotoğrafı yükle</p>
  <p className="text-xs text-amber-500">Sayfanın üstündeki fotoğraf alanından ekleyebilirsin</p>
</div>
```

**Olacak:**
```tsx
<div className="bg-[#F1F0EB] rounded-lg p-6 text-center">
  <p className="text-sm text-[#5A5852]">Görsel üretmek için önce ürün fotoğrafı ekle</p>
  <button
    onClick={scrollToPhotoUpload}
    className="text-sm text-[#1E4DD8] hover:text-[#163B9E] font-medium mt-2"
  >
    Fotoğraf ekle
  </button>
</div>
```
- "↑" ok işareti → tıklanabilir buton (up scroll'a ihtiyacı olduğu an zaten kötü UX sinyali)
- amber yerine neutral zemin
- border-dashed kaldırıldı
- Kullanıcıya aksiyon butonu veriliyor

### L. "💬" chat butonu (sayfanın sağ altında sabit)

**Şu an:**
```tsx
<button className="bg-indigo-500 hover:bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg">
  💬
</button>
```

**Olacak:**
```tsx
import { MessageCircle } from 'lucide-react'

<button className="bg-[#1A1A17] hover:bg-[#2C2C29] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
  <MessageCircle size={20} strokeWidth={1.5} />
</button>
```
- Emoji → Lucide ikon
- Boyut 14 → 12 (daha ince)
- Renk: indigo → koyu nötr (marka rengiyle rekabet etmez, sessiz kalır)
- `shadow-lg` kaldırıldı

### M. Yan panel "💡 Nasıl çalışır?"

**Şu an:**
```tsx
<p className="text-xs font-semibold text-gray-600">💡 Nasıl çalışır?</p>
<p>Platform seç → Ürünü anlat → İçeriğini al</p>
<p>Metin, görsel, video ve sosyal medya tek yerden.</p>
```

**Olacak:**
```tsx
<div className="space-y-1.5">
  <p className="text-xs font-medium text-[#5A5852] uppercase tracking-wide">3 adımda</p>
  <ol className="space-y-1 text-sm text-[#1A1A17]">
    <li>Platform seç</li>
    <li>Ürünü anlat</li>
    <li>İçeriği al</li>
  </ol>
</div>
```
- Emoji 💡 kaldırıldı
- "Nasıl çalışır?" sorusu → "3 adımda" (daha kısa, daha net)
- Ok işaretli tek satır → numaralandırılmış 3 madde

---

## Yapmayacaklarımız (bilerek bırakıldı)

- ✗ Chat widget'ın kendi içeriği — ayrı ticket
- ✗ Fotoğraf yükleme mantığı — backend aynı kalır
- ✗ Stil galerisi resimleri — aynı kalır (ornek_beyaz.jpg, vs.)
- ✗ Kredi hesaplama mantığı — aynı kalır
- ✗ Form validasyonu — aynı kalır

---

## Acceptance criteria

- [ ] `lucide-react` paketi eklenmiş
- [ ] `Inter` fontu yüklenip `GeistSans` ile değiştirilmiş
- [ ] Sayfadaki tüm emojiler silinmiş (UI kısmında — kullanıcı ürettiği içerik hariç)
- [ ] Sayfada kullanılan renk tonu sayısı: **1 primary (#1E4DD8) + nötr gri + semantik durum (success/warning)** — başka renk yok
- [ ] `rounded-2xl` kullanımı kaldırılmış, yerine `rounded-xl` (12px) gelmiş
- [ ] `shadow-sm`, `shadow`, `shadow-lg` kullanımları kaldırılmış — sadece focus ring kalmış
- [ ] Tüm `font-semibold` ve `font-bold` kullanımları `font-medium`'a dönmüş
- [ ] Başlıklar Title Case yerine sentence case ("Listing metni", "360° dönüş")
- [ ] Mobilde (`sm:` breakpoint altında) her şey düzgün stack olmuş
- [ ] Karanlık modda sorun yok (varsa — yoksa bu bant atlanır)
- [ ] 4 sekmenin de (metin, görsel, video, sosyal medya) üretim akışı mevcut haliyle çalışıyor — hiçbir fonksiyon kaybolmamış

## Test senaryosu

1. Ana ekranda 4 sekmeyi sırayla seç — her birinde doğru form açılıyor
2. Platform dropdown'ını aç — grup isimlerinde emoji yok
3. Fotoğraf yükleme alanına tıkla — dosya dialogu açılıyor
4. Metin üret formunu doldur, "Üret" butonunu test et — (login yoksa "Giriş yap ve başla" göster)
5. Mobil viewport (375px) — tüm elementler dikey stack, taşma yok
6. Renkler: herhangi bir violet, amber, emerald, orange kalmış mı? — Yok olmalı.

---

## Geliştirici notu

Bu ticket'ı olabildiğince küçük, atomik PR'lar halinde çıkarmak iyi fikir:
1. PR 1: Font + Lucide paketi ekleme (altyapı)
2. PR 2: Sekme + platform seçici
3. PR 3: Form panelleri (metin, görsel, video, sosyal)
4. PR 4: Bildirim kutuları + chat widget + yan panel

Her PR sonrası manuel test gerekir, otomatik test yok.

---

## Tamamlandıktan sonra

Bu sayfa bittiğinde sonraki ticket:
- Landing sayfası (/) redesign — aynı design system'le
- Çıktı ekranı redesign — listing sonuçları sayfası
- Fiyat sayfası redesign — (fiyat değişikliği gelecekse bekler)
