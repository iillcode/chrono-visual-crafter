/**
 * Performance optimization manager for automatic quality adjustments
 */

import {
  performanceMonitor,
  PerformanceOptimization,
} from "./performanceMonitor";

export interface OptimizationSettings {
  autoOptimize: boolean;
  qualityReduction: boolean;
  effectsDisabling: boolean;
  resolutionScaling: boolean;
  complexityReduction: boolean;
}

export interface QualitySettings {
  renderQuality: number; // 0.1 to 1.0
  enableAntiAliasing: boolean;
  enableSubPixelRendering: boolean;
  maxParticles: number;
  effectComplexity: "low" | "medium" | "high";
  canvasScale: number; // 0.5 to 1.0
}

export class PerformanceOptimizer {
  private settings: OptimizationSettings = {
    autoOptimize: true,
    qualityReduction: true,
    effectsDisabling: true,
    resolutionScaling: true,
    complexityReduction: true,
  };

  private originalQuality: QualitySettings = {
    renderQuality: 1.0,
    enableAntiAliasing: true,
    enableSubPixelRendering: true,
    maxParticles: 1000,
    effectComplexity: "high",
    canvasScale: 1.0,
  };

  private currentQuality: QualitySettings = { ...this.originalQuality };
  private optimizationCallbacks: ((quality: QualitySettings) => void)[] = [];
  private isOptimizing = false;
  private optimizationLevel = 0; // 0 = no optimization, 3 = maximum optimization

  constructor() {
    this.bindMethods();
  }

  private bindMethods() {
    this.checkAndOptimize = this.checkAndOptimize.bind(this);
  }

  /**
   * Configure optimization settings
   */
  configure(settings: Partial<OptimizationSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  /**
   * Set original quality settings
   */
  setOriginalQuality(quality: Partial<QualitySettings>): void {
    this.originalQuality = { ...this.originalQuality, ...quality };
    if (!this.isOptimizing) {
      this.currentQuality = { ...this.originalQuality };
    }
  }

  /**
   * Subscribe to quality changes
   */
  subscribe(callback: (quality: QualitySettings) => void): () => void {
    this.optimizationCallbacks.push(callback);
    return () => {
      const index = this.optimizationCallbacks.indexOf(callback);
      if (index > -1) {
        this.optimizationCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Start automatic optimization monitoring
   */
  startOptimization(): void {
    if (!this.settings.autoOptimize) return;

    // Subscribe to performance metrics
    performanceMonitor.subscribe(this.checkAndOptimize);
  }

  /**
   * Stop automatic optimization
   */
  stopOptimization(): void {
    // Reset to original quality
    this.resetQuality();
  }

  /**
   * Apply specific optimization
   */
  applyOptimization(optimization: PerformanceOptimization): void {
    switch (optimization.type) {
      case "quality":
        this.reduceRenderQuality();
        break;
      case "complexity":
        this.reduceComplexity();
        break;
      case "resolution":
        this.reduceResolution();
        break;
      case "effects":
        this.disableEffects();
        break;
    }
  }

  /**
   * Get current quality settings
   */
  getCurrentQuality(): QualitySettings {
    return { ...this.currentQuality };
  }

  /**
   * Reset to original quality
   */
  resetQuality(): void {
    this.currentQuality = { ...this.originalQuality };
    this.optimizationLevel = 0;
    this.isOptimizing = false;
    this.notifyCallbacks();
  }

  /**
   * Get optimization status
   */
  getOptimizationStatus(): {
    isOptimizing: boolean;
    level: number;
    appliedOptimizations: string[];
  } {
    const appliedOptimizations: string[] = [];

    if (
      this.currentQuality.renderQuality < this.originalQuality.renderQuality
    ) {
      appliedOptimizations.push("Reduced render quality");
    }
    if (
      !this.currentQuality.enableAntiAliasing &&
      this.originalQuality.enableAntiAliasing
    ) {
      appliedOptimizations.push("Disabled anti-aliasing");
    }
    if (this.currentQuality.maxParticles < this.originalQuality.maxParticles) {
      appliedOptimizations.push("Reduced particle count");
    }
    if (this.currentQuality.canvasScale < this.originalQuality.canvasScale) {
      appliedOptimizations.push("Reduced canvas resolution");
    }
    if (
      this.currentQuality.effectComplexity !==
      this.originalQuality.effectComplexity
    ) {
      appliedOptimizations.push("Reduced effect complexity");
    }

    return {
      isOptimizing: this.isOptimizing,
      level: this.optimizationLevel,
      appliedOptimizations,
    };
  }

  private checkAndOptimize(): void {
    if (!this.settings.autoOptimize) return;

    const shouldOptimize = performanceMonitor.shouldOptimize();
    const metrics = performanceMonitor.getCurrentMetrics();

    if (shouldOptimize && metrics) {
      // Determine optimization level based on performance
      let targetLevel = 0;

      if (metrics.averageFps < 20) {
        targetLevel = 3; // Maximum optimization
      } else if (metrics.averageFps < 30) {
        targetLevel = 2; // High optimization
      } else if (metrics.averageFps < 45) {
        targetLevel = 1; // Light optimization
      }

      if (targetLevel > this.optimizationLevel) {
        this.increaseOptimization(targetLevel);
      }
    } else if (!shouldOptimize && this.optimizationLevel > 0) {
      // Performance is good, reduce optimization
      this.decreaseOptimization();
    }
  }

  private increaseOptimization(targetLevel: number): void {
    this.isOptimizing = true;

    while (this.optimizationLevel < targetLevel) {
      this.optimizationLevel++;
      this.applyOptimizationLevel(this.optimizationLevel);
    }

    this.notifyCallbacks();
  }

  private decreaseOptimization(): void {
    if (this.optimizationLevel > 0) {
      this.optimizationLevel--;

      if (this.optimizationLevel === 0) {
        this.resetQuality();
      } else {
        this.applyOptimizationLevel(this.optimizationLevel);
        this.notifyCallbacks();
      }
    }
  }

  private applyOptimizationLevel(level: number): void {
    switch (level) {
      case 1: // Light optimization
        if (this.settings.qualityReduction) {
          this.currentQuality.renderQuality = Math.max(
            0.8,
            this.originalQuality.renderQuality * 0.8
          );
        }
        break;

      case 2: // Medium optimization
        if (this.settings.qualityReduction) {
          this.currentQuality.renderQuality = Math.max(
            0.6,
            this.originalQuality.renderQuality * 0.6
          );
          this.currentQuality.enableAntiAliasing = false;
        }
        if (this.settings.effectsDisabling) {
          this.currentQuality.maxParticles = Math.floor(
            this.originalQuality.maxParticles * 0.5
          );
        }
        break;

      case 3: // Maximum optimization
        if (this.settings.qualityReduction) {
          this.currentQuality.renderQuality = 0.4;
          this.currentQuality.enableAntiAliasing = false;
          this.currentQuality.enableSubPixelRendering = false;
        }
        if (this.settings.effectsDisabling) {
          this.currentQuality.maxParticles = Math.floor(
            this.originalQuality.maxParticles * 0.2
          );
          this.currentQuality.effectComplexity = "low";
        }
        if (this.settings.resolutionScaling) {
          this.currentQuality.canvasScale = 0.7;
        }
        break;
    }
  }

  private reduceRenderQuality(): void {
    this.currentQuality.renderQuality = Math.max(
      0.5,
      this.currentQuality.renderQuality * 0.8
    );
    this.currentQuality.enableAntiAliasing = false;
    this.notifyCallbacks();
  }

  private reduceComplexity(): void {
    if (this.currentQuality.effectComplexity === "high") {
      this.currentQuality.effectComplexity = "medium";
    } else if (this.currentQuality.effectComplexity === "medium") {
      this.currentQuality.effectComplexity = "low";
    }
    this.notifyCallbacks();
  }

  private reduceResolution(): void {
    this.currentQuality.canvasScale = Math.max(
      0.5,
      this.currentQuality.canvasScale * 0.8
    );
    this.notifyCallbacks();
  }

  private disableEffects(): void {
    this.currentQuality.maxParticles = Math.floor(
      this.currentQuality.maxParticles * 0.5
    );
    this.currentQuality.enableSubPixelRendering = false;
    this.notifyCallbacks();
  }

  private notifyCallbacks(): void {
    this.optimizationCallbacks.forEach((callback) =>
      callback(this.currentQuality)
    );
  }
}

// Global performance optimizer instance
export const performanceOptimizer = new PerformanceOptimizer();
