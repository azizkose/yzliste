# Metin Tarama — Redesign Aziz Kuralı Kontrolü

Aziz kuralı: mevcut sitedeki metinler korunur, yeni metin yazılmaz.
Bu dosya, redesign branch'indeki metin değişikliklerini takip eder.

## Tarama durumu

| Sayfa | Metin korundu mu? | Değişiklik notu |
|---|---|---|
| /blog (liste) | Evet | Kategori chip etiketleri UI eklentisi (mevcut kategorilerden türetildi) |
| /blog/[slug] | Evet | "Tüm yazılar" geri linki + yazar fallback "yzliste ekibi" — minimal UI kopyası |
| /sss | Evet | `kategori` alanı eklendi (mevcut sorulara yeni metadata, metin değişmedi) |
| /hakkimizda | Evet | Tüm gövde metni korundu |
| /kvkk-aydinlatma | Evet | Tüm yasal metin korundu |
| /gizlilik | Evet | Tüm yasal metin korundu |
| /kosullar | Evet | Tüm yasal metin korundu |
| /cerez-politikasi | Evet | Tüm yasal metin korundu |
| /mesafeli-satis | Evet | Tüm yasal metin korundu |
| /teslimat-iade | Evet | Tüm yasal metin korundu |
| /not-found | Yeni sayfa | "Sayfa bulunamadı" + "Aradığın sayfa taşınmış veya hiç var olmamış olabilir." — minimal, güvenli |
| /error | Yeni metin | "Bir şeyler ters gitti" + destek@yzliste.com yönlendirmesi — minimal |
| /loading | Yeni sayfa | "Yükleniyor..." — tek kelime |

## Dikkat edilecek alanlar

- **KVKK metinleri**: Hukuki metin kelimesi kelimesine korunmalı. Herhangi bir styling değişikliği metni etkilememiş olmalı.
- **FiyatlarSSS**: Tüm 7 SSS sorusu ve cevabı korundu.
- **SSSListesi**: Tüm sorular korundu, sadece `kategori` metadata alanı eklendi.
- **Blog yazıları**: Mevcut tüm yazılar `content/blog/*.md` dosyalarında, kodda değil — dokunulmadı.

## Aziz onay notu

Preview URL'den her sayfanın metin içeriğini gözden geçir. Metin farkı bulursan bu tabloya ekle ve düzeltme talebi aç.
