import { Metadata } from 'next'
import Link from 'next/link'
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: 'Gizlilik Politikası ve KVKK Aydınlatma',
  description: 'yzliste gizlilik politikası, kişisel veri işleme ve KVKK kapsamındaki haklarınız.',
  alternates: { canonical: 'https://www.yzliste.com/gizlilik' },
}

export default function GizlilikPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/"><img src="/yzliste_logo.png" alt="yzliste" className="h-8" /></Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">Gizlilik Politikası</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-sm text-gray-700 leading-relaxed">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Gizlilik Politikası</h1>
          <p className="text-gray-400 text-xs">Son güncelleme: Nisan 2026</p>
        </div>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">1. Veri Sorumlusu</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında veri sorumlusu:
            <strong> SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</strong> (&quot;yzliste&quot;) — destek@yzliste.com.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">2. İşlenen Kişisel Veri Kategorileri</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Kimlik:</strong> Ad soyad, TC kimlik numarası (fatura için)</li>
            <li><strong>İletişim:</strong> E-posta adresi</li>
            <li><strong>İşlem:</strong> Üretilen içerikler, kredi geçmişi, oturum logları</li>
            <li><strong>Ödeme:</strong> Fatura bilgileri (kart bilgisi iyzico altyapısında saklanır)</li>
            <li><strong>Kullanım:</strong> Sayfa görüntülemeleri, tıklamalar (yalnızca analitik onayı verilirse)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">3. İşleme Amacı ve Hukuki Sebep</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-2 text-left">Amaç</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Hukuki Sebep (KVKK Md. 5)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Hesap oluşturma ve kimlik doğrulama', 'Sözleşmenin ifası'],
                  ['Hizmet sunumu (içerik üretimi)', 'Sözleşmenin ifası'],
                  ['Ödeme ve e-Arşiv fatura', 'Hukuki yükümlülük'],
                  ['Müşteri desteği', 'Meşru menfaat'],
                  ['Kullanım analizi (PostHog)', 'Açık rıza'],
                  ['Güvenlik ve dolandırıcılık önleme', 'Meşru menfaat / Hukuki yükümlülük'],
                ].map(([a, h]) => (
                  <tr key={a}>
                    <td className="border border-gray-200 px-3 py-2">{a}</td>
                    <td className="border border-gray-200 px-3 py-2">{h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">4. Kişisel Verilerin Aktarımı</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase (Almanya — AB):</strong> Kimlik ve hesap verileri</li>
            <li><strong>iyzico:</strong> Ödeme verileri (PCI-DSS uyumlu)</li>
            <li><strong>Anthropic / FAL AI (ABD):</strong> Üretim girdileri — SCC kapsamında</li>
            <li><strong>PostHog EU Cloud (AB):</strong> Kullanım analizi — yalnızca onay verilmişse</li>
            <li><strong>Yasal yükümlülük:</strong> Yetkili kamu kurumları</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">5. Saklama Süreleri</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Hesap verileri: Silme talebinden 30 gün sonra kalıcı silinir</li>
            <li>Fatura ve ödeme kayıtları: 10 yıl (Türk Ticaret Kanunu)</li>
            <li>Analitik veriler: 1 yıl</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">6. KVKK Madde 11 — Haklarınız</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse bilgi talep etme ve düzeltme isteme</li>
            <li>Koşullar ortadan kalktığında silinmesini isteme</li>
            <li>Yurt içi / dışı aktarım bilgisi alma</li>
            <li>Otomatik karar sonuçlarına itiraz etme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">7. Başvuru Yolu</h2>
          <p>
            KVKK taleplerinizi <a href="mailto:destek@yzliste.com" className="text-indigo-500 hover:underline">destek@yzliste.com</a> adresine
            &quot;KVKK Başvurusu&quot; konu başlığıyla iletebilirsiniz. 30 gün içinde yanıtlanır.
          </p>
        </section>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 text-xs">
          <Link href="/cerez-politikasi" className="text-indigo-500 hover:underline">Çerez Politikası</Link>
          <Link href="/kvkk-aydinlatma" className="text-indigo-500 hover:underline">KVKK Aydınlatma Metni</Link>
          <Link href="/kosullar" className="text-indigo-500 hover:underline">Kullanım Koşulları</Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
