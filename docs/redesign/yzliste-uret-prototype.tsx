// yzliste-uret-prototype.tsx
// yzliste · Üretim ekranı (/uret) prototipi
//
// Amaç: Bu dosya "buna benzet" olarak referans alınır, birebir kopyalanmaz.
// Mevcut /uret sayfasının backend bağlantıları (form state, API çağrıları)
// bu dosyada yok — sadece görsel referans. Uygulamada mevcut mantık korunur.
//
// Gerekli paketler:
//   npm install lucide-react
//
// Font: Inter (global layout'ta tanımlanmış olmalı)
// Tailwind: mevcut projede kurulu
//
// Design system: yzliste-design-tokens.md

'use client'

import { useState } from 'react'
import {
  FileText,
  Image as ImageIcon,
  Share2,
  Video,
  ImagePlus,
  Edit3,
  Camera,
  ScanLine,
  FileSpreadsheet,
  RotateCw,
  ZoomIn,
  Lightbulb,
  Leaf,
  Search,
  Zap,
  MessageCircle,
  ChevronRight,
} from 'lucide-react'

type TabKey = 'metin' | 'gorsel' | 'video' | 'sosyal'
type InputMethod = 'manuel' | 'foto' | 'barkod' | 'excel'
type Platform = 'trendyol' | 'hepsiburada' | 'amazon' | 'n11' | 'etsy' | 'amazon_usa'

const TABS: Array<{ key: TabKey; label: string; Icon: typeof FileText }> = [
  { key: 'metin', label: 'Metin', Icon: FileText },
  { key: 'gorsel', label: 'Görsel', Icon: ImageIcon },
  { key: 'video', label: 'Video', Icon: Video },
  { key: 'sosyal', label: 'Sosyal medya', Icon: Share2 },
]

const PLATFORM_RULES: Record<Platform, string[]> = {
  trendyol: ['Başlık 100 karakter', '5 özellik maddesi', '10 arama etiketi', 'Türkçe çıktı'],
  hepsiburada: ['Başlık 150 karakter', '6 özellik maddesi', '12 arama etiketi', 'Türkçe çıktı'],
  amazon: ['Başlık 200 karakter', 'Bullet points (5 madde)', 'Arama terimleri', 'Türkçe çıktı'],
  n11: ['Başlık 80 karakter', '4 özellik maddesi', '8 arama etiketi', 'Türkçe çıktı'],
  etsy: ['Başlık 140 karakter', '13 arama etiketi', 'İngilizce çıktı'],
  amazon_usa: ['Başlık 200 karakter', 'Bullet points (5 madde)', 'Arama terimleri', 'İngilizce çıktı'],
}

const IMAGE_STYLES = [
  { key: 'beyaz', label: 'Beyaz zemin', caption: 'Trendyol standart' },
  { key: 'koyu', label: 'Koyu zemin', caption: 'Premium · elektronik' },
  { key: 'lifestyle', label: 'Lifestyle', caption: 'Gerçek ortam' },
  { key: 'mermer', label: 'Mermer', caption: 'Lüks · kozmetik' },
  { key: 'ahsap', label: 'Ahşap', caption: 'El yapımı · organik' },
  { key: 'gradient', label: 'Gradient', caption: 'Modern · teknoloji' },
  { key: 'dogal', label: 'Doğal', caption: 'Açık hava · taze' },
  { key: 'prompt', label: 'Sahneni yaz', caption: 'Prompt ile tarif et' },
]

const VIDEO_MOTIONS = [
  { key: 'donus', label: '360° dönüş', caption: 'Ürün kendi ekseninde döner', Icon: RotateCw },
  { key: 'zoom', label: 'Zoom yaklaşım', caption: 'Kamera yavaş yaklaşır', Icon: ZoomIn },
  { key: 'isik', label: 'Dramatik ışık', caption: 'Spotlight · premium görünüm', Icon: Lightbulb },
  { key: 'dogal', label: 'Doğal ortam', caption: 'Altın saat ışığı', Icon: Leaf },
  { key: 'detay', label: 'Detay tarama', caption: 'Yüzey ve doku', Icon: Search },
]

export default function UretimEkrani() {
  const [activeTab, setActiveTab] = useState<TabKey>('metin')
  const [platform, setPlatform] = useState<Platform>('trendyol')
  const [inputMethod, setInputMethod] = useState<InputMethod>('manuel')
  const [hasPhoto, setHasPhoto] = useState(false)
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(new Set())
  const [selectedMotion, setSelectedMotion] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<5 | 10>(5)

  const isLoggedIn = false // prototipte örnek

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24 px-4 font-sans text-[#1A1A17]">
      {/* Header — mevcut header'ı koruyoruz, burada kısaltılmış */}
      <Header />

      <main className="max-w-5xl mx-auto pt-6">
        <div className="flex gap-6 items-start flex-col lg:flex-row">
          {/* Ana içerik sütunu */}
          <div className="flex-1 w-full space-y-3">
            {/* Sekme — alt çizgi ile */}
            <div
              role="tablist"
              aria-label="İçerik türü seçimi"
              className="bg-white border border-[#D8D6CE] rounded-xl p-1 flex gap-0.5"
            >
              {TABS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  onClick={() => setActiveTab(key)}
                  className={`
                    flex-1 py-2.5 rounded-lg text-sm font-medium
                    flex items-center justify-center gap-2
                    transition-colors
                    ${
                      activeTab === key
                        ? 'bg-[#F1F0EB] text-[#1A1A17]'
                        : 'text-[#5A5852] hover:text-[#1A1A17] hover:bg-[#FAFAF8]'
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Platform seçici + kurallar */}
            <div className="bg-white border border-[#D8D6CE] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[#1A1A17] whitespace-nowrap flex-shrink-0">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="flex-1 border border-[#D8D6CE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E4DD8] focus:ring-2 focus:ring-[#1E4DD8]/20 transition-colors"
                >
                  <optgroup label="Türk pazaryerleri">
                    <option value="trendyol">Trendyol</option>
                    <option value="hepsiburada">Hepsiburada</option>
                    <option value="amazon">Amazon TR</option>
                    <option value="n11">N11</option>
                  </optgroup>
                  <optgroup label="Yabancı pazaryerleri (İngilizce)">
                    <option value="etsy">Etsy</option>
                    <option value="amazon_usa">Amazon USA</option>
                  </optgroup>
                </select>
              </div>

              {/* Kurallar info-bar — emoji yok, sıcak gri */}
              <div className="bg-[#F1F0EB] rounded-lg px-3 py-2 flex items-center gap-2 flex-wrap text-xs text-[#5A5852]">
                {PLATFORM_RULES[platform].map((rule, i) => (
                  <span key={rule} className="flex items-center gap-2">
                    <span>{rule}</span>
                    {i < PLATFORM_RULES[platform].length - 1 && (
                      <span className="text-[#D8D6CE]">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Fotoğraf yükleme */}
            <PhotoUploader hasPhoto={hasPhoto} onUpload={() => setHasPhoto(true)} />

            {/* Sekmeye göre değişen panel */}
            {activeTab === 'metin' && (
              <MetinPaneli
                inputMethod={inputMethod}
                setInputMethod={setInputMethod}
                isLoggedIn={isLoggedIn}
              />
            )}
            {activeTab === 'gorsel' && (
              <GorselPaneli
                hasPhoto={hasPhoto}
                selectedStyles={selectedStyles}
                setSelectedStyles={setSelectedStyles}
                isLoggedIn={isLoggedIn}
                onAddPhoto={() => {
                  // senaryoda scroll to upload
                  document.querySelector('[data-photo-upload]')?.scrollIntoView({ behavior: 'smooth' })
                }}
              />
            )}
            {activeTab === 'video' && (
              <VideoPaneli
                hasPhoto={hasPhoto}
                videoDuration={videoDuration}
                setVideoDuration={setVideoDuration}
                selectedMotion={selectedMotion}
                setSelectedMotion={setSelectedMotion}
                isLoggedIn={isLoggedIn}
                onAddPhoto={() => {
                  document.querySelector('[data-photo-upload]')?.scrollIntoView({ behavior: 'smooth' })
                }}
              />
            )}
            {activeTab === 'sosyal' && <SosyalPaneli isLoggedIn={isLoggedIn} />}
          </div>

          {/* Yan panel — 3 adımda */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white border border-[#D8D6CE] rounded-xl p-4 sticky top-4">
              <p className="text-xs font-medium text-[#5A5852] uppercase tracking-wide mb-2">
                3 adımda
              </p>
              <ol className="space-y-1.5 text-sm text-[#1A1A17]">
                <li className="flex gap-2">
                  <span className="text-[#908E86] font-mono text-xs mt-0.5">1</span>
                  Platform seç
                </li>
                <li className="flex gap-2">
                  <span className="text-[#908E86] font-mono text-xs mt-0.5">2</span>
                  Ürünü anlat
                </li>
                <li className="flex gap-2">
                  <span className="text-[#908E86] font-mono text-xs mt-0.5">3</span>
                  İçeriği al
                </li>
              </ol>
              <p className="text-xs text-[#908E86] mt-3 pt-3 border-t border-[#F1F0EB] leading-relaxed">
                Metin, görsel, video ve sosyal medya — tek yerden.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Floating chat — emoji yerine ikon, sessiz koyu */}
      <button
        aria-label="Destek sohbeti"
        className="fixed bottom-6 right-6 z-50 bg-[#1A1A17] hover:bg-[#2C2C29] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
      >
        <MessageCircle size={20} strokeWidth={1.5} />
      </button>
    </div>
  )
}

// -------- Header (mevcut koruduğumuz, burada kısaltılmış) --------

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#F1F0EB] -mx-4 px-4 py-2.5 mb-4">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <a href="/" className="flex-shrink-0">
          <span className="text-base font-medium">yzliste</span>
        </a>
        <nav className="hidden sm:flex items-center gap-0.5 text-sm flex-1 ml-4">
          <a href="/" className="px-3 py-1.5 rounded-lg text-[#5A5852] hover:text-[#1A1A17] hover:bg-[#F1F0EB]">
            Ana sayfa
          </a>
          <a href="/fiyatlar" className="px-3 py-1.5 rounded-lg text-[#5A5852] hover:text-[#1A1A17] hover:bg-[#F1F0EB]">
            Fiyatlar
          </a>
          <a href="/blog" className="px-3 py-1.5 rounded-lg text-[#5A5852] hover:text-[#1A1A17] hover:bg-[#F1F0EB]">
            Blog
          </a>
        </nav>
        <a
          href="/uret"
          className="ml-auto text-sm bg-[#1E4DD8] hover:bg-[#163B9E] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          İçerik üret
        </a>
      </div>
    </header>
  )
}

// -------- Fotoğraf yükleyici --------

function PhotoUploader({ hasPhoto, onUpload }: { hasPhoto: boolean; onUpload: () => void }) {
  return (
    <label
      data-photo-upload
      className="bg-white border border-dashed border-[#D8D6CE] hover:border-[#1E4DD8] rounded-xl p-4 cursor-pointer transition-colors flex items-center gap-3 group"
    >
      <div className="w-12 h-12 rounded-lg bg-[#F1F0EB] group-hover:bg-[#F0F4FB] flex items-center justify-center flex-shrink-0 transition-colors">
        <ImagePlus size={20} strokeWidth={1.5} className="text-[#5A5852] group-hover:text-[#1E4DD8] transition-colors" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1A1A17]">
          {hasPhoto ? 'Fotoğraf yüklendi' : 'Ürün fotoğrafı yükle'}
        </p>
        <p className="text-xs text-[#908E86] mt-0.5">Tüm içerik türlerinde kullanılır</p>
      </div>
      <span className="text-xs text-[#908E86] group-hover:text-[#1E4DD8] transition-colors">
        {hasPhoto ? 'Değiştir' : 'Seç'}
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.length && onUpload()}
      />
    </label>
  )
}

// -------- Metin paneli --------

function MetinPaneli({
  inputMethod,
  setInputMethod,
  isLoggedIn,
}: {
  inputMethod: InputMethod
  setInputMethod: (m: InputMethod) => void
  isLoggedIn: boolean
}) {
  return (
    <div className="bg-white border border-[#D8D6CE] rounded-xl p-5 space-y-4">
      {/* Başlık — emoji yok, font-medium */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-[#1A1A17]">Listing metni</h2>
        <span className="text-xs text-[#5A5852] font-mono">1 kredi</span>
      </div>

      {/* Giriş yöntemi sekmesi — alt çizgi ile */}
      <div className="flex gap-0 border-b border-[#F1F0EB]">
        {[
          { key: 'manuel', label: 'Manuel', Icon: Edit3 },
          { key: 'foto', label: 'Fotoğraf', Icon: Camera },
          { key: 'barkod', label: 'Barkod', Icon: ScanLine },
          { key: 'excel', label: 'Excel', Icon: FileSpreadsheet },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setInputMethod(key as InputMethod)}
            className={`
              flex items-center gap-1.5 px-3 py-2 text-sm transition-colors relative
              ${
                inputMethod === key
                  ? 'text-[#1A1A17] font-medium'
                  : 'text-[#908E86] hover:text-[#5A5852]'
              }
            `}
          >
            <Icon size={14} strokeWidth={1.5} />
            <span>{label}</span>
            {inputMethod === key && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#1E4DD8]" />
            )}
          </button>
        ))}
      </div>

      {/* Form alanları */}
      <div className="space-y-4">
        <Field label="Ürün adı" required>
          <input
            type="text"
            placeholder="Columbia erkek su geçirmez outdoor bot"
            className="w-full border border-[#D8D6CE] rounded-lg px-3.5 py-2.5 text-sm placeholder:text-[#908E86] focus:outline-none focus:border-[#1E4DD8] focus:ring-2 focus:ring-[#1E4DD8]/20 transition-colors"
          />
        </Field>

        <Field label="Kategori" required>
          <select className="w-full border border-[#D8D6CE] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E4DD8] focus:ring-2 focus:ring-[#1E4DD8]/20 transition-colors">
            <option value="">Seç</option>
            <option>Kozmetik ve kişisel bakım</option>
            <option>Elektronik ve aksesuar</option>
            <option>Giyim ve moda</option>
            <option>Ev ve yaşam</option>
            <option>Gıda ve içecek</option>
            <option>Takı ve aksesuar</option>
            <option>Spor ve outdoor</option>
            <option>Bebek ve çocuk</option>
            <option>Kitap ve kırtasiye</option>
            <option>Oto ve bahçe</option>
            <option>Diğer</option>
          </select>
        </Field>

        <Field label="Ürün detayları" optional>
          <textarea
            placeholder="Renk, beden, malzeme, öne çıkan özellikler, arama kelimeleri — ne kadar detay verirsen içerik o kadar iyi olur"
            rows={3}
            className="w-full border border-[#D8D6CE] rounded-lg px-3.5 py-2.5 text-sm placeholder:text-[#908E86] focus:outline-none focus:border-[#1E4DD8] focus:ring-2 focus:ring-[#1E4DD8]/20 transition-colors resize-none"
          />
        </Field>

        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-[#5A5852] hover:text-[#1A1A17] transition-colors"
        >
          <ChevronRight size={12} strokeWidth={1.5} />
          Daha fazla seçenek
        </button>

        <PrimaryAction disabled={!isLoggedIn} label={isLoggedIn ? 'Üret' : 'Giriş yap ve başla'} />

        <p className="text-xs text-[#908E86] text-center leading-relaxed">
          Platformun karakter limiti ve SEO kurallarına göre üretilir. Pazaryeri kuralları
          değişebilir — yayınlamadan önce içeriği kontrol et.
        </p>
      </div>
    </div>
  )
}

// -------- Görsel paneli --------

function GorselPaneli({
  hasPhoto,
  selectedStyles,
  setSelectedStyles,
  isLoggedIn,
  onAddPhoto,
}: {
  hasPhoto: boolean
  selectedStyles: Set<string>
  setSelectedStyles: (s: Set<string>) => void
  isLoggedIn: boolean
  onAddPhoto: () => void
}) {
  const toggle = (key: string) => {
    const next = new Set(selectedStyles)
    next.has(key) ? next.delete(key) : next.add(key)
    setSelectedStyles(next)
  }

  return (
    <div className="bg-white border border-[#D8D6CE] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-[#1A1A17]">Ürün görseli</h2>
        <span className="text-xs text-[#5A5852] font-mono">1 kredi / stil</span>
      </div>

      <p className="text-xs text-[#5A5852] leading-relaxed">
        Tek fotoğraftan 7 farklı stüdyo stili. Seçtiğin her stil için 1 görsel üretilir.
      </p>

      {!hasPhoto ? (
        <div className="bg-[#F1F0EB] rounded-lg p-6 text-center">
          <p className="text-sm text-[#5A5852] mb-2">Görsel üretmek için önce ürün fotoğrafı ekle</p>
          <button
            onClick={onAddPhoto}
            className="text-sm font-medium text-[#1E4DD8] hover:text-[#163B9E] transition-colors"
          >
            Fotoğraf ekle
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs font-medium text-[#5A5852] uppercase tracking-wide">
            Stil seç ({selectedStyles.size} seçili)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {IMAGE_STYLES.map((style) => (
              <button
                key={style.key}
                onClick={() => toggle(style.key)}
                className={`
                  flex flex-col rounded-lg overflow-hidden border text-left transition-colors
                  ${
                    selectedStyles.has(style.key)
                      ? 'border-[#1E4DD8] ring-1 ring-[#1E4DD8]'
                      : 'border-[#D8D6CE] hover:border-[#7B9BD9]'
                  }
                `}
              >
                <div className="aspect-square w-full bg-[#F1F0EB]">
                  {/* Gerçek uygulamada /ornek_beyaz.jpg gibi mevcut görseller kullanılır */}
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs font-medium text-[#1A1A17]">{style.label}</p>
                  <p className="text-xs text-[#908E86] mt-0.5">{style.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <Field label="Görsel yönlendirmesi" optional>
        <textarea
          placeholder="Sahneyi tarif et — örn: mermer masa üzerinde yumuşak pencere ışığı, yeşil bitkilerle"
          rows={2}
          className="w-full border border-[#D8D6CE] rounded-lg px-3.5 py-2.5 text-sm placeholder:text-[#908E86] focus:outline-none focus:border-[#1E4DD8] focus:ring-2 focus:ring-[#1E4DD8]/20 transition-colors resize-none"
        />
      </Field>

      <PrimaryAction
        disabled={!hasPhoto || !isLoggedIn || selectedStyles.size === 0}
        label={
          !hasPhoto
            ? 'Önce fotoğraf ekle'
            : selectedStyles.size === 0
            ? 'Stil seç'
            : isLoggedIn
            ? `${selectedStyles.size} görsel üret`
            : 'Giriş yap ve başla'
        }
      />

      <p className="text-xs text-[#908E86] text-center">
        AI hata yapabilir — üretilen görselleri yayınlamadan önce kontrol et.
      </p>
    </div>
  )
}

// -------- Video paneli --------

function VideoPaneli({
  hasPhoto,
  videoDuration,
  setVideoDuration,
  selectedMotion,
  setSelectedMotion,
  isLoggedIn,
  onAddPhoto,
}: {
  hasPhoto: boolean
  videoDuration: 5 | 10
  setVideoDuration: (d: 5 | 10) => void
  selectedMotion: string | null
  setSelectedMotion: (m: string | null) => void
  isLoggedIn: boolean
  onAddPhoto: () => void
}) {
  return (
    <div className="bg-white border border-[#D8D6CE] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-[#1A1A17]">Ürün videosu</h2>
        <span className="text-xs text-[#5A5852] font-mono">5sn: 10 kredi · 10sn: 20 kredi</span>
      </div>

      {/* Uyarı kutusu — semantik warning renkleri */}
      <div className="bg-[#FEF4E7] rounded-lg p-3 flex items-start gap-2.5">
        <Zap size={16} strokeWidth={1.5} className="text-[#8B4513] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-[#8B4513]">Kredi üretim anında düşer</p>
          <p className="text-xs text-[#8B4513]/80 mt-0.5">AI işlem ~2 dakika sürer</p>
        </div>
      </div>

      {!hasPhoto ? (
        <div className="bg-[#F1F0EB] rounded-lg p-6 text-center">
          <p className="text-sm text-[#5A5852] mb-2">Video üretmek için önce ürün fotoğrafı ekle</p>
          <button
            onClick={onAddPhoto}
            className="text-sm font-medium text-[#1E4DD8] hover:text-[#163B9E] transition-colors"
          >
            Fotoğraf ekle
          </button>
        </div>
      ) : (
        <>
          {/* Format */}
          <div>
            <p className="text-xs font-medium text-[#5A5852] uppercase tracking-wide mb-2">Format</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 rounded-lg border border-[#1E4DD8] ring-1 ring-[#1E4DD8] text-left">
                <p className="text-sm font-medium text-[#1A1A17]">Dikey 9:16</p>
                <p className="text-xs text-[#908E86] mt-0.5">Reels · TikTok</p>
              </button>
              <button className="p-3 rounded-lg border border-[#D8D6CE] hover:border-[#7B9BD9] text-left transition-colors">
                <p className="text-sm font-medium text-[#1A1A17]">Yatay 16:9</p>
                <p className="text-xs text-[#908E86] mt-0.5">YouTube · Facebook</p>
              </button>
            </div>
          </div>

          {/* Süre */}
          <div>
            <p className="text-xs font-medium text-[#5A5852] uppercase tracking-wide mb-2">Süre</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setVideoDuration(5)}
                className={`
                  p-3 rounded-lg border text-left transition-colors
                  ${videoDuration === 5 ? 'border-[#1E4DD8] ring-1 ring-[#1E4DD8]' : 'border-[#D8D6CE] hover:border-[#7B9BD9]'}
                `}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-medium text-[#1A1A17]">5 saniye</p>
                  <span className="text-xs font-mono text-[#5A5852]">10 kredi</span>
                </div>
                <p className="text-xs text-[#908E86]">Hızlı tanıtım</p>
              </button>
              <button
                onClick={() => setVideoDuration(10)}
                className={`
                  p-3 rounded-lg border text-left transition-colors
                  ${videoDuration === 10 ? 'border-[#1E4DD8] ring-1 ring-[#1E4DD8]' : 'border-[#D8D6CE] hover:border-[#7B9BD9]'}
                `}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-medium text-[#1A1A17]">10 saniye</p>
                  <span className="text-xs font-mono text-[#5A5852]">20 kredi</span>
                </div>
                <p className="text-xs text-[#908E86]">Detaylı showcase</p>
              </button>
            </div>
          </div>

          {/* Hareket tarifleri — Lucide ikonlar */}
          <div>
            <p className="text-xs font-medium text-[#5A5852] uppercase tracking-wide mb-2">
              Hareket
            </p>
            <div className="grid grid-cols-2 gap-2">
              {VIDEO_MOTIONS.map(({ key, label, caption, Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedMotion(selectedMotion === key ? null : key)}
                  className={`
                    text-left p-2.5 rounded-lg border transition-colors
                    ${
                      selectedMotion === key
                        ? 'border-[#1E4DD8] ring-1 ring-[#1E4DD8]'
                        : 'border-[#D8D6CE] hover:border-[#7B9BD9]'
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={14} strokeWidth={1.5} className="text-[#5A5852]" />
                    <p className="text-xs font-medium text-[#1A1A17]">{label}</p>
                  </div>
                  <p className="text-xs text-[#908E86] leading-relaxed">{caption}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <PrimaryAction
        disabled={!hasPhoto || !isLoggedIn}
        label={!hasPhoto ? 'Önce fotoğraf ekle' : isLoggedIn ? 'Video üret' : 'Giriş yap ve başla'}
      />
    </div>
  )
}

// -------- Sosyal medya paneli --------

function SosyalPaneli({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="bg-white border border-[#D8D6CE] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-[#1A1A17]">Sosyal medya içeriği</h2>
        <span className="text-xs text-[#5A5852] font-mono">1 kredi / platform</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="py-2.5 rounded-lg border border-[#1E4DD8] ring-1 ring-[#1E4DD8] text-sm font-medium text-[#1A1A17]">
          Caption + hashtag
        </button>
        <button className="py-2.5 rounded-lg border border-[#D8D6CE] hover:border-[#7B9BD9] text-sm font-medium text-[#5A5852] transition-colors">
          Ürün görseli
        </button>
      </div>

      <div>
        <p className="text-xs font-medium text-[#5A5852] uppercase tracking-wide mb-2">Platform</p>
        <div className="grid grid-cols-4 gap-2">
          {['Instagram', 'TikTok', 'Facebook', 'X'].map((p, i) => (
            <button
              key={p}
              className={`
                py-2 px-2 rounded-lg border text-xs font-medium transition-colors
                ${i === 0 ? 'border-[#1E4DD8] ring-1 ring-[#1E4DD8] text-[#1A1A17]' : 'border-[#D8D6CE] hover:border-[#7B9BD9] text-[#5A5852]'}
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <Field label="Ürün adı" required>
        <input
          type="text"
          placeholder="Bakır cezve seti, kadın deri çanta"
          className="w-full border border-[#D8D6CE] rounded-lg px-3.5 py-2.5 text-sm placeholder:text-[#908E86] focus:outline-none focus:border-[#1E4DD8] focus:ring-2 focus:ring-[#1E4DD8]/20 transition-colors"
        />
      </Field>

      <Field label="Ek bilgi" optional>
        <textarea
          placeholder="%20 indirimde, yeni sezon, el yapımı, hediye seçeneği"
          rows={2}
          className="w-full border border-[#D8D6CE] rounded-lg px-3.5 py-2.5 text-sm placeholder:text-[#908E86] focus:outline-none focus:border-[#1E4DD8] focus:ring-2 focus:ring-[#1E4DD8]/20 transition-colors resize-none"
        />
      </Field>

      <div className="space-y-2">
        <PrimaryAction disabled={!isLoggedIn} label={isLoggedIn ? 'Caption üret' : 'Giriş yap ve başla'} />
        <button
          disabled={!isLoggedIn}
          className="w-full bg-white border border-[#D8D6CE] hover:bg-[#FAFAF8] disabled:text-[#908E86] text-[#1A1A17] font-medium text-sm py-3 rounded-lg transition-colors"
        >
          4 platform için birden üret — 3 kredi
        </button>
        <p className="text-xs text-[#908E86] text-center">Instagram · TikTok · Facebook · X aynı anda</p>
      </div>
    </div>
  )
}

// -------- Yardımcı componentler --------

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string
  required?: boolean
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A17] mb-1.5">
        {label}
        {required && <span className="text-[#C0392B] ml-0.5">*</span>}
        {optional && <span className="text-[#908E86] font-normal ml-1">(isteğe bağlı)</span>}
      </label>
      {children}
    </div>
  )
}

function PrimaryAction({ disabled, label }: { disabled: boolean; label: string }) {
  return (
    <button
      disabled={disabled}
      className="w-full bg-[#1E4DD8] hover:bg-[#163B9E] disabled:bg-[#D8D6CE] disabled:text-[#908E86] disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-lg transition-colors"
    >
      {label}
    </button>
  )
}
