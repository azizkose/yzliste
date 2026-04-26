# DA-01: /uret Sayfası Tasarım Denetimi

**Durum:** Açık
**Öncelik:** P1
**Tahmini süre:** 2-3 saat

---

## CLAUDE.md hatırlatması

Bu görev mevcut sayfalardaki design system ihlallerini düzeltir. Bitirmeden önce CLAUDE.md kabul kontrol listesini gerçekten geç — "evet" demeden önce dosyada ilgili Tailwind class'ı arayarak (grep ile) doğrula. Söz konusu class hâlâ varsa "hayır" say, düzelt, tekrar bak.

## Önce oku

- `/CLAUDE.md` (kalıcı kurallar)
- `docs/redesign/yzliste-design-tokens.md`

---

## Yapılacaklar

### 1. Sekme ikonu düzeltmesi

Üretim ekranı sekmelerinde "Görsel" ve "Video" sekmelerinin Lucide ikonları benzer görünüyor (ikisi de çerçeve içinde detay). Video sekmesi için `Video` ikonunu `PlayCircle` ile değiştir. Diğer 3 sekme aynı kalsın (FileText, Image, Share2).

- [ ] Video sekmesi ikonu `Video` → `PlayCircle`

### 2. Video paneli düzeltmesi (kritik)

Video paneli içinde "Video Formatı" ve "Video Süresi" kart bölümleri hâlâ amber renkte ve emoji'li. Şu sınıfları bul ve değiştir:

- [ ] `border-amber-400 bg-amber-50` → `border-[#1E4DD8] ring-1 ring-[#1E4DD8] bg-white` (seçili durumlar için)
- [ ] `text-amber-700`, `text-amber-500` → `text-[#1A1A17]`, `text-[#5A5852]`
- [ ] `font-semibold` → `font-medium`
- [ ] Emojileri sil: `📱`, `🖥️`, `⚡`, `🎞️` (sadece metin kalsın: "Dikey 9:16", "Yatay 16:9", "5 saniye", "10 saniye")
- [ ] `font-bold` → `font-medium` (kredi sayısı yanındaki etiket için)

### 3. Focus ring renkleri (üç yerde)

- [ ] "Görsel yönlendirmesi" textarea: `focus:ring-violet-400` → `focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]`
- [ ] Video paneli "Hareket tarifi" textarea: `focus:ring-amber-400` → aynısı
- [ ] Sosyal medya formundaki input/textarea'lar zaten doğru, dokunma

### 4. Listing metni formundaki input/select stilleri

Şu sınıfları bul ve değiştir (sayfada 3-4 yerde geçiyor):

- [ ] `border-gray-300` → `border-[#D8D6CE]`
- [ ] `text-gray-700` → `text-[#1A1A17]`
- [ ] `focus:ring-2 focus:ring-blue-400` → `focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]`
- [ ] `text-red-400` (zorunlu alan yıldızı için) → `text-[#C0392B]`

### 5. Yardım metinlerindeki emojiler (üç yerde sil)

- [ ] `💡 yzliste her platformun karakter limiti...` → `yzliste her platformun karakter limiti...`
- [ ] `📸 En iyi sonuç için nasıl fotoğraf çekilmeli?` → `En iyi sonuç için nasıl fotoğraf çekilmeli?`
- [ ] `⚠️ AI hata yapabilir` → `AI hata yapabilir`

### 6. Sosyal medya paneli buton hiyerarşisi

"Caption üret" ve "Sosyal medya kiti" iki disabled buton üst üste duruyor, ikincisi belirsiz.

- [ ] İkinci buton stili: `bg-white border border-[#D8D6CE] text-[#1A1A17]` (secondary buton stili)
- [ ] Ana buton ile arasında görsel hiyerarşi olsun

### 7. Footer indigo linkler

`/uret` sayfasının footer'ında ve ortak footer'da `hover:text-indigo-500` her linkte.

- [ ] Hepsini `hover:text-[#1E4DD8]` yap

### 8. Chat butonu duplikasyonu

Sayfada `<div class="fixed bottom-6 right-6 z-50">` bloğu iki kez render oluyor.

- [ ] Hangi component bu butonu render ediyorsa, layout'tan veya page'den olan tekrar duplikasyonu kaldır — sadece tek kez render edilsin

---

## Kabul kontrol (gerçekten çalıştır)

```bash
# Amber kalıntısı olmamalı
grep -r "amber" src/app/uret/

# İhlal eden Tailwind renkleri olmamalı
grep -r "indigo\|violet\|emerald" src/app/uret/

# Yasak font ağırlıkları olmamalı
grep -r "font-semibold\|font-bold\|font-extrabold" src/app/uret/

# Emoji kalıntısı olmamalı
grep -rE "[💡📸⚠️📱🖥️⚡🎞️✨]" src/app/uret/
```

Her komut için: çıktı boşsa geçti. Bir şey çıkarsa → düzelt, tekrar çalıştır.

Sonra CLAUDE.md'deki standart kabul kontrol listesini de geç.
