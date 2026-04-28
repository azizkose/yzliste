import TrustStrip from '@/components/sections/HeroBlock/TrustStrip'
import Nav from '@/components/sections/HeroBlock/Nav'
import HeroSection from '@/components/sections/HeroBlock/HeroSection'
import { StepSection } from '@/components/landing/StepSection'
import MarkaBilgileriSection from '@/components/sections/MarkaBilgileriSection'
import FinalCTASection from '@/components/sections/FinalCTASection'
import FiyatlarSection from '@/components/sections/FiyatlarSection'
import SSSSection from '@/components/sections/SSSSection'
import NedenYzlisteSection from '@/components/sections/NedenYzlisteSection'
import FooterSection from '@/components/sections/FooterSection'

export default function TanitimRedesign() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <TrustStrip />
      <Nav />
      <main>
        <HeroSection />
        <StepSection />
        <MarkaBilgileriSection />
        <NedenYzlisteSection />
        <FiyatlarSection />
        <SSSSection />
        <FinalCTASection />
      </main>
      <FooterSection />
    </div>
  )
}
