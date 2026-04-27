// UA-02~09 — 3 Adımda Hazır Section

import {
  Clock,
  Camera,
  Pencil,
  ScanLine,
  FileText,
  Image as ImageIcon,
  Video,
  Share2,
  ImagePlus,
  Check,
} from 'lucide-react'
import SectionHeader from '@/components/primitives/SectionHeader'
import { UC_ADIM_STEPS, TOTAL_TIME } from '@/lib/constants/uc-adim'
import type { MockupType } from '@/lib/constants/uc-adim'

// ---- MiniMockup: Step 1 — Ürün bilgisi girişi ----

function InputMockup() {
  const methods = [
    { icon: Camera, label: 'Fotoğraf', selected: true },
    { icon: Pencil, label: 'Manuel', selected: false },
    { icon: ScanLine, label: 'Barkod', selected: false },
  ]

  return (
    // UA-09 a11y: role="img" + aria-label her mockup'ın kendi root div'inde
    <div
      className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[180px]"
      role="img"
      aria-label="Ürün yükleme ekranı"
    >
      {/* Input method selector */}
      <div className="flex gap-2 mb-4">
        {methods.map(({ icon: Icon, label, selected }) => (
          <div
            key={label}
            className={[
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border',
              selected
                ? 'border-rd-primary-200 bg-rd-primary-50 text-rd-primary'
                : 'border-slate-200 bg-white text-slate-500',
            ].join(' ')}
          >
            <Icon size={12} strokeWidth={2} aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>

      {/* Upload preview */}
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          <ImagePlus size={16} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-700 truncate">fincan_01.jpg</p>
          <p className="text-[10px] text-slate-400 mt-0.5">2.4 MB</p>
        </div>
      </div>
    </div>
  )
}

// ---- MiniMockup: Step 2 — Pazaryeri ve içerik seçimi ----

function SelectionMockup() {
  const platforms = [
    { label: 'Trendyol', selected: true, color: '#F27A1A' },
    { label: 'Amazon', selected: true, color: '#FF9900' },
    { label: 'Hepsiburada', selected: false },
    { label: 'N11', selected: false },
  ]

  const contentTypes = [
    { icon: FileText, label: 'Metin', selected: true, color: '#1E40AF', bg: '#EFF6FF' },
    { icon: ImageIcon, label: 'Görsel', selected: true, color: '#7C3AED', bg: '#F5F3FF' },
    { icon: Video, label: 'Video', selected: false, color: '#94A3B8', bg: '#F8FAFC' },
    { icon: Share2, label: 'Sosyal', selected: false, color: '#94A3B8', bg: '#F8FAFC' },
  ]

  return (
    // UA-09 a11y: role="img" + aria-label
    <div
      className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[180px] space-y-3"
      role="img"
      aria-label="Platform ve içerik seçimi"
    >
      {/* Platform chips */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-2">
          Platformlar
        </p>
        <div className="flex flex-wrap gap-1.5">
          {platforms.map(({ label, selected, color }) => (
            <span
              key={label}
              className={[
                'rounded-full px-2.5 py-1 text-[10px] font-medium',
                selected
                  ? 'border border-transparent text-white'
                  : 'border border-slate-200 bg-white text-slate-500',
              ].join(' ')}
              style={selected && color ? { backgroundColor: color } : undefined}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Content type icons */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-2">
          İçerik türleri
        </p>
        <div className="flex gap-2">
          {contentTypes.map(({ icon: Icon, label, selected, color, bg }) => (
            <div
              key={label}
              className={[
                'flex flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[10px] font-medium',
                selected ? 'border-transparent' : 'border-slate-200 bg-white text-slate-400',
              ].join(' ')}
              style={
                selected
                  ? { backgroundColor: bg, color, borderColor: color + '30' }
                  : undefined
              }
            >
              <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- MiniMockup: Step 3 — Çıktılar ----

function OutputMockup() {
  const outputs = [
    { icon: FileText, label: 'Trendyol listing metni', status: 'Hazır' },
    { icon: ImageIcon, label: 'Amazon ürün görseli', status: 'Hazır' },
  ]

  return (
    // UA-09 a11y: role="img" + aria-label
    <div
      className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[180px] space-y-2"
      role="img"
      aria-label="Üretilen içerikler"
    >
      <div className="space-y-2">
        {outputs.map(({ icon: Icon, label, status }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
          >
            <Icon size={14} strokeWidth={1.5} className="shrink-0 text-rd-primary-700" aria-hidden="true" />
            <span className="flex-1 truncate text-xs font-medium text-slate-700">{label}</span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
              <Check size={10} strokeWidth={2.5} aria-hidden="true" />
              {status}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-400">ve 2 tane daha...</p>
    </div>
  )
}

// ---- MockupRenderer ----

function MockupRenderer({ type }: { type: MockupType }) {
  if (type === 'input') return <InputMockup />
  if (type === 'selection') return <SelectionMockup />
  return <OutputMockup />
}

// ---- StepCard (UA-03 + UA-09) ----

function StepCard({
  step,
  index,
}: {
  step: (typeof UC_ADIM_STEPS)[number]
  index: number
}) {
  // UA-09: stagger animasyon class (1-indexed)
  const animClass = `animate-step-card-${index + 1}`

  return (
    <div className={`relative z-10 flex flex-col items-center text-center ${animClass}`}>
      {/* NumberCircle — 80×80, outline, Manrope 800 */}
      {/* UA-09 a11y: aria-hidden — sayı dekoratif, h3 başlık bilgiyi taşıyor */}
      <div
        className="w-20 h-20 rounded-full border-2 border-rd-primary-200 bg-white flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <span className="font-rd-display font-extrabold text-3xl text-rd-primary-700 tabular-nums">
          {step.number}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-rd-display font-bold text-lg text-slate-900 mt-5 mb-2">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed max-w-[280px]">
        {step.description}
      </p>

      {/* DurationLabel */}
      <div className="flex items-center gap-1.5 mt-3">
        {/* UA-09 a11y: Clock aria-hidden */}
        <Clock size={13} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
        <span className="text-xs text-slate-500">{step.duration}</span>
      </div>

      {/* MiniMockup wrapper — UA-09: max-w-[280px] mx-auto mobilde taşmayı önler */}
      {/* role="img" kaldırıldı — her mockup kendi role="img"'ini taşıyor */}
      <div className="w-full max-w-[280px] mx-auto md:max-w-full">
        <MockupRenderer type={step.mockupType} />
      </div>
    </div>
  )
}

// ---- Section ----

export default function UcAdimSection() {
  return (
    // UA-09 a11y: aria-label "Nasıl çalışır"
    <section className="bg-white py-16 md:py-20 lg:py-28" aria-label="Nasıl çalışır">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* UA-02: SectionHeader */}
        <SectionHeader
          eyebrow="KOLAY KULLANIM"
          eyebrowColor="primary"
          title="3 adımda hazır"
          subtitle="Ürün fotoğrafından pazaryeri içeriğine — kurulum yok, öğrenme eğrisi yok."
          align="center"
        />

        {/* UA-03 + UA-07: Grid + ConnectorLine wrapper */}
        <div className="relative mt-12 md:mt-16">
          {/* UA-07: ConnectorLine — dashed, desktop only */}
          {/* UA-09: hidden md:block (lg: → md:) */}
          <div
            className="pointer-events-none absolute top-10 hidden md:block"
            style={{
              left: 'calc(100% / 6)',
              right: 'calc(100% / 6)',
              borderTop: '2px dashed #CBD5E1',
            }}
            aria-hidden="true"
          />

          {/* Steps grid — UA-09: md:grid-cols-3 md:gap-8 (lg: → md:) */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {UC_ADIM_STEPS.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* UA-08: TotalTimeBar */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <div className="flex items-center gap-2.5 rounded-full bg-rd-primary-50 border border-rd-primary-100 px-6 py-3 max-w-[420px]">
            <Clock size={16} strokeWidth={1.5} className="text-rd-primary-700 shrink-0" aria-hidden="true" />
            <p className="text-sm text-slate-700">
              {TOTAL_TIME}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
