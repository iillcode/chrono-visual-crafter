import { useState, useEffect } from "react";
import { MobileDetectionHook } from "@/types/mobile";

const MOBILE_BREAKPOINT = 768;

export const useMobileDetection = (): MobileDetectionHook => {
  const [state, setState] = useState<MobileDetectionHook>(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    const height = typeof window !== "undefined" ? window.innerHeight : 768;
    const isMobile = width < MOBILE_BREAKPOINT;
    const orientation = width > height ? "landscape" : "portrait";

    return {
      isMobile,
      orientation,
      viewportWidth: width,
      viewportHeight: height,
      isLandscape: orientation === "landscape",
      isPortrait: orientation === "portrait",
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < MOBILE_BREAKPOINT;
      const orientation = width > height ? "landscape" : "portrait";

      setState({
        isMobile,
        orientation,
        viewportWidth: width,
        viewportHeight: height,
        isLandscape: orientation === "landscape",
        isPortrait: orientation === "portrait",
      });
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Add event listener for orientation change (mobile devices)
    window.addEventListener("orientationchange", () => {
      // Small delay to ensure viewport dimensions are updated
      setTimeout(handleResize, 100);
    });

    // Initial call to set correct state
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return state;
};
