import { Check } from "lucide-react";
import { Icon3D } from "@/components/ui/Icon3D";

export default function BrandProfile() {
  return (
    <section className="px-4 sm:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#F0F4FB] rounded-xl border border-[#BAC9EB] p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#BAC9EB] text-[#1E4DD8] text-xs font-medium px-3 py-1 rounded-full mb-3">
                <Icon3D name="star" size={14} />
                Yeni özellik
              </span>
              <h2 className="text-2xl font-medium text-[#1A1A17] mb-3" style={{ letterSpacing: "-0.01em" }}>
                Marka bilgilerini gir,<br />
                <span className="text-[#1E4DD8]">sana özel içerikler al</span>
              </h2>
              <p className="text-[#5A5852] text-sm leading-relaxed mb-4">
                Profilinden mağaza adını, hedef kitlenini ve metin tonunu belirle. Bundan sonra her üretimde AI bu bilgileri kullanır — metinler artık senin marka dilinle konuşur.
              </p>
              <div className="space-y-3">
                {[
                  { ikonAdi: "bag" as const, ikonRenk: "#F0F4FB", metin: "Mağaza adın ve marka kimliğin metne yansır" },
                  { ikonAdi: "target" as const, ikonRenk: "#FBEAF0", metin: "Hedef kitlenin dilinde yazar — '25-40 yaş kadınlar' dedin mi, o kitleye hitap eder" },
                  { ikonAdi: "painting-kit" as const, ikonRenk: "#EEEDFE", metin: "Samimi, profesyonel veya premium — tonunu seç, her üretimde uygular" },
                  { ikonAdi: "bulb" as const, ikonRenk: "#FAEEDA", metin: "Hızlı kargo, yerli üretim gibi değerlerin her ürüne otomatik eklenir" },
                ].map((m, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-[#5A5852]">
                    <Icon3D name={m.ikonAdi} size={48} bgColor={m.ikonRenk} className="flex-shrink-0" />
                    <span className="pt-3">{m.metin}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-72 flex-shrink-0">
              <div className="bg-white rounded-xl border border-[#D8D6CE] p-5 space-y-4">
                <p className="text-xs font-medium text-[#908E86] uppercase tracking-wide">Marka Profili</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#908E86] mb-1">Mağaza adı</p>
                    <div className="bg-[#F0F4FB] border border-[#BAC9EB] rounded-lg px-3 py-2 text-sm text-[#1E4DD8] font-medium">Ayşe Tekstil</div>
                  </div>
                  <div>
                    <p className="text-xs text-[#908E86] mb-1">Metin tonu</p>
                    <div className="flex gap-2">
                      <div className="bg-[#1E4DD8] text-white text-xs font-medium px-3 py-1.5 rounded-lg">Samimi</div>
                      <div className="bg-[#F1F0EB] text-[#5A5852] text-xs px-3 py-1.5 rounded-lg">Profesyonel</div>
                      <div className="bg-[#F1F0EB] text-[#5A5852] text-xs px-3 py-1.5 rounded-lg">Premium</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#908E86] mb-1">Hedef kitle</p>
                    <div className="bg-[#FAFAF8] border border-[#D8D6CE] rounded-lg px-3 py-2 text-sm text-[#5A5852]">25-40 yaş kadınlar</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#D8D6CE]">
                  <p className="text-xs text-[#0F5132] font-medium flex items-center gap-1">
                    <Check size={12} strokeWidth={2} />
                    Her üretimde otomatik uygulanır
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
