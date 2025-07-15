import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ModernPricingPage,
  PricingCardProps,
} from "@/components/ui/animated-glassy-pricing";

interface PricingSectionProps {
  plans: PricingCardProps[];
}

// Check if user prefers reduced motion
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

export const PricingSection: React.FC<PricingSectionProps> = ({ plans }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="pricing" className="relative z-10 py-0 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Simplified background effects for better performance */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0 z-0 opacity-40">
              <motion.div
                className="h-[15rem] rounded-full w-[30rem] absolute -right-20 -top-40 blur-3xl bg-gradient-to-b from-purple-600/15 to-transparent"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="h-[15rem] rounded-full w-[30rem] absolute -left-20 top-40 blur-3xl bg-gradient-to-b from-cyan-500/15 to-transparent"
                animate={{
                  scale: [1, 0.95, 1],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 5,
                }}
              />
            </div>
          )}

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <ModernPricingPage
              title={
                <>
                  Simple, <span className="text-cyan-400">Transparent</span>{" "}
                  Pricing
                </>
              }
              subtitle="No hidden fees. Start free and upgrade when you need more."
              plans={plans}
              showAnimatedBackground={false}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
