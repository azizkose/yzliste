"use client";
export default function TeslimatIadePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-sm text-gray-400 hover:text-orange-500">← Ana Sayfa</a>
        </div>
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Teslimat ve İade Şartları</h1>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Teslimat</h2>
              <p>
                YZListe, dijital bir hizmet platformudur. Satın alınan kullanım hakları
                ödeme işlemi tamamlandıktan hemen sonra kullanıcı hesabına otomatik olarak
                tanımlanır. Fiziksel bir teslimat söz konusu değildir.
              </p>
              <p className="mt-2">
                Teknik bir sorun nedeniyle kredileriniz hesabınıza yansımadıysa lütfen
                destek@yzliste.com adresine ödeme dekontunuzla birlikte başvurunuz.
                En geç 1 iş günü içinde sorununuz çözülecektir.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">İade Politikası</h2>
              <p>
                Dijital hizmet niteliğinde olan kullanım hakları, teslim edildiği andan
                itibaren kullanılabilir durumdadır. Bu nedenle, 6502 sayılı Tüketicinin
                Korunması Hakkında Kanun'un 49. maddesi uyarınca dijital içerik ve hizmetlerde
                cayma hakkı kullanılamaz.
              </p>
              <p className="mt-2">
                Ancak hiç kullanılmamış krediler için iade talebi, satın alma tarihinden
                itibaren 3 (üç) gün içinde destek@yzliste.com adresine iletilmesi halinde
                değerlendirmeye alınacaktır.
              </p>
              <p className="mt-2">
                İade kararı verilmesi durumunda, ödeme ödeme yönteminize bağlı olarak
                3-10 iş günü içinde hesabınıza iade edilir.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">İletişim</h2>
              <p>
                Teslimat veya iade ile ilgili her türlü sorunuz için:{" "}
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
