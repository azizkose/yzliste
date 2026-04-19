# yzliste Marka Sesi Kılavuzu

> Bu doküman UI metinlerini, e-posta şablonlarını ve chatbot yanıtlarını yazan herkes (AI dahil) için referanstır.

---

## Karakter

**yzliste** — Türk e-ticaret satıcısının yanındaki pratik yardımcı. Uzman ama yukarıdan bakmaz. Hızlı, doğrudan, güvenilir.

---

## Ton

| Özellik | ✅ Doğru | ❌ Yanlış |
|---------|---------|---------|
| Kişi | "sen" dili | "siz" / "müşterimiz" |
| Hız | Kısa cümleler | Uzun, bürokratik cümleler |
| Ses | Arkadaşça + uzman | Aşırı samimi / emoji dolu |
| İddia | Somut, ölçülebilir | Süslü, abartılı |
| Hata mesajı | Çözüm odaklı | Suçlayıcı |

---

## Yasaklı Kelimeler (UI'da ASLA kullanma)

- ~~devrimsel~~ / ~~muhteşem~~ / ~~inanılmaz~~
- ~~en iyi~~ / ~~dünyaca ünlü~~ / ~~%100 garantili~~
- ~~yapay zeka~~ (→ "AI" veya "yzliste" kullan)
- ~~kullanıcı dostu~~ (kanıtla, söyleme)
- ~~kolay~~ başına tek başına (→ "3 adımda" gibi somutlaştır)
- ~~lütfen~~ (gereksiz kibarlık, akışı yavaşlatır)
- ~~merhaba!~~ (chatbot dışında)

---

## Her UI Durumu İçin Örnek Metin

### Boş Durum (empty state)
```
❌ "Henüz içerik üretilmedi."
✅ "Henüz üretim yapmadın. İlk içeriğini üret →"
```

### Yükleniyor
```
❌ "Lütfen bekleyiniz..."
✅ "Üretiliyor..." / "Hazırlanıyor..."
```

### Başarı
```
❌ "İşlem başarıyla tamamlandı!"
✅ "Kaydedildi." / "Kopyalandı."
```

### Hata (kullanıcı hatası)
```
❌ "Geçersiz giriş."
✅ "E-posta adresi hatalı görünüyor. Kontrol eder misin?"
```

### Hata (sistem hatası)
```
❌ "Bir hata oluştu."
✅ "Şu an ulaşamıyoruz. Birkaç saniye sonra tekrar dene."
```

### Kredi bitti
```
❌ "Krediniz tükendi."
✅ "Kredilin bitti. Devam etmek için kredi ekleyebilirsin."
```

### Profil eksik uyarısı
```
❌ "Profil bilgileriniz eksik."
✅ "Marka profilini doldurunca AI metinleri ve görseller çok daha kaliteli sonuç verir."
```

### CTA butonları
```
❌ "Satın Al"
✅ "Satın Al — 39₺"  (fiyatı dahil et)

❌ "Başla"
✅ "Ücretsiz Başla — 3 Kredi Hediye"
```

### Onboarding / İlk kullanım
```
✅ "Platform seç → Ürünü anlat → İçeriğini al"
✅ "3 adımda hazır"
✅ "Fotoğraf yükle, pazaryerine hazır içeriğini al"
```

---

## Değer Önerisi (her platformda tutarlı kullan)

**Ana mesaj:** "Trendyol'un 65 karakter başlık limitini, Amazon'un yasaklı kelimelerini, Etsy'nin SEO kurallarını biz biliriz."

**Alt mesaj:** "Sen sadece ürününü anlat — listing, görsel, video ve sosyal medya içeriğin dakikalar içinde hazır."

**Abonelik yok mesajı:** "Aylık ödeme yok. Kullandığın kadar öde."

---

## Rakip Farklılaştırma

| Rakip | yzliste farkı |
|-------|---------------|
| ChatGPT | Platform kurallarını (karakter limit, yasaklı kelime, kategori formatı) bilir |
| Canva | Sadece görsel değil, metin + görsel + video + sosyal medya tek yerden |
| Fiverr | Saniyeler içinde, insan bekleme yok |
| Genel AI araçları | Trendyol/Amazon/Etsy özelinde eğitimli prompt'lar |

---

## Sayı Formatları

- Para: `39₺` (boşluk yok, ₺ sonda)
- Kredi: `10 kredi` (rakam + boşluk + kredi)
- Süre: `5sn` / `10sn` (kısa), `5 saniye` (uzun bağlamda)
- Tarih: Türkçe uzun format — `15 Nisan 2026`

---

## Chatbot Ses Tonu

Chatbot için özel kurallar:
- İlk mesaj: "Merhaba! yzliste hakkında sorularını cevaplayabilirim."
- Bilmediği soru: "Bu konuda kesin bilgi veremem. destek@yzliste.com'a yazarsan hızlıca dönelim."
- Fiyat sorusu: "Başlangıç 39₺/10 kredi, Popüler 99₺/30 kredi, Büyük 249₺/100 kredi. Krediler süresi dolmaz."
- 3+ mesaj sonra: 👍/👎 emoji ile geri bildirim iste

---

*Son güncelleme: 2026-04-19*
