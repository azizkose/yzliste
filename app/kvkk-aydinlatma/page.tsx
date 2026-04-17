import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni — yzliste',
  description: '6698 sayılı KVKK kapsamında yzliste kişisel veri aydınlatma metni.',
}

export default function KVKKAydinlatmaPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/"><img src="/yzliste_logo.png" alt="yzliste" className="h-8" /></Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">KVKK Aydınlatma Metni</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-sm text-gray-700 leading-relaxed">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">KVKK Aydınlatma Metni</h1>
          <p className="text-gray-400 text-xs">6698 Sayılı Kişisel Verilerin Korunması Kanunu Md. 10 Kapsamında · Nisan 2026</p>
        </div>

        <p>
          <strong>SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</strong> (&quot;Şirket&quot;) olarak, kişisel verilerinizi
          aşağıda açıklanan amaçlar doğrultusunda, KVKK&apos;nın 10. maddesi gereğince sizleri aydınlatmak amacıyla
          bu metni hazırladık.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">A. Veri Sorumlusu</h2>
          <p>SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI · destek@yzliste.com</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">B. Toplanan Kişisel Veriler</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>E-posta adresi (kayıt ve iletişim)</li>
            <li>Ad soyad, TC/VKN, adres (fatura zorunluluğu)</li>
            <li>Kullanım verileri — içerik girdileri, üretim geçmişi</li>
            <li>IP adresi ve teknik log verileri (güvenlik)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">C. Kişisel Verilerin İşlenme Amacı</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kullanıcı hesabı oluşturma ve kimlik doğrulama</li>
            <li>AI içerik üretim hizmetinin sunulması</li>
            <li>Ödeme işlemlerinin gerçekleştirilmesi ve yasal fatura düzenlenmesi</li>
            <li>Müşteri destek hizmetleri</li>
            <li>Hizmet güvenliğinin sağlanması ve kötüye kullanımın önlenmesi</li>
            <li>Onay verilmesi halinde: anonim kullanım analizi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">D. Hukuki İşleme Sebepleri (Md. 5)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Sözleşmenin ifası:</strong> Hesap ve hizmet verileri</li>
            <li><strong>Hukuki yükümlülük:</strong> Fatura ve ödeme kayıtları</li>
            <li><strong>Meşru menfaat:</strong> Güvenlik, destek</li>
            <li><strong>Açık rıza:</strong> Analitik çerezler</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">E. Kişisel Verilerin Aktarıldığı Taraflar</h2>
          <p>Verileriniz; hizmet altyapısını sağlayan Supabase (AB), ödeme hizmeti iyzico, AI altyapıları Anthropic ve FAL AI ile yasal zorunluluk halinde yetkili kamu kurumlarıyla paylaşılmaktadır. Yurt dışı aktarımlarda KVKK Md. 9 kapsamında standart sözleşme maddeleri uygulanmaktadır.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">F. KVKK Md. 11 Kapsamındaki Haklarınız</h2>
          <p className="mb-2">Veri sahibi olarak şu haklara sahipsiniz:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse bilgi talep etme</li>
            <li>Amacı ve amaca uygunluğunu öğrenme</li>
            <li>Yurt içi/dışında kimlere aktarıldığını öğrenme</li>
            <li>Eksik/hatalı verilerin düzeltilmesini isteme</li>
            <li>Silme veya yok edilmesini isteme (yasal saklama yükümlülükleri saklı)</li>
            <li>Silme/düzeltme işleminin aktarılan üçüncü taraflara bildirilmesini isteme</li>
            <li>Otomatik sistemler aracılığıyla analiz sonuçlarına itiraz etme</li>
            <li>Zararın tazmin edilmesini talep etme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">G. Başvuru Yöntemi</h2>
          <p>
            Başvurularınızı <a href="mailto:destek@yzliste.com" className="text-indigo-500 hover:underline">destek@yzliste.com</a> adresine
            &quot;KVKK Başvurusu&quot; konu başlığıyla yazılı olarak iletebilirsiniz.
            Başvurular en geç <strong>30 gün</strong> içinde yanıtlanır; talep gereği ücretsizdir,
            işlemin ayrıca bir maliyet gerektirmesi halinde Kurul tarifesi uygulanır.
          </p>
        </section>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 text-xs">
          <Link href="/gizlilik" className="text-indigo-500 hover:underline">Gizlilik Politikası</Link>
          <Link href="/cerez-politikasi" className="text-indigo-500 hover:underline">Çerez Politikası</Link>
        </div>
      </div>
    </main>
  )
}
