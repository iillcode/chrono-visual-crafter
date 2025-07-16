// Mobile responsive types and interfaces

export interface MobileLayoutState {
  activeTab: "counter" | "text" | "font" | "design" | "styles" | null;
  bottomPanelOpen: boolean;
  isRecording: boolean;
  orientation: "portrait" | "landscape";
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tabletPortrait: number;
}

export interface MobileStudioState {
  // Layout state
  isMobile: boolean;
  orientation: "portrait" | "landscape";
  bottomPanelHeight: number;

  // Panel state
  activeTab: string | null;
  bottomPanelOpen: boolean;

  // Recording state
  isRecording: boolean;
  recordingTime: number;
}

export interface ResponsiveUtils {
  isMobile: () => boolean;
  getOrientation: () => "portrait" | "landscape";
  getViewportHeight: () => number;
  getViewportWidth: () => number;
  getSafeAreaInsets: () => SafeAreaInsets;
}

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface MobileDetectionState {
  isMobile: boolean;
  orientation: "portrait" | "landscape";
  viewportWidth: number;
  viewportHeight: number;
}

export interface MobileDetectionHook {
  isMobile: boolean;
  orientation: "portrait" | "landscape";
  viewportWidth: number;
  viewportHeight: number;
  isLandscape: boolean;
  isPortrait: boolean;
}
