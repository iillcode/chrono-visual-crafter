/**
 * Test file for performance monitoring and optimization system
 */

import {
  performanceMonitor,
  PerformanceMetrics,
} from "./utils/performanceMonitor";
import {
  performanceOptimizer,
  QualitySettings,
} from "./utils/performanceOptimizer";
import { memoryManager } from "./utils/memoryManager";

// Test performance monitoring
console.log("Testing Performance Monitoring System...");

// Test 1: Basic performance monitoring
console.log("\n1. Testing basic performance monitoring...");
performanceMonitor.startMonitoring();

// Subscribe to performance updates
const unsubscribe = performanceMonitor.subscribe(
  (metrics: PerformanceMetrics) => {
    console.log("Performance Metrics:", {
      fps: Math.round(metrics.fps),
      averageFps: Math.round(metrics.averageFps),
      renderTime: metrics.renderTime.toFixed(2) + "ms",
      memoryUsage: metrics.memoryUsage.percentage.toFixed(1) + "%",
      frameDrops: metrics.frameDrops,
    });
  }
);

// Simulate some render operations
let renderCount = 0;
const simulateRendering = () => {
  const startTime = performance.now();

  // Simulate some work
  const iterations = Math.random() * 1000000;
  for (let i = 0; i < iterations; i++) {
    Math.random();
  }

  performanceMonitor.recordRenderTime(startTime);
  renderCount++;

  if (renderCount < 10) {
    setTimeout(simulateRendering, 100);
  } else {
    console.log("✓ Basic performance monitoring test completed");
    testOptimizer();
  }
};

setTimeout(simulateRendering, 1000);

// Test 2: Performance optimizer
function testOptimizer() {
  console.log("\n2. Testing performance optimizer...");

  // Configure optimizer
  performanceOptimizer.configure({
    autoOptimize: true,
    qualityReduction: true,
    effectsDisabling: true,
    resolutionScaling: true,
    complexityReduction: true,
  });

  // Set original quality
  const originalQuality: QualitySettings = {
    renderQuality: 1.0,
    enableAntiAliasing: true,
    enableSubPixelRendering: true,
    maxParticles: 1000,
    effectComplexity: "high",
    canvasScale: 1.0,
  };

  performanceOptimizer.setOriginalQuality(originalQuality);

  // Subscribe to quality changes
  const unsubscribeOptimizer = performanceOptimizer.subscribe(
    (quality: QualitySettings) => {
      console.log("Quality Settings Updated:", {
        renderQuality: quality.renderQuality,
        antiAliasing: quality.enableAntiAliasing,
        subPixelRendering: quality.enableSubPixelRendering,
        maxParticles: quality.maxParticles,
        effectComplexity: quality.effectComplexity,
        canvasScale: quality.canvasScale,
      });
    }
  );

  // Test optimization suggestions
  const optimizations = performanceMonitor.getOptimizationSuggestions();
  console.log("Optimization Suggestions:", optimizations);

  // Test should optimize check
  const shouldOptimize = performanceMonitor.shouldOptimize();
  console.log("Should Optimize:", shouldOptimize);

  // Get optimization status
  const status = performanceOptimizer.getOptimizationStatus();
  console.log("Optimization Status:", status);

  console.log("✓ Performance optimizer test completed");

  setTimeout(() => {
    unsubscribeOptimizer();
    testMemoryManager();
  }, 2000);
}

// Test 3: Memory manager
function testMemoryManager() {
  console.log("\n3. Testing memory manager...");

  // Test canvas caching
  const canvas1 = document.createElement("canvas");
  canvas1.width = 800;
  canvas1.height = 600;
  memoryManager.cacheCanvas("test-canvas-1", canvas1);

  const canvas2 = document.createElement("canvas");
  canvas2.width = 1920;
  canvas2.height = 1080;
  memoryManager.cacheCanvas("test-canvas-2", canvas2);

  // Test image caching
  const img1 = new Image();
  img1.width = 100;
  img1.height = 100;
  memoryManager.cacheImage("test-image-1", img1);

  // Test font tracking
  memoryManager.trackFont("Arial");
  memoryManager.trackFont("Helvetica");

  // Get memory usage
  const memoryUsage = memoryManager.getMemoryUsage();
  console.log("Memory Usage:", {
    canvasMemory: (memoryUsage.canvasMemory / 1024 / 1024).toFixed(2) + " MB",
    imageMemory: (memoryUsage.imageMemory / 1024 / 1024).toFixed(2) + " MB",
    fontMemory: (memoryUsage.fontMemory / 1024 / 1024).toFixed(2) + " MB",
    totalMemory: (memoryUsage.totalMemory / 1024 / 1024).toFixed(2) + " MB",
  });

  // Get cache stats
  const cacheStats = memoryManager.getCacheStats();
  console.log("Cache Stats:", {
    canvasCacheSize: cacheStats.canvasCacheSize,
    imageCacheSize: cacheStats.imageCacheSize,
    fontCacheSize: cacheStats.fontCacheSize,
  });

  // Test cleanup
  const shouldCleanup = memoryManager.shouldCleanup();
  console.log("Should Cleanup:", shouldCleanup);

  if (shouldCleanup) {
    memoryManager.cleanup();
    console.log("Memory cleanup performed");
  }

  console.log("✓ Memory manager test completed");

  // Cleanup
  setTimeout(() => {
    unsubscribe();
    performanceMonitor.stopMonitoring();
    memoryManager.destroy();
    console.log("\n✓ All performance monitoring tests completed successfully!");
  }, 1000);
}

// Test error handling
window.addEventListener("error", (event) => {
  console.error("Test error:", event.error);
});

// Test memory pressure simulation
function simulateMemoryPressure() {
  console.log("\n4. Simulating memory pressure...");

  // Create many large canvases to simulate memory pressure
  for (let i = 0; i < 100; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    memoryManager.cacheCanvas(`pressure-test-${i}`, canvas);
  }

  const memoryUsage = memoryManager.getMemoryUsage();
  console.log("Memory usage after pressure test:", {
    totalMemory: (memoryUsage.totalMemory / 1024 / 1024).toFixed(2) + " MB",
  });

  // Test automatic cleanup
  if (memoryManager.shouldCleanup()) {
    console.log("Automatic cleanup triggered");
    memoryManager.cleanup();
  }

  console.log("✓ Memory pressure test completed");
}

// Run memory pressure test after a delay
setTimeout(simulateMemoryPressure, 5000);
