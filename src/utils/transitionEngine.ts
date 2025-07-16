// Enhanced Transition Engine Utilities
// Performance monitoring, state management, and GPU acceleration for counter transitions

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  droppedFrames: number;
  renderTime: number;
}

export interface TransitionState {
  activeTransitions: Map<number, DigitTransition>;
  transitionQueue: TransitionEvent[];
  performanceMetrics: PerformanceMetrics;
  renderingContext: RenderingContext;
}

export interface DigitTransition {
  oldDigit: string;
  newDigit: string;
  startTime: number;
  duration: number;
  progress: number;
  easing: string;
}

export interface TransitionEvent {
  digitIndex: number;
  oldValue: string;
  newValue: string;
  timestamp: number;
  transitionType: string;
}

export interface RenderingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  offscreenCanvas?: OffscreenCanvas;
  offscreenCtx?: OffscreenCanvasRenderingContext2D;
  gpuAccelerated: boolean;
  devicePixelRatio: number;
}

export interface PerformanceSettings {
  targetFPS: number;
  maxMemoryUsage: number;
  enableGPUAcceleration: boolean;
  autoOptimize: boolean;
  qualityReduction: boolean;
}

export interface OptimizationSuggestions {
  reduceQuality: boolean;
  disableEffects: boolean;
  lowerFrameRate: boolean;
  simplifyTransitions: boolean;
  reason: string;
}

// Performance Monitor Class
export class PerformanceMonitor {
  private frameCount = 0;
  private lastFPSCheck = 0;
  private frameStartTime = 0;
  private droppedFrames = 0;
  private renderTimes: number[] = [];
  private memoryCheckInterval: number | null = null;

  public currentMetrics: PerformanceMetrics = {
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    droppedFrames: 0,
    renderTime: 0,
  };

  constructor(private settings: PerformanceSettings) {
    this.startMemoryMonitoring();
  }

  startFrame(): void {
    this.frameStartTime = performance.now();
  }

  endFrame(): void {
    const frameTime = performance.now() - this.frameStartTime;
    this.renderTimes.push(frameTime);

    // Keep only last 60 frame times for rolling average
    if (this.renderTimes.length > 60) {
      this.renderTimes.shift();
    }

    this.frameCount++;

    // Update FPS every second
    const now = performance.now();
    if (now - this.lastFPSCheck >= 1000) {
      this.currentMetrics.fps = this.frameCount;
      this.currentMetrics.frameTime =
        this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
      this.currentMetrics.renderTime = Math.max(...this.renderTimes);

      // Check for dropped frames
      if (this.currentMetrics.fps < this.settings.targetFPS * 0.8) {
        this.droppedFrames += this.settings.targetFPS - this.currentMetrics.fps;
      }

      this.currentMetrics.droppedFrames = this.droppedFrames;

      this.frameCount = 0;
      this.lastFPSCheck = now;
    }
  }

  private startMemoryMonitoring(): void {
    if ("memory" in performance) {
      this.memoryCheckInterval = window.setInterval(() => {
        const memory = (
          performance as unknown as { memory: { usedJSHeapSize: number } }
        ).memory;
        this.currentMetrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      }, 1000);
    }
  }

  shouldReduceQuality(): boolean {
    return (
      this.currentMetrics.fps < this.settings.targetFPS * 0.75 ||
      this.currentMetrics.memoryUsage > this.settings.maxMemoryUsage ||
      this.currentMetrics.renderTime > 33 // More than 2 frames worth of time
    );
  }

  getOptimizationSuggestions(): OptimizationSuggestions {
    const suggestions: OptimizationSuggestions = {
      reduceQuality: false,
      disableEffects: false,
      lowerFrameRate: false,
      simplifyTransitions: false,
      reason: "",
    };

    if (this.currentMetrics.fps < 30) {
      suggestions.reduceQuality = true;
      suggestions.disableEffects = true;
      suggestions.simplifyTransitions = true;
      suggestions.reason = "Severe performance issues detected";
    } else if (this.currentMetrics.fps < 45) {
      suggestions.reduceQuality = true;
      suggestions.reason = "Low frame rate detected";
    } else if (this.currentMetrics.memoryUsage > this.settings.maxMemoryUsage) {
      suggestions.disableEffects = true;
      suggestions.reason = "High memory usage detected";
    } else if (this.currentMetrics.renderTime > 25) {
      suggestions.lowerFrameRate = true;
      suggestions.reason = "High render time detected";
    }

    return suggestions;
  }

  cleanup(): void {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
  }
}

// Transition State Manager Class
export class TransitionStateManager {
  private activeTransitions = new Map<number, DigitTransition>();
  private transitionQueue: TransitionEvent[] = [];
  private cleanupInterval: number | null = null;

  constructor() {
    this.startCleanupTimer();
  }

  updateDigitTransitions(
    oldValue: string,
    newValue: string,
    transitionType: string
  ): void {
    const currentTime = performance.now();
    const maxLength = Math.max(oldValue.length, newValue.length);

    // Clear completed transitions
    this.cleanupCompletedTransitions();

    // Add new transitions for changed digits
    for (let i = 0; i < maxLength; i++) {
      const oldDigit = oldValue[i] || "";
      const newDigit = newValue[i] || "";

      if (oldDigit !== newDigit && !this.activeTransitions.has(i)) {
        const transition: DigitTransition = {
          oldDigit,
          newDigit,
          startTime: currentTime,
          duration: this.getTransitionDuration(transitionType),
          progress: 0,
          easing: "easeOut",
        };

        this.activeTransitions.set(i, transition);

        // Add to queue for processing
        this.transitionQueue.push({
          digitIndex: i,
          oldValue: oldDigit,
          newValue: newDigit,
          timestamp: currentTime,
          transitionType,
        });
      }
    }
  }

  updateTransitionProgress(): void {
    const currentTime = performance.now();

    this.activeTransitions.forEach((transition, index) => {
      const elapsed = currentTime - transition.startTime;
      transition.progress = Math.min(elapsed / transition.duration, 1);

      if (transition.progress >= 1) {
        this.activeTransitions.delete(index);
      }
    });
  }

  getActiveTransition(digitIndex: number): DigitTransition | undefined {
    return this.activeTransitions.get(digitIndex);
  }

  hasActiveTransitions(): boolean {
    return this.activeTransitions.size > 0;
  }

  private getTransitionDuration(transitionType: string): number {
    const durations: Record<string, number> = {
      none: 0,
      fadeIn: 300,
      "fade-roll": 500,
      "flip-down": 400,
      "slide-vertical": 350,
      bounce: 600,
      scale: 300,
      slideUp: 400,
      slideDown: 400,
      glitch: 250,
      blur: 200,
      typewriter: 100,
      odometer: 800,
    };

    return durations[transitionType] || 400;
  }

  private cleanupCompletedTransitions(): void {
    const currentTime = performance.now();
    const toRemove: number[] = [];

    this.activeTransitions.forEach((transition, index) => {
      if (currentTime - transition.startTime > transition.duration + 100) {
        toRemove.push(index);
      }
    });

    toRemove.forEach((index) => this.activeTransitions.delete(index));
  }

  private startCleanupTimer(): void {
    this.cleanupInterval = window.setInterval(() => {
      this.cleanupCompletedTransitions();
    }, 1000);
  }

  cleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.activeTransitions.clear();
    this.transitionQueue = [];
  }
}

// GPU Acceleration Helper Class
export class GPUAccelerationHelper {
  private offscreenCanvas: OffscreenCanvas | null = null;
  private offscreenCtx: OffscreenCanvasRenderingContext2D | null = null;
  private gpuSupported = false;

  constructor() {
    this.detectGPUSupport();
  }

  private detectGPUSupport(): boolean {
    try {
      // Check for OffscreenCanvas support
      if (typeof OffscreenCanvas !== "undefined") {
        this.offscreenCanvas = new OffscreenCanvas(800, 600);
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
        this.gpuSupported = true;
      }

      // Check for WebGL support as additional GPU indicator
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      return this.gpuSupported && !!gl;
    } catch (error) {
      console.warn("GPU acceleration not available:", error);
      return false;
    }
  }

  isGPUSupported(): boolean {
    return this.gpuSupported;
  }

  createOptimizedContext(
    canvas: HTMLCanvasElement
  ): CanvasRenderingContext2D | null {
    const contextOptions: CanvasRenderingContext2DSettings = {
      alpha: true,
      desynchronized: true, // Allow async rendering
      willReadFrequently: false, // Optimize for write operations
    };

    const ctx = canvas.getContext("2d", contextOptions);

    if (ctx && this.gpuSupported) {
      // Enable hardware acceleration hints
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Set optimal text rendering
      if ("textRenderingOptimization" in ctx) {
        (ctx as any).textRenderingOptimization = "optimizeQuality";
      }
    }

    return ctx;
  }

  createOffscreenBuffer(
    width: number,
    height: number
  ): {
    canvas: OffscreenCanvas | HTMLCanvasElement;
    ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
  } | null {
    try {
      if (this.gpuSupported && typeof OffscreenCanvas !== "undefined") {
        const offscreenCanvas = new OffscreenCanvas(width, height);
        const offscreenCtx = offscreenCanvas.getContext("2d");

        if (offscreenCtx) {
          return {
            canvas: offscreenCanvas,
            ctx: offscreenCtx,
          };
        }
      }

      // Fallback to regular canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        return { canvas, ctx };
      }
    } catch (error) {
      console.warn("Failed to create offscreen buffer:", error);
    }

    return null;
  }

  optimizeCanvasOperations(ctx: CanvasRenderingContext2D): void {
    // Batch canvas operations for better performance
    ctx.save();

    // Use optimal composite operations
    ctx.globalCompositeOperation = "source-over";

    // Enable sub-pixel rendering
    ctx.imageSmoothingEnabled = true;

    // Optimize for frequent text rendering
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }

  cleanup(): void {
    this.offscreenCanvas = null;
    this.offscreenCtx = null;
  }
}

// Quality Reduction System Class
export class QualityReductionSystem {
  private currentQualityLevel = 1.0; // 1.0 = full quality, 0.5 = half quality
  private reductionActive = false;

  constructor(private performanceMonitor: PerformanceMonitor) {}

  shouldReduceQuality(): boolean {
    return this.performanceMonitor.shouldReduceQuality();
  }

  getOptimalQualityLevel(): number {
    const metrics = this.performanceMonitor.currentMetrics;

    if (metrics.fps >= 55) {
      return 1.0; // Full quality
    } else if (metrics.fps >= 45) {
      return 0.8; // Slight reduction
    } else if (metrics.fps >= 30) {
      return 0.6; // Moderate reduction
    } else {
      return 0.4; // Significant reduction
    }
  }

  applyQualityReduction(
    ctx: CanvasRenderingContext2D,
    devicePixelRatio: number
  ): number {
    const optimalQuality = this.getOptimalQualityLevel();

    if (optimalQuality < this.currentQualityLevel) {
      this.currentQualityLevel = optimalQuality;
      this.reductionActive = true;
    } else if (
      optimalQuality > this.currentQualityLevel &&
      this.reductionActive
    ) {
      // Gradually increase quality back
      this.currentQualityLevel = Math.min(
        this.currentQualityLevel + 0.1,
        optimalQuality
      );

      if (this.currentQualityLevel >= 1.0) {
        this.reductionActive = false;
      }
    }

    // Apply quality settings
    const adjustedPixelRatio = devicePixelRatio * this.currentQualityLevel;

    // Adjust image smoothing quality
    if (this.currentQualityLevel < 0.7) {
      ctx.imageSmoothingQuality = "low";
    } else if (this.currentQualityLevel < 0.9) {
      ctx.imageSmoothingQuality = "medium";
    } else {
      ctx.imageSmoothingQuality = "high";
    }

    return adjustedPixelRatio;
  }

  getCurrentQualityLevel(): number {
    return this.currentQualityLevel;
  }

  isReductionActive(): boolean {
    return this.reductionActive;
  }

  getQualitySettings(): {
    antiAliasing: boolean;
    subPixelRendering: boolean;
    shadowEffects: boolean;
    complexTransitions: boolean;
  } {
    return {
      antiAliasing: this.currentQualityLevel >= 0.7,
      subPixelRendering: this.currentQualityLevel >= 0.8,
      shadowEffects: this.currentQualityLevel >= 0.6,
      complexTransitions: this.currentQualityLevel >= 0.5,
    };
  }
}

// Enhanced Transition Engine Main Class
export class EnhancedTransitionEngine {
  private performanceMonitor: PerformanceMonitor;
  private stateManager: TransitionStateManager;
  private gpuHelper: GPUAccelerationHelper;
  private qualitySystem: QualityReductionSystem;
  private renderingContext: RenderingContext | null = null;

  constructor(settings: PerformanceSettings) {
    this.performanceMonitor = new PerformanceMonitor(settings);
    this.stateManager = new TransitionStateManager();
    this.gpuHelper = new GPUAccelerationHelper();
    this.qualitySystem = new QualityReductionSystem(this.performanceMonitor);
  }

  initializeRenderingContext(canvas: HTMLCanvasElement): boolean {
    const ctx = this.gpuHelper.createOptimizedContext(canvas);
    if (!ctx) return false;

    this.renderingContext = {
      canvas,
      ctx,
      gpuAccelerated: this.gpuHelper.isGPUSupported(),
      devicePixelRatio: window.devicePixelRatio || 1,
    };

    return true;
  }

  startFrame(): void {
    this.performanceMonitor.startFrame();
  }

  endFrame(): void {
    this.performanceMonitor.endFrame();
    this.stateManager.updateTransitionProgress();
  }

  updateTransitions(
    oldValue: string,
    newValue: string,
    transitionType: string
  ): void {
    this.stateManager.updateDigitTransitions(
      oldValue,
      newValue,
      transitionType
    );
  }

  getTransitionState(digitIndex: number): DigitTransition | undefined {
    return this.stateManager.getActiveTransition(digitIndex);
  }

  hasActiveTransitions(): boolean {
    return this.stateManager.hasActiveTransitions();
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMonitor.currentMetrics;
  }

  getOptimizationSuggestions(): OptimizationSuggestions {
    return this.performanceMonitor.getOptimizationSuggestions();
  }

  applyPerformanceOptimizations(): number {
    if (!this.renderingContext) return 1;

    return this.qualitySystem.applyQualityReduction(
      this.renderingContext.ctx,
      this.renderingContext.devicePixelRatio
    );
  }

  getQualitySettings() {
    return this.qualitySystem.getQualitySettings();
  }

  isGPUAccelerated(): boolean {
    return this.renderingContext?.gpuAccelerated || false;
  }

  cleanup(): void {
    this.performanceMonitor.cleanup();
    this.stateManager.cleanup();
    this.gpuHelper.cleanup();
  }
}
