# Changelog

## 2026-04-28 — Redesign IC-01~IC-05: /blog + /blog/[slug] + /sss + /hakkimizda (rd-* tokens, ChipSelector filter, accordion, warm-earth kurucu, BlogPaylas share)

## 2026-04-27 — Redesign: FY-01~11 FiyatlarSection (landing fiyatlar bölümü)

- FY-01: `lib/constants/fiyatlar-landing.ts` — PAKET_LISTESI re-export, SLIDER_CONFIG, TRUST_POINTS. Commit `28b221c`
- FY-02: `FiyatlarSection.tsx` scaffold — `use client`, SectionHeader, _tanitim-redesign entegrasyonu. Commit `42e95de`
- FY-03~05: CreditCalculator inline — slider range input, useMemo recommendation, handleSliderChange + fill CSS. Commit `ad2719f`
- FY-06~07: PackageCard grid (3 kolon) — popular 2px border + md:-translate-y-2, "Senin için" yeşil badge slider reaktif. Commit `fec994f`
- FY-08: Trust points footer — 4 madde, `·` ayraçlı, aria-hidden. Commit `29d4e61`
- FY-09: CTA route `/fiyatlar` constants üzerinden. Commit `fd9a2aa`
- FY-10: Mobile responsive — lg:grid-cols-2 calculator, md:grid-cols-3 packages, md:-translate-y-2. Commit `b9faf36`
- FY-11: A11y — aria-live polite, role slider, aria-valuemin/max/now/text, focus-visible. Commit `464b40b`
- globals.css: `.fiyatlar-slider` custom CSS (gradient fill, webkit/moz thumb, focus-visible ring)

## 2026-04-27 — Redesign: MB-01~10 MarkaBilgileriSection + NY-01~07 NedenYzlisteSection

- MB-01~10: Marka bilgileri bölümü — ton radiogroup (roving tabindex), key-driven fade-in, aria-live output. Commit `4ef11f5`
- NY-01~07: Neden yzliste bölümü — semantic table (desktop) + kart layout (mobil), 6 karşılaştırma satırı, Lucide X/Check. Commit `ae19f42`
- globals.css: output-fade-in keyframe + reduced-motion kuralı eklendi

## 2026-04-21 — KÜME 9 Faz 0: Error boundary, .env.example, branching, vercel.json, fiyatlar structured data fix (SC-06)

## 2026-04-20 — KF-05-FIX + KF-01 tamamla + görsel sıkıştırma

- KF-05-FIX: blog-parser FOTO regex + img fallback; FeaturesTabbed Detay Tarama/Kumaş Hareketi preset — ce648a0/cf77708
- KF-01 tamamla: fiyatlar+SSS+senaryo tablosu+FeaturesTabbed video kredi 5/8→10/20 — 0128faf
- perf: still-life-with-classic-shirts-hanger.jpg 16.5MB → 80KB — 8ec57de

## 2026-04-20 — Hero video final + SC-05 blog 404 + mobil poster fix

- hero-video-full.mp4 git'e eklendi (6.5MB, 20sn), AuthHero src güncellendi — commit 5768914/01ac57a
- Mobil poster fix: aspect-video sadece md+ ekranda, mobilde min-h-[60vh] — commit a7d7038
- SC-05: /blog/trendyol-urun-listeleme-rehberi → trendyol-listing-nasil-yazilir 301 redirect — commit ff91ca9

## 2026-04-20 — NF-03 maliyet loglama + hero video fix

- NF-03: uretimler.api_cost migration, uret/route Anthropic token+maliyet kaydı, admin statik fiyat/marj tablosu
- Hero video fix: hero-video-full.mp4 git'te yoktu → hero-video.mp4'e döndürüldü (tablet+ video, mobil poster)

## 2026-04-20 — HESAP yapısı + PE-10/11 + overscroll + tonEnMap

- HESAP YAPISI: /hesap/marka + /hesap/uretimler yeni route'lar; profil tab'sızlaştı, useCredits; 6 kart grid
- PE-10: foto moduna hedefKitle, fiyatSegmenti, anahtarKelimeler alanları eklendi
- PE-11: lib/constants/ton.ts merkezi tanım — TON_EN_MAP (gorsel) + TON_VIDEO_MAP (video), tüm tonlar
- SAYFA SONU OVERSCROLL: overscroll-behavior: none (iOS elastic bounce engelleme)

## 2026-04-20 — Hero video + KF P1 fixes + PE-02 tamamlandı

- AuthHero: video object-contain (kırpmasız), hero-video-full.mp4 (kullanıcı kopyaladı)
- KF-01 son: useVideoUretim.ts videoKredi 5/8 → 10/20 (hook eski fiyatla düşüyordu)
- KF-02: KrediButon kredi prop opsiyonel — admin'de "0 kredi" gizlendi
- KF-03: VideoSekmesi indirme butonu loading state + disabled
- PE-02 tamamlandı: duzenle route'a PLATFORM_CONTEXT + kategori, MetinSekmesi'nden gönderiliyor

## 2026-04-20 — P0+P1 prompt/kredi iyileştirmeleri + Blog taşıma

- KF-01: Video kredisi 5sn 5→10 kr, 10sn 8→20 kr (paketler + API + UI)
- PE-01: lib/fal/rmbg.ts helper — gorsel/video/kit route'larına RMBG entegrasyonu
- PE-02: Düzenleme API atomik kredi düşümü (1 kr, LLM öncesi) + refund + sistem prompt
- PE-03: Video auto-prompt stilIpucu aktif (ton bazlı kamera tarifi)
- PE-04~07: metin.ts dead code temizliği, ton önceliği, marka_adi gorsel, video profil genişletme
- PE-08: lib/credits.ts atomik helper (krediDus/krediIade) — video+sosyal route'a uygulandı
- NF-06: KrediButon component — 2+ kredi işlemlerde onay dialog'u (video + sosyal kit)
- Blog: 35 yeni yazı eklendi, Türkçe/boşluklu dosya isimleri kebab-case slug'a taşındı

## 2026-04-19 — Hero video tam çözüm + Hesap merkezi + Blog arama + Admin güvenlik

- AuthHero: lg:aspect-video (desktop 16:9), mobil `<img poster>` + tablet+ `<video>` split — kırpılma tamamen giderildi
- Hero: yeni video (1.4MB) + hero-poster.jpg (94KB) eklendi — coworker üretimi
- /hesap/profil: /profil içeriği taşındı, şifre bölümü kaldırıldı, /profil → 301 redirect
- Admin: /api/admin/metrics API route (service key, RLS bypass), is_admin DB kontrolü, NEXT_PUBLIC_ADMIN_EMAIL kaldırıldı
- Blog: BlogListesi.tsx client component — metin arama + kategori pill filtresi
- F-20b: docs/marka-sesi.md oluşturuldu (ton kılavuzu, yasaklı kelimeler, chatbot tonu)
- Tur 8 audit: FeaturesTabbed platform tab'ları (Trendyol|Amazon TR|Etsy), footer KVKK, fiyat CTA, kredi/maliyet badgeleri
- /giris temizlik: "Hesabın yok mu?" satırı kaldırıldı

## 2026-04-19 — Hero video responsive fix + Admin paneli güvenlik + Giriş temizlik

- AuthHero: minHeight max(520px,60vh) + objectPosition center 40% — mobil/desktop kırpılma giderildi
- Admin paneli: service key + is_admin DB kontrolü, NEXT_PUBLIC_ADMIN_EMAIL kaldırıldı, /admin middleware koruması eklendi
- /giris: gereksiz "Hesabın yok mu?" satırı kaldırıldı

## 2026-04-19 — Blog arama ve kategori filtresi (UX-13)

- BlogListesi.tsx client component: metin arama (başlık+özet) + kategori pill filtresi
- Sonuç yoksa temizle butonu gösterilir

## 2026-04-19 — Hesap merkezi birleştirme: /profil → /hesap/profil

- /hesap/profil sayfası oluşturuldu (profil içeriği taşındı, şifre/güvenlik bölümü kaldırıldı)
- /profil → /hesap/profil 301 redirect
- Tüm /profil linkleri güncellendi; middleware ve robots.ts temizlendi
- ayarlar ve faturalar sayfaları için title tag eklendi

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

## 2026-04-21 — KÜME 10 Faz 1: Sentry, pino logging, health endpoint, Playwright E2E, GitHub Actions CI, inline feedback, maliyet dashboard
