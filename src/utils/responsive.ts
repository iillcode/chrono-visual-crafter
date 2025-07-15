import { ResponsiveBreakpoints, SafeAreaInsets } from "@/types/mobile";

export const RESPONSIVE_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tabletPortrait: 1024,
};

/**
 * Check if current viewport is mobile size
 */
export const isMobileViewport = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < RESPONSIVE_BREAKPOINTS.mobile;
};

/**
 * Check if current viewport is tablet portrait size
 */
export const isTabletPortraitViewport = (): boolean => {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  return (
    width >= RESPONSIVE_BREAKPOINTS.mobile &&
    width < RESPONSIVE_BREAKPOINTS.tabletPortrait
  );
};

/**
 * Get current viewport orientation
 */
export const getViewportOrientation = (): "portrait" | "landscape" => {
  if (typeof window === "undefined") return "portrait";
  return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
};

/**
 * Get current viewport width
 */
export const getViewportWidth = (): number => {
  if (typeof window === "undefined") return 1024;
  return window.innerWidth;
};

/**
 * Get current viewport height
 */
export const getViewportHeight = (): number => {
  if (typeof window === "undefined") return 768;
  return window.innerHeight;
};

/**
 * Get safe area insets for mobile devices
 * This is a basic implementation - in a real app you might want to use CSS env() variables
 */
export const getSafeAreaInsets = (): SafeAreaInsets => {
  if (typeof window === "undefined") {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  // Basic safe area detection
  const isMobile = isMobileViewport();
  const isLandscape = getViewportOrientation() === "landscape";

  // Estimate safe areas based on common mobile patterns
  const topInset = isMobile ? (isLandscape ? 0 : 44) : 0; // Status bar height
  const bottomInset = isMobile ? (isLandscape ? 21 : 34) : 0; // Home indicator

  return {
    top: topInset,
    right: 0,
    bottom: bottomInset,
    left: 0,
  };
};

/**
 * Check if device supports touch
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

/**
 * Get responsive breakpoint name for current viewport
 */
export const getCurrentBreakpoint = (): "mobile" | "tablet" | "desktop" => {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;

  if (width < RESPONSIVE_BREAKPOINTS.mobile) {
    return "mobile";
  } else if (width < RESPONSIVE_BREAKPOINTS.tabletPortrait) {
    return "tablet";
  } else {
    return "desktop";
  }
};

/**
 * Debounce function for resize events
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Media query helper for responsive breakpoints
 */
export const mediaQueries = {
  mobile: `(max-width: ${RESPONSIVE_BREAKPOINTS.mobile - 1}px)`,
  tabletPortrait: `(min-width: ${
    RESPONSIVE_BREAKPOINTS.mobile
  }px) and (max-width: ${RESPONSIVE_BREAKPOINTS.tabletPortrait - 1}px)`,
  desktop: `(min-width: ${RESPONSIVE_BREAKPOINTS.tabletPortrait}px)`,
  landscape: "(orientation: landscape)",
  portrait: "(orientation: portrait)",
} as const;
