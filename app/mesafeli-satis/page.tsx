"use client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function MesafeliSatisPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-xs text-gray-400 mb-6">Son güncelleme: Nisan 2026</p>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">1. Taraflar</h2>
              <div className="space-y-1">
                <p><span className="font-medium text-gray-700">Satıcı Ünvanı:</span> SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</p>
                <p><span className="font-medium text-gray-700">Adres:</span> Mehmet Akif Mah. Ulubatlı Hasan Cad. Paradise City Sitesi C1 Blok No: 43L İç Kapı No: 31 Çekmeköy / İstanbul</p>
                <p><span className="font-medium text-gray-700">Vergi Dairesi / No:</span> Sarıgazi / 7701113995</p>
                <p><span className="font-medium text-gray-700">E-posta:</span>{" "}
                  <a href="mailto:destek@yzliste.com" className="text-orange-500 hover:underline">destek@yzliste.com</a>
                </p>
                <p className="mt-2"><span className="font-medium text-gray-700">Alıcı:</span> Platforma kayıtlı kullanıcı</p>
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">2. Sözleşmenin Konusu</h2>
              <p>
                İşbu sözleşme, Alıcının yzliste.com platformunda satın aldığı dijital kullanım
                haklarına (kredi paketleri) ilişkin koşulları düzenlemektedir.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">3. Hizmet ve Fiyat Bilgileri</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>Başlangıç Paketi: 10 kredi — 39 TL (KDV dahil)</li>
                <li>Popüler Paket: 30 kredi — 99 TL (KDV dahil)</li>
                <li>Büyük Paket: 100 kredi — 249 TL (KDV dahil)</li>
              </ul>
              <p className="mt-2">
                Kullanım hakları ödeme tamamlandıktan hemen sonra hesaba tanımlanır.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">4. Ödeme</h2>
              <p>
                Ödemeler iyzico ödeme altyapısı üzerinden güvenli şekilde gerçekleştirilir.
                Kredi kartı, banka kartı ve taksit seçenekleri mevcuttur.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">5. Teslimat</h2>
              <p>
                Satın alınan kullanım hakları, ödemenin onaylanmasının ardından anında
                kullanıcı hesabına tanımlanır. Dijital hizmet niteliğinde olduğundan
                fiziksel teslimat söz konusu değildir.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">6. Cayma Hakkı</h2>
              <p>
                6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 49. maddesi ve Mesafeli
                Sözleşmeler Yönetmeliği uyarınca; dijital içerik ve hizmetler, tüketicinin
                onayıyla ifaya başlandığı andan itibaren cayma hakkı kapsamı dışında tutulabilir.
              </p>
              <p className="mt-2">
                Kullanıcı, satın alma işlemini tamamlayarak dijital hizmetin hemen kullanılabilir
                hale getirilmesine onay vermiş sayılır ve bu durumda cayma hakkından feragat
                etmiş kabul edilir.
              </p>
              <p className="mt-2">
                Hiç kullanılmamış krediler için 3 gün içinde destek@yzliste.com adresine
                başvurulabilir.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">7. Uyuşmazlık Çözümü</h2>
              <p>
                İşbu sözleşmeden doğacak uyuşmazlıklarda İstanbul mahkemeleri ve tüketici
                hakem heyetleri yetkilidir.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">8. Yürürlük</h2>
              <p>
                Alıcı, satın alma işlemini tamamlayarak işbu sözleşmeyi okuduğunu,
                anladığını ve kabul ettiğini beyan eder.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
