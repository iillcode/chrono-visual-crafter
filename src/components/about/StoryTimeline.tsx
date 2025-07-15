import { motion } from "framer-motion";
import { Calendar, Users, Zap, Trophy } from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  stats?: string;
}

const timelineItems: TimelineItem[] = [
  {
    year: "2024",
    title: "The Beginning",
    description:
      "Started with a vision to democratize professional animation tools for content creators worldwide.",
    icon: <Zap className="w-5 h-5" />,
    stats: "First prototype",
  },
  {
    year: "Mid 2024",
    title: "Community Growth",
    description:
      "Launched beta version and gained our first 1,000 users who helped shape the platform.",
    icon: <Users className="w-5 h-5" />,
    stats: "1K+ users",
  },
  {
    year: "Late 2024",
    title: "Feature Expansion",
    description:
      "Added advanced transitions, export options, and professional-grade effects based on user feedback.",
    icon: <Trophy className="w-5 h-5" />,
    stats: "20+ effects",
  },
  {
    year: "2025",
    title: "Global Impact",
    description:
      "Serving creators from 50+ countries with millions of animations generated monthly.",
    icon: <Calendar className="w-5 h-5" />,
    stats: "50+ countries",
  },
];

export const StoryTimeline = () => {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-pink-500/50"></div>

      <div className="space-y-12">
        {timelineItems.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative flex items-start gap-6"
          >
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
                {item.icon}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">
                  {item.year}
                </span>
                {item.stats && (
                  <span className="text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                    {item.stats}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
