import TrustStrip from '@/components/sections/HeroBlock/TrustStrip'
import Nav from '@/components/sections/HeroBlock/Nav'
import HeroSection from '@/components/sections/HeroBlock/HeroSection'
import IcerikTurleriSection from '@/components/sections/IcerikTurleriSection'
import PazaryeriSection from '@/components/sections/PazaryeriSection'

export default function TanitimRedesign() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <TrustStrip />
      <Nav />
      <main>
        <HeroSection />
        <IcerikTurleriSection />
        <PazaryeriSection />
      </main>
    </div>
  )
}
