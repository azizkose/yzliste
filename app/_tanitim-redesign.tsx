import TrustStrip from '@/components/sections/HeroBlock/TrustStrip'
import Nav from '@/components/sections/HeroBlock/Nav'
import HeroSection from '@/components/sections/HeroBlock/HeroSection'
import IcerikTurleriSection from '@/components/sections/IcerikTurleriSection'
import MarkaBilgileriSection from '@/components/sections/MarkaBilgileriSection'
import NedenYzlisteSection from '@/components/sections/NedenYzlisteSection'
import PazaryeriSection from '@/components/sections/PazaryeriSection'
import UcAdimSection from '@/components/sections/UcAdimSection'

export default function TanitimRedesign() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <TrustStrip />
      <Nav />
      <main>
        <HeroSection />
        <UcAdimSection />
        <IcerikTurleriSection />
        <PazaryeriSection />
        <MarkaBilgileriSection />
        <NedenYzlisteSection />
      </main>
    </div>
  )
}
