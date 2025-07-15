import { motion } from "framer-motion";
import { Users, Play, Globe, Zap } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const stats: Stat[] = [
  {
    label: "Active Creators",
    value: "10K+",
    description: "Content creators using our platform",
    icon: <Users className="w-6 h-6" />,
    gradient: "from-purple-600 to-pink-600",
  },
  {
    label: "Animations Created",
    value: "1M+",
    description: "Professional animations generated",
    icon: <Play className="w-6 h-6" />,
    gradient: "from-cyan-600 to-blue-600",
  },
  {
    label: "Countries Served",
    value: "50+",
    description: "Global reach across continents",
    icon: <Globe className="w-6 h-6" />,
    gradient: "from-green-600 to-emerald-600",
  },
  {
    label: "Export Formats",
    value: "20+",
    description: "Different animation styles & effects",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-orange-600 to-red-600",
  },
];

export const StatsSection = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center group"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-white/90 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-white/60">{stat.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
