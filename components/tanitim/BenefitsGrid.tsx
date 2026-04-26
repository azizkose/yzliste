"use client";
import { useEffect, useRef, useState, startTransition } from "react";
import Link from "next/link";
import { Lightbulb, Zap, Target, Wallet } from "lucide-react";

const OZELLIKLER = [
  { Ikon: Lightbulb, baslik: "Genel amaçlı AI değil, pazaryeri uzmanı AI", aciklama: "Genel amaçlı AI araçları her pazaryerinin karakter limiti, yasaklı kelime listesi ve kategori yapısını bilmez. yzliste; Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA'nın güncel kurallarına göre üretir." },
  { Ikon: Zap, baslik: "Dakikalar içinde hazır", aciklama: "Fotoğraf yükle veya ürün bilgisi gir — listing metni 30 saniyede, stüdyo görseli 1 dakikada, tanıtım videosu 2 dakikada hazır." },
  { Ikon: Target, baslik: "Senin markanı, senin dilini konuşur", aciklama: "Mağaza adını, hedef kitlenin yaşını, metin tonunu bir kere gir — her üretimde otomatik uygulanır." },
  { Ikon: Wallet, baslik: "Abonelik yok, teknik bilgi gerekmiyor", aciklama: "Aylık ödeme yok, API entegrasyonu yok, prompt mühendisliği yok. Formu doldur, butona bas — içeriğin hazır." },
];

export default function BenefitsGrid() {
  const [visible, setVisible] = useState(OZELLIKLER.map(() => false));
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      startTransition(() => setVisible(OZELLIKLER.map(() => true)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          OZELLIKLER.forEach((_, i) => {
            setTimeout(() => {
              startTransition(() => setVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              }));
            }, i * 200);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="px-4 sm:px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-medium text-center text-[#1A1A17] mb-3" style={{ letterSpacing: "-0.01em" }}>Neden yzliste?</h2>
          <p className="text-center text-sm text-[#908E86] mb-10">Genel amaçlı AI araçlarından farkımız</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OZELLIKLER.map((o, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-[#D8D6CE]"
                style={{
                  opacity: visible[i] ? 1 : 0,
                  transform: visible[i] ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <o.Ikon size={18} strokeWidth={1.5} className="text-[#1E4DD8] flex-shrink-0" />
                  <h3 className="font-medium text-[#1A1A17] text-sm leading-snug">{o.baslik}</h3>
                </div>
                <p className="text-xs text-[#908E86] leading-relaxed">{o.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 bg-[#F1F0EB] border-y border-[#D8D6CE] text-center">
        <h2 className="text-xl font-medium text-[#1A1A17] mb-2">Hemen dene</h2>
        <p className="text-sm text-[#5A5852] mb-6">3 ücretsiz kredi ile listing metni, görsel veya video üret. Kredi kartı gerekmez.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/kayit" className="inline-block bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium px-8 py-4 rounded-xl text-base transition-colors">
            Ücretsiz hesap oluştur →
          </Link>
          <Link href="/uret" className="inline-block border border-[#1E4DD8] text-[#1E4DD8] font-medium px-8 py-4 rounded-xl text-base transition-colors hover:bg-[#F0F4FB]">
            Hemen dene →
          </Link>
        </div>
      </section>
    </>
  );
}
