// Test file for Hologram Flicker Transition Effect
// Validates the Hologram Flicker transition implementation

import {
  HologramFlickerTransition,
  HologramFlickerSettings,
  HologramFlickerPresets,
  createHologramFlickerTransition,
} from "./utils/hologramFlickerTransition";

import {
  AdvancedTransitionManager,
  AdvancedTransitionPresets,
  createAdvancedTransitionManager,
} from "./utils/advancedTransitionIntegration";

// Test Hologram Flicker Transition
export const testHologramFlickerTransition = (): void => {
  console.log("🧪 Testing Hologram Flicker Transition...");

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
  const hologramFlicker = createHologramFlickerTransition(canvas, ctx);
  console.log("✅ Hologram Flicker transition created");

  // Test initialization with target number
  const targetNumber = "2077";
  const fontSize = 48;

  hologramFlicker.initialize(targetNumber, fontSize);
  console.log("✅ Hologram Flicker initialized with target:", targetNumber);

  // Test settings update
  const customSettings: Partial<HologramFlickerSettings> = {
    scanLineSpeed: 6,
    scanLineIntensity: 0.9,
    flickerFrequency: 3.5,
    rgbSeparation: 5,
    colorScheme: "cyberpunk",
    glitchIntensity: 0.8,
  };
  hologramFlicker.updateSettings(customSettings);
  console.log("✅ Hologram Flicker settings updated");

  // Test rendering (simulate animation frames)
  console.log("🎬 Simulating hologram animation...");

  for (let i = 0; i < 10; i++) {
    hologramFlicker.render(400, 300, fontSize, "#00FFFF");
    const progress = hologramFlicker.getProgress();
    const stability = hologramFlicker.getHologramStability();
    console.log(
      `📊 Frame ${i + 1}: Progress ${progress.toFixed(
        2
      )}, Stability: ${stability.toFixed(2)}`
    );

    // Simulate time passing
    setTimeout(() => {}, 100);
  }

  // Test performance metrics
  const metrics = hologramFlicker.getPerformanceMetrics();
  console.log("📈 Performance metrics:", {
    scanLines: metrics.scanLines,
    glitchBlocks: metrics.glitchBlocks,
    hologramStability: metrics.hologramStability.toFixed(2),
    renderCalls: metrics.renderCalls,
  });

  // Test completion check
  console.log("🏁 Is complete:", hologramFlicker.isComplete());

  // Test reset
  hologramFlicker.reset();
  console.log(
    "🔄 Hologram Flicker reset, progress:",
    hologramFlicker.getProgress()
  );

  // Test cleanup
  hologramFlicker.cleanup();
  console.log("🧹 Hologram Flicker cleaned up");

  console.log("✅ Hologram Flicker Transition test completed");
};

// Test Hologram Flicker Presets
export const testHologramFlickerPresets = (): void => {
  console.log("🧪 Testing Hologram Flicker Presets...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  const presetNames = Object.keys(HologramFlickerPresets) as Array<
    keyof typeof HologramFlickerPresets
  >;

  presetNames.forEach((presetName) => {
    console.log(`🎨 Testing preset: ${presetName}`);

    const preset = HologramFlickerPresets[presetName];
    const hologramFlicker = createHologramFlickerTransition(
      canvas,
      ctx,
      preset
    );

    hologramFlicker.initialize("HOLO", 36);
    hologramFlicker.render(400, 300, 36, "#00FFFF");

    const metrics = hologramFlicker.getPerformanceMetrics();
    console.log(`   📊 ${presetName} metrics:`, {
      scanLineSpeed: preset.scanLineSpeed,
      flickerFrequency: preset.flickerFrequency,
      rgbSeparation: preset.rgbSeparation,
      scanLines: metrics.scanLines,
      colorScheme: preset.colorScheme,
    });

    hologramFlicker.cleanup();
  });

  console.log("✅ Hologram Flicker Presets test completed");
};

// Test Advanced Transition Manager with Hologram Flicker
export const testAdvancedTransitionManagerHologramFlicker = (): void => {
  console.log(
    "🧪 Testing Advanced Transition Manager with Hologram Flicker..."
  );

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

  // Test Hologram Flicker support
  const isHologramFlickerSupported =
    manager.isTransitionSupported("hologramFlicker");
  console.log("🔍 Hologram Flicker supported:", isHologramFlickerSupported);

  if (isHologramFlickerSupported) {
    // Test initialization
    const initialized = manager.initializeTransition(
      "hologramFlicker",
      "GHOST",
      48,
      { hologramFlicker: AdvancedTransitionPresets.hologramFlicker.ghost }
    );
    console.log("🚀 Hologram Flicker initialized:", initialized);

    if (initialized) {
      // Test rendering
      const rendered = manager.renderTransition(
        "hologramFlicker",
        400,
        300,
        48,
        "#00FFFF",
        0.5
      );
      console.log("🎨 Hologram Flicker rendered:", rendered);

      // Test progress
      const progress = manager.getTransitionProgress("hologramFlicker");
      console.log("📊 Transition progress:", progress.toFixed(2));

      // Test completion
      const isComplete = manager.isTransitionComplete("hologramFlicker");
      console.log("🏁 Transition complete:", isComplete);

      // Test performance metrics
      const metrics = manager.getPerformanceMetrics("hologramFlicker");
      console.log("📈 Performance metrics:", metrics);

      // Test settings update
      manager.updateTransitionSettings("hologramFlicker", {
        hologramFlicker: { scanLineSpeed: 8, glitchIntensity: 1.0 },
      });
      console.log("⚙️  Settings updated");

      // Test reset
      manager.resetTransition("hologramFlicker");
      console.log("🔄 Transition reset");
    }
  }

  // Test cleanup
  manager.cleanup();
  console.log("🧹 Manager cleaned up");

  console.log("✅ Advanced Transition Manager Hologram Flicker test completed");
};

// Test Hologram Flicker Color Schemes
export const testHologramFlickerColorSchemes = (): void => {
  console.log("🧪 Testing Hologram Flicker Color Schemes...");

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  const colorSchemes: Array<HologramFlickerSettings["colorScheme"]> = [
    "classic",
    "cyan",
    "green",
    "amber",
    "purple",
  ];

  colorSchemes.forEach((colorScheme) => {
    console.log(`🎨 Testing color scheme: ${colorScheme}`);

    const hologramFlicker = createHologramFlickerTransition(canvas, ctx, {
      colorScheme,
      scanLineIntensity: 0.7,
      flickerFrequency: 2.0,
      rgbSeparation: 3,
    });

    hologramFlicker.initialize("COLOR", 32);
    hologramFlicker.render(300, 200, 32, "#FFFFFF");

    const metrics = hologramFlicker.getPerformanceMetrics();
    console.log(`   📊 ${colorScheme} metrics:`, {
      scanLines: metrics.scanLines,
      hologramStability: metrics.hologramStability.toFixed(2),
    });

    hologramFlicker.cleanup();
  });

  // Test custom color
  console.log("🎨 Testing custom color scheme...");
  const customColor = "#FF00FF";

  const customHologramFlicker = createHologramFlickerTransition(canvas, ctx, {
    colorScheme: "custom",
    customColor,
    scanLineIntensity: 0.8,
    glitchIntensity: 0.6,
  });

  customHologramFlicker.initialize("CUSTOM", 28);
  customHologramFlicker.render(300, 200, 28, "#FFFFFF");

  const customMetrics = customHologramFlicker.getPerformanceMetrics();
  console.log("   📊 Custom color metrics:", {
    scanLines: customMetrics.scanLines,
    customColor: customColor,
  });

  customHologramFlicker.cleanup();

  console.log("✅ Hologram Flicker Color Schemes test completed");
};

// Test Hologram Flicker Effects
export const testHologramFlickerEffects = (): void => {
  console.log("🧪 Testing Hologram Flicker Effects...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test different effect combinations
  const effectTests = [
    { name: "High RGB Separation", rgbSeparation: 8, staticNoise: 0.2 },
    { name: "Heavy Static", rgbSeparation: 2, staticNoise: 0.8 },
    { name: "Intense Glitch", glitchIntensity: 1.0, interferenceLevel: 0.9 },
    { name: "Fast Scan Lines", scanLineSpeed: 10, scanLineIntensity: 1.0 },
    { name: "High Flicker", flickerFrequency: 5.0, interferenceLevel: 0.8 },
    {
      name: "Minimal Effects",
      rgbSeparation: 0,
      staticNoise: 0.05,
      glitchIntensity: 0.1,
    },
  ];

  effectTests.forEach((test) => {
    console.log(`✨ Testing effects: ${test.name}`);

    const hologramFlicker = createHologramFlickerTransition(canvas, ctx, {
      colorScheme: "classic",
      hologramOpacity: 0.8,
      ...test,
    });

    hologramFlicker.initialize("EFFECT", 36);

    // Simulate several frames to test effects
    for (let i = 0; i < 5; i++) {
      hologramFlicker.render(400, 300, 36, "#00FFFF");
    }

    const metrics = hologramFlicker.getPerformanceMetrics();
    console.log(`   📊 ${test.name} results:`, {
      scanLines: metrics.scanLines,
      glitchBlocks: metrics.glitchBlocks,
      hologramStability: metrics.hologramStability.toFixed(2),
    });

    hologramFlicker.cleanup();
  });

  console.log("✅ Hologram Flicker Effects test completed");
};

// Test Hologram Flicker Performance
export const testHologramFlickerPerformance = (): void => {
  console.log("🧪 Testing Hologram Flicker Performance...");

  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test different complexity levels
  const complexityLevels = [
    { name: "Low", scanLineSpeed: 2, staticNoise: 0.1, glitchIntensity: 0.2 },
    {
      name: "Medium",
      scanLineSpeed: 4,
      staticNoise: 0.3,
      glitchIntensity: 0.6,
    },
    { name: "High", scanLineSpeed: 8, staticNoise: 0.6, glitchIntensity: 0.9 },
    {
      name: "Ultra",
      scanLineSpeed: 10,
      staticNoise: 0.8,
      glitchIntensity: 1.0,
    },
  ];

  complexityLevels.forEach((level) => {
    console.log(`⚡ Testing complexity: ${level.name}`);

    const startTime = performance.now();

    const hologramFlicker = createHologramFlickerTransition(canvas, ctx, {
      colorScheme: "classic",
      flickerFrequency: 3.0,
      rgbSeparation: 5,
      ...level,
    });

    hologramFlicker.initialize("PERFORMANCE", 72);

    // Render multiple frames to test performance
    for (let i = 0; i < 20; i++) {
      hologramFlicker.render(960, 540, 72, "#00FFFF");
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    const metrics = hologramFlicker.getPerformanceMetrics();
    console.log(`   📊 Complexity ${level.name} results:`, {
      renderTime: renderTime.toFixed(2) + "ms",
      scanLines: metrics.scanLines,
      glitchBlocks: metrics.glitchBlocks,
      renderCalls: metrics.renderCalls,
      avgTimePerFrame: (renderTime / 20).toFixed(2) + "ms",
    });

    hologramFlicker.cleanup();
  });

  console.log("✅ Hologram Flicker Performance test completed");
};

// Test Hologram Flicker Stability
export const testHologramFlickerStability = (): void => {
  console.log("🧪 Testing Hologram Flicker Stability...");

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test stability progression over time
  console.log("📈 Testing stability progression...");
  const hologramFlicker = createHologramFlickerTransition(canvas, ctx, {
    colorScheme: "classic",
    flickerFrequency: 2.0,
    interferenceLevel: 0.5,
  });

  hologramFlicker.initialize("STABLE", 40);

  // Simulate animation progression
  const stabilityProgression = [];
  for (let i = 0; i < 15; i++) {
    hologramFlicker.render(300, 200, 40, "#00FFFF");
    const stability = hologramFlicker.getHologramStability();
    const progress = hologramFlicker.getProgress();

    stabilityProgression.push({
      frame: i + 1,
      progress: progress.toFixed(2),
      stability: stability.toFixed(2),
    });

    // Simulate time passing
    setTimeout(() => {}, 50);
  }

  console.log("📊 Stability progression:", stabilityProgression);

  hologramFlicker.cleanup();

  console.log("✅ Hologram Flicker Stability test completed");
};

// Test Hologram Flicker Scan Lines
export const testHologramFlickerScanLines = (): void => {
  console.log("🧪 Testing Hologram Flicker Scan Lines...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test different scan line configurations
  const scanLineTests = [
    { name: "Slow Scan", scanLineSpeed: 1, scanLineIntensity: 0.4 },
    { name: "Fast Scan", scanLineSpeed: 8, scanLineIntensity: 0.9 },
    { name: "Intense Scan", scanLineSpeed: 4, scanLineIntensity: 1.0 },
    { name: "Subtle Scan", scanLineSpeed: 2, scanLineIntensity: 0.2 },
  ];

  scanLineTests.forEach((test) => {
    console.log(`📺 Testing scan lines: ${test.name}`);

    const hologramFlicker = createHologramFlickerTransition(canvas, ctx, {
      colorScheme: "cyan",
      staticNoise: 0.1,
      glitchIntensity: 0.3,
      ...test,
    });

    hologramFlicker.initialize("SCAN", 44);

    // Render several frames to observe scan line behavior
    for (let i = 0; i < 8; i++) {
      hologramFlicker.render(400, 300, 44, "#00FFFF");
    }

    const metrics = hologramFlicker.getPerformanceMetrics();
    console.log(`   📊 ${test.name} results:`, {
      scanLines: metrics.scanLines,
      hologramStability: metrics.hologramStability.toFixed(2),
    });

    hologramFlicker.cleanup();
  });

  console.log("✅ Hologram Flicker Scan Lines test completed");
};

// Run all Hologram Flicker tests
export const runAllHologramFlickerTests = (): void => {
  console.log("🚀 Starting Hologram Flicker Tests...\n");

  try {
    testHologramFlickerTransition();
    console.log("");

    testHologramFlickerPresets();
    console.log("");

    testAdvancedTransitionManagerHologramFlicker();
    console.log("");

    testHologramFlickerColorSchemes();
    console.log("");

    testHologramFlickerEffects();
    console.log("");

    testHologramFlickerPerformance();
    console.log("");

    testHologramFlickerStability();
    console.log("");

    testHologramFlickerScanLines();
    console.log("");

    console.log("🎉 All Hologram Flicker Tests Completed Successfully!");
  } catch (error) {
    console.error("❌ Hologram Flicker test failed:", error);
  }
};

// Auto-run tests if this file is executed directly
if (typeof window !== "undefined") {
  // Add a global function to run tests from browser console
  (
    window as unknown as { runHologramFlickerTests: () => void }
  ).runHologramFlickerTests = runAllHologramFlickerTests;
  console.log(
    "💡 Run Hologram Flicker tests by calling: runHologramFlickerTests()"
  );
}
