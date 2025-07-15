import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";

import { Hero2 } from "@/components/ui/hero-2-1";
import { Footer } from "@/components/ui/footer-section";
import { BackgroundEffects } from "@/components/landing/BackgroundEffects";
import { usePricingPlans } from "@/hooks/usePricingPlans";

// Lazy load components that are not immediately visible
const FeaturesSection = lazy(() =>
  import("@/components/landing/FeaturesSection").then((module) => ({
    default: module.FeaturesSection,
  }))
);

const PricingSection = lazy(() =>
  import("@/components/landing/PricingSection").then((module) => ({
    default: module.PricingSection,
  }))
);

// Loading component for lazy-loaded sections
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-white/30"></div>
  </div>
);

const Landing = () => {
  const { plans, loading } = usePricingPlans();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative bg-black overflow-hidden">
      <BackgroundEffects />

      {/* Hero section */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Hero2 />
      </motion.div>

      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PricingSection plans={plans} />
      </Suspense>

      {/* Footer */}
      <div className="border-t border-gray/10 relative z-10 mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
