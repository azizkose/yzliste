export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs text-gray-400">
          <a href="/fiyatlar" className="hover:text-indigo-500">Fiyatlar</a>
          <span>·</span>
          <a href="/blog" className="hover:text-indigo-500">Blog</a>
          <span>·</span>
          <a href="/hakkimizda" className="hover:text-indigo-500">Hakkımızda</a>
          <span>·</span>
          <a href="/kosullar" className="hover:text-indigo-500">Kullanım Koşulları</a>
          <span>·</span>
          <a href="/gizlilik" className="hover:text-indigo-500">Gizlilik Politikası</a>
          <span>·</span>
          <a href="/mesafeli-satis" className="hover:text-indigo-500">Mesafeli Satış</a>
          <span>·</span>
          <a href="/teslimat-iade" className="hover:text-indigo-500">Teslimat ve İade</a>
          <span>·</span>
          <a href="mailto:destek@yzliste.com" className="hover:text-indigo-500">destek@yzliste.com</a>
        </div>
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/iyzico_footer_logo.png" alt="iyzico ile öde" className="w-44 h-auto" />
        </div>
        <p className="text-center text-xs text-gray-400">© 2026 yzliste · SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</p>
      </div>
    </footer>
  );
}
