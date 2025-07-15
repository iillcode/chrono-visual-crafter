// Simple test file to verify mobile detection utilities
import { useMobileDetection } from "./hooks/useMobileDetection";
import {
  isMobileViewport,
  getViewportOrientation,
  getViewportWidth,
  getViewportHeight,
  getCurrentBreakpoint,
  RESPONSIVE_BREAKPOINTS,
} from "./utils/responsive";

// Test the utility functions
console.log("Testing responsive utilities:");
console.log("RESPONSIVE_BREAKPOINTS:", RESPONSIVE_BREAKPOINTS);
console.log("isMobileViewport():", isMobileViewport());
console.log("getViewportOrientation():", getViewportOrientation());
console.log("getViewportWidth():", getViewportWidth());
console.log("getViewportHeight():", getViewportHeight());
console.log("getCurrentBreakpoint():", getCurrentBreakpoint());

// Export for potential use
export { useMobileDetection };
export * from "./utils/responsive";
