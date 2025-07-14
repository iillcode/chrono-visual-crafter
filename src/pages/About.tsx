import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Zap,
  Palette,
  Download,
  Play,
  CheckCircle,
  Sparkles,
  Users,
  Target,
  Award,
  Clock,
  Heart,
  Globe,
  Shield,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Hero2 } from "@/components/ui/hero-2-1";
import { Footer } from "@/components/ui/footer-section";
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";

const About = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate("/studio");
    } else {
      navigate("/auth");
    }
  };

  // Define BentoGrid items for company values
  const companyValues: BentoItem[] = [
    {
      title: "Innovation First",
      meta: "Always Evolving",
      description:
        "We continuously push the boundaries of what's possible with web-based animation technology",
      icon: <Zap className="w-4 h-4 text-purple-400" />,
      status: "Core Value",
      tags: ["Technology", "Progress"],
      colSpan: 2,
      hasPersistentHover: true,
    },
    {
      title: "User-Centric Design",
      meta: "Built for Creators",
      description:
        "Every feature is crafted with content creators and video editors in mind",
      icon: <Palette className="w-4 h-4 text-pink-400" />,
      status: "Philosophy",
      tags: ["Design", "Experience"],
    },
    {
      title: "Quality & Performance",
      meta: "Professional Grade",
      description:
        "High-quality exports with optimized performance for seamless workflow integration",
      icon: <Award className="w-4 h-4 text-sky-400" />,
      tags: ["Quality", "Performance"],
      colSpan: 1,
    },
    {
      title: "Community Driven",
      meta: "Growing Together",
      description:
        "Built by creators, for creators - we listen to our community's feedback and needs",
      icon: <Users className="w-4 h-4 text-green-400" />,
      status: "Community",
      tags: ["Feedback", "Growth"],
      colSpan: 1,
    },
    {
      title: "Accessibility",
      meta: "For Everyone",
      description:
        "Making professional animation tools accessible to creators at all skill levels",
      icon: <Globe className="w-4 h-4 text-amber-400" />,
      tags: ["Inclusive", "Accessible"],
      colSpan: 1,
    },
  ];

  // Team/Founder section items
  const teamHighlights: BentoItem[] = [
    {
      title: "Founded 2024",
      meta: "Our Journey",
      description:
        "Started with a simple vision: make professional counter animations accessible to everyone",
      icon: <Clock className="w-4 h-4 text-purple-400" />,
      status: "Origin",
      tags: ["Story", "Mission"],
      colSpan: 1,
    },
    {
      title: "Global Reach",
      meta: "Worldwide Impact",
      description:
        "Serving creators from over 50 countries with millions of animations generated",
      icon: <Globe className="w-4 h-4 text-pink-400" />,
      status: "Scale",
      tags: ["Global", "Impact"],
      colSpan: 2,
    },
    {
      title: "Continuous Growth",
      meta: "Always Improving",
      description:
        "Regular updates and new features based on community feedback and emerging needs",
      icon: <TrendingUp className="w-4 h-4 text-sky-400" />,
      tags: ["Updates", "Evolution"],
      colSpan: 1,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen relative bg-black overflow-hidden">
      {/* Background effects - matching Landing.tsx */}
      <div className="absolute inset-0 z-0">
        <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0">
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-purple-600 to-sky-600"></div>
          <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-pink-900 to-yellow-400"></div>
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-yellow-600 to-sky-500"></div>
        </div>
        <div className="absolute inset-0 z-0 bg-noise opacity-30"></div>

        {/* Additional gradients for more visual interest */}
        <div className="absolute bottom-0 left-0 h-[30rem] w-[30rem] rounded-full blur-[8rem] bg-gradient-to-tr from-purple-600/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/4 h-[20rem] w-[20rem] rounded-full blur-[7rem] bg-gradient-to-br from-cyan-500/10 to-transparent"></div>

        {/* Deep black overlay to maintain deep black background */}
        <div className="absolute inset-0 z-1 bg-black/50"></div>
      </div>

      {/* Hero section - matching Landing.tsx style */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              About Countable
            </h1>
            <p className="text-xl md:text-2xl text-white/60 mb-8 leading-relaxed">
              We're on a mission to democratize professional animation tools, 
              making high-quality counter animations accessible to creators worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
              >
                Start Creating
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Our Story
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Our Mission
            </h2>
            <p className="max-w-2xl mx-auto text-white/40 text-lg">
              Empowering creators with professional-grade animation tools that 
              are powerful yet simple to use.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Accessibility</h3>
                <p className="text-white/60">
                  Making professional animation tools available to creators at every level
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
                <p className="text-white/60">
                  Continuously pushing the boundaries of web-based animation technology
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Community</h3>
                <p className="text-white/60">
                  Building tools that grow with our community's needs and feedback
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section id="values" className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Our Values
            </h2>
            <p className="max-w-xl mx-auto text-white/40">
              The principles that guide everything we build and every decision we make.
            </p>
          </motion.div>

          <BentoGrid items={companyValues} />
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Our Story
            </h2>
            <p className="max-w-2xl mx-auto text-white/40">
              From a simple idea to a global platform serving creators worldwide.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">The Beginning</h3>
                <p className="text-white/60 leading-relaxed">
                  Countable was born from a simple observation: professional counter animations 
                  were either too expensive, too complex, or both. We set out to change that 
                  by building a tool that combines professional quality with simplicity.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">Growth & Impact</h3>
                <p className="text-white/60 leading-relaxed">
                  What started as a weekend project has grown into a platform serving 
                  thousands of creators worldwide. From YouTubers to marketing agencies, 
                  our tools have helped create millions of professional animations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">Looking Forward</h3>
                <p className="text-white/60 leading-relaxed">
                  We're constantly evolving, adding new features, and improving performance 
                  based on community feedback. Our goal is to become the go-to platform 
                  for animated content creation.
                </p>
              </motion.div>
            </div>
          </div>

          <BentoGrid items={teamHighlights} className="mt-16" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Join thousands of creators who trust Countable for their professional animations.
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
            >
              Start Creating Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer with matched color theme */}
      <div className="border-t border-gray/10 relative z-10 mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default About;
