import React from "react";
import { motion } from "framer-motion";
import { Zap, Palette, Download, Play, Sparkles } from "lucide-react";
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";

const featureItems: BentoItem[] = [
  {
    title: "Transition Effects",
    meta: "20+ Styles",
    description:
      "From smooth slides to dramatic flips, create stunning counter animations for your videos",
    icon: <Zap className="w-4 h-4 text-purple-400" />,
    status: "Popular",
    tags: ["Animations", "Effects"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Professional Designs",
    meta: "Unlimited Options",
    description:
      "Neon glows, gradients, fire effects and more built-in designs",
    icon: <Palette className="w-4 h-4 text-pink-400" />,
    status: "Designer",
    tags: ["UI", "Styling"],
  },
  {
    title: "Export Ready",
    meta: "Multiple Formats",
    description: "Download as high-quality videos or optimized GIFs",
    icon: <Download className="w-4 h-4 text-sky-400" />,
    tags: ["Export", "Share"],
    colSpan: 1,
  },
  {
    title: "Real-time Preview",
    meta: "Instant Feedback",
    description:
      "See your counter animation exactly as it will appear in your final export",
    icon: <Play className="w-4 h-4 text-green-400" />,
    status: "Fast",
    tags: ["Preview", "Real-time"],
    colSpan: 1,
  },
  {
    title: "Customization",
    meta: "Complete Control",
    description:
      "Adjust every aspect of your counter: fonts, colors, speed, timing, and more",
    icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    tags: ["Control", "Options"],
    colSpan: 1,
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-10 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Powerful Features
          </h2>
          <p className="max-w-xl mx-auto text-white/40">
            Everything you need to create professional animated counters for
            your projects.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <BentoGrid items={featureItems} />
        </motion.div>
      </div>
    </section>
  );
};
