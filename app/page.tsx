import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CatalogSection from '@/components/CatalogSection'
import AboutSection from '@/components/AboutSection'
import HowToBuySection from '@/components/HowToBuySection'

import GlobalAudioPlayer from '@/components/GlobalAudioPlayer'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <CatalogSection />
      <HowToBuySection />
      <AboutSection />

      <Footer />
      <GlobalAudioPlayer />
    </main>
  )
}
