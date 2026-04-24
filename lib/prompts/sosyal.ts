// Sosyal medya caption üretimi için prompt sabitleri ve builder'ları

export const SOSYAL_PROMPT_VERSION = "sosyal-v1.1";

export const PLATFORM_KURALLAR: Record<string, {
  adi: string;
  uzunluk: string;
  hashtagSayisi: string;
  hashtagStrateji: string;
  format: string;
  ekKurallar: string;
}> = {
  instagram_tiktok: {
    adi: "Instagram ve TikTok",
    uzunluk: "Instagram için 150-220 kelime. İlk 125 karakter özellikle önemli — 'daha fazla' katlanmadan önce görünen kısım bu.",
    hashtagSayisi: "7-10 hashtag",
    hashtagStrateji: "Karışım: 2-3 yüksek hacimli (#moda, #alisveris), 3-4 orta niş (#turkishfashion, #trendyolda), 2-3 çok spesifik (#yazlikelbise2025). Her birini yeni satıra değil, bitişik yaz.",
    format: "Hook cümlesi (soru veya güçlü iddia) → Ürün faydaları → Duygusal bağ → CTA",
    ekKurallar: "İlk cümle dikkat çekici olmalı. TikTok'ta kısa enerjik cümleler tercih edilir — uzun paragraflardan kaçın.",
  },
  instagram: {
    adi: "Instagram",
    uzunluk: "150-220 kelime. İlk 125 karakter çok önemli — 'daha fazla' katlanmadan önce görünen kısım bu.",
    hashtagSayisi: "7-10 hashtag",
    hashtagStrateji: "Karışım: 2-3 yüksek hacimli (#moda, #alisveris), 3-4 orta niş (#turkishfashion, #trendyolda), 2-3 çok spesifik (#yazlikelbise2025). Bitişik yaz, her biri yeni satıra değil.",
    format: "Hook cümlesi (soru veya güçlü iddia) → Ürün faydaları → Duygusal bağ → CTA",
    ekKurallar: "İlk cümle dikkat çekici olmalı. Görseli tamamlar metin yaz, görsel ile aynı şeyi tekrarlama.",
  },
  tiktok: {
    adi: "TikTok",
    uzunluk: "80-120 kelime. Kısa, enerjik ve hızlı okunabilir olmalı.",
    hashtagSayisi: "5-7 hashtag",
    hashtagStrateji: "TikTok'ta trend ve niş tagları karıştır: 2-3 trend (#fyp, #kesfet, #viral), 3-4 ürün/kategori (#moda, #alışveriş). Kısa taglar tercih edilir.",
    format: "Dikkat çekici ilk cümle → Ürün özelliği/faydası → Kıtlık/merak ögesi → CTA",
    ekKurallar: "Kısa cümleler ve paragraflar. Konuşma dili. Trend bir soru veya challenge ile bitirebilirsin.",
  },
  facebook: {
    adi: "Facebook",
    uzunluk: "200-300 kelime. Facebook uzun form içeriği destekler.",
    hashtagSayisi: "3-5 hashtag",
    hashtagStrateji: "Facebook'ta hashtag algoritma etkisi düşük — sadece en ilgili 3-5 etiketi ekle. Kalite > miktar.",
    format: "Hikaye/bağlam → Ürün özellikleri → Sosyal kanıt önerisi → CTA",
    ekKurallar: "Okuyucuyla konuşur gibi yaz. Yorum veya paylaşım teşvik eden bir soru ile bitir.",
  },
  twitter: {
    adi: "Twitter/X",
    uzunluk: "MAKSIMUM 280 karakter (boşluklar ve emojiler dahil). Aşma.",
    hashtagSayisi: "2-3 hashtag",
    hashtagStrateji: "Sadece en güçlü 2-3 hashtagı seç. Twitter'da hashtag içine gömülü kullanılabilir.",
    format: "Güçlü açılış → Ürün değeri → CTA — hepsi 280 karakterde",
    ekKurallar: "Özlü ve punch-line formatı. Her kelime değer taşımalı.",
  },
  linkedin: {
    adi: "LinkedIn",
    uzunluk: "150-300 karakter ideal. Profesyonel ton.",
    hashtagSayisi: "3-5 hashtag",
    hashtagStrateji: "Sektörel ve profesyonel hashtagler.",
    format: "Değer önerisi → Özellikler → B2B CTA",
    ekKurallar: "Profesyonel dil, iş değeri öne çıkar.",
  },
};

export const SEZON_CONTEXT: Record<string, string> = {
  normal:          "",
  anneler_gunu:    "Anneler Günü temalı içerik üret. Sevgi, minnettarlık, anne-çocuk bağı duygularını öne çıkar. Hediye önerisi ve 'annene özel' gibi ifadeler kullan.",
  babalar_gunu:    "Babalar Günü temalı içerik üret. Takdir, güç, aile bağı duygularını öne çıkar. 'Babana özel', 'ona en güzeli' gibi ifadeler kullan.",
  bayram:          "Bayram (Ramazan veya Kurban) temalı içerik üret. Kutlama, paylaşım, birliktelik duygularını öne çıkar. 'Bayrama özel', 'sevdiklerinle paylaş' gibi ifadeler kullan.",
  yilbasi:         "Yılbaşı / Noel temalı içerik üret. Kutlama, yeni başlangıçlar, hediye verme neşesini öne çıkar. 'Yıla özel', 'yeni yıl hediyesi' gibi ifadeler kullan.",
  black_friday:    "Black Friday / Büyük İndirim temalı içerik üret. Fırsatı kaçırma, sınırlı stok, büyük tasarruf duygusunu öne çıkar. 'Kaçırma', 'sadece bugün', 'stoklar tükeniyor' gibi aciliyet ifadeleri kullan.",
  sevgililer_gunu: "Sevgililer Günü temalı içerik üret. Aşk, romantizm, özel hissettirme duygularını öne çıkar. 'Sevgiliye özel', 'en güzel hediye', 'ona söyle' gibi ifadeler kullan.",
};

export interface CaptionPromptParams {
  platform: string;
  urunAdi: string;
  ekBilgi: string;
  ton: string;
  sezon: string;
  markaBaglami: string;
}

export function captionSistemPrompt(params: CaptionPromptParams): { sistem: string; kullanici: string } {
  const { platform, urunAdi, ekBilgi, ton, sezon, markaBaglami } = params;
  const kural = PLATFORM_KURALLAR[platform] ?? PLATFORM_KURALLAR.instagram_tiktok;

  const tonAciklama =
    ton === "tanitim" ? "ürünü tanıtan, özelliklerini ve avantajlarını net şekilde öne çıkaran"
    : ton === "indirim" ? "kampanya ve indirimi vurgulayan, kıtlık/aciliyet hissi yaratan ('Son 2 gün!', 'Sınırlı stok' gibi)"
    : "duygusal bağ kuran, ürünün hayata kattığı değeri hikaye ile anlatan";

  const sezonContext = SEZON_CONTEXT[sezon] || "";

  const sistem = `Sen bir Türk e-ticaret sosyal medya uzmanısın. ${kural.adi} için satış odaklı, özgün paylaşım metni ve hashtag üretiyorsun.

HALLUCINATION KURALLARI — KESİNLİKLE UYACAKSIN:
- Sadece kullanıcının verdiği bilgileri kullan
- Ürün hakkında tahmin veya varsayım YAPMA
- Boyut, renk, malzeme, fiyat gibi belirtilmeyen detayları UYDURMA
- Belirtilmeyen özellikler için genel ifadeler kullan ("kaliteli malzeme", "özenle üretilmiş" gibi)
${markaBaglami ? `\nMarka bilgileri:\n${markaBaglami}` : ""}`;

  const kullanici = `Şu ürün için ${kural.adi} paylaşım metni ve hashtag üret:

Ürün: ${urunAdi}
${ekBilgi ? `Ek bilgi: ${ekBilgi}` : ""}
${sezonContext ? `SEZON/ETKİNLİK BAĞLAMI: ${sezonContext}` : ""}

PLATFORM KURALLARI — ${kural.adi.toUpperCase()}:
- Uzunluk: ${kural.uzunluk}
- Hashtag: ${kural.hashtagSayisi} — ${kural.hashtagStrateji}
- Format: ${kural.format}
- Ek: ${kural.ekKurallar}

İÇERİK KURALLARI:
- Ton: ${tonAciklama}
- Emoji: doğal yerlerde kullan, abartma (max 4-5 emoji)
- Türkçe, sade, çekici ve doğal bir dil
- Harekete geçirici son cümle (satın al, linke tıkla, DM at, profili ziyaret et vb.)
${markaBaglami ? "- Marka bilgilerini metne doğal şekilde yansıt, zorlamadan" : ""}

ÇIKTI FORMATI — TAM OLARAK BU YAPIDA VER:
CAPTION:
[paylaşım metni buraya — sadece metin, hashtag yok]

HASHTAG:
[hashtagler buraya, her biri # ile başlasın, boşlukla ayrılsın]`;

  return { sistem, kullanici };
}

export function captionCiktiParse(metin: string): { caption: string; hashtag: string } {
  const captionMatch = metin.match(/CAPTION:\s*([\s\S]+?)(?=HASHTAG:|$)/i);
  const hashtagMatch = metin.match(/HASHTAG:\s*([\s\S]+?)$/i);
  return {
    caption: captionMatch ? captionMatch[1].trim() : metin,
    hashtag: hashtagMatch ? hashtagMatch[1].trim() : "",
  };
}
