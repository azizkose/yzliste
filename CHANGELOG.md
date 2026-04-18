# Changelog

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
