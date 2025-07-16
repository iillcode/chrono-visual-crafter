/**
 * Performance monitoring system for real-time frame rate and memory tracking
 */

export interface PerformanceMetrics {
  fps: number;
  averageFps: number;
  memoryUsage: MemoryStats;
  renderTime: number;
  frameDrops: number;
  timestamp: number;
}

export interface MemoryStats {
  used: number;
  total: number;
  percentage: number;
  jsHeapSizeLimit?: number;
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
}

export interface PerformanceOptimization {
  type: "quality" | "complexity" | "resolution" | "effects";
  suggestion: string;
  impact: "low" | "medium" | "high";
  autoApply: boolean;
}

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  private renderTimes: number[] = [];
  private frameDropThreshold = 50; // fps threshold for frame drops
  private maxHistorySize = 60; // Keep 1 second of history at 60fps
  private isMonitoring = false;
  private animationFrameId?: number;
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor() {
    this.bindMethods();
  }

  private bindMethods() {
    this.tick = this.tick.bind(this);
  }

  /**
   * Start monitoring performance metrics
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.renderTimes = [];

    this.tick();
  }

  /**
   * Stop monitoring performance metrics
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  /**
   * Subscribe to performance metric updates
   */
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Record render time for performance tracking
   */
  recordRenderTime(startTime: number): void {
    const renderTime = performance.now() - startTime;
    this.renderTimes.push(renderTime);

    if (this.renderTimes.length > this.maxHistorySize) {
      this.renderTimes.shift();
    }
  }

  /**
   * Get current performance metrics
   */
  getCurrentMetrics(): PerformanceMetrics {
    const currentFps = this.calculateCurrentFps();
    const averageFps = this.calculateAverageFps();
    const memoryUsage = this.getMemoryStats();
    const averageRenderTime = this.calculateAverageRenderTime();
    const frameDrops = this.countFrameDrops();

    return {
      fps: currentFps,
      averageFps,
      memoryUsage,
      renderTime: averageRenderTime,
      frameDrops,
      timestamp: performance.now(),
    };
  }

  /**
   * Get performance optimization suggestions
   */
  getOptimizationSuggestions(): PerformanceOptimization[] {
    const metrics = this.getCurrentMetrics();
    const suggestions: PerformanceOptimization[] = [];

    // Low FPS suggestions
    if (metrics.averageFps < 30) {
      suggestions.push({
        type: "quality",
        suggestion: "Reduce rendering quality to improve performance",
        impact: "high",
        autoApply: true,
      });
    } else if (metrics.averageFps < 45) {
      suggestions.push({
        type: "complexity",
        suggestion: "Simplify transition effects for better performance",
        impact: "medium",
        autoApply: false,
      });
    }

    // High memory usage suggestions
    if (metrics.memoryUsage.percentage > 80) {
      suggestions.push({
        type: "effects",
        suggestion: "Disable particle effects to reduce memory usage",
        impact: "medium",
        autoApply: false,
      });
    }

    // High render time suggestions
    if (metrics.renderTime > 16) {
      // 16ms = 60fps threshold
      suggestions.push({
        type: "resolution",
        suggestion: "Reduce canvas resolution for faster rendering",
        impact: "medium",
        autoApply: false,
      });
    }

    // Frame drops suggestions
    if (metrics.frameDrops > 5) {
      suggestions.push({
        type: "quality",
        suggestion: "Enable automatic quality reduction during heavy load",
        impact: "high",
        autoApply: true,
      });
    }

    return suggestions;
  }

  /**
   * Check if performance optimization is needed
   */
  shouldOptimize(): boolean {
    const metrics = this.getCurrentMetrics();
    return (
      metrics.averageFps < 45 ||
      metrics.memoryUsage.percentage > 75 ||
      metrics.renderTime > 20 ||
      metrics.frameDrops > 3
    );
  }

  private tick(): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000) {
      // Update every second
      const currentFps = (this.frameCount * 1000) / deltaTime;
      this.fpsHistory.push(currentFps);

      if (this.fpsHistory.length > this.maxHistorySize) {
        this.fpsHistory.shift();
      }

      this.frameCount = 0;
      this.lastTime = currentTime;

      // Notify subscribers
      const metrics = this.getCurrentMetrics();
      this.callbacks.forEach((callback) => callback(metrics));
    }

    this.frameCount++;
    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  private calculateCurrentFps(): number {
    return this.fpsHistory.length > 0
      ? this.fpsHistory[this.fpsHistory.length - 1]
      : 0;
  }

  private calculateAverageFps(): number {
    if (this.fpsHistory.length === 0) return 0;
    const sum = this.fpsHistory.reduce((acc, fps) => acc + fps, 0);
    return sum / this.fpsHistory.length;
  }

  private calculateAverageRenderTime(): number {
    if (this.renderTimes.length === 0) return 0;
    const sum = this.renderTimes.reduce((acc, time) => acc + time, 0);
    return sum / this.renderTimes.length;
  }

  private countFrameDrops(): number {
    return this.fpsHistory.filter((fps) => fps < this.frameDropThreshold)
      .length;
  }

  private getMemoryStats(): MemoryStats {
    // Use performance.memory if available (Chrome)
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
      };
    }

    // Fallback for browsers without performance.memory
    return {
      used: 0,
      total: 0,
      percentage: 0,
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
