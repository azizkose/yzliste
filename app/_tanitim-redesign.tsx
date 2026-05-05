import TrustStrip from '@/components/sections/HeroBlock/TrustStrip'
import Nav from '@/components/sections/HeroBlock/Nav'
import HeroSection from '@/components/sections/HeroBlock/HeroSection'
import PazaryeriLogoStrip from '@/components/sections/HeroBlock/PazaryeriLogoStrip'
import { InfoStrip } from '@/components/landing/InfoStrip'
import MarkaBilgileriSection from '@/components/sections/MarkaBilgileriSection'
import FinalCTASection from '@/components/sections/FinalCTASection'
import NedenYzlisteSection from '@/components/sections/NedenYzlisteSection'
import FooterSection from '@/components/sections/FooterSection'

export default function TanitimRedesign() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <TrustStrip />
      <Nav />
      <main>
        <HeroSection />
        <PazaryeriLogoStrip />
        <section className="py-16 md:py-20 bg-rd-neutral-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <InfoStrip />
          </div>
        </section>
        <MarkaBilgileriSection />
        <NedenYzlisteSection />
        <FinalCTASection />
      </main>
      <FooterSection />
    </div>
  )
}
