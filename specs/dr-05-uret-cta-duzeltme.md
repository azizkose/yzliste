# DR-05: /uret "Giriş yap ve başla" CTA Düzeltmesi

**Durum:** Açık
**Öncelik:** P1
**Tahmini süre:** 1-2 saat
**Kural:** Önce planı göster, onay al, sonra uygula.

---

## Sorun

Kayıtsız kullanıcı /uret'e geldiğinde form doluyor ama "Üret" yerine "Giriş yap ve başla" butonu görüyor. İki sorun:

1. **Metin belirsiz:** Yeni kullanıcı "hesabım yok" düşünüyor — kayıt yolu belli değil
2. **Form state kaybı riski:** Kullanıcı formu doldurup giriş sayfasına yönlenince girdiği veri korunuyor mu?

## Yapılacaklar

### CTA metin değişikliği

- [ ] Ana buton metni: "Ücretsiz başla — 3 kredi hediye" (hesabı olmayan kullanıcı için)
- [ ] Alt satırda link: "Zaten hesabım var → Giriş yap" (`text-xs text-[#1E4DD8]`)
- [ ] Giriş yapmış kullanıcıda mevcut "Üret" butonu korunsun — değişiklik sadece logged-out state için

### Form state koruma

- [ ] Kullanıcı formu doldurup kayıt/giriş akışına girdiğinde form verisini sessionStorage'a kaydet
- [ ] Kayıt/giriş sonrası /uret'e dönüşte sessionStorage'dan formu geri yükle
- [ ] Başarılı geri yükleme sonrası sessionStorage temizle

## Doğrulama

- [ ] Logged-out durumda /uret'e git → buton metni "Ücretsiz başla — 3 kredi hediye" mi?
- [ ] Formu doldur → butona bas → kayıt/giriş yap → /uret'e dön → form verisi korunmuş mu?
- [ ] Logged-in durumda buton hâlâ "Üret" mi?
