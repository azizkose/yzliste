export function bugununBaglami(): string {
  const bugun = new Date();
  const yil = bugun.getFullYear();
  const ay = bugun.toLocaleDateString("tr-TR", { month: "long" });
  const mevsim = (() => {
    const m = bugun.getMonth() + 1;
    if (m >= 3 && m <= 5) return "ilkbahar";
    if (m >= 6 && m <= 8) return "yaz";
    if (m >= 9 && m <= 11) return "sonbahar";
    return "kış";
  })();
  return `Bugünün tarihi: ${bugun.toLocaleDateString("tr-TR")} (${ay} ${yil}, ${mevsim} mevsimi). Hashtag, sezon, yıl referansı kullanırken bu tarihi temel al — geçmiş yıl referansı verme.`;
}
