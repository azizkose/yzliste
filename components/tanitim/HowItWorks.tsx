import { Icon3D } from "@/components/ui/Icon3D";

const ADIMLAR = [
  { no: "1", ikonAdi: "cube" as const, ikonRenk: "#F0F4FB", baslik: "Ürünü anlat", aciklama: "Fotoğraf yükle, barkod tara veya elle yaz. YZ ürünü otomatik analiz eder." },
  { no: "2", ikonAdi: "bag" as const, ikonRenk: "#FBEAF0", baslik: "Platform seç", aciklama: "Trendyol, Amazon, Etsy... Her platformun kuralları otomatik uygulanır." },
  { no: "3", ikonAdi: "magic-trick" as const, ikonRenk: "#E1F5EE", baslik: "İçeriğini al", aciklama: "Metin, görsel, video, sosyal medya — hepsi tek seferde, kopyala yapıştır hazır." },
];

export default function HowItWorks() {
  return (
    <section id="nasil-calisir" className="px-4 sm:px-6 py-16 bg-[#F1F0EB]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-medium text-center text-[#1A1A17] mb-2" style={{ letterSpacing: "-0.01em" }}>3 adımda hazır</h2>
        <p className="text-center text-sm text-[#908E86] mb-10">Metin, görsel, video, sosyal medya — hepsi aynı ürün bilgisinden</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ADIMLAR.map((adim) => (
            <div key={adim.no} className="bg-white rounded-xl p-5 border border-[#D8D6CE] flex gap-4">
              <Icon3D name={adim.ikonAdi} size={56} bgColor={adim.ikonRenk} className="flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[#F0F4FB] text-[#1E4DD8]">{adim.no}</span>
                  <h3 className="font-medium text-[#1A1A17] text-sm">{adim.baslik}</h3>
                </div>
                <p className="text-xs text-[#908E86] leading-relaxed">{adim.aciklama}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
