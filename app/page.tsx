import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import { TestimonialsSection, ContactSection } from '@/components/ExtraSections';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MenuSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
    </>
  );
}
