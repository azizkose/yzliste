import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, ExternalLink } from 'lucide-react'
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: 'Hakkımızda — yzliste',
  description: 'yzliste, e-ticaret satıcılarının Trendyol, Hepsiburada, Amazon ve daha fazlası için AI destekli listing ve görsel üretmesini sağlayan bir platform. İstanbul, 2026.',
  openGraph: {
    title: 'Hakkımızda | yzliste',
    description: 'yzliste nasıl ortaya çıktı, kim tarafından yapıldı.',
  },
  alternates: {
    canonical: 'https://www.yzliste.com/hakkimizda',
    languages: { 'tr': 'https://www.yzliste.com/hakkimizda', 'x-default': 'https://www.yzliste.com/hakkimizda' },
  },
  robots: { index: true, follow: true },
}

export default function HakkimizdaPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#FAFAF8] py-12 px-4">
        <div className="max-w-2xl mx-auto">

          <Link href="/" className="text-sm text-[#908E86] hover:text-[#1E4DD8] transition-colors">
            ← Ana sayfa
          </Link>

          <h1 className="text-2xl font-medium text-[#1A1A17] mt-8 mb-10" style={{ letterSpacing: '-0.01em' }}>
            Hakkımızda
          </h1>

          {/* Neden yzliste */}
          <section className="mb-10">
            <h2 className="text-base font-medium text-[#1A1A17] mb-3">Neden yzliste?</h2>
            <p className="text-sm text-[#5A5852] leading-relaxed">
              E-ticaret satıcıları her platform için ayrı içerik hazırlamak zorunda. Her platformun
              karakter limiti, format ve SEO mantığı farklı; genel amaçlı AI araçları bunu bilmiyor.
              yzliste bu içerikleri tek çatı altında toplar: ürün bilgisini bir kez gir, 7 platforma
              özel metin, görsel, video ve sosyal içerik çıkar — dakikalar içinde.
            </p>
          </section>

          {/* Platform listesi */}
          <section className="mb-10 bg-[#F1F0EB] border border-[#D8D6CE] rounded-xl p-5">
            <p className="text-xs font-medium text-[#908E86] mb-3 uppercase tracking-wide">Desteklenen platformlar</p>
            <div className="flex flex-wrap gap-2">
              {['Trendyol', 'Hepsiburada', 'Amazon TR', 'Amazon USA', 'N11', 'Etsy'].map((p) => (
                <span key={p} className="text-xs text-[#5A5852] bg-white border border-[#D8D6CE] rounded px-3 py-1.5">
                  {p}
                </span>
              ))}
            </div>
          </section>

          {/* Kurucu */}
          <section className="mb-10">
            <h2 className="text-base font-medium text-[#1A1A17] mb-3">Kurucu</h2>
            <div className="text-sm text-[#5A5852] leading-relaxed space-y-3">
              <p>
                <span className="font-medium text-[#1A1A17]">Aziz Köse</span> — fintech ve inovasyon
                alanında 18 yıllık deneyime sahip bir girişimci. Kurumsal inovasyon ve girişim yatırımı
                üzerine çalıştı, 600&apos;den fazla startup değerlendirdi; AI tabanlı bir derin öğrenme
                şirketi kurup çıkış yaptı. E-ticaret satıcılarının içerik sorununu yakından görünce
                yzliste&apos;yi kişisel bir proje olarak başlattı.
              </p>
              <a
                href="https://linkedin.com/in/azizkose"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#1E4DD8] hover:text-[#163B9E] transition-colors"
              >
                <ExternalLink size={12} strokeWidth={1.5} />
                linkedin.com/in/azizkose
              </a>
            </div>
          </section>

          {/* İletişim */}
          <section className="mb-10">
            <h2 className="text-base font-medium text-[#1A1A17] mb-3">İletişim</h2>
            <a
              href="mailto:destek@yzliste.com"
              className="inline-flex items-center gap-2 text-sm text-[#1E4DD8] hover:text-[#163B9E] transition-colors"
            >
              <Mail size={14} strokeWidth={1.5} />
              destek@yzliste.com
            </a>
          </section>

          {/* Şirket bilgileri */}
          <section className="border-t border-[#D8D6CE] pt-8">
            <h2 className="text-sm font-medium text-[#908E86] mb-4">Şirket bilgileri</h2>
            <dl className="space-y-2 text-sm">
              {[
                { label: 'Ünvan', value: 'SIMOON PAZARLAMA VE DANISMANLIK LIMITED SİRKETİ' },
                { label: 'Adres', value: 'Mehmet Akif Mah. Ulubatlı Hasan Cad. Paradise City Sitesi C1 Blok No: 43L İç Kapı No: 31 Çekmeköy / İstanbul' },
                { label: 'Kuruluş', value: '2026 · İstanbul' },
                { label: 'Vergi dairesi', value: 'Sarıgazi' },
                { label: 'Vergi no', value: '7701113995' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <dt className="text-[#908E86] w-28 flex-shrink-0">{label}</dt>
                  <dd className="text-[#5A5852]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

        </div>
        <SiteFooter />
      </main>
    </>
  );
}
