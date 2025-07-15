import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileBottomPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string;
}

const MobileBottomPanel: React.FC<MobileBottomPanelProps> = ({
  isOpen,
  onClose,
  children,
  maxHeight = "60vh",
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragConstraints = useRef<HTMLDivElement>(null);

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when panel is open, but allow panel content to scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle drag to dismiss
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100; // Minimum drag distance to dismiss
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Close if dragged down significantly or with high velocity
    if (offset > threshold || velocity > 500) {
      onClose();
    }
  };

  // Backdrop click handler
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleBackdropClick}
            aria-label="Close panel"
          />

          {/* Panel Container */}
          <div
            ref={dragConstraints}
            className="fixed inset-0 z-50 pointer-events-none flex items-end"
          >
            <motion.div
              ref={panelRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                duration: 0.3,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              className="w-full bg-[#171717] border-t border-gray-700/50 rounded-t-xl pointer-events-auto"
              style={{ maxHeight }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile control panel"
            >
              {/* Drag Handle */}
              <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 bg-gray-500 rounded-full" />
              </div>

              {/* Header with close button */}
              <div className="flex items-center justify-between px-4 pb-2">
                <h2 className="text-white font-medium text-lg">
                  Studio Controls
                </h2>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50"
                  aria-label="Close panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto max-h-[calc(60vh-120px)]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomPanel;
