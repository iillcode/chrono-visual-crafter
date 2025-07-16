// Test file for Liquid Morph Transition Effect
// Validates the Liquid Morph transition implementation

import {
  LiquidMorphTransition,
  LiquidMorphSettings,
  LiquidMorphPresets,
  createLiquidMorphTransition,
} from "./utils/liquidMorphTransition";

import {
  AdvancedTransitionManager,
  AdvancedTransitionPresets,
  createAdvancedTransitionManager,
} from "./utils/advancedTransitionIntegration";

// Test Liquid Morph Transition
export const testLiquidMorphTransition = (): void => {
  console.log("🧪 Testing Liquid Morph Transition...");

  // Create test canvas
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test basic initialization
  const liquidMorph = createLiquidMorphTransition(canvas, ctx);
  console.log("✅ Liquid Morph transition created");

  // Test initialization with source and target numbers
  const sourceNumber = "123";
  const targetNumber = "456";
  const fontSize = 48;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  liquidMorph.initialize(
    sourceNumber,
    targetNumber,
    fontSize,
    centerX,
    centerY
  );
  console.log(
    "✅ Liquid Morph initialized with source:",
    sourceNumber,
    "target:",
    targetNumber
  );

  // Test settings update
  const customSettings: Partial<LiquidMorphSettings> = {
    viscosity: 1.2,
    surfaceTension: 0.8,
    flowSpeed: 4,
    colorScheme: "ocean",
    glowEffect: true,
    rippleEffect: true,
  };
  liquidMorph.updateSettings(customSettings);
  console.log("✅ Liquid Morph settings updated");

  // Test rendering (simulate animation phases)
  console.log("🎬 Simulating animation phases...");

  for (let i = 0; i < 10; i++) {
    liquidMorph.render("#FFFFFF");
    const progress = liquidMorph.getProgress();
    const phase = liquidMorph.getCurrentPhase();
    console.log(
      `📊 Frame ${i + 1}: Progress ${progress.toFixed(2)}, Phase: ${phase}`
    );

    // Simulate time passing
    setTimeout(() => {}, 100);
  }

  // Test performance metrics
  const metrics = liquidMorph.getPerformanceMetrics();
  console.log("📈 Performance metrics:", {
    fluidPoints: metrics.fluidPoints,
    bezierCurves: metrics.bezierCurves,
    currentPhase: metrics.currentPhase,
    renderCalls: metrics.renderCalls,
  });

  // Test completion check
  console.log("🏁 Is complete:", liquidMorph.isComplete());

  // Test reset
  liquidMorph.reset();
  console.log("🔄 Liquid Morph reset, progress:", liquidMorph.getProgress());

  // Test cleanup
  liquidMorph.cleanup();
  console.log("🧹 Liquid Morph cleaned up");

  console.log("✅ Liquid Morph Transition test completed");
};

// Test Liquid Morph Presets
export const testLiquidMorphPresets = (): void => {
  console.log("🧪 Testing Liquid Morph Presets...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  const presetNames = Object.keys(LiquidMorphPresets) as Array<
    keyof typeof LiquidMorphPresets
  >;

  presetNames.forEach((presetName) => {
    console.log(`🎨 Testing preset: ${presetName}`);

    const preset = LiquidMorphPresets[presetName];
    const liquidMorph = createLiquidMorphTransition(canvas, ctx, preset);

    liquidMorph.initialize("ABC", "XYZ", 36, 400, 300);
    liquidMorph.render("#FFFFFF");

    const metrics = liquidMorph.getPerformanceMetrics();
    console.log(`   📊 ${presetName} metrics:`, {
      viscosity: preset.viscosity,
      surfaceTension: preset.surfaceTension,
      flowSpeed: preset.flowSpeed,
      fluidPoints: metrics.fluidPoints,
      colorScheme: preset.colorScheme,
    });

    liquidMorph.cleanup();
  });

  console.log("✅ Liquid Morph Presets test completed");
};

// Test Advanced Transition Manager with Liquid Morph
export const testAdvancedTransitionManagerLiquidMorph = (): void => {
  console.log("🧪 Testing Advanced Transition Manager with Liquid Morph...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Create manager
  const manager = createAdvancedTransitionManager(canvas, ctx);
  console.log("✅ Advanced Transition Manager created");

  // Test Liquid Morph support
  const isLiquidMorphSupported = manager.isTransitionSupported("liquidMorph");
  console.log("🔍 Liquid Morph supported:", isLiquidMorphSupported);

  if (isLiquidMorphSupported) {
    // Test initialization
    const initialized = manager.initializeTransition("liquidMorph", "789", 48, {
      liquidMorph: AdvancedTransitionPresets.liquidMorph.mercury,
    });
    console.log("🚀 Liquid Morph initialized:", initialized);

    if (initialized) {
      // Test rendering
      const rendered = manager.renderTransition(
        "liquidMorph",
        400,
        300,
        48,
        "#4A90E2",
        0.5
      );
      console.log("🎨 Liquid Morph rendered:", rendered);

      // Test progress
      const progress = manager.getTransitionProgress("liquidMorph");
      console.log("📊 Transition progress:", progress.toFixed(2));

      // Test completion
      const isComplete = manager.isTransitionComplete("liquidMorph");
      console.log("🏁 Transition complete:", isComplete);

      // Test performance metrics
      const metrics = manager.getPerformanceMetrics("liquidMorph");
      console.log("📈 Performance metrics:", metrics);

      // Test settings update
      manager.updateTransitionSettings("liquidMorph", {
        liquidMorph: { viscosity: 0.5, flowSpeed: 6 },
      });
      console.log("⚙️  Settings updated");

      // Test reset
      manager.resetTransition("liquidMorph");
      console.log("🔄 Transition reset");
    }
  }

  // Test cleanup
  manager.cleanup();
  console.log("🧹 Manager cleaned up");

  console.log("✅ Advanced Transition Manager Liquid Morph test completed");
};

// Test Liquid Morph Color Schemes
export const testLiquidMorphColorSchemes = (): void => {
  console.log("🧪 Testing Liquid Morph Color Schemes...");

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  const colorSchemes: Array<LiquidMorphSettings["colorScheme"]> = [
    "gradient",
    "solid",
    "rainbow",
    "ocean",
    "lava",
  ];

  colorSchemes.forEach((colorScheme) => {
    console.log(`🎨 Testing color scheme: ${colorScheme}`);

    const liquidMorph = createLiquidMorphTransition(canvas, ctx, {
      colorScheme,
      resolution: 25,
      flowSpeed: 3,
      glowEffect: true,
    });

    liquidMorph.initialize("RGB", "HSL", 32, 300, 200);
    liquidMorph.render("#FFFFFF");

    const metrics = liquidMorph.getPerformanceMetrics();
    console.log(`   📊 ${colorScheme} metrics:`, {
      fluidPoints: metrics.fluidPoints,
      currentPhase: metrics.currentPhase,
    });

    liquidMorph.cleanup();
  });

  // Test custom colors
  console.log("🎨 Testing custom color scheme...");
  const customColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

  const customLiquidMorph = createLiquidMorphTransition(canvas, ctx, {
    colorScheme: "custom",
    customColors,
    resolution: 30,
    glowEffect: true,
  });

  customLiquidMorph.initialize("CUSTOM", "COLORS", 28, 300, 200);
  customLiquidMorph.render("#FFFFFF");

  const customMetrics = customLiquidMorph.getPerformanceMetrics();
  console.log("   📊 Custom color metrics:", {
    fluidPoints: customMetrics.fluidPoints,
    colors: customColors.length,
  });

  customLiquidMorph.cleanup();

  console.log("✅ Liquid Morph Color Schemes test completed");
};

// Test Liquid Morph Fluid Dynamics
export const testLiquidMorphFluidDynamics = (): void => {
  console.log("🧪 Testing Liquid Morph Fluid Dynamics...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test different fluid dynamics settings
  const fluidTests = [
    { name: "High Viscosity", viscosity: 1.8, surfaceTension: 1.0 },
    { name: "Low Viscosity", viscosity: 0.2, surfaceTension: 0.3 },
    { name: "High Surface Tension", viscosity: 0.8, surfaceTension: 1.0 },
    { name: "Low Surface Tension", viscosity: 0.8, surfaceTension: 0.1 },
    { name: "Fast Flow", flowSpeed: 8, waveAmplitude: 15 },
    { name: "Slow Flow", flowSpeed: 1, waveAmplitude: 2 },
  ];

  fluidTests.forEach((test) => {
    console.log(`💧 Testing fluid dynamics: ${test.name}`);

    const liquidMorph = createLiquidMorphTransition(canvas, ctx, {
      resolution: 25,
      colorScheme: "gradient",
      ...test,
    });

    liquidMorph.initialize("FLUID", "MORPH", 36, 400, 300);

    // Simulate several frames to test fluid dynamics
    for (let i = 0; i < 5; i++) {
      liquidMorph.render("#4A90E2");
    }

    const metrics = liquidMorph.getPerformanceMetrics();
    console.log(`   📊 ${test.name} results:`, {
      fluidPoints: metrics.fluidPoints,
      currentPhase: metrics.currentPhase,
    });

    liquidMorph.cleanup();
  });

  console.log("✅ Liquid Morph Fluid Dynamics test completed");
};

// Test Liquid Morph Performance
export const testLiquidMorphPerformance = (): void => {
  console.log("🧪 Testing Liquid Morph Performance...");

  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test different resolution levels
  const resolutions = [10, 20, 30, 40, 50];

  resolutions.forEach((resolution) => {
    console.log(`⚡ Testing resolution: ${resolution}`);

    const startTime = performance.now();

    const liquidMorph = createLiquidMorphTransition(canvas, ctx, {
      resolution,
      viscosity: 0.8,
      flowSpeed: 3,
      waveAmplitude: 8,
      glowEffect: true,
      rippleEffect: true,
    });

    liquidMorph.initialize("PERFORMANCE", "TEST", 64, 960, 540);

    // Render multiple frames to test performance
    for (let i = 0; i < 15; i++) {
      liquidMorph.render("#4A90E2");
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    const metrics = liquidMorph.getPerformanceMetrics();
    console.log(`   📊 Resolution ${resolution} results:`, {
      renderTime: renderTime.toFixed(2) + "ms",
      fluidPoints: metrics.fluidPoints,
      bezierCurves: metrics.bezierCurves,
      renderCalls: metrics.renderCalls,
      avgTimePerFrame: (renderTime / 15).toFixed(2) + "ms",
    });

    liquidMorph.cleanup();
  });

  console.log("✅ Liquid Morph Performance test completed");
};

// Test Liquid Morph Wave Effects
export const testLiquidMorphWaveEffects = (): void => {
  console.log("🧪 Testing Liquid Morph Wave Effects...");

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test with wave effects
  console.log("🌊 Testing with wave effects enabled...");
  const withWaves = createLiquidMorphTransition(canvas, ctx, {
    resolution: 30,
    waveAmplitude: 12,
    waveFrequency: 2.5,
    colorScheme: "ocean",
    rippleEffect: true,
  });

  withWaves.initialize("WAVE", "FLOW", 40, 300, 200);
  withWaves.render("#0080B7");

  const waveMetrics = withWaves.getPerformanceMetrics();
  console.log("   📊 With waves metrics:", {
    fluidPoints: waveMetrics.fluidPoints,
    renderCalls: waveMetrics.renderCalls,
  });

  withWaves.cleanup();

  // Test without wave effects
  console.log("🌊 Testing without wave effects...");
  const withoutWaves = createLiquidMorphTransition(canvas, ctx, {
    resolution: 30,
    waveAmplitude: 0,
    waveFrequency: 0,
    colorScheme: "solid",
    rippleEffect: false,
  });

  withoutWaves.initialize("CALM", "FLOW", 40, 300, 200);
  withoutWaves.render("#4A90E2");

  const calmMetrics = withoutWaves.getPerformanceMetrics();
  console.log("   📊 Without waves metrics:", {
    fluidPoints: calmMetrics.fluidPoints,
    renderCalls: calmMetrics.renderCalls,
  });

  withoutWaves.cleanup();

  console.log("✅ Liquid Morph Wave Effects test completed");
};

// Test Liquid Morph Bezier Curves
export const testLiquidMorphBezierCurves = (): void => {
  console.log("🧪 Testing Liquid Morph Bezier Curves...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test morphing between different number combinations
  const morphTests = [
    { source: "1", target: "9", name: "Simple morph" },
    { source: "123", target: "789", name: "Multi-digit morph" },
    { source: "0", target: "8", name: "Circular morph" },
    { source: "111", target: "000", name: "Repetitive morph" },
    { source: "12345", target: "67890", name: "Complex morph" },
  ];

  morphTests.forEach((test) => {
    console.log(`🔄 Testing ${test.name}: ${test.source} → ${test.target}`);

    const liquidMorph = createLiquidMorphTransition(canvas, ctx, {
      resolution: 25,
      flowSpeed: 3,
      colorScheme: "gradient",
      glowEffect: true,
    });

    liquidMorph.initialize(test.source, test.target, 48, 400, 300);

    // Simulate animation to test bezier curves
    for (let i = 0; i < 8; i++) {
      liquidMorph.render("#4A90E2");
    }

    const metrics = liquidMorph.getPerformanceMetrics();
    console.log(`   📊 ${test.name} results:`, {
      fluidPoints: metrics.fluidPoints,
      bezierCurves: metrics.bezierCurves,
      currentPhase: metrics.currentPhase,
    });

    liquidMorph.cleanup();
  });

  console.log("✅ Liquid Morph Bezier Curves test completed");
};

// Run all Liquid Morph tests
export const runAllLiquidMorphTests = (): void => {
  console.log("🚀 Starting Liquid Morph Tests...\n");

  try {
    testLiquidMorphTransition();
    console.log("");

    testLiquidMorphPresets();
    console.log("");

    testAdvancedTransitionManagerLiquidMorph();
    console.log("");

    testLiquidMorphColorSchemes();
    console.log("");

    testLiquidMorphFluidDynamics();
    console.log("");

    testLiquidMorphPerformance();
    console.log("");

    testLiquidMorphWaveEffects();
    console.log("");

    testLiquidMorphBezierCurves();
    console.log("");

    console.log("🎉 All Liquid Morph Tests Completed Successfully!");
  } catch (error) {
    console.error("❌ Liquid Morph test failed:", error);
  }
};

// Auto-run tests if this file is executed directly
if (typeof window !== "undefined") {
  // Add a global function to run tests from browser console
  (
    window as unknown as { runLiquidMorphTests: () => void }
  ).runLiquidMorphTests = runAllLiquidMorphTests;
  console.log("💡 Run Liquid Morph tests by calling: runLiquidMorphTests()");
}
