// Test file for Matrix Rain Transition Effect
// Validates the Matrix Rain transition implementation

import {
  MatrixRainTransition,
  MatrixRainSettings,
  MatrixRainPresets,
  createMatrixRainTransition,
} from "./utils/matrixRainTransition";

import {
  AdvancedTransitionManager,
  AdvancedTransitionPresets,
  createAdvancedTransitionManager,
} from "./utils/advancedTransitionIntegration";

// Test Matrix Rain Transition
export const testMatrixRainTransition = (): void => {
  console.log("🧪 Testing Matrix Rain Transition...");

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
  const matrixRain = createMatrixRainTransition(canvas, ctx);
  console.log("✅ Matrix Rain transition created");

  // Test initialization with target number
  const targetNumber = "12345";
  const fontSize = 48;
  matrixRain.initialize(targetNumber, fontSize);
  console.log("✅ Matrix Rain initialized with target:", targetNumber);

  // Test settings update
  const customSettings: Partial<MatrixRainSettings> = {
    speed: 7,
    density: 0.5,
    colorScheme: "blue",
    glowIntensity: 5,
  };
  matrixRain.updateSettings(customSettings);
  console.log("✅ Matrix Rain settings updated");

  // Test rendering (simulate a few frames)
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < 5; i++) {
    matrixRain.render(centerX, centerY, fontSize, "#FFFFFF");
    console.log(
      `📊 Frame ${i + 1} rendered, progress: ${matrixRain
        .getProgress()
        .toFixed(2)}`
    );
  }

  // Test performance metrics
  const metrics = matrixRain.getPerformanceMetrics();
  console.log("📈 Performance metrics:", {
    activeColumns: metrics.activeColumns,
    totalCharacters: metrics.totalCharacters,
    renderCalls: metrics.renderCalls,
  });

  // Test completion check
  console.log("🏁 Is complete:", matrixRain.isComplete());

  // Test reset
  matrixRain.reset();
  console.log("🔄 Matrix Rain reset, progress:", matrixRain.getProgress());

  // Test cleanup
  matrixRain.cleanup();
  console.log("🧹 Matrix Rain cleaned up");

  console.log("✅ Matrix Rain Transition test completed");
};

// Test Matrix Rain Presets
export const testMatrixRainPresets = (): void => {
  console.log("🧪 Testing Matrix Rain Presets...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  const presetNames = Object.keys(MatrixRainPresets) as Array<
    keyof typeof MatrixRainPresets
  >;

  presetNames.forEach((presetName) => {
    console.log(`🎨 Testing preset: ${presetName}`);

    const preset = MatrixRainPresets[presetName];
    const matrixRain = createMatrixRainTransition(canvas, ctx, preset);

    matrixRain.initialize("999", 36);
    matrixRain.render(400, 300, 36, "#FFFFFF");

    const metrics = matrixRain.getPerformanceMetrics();
    console.log(`   📊 ${presetName} metrics:`, {
      speed: preset.speed,
      density: preset.density,
      activeColumns: metrics.activeColumns,
      colorScheme: preset.colorScheme,
    });

    matrixRain.cleanup();
  });

  console.log("✅ Matrix Rain Presets test completed");
};

// Test Advanced Transition Manager
export const testAdvancedTransitionManager = (): void => {
  console.log("🧪 Testing Advanced Transition Manager...");

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

  // Test supported transitions
  const supportedTransitions = manager.getAvailableTransitions();
  console.log(
    "📋 Available transitions:",
    supportedTransitions.map((t) => t.name)
  );

  // Test Matrix Rain support
  const isMatrixRainSupported = manager.isTransitionSupported("matrixRain");
  console.log("🔍 Matrix Rain supported:", isMatrixRainSupported);

  if (isMatrixRainSupported) {
    // Test initialization
    const initialized = manager.initializeTransition("matrixRain", "42", 48, {
      matrixRain: AdvancedTransitionPresets.matrixRain.cyberpunk,
    });
    console.log("🚀 Matrix Rain initialized:", initialized);

    if (initialized) {
      // Test rendering
      const rendered = manager.renderTransition(
        "matrixRain",
        400,
        300,
        48,
        "#00FFFF",
        0.5
      );
      console.log("🎨 Matrix Rain rendered:", rendered);

      // Test progress
      const progress = manager.getTransitionProgress("matrixRain");
      console.log("📊 Transition progress:", progress.toFixed(2));

      // Test completion
      const isComplete = manager.isTransitionComplete("matrixRain");
      console.log("🏁 Transition complete:", isComplete);

      // Test performance metrics
      const metrics = manager.getPerformanceMetrics("matrixRain");
      console.log("📈 Performance metrics:", metrics);

      // Test settings update
      manager.updateTransitionSettings("matrixRain", {
        matrixRain: { speed: 10, density: 0.8 },
      });
      console.log("⚙️  Settings updated");

      // Test reset
      manager.resetTransition("matrixRain");
      console.log("🔄 Transition reset");
    }
  }

  // Test cleanup
  manager.cleanup();
  console.log("🧹 Manager cleaned up");

  console.log("✅ Advanced Transition Manager test completed");
};

// Test Matrix Rain with different character sets
export const testMatrixRainCharacterSets = (): void => {
  console.log("🧪 Testing Matrix Rain Character Sets...");

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  const characterSets = {
    katakana:
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
    binary: "01",
    hex: "0123456789ABCDEF",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    mixed:
      "アイウエオ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()",
  };

  Object.entries(characterSets).forEach(([name, charset]) => {
    console.log(`🔤 Testing character set: ${name}`);

    const matrixRain = createMatrixRainTransition(canvas, ctx, {
      characterSet: charset,
      speed: 5,
      density: 0.3,
    });

    matrixRain.initialize("123", 24);
    matrixRain.render(200, 150, 24, "#00FF00");

    const metrics = matrixRain.getPerformanceMetrics();
    console.log(`   📊 ${name} metrics:`, {
      characters: charset.length,
      activeColumns: metrics.activeColumns,
    });

    matrixRain.cleanup();
  });

  console.log("✅ Matrix Rain Character Sets test completed");
};

// Test Matrix Rain Performance
export const testMatrixRainPerformance = (): void => {
  console.log("🧪 Testing Matrix Rain Performance...");

  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test different density levels
  const densityLevels = [0.1, 0.3, 0.5, 0.8, 1.0];

  densityLevels.forEach((density) => {
    console.log(`⚡ Testing density: ${density}`);

    const startTime = performance.now();

    const matrixRain = createMatrixRainTransition(canvas, ctx, {
      density,
      speed: 5,
      fadeLength: 20,
    });

    matrixRain.initialize("987654321", 72);

    // Render multiple frames to test performance
    for (let i = 0; i < 10; i++) {
      matrixRain.render(960, 540, 72, "#00FF00");
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    const metrics = matrixRain.getPerformanceMetrics();
    console.log(`   📊 Density ${density} results:`, {
      renderTime: renderTime.toFixed(2) + "ms",
      activeColumns: metrics.activeColumns,
      totalCharacters: metrics.totalCharacters,
      avgTimePerFrame: (renderTime / 10).toFixed(2) + "ms",
    });

    matrixRain.cleanup();
  });

  console.log("✅ Matrix Rain Performance test completed");
};

// Test Matrix Rain Transparency Support
export const testMatrixRainTransparency = (): void => {
  console.log("🧪 Testing Matrix Rain Transparency Support...");

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test with transparency enabled
  const matrixRain = createMatrixRainTransition(canvas, ctx, {
    transparencySupport: true,
    colorScheme: "classic",
    glowIntensity: 3,
  });

  matrixRain.initialize("ALPHA", 36);

  // Clear with transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render with transparency
  matrixRain.render(300, 200, 36, "#FFFFFF");

  // Check if canvas has alpha channel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let hasTransparency = false;

  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 255) {
      hasTransparency = true;
      break;
    }
  }

  console.log("🔍 Transparency detected:", hasTransparency);
  console.log("✅ Matrix Rain transparency test completed");

  matrixRain.cleanup();
};

// Run all Matrix Rain tests
export const runAllMatrixRainTests = (): void => {
  console.log("🚀 Starting Matrix Rain Tests...\n");

  try {
    testMatrixRainTransition();
    console.log("");

    testMatrixRainPresets();
    console.log("");

    testAdvancedTransitionManager();
    console.log("");

    testMatrixRainCharacterSets();
    console.log("");

    testMatrixRainPerformance();
    console.log("");

    testMatrixRainTransparency();
    console.log("");

    console.log("🎉 All Matrix Rain Tests Completed Successfully!");
  } catch (error) {
    console.error("❌ Matrix Rain test failed:", error);
  }
};

// Auto-run tests if this file is executed directly
if (typeof window !== "undefined") {
  // Add a global function to run tests from browser console
  (window as unknown as { runMatrixRainTests: () => void }).runMatrixRainTests =
    runAllMatrixRainTests;
  console.log("💡 Run Matrix Rain tests by calling: runMatrixRainTests()");
}
