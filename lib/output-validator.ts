/**
 * Çıktı doğrulama yardımcısı — tüm üretim route'larından çağrılır.
 * Başlık karakter limiti aşımını ve yasaklı kelime kullanımını kontrol eder.
 */
import { PLATFORM_KURALLARI, YASAKLI_KELIMELER, type Platform } from "@/lib/prompts/metin";

export interface CiktiDogrulaParams {
  icerik: string;
  platform: Platform;
}

/**
 * Üretilen içeriği platform kurallarına göre doğrular.
 * @returns uyarilar — boş dizi = sorun yok
 */
export function ciktiDogrula({ icerik, platform }: CiktiDogrulaParams): string[] {
  const uyarilar: string[] = [];

  const baslikMatch = icerik.match(/(?:📌\s*)?(?:BAŞLIK|BASLIK|TITLE)[:\n]+([^\n]+)/i);
  if (baslikMatch) {
    const baslik = baslikMatch[1].trim();
    const limit = PLATFORM_KURALLARI[platform]?.baslikLimit;
    if (limit && baslik.length > limit) {
      uyarilar.push(`Başlık ${baslik.length} karakter — limit ${limit} karakter aşıldı`);
    }
  }

  const yasaklar = YASAKLI_KELIMELER[platform] ?? [];
  const bulunan = yasaklar.filter((k) => icerik.toLowerCase().includes(k.toLowerCase()));
  if (bulunan.length > 0) {
    uyarilar.push(`Yasaklı ifade tespit edildi: ${bulunan.slice(0, 3).join(", ")}`);
  }

  return uyarilar;
}
