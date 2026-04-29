# DA-02: Ana Sayfa (/) Tasarım Denetimi

**Durum:** Açık
**Öncelik:** P1
**Tahmini süre:** 3-4 saat

---

## CLAUDE.md hatırlatması

Bu görev mevcut sayfalardaki design system ihlallerini düzeltir. Bitirmeden önce CLAUDE.md kabul kontrol listesini gerçekten geç — "evet" demeden önce dosyada ilgili Tailwind class'ı arayarak (grep ile) doğrula. Söz konusu class hâlâ varsa "hayır" say, düzelt, tekrar bak.

## Önce oku

- `/CLAUDE.md` (kalıcı kurallar)
- `docs/redesign/yzliste-design-tokens.md`

## Karar (Aziz tarafından verildi)

- Araç kartlarında (4 ana içerik türü kartı: Listing Metni, Görsel, Video, Sosyal Medya) 3D illustrated webp ikonları KALSIN. Bu kartlar ürünün ana vitrini, görsel zenginlik orada işe yarar.
- Diğer tüm yerlerde 3D webp ikonlar Lucide ikonlarla değiştirilsin.

---

## Yapılacaklar

### 1. 3D ikon temizliği

Aşağıdaki bölümlerdeki 3D webp ikonları Lucide ikonlarla değiştir (hepsi 24px, strokeWidth 1.5, `text-[#5A5852]`):

**"3 adımda hazır" bölümü (3 ikon):**
- [ ] `cube.webp` → `Package`
- [ ] `bag.webp` → `Store`
- [ ] `magic-trick.webp` → `Sparkles`

**"Marka bilgilerini gir" bölümü (4 ikon):**
- [ ] `bag.webp` → `Store`
- [ ] `target.webp` → `Target`
- [ ] `painting-kit.webp` → `Palette`
- [ ] `bulb.webp` → `Lightbulb`

**"Neden yzliste?" bölümü (4 ikon):**
- [ ] `bulb.webp` → `Lightbulb`
- [ ] `flash.webp` → `Zap`
- [ ] `target.webp` → `Target`
- [ ] `money-bag.webp` → `Wallet`

**Listing örneği (2 ikon):**
- [ ] `pin.webp` → `Tag`
- [ ] `bookmark.webp` → `Hash`

**"Yeni özellik" badge (1 ikon):**
- [ ] `star.webp` → `Sparkles`

### 2. Lucide ikon container'ları

3D ikonlar `width:48px; height:48px; background-color:#FBEAF0; padding:7px` gibi inline style ile renkli zeminde duruyordu.

- [ ] Container kalsın (48x48 veya 56x56), renkli zemin `bg-[#F1F0EB]` olsun (nötr surface), her ikon farklı renkte değil — tutarlılık
- [ ] İkon rengi `text-[#5A5852]`
- [ ] Inline style yerine Tailwind class'ları kullan

### 3. Hero bölümü düzeltmesi (kritik)

- [ ] `bg-indigo-500/30 text-indigo-200` rozet → `bg-white/10 text-white border border-white/20`
- [ ] `bg-emerald-500/30 text-emerald-200 🆕` rozet → emoji sil, `bg-white/10 text-white border border-white/20`
- [ ] `text-indigo-300` heading vurgu (`<span class="text-indigo-300">AI ile üret</span>`) → `text-[#BAC9EB]`
- [ ] `bg-emerald-500/30 text-emerald-300` checkmark badge'leri → `bg-white/15 text-white`
- [ ] `bg-indigo-500 hover:bg-indigo-600` ana CTA → `bg-[#1E4DD8] hover:bg-[#163B9E]`
- [ ] `font-extrabold` h1 → `font-medium`
- [ ] `font-semibold` butonlar → `font-medium`

### 4. SSS bölümü

- [ ] `font-bold text-gray-900` başlık → `font-medium text-[#1A1A17]`
- [ ] Her soru `font-semibold text-sm text-gray-800` → `font-medium text-sm text-[#1A1A17]`
- [ ] `text-indigo-500 hover:text-indigo-700` "tüm sorular →" → `text-[#1E4DD8] hover:text-[#163B9E]`
- [ ] `border-gray-100` → `border-[#D8D6CE]`
- [ ] SSS içerik düzeltmesi: "39₺'den başlayan kredi paketleri" → "49₺'den başlayan kredi paketleri"

### 5. Header scroll davranışı kontrolü

Hero üstündeki header `bg-black/25` ve text-white — bu bilinçli, dokunma.

- [ ] Scroll edince beyaz hale geçen state (`bg-white/90`) düzgün çalışıyor mu doğrula
- [ ] Hero dışı sayfalarda siyah header görünüyorsa düzelt

### 6. Pazaryeri hover renkleri

Listing örneğinde Trendyol tab'ı seçili durumda `bg-orange-500 text-white` — bu istisna, kalsın.

- [ ] `hover:bg-[#FFF3E0] hover:text-[#E47911]` (Amazon) → `hover:bg-[#F1F0EB] hover:text-[#1A1A17]`
- [ ] `hover:bg-rose-50` (Etsy) → `hover:bg-[#F1F0EB]`
- [ ] Diğer tutarsız pazaryeri hover'ları → `hover:bg-[#F1F0EB] hover:text-[#1A1A17]`

### 7. Listing demo bullet emojileri (kritik)

Demo metinde 🏆 ☕ 🌸 🎁 ✅ var.

- [ ] Bullet başındaki emojileri sil, geriye sadece bullet metni kalsın

### 8. Footer linkler

- [ ] Ana sayfanın footer'ındaki `hover:text-indigo-500` → hepsini `hover:text-[#1E4DD8]` yap

### 9. Diğer ihlaller

- [ ] Sayfayı tara: başka indigo/violet/emerald/amber/font-bold/font-semibold geçen yer varsa düzelt
- [ ] Araç kartlarındaki 3D ikonlar HARİÇ

---

## Kabul kontrol (gerçekten çalıştır)

```bash
# Tailwind ihlal renkleri — araç kartı inline style'ları hariç hiçbir şey çıkmamalı
grep -rE "indigo|violet|emerald|amber" src/app/page.tsx

# Yasak font ağırlıkları olmamalı
grep -rE "font-semibold|font-bold|font-extrabold" src/app/page.tsx

# Araç kartlarında 4 ikon kaldığını doğrula, başka yerlerde /icons/3d/ referansı olmamalı
grep -r "icons/3d" src/app/page.tsx

# Hero'da emoji kalıntısı olmamalı
grep -rE "🆕" src/app/page.tsx

# SSS fiyat düzeltmesi doğrulandı mı
grep "39₺" src/app/page.tsx
```

Her komut için: çıktı boşsa (veya sadece kasıtlı istisnalar varsa) geçti. Aksi hâlde düzelt, tekrar çalıştır.

Sonra CLAUDE.md'deki standart kabul kontrol listesini de geç.
