import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Description from "@/components/Description";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Description />
      <Testimonials />
      <CtaSection />
    </>
  );
}