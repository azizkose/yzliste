# Google OAuth Preview URL Configuration

> **Bu adımları Aziz manuel yapacak.** Kod tarafı `window.location.origin`
> kullandığı için otomatik olarak doğru URL'e yönlenir — config tarafı
> eksikse preview'da canlıya yönlendirme hatası görülür.

## Sorun

Preview deployment URL'inde "Google ile devam et" tıklanınca kullanıcı
`yzliste.com` (production) yerine `*.vercel.app` preview URL'ine geri
dönmesi gerekiyor. Supabase'e izin verilen redirect URL'leri tanımlanmazsa
yönlendirme production'a gider.

## Çözüm: Supabase Dashboard

**Authentication → URL Configuration** bölümüne git:

### Site URL
```
https://www.yzliste.com
```

### Redirect URLs (her satır ayrı bir URL)
```
https://www.yzliste.com/**
https://*.vercel.app/**
http://localhost:3000/**
http://localhost:3001/**
```

> `**` wildcard — Supabase bu formatı destekler.

Kaydet butonuna tıkla.

---

## Kod tarafı (bilgi için)

`components/auth/AuthForm.tsx` içindeki `signInWithOAuth` çağrısı:

```ts
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}${redirectTo}`,
  },
})
```

`window.location.origin` kullanıldığı için:
- Preview'da: `https://yzliste-git-redesign-....vercel.app`
- Production'da: `https://www.yzliste.com`

Kod değişikliği **gerekmez**. Sadece Supabase URL Configuration'a
`https://*.vercel.app/**` eklenmesi yeterli.

---

## Google Cloud Console (ek değişiklik gerekmez)

Authorized redirect URIs listesinde zaten Supabase callback URL'i var:

```
https://<supabase-project-id>.supabase.co/auth/v1/callback
```

Bu URL Supabase'in kendi OAuth callback'idir — preview/production farkı
yaratmaz. Ek URI eklemek **gerekmez**.

---

## Test Adımları

1. `claude/redesign-modern-ui` branch'ini Vercel'de deploy et (preview URL)
2. Preview URL'de `/giris` aç
3. "Google ile devam et" tıkla
4. Google hesabını seç
5. Geri dönülen URL **preview URL** olmalı (`*.vercel.app`), `yzliste.com` **değil**
6. Giriş başarılı → `/uret` sayfasına yönlendirme
