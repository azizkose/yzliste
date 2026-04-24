import Link from "next/link";

const SORULAR = [
  {
    s: "Kredi nedir, nasıl çalışır?",
    c: "Her içerik üretimi 1 kredi tüketir. Listing metni 1 kredi, görsel üretimi 1 kredi (1 stil = 1 görsel), video 10–20 kredi, sosyal medya içeriği 1 kredidir. Kayıt olunca 3 ücretsiz kredi hediye edilir.",
  },
  {
    s: "Abonelik var mı?",
    c: "Hayır. yzliste tamamen kullandığın kadar öde modeli ile çalışır. Aylık abonelik yoktur. 49₺'den başlayan kredi paketleri mevcuttur.",
  },
  {
    s: "Hangi pazaryerlerini destekliyorsunuz?",
    c: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA. Her platform için ayrı format ve dil desteği (Türkçe/İngilizce) mevcuttur.",
  },
  {
    s: "Fotoğrafım yoksa ne yapabilirim?",
    c: "Ürün adı ve birkaç özellik yazarak metin üretebilirsiniz. Ancak fotoğraf yüklerseniz AI ürünü otomatik analiz eder ve daha doğru içerik üretir.",
  },
  {
    s: "Verilerim güvende mi?",
    c: "Evet. Tüm veriler Supabase altyapısında şifrelenmiş olarak saklanır. Ürün bilgileri ve üretilen içerikler sadece size aittir; üçüncü taraflarla paylaşılmaz.",
  },
  {
    s: "Krediler ne zaman sona erer?",
    c: "Satın aldığınız kredilerin son kullanma tarihi yoktur. Hesabınızda kaldığı sürece geçerlidir.",
  },
];

export default function LandingFAQ() {
  return (
    <section className="px-4 sm:px-6 py-16 bg-white border-t border-[#D8D6CE]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-medium text-[#1A1A17] text-center mb-10">Sık sorulan sorular</h2>
        <div className="space-y-2">
          {SORULAR.map((item) => (
            <details key={item.s} className="group border border-[#D8D6CE] rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-sm text-[#1A1A17] hover:bg-[#F1F0EB] transition-colors">
                {item.s}
                <span className="ml-4 flex-shrink-0 text-[#908E86] group-open:rotate-180 transition-transform duration-200">▾</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-[#5A5852] leading-relaxed">{item.c}</p>
            </details>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/sss" className="text-sm text-[#1E4DD8] hover:text-[#163B9E] font-medium">
            Tüm sorular →
          </Link>
        </div>
      </div>
    </section>
  );
}
