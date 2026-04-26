# DA-03: /giris Sayfası UX Revizyonu

**Durum:** Açık
**Öncelik:** P1
**Tahmini süre:** 2 saat

---

## Mevcut sorunlar (ekran görüntüsünden)

1. **Emoji:** "Kayıt Ol" butonunda 🎁 hediye emojisi var — design system'e aykırı, silinmeli
2. **Mod seçici belirsiz:** "Kayıt Ol" ve "Giriş Yap" iki buton yan yana duruyor ama hangisinin aktif olduğu görsel olarak belirsiz — toggle/tab yapısına çevrilmeli
3. **Çift "Giriş Yap" butonu:** Hem üstte mod seçici hem altta submit butonu olarak "Giriş Yap" yazıyor — kullanıcı karıştırır
4. **Buton renk tutarsızlığı:** Submit butonu mor/indigo, mod seçici koyu — design system renkleriyle uyumlu değil
5. **Google butonu hiyerarşisi:** Google ile giriş ve form arasındaki görsel öncelik zayıf

## Best practice referansları

Modern SaaS giriş sayfası standartları:
- **Tab/toggle yapısı:** Kayıt ve giriş modları arasında net bir tab switcher (underline veya pill style)
- **Tek submit butonu:** Aktif moda göre dinamik ("Giriş Yap" veya "Kayıt Ol")
- **Social login üstte:** Google butonu öne çıkmalı (çoğu kullanıcı bunu tercih eder)
- **Divider:** "veya e-posta ile" ayırıcısı — mevcut, bu iyi
- **Minimal form:** Sadece gerekli alanlar, temiz spacing
- **Design system uyumu:** Primary renk (#1E4DD8), font-medium, no emoji, no shadow

## Yapılacaklar

- [ ] Kayıt Ol / Giriş Yap mod seçiciyi tab/toggle yapısına çevir (aktif tab: primary altçizgi veya pill)
- [ ] Submit butonunu dinamik yap: aktif moda göre metin değişsin
- [ ] 🎁 emojisini sil
- [ ] Submit buton rengini `bg-[#1E4DD8] hover:bg-[#163B9E]` yap
- [ ] `font-semibold`/`font-bold` varsa `font-medium` yap
- [ ] Mor/indigo Tailwind sınıflarını temizle
- [ ] Mobil (375px) test

## Kabul kontrol

```bash
grep -rE "emoji|🎁" src/app/giris/
grep -rE "indigo|violet|purple" src/app/giris/
grep -rE "font-semibold|font-bold" src/app/giris/
```
