import { AboutSection } from "@/components/about-section";
import { HeroStage } from "@/components/hero-stage";
import { OpeningSequence } from "@/components/opening-sequence";
import { ContactSection } from "@/components/contact-section";
import { EntranceEffects } from "@/components/entrance-effects";
import { SiteNavigation } from "@/components/site-navigation";
import { SmoothScroll } from "@/components/smooth-scroll";
import { WorkSection } from "@/components/work-section";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { TrustSection } from "@/components/trust-section";
import { VelocityMarquee } from "@/components/velocity-marquee";

const openingRows = [
  {
    variant: "display",
    items: ["Form", "Build", "Clarity", "Delivery"],
  },
  {
    variant: "serif",
    items: [
      "设计给出形式",
      "Design gives form",
      "工程让它运转",
      "Engineering makes it work",
    ],
  },
] as const;

const closingRows = [
  {
    variant: "display",
    items: ["Let’s build", "Something real", "Let’s build", "Together"],
  },
  {
    variant: "serif",
    items: [
      "从一个想法开始",
      "From a single idea",
      "到一个稳定运行的作品",
      "To work that ships",
    ],
  },
] as const;

export default function Home() {
  return (
    <main>
      <AnalyticsTracker />
      <OpeningSequence />
      <SiteNavigation />
      <SmoothScroll />
      <EntranceEffects />
      <HeroStage />
      <VelocityMarquee
        rows={openingRows}
        label="Form、Build、Clarity、Delivery：设计给出形式，工程让它运转"
      />
      <WorkSection />
      <TrustSection />
      <AboutSection />
      <VelocityMarquee
        rows={closingRows}
        label="Let’s build something real：从一个想法开始，到一个稳定运行的作品"
      />
      <ContactSection />
    </main>
  );
}
