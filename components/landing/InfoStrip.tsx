'use client'

import { useState } from 'react'
import { FileText, Image as ImageIcon, Video, MessageSquare, ChevronDown, RotateCw, ZoomIn, Lightbulb, Leaf, ScanSearch, Wind, Check, X, Tag, Hash, Camera, Timer, Film, Columns2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { EXAMPLE_CONTENT, EXAMPLE_CONTENT_TR } from '@/lib/data/exampleContent'

type TabId = 'metin' | 'gorsel' | 'video' | 'sosyal'
type MarketId = 'trendyol' | 'amazon' | 'etsy'

const TABS = [
  {
    id: 'metin' as TabId,
    label: 'Metin',
    icon: FileText,
    kredi: '1 kredi',
    sure: '~10sn',
    description: 'Başlık + özellikler + etiket · platforma özel format',
  },
  {
    id: 'gorsel' as TabId,
    label: 'Görsel',
    icon: ImageIcon,
    kredi: '1 kredi',
    sure: '~30sn',
    description: '7 ön tanımlı stil · stüdyo standardı 1200×1200',
  },
  {
    id: 'video' as TabId,
    label: 'Video',
    icon: Video,
    kredi: '10 kredi (5sn) / 20 kredi (10sn)',
    sure: '~2dk',
    description: '5 veya 10 sn · dikey + yatay format',
  },
  {
    id: 'sosyal' as TabId,
    label: 'Sosyal',
    icon: MessageSquare,
    kredi: '1 kredi/platform · Kit: 3 kredi',
    sure: '~20sn',
    description: 'Instagram + TikTok + Pinterest · caption + hashtag',
  },
]


// ---- KopyalaButon ----

function KopyalaButon({ metin }: { metin: string }) {
  const [kopyalandi, setKopyalandi] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(metin).then(() => {
      setKopyalandi(true)
      setTimeout(() => setKopyalandi(false), 1800)
    })
  }
  return (
    <button
      type="button"
      onClick={handle}
      className={cn(
        'text-xs px-2 py-0.5 rounded-lg transition-colors shrink-0 flex items-center gap-1',
        kopyalandi
          ? 'bg-rd-success-50 border border-rd-success-200 text-rd-success-700'
          : 'bg-white border border-rd-neutral-200 text-rd-neutral-500 hover:text-rd-neutral-800',
      )}
    >
      {kopyalandi && <Check size={11} strokeWidth={2} />}
      {kopyalandi ? 'Kopyalandı' : 'Kopyala'}
    </button>
  )
}

// ---- MetinPanel data ----

const platformVerileriInfoStrip: Record<MarketId, {
  etiket: string
  aciklamaKisa: string
  bolumler: { ikon: string; baslik: string; icerik: string; renk: string }[]
}> = {
  trendyol: {
    etiket: 'Trendyol',
    aciklamaKisa: 'Max 100 karakter başlık · Türkçe · Keyword-yoğun',
    bolumler: [
      { ikon: 'pin', baslik: 'Başlık', icerik: EXAMPLE_CONTENT_TR.metin.trendyol.title, renk: 'border-l-orange-400' },
      { ikon: 'bullet', baslik: 'Özellikler', icerik: EXAMPLE_CONTENT_TR.metin.trendyol.features.join('\n'), renk: 'border-l-orange-400' },
      { ikon: 'filetext', baslik: 'Açıklama', icerik: EXAMPLE_CONTENT_TR.metin.trendyol.description, renk: 'border-l-rd-success-700' },
      { ikon: 'bookmark', baslik: 'Arama Etiketleri', icerik: EXAMPLE_CONTENT_TR.metin.trendyol.tags.join(', '), renk: 'border-l-rd-primary-300' },
    ],
  },
  amazon: {
    etiket: 'Amazon TR',
    aciklamaKisa: 'Max 200 karakter başlık · Keyword-stuffed · A+ bullet\'lar',
    bolumler: [
      { ikon: 'pin', baslik: 'Başlık', icerik: EXAMPLE_CONTENT_TR.metin.amazon.title, renk: 'border-l-[#E47911]' },
      { ikon: 'bullet', baslik: 'Özellikler', icerik: EXAMPLE_CONTENT_TR.metin.amazon.features.join('\n'), renk: 'border-l-[#E47911]' },
      { ikon: 'filetext', baslik: 'Açıklama', icerik: EXAMPLE_CONTENT_TR.metin.amazon.description, renk: 'border-l-rd-success-700' },
      { ikon: 'bookmark', baslik: 'Arama Etiketleri', icerik: EXAMPLE_CONTENT_TR.metin.amazon.tags.join(', '), renk: 'border-l-rd-primary-300' },
    ],
  },
  etsy: {
    etiket: 'Etsy',
    aciklamaKisa: 'İngilizce · Hikaye anlatımı · Handmade & artisan vurgusu',
    bolumler: [
      { ikon: 'pin', baslik: 'Title', icerik: EXAMPLE_CONTENT_TR.metin.etsy.title, renk: 'border-l-rose-400' },
      { ikon: 'bullet', baslik: 'Features', icerik: EXAMPLE_CONTENT_TR.metin.etsy.features.join('\n'), renk: 'border-l-rose-400' },
      { ikon: 'filetext', baslik: 'Description', icerik: EXAMPLE_CONTENT_TR.metin.etsy.description, renk: 'border-l-rd-success-700' },
      { ikon: 'bookmark', baslik: 'Tags', icerik: EXAMPLE_CONTENT_TR.metin.etsy.tags.join(', '), renk: 'border-l-rd-primary-300' },
    ],
  },
}

function BolumIkon({ ikon }: { ikon: string }) {
  if (ikon === 'pin') return <Tag size={14} strokeWidth={1.5} className="text-rd-neutral-600 flex-shrink-0" />
  if (ikon === 'bookmark') return <Hash size={14} strokeWidth={1.5} className="text-rd-neutral-600 flex-shrink-0" />
  if (ikon === 'filetext') return <FileText size={14} strokeWidth={1.5} className="text-rd-neutral-600 flex-shrink-0" />
  return <span className="w-2 h-2 rounded-full bg-rd-neutral-200 flex-shrink-0 mt-1" />
}

// ---- Panels ----

function MetinPanel({ market, setMarket }: { market: MarketId; setMarket: (m: MarketId) => void }) {
  const renkMap: Record<MarketId, string> = {
    trendyol: market === 'trendyol' ? 'bg-orange-500 text-white' : 'bg-rd-neutral-100 text-rd-neutral-600 hover:bg-rd-neutral-200',
    amazon: market === 'amazon' ? 'bg-[#E47911] text-white' : 'bg-rd-neutral-100 text-rd-neutral-600 hover:bg-rd-neutral-200',
    etsy: market === 'etsy' ? 'bg-rose-500 text-white' : 'bg-rd-neutral-100 text-rd-neutral-600 hover:bg-rd-neutral-200',
  }
  return (
    <div>
      <p className="text-sm text-rd-neutral-600 mb-4 leading-relaxed">
        Her pazaryerinin kendine özel karakter limiti, format kuralları ve yasaklı kelimeleri var.
        yzliste bunları bilir — platforma özel başlık, madde madde özellikler, SEO uyumlu açıklama
        ve arama etiketleri üretir.
      </p>
      <p className="text-xs text-rd-neutral-500 mb-2">
        <strong className="font-medium text-rd-neutral-700">Örnek:</strong> Aynı üründen 3 pazaryeri için üretilmiş — formatların farkını gör.
      </p>
      <div className="flex gap-2 mb-1">
        {(Object.keys(platformVerileriInfoStrip) as MarketId[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setMarket(key)}
            className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', renkMap[key])}
          >
            {platformVerileriInfoStrip[key].etiket}
          </button>
        ))}
      </div>
      <p className="text-xs text-rd-neutral-500 mb-4">{platformVerileriInfoStrip[market].aciklamaKisa}</p>
      <div className="space-y-3">
        {platformVerileriInfoStrip[market].bolumler.map((bolum, i) => (
          <div key={i} className={cn('rounded-xl border-l-4', bolum.renk, 'border border-rd-neutral-200 bg-white p-4')}>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-rd-neutral-900">
                <BolumIkon ikon={bolum.ikon} />
                {bolum.baslik}
              </span>
              <KopyalaButon metin={bolum.icerik} />
            </div>
            <p className="text-sm text-rd-neutral-600 leading-relaxed whitespace-pre-line">{bolum.icerik}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-5 border-t border-rd-neutral-200 flex flex-wrap gap-3 text-xs text-rd-neutral-600">
        {['Manuel metin girişi', 'Fotoğraftan otomatik analiz', 'Barkod ile ürün tanıma', '7 platform desteği'].map((f) => (
          <span key={f} className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-rd-primary-50 text-rd-primary-700 flex items-center justify-center">
              <Check size={9} strokeWidth={2} />
            </span>
            {f}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-rd-primary-50 border border-rd-primary-200 p-3 text-xs text-rd-primary-700 leading-relaxed">
        Her pazaryerinin kuralları farklı. <strong className="font-semibold">Örnek:</strong> Trendyol max 100 karakter başlık ister,
        Amazon 200&apos;e kadar keyword kabul eder, Etsy İngilizce + hikaye anlatımı sever.
        yzliste hepsini tek fotoğraftan üretir.
      </div>
      <div className="mt-6 pt-5 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=metin" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Listing metni üret →
        </a>
      </div>
    </div>
  )
}

function GorselPanel() {
  return (
    <div>
      <p className="text-sm text-rd-neutral-600 mb-4 leading-relaxed">
        Tek bir ürün fotoğrafından profesyonel stüdyo görselleri oluşturun.
        Arka plan otomatik temizlenir, 7 farklı stüdyo stilinden seçin —
        ya da sahnenizi anlatın, kendi fonunuzu yükleyin.
      </p>
      <p className="text-sm font-semibold text-rd-neutral-900 mb-1">Tek fotoğraftan 7 farklı stüdyo stili</p>
      <p className="text-xs text-rd-neutral-500 mb-5">Stil başına 1 kredi · Üretimde düşer, indirme bedava</p>
      {/* 1. satır: ham + 3 stil */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col">
          <div className="relative rounded-xl overflow-hidden border border-rd-neutral-200 bg-rd-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ornek_once.jpg" alt="önce" className="w-full aspect-square object-contain" loading="lazy" />
            <div className="absolute top-2 left-2">
              <span className="bg-rd-neutral-900/80 text-white text-xs px-2 py-1 rounded-full">Ham fotoğraf</span>
            </div>
          </div>
          <div className="bg-rd-danger-50 rounded-lg p-2 border border-rd-danger-200 mt-2">
            <p className="text-xs text-rd-danger-700 font-medium flex items-center gap-1">
              <X size={10} strokeWidth={2} />
              Dağınık arka plan
            </p>
          </div>
        </div>
        {[
          { src: '/ornek_beyaz.jpg', etiket: 'Beyaz zemin' },
          { src: '/ornek_koyu.jpg', etiket: 'Koyu zemin' },
          { src: '/ornek_lifestyle.jpg', etiket: 'Lifestyle' },
        ].map((item) => (
          <div key={item.etiket} className="flex flex-col">
            <div className="rounded-xl overflow-hidden border border-rd-primary-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" loading="lazy" />
            </div>
            <p className="text-xs text-rd-neutral-600 font-medium text-center mt-1.5">{item.etiket}</p>
          </div>
        ))}
      </div>
      {/* 2. satır: 4 stil daha */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        {[
          { src: '/ornek_mermer.jpg', etiket: 'Mermer' },
          { src: '/ornek_ahsap.jpg', etiket: 'Ahşap' },
          { src: '/ornek_gradient.jpg', etiket: 'Gradient' },
          { src: '/ornek_dogal.jpg', etiket: 'Doğal' },
        ].map((item) => (
          <div key={item.etiket} className="flex flex-col">
            <div className="rounded-xl overflow-hidden border border-rd-primary-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" loading="lazy" />
            </div>
            <p className="text-xs text-rd-neutral-600 font-medium text-center mt-1.5">{item.etiket}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-5 border-t border-rd-neutral-200">
        <p className="text-xs text-rd-neutral-600 font-semibold mb-2">3 farklı yöntemle sahne oluştur:</p>
        <div className="flex flex-wrap gap-2">
          {['Hazır stiller (Beyaz, Koyu…)', 'Kendi promptunu yaz', 'Arka plan fotoğrafı ver'].map((t, i) => (
            <span key={i} className="text-xs bg-rd-primary-50 text-rd-primary-700 px-3 py-1 rounded-full border border-rd-primary-200">{i + 1}. {t}</span>
          ))}
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=gorsel" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Stüdyo görseli üret →
        </a>
      </div>
    </div>
  )
}

function VideoPanel() {
  return (
    <div>
      <p className="text-sm text-rd-neutral-600 mb-4 leading-relaxed">
        Ürün fotoğrafınızdan AI ile tanıtım videosu oluşturun. 6 ön tanımlı hareket
        stilinden seçin ya da kendi yönetmenliğinizi yapın — Reels, TikTok,
        YouTube ve pazaryeri formatlarında.
      </p>
      <p className="text-sm font-semibold text-rd-neutral-900 mb-1">Ürün fotoğrafından tanıtım videosu</p>
      <p className="text-xs text-rd-neutral-500 mb-5">Ürünü hareket ettiren, platform uyumlu dikey/kare video — MP4 olarak indir</p>
      {/* 6 video kartı 2-kolon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {[
          { src: '/video-ornekler/360-donus.mp4', Ikon: RotateCw, baslik: '360° Dönüş', aciklama: 'Ürün kendi ekseni etrafında döner. Tüm açılar görünür. Takı, aksesuar, elektronik için ideal.' },
          { src: '/video-ornekler/zoom-yaklasim.mp4', Ikon: ZoomIn, baslik: 'Zoom yaklaşım', aciklama: 'Kamera ürüne doğru yaklaşır. Doku ve detay hissi. El yapımı ve tekstil ürünler için güçlü.' },
          { src: '/video-ornekler/dramatik-isik.mp4', Ikon: Lightbulb, baslik: 'Dramatik ışık', aciklama: 'Karanlık sahnede spotlight açılır. Premium ve lüks his. Kozmetik ve elektronik için etkili.' },
          { src: '/video-ornekler/dogal-ortam.mp4', Ikon: Leaf, baslik: 'Doğal ortam', aciklama: 'Yapraklar sallanır, ışık oynar. Organik ve sıcak his. Gıda, bitki, doğal ürünler için ideal.' },
          { src: '/video-ornekler/detay-tarama.mp4', Ikon: ScanSearch, baslik: 'Detay tarama', aciklama: 'Kamera yüzeyi soldan sağa tarar. Doku, işçilik, malzeme kalitesi ortaya çıkar. Elektronik ve deri ürünler için güçlü.' },
          { src: '/video-ornekler/kumas-hareketi.mp4', Ikon: Wind, baslik: 'Kumaş hareketi', aciklama: 'Hafif esinti kumaşı hareket ettirir. Döküm ve akışkanlık hissi verir. Elbise, şal, perde için ideal.' },
        ].map((v, i) => (
          <div key={i} className="flex gap-3 rounded-xl border border-rd-neutral-200 bg-white p-3">
            <video
              src={v.src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-rd-neutral-200"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-rd-neutral-900 mb-1 flex items-center gap-1.5">
                <v.Ikon size={13} strokeWidth={1.5} className="text-rd-neutral-600" />
                {v.baslik}
              </p>
              <p className="text-xs text-rd-neutral-500 leading-relaxed">{v.aciklama}</p>
            </div>
          </div>
        ))}
      </div>
      {/* 3 özellik kartı */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { Ikon: Timer, baslik: '5 saniyelik', aciklama: 'Story · Reels', etiket: '10 kredi' },
          { Ikon: Film, baslik: '10 saniyelik', aciklama: 'Showcase · Pazaryeri', etiket: '20 kredi' },
          { Ikon: Columns2, baslik: '3 format', aciklama: '9:16 · 1:1 · 16:9', etiket: 'Tüm platformlar' },
        ].map((v, i) => (
          <div key={i} className="rounded-xl border border-rd-neutral-200 bg-white p-3 text-center">
            <v.Ikon size={20} strokeWidth={1.5} className="text-rd-neutral-600 mx-auto mb-1" />
            <p className="text-xs font-semibold text-rd-neutral-900">{v.baslik}</p>
            <p className="text-xs text-rd-neutral-500 mb-1">{v.aciklama}</p>
            <span className="text-xs font-medium text-rd-primary-700 bg-white border border-rd-primary-200 px-1.5 py-0.5 rounded-full">{v.etiket}</span>
          </div>
        ))}
      </div>
      {/* Nasıl çalışır */}
      <div className="bg-white border border-rd-neutral-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-rd-neutral-600 mb-2">Nasıl çalışır?</p>
        <div className="space-y-1.5">
          {['Ürün fotoğrafını yükle', 'Süre ve format seç', 'AI ürünü animasyonlu videoya dönüştürür (~2 dk)', 'MP4 olarak indir, platforma yükle'].map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-rd-neutral-600">
              <span className="w-4 h-4 rounded-full bg-rd-primary-50 text-rd-primary-700 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=video" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Ürün videosu üret →
        </a>
      </div>
    </div>
  )
}

function SosyalPanel() {
  const igCaption = EXAMPLE_CONTENT.sosyal.instagram.caption
  const igHashtags = EXAMPLE_CONTENT.sosyal.instagram.hashtags.join(' ')
  const twCaption = 'FIBA onaylı 7 numara basketbol topu, hediye kuru pompa ile — sahaya çıkmaya hazır mısın? Antrenman ve maç için profesyonel kalite. #basketbol #spor'
  return (
    <div>
      <p className="text-sm text-rd-neutral-600 mb-4 leading-relaxed">
        Her platform için ayrı formatta caption ve hashtag seti üretin.
        Instagram, TikTok, Facebook ve X — hepsi tek tıkla.
      </p>
      <p className="text-sm font-semibold text-rd-neutral-900 mb-1">Platform uyumlu caption + hashtag seti</p>
      <p className="text-xs text-rd-neutral-500 mb-5">Instagram, TikTok, Facebook, Twitter/X — her platform için ayrı format · 1 kredi</p>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['Instagram', 'TikTok', 'Facebook', 'Twitter/X'].map((p) => (
          <span key={p} className="text-xs bg-rd-success-50 text-rd-success-700 border border-rd-success-200 px-3 py-1 rounded-full font-medium">{p}</span>
        ))}
      </div>
      <div className="space-y-3">
        <div className="rounded-xl border border-rd-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rd-neutral-600 flex items-center gap-1.5">
              <Camera size={13} strokeWidth={1.5} />
              Instagram Caption
            </span>
            <KopyalaButon metin={igCaption} />
          </div>
          <p className="text-sm text-rd-neutral-600 leading-relaxed whitespace-pre-line">{igCaption}</p>
        </div>
        <div className="rounded-xl border border-rd-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rd-neutral-600 flex items-center gap-1.5">
              <Tag size={13} strokeWidth={1.5} />
              Hashtag Seti
            </span>
            <KopyalaButon metin={igHashtags} />
          </div>
          <p className="text-sm text-rd-success-700 leading-relaxed">{igHashtags}</p>
        </div>
        <div className="rounded-xl border border-rd-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rd-neutral-600">Twitter/X (280 karakter)</span>
            <KopyalaButon metin={twCaption} />
          </div>
          <p className="text-sm text-rd-neutral-600 leading-relaxed">{twCaption}</p>
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=sosyal" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Sosyal içerik üret →
        </a>
      </div>
    </div>
  )
}

// ---- InfoStrip ----

export function InfoStrip() {
  const [activeTab, setActiveTab] = useState<TabId>('metin')
  const [detailOpen, setDetailOpen] = useState(false)
  const [activeMarket, setActiveMarket] = useState<MarketId>('trendyol')

  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab)
    if (!detailOpen) setDetailOpen(true)
  }

  const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label ?? ''

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <div className="flex mb-3">
          <Eyebrow color="accent" className="bg-rd-accent-50 px-3.5 py-1.5 rounded-full">
            İÇERİK TÜRLERİ
          </Eyebrow>
        </div>
        <h2 className="font-rd-display text-3xl md:text-4xl text-rd-neutral-900 font-bold tracking-[-0.01em]">
          4 içerik türü, 7 pazaryeri için
        </h2>
        <p className="text-sm text-rd-neutral-500 mt-1.5 leading-relaxed max-w-[520px]">
          Her tür ayrı kredi · birini, birkaçını veya hepsini birden seçebilirsin. Pazaryeri
          kuralı otomatik uygulanır.
        </p>
      </div>

      {/* 4 content type tabs — always visible */}
      <div
        role="tablist"
        aria-label="İçerik türü seçimi"
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls="infostrip-detail"
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'flex flex-col items-start gap-2 p-3 rounded-xl border transition-all duration-200 text-left',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-300',
                isActive
                  ? 'bg-rd-primary-50 border-2 border-rd-primary-700 text-rd-primary-700'
                  : 'border-rd-neutral-200 bg-white text-rd-neutral-600 hover:border-rd-primary-300 hover:bg-rd-neutral-50',
              )}
            >
              <Icon
                size={18}
                strokeWidth={1.5}
                aria-hidden="true"
                className={isActive ? 'text-rd-primary-700' : 'text-rd-neutral-400'}
              />
              <span
                className={cn('text-sm font-medium', isActive ? 'text-rd-primary-700' : 'text-rd-neutral-700')}
              >
                {tab.label}
              </span>
              <p className="text-xs text-rd-neutral-500 leading-relaxed">
                {tab.description}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'text-xs font-medium px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'bg-rd-primary-100 text-rd-primary-800'
                      : 'bg-rd-neutral-100 text-rd-neutral-500',
                  )}
                >
                  {tab.kredi}
                </span>
                <span className="text-xs text-rd-neutral-400">{tab.sure}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Toggle — 4 kartın altında, ortalı */}
      <div className="flex justify-center mt-4 mb-2">
        <button
          onClick={() => setDetailOpen((o) => !o)}
          aria-expanded={detailOpen}
          aria-controls="infostrip-detail"
          className="flex items-center gap-1.5 text-sm text-rd-neutral-600 hover:text-rd-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-300 rounded px-2 py-1"
        >
          <span>{detailOpen ? 'Detayı kapat' : 'Detaya bak'}</span>
          <ChevronDown
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className={cn('transition-transform duration-200', detailOpen && 'rotate-180')}
          />
        </button>
      </div>

      {/* Detail area */}
      {detailOpen && (
        <div
          id="infostrip-detail"
          role="tabpanel"
          aria-label={`${activeTabLabel} içerik türü detayı`}
          className="mt-4 rounded-xl border border-rd-neutral-200 bg-rd-neutral-100 p-5 md:p-6"
        >
          {/* Panel */}
          {activeTab === 'metin' && <MetinPanel market={activeMarket} setMarket={setActiveMarket} />}
          {activeTab === 'gorsel' && <GorselPanel />}
          {activeTab === 'video' && <VideoPanel />}
          {activeTab === 'sosyal' && <SosyalPanel />}
        </div>
      )}
    </div>
  )
}
