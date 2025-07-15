import React from "react";
import { motion } from "framer-motion";
import { Hash, Type, Palette, LucideIcon } from "lucide-react";

interface TabItem {
  id: "counter" | "design" | "visual";
  label: string;
  icon: LucideIcon;
}

interface MobileTabNavigationProps {
  activeTab: string | null;
  onTabChange: (tab: string) => void;
  isRecording?: boolean;
}

const MobileTabNavigation: React.FC<MobileTabNavigationProps> = ({
  activeTab,
  onTabChange,
  isRecording = false,
}) => {
  const tabs: TabItem[] = [
    {
      id: "counter",
      label: "Counter",
      icon: Hash,
    },
    {
      id: "design",
      label: "Design",
      icon: Palette,
    },
    {
      id: "visual",
      label: "Visual",
      icon: Type,
    },
  ];

  // Handle tab click with haptic feedback (if supported)
  const handleTabClick = (tabId: string) => {
    // Trigger haptic feedback on supported devices
    if ("vibrate" in navigator) {
      navigator.vibrate(10); // Short vibration
    }

    onTabChange(tabId);
  };

  // Don't render tabs during recording
  if (isRecording) {
    return null;
  }

  return (
    <div className="flex bg-[#101010] border-t border-gray-700/50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex-1 flex flex-col items-center justify-center py-3 px-2 min-h-[44px] relative
              transition-colors duration-200 ease-in-out
              ${
                isActive
                  ? "text-[#2BA6FF] bg-[#2BA6FF]/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }
            `}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            aria-label={`${tab.label} settings tab`}
            role="tab"
            aria-selected={isActive}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute top-0 left-0 right-0 h-0.5 bg-[#2BA6FF]"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}

            {/* Icon */}
            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-5 h-5 mb-1" />
            </motion.div>

            {/* Label */}
            <span className="text-xs font-medium">{tab.label}</span>

            {/* Touch ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              whileTap={{
                backgroundColor: "rgba(43, 166, 255, 0.1)",
              }}
              transition={{ duration: 0.1 }}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

export default MobileTabNavigation;
