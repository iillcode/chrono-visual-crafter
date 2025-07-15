import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

// Minimal animation variants for better performance
const scaleVariants = {
  scale1: {
    scale: [1, 1.05, 1],
    opacity: [0.3, 0.4, 0.3],
  },
  scale2: {
    scale: [0.95, 1, 0.95],
    opacity: [0.25, 0.35, 0.25],
  },
  scale3: {
    scale: [1, 0.98, 1],
    opacity: [0.3, 0.4, 0.3],
  },
};

export const BackgroundEffects = React.memo(() => {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, show static background
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 z-0">
        <div className="absolute -right-40 -top-10 z-0">
          <div className="h-[12rem] rounded-full w-[50rem] bg-gradient-to-br blur-3xl from-purple-600/20 via-blue-500/15 to-sky-600/20" />
        </div>
        <div className="absolute -left-30 top-20 z-0">
          <div className="h-[14rem] rounded-full w-[45rem] bg-gradient-to-br blur-3xl from-pink-600/15 via-purple-500/10 to-yellow-400/15" />
        </div>
        <div className="absolute right-10 top-1/2 z-0">
          <div className="h-[10rem] rounded-full w-[35rem] bg-gradient-to-br blur-2xl from-cyan-500/20 via-blue-400/15 to-purple-600/15" />
        </div>
        <div className="absolute inset-0 z-0 bg-noise opacity-15" />
        <div className="absolute inset-0 z-1 bg-black/75" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      {/* Optimized gradient background with minimal animations */}
      <div className="absolute -right-40 -top-10 z-0">
        <motion.div
          className="h-[12rem] rounded-full w-[50rem] bg-gradient-to-br blur-3xl from-purple-600/30 via-blue-500/20 to-sky-600/30"
          animate={scaleVariants.scale1}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Secondary gradient - reduced complexity */}
      <div className="absolute -left-30 top-20 z-0">
        <motion.div
          className="h-[14rem] rounded-full w-[45rem] bg-gradient-to-br blur-3xl from-pink-600/25 via-purple-500/15 to-yellow-400/25"
          animate={scaleVariants.scale2}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10,
          }}
        />
      </div>

      {/* Third gradient - minimal animation */}
      <div className="absolute right-10 top-1/2 z-0">
        <motion.div
          className="h-[10rem] rounded-full w-[35rem] bg-gradient-to-br blur-2xl from-cyan-500/30 via-blue-400/20 to-purple-600/25"
          animate={scaleVariants.scale3}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 20,
          }}
        />
      </div>

      {/* Static noise and overlay for better performance */}
      <div className="absolute inset-0 z-0 bg-noise opacity-20" />
      <div className="absolute inset-0 z-1 bg-black/70" />
    </div>
  );
});

BackgroundEffects.displayName = "BackgroundEffects";
