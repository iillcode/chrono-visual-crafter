// Test file for Enhanced Transition Engine Utilities
// Validates performance monitoring, state management, GPU acceleration, and quality reduction

import {
  EnhancedTransitionEngine,
  PerformanceMonitor,
  TransitionStateManager,
  GPUAccelerationHelper,
  QualityReductionSystem,
  PerformanceSettings,
} from "./utils/transitionEngine";

import {
  enhancedEasingFunctions,
  enhancedTransitionEffects,
  getTransitionEffect,
  getEasingFunction,
} from "./utils/transitionEffects";

import {
  MemoryManager,
  getMemoryManager,
  createMemoryAwareCanvas,
} from "./utils/memoryManager";

// Test configuration
const testSettings: PerformanceSettings = {
  targetFPS: 60,
  maxMemoryUsage: 100, // 100MB
  enableGPUAcceleration: true,
  autoOptimize: true,
  qualityReduction: true,
};

// Test Performance Monitor
export const testPerformanceMonitor = (): void => {
  console.log("🧪 Testing Performance Monitor...");

  const monitor = new PerformanceMonitor(testSettings);

  // Simulate frame rendering
  for (let i = 0; i < 10; i++) {
    monitor.startFrame();

    // Simulate some work
    const start = performance.now();
    while (performance.now() - start < 16) {
      // Simulate 16ms of work (60fps target)
    }

    monitor.endFrame();
  }

  const metrics = monitor.currentMetrics;
  console.log("📊 Performance Metrics:", {
    fps: metrics.fps,
    frameTime: metrics.frameTime.toFixed(2) + "ms",
    memoryUsage: metrics.memoryUsage.toFixed(2) + "MB",
    droppedFrames: metrics.droppedFrames,
  });

  const shouldReduce = monitor.shouldReduceQuality();
  console.log("🎯 Should reduce quality:", shouldReduce);

  const suggestions = monitor.getOptimizationSuggestions();
  console.log("💡 Optimization suggestions:", suggestions);

  monitor.cleanup();
  console.log("✅ Performance Monitor test completed");
};

// Test Transition State Manager
export const testTransitionStateManager = (): void => {
  console.log("🧪 Testing Transition State Manager...");

  const stateManager = new TransitionStateManager();

  // Test digit transitions
  stateManager.updateDigitTransitions("123", "456", "fadeIn");
  console.log(
    "🔄 Active transitions after update:",
    stateManager.hasActiveTransitions()
  );

  // Test getting specific transition
  const transition = stateManager.getActiveTransition(0);
  if (transition) {
    console.log("📝 Transition for digit 0:", {
      oldDigit: transition.oldDigit,
      newDigit: transition.newDigit,
      progress: transition.progress,
    });
  }

  // Simulate progress updates
  for (let i = 0; i < 5; i++) {
    stateManager.updateTransitionProgress();
    console.log(
      `⏱️  Progress update ${i + 1}, has active:`,
      stateManager.hasActiveTransitions()
    );
  }

  stateManager.cleanup();
  console.log("✅ Transition State Manager test completed");
};

// Test GPU Acceleration Helper
export const testGPUAccelerationHelper = (): void => {
  console.log("🧪 Testing GPU Acceleration Helper...");

  const gpuHelper = new GPUAccelerationHelper();

  console.log("🖥️  GPU Support:", gpuHelper.isGPUSupported());

  // Test canvas creation
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;

  const ctx = gpuHelper.createOptimizedContext(canvas);
  if (ctx) {
    console.log("🎨 Optimized context created successfully");
    console.log("🔧 Image smoothing enabled:", ctx.imageSmoothingEnabled);
    console.log("🔧 Image smoothing quality:", ctx.imageSmoothingQuality);
  }

  // Test offscreen buffer
  const offscreenBuffer = gpuHelper.createOffscreenBuffer(400, 300);
  if (offscreenBuffer) {
    console.log("📱 Offscreen buffer created:", {
      width: offscreenBuffer.canvas.width,
      height: offscreenBuffer.canvas.height,
      isOffscreen: offscreenBuffer.canvas instanceof OffscreenCanvas,
    });
  }

  if (ctx) {
    gpuHelper.optimizeCanvasOperations(ctx);
    console.log("⚡ Canvas operations optimized");
  }

  gpuHelper.cleanup();
  console.log("✅ GPU Acceleration Helper test completed");
};

// Test Quality Reduction System
export const testQualityReductionSystem = (): void => {
  console.log("🧪 Testing Quality Reduction System...");

  const monitor = new PerformanceMonitor(testSettings);
  const qualitySystem = new QualityReductionSystem(monitor);

  // Simulate poor performance
  monitor.currentMetrics.fps = 30; // Low FPS
  monitor.currentMetrics.memoryUsage = 150; // High memory

  console.log("📉 Should reduce quality:", qualitySystem.shouldReduceQuality());
  console.log(
    "🎚️  Optimal quality level:",
    qualitySystem.getOptimalQualityLevel()
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const adjustedPixelRatio = qualitySystem.applyQualityReduction(
      ctx,
      window.devicePixelRatio || 1
    );
    console.log("📐 Adjusted pixel ratio:", adjustedPixelRatio);
    console.log("🎨 Image smoothing quality:", ctx.imageSmoothingQuality);
  }

  const qualitySettings = qualitySystem.getQualitySettings();
  console.log("⚙️  Quality settings:", qualitySettings);

  monitor.cleanup();
  console.log("✅ Quality Reduction System test completed");
};

// Test Enhanced Transition Engine
export const testEnhancedTransitionEngine = (): void => {
  console.log("🧪 Testing Enhanced Transition Engine...");

  const engine = new EnhancedTransitionEngine(testSettings);

  // Create test canvas
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  document.body.appendChild(canvas);

  const initialized = engine.initializeRenderingContext(canvas);
  console.log("🚀 Engine initialized:", initialized);

  if (initialized) {
    console.log("🖥️  GPU accelerated:", engine.isGPUAccelerated());

    // Test frame cycle
    engine.startFrame();

    // Simulate transition updates
    engine.updateTransitions("123", "456", "fadeIn");
    console.log("🔄 Has active transitions:", engine.hasActiveTransitions());

    // Test transition state
    const transition = engine.getTransitionState(0);
    if (transition) {
      console.log("📝 Transition state:", {
        oldDigit: transition.oldDigit,
        newDigit: transition.newDigit,
        progress: transition.progress,
      });
    }

    engine.endFrame();

    // Test performance metrics
    const metrics = engine.getPerformanceMetrics();
    console.log("📊 Engine metrics:", {
      fps: metrics.fps,
      memoryUsage: metrics.memoryUsage.toFixed(2) + "MB",
    });

    // Test optimization
    const pixelRatio = engine.applyPerformanceOptimizations();
    console.log("⚡ Applied optimizations, pixel ratio:", pixelRatio);

    const qualitySettings = engine.getQualitySettings();
    console.log("⚙️  Quality settings:", qualitySettings);

    const suggestions = engine.getOptimizationSuggestions();
    console.log("💡 Optimization suggestions:", suggestions);
  }

  // Cleanup
  document.body.removeChild(canvas);
  engine.cleanup();
  console.log("✅ Enhanced Transition Engine test completed");
};

// Test Enhanced Easing Functions
export const testEnhancedEasingFunctions = (): void => {
  console.log("🧪 Testing Enhanced Easing Functions...");

  const testProgress = [0, 0.25, 0.5, 0.75, 1];
  const testEasings = [
    "linear",
    "easeOutQuad",
    "easeInOutCubic",
    "easeOutBounce",
    "easeInOutElastic",
  ];

  testEasings.forEach((easingName) => {
    console.log(`📈 Testing ${easingName}:`);
    const easingFunc = getEasingFunction(easingName);

    const results = testProgress.map((p) => ({
      input: p,
      output: easingFunc(p).toFixed(3),
    }));

    console.log("   Results:", results);
  });

  console.log("✅ Enhanced Easing Functions test completed");
};

// Test Enhanced Transition Effects
export const testEnhancedTransitionEffects = (): void => {
  console.log("🧪 Testing Enhanced Transition Effects...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;

  const testContext = {
    canvas,
    ctx: canvas.getContext("2d")!,
    currentValue: 123,
    settings: { fontSize: 48, endValue: 456 },
    timestamp: performance.now(),
    progress: 0.5,
  };

  const testEffects = [
    "none",
    "fadeIn",
    "fadeRoll",
    "flipDown",
    "bounce",
    "scale",
  ];

  testEffects.forEach((effectName) => {
    console.log(`🎭 Testing ${effectName}:`);
    const effect = getTransitionEffect(effectName);
    const result = effect(testContext);

    console.log("   Result:", {
      x: result.x,
      y: result.y,
      opacity: result.opacity.toFixed(3),
      scale: result.scale?.toFixed(3),
      rotation: result.rotation?.toFixed(3),
    });
  });

  console.log("✅ Enhanced Transition Effects test completed");
};

// Test Memory Manager
export const testMemoryManager = (): void => {
  console.log("🧪 Testing Memory Manager...");

  const memoryManager = getMemoryManager();

  // Test memory stats
  const stats = memoryManager.getMemoryStats();
  if (stats) {
    console.log("💾 Memory stats:", {
      used: (stats.usedJSHeapSize / 1024 / 1024).toFixed(2) + "MB",
      total: (stats.totalJSHeapSize / 1024 / 1024).toFixed(2) + "MB",
      limit: (stats.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + "MB",
      percent: stats.memoryUsagePercent.toFixed(1) + "%",
    });
  }

  // Test canvas registration
  const testCanvas = createMemoryAwareCanvas(800, 600, 10);
  if (testCanvas) {
    console.log("🎨 Memory-aware canvas created:", {
      width: testCanvas.width,
      height: testCanvas.height,
    });

    const canvasInfo = memoryManager.getCanvasMemoryInfo();
    console.log("📊 Canvas memory info:", {
      canvasCount: canvasInfo.canvasCount,
      totalMemory: canvasInfo.totalCanvasMemory.toFixed(2) + "MB",
    });
  }

  // Test memory pressure
  const pressure = memoryManager.getMemoryPressure();
  console.log("⚠️  Memory pressure:", pressure);

  // Test optimization suggestions
  const suggestions = memoryManager.getOptimizationSuggestions();
  console.log("💡 Memory optimization suggestions:", suggestions);

  console.log("✅ Memory Manager test completed");
};

// Run all tests
export const runAllTransitionEngineTests = (): void => {
  console.log("🚀 Starting Enhanced Transition Engine Tests...\n");

  try {
    testPerformanceMonitor();
    console.log("");

    testTransitionStateManager();
    console.log("");

    testGPUAccelerationHelper();
    console.log("");

    testQualityReductionSystem();
    console.log("");

    testEnhancedTransitionEngine();
    console.log("");

    testEnhancedEasingFunctions();
    console.log("");

    testEnhancedTransitionEffects();
    console.log("");

    testMemoryManager();
    console.log("");

    console.log(
      "🎉 All Enhanced Transition Engine Tests Completed Successfully!"
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Auto-run tests if this file is executed directly
if (typeof window !== "undefined") {
  // Add a global function to run tests from browser console
  (
    window as unknown as { runTransitionEngineTests: () => void }
  ).runTransitionEngineTests = runAllTransitionEngineTests;
  console.log("💡 Run tests by calling: runTransitionEngineTests()");
}
