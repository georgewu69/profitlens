import { CtaSection } from "@/components/home/cta-section";
import { FeatureSection } from "@/components/home/feature-section";
import { HeroSection } from "@/components/home/hero-section";
import { StepsSection } from "@/components/home/steps-section";
import { WhySection } from "@/components/home/why-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <WhySection />
      <StepsSection />
      <CtaSection />
    </>
  );
}
