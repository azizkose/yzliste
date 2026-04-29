import { StepAnimation } from './StepAnimation'
import { RDFeaturesTabbed } from './RDFeaturesTabbed'

export function StepSection() {
  return (
    <section aria-labelledby="step-section-baslik" className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-[10px] uppercase tracking-[0.15em] text-rd-warm-700 font-medium mb-2">
            3 ADIMDA HAZIR
          </p>
          <h2
            id="step-section-baslik"
            className="font-rd-display text-3xl md:text-4xl text-rd-neutral-900 font-medium"
          >
            Ürünü tanıt, AI senin için yapsın
          </h2>
        </div>

        {/* Animated steps */}
        <StepAnimation />

        {/* Divider */}
        <div className="my-10 md:my-12 border-t border-rd-neutral-200" />

        {/* Features tabbed — replaces InfoStrip */}
        <RDFeaturesTabbed />
      </div>
    </section>
  )
}
