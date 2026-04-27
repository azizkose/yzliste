import { Camera, Pencil, ScanLine, ImageIcon, Zap, Check } from 'lucide-react'
import { MOCKUP_STEPS, MOCKUP_INPUT_METHODS, HERO_BADGES } from '@/lib/constants/hero'
import StickerBadge from '@/components/primitives/StickerBadge'

const INPUT_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Camera,
  Pencil,
  ScanLine,
}

export default function AppScreenshotMockup() {
  return (
    <div className="relative animate-hero-float-in-right" role="img" aria-label="Uygulama önizlemesi">
      <StickerBadge
        icon={<Check size={14} strokeWidth={2} />}
        label={HERO_BADGES.topRight.label}
        color="#1E40AF"
        borderColor="#DBEAFE"
        className="absolute -top-3 right-5 z-10"
      />
      <StickerBadge
        icon={<Zap size={14} strokeWidth={2} />}
        label={HERO_BADGES.bottomLeft.label}
        color="#EA580C"
        borderColor="#FED7AA"
        className="absolute -bottom-3 -left-3 z-10"
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
          {/* Step indicator */}
          <div className="mb-5 flex items-center gap-1" aria-hidden="true">
            {MOCKUP_STEPS.map((step, i) => (
              <div key={step.number} className="flex items-center gap-1">
                {i > 0 && <div className="h-px w-6 bg-slate-200" />}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      step.active
                        ? 'bg-rd-primary text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`text-xs ${
                      step.active ? 'font-medium text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input method cards */}
          <div className="mb-4 flex gap-2" aria-hidden="true">
            {MOCKUP_INPUT_METHODS.map((method) => {
              const Icon = INPUT_ICONS[method.icon]
              return (
                <div
                  key={method.label}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-lg border py-2 ${
                    method.selected
                      ? 'border-rd-primary bg-rd-primary-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  {Icon && (
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className={method.selected ? 'text-rd-primary' : 'text-slate-400'}
                    />
                  )}
                  <span
                    className={`text-[10px] ${
                      method.selected ? 'font-medium text-rd-primary' : 'text-slate-400'
                    }`}
                  >
                    {method.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Upload area */}
          <div
            className="mb-4 flex items-center gap-3 rounded-xl border-[1.5px] border-dashed border-slate-300 bg-slate-50/50 px-4 py-3.5"
            aria-hidden="true"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-amber-100">
              <ImageIcon size={22} strokeWidth={1.5} className="text-amber-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-slate-700">fincan_01.jpg</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600">
                <Check size={11} strokeWidth={2.5} />
                Yüklendi · 2.4 MB
              </span>
            </div>
          </div>

          {/* Brand input */}
          <div
            className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
            aria-hidden="true"
          >
            <span className="text-xs text-slate-400">Marka: Selin Porselen</span>
          </div>

          {/* Generate button */}
          <div
            className="flex items-center justify-center gap-2 rounded-[10px] bg-rd-primary py-2.5"
            aria-hidden="true"
          >
            <Zap size={14} strokeWidth={2} className="text-white" />
            <span className="text-sm font-medium text-white">İçerik üret</span>
          </div>
        </div>
      </div>
    </div>
  )
}
