'use client'

import { useState } from 'react'
import { Check, FileText, Camera, Clapperboard, Share2, Tag, Hash, RotateCw, ZoomIn, Lightbulb, Leaf, ScanSearch, Wind, Timer, Film, Columns2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EXAMPLE_CONTENT_TR } from '@/lib/data/exampleContent'

type MainTab = 'metin' | 'gorsel' | 'video' | 'sosyal'
type PlatformKey = 'trendyol' | 'amazon' | 'etsy'

// ---- Veri ----

const MAIN_TABS = [
  {
    id: 'metin' as MainTab,
    Ikon: FileText,
    baslik: 'Listing Metni',
    aciklama: 'Başlık, özellikler, açıklama, etiketler',
    kredi: '1 kredi',
  },
  {
    id: 'gorsel' as MainTab,
    Ikon: Camera,
    baslik: 'Görsel',
    aciklama: '7 stil, stil başına 1 görsel',
    kredi: 'Stil başına 1 kredi',
  },
  {
    id: 'video' as MainTab,
    Ikon: Clapperboard,
    baslik: 'Video',
    aciklama: 'Ürün tanıtım videosu, 1080p',
    kredi: '5sn veya 10sn',
  },
  {
    id: 'sosyal' as MainTab,
    Ikon: Share2,
    baslik: 'Sosyal Medya',
    aciklama: 'Caption + hashtag, tüm platformlar',
    kredi: '1 kredi / platform',
  },
]

const PLATFORM_CONF: Record<PlatformKey, { etiket: string; aciklama: string; renk: string; borderL: string }> = {
  trendyol: {
    etiket: 'Trendyol',
    aciklama: 'Max 100 karakter başlık · Türkçe · Keyword-yoğun',
    renk: 'bg-orange-500 text-white',
    borderL: 'border-l-orange-400',
  },
  amazon: {
    etiket: 'Amazon TR',
    aciklama: 'Max 200 karakter başlık · A+ bullet · Keyword-stuffed',
    renk: 'bg-[#E47911] text-white',
    borderL: 'border-l-[#E47911]',
  },
  etsy: {
    etiket: 'Etsy',
    aciklama: 'İngilizce · Hikaye anlatımı · Handmade & artisan vurgusu',
    renk: 'bg-rose-500 text-white',
    borderL: 'border-l-rose-400',
  },
}

const BOLUMLER: { ikon: 'pin' | 'bullet' | 'filetext' | 'hash'; baslik: string; key: 'title' | 'features' | 'description' | 'tags'; borderL: string }[] = [
  { ikon: 'pin', baslik: 'Başlık', key: 'title', borderL: 'border-l-rd-primary-400' },
  { ikon: 'bullet', baslik: 'Özellikler', key: 'features', borderL: 'border-l-orange-300' },
  { ikon: 'filetext', baslik: 'Açıklama', key: 'description', borderL: 'border-l-rd-success-400' },
  { ikon: 'hash', baslik: 'Etiketler', key: 'tags', borderL: 'border-l-rd-primary-300' },
]

const GORSEL_STILLER = [
  { src: '/ornek_once.jpg', etiket: 'Ham fotoğraf', badge: true },
  { src: '/ornek_beyaz.jpg', etiket: 'Beyaz zemin' },
  { src: '/ornek_koyu.jpg', etiket: 'Koyu zemin' },
  { src: '/ornek_lifestyle.jpg', etiket: 'Lifestyle' },
  { src: '/ornek_mermer.jpg', etiket: 'Mermer' },
  { src: '/ornek_ahsap.jpg', etiket: 'Ahşap' },
  { src: '/ornek_gradient.jpg', etiket: 'Gradient' },
  { src: '/ornek_dogal.jpg', etiket: 'Doğal' },
]

const VIDEO_ORNEKLER = [
  { src: '/video-ornekler/360-donus.mp4', Ikon: RotateCw, baslik: '360° Dönüş', aciklama: 'Ürün kendi ekseni etrafında döner. Tüm açılar görünür.' },
  { src: '/video-ornekler/zoom-yaklasim.mp4', Ikon: ZoomIn, baslik: 'Zoom yaklaşım', aciklama: 'Kamera ürüne doğru yaklaşır. Doku ve detay hissi.' },
  { src: '/video-ornekler/dramatik-isik.mp4', Ikon: Lightbulb, baslik: 'Dramatik ışık', aciklama: 'Karanlık sahnede spotlight açılır. Premium his.' },
  { src: '/video-ornekler/dogal-ortam.mp4', Ikon: Leaf, baslik: 'Doğal ortam', aciklama: 'Yapraklar sallanır, ışık oynar. Sıcak his.' },
  { src: '/video-ornekler/detay-tarama.mp4', Ikon: ScanSearch, baslik: 'Detay tarama', aciklama: 'Kamera yüzeyi tarar. İşçilik ortaya çıkar.' },
  { src: '/video-ornekler/kumas-hareketi.mp4', Ikon: Wind, baslik: 'Kumaş hareketi', aciklama: 'Esinti hareketi. Döküm ve akışkanlık hissi.' },
]

const SOSYAL_PLATFORMLAR = ['Instagram', 'TikTok', 'Facebook', 'Twitter/X'] as const

const SOSYAL_CONTENT: Record<string, { caption: string; hashtag: string }> = {
  Instagram: {
    caption: 'Sahaya çıkmadan önce doğru top şart. 7 numara FIBA standardı, kompozit deri, kuru pompa hediyeli.\n\nAntrenman için, maç için, hediye için — kutudan çıkar çıkmaz hazır.',
    hashtag: '#basketbol #basketboltopu #spor #fibastandard #antrenman #okultakımı #sporhediye #kompozitderi',
  },
  TikTok: {
    caption: 'FIBA onaylı 7 numara top, hediye kuru pompa ile — sahaya çıkmaya hazır mısın?',
    hashtag: '#basketbol #spor #antrenman #trendyol #fyp',
  },
  Facebook: {
    caption: 'Profesyonel Basketbol Topu 7 Numara — FIBA onaylı, kompozit deri, hediye pompalı. Okul takımları ve hobi sporcular için ideal seçim.',
    hashtag: '#basketbol #spor #hediye',
  },
  'Twitter/X': {
    caption: 'FIBA onaylı 7 numara kompozit deri basketbol topu + kuru pompa hediye = sahaya hazır. #basketbol #spor',
    hashtag: '',
  },
}

// ---- Yardımcı componentler ----

function BolumIkon({ tip }: { tip: 'pin' | 'bullet' | 'filetext' | 'hash' }) {
  if (tip === 'pin') return <Tag size={13} strokeWidth={1.5} className="text-rd-neutral-500 shrink-0" />
  if (tip === 'hash') return <Hash size={13} strokeWidth={1.5} className="text-rd-neutral-500 shrink-0" />
  if (tip === 'filetext') return <FileText size={13} strokeWidth={1.5} className="text-rd-neutral-500 shrink-0" />
  return <span className="w-2 h-2 rounded-full bg-rd-neutral-300 shrink-0 mt-1" />
}

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
      onClick={handle}
      className="text-xs bg-white border border-rd-neutral-200 text-rd-neutral-500 hover:text-rd-neutral-800 px-2 py-0.5 rounded-lg transition-colors shrink-0"
    >
      {kopyalandi ? 'Kopyalandı' : 'Kopyala'}
    </button>
  )
}

function bolumIcerigi(bolum: typeof BOLUMLER[0], platform: PlatformKey): string {
  const data = platform === 'etsy'
    ? EXAMPLE_CONTENT_TR.metin.etsy
    : platform === 'amazon'
    ? EXAMPLE_CONTENT_TR.metin.amazon
    : EXAMPLE_CONTENT_TR.metin.trendyol

  if (bolum.key === 'title') return data.title
  if (bolum.key === 'description') return data.description
  if (bolum.key === 'features') return (data.features as readonly string[]).join('\n')
  if (bolum.key === 'tags') return (data.tags as readonly string[]).join(', ')
  return ''
}

// ---- Tab panels ----

function MetinPanel({ platform, setPlatform }: { platform: PlatformKey; setPlatform: (p: PlatformKey) => void }) {
  return (
    <div className="p-5 sm:p-7">
      <p className="text-sm text-rd-neutral-600 mb-4">
        Her pazaryerinin kendine özel karakter limiti, format kuralları ve yasaklı kelimeleri var. yzliste bunları bilir — platforma özel başlık, madde madde özellikler, SEO uyumlu açıklama ve arama etiketleri üretir.
      </p>

      {/* Platform sub-tabs */}
      <div className="flex gap-2 mb-1">
        {(Object.keys(PLATFORM_CONF) as PlatformKey[]).map((key) => {
          const aktif = platform === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPlatform(key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                aktif ? PLATFORM_CONF[key].renk : 'bg-rd-neutral-100 text-rd-neutral-500 hover:text-rd-neutral-800',
              )}
            >
              {PLATFORM_CONF[key].etiket}
            </button>
          )
        })}
      </div>
      <p className="text-[11px] text-rd-neutral-400 mb-4">{PLATFORM_CONF[platform].aciklama}</p>

      {/* Bölmeler */}
      <div className="space-y-3">
        {BOLUMLER.map((bolum) => {
          const icerik = bolumIcerigi(bolum, platform)
          return (
            <div key={bolum.key} className={cn('rounded-xl border-l-4', bolum.borderL, 'border border-rd-neutral-200 bg-rd-neutral-50 p-4')}>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-rd-neutral-900">
                  <BolumIkon tip={bolum.ikon} />
                  {bolum.baslik}
                </span>
                <KopyalaButon metin={icerik} />
              </div>
              <p className="text-sm text-rd-neutral-600 leading-relaxed whitespace-pre-line">{icerik}</p>
            </div>
          )
        })}
      </div>

      {/* Alt özellik çubuğu */}
      <div className="mt-5 pt-4 border-t border-rd-neutral-200 flex flex-wrap gap-3 text-xs text-rd-neutral-500">
        {['Manuel giriş', 'Foto analiz', 'Barkod tanıma', '7 platform'].map((f) => (
          <span key={f} className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-rd-primary-50 text-rd-primary-700 flex items-center justify-center">
              <Check size={9} strokeWidth={2} />
            </span>
            {f}
          </span>
        ))}
      </div>

      {/* Alt mavi kutu */}
      <div className="mt-4 rounded-xl bg-rd-primary-50 border border-rd-primary-200 p-3 text-[11px] text-rd-primary-800 leading-relaxed">
        <strong>Her pazaryerinin kuralları farklı:</strong> Trendyol max 100 karakter başlık ister, Amazon 200&apos;e kadar keyword kabul eder, Etsy İngilizce + hikaye anlatımı sever.
      </div>

      <div className="mt-5 pt-4 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=metin" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Listing metni üret →
        </a>
      </div>
    </div>
  )
}

function GorselPanel() {
  return (
    <div className="p-5 sm:p-7">
      <p className="text-sm text-rd-neutral-600 mb-4">
        Tek bir ürün fotoğrafından profesyonel stüdyo görselleri oluşturun. Arka plan otomatik temizlenir, 7 farklı stüdyo stilinden seçin — ya da sahnenizi anlatın, kendi fonunuzu yükleyin.
      </p>
      <p className="text-sm font-medium text-rd-neutral-900 mb-1">Tek fotoğraftan 7 farklı stüdyo stili</p>
      <p className="text-xs text-rd-neutral-400 mb-5">Stil başına 1 kredi · Üretimde düşer, indirme bedava</p>

      <div className="grid grid-cols-4 gap-2 mb-2">
        {GORSEL_STILLER.slice(0, 4).map((item) => (
          <div key={item.etiket} className="flex flex-col">
            <div className={cn('relative rounded-xl overflow-hidden border bg-rd-neutral-100', item.badge ? 'border-rd-neutral-300' : 'border-rd-primary-200')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
              {item.badge && (
                <div className="absolute top-1.5 left-1.5">
                  <span className="bg-rd-neutral-900/70 text-white text-[9px] px-1.5 py-0.5 rounded-full">Ham fotoğraf</span>
                </div>
              )}
            </div>
            <p className="text-[10px] text-rd-neutral-500 text-center mt-1 leading-tight">{item.etiket}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {GORSEL_STILLER.slice(4).map((item) => (
          <div key={item.etiket} className="flex flex-col">
            <div className="rounded-xl overflow-hidden border border-rd-primary-200 bg-rd-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
            </div>
            <p className="text-[10px] text-rd-neutral-500 text-center mt-1 leading-tight">{item.etiket}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-rd-neutral-200">
        <p className="text-xs text-rd-neutral-500 font-medium mb-2">3 farklı yöntemle sahne oluştur</p>
        <div className="flex flex-wrap gap-2">
          {['Hazır stiller (Beyaz, Koyu…)', 'Kendi promptunu yaz', 'Arka plan fotoğrafı ver'].map((t, i) => (
            <span key={i} className="text-xs bg-rd-primary-50 text-rd-primary-700 px-3 py-1 rounded-full border border-rd-primary-200">
              {i + 1}. {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=gorsel" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Stüdyo görseli üret →
        </a>
      </div>
    </div>
  )
}

function VideoPanel() {
  return (
    <div className="p-5 sm:p-7">
      <p className="text-sm text-rd-neutral-600 mb-4">
        Ürün fotoğrafınızdan AI ile tanıtım videosu oluşturun. 6 ön tanımlı hareket stilinden seçin ya da kendi yönetmenliğinizi yapın — Reels, TikTok, YouTube ve pazaryeri formatlarında.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {VIDEO_ORNEKLER.map((v, i) => (
          <div key={i} className="flex gap-3 rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-3">
            <video
              src={v.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-rd-neutral-900"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-rd-neutral-900 mb-1 flex items-center gap-1.5">
                <v.Ikon size={13} strokeWidth={1.5} className="text-rd-neutral-500" />
                {v.baslik}
              </p>
              <p className="text-[11px] text-rd-neutral-400 leading-relaxed">{v.aciklama}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { Ikon: Timer, baslik: '5 saniyelik', aciklama: 'Story · Reels', etiket: '10 kredi' },
          { Ikon: Film, baslik: '10 saniyelik', aciklama: 'Showcase · Pazaryeri', etiket: '20 kredi' },
          { Ikon: Columns2, baslik: '3 format', aciklama: '9:16 · 1:1 · 16:9', etiket: 'Tüm platformlar' },
        ].map((v, i) => (
          <div key={i} className="rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-3 text-center">
            <v.Ikon size={20} strokeWidth={1.5} className="text-rd-neutral-500 mx-auto mb-1" />
            <p className="text-xs font-medium text-rd-neutral-900">{v.baslik}</p>
            <p className="text-[10px] text-rd-neutral-400 mb-1">{v.aciklama}</p>
            <span className="text-[10px] font-medium text-rd-primary-700 bg-white border border-rd-primary-200 px-1.5 py-0.5 rounded-full">{v.etiket}</span>
          </div>
        ))}
      </div>

      <div className="bg-rd-neutral-100 rounded-xl p-4">
        <p className="text-xs font-medium text-rd-neutral-600 mb-2">Nasıl çalışır?</p>
        <div className="space-y-1.5">
          {['Ürün fotoğrafını yükle', 'Süre ve format seç', 'AI ürünü animasyonlu videoya dönüştürür (~2 dk)', 'MP4 olarak indir, platforma yükle'].map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-rd-neutral-600">
              <span className="w-4 h-4 rounded-full bg-rd-primary-50 text-rd-primary-700 flex items-center justify-center text-[9px] font-medium shrink-0 mt-0.5">{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=video" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Ürün videosu üret →
        </a>
      </div>
    </div>
  )
}

function SosyalPanel() {
  const [aktivPlatform, setAktivPlatform] = useState<typeof SOSYAL_PLATFORMLAR[number]>('Instagram')
  const content = SOSYAL_CONTENT[aktivPlatform]

  return (
    <div className="p-5 sm:p-7">
      <p className="text-sm text-rd-neutral-600 mb-4">
        Her platform için ayrı formatta caption ve hashtag seti üretin. Instagram, TikTok, Facebook ve X — hepsi tek tıkla.
      </p>

      <div className="flex gap-2 mb-5 flex-wrap">
        {SOSYAL_PLATFORMLAR.map((p) => (
          <button
            key={p}
            onClick={() => setAktivPlatform(p)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              aktivPlatform === p
                ? 'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700'
                : 'border-rd-neutral-200 bg-white text-rd-neutral-500 hover:border-rd-primary-300',
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-rd-neutral-600">{aktivPlatform} Caption</span>
            <KopyalaButon metin={content.caption} />
          </div>
          <p className="text-sm text-rd-neutral-600 leading-relaxed whitespace-pre-line">{content.caption}</p>
        </div>
        {content.hashtag && (
          <div className="rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-rd-neutral-600">Hashtag seti</span>
              <KopyalaButon metin={content.hashtag} />
            </div>
            <p className="text-sm text-rd-primary-700 leading-relaxed">{content.hashtag}</p>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=sosyal" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Sosyal içerik üret →
        </a>
      </div>
    </div>
  )
}

// ---- RDFeaturesTabbed ----

export function RDFeaturesTabbed() {
  const [aktifTab, setAktifTab] = useState<MainTab>('metin')
  const [platform, setPlatform] = useState<PlatformKey>('trendyol')

  return (
    <div>
      {/* 4 sekme kutu */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-0">
        {MAIN_TABS.map((tab) => {
          const aktif = aktifTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAktifTab(tab.id)}
              className={cn(
                'cursor-pointer text-left rounded-xl border overflow-hidden transition-all',
                aktif
                  ? 'border-rd-primary-700 border-b-0 rounded-b-none bg-rd-primary-50 z-10'
                  : 'border-rd-neutral-200 bg-white hover:border-rd-primary-300',
              )}
            >
              <div className="px-4 pt-5 pb-4">
                <div className="mb-3">
                  <tab.Ikon size={22} strokeWidth={1.5} className="text-rd-primary-700" />
                </div>
                <p className="font-medium text-rd-neutral-900 text-sm">{tab.baslik}</p>
                <p className="text-xs text-rd-neutral-400 mt-1 leading-snug">{tab.aciklama}</p>
                <span className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full text-rd-primary-700 bg-rd-primary-50 border border-rd-primary-200">
                  {tab.kredi}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Tab içerik alanı */}
      <div className="bg-rd-primary-50 rounded-xl rounded-tl-none border border-rd-primary-700 overflow-hidden mt-0">
        {aktifTab === 'metin' && <MetinPanel platform={platform} setPlatform={setPlatform} />}
        {aktifTab === 'gorsel' && <GorselPanel />}
        {aktifTab === 'video' && <VideoPanel />}
        {aktifTab === 'sosyal' && <SosyalPanel />}
      </div>
    </div>
  )
}
