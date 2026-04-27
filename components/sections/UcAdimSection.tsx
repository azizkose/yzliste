// UA-02~08 — 3 Adımda Hazır Section

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
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[180px]">
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
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
        <div className="w-10 h-10 rounded-lg bg-rd-primary-50 flex items-center justify-center shrink-0">
          <ImagePlus size={16} strokeWidth={1.5} className="text-rd-primary" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-700 truncate">fincan_01.jpg</p>
          <p className="text-xs text-slate-400 mt-0.5">Yüklendi · 2.4 MB</p>
        </div>
        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <Check size={10} strokeWidth={2.5} className="text-green-600" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

// ---- MiniMockup: Step 2 — Pazaryeri ve içerik seçimi ----

function SelectionMockup() {
  const platforms = [
    { label: 'Trendyol', selected: true },
    { label: 'Amazon', selected: true },
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
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[180px] space-y-3">
      {/* Platform chips */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400 mb-2">
          Pazaryeri
        </p>
        <div className="flex flex-wrap gap-1.5">
          {platforms.map(({ label, selected }) => (
            <div
              key={label}
              className={[
                'rounded-full px-2.5 py-1 text-xs font-medium border',
                selected
                  ? 'border-rd-primary-200 bg-rd-primary-50 text-rd-primary-800'
                  : 'border-slate-200 bg-white text-slate-500',
              ].join(' ')}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Content type icons */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400 mb-2">
          İçerik türü
        </p>
        <div className="flex gap-2">
          {contentTypes.map(({ icon: Icon, label, selected, color, bg }) => (
            <div
              key={label}
              className={[
                'flex flex-col items-center gap-1 rounded-lg p-2 border flex-1',
                selected ? '' : 'border-slate-200 bg-white',
              ].join(' ')}
              style={selected ? { backgroundColor: bg, borderColor: 'transparent' } : {}}
            >
              <Icon size={16} strokeWidth={1.5} style={{ color }} aria-hidden="true" />
              <span className="text-[10px]" style={{ color }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- MiniMockup: Step 3 — Çıktılar ----

function OutputMockup() {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[180px] space-y-2">
      {/* Output card 1 — Trendyol listing metni */}
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#FFF4ED', color: '#F27A1A' }}
          >
            Trendyol
          </span>
          <span className="text-[10px] text-slate-400">Listing metni</span>
        </div>
        <p className="text-xs font-medium text-slate-700 truncate">
          El Yapımı Porselen Kahve Fincanı
        </p>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
          Özel fırın tekniğiyle üretilen, dayanıklı porselen fincan seti...
        </p>
      </div>

      {/* Output card 2 — Amazon ürün görseli */}
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#FFF8EB', color: '#FF9900' }}
          >
            Amazon
          </span>
          <span className="text-[10px] text-slate-400">Ürün görseli</span>
        </div>
        <div className="h-8 rounded-lg bg-rd-primary-50 flex items-center justify-center">
          <ImageIcon size={14} strokeWidth={1.5} className="text-rd-primary-300" aria-hidden="true" />
        </div>
      </div>

      {/* More items hint */}
      <p className="text-center text-xs text-slate-400 pt-1">ve 2 tane daha...</p>
    </div>
  )
}

// ---- MockupRenderer ----

function MockupRenderer({ type }: { type: MockupType }) {
  if (type === 'input') return <InputMockup />
  if (type === 'selection') return <SelectionMockup />
  return <OutputMockup />
}

// ---- StepCard (UA-03) ----

function StepCard({ step }: { step: (typeof UC_ADIM_STEPS)[number] }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      {/* NumberCircle — 80×80, outline, Manrope 800 */}
      <div className="w-20 h-20 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center shrink-0">
        <span className="font-rd-display font-extrabold text-3xl text-slate-900 tabular-nums">
          {step.number}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-rd-display font-bold text-lg text-slate-900 mt-5 mb-2">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed max-w-[280px]">
        {step.description}
      </p>

      {/* DurationLabel */}
      <div className="flex items-center gap-1.5 mt-3">
        <Clock size={13} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
        <span className="text-xs text-slate-400">{step.duration}</span>
      </div>

      {/* MiniMockup */}
      <div className="w-full" role="img" aria-label={`${step.title} adımı önizlemesi`}>
        <MockupRenderer type={step.mockupType} />
      </div>
    </div>
  )
}

// ---- Section ----

export default function UcAdimSection() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-28" aria-label="3 adımda hazır">
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
          <div
            className="absolute top-10 hidden lg:block pointer-events-none"
            style={{
              left: 'calc(100% / 6)',
              right: 'calc(100% / 6)',
              borderTop: '2px dashed #CBD5E1',
            }}
            aria-hidden="true"
          />

          {/* Steps grid */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            {UC_ADIM_STEPS.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>

        {/* UA-08: TotalTimeBar */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <div className="flex items-center gap-2.5 rounded-xl bg-rd-primary-50 border border-rd-primary-100 px-6 py-3.5 max-w-[420px]">
            <Clock size={16} strokeWidth={1.5} className="text-rd-primary shrink-0" aria-hidden="true" />
            <p className="text-sm text-rd-primary-800">
              {TOTAL_TIME}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
