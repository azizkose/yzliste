# DA-05: /uret Sayfası Modern UX — 2026 Seviyesi

**Durum:** Açık
**Öncelik:** P1
**Tahmini süre:** 3-4 saat
**Kural:** Önce planı göster, onay al, sonra uygula.

---

## Sorun

/uret sayfası çok monochrome ve düz. Görsel içerik üretim aracı olmasına rağmen hiç enerji vermiyor. Yıl 2026 — sadece renk eklemek yetmez, modern bir üretim aracı hissi vermeli.

## Tasarım Kısıtları (CLAUDE.md)

- Emoji yok, shadow yok, font-semibold/bold yok
- Renk paleti sabit (primary blue + neutral)
- rounded-2xl/3xl yok

## Yapılacaklar — Modern Hayat Katma

Aşağıdaki fikirleri CODE planında önce listele, Aziz onaylasın:

### Renk ve kontrast
- [ ] Aktif sekme arka planı: `#F0F4FB` (açık mavi) — hangi modda olduğun belli olsun
- [ ] Form alanları arası ince primary accent çizgi veya ayırıcı (1px `#BAC9EB`)
- [ ] Submit buton: daha belirgin — `bg-[#1E4DD8]` + hover transition (scale-[1.02] + renk koyulaşma)

### Mikro-etkileşimler
- [ ] Sekme geçişlerinde content fade transition (150ms)
- [ ] Form alanlarına focus'ta hafif border renk değişimi (`#1E4DD8`)
- [ ] Submit buton hover'da subtle transform (translateY(-1px))
- [ ] Üretim sırasında skeleton/shimmer loading (düz spinner yerine)

### Görsel zenginlik
- [ ] Sağ panel veya üst kısımda: son üretilen içeriğin küçük önizlemesi (thumbnail)
- [ ] Platform seçim kartlarında: platform logosu veya ayırt edici ikon
- [ ] Boş state'te (henüz üretim yok): ince bir illüstrasyon veya placeholder grid
- [ ] Form header'da aktif modun küçük ikonu (FileText/Camera/Clapperboard/Share2)

### Layout
- [ ] Desktop'ta 2 kolon: sol form, sağ önizleme/sonuç — daha "uygulama" hissi
- [ ] Mobilde: tek kolon, sağ panel alta düşer
- [ ] Progress indicator: form doluluk oranı göstergesi (üstte ince progress bar)

## NOT

Bu görev sadece renk değil — mikro-etkileşimler ve layout ile "modern üretim aracı" hissi verilmeli. Canva/Figma gibi araçların sadeliğinden ilham al, ama yzliste design system kurallarını ihlal etme.

## Doğrulama

- [ ] Sayfa artık monochrome hissettirmiyor mu?
- [ ] Mikro-etkileşimler çalışıyor mu? (hover, focus, transition)
- [ ] Mevcut üretim akışı bozulmadı mı?
- [ ] CLAUDE.md UI kuralları: emoji yok, shadow yok, font-semibold/bold yok, doğru renk paleti
- [ ] Mobil (375px) düzgün mü?
- [ ] motion-reduce'da animasyonlar atlanıyor mu?
