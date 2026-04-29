# /uret Sayfası UX Redesign — Spec

**Bölüm konumu:** /uret sayfası
**Mockup referans:** `uret-redesign-mockup.jsx`
**Design system referans:** `00-design-system.md` v1.0 (anasayfa paketi)
**Yaklaşım:** Hafif refaktör (Yaklaşım A) — mevcut iskelet korunur, 5 ana UX problemi çözülür.

> **Önemli:** Bu paket anasayfa paketinden bağımsız ele alınabilir. Her iyileştirme ayrı bir ticket grubu, ayrı PR. Biri patlasa diğerleri etkilenmez.

> **Korunacaklar:** 4 sekme yapısı, 7 stüdyo stil grid'i, 5 video hareket preset'i, karakter limit eyebrow'ları, üstteki ortak fotoğraf yükleme alanı, sağ üstteki kredi göstergesi.

---

## A. Niyet (Genel)

`/uret` sayfası **işlevsel olarak güçlü ama kullanıcıya 30 saniyelik bir deneyim sunmuyor.** Anasayfa "30 saniyede ilk içerik hazır" sözü veriyor, ama bu sayfada kullanıcı 5+ karar vermek zorunda ve bilişsel yük yüksek.

Çözüm: sayfayı yeniden yapma, **5 noktada cerrahi UX iyileştirmesi yap.** Mevcut iyi parçaları koru.

**5 iyileştirme:**
1. **Niyet hatırlatıcı** — sayfa başında kullanıcının niye geldiğini hatırlatan banner
2. **Canlı kredi maliyeti** — sticky alt bar, seçimler değiştikçe maliyet ve kalan kredi anlık güncellenir
3. **Marka profili interaktif** — sarı banner yerine tıklanabilir "önce dene" demosu
4. **Disabled buton tooltip** — neden disabled olduğunu söyleyen tooltip
5. **Şeffaf kredi etiketleri** — "∞ kredi" / "0 kredi" gibi anlamsız ifadeleri gerçek mesajlarla değiştir

---

# İyileştirme #1 — Niyet Hatırlatıcı (Intent Banner)

## Niyet
Kullanıcı anasayfadan `/uret`'e tıklayıp geliyor — niyetini hatırlatmak istiyoruz. Şu an sayfa "Marka profilinizi doldurun" sarı banner'ı ile karşılıyor; bu kullanıcının niyetiyle ilgisiz bir uyarı.

## Değişiklik
Sayfanın en üstüne (sarı marka uyarısının yerine) bir **çıpa banner** ekle. Marka uyarısı **iyileştirme #3'ün** parçası olarak farklı bir yere taşınacak.

## Component anatomisi
```
<IntentBanner>                          ← bg-white, border-slate-200, rounded-2xl, p-6
  ├── Eyebrow ("ADIM 1 / 3 — NE ÜRETMEK İSTİYORSUN?")
  ├── H1 ("İçerik türünü seç")
  └── Subtitle ("Her tür için ayrı bir form var. Aynı ürün için birkaçını üst üste de üretebilirsin.")
```

## Görsel detaylar
- Background: `white`
- Border: `1px solid slate-200`
- Border radius: `16px`
- Padding: `24px`
- Box-shadow: hafif (`0 1px 3px rgba(15,23,42,0.04)`)
- Eyebrow: `Inter 600`, `11px`, uppercase, `letter-spacing 0.1em`, `primary-700` rengi
- H1: `Manrope 700`, `24px`, `slate-900`, `letter-spacing -0.01em`
- Subtitle: `Inter 400`, `14px`, `slate-500`

## Kabul kriterleri
- [ ] Sayfa açıldığında ilk görünen blok bu banner
- [ ] Sarı "Marka profilinizi doldurun" banner'ı **kaldırıldı** veya farklı bir konumda (iyileştirme #3'e bak)
- [ ] Eyebrow'da "ADIM 1 / 3" yazıyor — kullanıcıya akış olduğunu hissettiriyor
- [ ] H1 ve subtitle ekranın okuma akışını doğru kuruyor

## Aziz'e açık sorular
- "ADIM 1 / 3" demek için 3 adımlı bir akış mı kuruyoruz? Eğer hayır, "Sayfaya hoş geldin" gibi daha yumuşak bir ifade olabilir. (Önerim: 3 adımı koru çünkü anasayfada "3 adımda hazır" diyoruz.)

---

# İyileştirme #2 — Canlı Kredi Maliyeti (Sticky Submit Bar)

## Niyet
Mevcut sayfada kredi maliyeti 3 farklı yerde gösteriliyor: form başlığı (sağ üst, küçük gri), üst eyebrow (Görsel sekmesinde "Stil başına 1 kredi"), ve butonlarda ("∞ kredi", "0 kredi"). Kullanıcı **bir bakışta toplam ne kadar harcayacağını** göremiyor.

## Değişiklik
Sayfanın altına **sticky submit bar** ekle. Bar 2 parçadan oluşur:
- Sol: Bu üretimin maliyeti (büyük rakam) + kalan kredi açıklaması
- Sağ: "İçerik üret" butonu

## Component anatomisi
```
<StickySubmitBar>                        ← position: sticky, bottom: 20px
  ├── <CostSummary>                      ← sol, flex: 1
  │     ├── Eyebrow ("BU ÜRETİMİN MALİYETİ")
  │     └── CostRow
  │           ├── BigNumber (canlı hesaplanan kredi)
  │           ├── "kredi"
  │           └── KalanKredi açıklaması
  └── <SubmitButton />                   ← sağ, ana CTA
```

## State / Hesaplama mantığı
```ts
function calculateCredits(): number {
  if (activeTab === 'metin')     return 1
  if (activeTab === 'gorsel')    return selectedStyles.length
  if (activeTab === 'video')     return videoLength === 5 ? 10 : 20
  if (activeTab === 'sosyal')    return socialPlatforms.length * 1
  return 0
}

const userBalance = 99  // backend'den geliyor
const cost = calculateCredits()
const remaining = userBalance - cost
```

## Görsel detaylar
- Bar: `position: sticky; bottom: 20px;`
- Background: `white`
- Border: `1px solid slate-200`
- Border radius: `16px`
- Padding: `16px 20px`
- Box-shadow: `0 8px 24px rgba(15, 23, 42, 0.08)` (üstten gölge — yüzdüğünü hissettir)
- BigNumber: `Manrope 800`, `28px`, `slate-900`, `letter-spacing -0.02em`
- "kredi" suffix: `14px`, `slate-500`
- KalanKredi: `12px`, `slate-500`, "Hesabında **99** kredi var, üretim sonrası **{99-cost}** kalır"

## Kabul kriterleri
- [ ] Bar sayfanın altında sticky duruyor (scroll'la beraber kayıyor)
- [ ] Sekme değişince maliyet güncelleniyor (Metin → 1, Görsel → seçili stil sayısı, vb.)
- [ ] Görsel sekmesinde stil seçince maliyet **anında** güncelleniyor
- [ ] Video sekmesinde 5sn / 10sn değişimi maliyeti güncelliyor
- [ ] Sosyal sekmesinde platform ekleme/çıkarma maliyeti güncelliyor
- [ ] Kalan kredi doğru gösteriliyor (`balance - cost`)
- [ ] Kalan kredi negatif olamaz (yetersiz krediyse uyarı göster — bonus)
- [ ] Submit butonu bar'ın sağında, primary mavi, "İçerik üret" yazısıyla
- [ ] Mobile'da bar full width, dikey istif (cost üstte, button altta)

## Aziz'e açık sorular
- Kullanıcının kredi bakiyesi yetmezse ne olmalı? Buton disabled + tooltip "Yetersiz kredi, paket al" + hızlı CTA `/fiyatlar`'a mı? (Önerim: evet)

---

# İyileştirme #3 — Marka Profili Interaktif Demo

## Niyet
Mevcut sayfada marka profili eksikliği **sarı bir banner** ile gösteriliyor. Kullanıcı bunu okuyup "tamam, daha sonra" diyor — özellik gizli kalıyor. Anasayfada **interaktif chip'le tonun çıktıyı nasıl değiştirdiğini** göstermiştik. Burada da aynı interaktiviteyi getir.

## Değişiklik
Sarı banner yerine **collapsible interaktif demo blok**:
- Kapalıyken: "Marka profili eksik" mesajı + "Önce dene" butonu
- Açıkken: 3 ton chip (Samimi / Profesyonel / Premium) + canlı AI çıktı önizlemesi
- Kullanıcı bir tonu seçince:
  - Banner'ın rengi turuncu → yeşil (yeşil border-left)
  - "Marka tonu: Samimi ✓" mesajı
  - AI çıktısı altında canlı görünür

## Component anatomisi
```
<BrandProfileBlock>                      ← bg-white, border-l-4 (turuncu/yeşil), rounded-xl
  ├── <Header>
  │     ├── Sparkles icon (turuncu/yeşil)
  │     ├── Title ("Marka profili eksik" | "Marka tonu: X ✓")
  │     ├── Subtitle açıklama
  │     └── <ToggleButton>               ← "Önce dene" / "Gizle"
  └── <DemoArea>                         ← collapsible
        ├── ToneSelector (3 chip)
        └── AIPreview                    ← canlı değişen çıktı
```

## State
```ts
interface BrandProfileBlockState {
  showDemo: boolean       // collapsible açık mı
  activeTone: 'samimi' | 'profesyonel' | 'premium' | null  // null = henüz seçilmedi
}
```

## Davranışlar
- Sayfa ilk yüklendiğinde: demo kapalı, banner turuncu (border-left), "Marka profili eksik"
- "Önce dene" butonu: demo'yu açar
- Bir ton chip'ine tıklayınca: `activeTone` güncellenir, AI çıktı 300ms fade animasyonuyla değişir
- Bir kere ton seçilince: banner yeşile dönüşür, "Marka tonu: Samimi ✓"
- Demo açık kalsa da sayfa içeriğini bozmaz — bu sadece bir önizleme. Gerçek marka profili `/profil` (veya benzeri) sayfasında düzenlenir
- Gerçek kayıt için "Profili düzenle" CTA — modal açar veya `/profil`'e yönlendirir

## Görsel detaylar
- Border-left: `4px solid` — turuncu (#F97316) eksikse, yeşil (#10B981) seçildiyse
- Border (diğer 3 yön): `1px solid` — turuncu varyantta `#FED7AA`, yeşil varyantta `#86EFAC`
- "Önce dene" butonu: outline stil, `primary-700` text
- Demo açıldığında: `border-top: 1px solid slate-100`, ardından grid 1fr 1.2fr (chip'ler solda, AI önizleme sağda)
- AI önizleme kutusu: `bg-slate-50`, `border-slate-200`, `rounded-lg`, padding 14px

## Ton metinleri (örnek)
Anasayfa paketinde de kullandık. Aynı 3 metni burada da kullan:
```ts
const TONE_OUTPUTS = {
  samimi: 'Mutfağına şıklık katacak fincan setimizle tanış 💛 Misafirlerin görür görmez "nereden aldın?" diyecek.',
  profesyonel: 'Birinci kalite porselenden üretilen fincan setimiz, günlük kullanım ve özel anlar için tasarlandı.',
  premium: 'El işçiliğinin zarafetini sofranıza taşıyan porselen fincan koleksiyonumuz.',
}
```

## Kabul kriterleri
- [ ] Sarı `Marka profilinizi doldurun` banner'ı kaldırıldı
- [ ] Yerine collapsible interaktif blok geldi
- [ ] Kapalıyken turuncu border-left, "Marka profili eksik"
- [ ] "Önce dene" butonu demo'yu açıyor
- [ ] 3 ton chip'i tıklanabilir, sadece biri aktif (radio)
- [ ] Aktif chip'e tıklayınca AI önizleme 300ms fade ile değişiyor
- [ ] Bir ton seçildikten sonra banner yeşile dönüyor
- [ ] "Profili düzenle" CTA `/profil` sayfasına gidiyor (veya modal açıyor)
- [ ] Klavye ile erişilebilir: chip'ler radio group, Enter/Space ile seçim
- [ ] `aria-live="polite"` ile AI önizleme değişimi screen reader'a bildiriliyor

## Aziz'e açık sorular
- Marka profili gerçek kaydı `/profil` sayfasında mı, yoksa modal mı? (Mevcut sayfa /profil veya benzeri bir route'a yönlendiriyor sanırım — Cowork bulmalı.)
- Demo'da seçilen tonu **gerçek üretimde** kullanalım mı, yoksa sadece önizleme mi? (Önerim: önizleme, gerçek üretim için kullanıcı profili kaydetsin — yoksa kullanıcı her sayfa açışında yeniden seçer.)

---

# İyileştirme #4 — Disabled Buton Tooltip

## Niyet
Mevcut sayfada "İçerik üret" butonu form eksik olduğunda disabled görünüyor ama **niye disabled olduğu söylenmiyor**. Kullanıcı tıklayıp tıklayıp anlamaya çalışır.

## Değişiklik
Buton disabled iken üzerine gelindiğinde (hover veya focus) **tooltip** göster: "Önce ürün adını yaz" / "Önce ürün fotoğrafı ekle" / "En az bir stil seç" gibi.

## State / Davranış mantığı
```ts
function getCTAState() {
  if (activeTab === 'metin') {
    if (!productName.trim()) return { disabled: true, reason: 'Önce ürün adını yaz' }
    return { disabled: false, reason: null }
  }
  if (activeTab === 'gorsel') {
    if (!hasPhoto)             return { disabled: true, reason: 'Önce ürün fotoğrafı ekle' }
    if (selectedStyles.length === 0) return { disabled: true, reason: 'En az bir stil seç' }
    return { disabled: false, reason: null }
  }
  if (activeTab === 'video') {
    if (!hasPhoto) return { disabled: true, reason: 'Önce ürün fotoğrafı ekle' }
    return { disabled: false, reason: null }
  }
  if (activeTab === 'sosyal') {
    if (!productName.trim()) return { disabled: true, reason: 'Önce ürün adını yaz' }
    if (socialPlatforms.length === 0) return { disabled: true, reason: 'En az bir platform seç' }
    return { disabled: false, reason: null }
  }
}
```

## Tooltip görsel
- Pozisyon: butonun **üstünde** (8px boşluk)
- Background: `slate-900`
- Color: `white`
- Padding: `8px 12px`
- Border radius: `8px`
- Font size: `13px`
- Box-shadow: `0 4px 12px rgba(0,0,0,0.15)`
- Pointer (üçgen): butonun ortasına bakacak şekilde
- Animasyon: 200ms fade-in
- Mobil: hover yok → focus veya tap'ta görünür

## Erişilebilirlik
- ARIA: `aria-disabled="true"` + `aria-describedby="cta-reason"` 
- Tooltip içeriği `<span id="cta-reason" role="tooltip">`
- Klavye: butona Tab ile geldiğinde tooltip otomatik görünmeli

## Kabul kriterleri
- [ ] Form eksikken buton görsel olarak disabled (slate-300 bg)
- [ ] Hover/focus'ta neden tooltip'i görünüyor
- [ ] Tooltip metni doğru — sekmeye göre değişiyor
- [ ] Form tamamlanınca tooltip kayboluyor, buton aktif (primary mavi)
- [ ] Klavye ile erişilebilir
- [ ] Mobile'da tap'ta tooltip görünür kalıyor (en az 2 saniye)

## Aziz'e açık sorular
- Tooltip metinleri yeterince net mi? Daha kısa: "Ürün adı gerekli", daha uzun: "Üretmek için ürün adını yazman gerekiyor". (Önerim: kısa, mockup'taki gibi.)

---

# İyileştirme #5 — Şeffaf Kredi Etiketleri

## Niyet
Mevcut sayfada **anlamsız etiketler** var:
- "Instagram caption üret — ∞ kredi" → kullanıcı "sınırsız mı?" sanır, aslında "henüz hesaplanmadı" demek
- "Sosyal medya kiti — 0 kredi" → kullanıcı "ücretsiz mi?" sanır, aslında "form eksik" demek
- "Video üret — giriş gerekli" → karışık (login + form sorunlarını ayırmıyor)

## Değişiklik
Bu etiketleri **gerçek anlamlı mesajlarla** değiştir. İyileştirme #2 (canlı kredi) ile birleşince zaten **sticky bar** kredi maliyetini gösteriyor. Form butonları sadece "İçerik üret" der, kredi yazısı bar'da kalır.

Sosyal medya sekmesindeki **iki ayrı buton** ("caption" ve "kit") ile ilgili:
- Eğer "kit" gerçekten kullanıcı için faydalıysa → ayrı bir CTA olarak kalsın ama açıklaması net olsun: "Sosyal medya kiti (4 platform için tek seferde) — 4 kredi"
- Eğer "kit" sadece teknik bir konsept ise → kaldır, normal "platform seç → caption üret" akışı yeter

**Önerim:** "Sosyal medya kiti" konseptini kaldır. Kullanıcı 4 platformu işaretler → 4 kredi düşer → 4 caption üretilir. Tek akış, anlaşılır.

## Yapılacak değişiklikler
1. Tüm form içi "X kredi" yazıları kalksın — kredi bilgisi sadece sticky bar'da olsun
2. "∞ kredi" yazıları kalksın
3. "Sosyal medya kiti" konsepti kalksın (tek "İçerik üret" CTA'sı yeter)
4. "Giriş gerekli" mesajları kalksın — login akışı ayrı bir mekanizma olmalı (iyileştirme #4'teki tooltip akışına benzer şekilde, login gerekiyorsa "Önce giriş yap" tooltip'i)

## Kabul kriterleri
- [ ] Tüm sekmelerin form içinde kredi yazıları kaldırıldı
- [ ] Kredi bilgisi sadece sticky bar'da
- [ ] "∞ kredi", "0 kredi" gibi etiketler yok
- [ ] Sosyal medya sekmesinde tek CTA var (caption üretimi). "Kit" kavramı kaldırıldı veya açıkça anlatıldı
- [ ] Login gerekiyorsa tooltip "Önce giriş yap" diyor + click'te `/login`'e yönlendirir

## Aziz'e açık sorular
- "Sosyal medya kiti" özelliği gerçekten farklı bir şey mi yapıyor (örn: caption + görsel + hashtag bir arada)? Eğer öyleyse ayrı bir CTA olarak kalsın, ama açıklaması net olsun. Eğer sadece "4 platform için ayrı caption" demek, kit kavramı kaldırılsın.

---

# Genel Görsel Standartlar (Anasayfa Paketi ile Uyum)

## Renk paleti
Mevcut `/uret` sayfasının bej tonları (`#F1F0EB, #D8D6CE, #FAFAF8, #5A5852`) **anasayfa paletine** dönüştürülecek.

| Eski | Yeni | Kullanım |
|---|---|---|
| `#1E4DD8` | `#1E40AF` (primary-700) | Ana mavi |
| `#F1F0EB` | `#F1F5F9` (slate-100) | Soft bg |
| `#D8D6CE` | `#E2E8F0` (slate-200) | Border |
| `#FAFAF8` | `#F8FAFC` (slate-50) | Page bg |
| `#5A5852` | `#475569` (slate-600) | Body text |
| `#1A1A17` | `#0F172A` (slate-900) | Headings |
| `#908E86` | `#94A3B8` (slate-400) | Muted text |

## Tipografi
- Headings: Manrope (700/800)
- Body: Inter (400/500/600)
- Anasayfa paketindeki design system'e referans

## Spacing
- Container max-width: `1100px` (mevcuttaki 5xl ~1024 veya 6xl ~1152 yerine standart)
- Card padding: `20px-24px`
- Card gap: `12px-20px`

---

# Out of Scope (Bu pakette yapılmayacaklar)

- ❌ Wizard yapısına dönüşüm (Yaklaşım B → C reddedildi, mevcut iskelet korunuyor)
- ❌ Backend / API değişikliği — formlar aynı endpoint'lere postlamalı
- ❌ Yeni içerik türü ekleme
- ❌ Excel toplu import refaktörü — mevcut haliyle korunuyor (ama "Toplu (Excel)" diye daha net etiketi var)
- ❌ Marka profili kaydetme sayfasının redesign'ı — sadece /uret üzerindeki interaktif önizleme
- ❌ Login akışı redesign — sadece login gereken yerlerde tooltip iyileştirmesi
- ❌ Mobile detaylı responsive geçişi — pilot olarak desktop bitirilsin, mobile sonraki turda

---

# Aziz'e Toplu Açık Sorular

1. **3 adımlı akış:** "ADIM 1 / 3" yazsın mı yoksa daha yumuşak "İçerik türünü seç" diye direkt başlasın mı?
2. **Yetersiz kredi durumu:** Bakiye yetmezse buton disabled + "Yetersiz kredi, paket al" tooltip + `/fiyatlar` link mi?
3. **Marka profili kayıt route'u:** "Profili düzenle" nereye gidiyor? `/profil`, `/marka`, modal?
4. **Demo tonu gerçek üretimde kullanılsın mı:** Demo'da seçilen ton sayfa içinde geçici olarak hatırlansın mı yoksa sadece önizleme mi?
5. **"Sosyal medya kiti" konsepti:** Kaldıralım mı, yoksa farklı bir özellik mi?
6. **Tooltip metinleri:** Mockup'taki kısa versiyonlar yeterli mi? ("Önce ürün adını yaz" vs "Üretmek için ürün adını yazman gerekiyor")

---

# Backlog Hint (Cowork için ticket önerileri)

**Epic:** /uret Sayfası UX Refactor

**Ticket grubu 1 — Renk paleti uyumu (önce, bağımlılık):**
- TICKET-U.1: Anasayfa renk paletini `/uret` Tailwind config'e taşı veya color token mapping yap

**Ticket grubu 2 — İyileştirme #1 (Niyet hatırlatıcı):**
- TICKET-U.2: Sarı marka uyarısı banner'ını kaldır
- TICKET-U.3: IntentBanner component'i ekle

**Ticket grubu 3 — İyileştirme #3 (Marka profili interaktif):**
- TICKET-U.4: BrandProfileBlock component scaffold (collapsible)
- TICKET-U.5: ToneSelector (3 chip, radio group)
- TICKET-U.6: AIPreview (canlı değişen çıktı, fade animation)
- TICKET-U.7: "Profili düzenle" CTA route bağlantısı

**Ticket grubu 4 — İyileştirme #2 (Canlı kredi maliyeti):**
- TICKET-U.8: `calculateCredits()` hook (her sekme için)
- TICKET-U.9: StickySubmitBar component
- TICKET-U.10: Kalan kredi hesabı + yetersiz kredi durumu

**Ticket grubu 5 — İyileştirme #4 (Disabled tooltip):**
- TICKET-U.11: `getCTAState()` hook
- TICKET-U.12: Tooltip primitive (eğer yoksa)
- TICKET-U.13: Disabled buton + tooltip entegrasyonu

**Ticket grubu 6 — İyileştirme #5 (Şeffaf etiketler):**
- TICKET-U.14: Form içi kredi yazılarını sil
- TICKET-U.15: "∞ kredi", "0 kredi" yazılarını sil
- TICKET-U.16: Sosyal medya kit konseptine karar ver (Aziz onayı sonrası)
- TICKET-U.17: Login gerektiren CTA'larda tooltip + redirect mantığı

**Ticket grubu 7 — Polish & PR:**
- TICKET-U.18: Mobile responsive sweep (sticky bar, formlar)
- TICKET-U.19: A11y audit (radio group, tooltip ARIA, focus management)
- TICKET-U.20: Lighthouse pass
- TICKET-U.21: PR + Aziz onay

**Bağımlılıklar:**
- TICKET-U.1 hepsinden önce
- Ticket grubu 2-6 paralel yapılabilir (her biri bağımsız iyileştirme)
- TICKET-U.18-21 son

---

**Bu spec ile mockup beraber ele alınmalı. Mockup `uret-redesign-mockup.jsx` — 5 iyileştirmenin canlı interaktif demosu.**
