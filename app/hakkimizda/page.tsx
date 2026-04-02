"use client";
export default function HakkimizdaPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-sm text-gray-400 hover:text-orange-500">← Ana Sayfa</a>
        </div>
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Hakkımızda</h1>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              yzliste, Türk e-ticaret satıcılarının ürün listelerini daha hızlı ve etkili
              oluşturmasına yardımcı olmak amacıyla geliştirilmiş yapay zeka destekli bir
              SaaS platformudur.
            </p>
            <p>
              Trendyol, Hepsiburada, Amazon TR ve N11 gibi Türkiye'nin önde gelen e-ticaret
              platformlarına özel, Türk alıcı davranışına göre optimize edilmiş ürün başlıkları,
              açıklamaları, özellik maddeleri ve arama etiketleri saniyeler içinde üretilmektedir.
            </p>
            <p>
              Platformumuz; manuel metin girişi, ürün fotoğrafı yükleme ve barkod tarama gibi
              farklı giriş yöntemleriyle çalışmakta olup yapay zeka destekli görsel üretim
              özelliği de sunmaktadır.
            </p>
            <p>
              yzliste olarak amacımız, satıcıların teknik içerik oluşturma süreçlerini
              otomatikleştirerek daha fazla zamana ve enerjiye sahip olmalarını sağlamaktır.
            </p>

            <div className="border-t border-gray-100 pt-6 mt-6 space-y-2">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Şirket Bilgileri</h2>
              <p><span className="font-medium text-gray-700">Ünvan:</span> SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</p>
              <p><span className="font-medium text-gray-700">Adres:</span> Mehmet Akif Mah. Ulubatlı Hasan Cad. Paradise City Sitesi C1 Blok No: 43L İç Kapı No: 31 Çekmeköy / İstanbul</p>
              <p><span className="font-medium text-gray-700">Vergi Dairesi:</span> Sarıgazi</p>
              <p><span className="font-medium text-gray-700">Vergi No:</span> 7701113995</p>
              <p><span className="font-medium text-gray-700">E-posta:</span>{" "}
                <a href="mailto:destek@yzliste.com" className="text-orange-500 hover:underline">destek@yzliste.com</a>
              </p>
              <p><span className="font-medium text-gray-700">Web:</span> yzliste.com</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
