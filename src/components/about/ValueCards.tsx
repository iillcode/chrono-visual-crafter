import { motion } from "framer-motion";
import {
  Zap,
  Users,
  Shield,
  Heart,
  Target,
  Globe,
  Sparkles,
  Award,
} from "lucide-react";

interface ValueCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const values: ValueCard[] = [
  {
    title: "Innovation First",
    description:
      "We continuously push the boundaries of web-based animation technology, bringing cutting-edge features to creators.",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-purple-600 to-pink-600",
  },
  {
    title: "Community Driven",
    description:
      "Built by creators, for creators. Every feature is shaped by community feedback and real-world needs.",
    icon: <Users className="w-6 h-6" />,
    gradient: "from-cyan-600 to-blue-600",
  },
  {
    title: "Quality & Reliability",
    description:
      "Professional-grade outputs with consistent performance that creators can depend on for their projects.",
    icon: <Award className="w-6 h-6" />,
    gradient: "from-green-600 to-emerald-600",
  },
  {
    title: "Accessibility",
    description:
      "Making professional animation tools available to creators at every skill level and budget.",
    icon: <Globe className="w-6 h-6" />,
    gradient: "from-orange-600 to-red-600",
  },
  {
    title: "Privacy & Security",
    description:
      "Your creative work is protected with enterprise-grade security and privacy-first practices.",
    icon: <Shield className="w-6 h-6" />,
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    title: "Creator Success",
    description:
      "We measure our success by the amazing content our community creates and the goals they achieve.",
    icon: <Heart className="w-6 h-6" />,
    gradient: "from-pink-600 to-rose-600",
  },
];

export const ValueCards = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {values.map((value, index) => (
        <motion.div
          key={value.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group relative"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 h-full">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${value.gradient} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              {value.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">
              {value.title}
            </h3>
            <p className="text-white/70 leading-relaxed text-sm">
              {value.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
