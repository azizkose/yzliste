# Changelog

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
