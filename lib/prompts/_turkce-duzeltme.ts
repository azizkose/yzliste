const DUZELTME_SOZLUGU: Record<string, string> = {
  "hoşça deyin": "hoşçakalın",
  "hoşça deyiniz": "hoşçakalınız",
  "stilish": "şık",
  "stylish": "şık",
  " trendy ": " trend ",
  " cool ": " havalı ",
  "must-have": "olmazsa olmaz",
  "best-seller": "çok satan",
  "bestseller": "çok satan",
  " design ": " tasarım ",
  "modeneri": "modeli",
};

const KAYNAKSIZ_IDDIA_SOZLUGU: string[] = [
  "klinik kanıtlı",
  "klinik onaylı",
  "bilimsel kanıtlı",
  "doktor önerisi",
  "%100 garanti",
  "100% garanti",
  "kesin sonuç",
  "garantili sonuç",
];

export function turkceyiDuzelt(metin: string): { duzeltilmis: string; bulgular: string[] } {
  let sonuc = metin;
  const bulgular: string[] = [];

  for (const [yanlis, dogru] of Object.entries(DUZELTME_SOZLUGU)) {
    const regex = new RegExp(yanlis.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    if (regex.test(sonuc)) {
      bulgular.push(`"${yanlis}" → "${dogru}"`);
      sonuc = sonuc.replace(regex, dogru);
    }
  }

  for (const iddia of KAYNAKSIZ_IDDIA_SOZLUGU) {
    if (sonuc.toLowerCase().includes(iddia.toLowerCase())) {
      bulgular.push(`KAYNAKSIZ İDDİA: "${iddia}"`);
    }
  }

  return { duzeltilmis: sonuc, bulgular };
}

export function hashtaglariValideEt(hashtagMetni: string): {
  gecerli: string[];
  reddedildi: string[];
} {
  const tags = hashtagMetni
    .split(/\s+/)
    .filter((t) => t.startsWith("#"))
    .map((t) => t.replace(/[^\w#çğıöşüÇĞİÖŞÜ]/g, ""));

  const gecerli: string[] = [];
  const reddedildi: string[] = [];

  for (const tag of tags) {
    const govde = tag.slice(1);
    if (govde.length < 3) { reddedildi.push(`${tag} (kısa)`); continue; }
    if (govde.length > 30) { reddedildi.push(`${tag} (uzun)`); continue; }
    if (/^\d+$/.test(govde)) { reddedildi.push(`${tag} (rakam)`); continue; }
    if (/(.)\1{4,}/.test(govde)) { reddedildi.push(`${tag} (spam)`); continue; }
    gecerli.push(tag);
  }

  return { gecerli, reddedildi };
}
