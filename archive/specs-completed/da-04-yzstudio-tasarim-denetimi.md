# DA-04: /yzstudio Sayfası Tasarım Denetimi — Dark → Light + UX Revizyonu

**Durum:** Açık
**Öncelik:** P1
**Tahmini süre:** 4-6 saat

---

## CLAUDE.md hatırlatması

Bu görev mevcut sayfalardaki design system ihlallerini düzeltir. Bitirmeden önce CLAUDE.md kabul kontrol listesini gerçekten geç — "evet" demeden önce dosyada ilgili Tailwind class'ı arayarak (grep ile) doğrula. Söz konusu class hâlâ varsa "hayır" say, düzelt, tekrar bak.

## Kritik karar (Aziz)

yzliste 4 modül olarak çalışıyor (Yzlisting, Yzstudio, Yzcustomerservice, Yzanalysis). Her modül aynı design system'i paylaşacak — marka bütünlüğü şart. Modüller arası tek görsel farklılaşma: Yzstudio (ve gelecekteki premium modüller) için Warm Earth accent rengi (`#A87847`) küçük yerlerde kullanılacak. Apayrı bir tasarım dili (dark mode gibi) yasak.

## Önce oku

- `/CLAUDE.md` (kalıcı kurallar)
- `docs/redesign/yzliste-design-tokens.md`
- Ana site `src/app/page.tsx` — header, footer, stil referansı
- `/uret` sayfası — form/input/buton stilleri referansı

---

## Yapılacaklar

### 1. Dark mode'dan light mode'a geçir (bütünsel)

Sayfadaki tüm dark mode renklerini ana site paletine çevir. Hiçbir yerde tam siyah/koyu gri zemin kullanma.

- [ ] Sayfa zemini: `bg-[#FAFAF8]` (ana site ile aynı)
- [ ] Form kartı zemini: `bg-white` + `border border-[#D8D6CE]`
- [ ] Fotoğraf yükleme alanı zemini: `bg-white` + `border-dashed border-[#D8D6CE]` (hover'da `border-[#1E4DD8]`)
- [ ] Manken seçimi kart zemini: `bg-white` + `border border-[#D8D6CE]`
- [ ] Tüm metin renkleri: başlık `text-[#1A1A17]`, gövde `text-[#5A5852]`, muted `text-[#908E86]`
- [ ] Segmented button seçili olmayan: `bg-white border border-[#D8D6CE] text-[#5A5852]`
- [ ] Segmented button seçili: `bg-[#1E4DD8] text-white` (korunur)

### 2. Header'ı ana site header'ı ile değiştir

Şu anki Yzstudio sayfasında sadece sol üstte "yzstudio [beta]" ve sağda "99 kredi [Kredi yükle]" var. Ana site header'ı (logo, Ana Sayfa / Fiyatlar / Blog / Araçlar menüsü, sağda İçerik Üret butonu) tamamen eksik.

- [ ] Ana site header'ını (SiteHeader component) ekle
- [ ] Header'ın altında sayfa kimliği bandı ekle:
  - Sol: "yzstudio" (h1, `font-medium text-2xl tracking-[-0.01em]`)
  - Yanında accent rozet: `bg-[#FAF4ED] text-[#3D2710] text-xs font-medium px-2.5 py-0.5 rounded` içeriği "Premium · Beta"
  - Sağ: "99 kredi · Kredi yükle" (mevcut, stili güncellensin)

### 3. Layout düzeltmesi — sağ taraftaki boş alan

Kullanıcı henüz işlem başlatmadığında sağ alan boş. Çözüm: Önce/sonra örnekleri paneli.

- [ ] Sağ tarafa "Örnek çıktılar" paneli ekle — 2-3 before/after çifti (küçük thumbnail'lar)
- [ ] Kart stili: `bg-white border border-[#D8D6CE] rounded-xl p-4`
- [ ] Thumbnail'lar `aspect-square rounded-lg`
- [ ] Alt metin `text-xs text-[#908E86]`
- [ ] İşlem başladığında (fotoğraf yüklendiğinde) örnekler gizlenir, üretilen görseller çıkar
- [ ] Örnek görseller yoksa: `/public/yzstudio-ornekler/` klasörü oluştur, placeholder gri kutular kullan

Örnek yapı:
```
Örnek çıktılar
───────────────────────────
[tshirt.jpg]  →  [modeldeki.jpg]
Düz tişört → Kadın 1 modelde

[gomlek.jpg] →  [modeldeki2.jpg]
Askıda gömlek → Erkek 2 modelde
```

### 4. Manken seçimi kartları — okunabilirlik

- [ ] Kart zemini beyaz: `bg-white`
- [ ] Label'lar (Kadın 1, Erkek 2) kartın altında ayrı satırda: `text-xs font-medium text-[#1A1A17] mt-2 text-center`
- [ ] Seçili kart: `border-2 border-[#1E4DD8] ring-1 ring-[#1E4DD8]` + sağ üstte mavi tick
- [ ] Seçili olmayan kart: `border border-[#D8D6CE] hover:border-[#7B9BD9]`
- [ ] Fotoğraf aspect-ratio: portre 3:4, thumbnail ~100x130px

### 5. Fotoğraf yükleme alanı

- [ ] Light mode stili uygula:

```tsx
<label className="block bg-white border border-dashed border-[#D8D6CE] hover:border-[#1E4DD8] rounded-xl p-12 cursor-pointer transition-colors text-center">
  <div className="w-14 h-14 rounded-lg bg-[#F1F0EB] flex items-center justify-center mx-auto mb-3">
    <ImageUp size={24} strokeWidth={1.5} className="text-[#5A5852]" />
  </div>
  <p className="text-sm font-medium text-[#1A1A17]">Fotoğraf yükle veya sürükle bırak</p>
  <p className="text-xs text-[#908E86] mt-1">JPG, PNG — en fazla 10 MB</p>
</label>
```

### 6. "Ayarlar" bölümü düzenle

- [ ] "Ayarlar" başlığını sil (bürokratik, gereksiz)
- [ ] Doğrudan iki alt başlık: "Kalite modu" ve "Varyasyon sayısı" (`text-sm font-medium text-[#1A1A17] mb-2`)
- [ ] Kalite modu segmented button'lar:
  - Seçili: `bg-[#1E4DD8] text-white`
  - Seçili değil: `bg-white border border-[#D8D6CE] text-[#5A5852] hover:border-[#7B9BD9]`
  - Süre bilgisi (~15 sn, ~25 sn, ~45 sn) kartın içinde `text-xs`
- [ ] Varyasyon +/- buton: `bg-white border border-[#D8D6CE]`, disabled durumda `text-[#D8D6CE]`

### 7. Ana CTA butonu

Karar (Aziz): Mavi kalsın, Warm Earth değil. Marka bütünlüğü için ana CTA her modülde mavi.

- [ ] `bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium py-3 rounded-lg w-full`
- [ ] Altında: "Kalan bakiye: 99 kredi" → `text-xs text-[#908E86] text-center mt-2`

### 8. Footer — ana site footer'ı kullan

- [ ] Ana site footer component'ini ekle (iyzico logosu, yasal linkler, şirket bilgisi)
- [ ] Footer'ın üstüne deneysel uyarı kutusu ekle:

```tsx
<div className="bg-[#FAF4ED] border border-[#EED8BD] rounded-lg px-4 py-2 text-center mb-4">
  <p className="text-xs text-[#7D5630]">yzstudio beta sürümünde — sonuçlar değişkenlik gösterebilir</p>
</div>
```

### 9. Sekme satırı — gelecek araçlar

- [ ] Sekme satırı ekle:

```tsx
<div role="tablist" className="flex gap-4 border-b border-[#D8D6CE]">
  <button aria-selected className="pb-3 border-b-2 border-[#1E4DD8] text-sm font-medium text-[#1A1A17]">
    Mankene giydirme
  </button>
  <button disabled className="pb-3 text-sm text-[#908E86] cursor-not-allowed" title="Yakında">
    Stüdyo çekimi <span className="text-xs text-[#A87847] ml-1">yakında</span>
  </button>
  <button disabled className="pb-3 text-sm text-[#908E86] cursor-not-allowed" title="Yakında">
    Arka plan değiştirme <span className="text-xs text-[#A87847] ml-1">yakında</span>
  </button>
</div>
```

### 10. Mobil responsive

- [ ] < 1024px: sol form ve sağ örnek galerisi tek sütuna geçer
- [ ] Sağ örnek galerisi formun altına iner
- [ ] Manken kartları: tablet 3 sütun, mobil 2 sütun
- [ ] Header hamburger menüye dönüşür (ana site gibi)
- [ ] Test: 375px, 768px, 1024px, 1440px

### Başlık güncellemesi

- [ ] `src/app/yzstudio/page.tsx` içinde metadata export'u ekle:

```ts
export const metadata = {
  title: "yzstudio — Premium AI Görsel Araçları | yzliste",
  description: "Mankenlere kıyafet giydirme, stüdyo çekimi ve daha fazlası. yzliste premium AI görsel araçları."
}
```

---

## Kabul kontrol (gerçekten çalıştır)

```bash
# Dark mode class'ları kalmadı mı
grep -rE "bg-gray-900|bg-black|bg-neutral-950|bg-gray-800|bg-zinc-900|bg-slate-900" src/app/yzstudio/

# Sayfa zemini doğru mu
grep -r "FAFAF8" src/app/yzstudio/

# Yasak font ağırlıkları
grep -rE "font-semibold|font-bold|font-extrabold" src/app/yzstudio/

# İhlal eden Tailwind renkleri
grep -rE "indigo|violet|emerald|amber" src/app/yzstudio/

# Emoji kalıntısı
grep -rE "[💡📸⚠️📱🖥️⚡🎞️✨🎁]" src/app/yzstudio/

# Header component kullanılıyor mu
grep -r "SiteHeader\|SiteFooter" src/app/yzstudio/

# Metadata export var mı
grep -r "export const metadata" src/app/yzstudio/
```

Ek görsel kontroller:
- [ ] Sayfa zemini ana site ile aynı `#FAFAF8` mi?
- [ ] Header ana site header'ı ile aynı mı? (logo, nav, CTA)
- [ ] Footer ana site footer'ı ile aynı mı?
- [ ] Manken fotoğraflarının yüzleri light zeminde net görünüyor mu?
- [ ] Warm Earth accent sadece 3 küçük yerde mi? (beta rozeti + "yakında" etiketleri + footer uyarı kutusu)
- [ ] Ana CTA mavi mi (Warm Earth değil)?
- [ ] Mobil 375px'de her şey düzgün stack oluyor mu?
- [ ] Sekme: "Mankene giydirme" aktif + 2 "yakında" disabled sekme görünüyor mu?

Sonra CLAUDE.md'deki standart kabul kontrol listesini de geç.
