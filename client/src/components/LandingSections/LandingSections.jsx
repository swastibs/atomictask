import AIAssistant from "./AIAssistant";
import GamificationShowcase from "./GamificationShowcase";
import CommunitySection from "./CommunitySection";
import IntegrationsSection from "./IntegrationsSection";
import PricingSection from "./PricingSection";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import TrustBadges from "./TrustBadges";
import MobilePreview from "./MobilePreview";
import ComparisonTable from "./ComparisonTable";
import ForecastCard from "./ForecastCard";
import ExitIntent from "./ExitIntent";

/** Ordered composition of the landing-page conversion sections. */
export default function LandingSections() {
  return (
    <>
      <AIAssistant />
      <GamificationShowcase />
      <CommunitySection />
      <IntegrationsSection />
      <PricingSection />
      <Testimonials />
      <FAQ />
      <TrustBadges />
      <MobilePreview />
      <ComparisonTable />
      <ForecastCard />
      <ExitIntent />
    </>
  );
}
