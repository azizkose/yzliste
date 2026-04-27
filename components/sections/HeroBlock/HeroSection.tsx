import HeroContent from './HeroContent'
import AppScreenshotMockup from './AppScreenshotMockup'

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-white px-6 py-16 md:py-24"
      aria-label="Hero"
    >
      {/* Radial blue glow — decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <HeroContent />
        <AppScreenshotMockup />
      </div>
    </section>
  )
}
