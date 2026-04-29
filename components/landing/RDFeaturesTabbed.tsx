'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Check, FileText, X,
  ZoomIn, RotateCw, Lightbulb, Leaf, ScanSearch, Wind,
  Timer, Film, Columns2, Camera, Tag, Hash, Clapperboard, Share2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EXAMPLE_CONTENT_TR } from '@/lib/data/exampleContent'

type PlatformKey = 'trendyol' | 'amazon' | 'etsy'

const PLATFORM_CONF: Record<PlatformKey, {
  etiket: string
  aciklamaKisa: string
  renk: string
  borderTitle: string
  borderDesc: string
  borderTags: string
}> = {
  trendyol: {
    etiket: 'Trendyol',
    aciklamaKisa: 'Max 100 karakter başlık · Türkçe · Keyword-yoğun',
    renk: 'bg-orange-500 text-white',
    borderTitle: 'border-l-orange-400',
    borderDesc: 'border-l-rd-success-700',
    borderTags: 'border-l-rd-primary-300',
  },
  amazon: {
    etiket: 'Amazon TR',
    aciklamaKisa: 'Max 200 karakter başlık · A+ bullet · Keyword-stuffed',
    renk: 'bg-[#E47911] text-white',
    borderTitle: 'border-l-[#E47911]',
    borderDesc: 'border-l-rd-success-700',
    borderTags: 'border-l-rd-primary-300',
  },
  etsy: {
    etiket: 'Etsy',
    aciklamaKisa: 'İngilizce · Hikaye anlatımı · Handmade & artisan vurgusu',
    renk: 'bg-rose-500 text-white',
    borderTitle: 'border-l-rose-400',
    borderDesc: 'border-l-rd-success-700',
    borderTags: 'border-l-rd-primary-300',
  },
}

const KUTULAR = [
  { idx: 0, Ikon: FileText, baslik: 'Listing Metni', aciklama: 'Başlık, özellikler, açıklama, etiketler', kredi: '1 kredi' },
  { idx: 1, Ikon: Camera, baslik: 'Görsel', aciklama: '7 stil, stil başına 1 görsel', kredi: 'Stil başına 1 kredi' },
  { idx: 2, Ikon: Clapperboard, baslik: 'Video', aciklama: 'Ürün tanıtım videosu, 1080p', kredi: '5sn veya 10sn' },
  { idx: 3, Ikon: Share2, baslik: 'Sosyal Medya', aciklama: 'Caption + hashtag, tüm platformlar', kredi: '1 kredi / platform · Kit: 3 kredi' },
]

const GORSEL_STILLER = [
  { src: '/ornek_beyaz.jpg', etiket: 'Beyaz zemin' },
  { src: '/ornek_koyu.jpg', etiket: 'Koyu zemin' },
  { src: '/ornek_lifestyle.jpg', etiket: 'Lifestyle' },
  { src: '/ornek_mermer.jpg', etiket: 'Mermer' },
  { src: '/ornek_ahsap.jpg', etiket: 'Ahşap' },
  { src: '/ornek_gradient.jpg', etiket: 'Gradient' },
  { src: '/ornek_dogal.jpg', etiket: 'Doğal' },
]

const VIDEO_ORNEKLER = [
  { Ikon: RotateCw, baslik: '360° Dönüş', aciklama: 'Ürün kendi ekseni etrafında döner. Tüm açılar görünür. Takı, aksesuar, elektronik için ideal.' },
  { Ikon: ZoomIn, baslik: 'Zoom yaklaşım', aciklama: 'Kamera ürüne doğru yaklaşır. Doku ve detay hissi. El yapımı ve tekstil ürünler için güçlü.' },
  { Ikon: Lightbulb, baslik: 'Dramatik ışık', aciklama: 'Karanlık sahnede spotlight açılır. Premium ve lüks his. Kozmetik ve elektronik için etkili.' },
  { Ikon: Leaf, baslik: 'Doğal ortam', aciklama: 'Yapraklar sallanır, ışık oynar. Organik ve sıcak his. Gıda, bitki, doğal ürünler için ideal.' },
  { Ikon: ScanSearch, baslik: 'Detay tarama', aciklama: 'Kamera yüzeyi soldan sağa tarar. Doku, işçilik, malzeme kalitesi ortaya çıkar. Elektronik ve deri ürünler için güçlü.' },
  { Ikon: Wind, baslik: 'Kumaş hareketi', aciklama: 'Hafif esinti kumaşı hareket ettirir. Döküm ve akışkanlık hissi verir. Elbise, şal, perde için ideal.' },
]

const SOSYAL_PLATFORMLAR = ['Instagram', 'TikTok', 'Facebook', 'Twitter/X'] as const
type SosyalPlatform = typeof SOSYAL_PLATFORMLAR[number]

const SOSYAL_CONTENT: Record<SosyalPlatform, { caption: string; hashtag: string }> = {
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

function BolumIkon({ ikon }: { ikon: string }) {
  if (ikon === 'pin') return <Tag size={14} strokeWidth={1.5} className="text-rd-neutral-500 shrink-0" />
  if (ikon === 'hash') return <Hash size={14} strokeWidth={1.5} className="text-rd-neutral-500 shrink-0" />
  if (ikon === 'filetext') return <FileText size={14} strokeWidth={1.5} className="text-rd-neutral-500 shrink-0" />
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

function bolumIcerigi(key: string, platform: PlatformKey): string {
  const data = platform === 'etsy'
    ? EXAMPLE_CONTENT_TR.metin.etsy
    : platform === 'amazon'
    ? EXAMPLE_CONTENT_TR.metin.amazon
    : EXAMPLE_CONTENT_TR.metin.trendyol

  if (key === 'title') return data.title
  if (key === 'description') return data.description
  if (key === 'features') return (data.features as readonly string[]).join('\n')
  if (key === 'tags') return (data.tags as readonly string[]).join(', ')
  return ''
}

// ---- VideoPanel ----

function VideoPanel() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.playbackRate = 2.0
    })
  }, [])

  return (
    <div className="p-5 sm:p-7">
      <p className="text-sm text-rd-neutral-600 mb-4">
        Ürün fotoğrafınızdan AI ile tanıtım videosu oluşturun. 6 ön tanımlı hareket stilinden seçin ya da kendi yönetmenliğinizi yapın — Reels, TikTok, YouTube ve pazaryeri formatlarında.
      </p>
      <p className="text-sm font-medium text-rd-neutral-900 mb-1">Ürün fotoğrafından tanıtım videosu</p>
      <p className="text-xs text-rd-neutral-400 mb-5">Ürünü hareket ettiren, platform uyumlu dikey/kare video — MP4 olarak indir</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {VIDEO_ORNEKLER.map((v, i) => (
          <div key={i} className="flex gap-3 rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-3">
            <video
              ref={(el) => { videoRefs.current[i] = el }}
              src="/video-ornekler/zoom-yaklasim.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-24 h-24 rounded-lg object-cover shrink-0 bg-rd-neutral-900"
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
        ].map((item, i) => (
          <div key={i} className="rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-3 text-center">
            <item.Ikon size={20} strokeWidth={1.5} className="text-rd-neutral-500 mx-auto mb-1" />
            <p className="text-xs font-medium text-rd-neutral-900">{item.baslik}</p>
            <p className="text-[10px] text-rd-neutral-400 mb-1">{item.aciklama}</p>
            <span className="text-[10px] font-medium text-rd-primary-700 bg-white border border-rd-primary-200 px-1.5 py-0.5 rounded-full">{item.etiket}</span>
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

// ---- RDFeaturesTabbed ----

export function RDFeaturesTabbed() {
  const [ozellikTab, setOzellikTab] = useState(0)
  const [platformTab, setPlatformTab] = useState<PlatformKey>('trendyol')
  const [sosyalPlatform, setSosyalPlatform] = useState<SosyalPlatform>('Instagram')

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      const map: Record<string, number> = {
        '#arac-metin': 0,
        '#arac-gorsel': 1,
        '#arac-video': 2,
        '#arac-sosyal': 3,
      }
      if (hash in map) {
        setOzellikTab(map[hash])
        setTimeout(() => {
          document.getElementById('araclar')?.scrollIntoView({ behavior: 'smooth' })
          history.replaceState(null, '', window.location.pathname)
        }, 100)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const pc = platformTab ? PLATFORM_CONF[platformTab] : null
  const sosyalContent = SOSYAL_CONTENT[sosyalPlatform]

  const BOLUMLER = [
    { ikon: 'pin', baslik: 'Başlık', key: 'title', borderL: pc?.borderTitle ?? 'border-l-rd-primary-400' },
    { ikon: 'bullet', baslik: 'Özellikler', key: 'features', borderL: pc?.borderTitle ?? 'border-l-orange-300' },
    { ikon: 'filetext', baslik: 'Açıklama', key: 'description', borderL: pc?.borderDesc ?? 'border-l-rd-success-700' },
    { ikon: 'hash', baslik: 'Etiketler', key: 'tags', borderL: pc?.borderTags ?? 'border-l-rd-primary-300' },
  ]

  return (
    <div id="araclar">
      {/* 4 sekme kutu */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-0">
        {KUTULAR.map((k) => (
          <button
            key={k.idx}
            type="button"
            onClick={() => setOzellikTab(k.idx)}
            className={cn(
              'cursor-pointer text-left rounded-xl border overflow-hidden transition-all',
              ozellikTab === k.idx
                ? 'border-rd-primary-700 border-b-0 rounded-b-none bg-rd-primary-50 z-10'
                : 'border-rd-neutral-200 bg-white hover:border-rd-primary-300 mb-0',
            )}
          >
            <div className="px-4 pt-5 pb-4">
              <div className="mb-3">
                <k.Ikon size={22} strokeWidth={1.5} className="text-rd-primary-700" />
              </div>
              <p className="font-medium text-rd-neutral-900 text-sm">{k.baslik}</p>
              <p className="text-xs text-rd-neutral-400 mt-1 leading-snug">{k.aciklama}</p>
              <span className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full text-rd-primary-700 bg-rd-primary-50 border border-rd-primary-200">
                {k.kredi}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab içerik alanı */}
      <div className="bg-rd-primary-50 rounded-xl rounded-tl-none border border-rd-primary-700 overflow-hidden mt-0">

        {/* --- Listing Metni --- */}
        {ozellikTab === 0 && (
          <div className="p-5 sm:p-7">
            <p className="text-sm text-rd-neutral-600 mb-4">
              Her pazaryerinin kendine özel karakter limiti, format kuralları ve yasaklı kelimeleri var. yzliste bunları bilir — platforma özel başlık, madde madde özellikler, SEO uyumlu açıklama ve arama etiketleri üretir.
            </p>
            <div className="flex gap-2 mb-1">
              {(Object.keys(PLATFORM_CONF) as PlatformKey[]).map((key) => {
                const aktif = platformTab === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPlatformTab(key)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                      aktif
                        ? PLATFORM_CONF[key].renk
                        : 'bg-rd-neutral-100 text-rd-neutral-500 hover:bg-rd-neutral-100 hover:text-rd-neutral-900',
                    )}
                  >
                    {PLATFORM_CONF[key].etiket}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-rd-neutral-400 mb-4">{PLATFORM_CONF[platformTab].aciklamaKisa}</p>
            <div className="space-y-3">
              {BOLUMLER.map((bolum) => {
                const icerik = bolumIcerigi(bolum.key, platformTab)
                return (
                  <div key={bolum.key} className={cn('rounded-xl border-l-4', bolum.borderL, 'border border-rd-neutral-200 bg-rd-neutral-50 p-4')}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-rd-neutral-900">
                        <BolumIkon ikon={bolum.ikon} />
                        {bolum.baslik}
                      </span>
                      <KopyalaButon metin={icerik} />
                    </div>
                    <p className="text-sm text-rd-neutral-600 leading-relaxed whitespace-pre-line">{icerik}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-rd-neutral-200 flex flex-wrap gap-3 text-xs text-rd-neutral-500">
              {['Manuel metin girişi', 'Fotoğraftan otomatik analiz', 'Barkod ile ürün tanıma', '7 platform desteği'].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-rd-primary-50 text-rd-primary-700 flex items-center justify-center">
                    <Check size={9} strokeWidth={2} />
                  </span>
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-rd-primary-50 border border-rd-primary-200 p-3 text-[11px] text-rd-primary-800 leading-relaxed">
              <strong>Her pazaryerinin kuralları farklı:</strong> Trendyol max 100 karakter başlık ister, Amazon 200&apos;e kadar keyword kabul eder, Etsy İngilizce + hikaye anlatımı sever. yzliste hepsini tek fotoğraftan üretir.
            </div>
            <div className="mt-5 pt-4 border-t border-rd-neutral-200 text-center">
              <a href="/uret?tab=metin" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
                Listing metni üret →
              </a>
            </div>
          </div>
        )}

        {/* --- Görsel --- */}
        {ozellikTab === 1 && (
          <div className="p-5 sm:p-7">
            <p className="text-sm text-rd-neutral-600 mb-4">
              Tek bir ürün fotoğrafından profesyonel stüdyo görselleri oluşturun. Arka plan otomatik temizlenir, 7 farklı stüdyo stilinden seçin — ya da sahnenizi anlatın, kendi fonunuzu yükleyin.
            </p>
            <p className="text-sm font-medium text-rd-neutral-900 mb-1">Tek fotoğraftan 7 farklı stüdyo stili</p>
            <p className="text-xs text-rd-neutral-400 mb-5">Stil başına 1 kredi · Üretimde düşer, indirme bedava</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Ham fotoğraf — özel treatment */}
              <div className="flex flex-col">
                <div className="relative rounded-xl overflow-hidden border border-rd-neutral-300 bg-rd-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/ornek_once.jpg" alt="önce" className="w-full aspect-square object-contain" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-rd-neutral-900/80 text-white text-[10px] px-2 py-1 rounded-full">Ham fotoğraf</span>
                  </div>
                </div>
                <div className="bg-rd-danger-50 rounded-lg p-2 border border-rd-danger-600/20 mt-2">
                  <p className="text-[11px] text-rd-danger-700 font-medium flex items-center gap-1">
                    <X size={10} strokeWidth={2} />
                    Dağınık arka plan
                  </p>
                </div>
              </div>
              {/* İlk 3 stil */}
              {GORSEL_STILLER.slice(0, 3).map((item) => (
                <div key={item.etiket} className="flex flex-col">
                  <div className="rounded-xl overflow-hidden border border-rd-primary-200 bg-rd-neutral-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
                  </div>
                  <p className="text-[11px] text-rd-neutral-500 font-medium text-center mt-1.5">{item.etiket}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {GORSEL_STILLER.slice(3).map((item) => (
                <div key={item.etiket} className="flex flex-col">
                  <div className="rounded-xl overflow-hidden border border-rd-primary-200 bg-rd-neutral-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
                  </div>
                  <p className="text-[11px] text-rd-neutral-500 font-medium text-center mt-1.5">{item.etiket}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-rd-neutral-200">
              <p className="text-xs text-rd-neutral-500 font-medium mb-2">3 farklı yöntemle sahne oluştur:</p>
              <div className="flex flex-wrap gap-2">
                {['Hazır stiller (Beyaz, Koyu…)', 'Kendi promptunu yaz', 'Arka plan fotoğrafı ver'].map((t, i) => (
                  <span key={i} className="text-xs bg-rd-primary-50 text-rd-primary-700 px-3 py-1 rounded-full border border-rd-primary-200">{i + 1}. {t}</span>
                ))}
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-rd-neutral-200 text-center">
              <a href="/uret?tab=gorsel" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
                Stüdyo görseli üret →
              </a>
            </div>
          </div>
        )}

        {/* --- Video --- */}
        {ozellikTab === 2 && <VideoPanel />}

        {/* --- Sosyal Medya --- */}
        {ozellikTab === 3 && (
          <div className="p-5 sm:p-7">
            <p className="text-sm text-rd-neutral-600 mb-4">
              Her platform için ayrı formatta caption ve hashtag seti üretin. Instagram, TikTok, Facebook ve X — hepsi tek tıkla.
            </p>
            <p className="text-sm font-medium text-rd-neutral-900 mb-1">Platform uyumlu caption + hashtag seti</p>
            <p className="text-xs text-rd-neutral-400 mb-5">Instagram, TikTok, Facebook, Twitter/X — her platform için ayrı format · 1 kredi</p>
            <div className="flex gap-2 mb-4 flex-wrap">
              {SOSYAL_PLATFORMLAR.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSosyalPlatform(p)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    sosyalPlatform === p
                      ? 'border-rd-success-600 bg-rd-success-50 text-rd-success-700'
                      : 'border-rd-neutral-200 bg-white text-rd-neutral-500 hover:border-rd-success-600/50',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-rd-neutral-600 flex items-center gap-1.5">
                    <Camera size={13} strokeWidth={1.5} />
                    {sosyalPlatform} Caption
                  </span>
                  <KopyalaButon metin={sosyalContent.caption} />
                </div>
                <p className="text-sm text-rd-neutral-600 leading-relaxed whitespace-pre-line">{sosyalContent.caption}</p>
              </div>
              {sosyalContent.hashtag && (
                <div className="rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-rd-neutral-600 flex items-center gap-1.5">
                      <Tag size={13} strokeWidth={1.5} />
                      Hashtag seti
                    </span>
                    <KopyalaButon metin={sosyalContent.hashtag} />
                  </div>
                  <p className="text-sm text-rd-success-700 leading-relaxed">{sosyalContent.hashtag}</p>
                </div>
              )}
            </div>
            <div className="mt-5 pt-4 border-t border-rd-neutral-200 text-center">
              <a href="/uret?tab=sosyal" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
                Sosyal içerik üret →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
