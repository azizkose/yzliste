# /uret Sayfası — Denetim Raporu

**Tarih:** Nisan 2026
**Denetlenen URL:** `yzliste-git-claude-redesign-modern-ui-...vercel.app/uret`
**Yöntem:** HTML/yapı analizi (Vercel auth nedeniyle screenshot alınamadı, ama HTML detaylı)

---

## Özet bulgu

`/uret` sayfası **işlevsel olarak güçlü** — 4 içerik türü, çoklu input metodları, detaylı stil/format/süre seçenekleri var. Ama **bilişsel yük yüksek.** Kullanıcı sayfaya giriyor, 4 sekme + her sekmede 5-10 alan + 3-4 alt-tab görüyor. Bu kullanıcının kaybolmasına yol açan bir tasarım.

Anasayfa redesign'ı bittiğinde sayfa "30 saniyede ilk içeriğin hazır" diye söz veriyor. `/uret` sayfası şu an **30 saniyelik bir deneyim sağlamıyor** — kullanıcı en az 5 karar vermek zorunda.

---

## Ana sorunlar (öncelik sırasına göre)

### Sorun 1: 4 içerik türü sekmesi — "her şey aynı sayfada" tasarımı

**Mevcut durum:**
```
[Metin] [Görsel] [Sosyal medya] [Video]   ← 4 sekme tab
   ↓
Her sekme için ayrı bir form blok'u (gizli div'lerle)
Hepsi sayfada render ediliyor, sadece display:none ile saklı
```

**Problem:**
- Kullanıcı sayfaya gelince **hangi sekmedeyim ve ne için buraya geldim** hatırlaması gerek
- 4 sekme = 4 ayrı zihinsel model = paralel karar
- Anasayfada tıklayan kullanıcı zaten "metin için geldim" niyetiyle gelmiş, ama sayfa onu sıfırdan başlatıyor
- Mobile'da sekmeler dar, ikon+metin daralıyor

**Etkisi:**
- Kullanıcı yorgun başlar, "burada başlamak çok seçim" hissiyle kayar
- "Tümü için aynı anda üret" yapamıyor — ama belki istiyor

---

### Sorun 2: Form yoğunluğu — bilişsel yük

**Metin sekmesinde örnek:**
```
1. Üst form: Platform seçimi (select) + karakter limit eyebrow
2. Fotoğraf yükleme alanı
3. Alt tab'lar: Manuel / Fotoğraf / Barkod / Excel
4. Ürün adı
5. Kategori (11 seçenek select)
6. Ürün detayları (textarea)
7. "Daha fazla seçenek" expand
8. Generate butonu
```

**Problem:**
- 8 ayrı karar noktası, hepsi tek ekranda
- "Manuel/Fotoğraf/Barkod/Excel" 2. seviye tab — kullanıcı **üstteki fotoğraf yükleme alanı**ile karıştırabilir (üstte de fotoğraf yükleme var)
- "Daha fazla seçenek" gizlenmiş ama önemli olabilecek alanlar (marka tonu, hedef kitle vs?) — kullanıcı bunu fark etmeyebilir
- Boş bir form — 30 saniyede tamamlanması zor

**Etkisi:**
- "Doldurması yorucu" hissi
- Kullanıcı yarım bırakır, geri döner
- Anasayfanın "30 saniyede" sözü çelişiyor

---

### Sorun 3: "Üstte ürün fotoğrafı yükle" + "Alt tab'da Fotoğraf" — kafa karıştırıcı

**Mevcut durum:**
- Sayfanın üstünde **dashed border'lı fotoğraf yükleme alanı** ("Tüm içerik türlerinde kullanılır")
- Aşağıda Metin sekmesinin alt tab'larında ayrı bir **Fotoğraf** seçeneği var

**Problem:**
- İkisinin ilişkisi belirsiz — biri "ana fotoğraf", diğeri "fotoğrafı kaynak olarak kullan" demek istiyor sanırım
- Kullanıcı "fotoğraf yükledim, ne yapacağımı seçeyim mi?" diye bocalar
- Aslında iyi bir akış var ama görsel ayrımı zayıf

**Etkisi:**
- Yeni kullanıcı çift fotoğraf yükleyebilir veya hangisinin işine yaradığını anlamayabilir

---

### Sorun 4: Kredi maliyeti şeffaflığı eksik

**Mevcut durum:**
- Metin sekmesi başlığında: "1 kredi" (sağ üst, küçük gri)
- Video sekmesinde: "5sn: 10 kr · 10sn: 20 kr"
- Görsel sekmesinde: "1 stil seçersen → 1 görsel, 1 kredi" (paragraf içinde gizlenmiş)
- Sosyal medya: "1 kredi"

**Problem:**
- Kullanıcı sayfada **toplam ne kadar kredi harcayacağını** bir bakışta göremiyor
- "Görsel" sekmesinde 9 stil seçince 9 kredi gidiyor ama bu dinamik gösterilmiyor — kullanıcı seçim yaptıkça görmesi lazım
- Mevcut kredi bakiyesi navbar'da görünmüyor (login öncesi olduğu için ama yine de "şu kadar krediyle ne yapabilirim" hissi yok)

**Etkisi:**
- Kullanıcı ürettikten sonra "ne kadar kredim kaldı?" sorusunu çözmeye çalışır
- Şeffaflık eksik = güven eksik

---

### Sorun 5: Anasayfa redesign'ı ile renk uyumsuzluğu

**Anasayfa redesign'da kullandığımız:**
- Primary mavi: `#1E40AF`
- Slate scale: `slate-50, slate-100, slate-200, slate-500, slate-600, slate-900`
- Accent: `#F97316` (turuncu, sadece "yeni özellik" için)

**`/uret` sayfasında kullanılan:**
- Primary mavi: `#1E4DD8` (farklı bir mavi)
- Bej tonları: `#F1F0EB, #D8D6CE, #FAFAF8, #908E86, #5A5852, #1A1A17` (tamamen farklı bir paleti)
- Vurgu: `#FEF4E7, #8B4513` (kahverengi, video sekmesinde)

**Problem:**
- Anasayfa redesign'ı bittiğinde, kullanıcı anasayfadan `/uret`'e geçince **tamamen farklı bir uygulamaya gitmiş** hissedecek
- Sıcak bej + mavi karışımı kötü değil ama **anasayfanın temiz mavi+slate paletine** yabancı

**Etkisi:**
- Marka tutarsızlığı, profesyonellik kaybı
- Kullanıcı kayıt olunca "vay başka bir uygulama" hissi yaşar

---

### Sorun 6: Login öncesi vs login sonrası deneyim ayrımı yok

**Mevcut durum:**
- Login değilken bile sayfa açılıyor, formu doldurabiliyorsun
- Generate butonu disabled, "giriş yap" linki form altında küçük yazıyor
- Bazı butonlarda "giriş gerekli" yazıyor

**Problem:**
- Kullanıcı 5 dakika formu dolduruyor, sonunda "ah giriş yapayım" diyor — büyük bir hayal kırıklığı
- Form ilerlemesi login sonrası kayboluyor mu? (HTML'den anlaşılmıyor ama büyük ihtimal evet)

**Etkisi:**
- Kullanıcı "doldurdum, niye veremiyorum" yorgunluğuyla kayar
- Conversion düşer

---

### Sorun 7: Mobile'da sekmeler dar

**Mevcut durum:**
- 4 sekme x ikon+metin = küçük ekranlarda darlık
- "Sosyal medya" sekme adı uzun, mobilde 2 satıra düşebilir veya kesilebilir

**Problem:**
- Tab navigation mobil'de zayıf
- Yatay scroll'a düşmüş gibi durmuyor ama sıkışık

**Etkisi:**
- Mobile kullanıcılar (e-ticaret satıcısı çoğu mobile çalışıyor) zorlanır

---

### Sorun 8: "Daha fazla seçenek" gizleyici

**Mevcut durum:**
- Hem Metin hem Sosyal medya sekmesinde "▸ Daha fazla seçenek" expand butonu var
- İçeriğinde ne var bilmiyoruz ama büyük ihtimal: marka tonu, hedef kitle, dil, vs.

**Problem:**
- Kritik özellikler (marka tonu = anasayfa redesign'ında en güçlü vurgumuz!) gizli olabilir
- Kullanıcı bunu fark etmezse "fonksiyonalite eksik" hissi yaşar
- Marka profili özelliği anasayfada tanıtıldı, burada görünmüyor

**Etkisi:**
- Anasayfa promise'i ile sayfa deneyimi çelişebilir

---

## Pozitif yönler (korunması gerekenler)

1. **9 stüdyo stili kart sistemi (Görsel sekmesi)** — görsel grid mantıklı, Trendyol/Premium/Lifestyle ayrımı net
2. **5 hareket preset'i (Video sekmesi)** — kullanıcıya yön veriyor, tamamen serbest bırakmıyor
3. **Karakter limit eyebrow ("100 karakter · 5 özellik · 10 etiket")** — platform kuralı şeffaf
4. **Inline disclaimer'lar** — "AI hata yapabilir, kontrol et" gibi notlar dürüst
5. **Sentry + posthog + GA entegrasyonu** — analytics zaten kurulu, redesign sonrası A/B test imkanı var
6. **Semantic ARIA** — `role="tablist"`, `aria-selected`, `aria-controls` doğru kullanılmış
7. **Excel toplu import** — Metin sekmesinde Excel tab'ı var, batch işlem destekleniyor (büyük satıcılar için kritik)

---

## Redesign önerisi: 3 olası yaklaşım

### Yaklaşım A: "Asistan modu" — yönlendirilmiş akış

Kullanıcı sayfaya giriyor, **tek bir soru** görüyor:
> "Bu ürün için ne üretmek istiyorsun?"

Cevap: 4 büyük kart (Metin / Görsel / Video / Sosyal). Tıklayınca o içerik türünün **kendi sayfasına** gidiyor. Çoklu seçim de mümkün ("Hepsini birden üret" CTA'sı var).

Sonra ürün bilgisi adımı, sonra üretim adımı.

**Artısı:** Bilişsel yük dağılır, her ekranda 1-2 karar.
**Eksisi:** "Hızlıca yapayım" diyenler için fazla adım.

### Yaklaşım B: "İki kolonlu form" — düz form ama daha temiz

Mevcut tab yapısını koru ama **sol ürün bilgisi (sabit) | sağ içerik tipi seçenekleri**. Üstte 4 içerik tipi pill butonu (sekme değil), seçilen tip sağda render olur. Sol kolon hep görünür.

**Artısı:** Mevcut yapıya yakın, daha az değişim.
**Eksisi:** Mobile'da 2 kolon zor.

### Yaklaşım C: "Wizard adım sayacı" — 3 adım

1. **Ürünü tanıt** (fotoğraf + ürün adı + kategori)
2. **Ne istiyorsun?** (4 içerik tipi multiselect + her biri için detay form)
3. **Üret** (özet + toplam kredi maliyeti + onay)

**Artısı:** Anasayfanın "3 adım" söylemiyle birebir uyumlu, hikaye akıyor.
**Eksisi:** Mevcut yapıdan büyük kopuş, ciddi refaktör.

---

## Hangisini seçmeli?

**Önerim: Yaklaşım C (Wizard 3 adım).**

Sebep:
1. Anasayfada "3 adımda hazır" diye söz veriyoruz — `/uret` sayfası bunu **fiziksel olarak göstermeli**
2. Bilişsel yük en az
3. Toplam kredi maliyeti son adımda net görünür (Sorun 4'ü çözer)
4. Login akışı 2. veya 3. adıma yerleştirilebilir, kullanıcı hiçbir veriyi kaybetmez (Sorun 6'yı çözer)
5. Multiselect (metin + görsel + video aynı anda) imkanı doğal şekilde gelir — yeni kullanım senaryosu açar

**Kapsam dışı (bu redesign'da yapma):**
- Backend değişikliği — formlar aynı API'lere postlamalı
- Yeni içerik türü ekleme
- Excel toplu import refaktörü — mevcut haliyle korunur, ayrı route'a alınabilir
- Kredi paket değişikliği

---

## Karar bekleyen noktalar (Aziz)

1. **Yaklaşım seçimi:** A, B, C — hangisi?
2. **Login akışı:** Wizard'ın hangi adımında login isteyelim? (öneriyorum: 2. adımdan 3. adıma geçişte)
3. **Excel toplu import:** Bunu wizard'dan ayrı tutalım mı, yoksa 2. adımda alternatif input olarak mı?
4. **"Daha fazla seçenek" expand'inde ne var?** Bilemiyorum, login arkasında. Marka tonu ve hedef kitle anasayfada vaat edilen özellikler — bunlar wizard'a görünür yerleştirilmeli.
5. **Mevcut palette dönüşümü:** Bej tonlarını anasayfa paletine (`slate`) çevirelim mi yoksa `/uret`'e özel bir varyasyon mu? Önerim: anasayfa paletine taşı (tutarlılık).

---

## Sıradaki adım

Eğer bu denetim raporu mantıklıysa ve Yaklaşım C (Wizard) seçilirse:

1. **Tam wizard spec'i + 3 adım için ayrı mockup'lar** hazırlanır (anasayfa redesign'ı paketi gibi)
2. Cowork'e ayrı bir paket olarak verilir
3. Anasayfa redesign'ı bittikten sonra (veya paralel olarak) `/uret` redesign'ı yapılır

Bunu hazırlamamı istersen söyle. Ama önce **denetim raporunu okuyup yaklaşımı seç.**

---

## Son not

Bu denetim **HTML yapısı üzerinden yapıldı**, görsel ekran görüntüsüne dayanmıyor. Vercel auth nedeniyle siteyi browser'da açamadım. HTML/Tailwind class'ları detaylı olduğu için yapısal sorunları çıkarabildim ama:

- Boşluk hizalama problemleri (visual polish)
- Hover/focus state'lerin gerçekte nasıl göründüğü
- Animasyon/geçişlerin pürüzsüzlüğü
- Real device'da mobile davranışı

bunları görmedim. Eğer siz bu denetimi onaylarsanız ve devam edersek, screenshot bazlı bir 2. tur denetim yapılabilir (browser'a giriş yetkisi verirseniz veya screenshot atarsanız).
