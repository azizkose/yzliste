# Changelog

## 2026-04-19 — G-13: /hesap empty state

- 0 üretim varsa "Son Üretimler" yerine motivasyon mesajı + "İlk içeriğini üret →" CTA gösterilir

## 2026-04-19 — Hero video arka plan + transparan header scroll davranışı

- AuthHero: video overlay (brightness-0.4), yeni subtitle, feature pill'leri kaldırıldı
- SiteHeader: ana sayfada scroll=0 → bg-transparent/beyaz; scroll>80px → bg-white/90

## 2026-04-19 — Tur 8 audit fixes + FeaturesTabbed 3-platform listing tabs

- Header auth bug (3-katmanlı fix): profiles query hatada signOut yerine default değer döner; onAuthStateChange ile TanStack cache invalidate; yükleme sırasında header gizlenir
- P0: `/hesap/*` dashboard 0 veri gösteriyordu — kök neden `generations` tablo adı (doğrusu `uretimler`)
- Footer KVKK + Çerez Politikası linkleri eklendi
- "6 pazaryeri" → "7 pazaryeri" (uret compact hero + FeaturesTabbed)
- Kütahya Porselen → Selin Porselen (yasal risk — tüm demo içeriklerde)
- Fiyat CTA: "Başla" → "Satın Al — X₺"; giriş yapmış kullanıcılar /kredi-yukle'ye yönlendirildi
- G-08: Fiyat kartlarına kredi başına maliyet eklendi (X,XX₺/kredi)
- ÖRNEK İÇERİK REVİZYONU: FeaturesTabbed "Listing Metni" sekmesine Trendyol|Amazon TR|Etsy pill alt-tab eklendi; her platform için tam listing verisi (commit 367ea04)

## 2026-04-19 — UX tutarlılık + landing copy + bug fixes (UX-04~12/18~21, T7-07/T7-09)

- UX-04: /uret sidebar logout CTA → "💡 Nasıl çalışır?" araç açıklaması
- UX-05: Tüm sekme butonları "✨ X Üret — Y kredi" formatına geçirildi
- UX-06: AuthHero başlık + alt metin değer odaklı yeniden yazıldı
- UX-07: BenefitsGrid 6 madde → rakibe karşı pozisyon alan 4 madde
- UX-08: HowItWorks 6 adım → "3 adımda hazır" 3 yatay kart
- UX-09: Fiyatlar kredi kartları 8→5 + "✅ Süre sınırı yok · Abonelik yok" özet satır
- UX-10: lib/paketler.ts tüm paketlerde birim fiyat formatı standartlaştırıldı
- UX-11: Blog kartlarında boş fotoğraf emoji kutusu kaldırıldı
- UX-12: Kategori text input → dropdown (11 kategori + Diğer fallback), zorunluluk kaldırıldı
- UX-18: /uret compact hero "7 Pazaryeri" → "6 Pazaryeri"
- UX-19: GorselSekmesi başlık badge duplikasyonu kaldırıldı
- UX-20: MetinSekmesi hızlı örnekler 3→5 (+Gıda +Takı)
- UX-21: Geçmiş üretimler inline toggle → /hesap/profil linki
- T7-07: fotolar[0] → sosyal.setSosyalFoto useEffect sync (SosyalSekmesi paylaşımlı fotoğraf)
- T7-09: /profil Hesabı Sil eski UX kaldırıldı, /hesap/ayarlar linkine yönlendirildi

## 2026-04-18 — HC audit, F-25b/d, KVKK consent log, /auth link temizliği

- HC-01: /giris, /kayit, /sss canonical tag'leri kendi URL'lerine düzeltildi
- HC-02: Blog linki doğru slug'a güncellendi (e-ticaret-icin-ai-urun-fotografciligi)
- HC-03: /fiyatlar, /blog, /auth OG image eklendi
- HC-04: /auth sitemap'ten çıkarıldı; HC-06: /sss sitemap'e eklendi
- HC-05: page.tsx cikisYap() sonrası /auth → /giris
- F-25b: PaketModal 3 adımlı çoklu-step akışa çevrildi (paket→fatura→ödeme)
- F-25d: /hesap/faturalar sayfası, /api/fatura endpoint, payments.parasut_fatura_id migration
- F-07d: consent_log tablosu + /api/consent endpoint — KVKK onayları DB'ye kaydediliyor
- PQ-28 sub-5: blobIndir() helper — tekrarlanan blob indirme kodu tekilleştirildi
- PQ-28 sub-6: Modal × butonlarına aria-label, tab nav'a role="tablist" + aria-selected
- PQ-28 sub-7: auth/page.tsx inline ödeme modalı kaldırıldı → /?paket=ac redirect (750→666 satır)
- Tüm kalan /auth stale linkler → /giris veya /kayit (HeaderAuthButtons, toplu, profil, blog slug, krediler)

## 2026-04-18 — auth/page.tsx inline ödeme modalı kaldırıldı (PQ-28 kısmi)

- Inline payment modal (odemeBaslat, odemeRef vb.) → /?paket=ac redirect
- PaketModal (fatura bilgileri + consent log dahil) artık tek checkout yolu
- 750→666 satır (-84 satır)
- Krediler sayfasına "Faturaları Görüntüle" linki eklendi

## 2026-04-18 — KVKK consent log + accessibility

- consent_log migration: checkout onayları timestamp + IP + user_agent ile kaydediliyor
- /api/consent endpoint oluşturuldu
- PaketModal: ödeme başlamadan önce consent kaydediliyor
- page.tsx: sekme nav'a role="tablist", butonlara aria-label eklendi

## 2026-04-18 — F-25d: /hesap/faturalar sayfası

- /hesap/faturalar/page.tsx: başarılı ödemeler + PDF indir + e-posta gönder
- /api/fatura: Paraşüt PDF URL ve e-posta endpoint
- Migration: payments.parasut_fatura_id + fatura_email_gonderildi kolonları
- Callback: parasut_fatura_id artık payments tablosuna kaydediliyor
- /hesap sayfasına Faturalar linki eklendi

## 2026-04-18 — F-25b: Checkout fatura bilgileri adımı

- PaketModal: 3 adımlı akış (paket → fatura → ödeme). Fatura alanları: Ad/Unvan, TC/VKN, Adres, Vergi Dairesi, Bireysel/Kurumsal.
- Profil doluysa fatura adımı atlanır, doğrudan iyzico'ya geçer.

## 2026-04-18 — HC-01/02/04/05/06: SEO + sitemap + canonical düzeltmeleri

- sitemap.ts: /auth kaldırıldı, /sss eklendi
- giris/kayit/sss sayfalarına doğru canonical tag eklendi
- page.tsx: cikisYap /auth→/giris, kırık blog linki düzeltildi

## 2026-04-18 — PQ-28 kısmi: Monolith refactor ilk aşama

- lib/constants.ts: PLATFORM_BILGI, YUKLENIYOR_MESAJLARI, GORSEL_STILLER (9), VIDEO_PRESETLER (14), kategoriKoduHesapla()
- lib/listing-utils.ts: sonucuBolumle() + docxIndir() çıkarıldı
- components/ui/: KopyalaButon, FotoThumbnail, FotoEkleAlani oluşturuldu
- components/PaketModal.tsx, components/ChatWidget.tsx oluşturuldu
- app/page.tsx: inline tanımlar kaldırıldı → import'a çevrildi (2180→1848 satır, -332 satır)

## 2026-04-17 — Küme 0 tamamen tamamlandı (PQ-01~PQ-28 d)

- PQ-00~PQ-26: İçerik kalitesi, görsel pipeline, UX iyileştirmeleri, SEO, renk paleti
- PQ-14: Sekmeler arası Zustand store ile ürün bilgisi senkronu
- F-22a/b/c: Hesap dashboard metrik kartları (bu ay üretim, kalan kredi, favori platform, tasarruf)
- F-10c: Platform uyumluluk rozeti üretim sonrası
- F-12a: Mikro-aksiyonlar (Kısalt, Genişlet, Ton değiştir, Yeniden üret)
- F-12c: Sağ panelde platform filtreli geçmiş listesi
- F-12d: 3 ücretsiz yeniden üret hakkı per kredi
- F-11d: Marka/IP uyarısı komponenti (30+ marka tespiti)
- F-23b/c: Onboarding banner (total_generations=0) + son üretim shortcut
- CB-02~CB-07: Chatbot feedback sistemi (user_feedback + feedback tabloları, admin paneli)
- Küme 8 Chatbot: ChatWidget tam yeniden yazıldı (öneri/şikayet modu, thumbs feedback)
