import Cursor from "../components/Cursor";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HeroSection from "../sections/HeroSection";
import TickerSection from "../sections/TickerSection";
import IntroSection from "../sections/IntroSection";
import FeaturesSection from "../sections/FeaturesSection";
import WorkSection from "../sections/WorkSection";
import StatsSection from "../sections/StatsSection";
import ContactSection from "../sections/ContactSection";

export default function LandingPage() {
  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <HeroSection />
        <TickerSection />
        <IntroSection />
        <FeaturesSection />
        <WorkSection />
        <StatsSection />
        <TickerSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
