"use client";
import { useState } from "react";
import { PLATFORM_BILGI, PLATFORM_PLACEHOLDER, YUKLENIYOR_MESAJLARI, KATEGORI_LISTESI } from "@/lib/constants";
import { sonucuBolumle, docxIndir } from "@/lib/listing-utils";
import KopyalaButon from "@/components/ui/KopyalaButon";
import FotoThumbnail from "@/components/ui/FotoThumbnail";

type Kullanici = {
  id: string;
  email: string | null;
  kredi: number;
  toplam_kullanilan: number;
  is_admin: boolean;
  anonim?: boolean;
  ton?: string;
  marka_adi?: string;
};

interface MetinSekmesiProps {
  aktif: boolean;
  // Giriş tipi
  girisTipi: "manuel" | "foto" | "barkod";
  setGirisTipi: (v: "manuel" | "foto" | "barkod") => void;
  // Platform / dil
  platform: string;
  setPlatform: (v: string) => void;
  setDil: (v: "tr" | "en") => void;
  // Form alanları
  urunAdi: string;
  setUrunAdi: (v: string) => void;
  kategori: string;
  setKategori: (v: string) => void;
  ozellikler: string;
  setOzellikler: (v: string) => void;
  hedefKitle: string;
  setHedefKitle: (v: string) => void;
  fiyatSegmenti: "butce" | "orta" | "premium";
  setFiyatSegmenti: (v: "butce" | "orta" | "premium") => void;
  anahtarKelimeler: string;
  setAnahtarKelimeler: (v: string) => void;
  markaliUrun: boolean;
  setMarkaliUrun: (v: boolean) => void;
  // Fotoğraf
  fotolar: string[];
  fotoKaldir: (i: number) => void;
  // Kamera
  kameraAcik: boolean;
  kameraAc: () => void;
  kameraKapat: () => void;
  // Barkod
  barkodYukleniyor: boolean;
  barkodBilgi: { isim: string; marka: string; aciklama: string; kategori: string; renk: string; boyut: string } | null;
  setBarkodBilgi: (v: null) => void;
  // Üretim durumu
  yukleniyor: boolean;
  yukleniyorMesaj: number;
  sonuc: string;
  setSonuc: (v: string) => void;
  duzenleYukleniyor: boolean;
  setDuzenleYukleniyor: (v: boolean) => void;
  uretimId: string | null;
  yenidenUretHakki: number;
  setYenidenUretHakki: (fn: (prev: number) => number) => void;
  // Kullanıcı
  kullanici: Kullanici | null;
  paketModalAc: () => void;
  icerikUret: () => void;
}

export default function MetinSekmesi({
  aktif,
  girisTipi, setGirisTipi,
  platform, setPlatform, setDil,
  urunAdi, setUrunAdi,
  kategori, setKategori,
  ozellikler, setOzellikler,
  hedefKitle, setHedefKitle,
  fiyatSegmenti, setFiyatSegmenti,
  anahtarKelimeler, setAnahtarKelimeler,
  markaliUrun, setMarkaliUrun,
  fotolar, fotoKaldir,
  kameraAcik, kameraAc, kameraKapat,
  barkodYukleniyor, barkodBilgi, setBarkodBilgi,
  yukleniyor, yukleniyorMesaj,
  sonuc, setSonuc,
  duzenleYukleniyor, setDuzenleYukleniyor,
  uretimId, yenidenUretHakki, setYenidenUretHakki,
  kullanici, paketModalAc, icerikUret,
}: MetinSekmesiProps) {
  const platformBilgi = PLATFORM_BILGI[platform] || PLATFORM_BILGI.trendyol;
  const platformPh = PLATFORM_PLACEHOLDER[platform] || PLATFORM_PLACEHOLDER.trendyol;
  const platformDil = platformBilgi.dil || "tr";
  const [digerMod, setDigerMod] = useState(false);
  const uretButonAktif = !yukleniyor && (
    (girisTipi === "manuel" && urunAdi.trim().length > 0) ||
    (girisTipi === "foto" && fotolar.length > 0) ||
    (girisTipi === "barkod" && barkodBilgi !== null)
  );
  const sonucBolumleri = sonucuBolumle(sonuc);

  return (
    <div style={{ display: aktif ? "block" : "none" }} className="mt-4 bg-white rounded-2xl shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">📋 Listing İçeriği Üret</h2>
        <span className="text-xs text-blue-500 font-medium">1 içerik üretim kredisi</span>
      </div>

      {/* Giriş tipi */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Ürünü nasıl eklemek istersin?</p>
        <p className="text-xs text-gray-400 mb-2">İster yazarak, ister ürünün fotoğrafını çekerek, ister barkodunu taratarak, istersen Excel ile toplu yükleyerek içerik üretebilirsin.</p>
        <div className="grid grid-cols-4 gap-2">
          {(["manuel", "foto", "barkod"] as const).map((tip) => (
            <button key={tip} onClick={() => setGirisTipi(tip)}
              className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${girisTipi === tip ? "border-blue-400 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
              {tip === "manuel" ? "✏️ Manuel" : tip === "foto" ? "📷 Fotoğraf" : "🔍 Barkod"}
            </button>
          ))}
          <a href="/toplu"
            className="py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 text-center">
            📊 Excel
          </a>
        </div>
      </div>

      {/* Platform */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
        <select value={platform} onChange={(e) => { setPlatform(e.target.value); setDil(PLATFORM_BILGI[e.target.value]?.dil || "tr"); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <optgroup label="🇹🇷 Türk Pazaryerleri">
            <option value="trendyol">Trendyol</option>
            <option value="hepsiburada">Hepsiburada</option>
            <option value="amazon">Amazon TR</option>
            <option value="n11">N11</option>
          </optgroup>
          <optgroup label="🌍 Yabancı Pazaryerleri (İngilizce)">
            <option value="etsy">Etsy</option>
            <option value="amazon_usa">Amazon USA</option>
          </optgroup>
        </select>
        <div className={`mt-2 flex flex-wrap gap-2 text-xs px-3 py-2 rounded-lg border ${platformBilgi.renk}`}>
          <span>📌 Başlık max {platformBilgi.baslikLimit} karakter</span>
          <span>·</span>
          {platformBilgi.ozellikSayisi > 0 && <span>🔹 {platformBilgi.ozellikSayisi} özellik maddesi</span>}
          {platformBilgi.ozellikSayisi > 0 && platformBilgi.etiketSayisi > 0 && <span>·</span>}
          {platformBilgi.etiketSayisi > 0 && <span>🏷️ {platformBilgi.etiketSayisi} etiket</span>}
          <span>·</span>
          <span>{platformBilgi.aciklama}</span>
          <span>·</span>
          <span>{platformDil === "en" ? "🇬🇧 English output" : "🇹🇷 Türkçe çıktı"}</span>
        </div>
      </div>

      {/* F-23a: Örnek ürün kartları */}
      {girisTipi === "manuel" && !urunAdi && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Hızlı başla — bir örnek seç:</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
              { ikon: "🧴", label: "Kozmetik", urunAdi: "Hyaluronik Asit Nemlendirici Serum", kategori: "Cilt Bakımı / Kozmetik", ozellikler: "50ml, vegan formül, E vitamini ve aloe vera içerir, tüm cilt tipleri için, parfümsüz, doğrultanmış hyaluronik asit" },
              { ikon: "👕", label: "Giyim", urunAdi: "Slim Fit Erkek Gömlek", kategori: "Giyim / Erkek", ozellikler: "% 100 pamuk, S/M/L/XL/XXL beden, beyaz/mavi/lacivert renk seçeneği, ütü gerektirmez, makinede yıkanabilir" },
              { ikon: "🔌", label: "Elektronik", urunAdi: "65W GaN USB-C Hızlı Şarj Adaptörü", kategori: "Elektronik / Şarj Cihazı", ozellikler: "65W GaN teknoloji, 3 port (2×USB-C, 1×USB-A), tüm telefonlar/dizüstü uyumlu, akıllı güç yönetimi, UL sertifikalı" },
              { ikon: "🫒", label: "Gıda", urunAdi: "Soğuk Sıkım Zeytinyağı 500ml", kategori: "Gıda / Yağlar", ozellikler: "İlk soğuk sıkım, asidite %0.3, Ayvalık çeşidi, cam şişe, 2024 hasat, sertifikalı organik, 500ml" },
              { ikon: "💎", label: "Takı", urunAdi: "925 Ayar Gümüş Kelebek Kolye", kategori: "Takı / Gümüş", ozellikler: "925 ayar gümüş, el yapımı, zincir uzunluğu 45cm, kelebek uç 2.5cm, oksit kaplama, toz pembe zirkon taş" },
            ].map((ornek) => (
              <button key={ornek.label} onClick={() => { setUrunAdi(ornek.urunAdi); setKategori(ornek.kategori); setOzellikler(ornek.ozellikler); }}
                className="text-left p-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                <p className="text-base mb-0.5">{ornek.ikon}</p>
                <p className="text-xs font-semibold text-gray-700">{ornek.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manuel */}
      {girisTipi === "manuel" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı <span className="text-red-400">*</span></label>
            <input type="text" value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)} placeholder={platformPh.urun} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-gray-400 font-normal text-xs">(isteğe bağlı · fotoğraf yüklersen otomatik algılanır)</span></label>
            <select
              value={digerMod ? "Diğer" : (kategori || "")}
              onChange={(e) => {
                if (e.target.value === "Diğer") {
                  setDigerMod(true);
                  setKategori("");
                } else {
                  setDigerMod(false);
                  setKategori(e.target.value);
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">— Seç (isteğe bağlı) —</option>
              {KATEGORI_LISTESI.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            {digerMod && (
              <input
                type="text"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder="Kategori yaz..."
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
            <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)} placeholder={platformPh.ozellik} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <p className="text-xs text-gray-400 mt-1">💡 Renk, beden, malzeme, garanti, kutu içeriği, güvenlik bilgisi — ne kadar çok bilgi girersen içerik o kadar spesifik olur; az bilgide sonuç genel kalabilir</p>
          </div>

          {/* Hedef Kitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Kitle <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
            <select value={hedefKitle} onChange={(e) => setHedefKitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="genel">Genel</option>
              <option value="kadinlar">Kadınlar</option>
              <option value="erkekler">Erkekler</option>
              <option value="gencler">Gençler (18-25)</option>
              <option value="ebeveynler">Ebeveynler</option>
              <option value="profesyoneller">Profesyoneller</option>
              <option value="sporcular">Sporcular</option>
            </select>
          </div>

          {/* Fiyat Segmenti */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat Segmenti <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
            <div className="grid grid-cols-3 gap-2">
              {(["butce", "orta", "premium"] as const).map((seg) => (
                <button key={seg} type="button" onClick={() => setFiyatSegmenti(seg)}
                  className={`py-2 rounded-xl border-2 text-xs font-semibold transition-all ${fiyatSegmenti === seg ? "border-blue-400 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  {seg === "butce" ? "💰 Bütçe" : seg === "orta" ? "⚖️ Orta" : "👑 Premium"}
                </button>
              ))}
            </div>
          </div>

          {/* Anahtar Kelimeler */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
            <input type="text" value={anahtarKelimeler} onChange={(e) => setAnahtarKelimeler(e.target.value)}
              placeholder="örn: kışlık bot, su geçirmez ayakkabı, erkek outdoor"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <p className="text-xs text-gray-400 mt-1">💡 Arama sonuçlarında çıkmak istediğin kelimeler — AI bunları başlık ve açıklamaya doğal yerleştirir</p>
          </div>

          {/* F-11b: Markalı ürün checkbox */}
          <label className="flex items-start gap-3 cursor-pointer bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <input type="checkbox" checked={markaliUrun} onChange={(e) => setMarkaliUrun(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400" />
            <div>
              <p className="text-sm font-medium text-gray-800">Bu ürün markalı ve ben yetkili satıcıyım</p>
              <p className="text-xs text-gray-500 mt-0.5">İşaretlersen AI marka adını içeriğe dahil eder. Markasız veya el yapımı ürünlerde malzeme, teknik ve hikaye öne çıkar.</p>
            </div>
          </label>
        </>
      )}

      {/* Fotoğraf */}
      {girisTipi === "foto" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
            <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="örn: Ayakkabı & Çanta / Erkek Bot" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Fotoğrafı</label>
            {fotolar.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
                Yukarıdan ürün fotoğrafı yükle ↑
              </div>
            ) : (
              <FotoThumbnail src={fotolar[0]} onKaldir={() => fotoKaldir(0)} renk="green" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
            <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)} placeholder="örn: kışlık, su geçirmez, 42 numara, garanti belgeli" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>
      )}

      {/* Barkod */}
      {girisTipi === "barkod" && (
        <div className="space-y-3">
          {!kameraAcik && !barkodBilgi && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center space-y-3">
              <div className="text-3xl">🔍</div>
              <p className="text-sm text-gray-600">Ürünün barkodunu kameraya göster, bilgiler otomatik dolacak.</p>
              <button onClick={kameraAc} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
                📷 Kamerayı Aç
              </button>
            </div>
          )}
          {kameraAcik && (
            <div className="space-y-2">
              <div id="barkod-okuyucu" className="w-full rounded-xl overflow-hidden" />
              {barkodYukleniyor && <p className="text-center text-sm text-gray-500 animate-pulse">🔄 Ürün sorgulanıyor...</p>}
              <button onClick={kameraKapat} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors">
                ✕ Kamerayı Kapat
              </button>
            </div>
          )}
          {barkodBilgi && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-1">
              <p className="text-sm font-semibold text-green-700">✅ Ürün Tanındı</p>
              <p className="text-sm text-gray-700"><span className="font-medium">İsim:</span> {barkodBilgi.isim}</p>
              {barkodBilgi.marka && <p className="text-sm text-gray-600"><span className="font-medium">Marka:</span> {barkodBilgi.marka}</p>}
              {barkodBilgi.kategori && <p className="text-sm text-gray-600"><span className="font-medium">Kategori:</span> {barkodBilgi.kategori}</p>}
              <button onClick={() => { setBarkodBilgi(null); setUrunAdi(""); setKategori(""); setOzellikler(""); }} className="text-xs text-blue-500 hover:text-blue-700 underline mt-1 transition-colors">
                Tekrar Tara
              </button>
            </div>
          )}
        </div>
      )}

      {/* Üret butonu */}
      <button onClick={icerikUret} disabled={!uretButonAktif} className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
        {yukleniyor ? `⏳ ${YUKLENIYOR_MESAJLARI[yukleniyorMesaj]}` : (!kullanici || kullanici.anonim) ? "✨ Metin Üret — Giriş Gerekli" : `✨ Metin Üret — ${kullanici.is_admin ? "∞" : "1"} kredi`}
      </button>

      <p className="text-xs text-gray-400 text-center">💡 yzliste her platformun karakter limiti ve SEO kuralına göre üretir ancak pazaryeri kuralları sık değişir — yayınlamadan önce içeriği kontrol etmeni öneririz</p>

      {!yukleniyor && kullanici && !kullanici.anonim && !kullanici.is_admin && (kullanici.kredi ?? 0) <= 0 && (
        <p className="text-center text-xs text-red-500">İçerik üretim krediniz bitti. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al →</button></p>
      )}

      {yukleniyor && (
        <div className="bg-white rounded-2xl shadow p-8 text-center space-y-4">
          <div className="flex justify-center"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" /></div>
          <p className="text-gray-600 font-medium animate-pulse">{YUKLENIYOR_MESAJLARI[yukleniyorMesaj]}</p>
          <p className="text-gray-400 text-sm">Bu birkaç saniye sürebilir...</p>
        </div>
      )}

      {sonuc && !yukleniyor && (
        <div id="sonuc-alani" className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-base font-semibold text-gray-800">✅ Üretilen İçerik</h2>
            <button onClick={() => docxIndir(sonucBolumleri, urunAdi || "listing")} className="flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-3 py-1.5 rounded-lg transition-colors border border-blue-200">
              📄 Word İndir
            </button>
          </div>

          {/* F-12a: Mikro-aksiyonlar */}
          {(() => {
            const mikro = async (aksiyon: string) => {
              if (!kullanici || duzenleYukleniyor) return;
              setDuzenleYukleniyor(true);
              const res = await fetch("/api/uret/duzenle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sonuc, aksiyon, userId: kullanici.id }),
              });
              const data = await res.json();
              if (data.sonuc) setSonuc(data.sonuc);
              setDuzenleYukleniyor(false);
            };
            return (
              <div className="flex flex-wrap gap-2 px-1">
                <button onClick={async () => {
                  if (!kullanici || yukleniyor || duzenleYukleniyor) return;
                  if (uretimId && yenidenUretHakki > 0) {
                    setDuzenleYukleniyor(true);
                    const res = await fetch("/api/uret/duzenle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sonuc, aksiyon: "yeniden_uret_context", userId: kullanici.id }) });
                    const data = await res.json();
                    if (data.sonuc) { setSonuc(data.sonuc); setYenidenUretHakki(h => h - 1); }
                    setDuzenleYukleniyor(false);
                  } else {
                    icerikUret();
                  }
                }} disabled={yukleniyor || duzenleYukleniyor} className="flex items-center gap-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors disabled:opacity-40">
                  🔁 Yeniden üret{uretimId && yenidenUretHakki > 0 ? ` (${yenidenUretHakki} ücretsiz)` : ""}
                </button>
                <button onClick={() => mikro("kisalt")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-40">
                  {duzenleYukleniyor ? "⏳" : "✂️"} Kısalt
                </button>
                <button onClick={() => mikro("genislet")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-40">
                  ➕ Genişlet
                </button>
                <button onClick={() => mikro("ton_samimi")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-40">
                  🎭 Samimi
                </button>
                <button onClick={() => mikro("ton_resmi")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-40">
                  🎭 Resmi
                </button>
              </div>
            );
          })()}

          {/* F-10c: Platform uyumluluk rozeti */}
          {(() => {
            const baslik = sonucBolumleri.find(b => b.baslik === "Başlık")?.icerik ?? "";
            const pb = platformBilgi;
            const baslikUzunluk = baslik.length;
            const baslikUygun = baslikUzunluk > 0 && baslikUzunluk <= pb.baslikLimit;
            const platformAdi = { trendyol: "Trendyol", hepsiburada: "Hepsiburada", amazon: "Amazon TR", n11: "N11", etsy: "Etsy", amazon_usa: "Amazon USA" }[platform] ?? platform;
            const tumuygun = baslikUygun;
            if (!baslik) return null;
            return (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${tumuygun ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-amber-50 border border-amber-200 text-amber-700"}`}>
                <span>{tumuygun ? "✓" : "⚠️"}</span>
                <span className="flex-1">
                  {tumuygun
                    ? `${platformAdi} kurallarına uygun — Başlık ${baslikUzunluk}/${pb.baslikLimit} karakter`
                    : `Başlık ${baslikUzunluk} karakter — ${platformAdi} limiti ${pb.baslikLimit} karakter`}
                </span>
              </div>
            );
          })()}

          {/* F-11d: Marka/IP uyarısı */}
          {!markaliUrun && (() => {
            const BILINEN_MARKALAR = /\b(Apple|Samsung|Nike|Adidas|Sony|LG|Philips|Tefal|Bosch|Siemens|Dyson|Stanley|Tupperware|Lego|Canon|Nikon|Braun|Arçelik|Vestel|Beko|Xiaomi|Huawei|Lenovo|Asus|Microsoft|Google)\b/gi;
            const eslesmeler = sonuc.match(BILINEN_MARKALAR);
            if (!eslesmeler) return null;
            const tekil = [...new Set(eslesmeler.map(m => m.trim()))];
            return (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200">
                <span className="text-red-500 flex-shrink-0">⚠️</span>
                <div>
                  <p className="text-xs font-semibold text-red-700">Marka/IP Uyarısı</p>
                  <p className="text-xs text-red-600 mt-0.5">Tespit edilen marka adı: <span className="font-medium">{tekil.join(", ")}</span>. Yetkili satıcı değilseniz içeriği gözden geçirin.</p>
                </div>
              </div>
            );
          })()}

          {sonucBolumleri.map((bolum, i) => {
            const ref = { current: null as HTMLDivElement | null };
            return (
              <div key={i} className="bg-white rounded-2xl shadow p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">{bolum.ikon} {bolum.baslik}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300 hidden sm:block">✎ düzenlenebilir</span>
                    <KopyalaButon metin={bolum.icerik} getDuzenlenmisMevin={() => ref.current?.innerText || bolum.icerik} />
                  </div>
                </div>
                <div ref={ref} contentEditable suppressContentEditableWarning
                  onFocus={(e) => { e.currentTarget.style.outline = "2px solid #f97316"; e.currentTarget.style.borderRadius = "8px"; e.currentTarget.style.padding = "8px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; e.currentTarget.style.padding = "0"; }}
                  className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans cursor-text">
                  {bolum.icerik}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
