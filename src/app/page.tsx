import { AboutSection } from "@/components/about-section";
import { HeroStage } from "@/components/hero-stage";
import { HeroTransition } from "@/components/hero-transition";
import { OpeningSequence } from "@/components/opening-sequence";
import { ContactSection } from "@/components/contact-section";
import { EntranceEffects } from "@/components/entrance-effects";
import { SiteNavigation } from "@/components/site-navigation";
import { SmoothScroll } from "@/components/smooth-scroll";
import { WorkSection } from "@/components/work-section";
import { AnalyticsTracker } from "@/components/analytics-tracker";

export default function Home() {
  return (
    <main>
      <AnalyticsTracker />
      <OpeningSequence />
      <SiteNavigation />
      <SmoothScroll />
      <EntranceEffects />
      <HeroStage />
      <HeroTransition />
      <AboutSection />
      <WorkSection />
      <ContactSection />
    </main>
  );
}
