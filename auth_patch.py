import sys

path = r"C:\Users\catha\OneDrive\Documents\yzliste\app\auth\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

original_len = len(content)

changes = [
    (
        "Trendyol \u00b7 Hepsiburada \u00b7 Amazon TR \u00b7 N11</span>",
        "Trendyol \u00b7 Hepsiburada \u00b7 Amazon TR \u00b7 N11 \u00b7 Etsy \u00b7 Amazon USA</span>"
    ),
    (
        '>🖼️</div>\n                <h3 className="font-bold text-gray-800">Sadece Görsel</h3>',
        '>📷</div>\n                <h3 className="font-bold text-gray-800">Sadece Görsel</h3>'
    ),
    (
        'Tek fotoğraftan 3 farklı stilde stüdyo görseli.</p>',
        'Tek fotoğraftan 3 farklı stüdyo görseli — her stilden 4 varyasyon. 1 stil → 4 görsel → 1 kredi. İnceleme ücretsiz, indirince kredi düşer.</p>'
    ),
    (
        '{ no: "4", ikon: "🖼️", baslik: "Görsel üret"',
        '{ no: "4", ikon: "📷", baslik: "Görsel üret"'
    ),
    (
        '{ ikon: "🖼️", baslik: "AI görsel + prompt"',
        '{ ikon: "📷", baslik: "AI görsel + prompt"'
    ),
    (
        'ikon: "🖼️", metin: "Görsel üretimi stil başına 1 kredi tüketir. Her stilden 4 varyasyon üretilir — beğenmezsen kredi düşmez, sadece indirince düşer."',
        'ikon: "📷", metin: "Görsel üretimi stil başına 1 kredi tüketir. Her stilden 4 varyasyon üretilir — inceleme ücretsiz, sadece indirince kredi düşer. 1 stil → 4 görsel → 1 kredi · 2 stil → 8 görsel → 2 kredi."'
    ),
    (
        '>Tek fotoğraftan 3 farklı stüdyo görseli</h2>',
        '>📷 Tek fotoğraftan 3 farklı stüdyo görseli</h2>'
    ),
    (
        'AI arka planı kaldırır, istediğin ortama yerleştirir — her stilden 4 varyasyon</p>',
        'AI arka planı kaldırır, istediğin ortama yerleştirir — her stilden 4 varyasyon üretir. İnceleme ücretsiz, indirince 1 kredi düşer.</p>'
    ),
    (
        '>İndirince 1 kredi düşer — inceleme ücretsiz</p>',
        '>İnceleme ücretsiz · İndirince 1 kredi · 1 stil = 4 görsel</p>'
    ),
    (
        '3 Ücretsiz Deneme Kredisi, Başla →',
        '3 Ücretsiz İçerik Üretim Kredisi, Başla →'
    ),
    (
        'aciklama: "Trendyol, Hepsiburada, Amazon TR veya N11."',
        'aciklama: "Trendyol, HB, Amazon TR, N11, Etsy veya Amazon USA."'
    ),
    (
        '"3 ücretsiz deneme kredisi"',
        '"3 ücretsiz içerik üretim kredisi"'
    ),
    (
        '3 ücretsiz içerik üretim kredisi ile başla, kredi kartı gerekmez',
        '3 ücretsiz içerik üretim kredisi ile başla, kredi kartı gerekmez'
    ),
    (
        'veya 3 ücretsiz deneme kredisi ile başla, kredi kartı gerekmez',
        'veya 3 ücretsiz içerik üretim kredisi ile başla, kredi kartı gerekmez'
    ),
]

applied = 0
for old, new in changes:
    if old in content:
        content = content.replace(old, new)
        applied += 1
    else:
        print(f"BULUNAMADI: {old[:70]}")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\nTamamlandi: {applied}/{len(changes)} degisiklik uygulandı")
print(f"Dosya boyutu: {original_len} → {len(content)} karakter")
