"use client";
import { useEffect, useRef, useState } from "react";
import { Package, Store, Sparkles } from "lucide-react";

const ADIMLAR = [
  { no: "1", Ikon: Package, baslik: "Ürünü anlat", aciklama: "Fotoğraf yükle, barkod tara veya elle yaz. YZ ürünü otomatik analiz eder." },
  { no: "2", Ikon: Store, baslik: "Platform seç", aciklama: "Trendyol, Amazon, Etsy... Her platformun kuralları otomatik uygulanır." },
  { no: "3", Ikon: Sparkles, baslik: "İçeriğini al", aciklama: "Metin, görsel, video, sosyal medya — hepsi tek seferde, kopyala yapıştır hazır." },
];

export default function HowItWorks() {
  const [visible, setVisible] = useState(ADIMLAR.map(() => false));
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisible(ADIMLAR.map(() => true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          ADIMLAR.forEach((_, i) => {
            setTimeout(() => {
              setVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 300);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="nasil-calisir" ref={sectionRef} className="px-4 sm:px-6 py-16 bg-[#F1F0EB]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-medium text-center text-[#1A1A17] mb-2" style={{ letterSpacing: "-0.01em" }}>3 adımda hazır</h2>
        <p className="text-center text-sm text-[#908E86] mb-10">Metin, görsel, video, sosyal medya — hepsi aynı ürün bilgisinden</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ADIMLAR.map((adim, i) => (
            <div
              key={adim.no}
              className="bg-white rounded-xl p-5 border border-[#D8D6CE] flex gap-4"
              style={{
                opacity: visible[i] ? 1 : 0,
                transform: visible[i] ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              <div className="w-14 h-14 bg-[#F1F0EB] rounded-xl flex items-center justify-center flex-shrink-0">
                <adim.Ikon size={24} strokeWidth={1.5} className="text-[#5A5852]" />
              </div>
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
