import {
  Check,
  Zap,
  ImagePlus,
  FileText,
  Image as ImageIcon,
  PlayCircle,
  MessageSquare,
  Download,
} from 'lucide-react'
import StickerBadge from '@/components/primitives/StickerBadge'
import { HERO_BADGES } from '@/lib/constants/hero'

const OUTPUT_CARDS = [
  {
    icon: FileText,
    label: 'Listing',
    color: 'text-rd-primary-700',
    content: (
      <p className="text-[10px] text-slate-700 leading-snug line-clamp-2">
        Selin Porselen Çiçek Desenli Kahve Fincanı 6&apos;lı Set 80ml Altın Yaldızlı
      </p>
    ),
  },
  {
    icon: ImageIcon,
    label: 'Görsel',
    color: 'text-violet-600',
    content: (
      <div className="h-8 w-full rounded bg-slate-100 flex items-center justify-center">
        <ImageIcon size={14} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
      </div>
    ),
  },
  {
    icon: PlayCircle,
    label: 'Video',
    color: 'text-red-500',
    content: (
      <div className="h-8 w-full rounded bg-slate-800 flex items-center justify-center">
        <PlayCircle size={14} strokeWidth={1.5} className="text-white/70" aria-hidden="true" />
      </div>
    ),
  },
  {
    icon: MessageSquare,
    label: 'Sosyal',
    color: 'text-emerald-600',
    content: (
      <p className="text-[9px] text-slate-500 leading-snug line-clamp-2">
        Sabah kahvenizi daha özel kılacak bir set var. Selin Porselen&apos;in çiçek desenli fincan seti...
      </p>
    ),
  },
]

export default function AppScreenshotMockup() {
  return (
    <div className="relative animate-hero-float-in-right" role="img" aria-label="Uygulama önizlemesi">
      <StickerBadge
        icon={<Check size={14} strokeWidth={2} />}
        label={HERO_BADGES.topRight.label}
        color="#1E40AF"
        borderColor="#DBEAFE"
        className="hidden sm:flex sm:absolute sm:-top-3 sm:right-5 z-10"
      />
      <StickerBadge
        icon={<Zap size={14} strokeWidth={2} />}
        label={HERO_BADGES.bottomLeft.label}
        color="#EA580C"
        borderColor="#FED7AA"
        className="hidden sm:flex sm:absolute sm:-bottom-3 sm:-left-3 z-10"
      />

      {/* Browser chrome */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white [box-shadow:var(--shadow-rd-lg)]">
        {/* Browser top bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex flex-1 items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1">
            <span className="text-xs text-slate-400">yzliste.com/uret</span>
          </div>
        </div>

        {/* App content */}
        <div className="p-5">
          {/* INPUT: Compact input row */}
          <div
            className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
            aria-hidden="true"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50">
              <ImagePlus size={18} strokeWidth={1.5} className="text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-slate-700">
                Selin Porselen Çiçek Desenli Kahve Fincanı
              </p>
              <p className="mt-0.5 text-[9px] text-slate-400">
                Trendyol · Metin + Görsel + Video + Sosyal
              </p>
            </div>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check size={11} strokeWidth={2.5} className="text-emerald-600" />
            </div>
          </div>

          {/* AI Transform arrow */}
          <div className="mb-4 flex items-center gap-2" aria-hidden="true">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rd-primary">
              <Zap size={13} strokeWidth={2} className="text-white" />
            </div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* OUTPUT: 4 kartı 2x2 grid */}
          <div className="grid grid-cols-2 gap-2" aria-hidden="true">
            {OUTPUT_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="mb-1.5 flex items-center gap-1">
                    <Icon size={11} strokeWidth={1.5} className={card.color} aria-hidden="true" />
                    <span className={`text-[9px] font-medium ${card.color}`}>{card.label}</span>
                  </div>
                  {card.content}
                </div>
              )
            })}
          </div>

          {/* Download button */}
          <div
            className="mt-3 flex items-center justify-center gap-1.5 rounded-[10px] bg-rd-primary py-2.5"
            aria-hidden="true"
          >
            <Download size={13} strokeWidth={2} className="text-white" />
            <span className="text-sm font-medium text-white">4 dosyayı indir</span>
          </div>
        </div>
      </div>
    </div>
  )
}
