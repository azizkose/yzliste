# LP-11: Landing Page Section Revizyonları — 4 Madde

**Durum:** Açık
**Öncelik:** P1
**Tahmini süre:** 3-4 saat
**Kural:** Önce planı göster, onay al, sonra uygula.

---

## Genel

4 section'da layout ve animasyon değişiklikleri. Hepsi ana sayfa (`/`) üzerinde.

---

## 1. Hero video üzerindeki yazı

**Sorun:** Şu an sadece "Video + Sosyal Medya" yazıyor. 4 modül var ama hero sadece 2'sini gösteriyor.

**Yapılacaklar:**

- [ ] Hero overlay metnini güncelle: "Metin · Görsel · Video · Sosyal Medya"
- [ ] 4 kelime arası nokta (·) ayırıcı
- [ ] Opsiyonel: Kelimelerin sırayla hafif fade-in ile belirmesi (her biri 400ms arayla)
- [ ] Mevcut video overlay stiline uygun (beyaz text, hafif backdrop)

---

## 2. "Tek platformda 4 içerik türü" ikonları + tab bağlantısı

**Sorun:** Foto ve Video 3D ikonları çok benzer, diğerleri de tam anlatmıyor. Tab yapısıyla üst kartlar birbirine bağlı değil.

**Yapılacaklar:**

- [ ] 4 içerik kartındaki ikonları Lucide ikonlarla değiştir:
  - Metin: `FileText` (veya `Type`)
  - Görsel: `Camera`
  - Video: `Clapperboard`
  - Sosyal Medya: `Share2` (veya `Megaphone`)
- [ ] İkon rengi: `text-[#1E4DD8]`, stroke 1.5
- [ ] **NOT:** Bu ikonlar zaten header Araçlar dropdown'unda var — tutarlılık sağla, aynı ikonları kullan
- [ ] Seçili kart ile altındaki tab paneli (Trendyol/Amazon/Etsy önizleme) arasına görsel bağlantı kur:
  - Seçili kartın alt kenarından tab paneline inen ince çizgi veya ok (bridge)
  - Veya: seçili kart + tab paneli aynı arka plan renginde (#F0F4FB), aradaki border kaldırılır → süreklilik hissi
  - En basit yaklaşım: seçili kartın `border-bottom` kaldırılıp tab panelinin `border-top` ile birleşmesi
- [ ] Seçili olmayan kartlar: default border, tıklanabilir
- [ ] Mobilde: yatay kaydırmalı veya 2x2 grid

---

## 3. "3 adımda hazır" — animasyon + spacing

**Sorun:** Statik görünüyor, sayfada boşluklar doğru oturmamış.

**Yapılacaklar:**

- [ ] Intersection Observer ile sıralı animasyon:
  - Sayfa scroll edilince section viewport'a girdiğinde tetiklensin
  - Adım 1 → 300ms sonra Adım 2 → 300ms sonra Adım 3
  - Her adım: opacity 0→1, translateY 20px→0 (fade-in + slide-up)
  - `motion-reduce` media query ile animasyonu atla
- [ ] Section spacing düzelt:
  - Üstteki ve alttaki section'larla aradaki boşlukları kontrol et
  - Fazla padding/margin varsa Tailwind default spacing'e (py-16 veya py-24) standartlaştır
  - Sayfadaki tüm section'lar arası tutarlı olsun

---

## 4. "Neden yzliste" — layout + animasyon

**Sorun:** İkonlar kartların tepesinde ortalı. Aziz 4 kartın yan yana, ikonların metnin başında (inline) olmasını istiyor. Ayrıca animatif olsun.

**Yapılacaklar:**

- [ ] Layout değişikliği:
  - Desktop: 4 kolon yan yana (grid-cols-4)
  - Her kartta: sol tarafta küçük ikon (24px) + sağda başlık ve açıklama
  - İkon ve başlık aynı satırda (flex, items-center, gap-2)
  - Açıklama ikinci satırda (başlık altında)
- [ ] Animasyon: aynı intersection observer yaklaşımı
  - 4 kart sırayla belirsin (soldan sağa, her biri 200ms arayla)
  - fade-in + slide-up
- [ ] Mobilde: tek kolon (grid-cols-1), her kart tam genişlik

---

## Doğrulama

- [ ] Hero'da 4 modül adı görünüyor mu?
- [ ] 4 içerik kartında Lucide ikonlar Araçlar dropdown ile tutarlı mı?
- [ ] Seçili kart ile tab paneli görsel olarak bağlı mı?
- [ ] "3 adımda hazır" scroll'da sırayla animasyonlu mu?
- [ ] "Neden yzliste" ikonlar inline, 4 kolon mu?
- [ ] Tüm animasyonlar motion-reduce'da atlanıyor mu?
- [ ] Mobil viewport'ta (375px) düzgün mü?
- [ ] CLAUDE.md UI kuralları: emoji yok, shadow yok, font-semibold/bold yok, renk paleti doğru mu?
