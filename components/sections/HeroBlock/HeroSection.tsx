import HeroContent from './HeroContent'
import AppScreenshotMockup from './AppScreenshotMockup'

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-10 md:pb-20 md:pt-14 lg:pb-24 lg:pt-16"
      aria-label="Hero"
    >
      {/* Radial blue glow — decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-200px] h-[600px] w-[900px] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse, rgba(59, 130, 246, 0.08), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <HeroContent />
        <AppScreenshotMockup />
      </div>
    </section>
  )
}
