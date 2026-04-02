"use client";
export default function GizlilikPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-sm text-gray-400 hover:text-orange-500">← Ana Sayfa</a>
        </div>
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gizlilik Politikası</h1>
          <p className="text-xs text-gray-400 mb-6">Son güncelleme: Nisan 2026</p>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">1. Toplanan Veriler</h2>
              <p>YZListe olarak aşağıdaki verileri toplarız:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Hesap bilgileri: e-posta adresi, şifre (şifreli olarak saklanır)</li>
                <li>Fatura bilgileri: ad soyad, adres, TC kimlik veya vergi numarası</li>
                <li>Kullanım verileri: üretilen içerikler, kullanım geçmişi</li>
                <li>Ödeme bilgileri: ödeme iyzico altyapısı üzerinden işlenir, kart bilgileri tarafımızca saklanmaz</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">2. Verilerin Kullanımı</h2>
              <p>Toplanan veriler yalnızca şu amaçlarla kullanılır:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Hizmetin sunulması ve geliştirilmesi</li>
                <li>Fatura ve ödeme işlemlerinin yürütülmesi</li>
                <li>Kullanıcı destek taleplerinin karşılanması</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">3. Veri Güvenliği</h2>
              <p>
                Tüm veriler SSL/TLS şifreleme ile korunmaktadır. Veritabanı güvenliği
                Supabase altyapısı üzerinde sağlanmaktadır. Kart bilgileri tarafımızca
                hiçbir şekilde saklanmamakta olup ödeme işlemleri iyzico'nun PCI-DSS
                uyumlu altyapısı üzerinden gerçekleştirilmektedir.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">4. Üçüncü Taraflarla Paylaşım</h2>
              <p>
                Kişisel verileriniz; yasal zorunluluk, ödeme işlemi ve fatura düzenleme
                dışında hiçbir üçüncü tarafla paylaşılmamaktadır.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">5. Çerezler</h2>
              <p>
                Platformumuz oturum yönetimi için zorunlu çerezler kullanmaktadır.
                Reklam veya izleme amaçlı çerez kullanılmamaktadır.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">6. Haklarınız</h2>
              <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Verilerinizin düzeltilmesini talep etme</li>
                <li>Verilerinizin silinmesini talep etme</li>
                <li>Verilerinizin aktarıldığı kişileri öğrenme</li>
              </ul>
              <p className="mt-2">
                Bu haklarınızı kullanmak için:{" "}
                <a href="mailto:destek@yzliste.com" className="text-orange-500 hover:underline">
                  destek@yzliste.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">7. İletişim</h2>
              <p>
                Gizlilik politikamız hakkında sorularınız için:{" "}
                <a href="mailto:destek@yzliste.com" className="text-orange-500 hover:underline">
                  destek@yzliste.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
