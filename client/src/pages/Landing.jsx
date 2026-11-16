import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import PricingSection from "@/components/landing/PricingSection";
import {
  ConsistencySection,
  FeatureShowcase,
  HowItWorksSection,
  ProofStrip,
  ReferenceCTA,
  ReferenceFAQ,
} from "@/components/landing/ReferenceSections";
import "@/styles/reference-ui.css";

export default function Landing() {
  return (
    <div className="ref-site">
      <div aria-hidden="true" className="ref-grid-background" />
      <Navbar />
      <main className="ref-main">
        <Hero />
        <ProofStrip />
        <FeatureShowcase />
        <HowItWorksSection />
        <ConsistencySection />
        <PricingSection />
        <ReferenceFAQ />
        <ReferenceCTA />
      </main>
      <Footer />
    </div>
  );
}
