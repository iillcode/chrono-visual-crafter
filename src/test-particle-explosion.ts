// Test file for Particle Explosion Transition Effect
// Validates the Particle Explosion transition implementation

import {
  ParticleExplosionTransition,
  ParticleExplosionSettings,
  ParticleExplosionPresets,
  createParticleExplosionTransition,
} from "./utils/particleExplosionTransition";

import {
  AdvancedTransitionManager,
  AdvancedTransitionPresets,
  createAdvancedTransitionManager,
} from "./utils/advancedTransitionIntegration";

// Test Particle Explosion Transition
export const testParticleExplosionTransition = (): void => {
  console.log("🧪 Testing Particle Explosion Transition...");

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
  const particleExplosion = createParticleExplosionTransition(canvas, ctx);
  console.log("✅ Particle Explosion transition created");

  // Test initialization with target number
  const targetNumber = "789";
  const fontSize = 48;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  particleExplosion.initialize(targetNumber, fontSize, centerX, centerY);
  console.log("✅ Particle Explosion initialized with target:", targetNumber);

  // Test settings update
  const customSettings: Partial<ParticleExplosionSettings> = {
    particleCount: 200,
    explosionRadius: 150,
    explosionForce: 8,
    colorScheme: "fire",
    glowEffect: true,
    trailEffect: true,
  };
  particleExplosion.updateSettings(customSettings);
  console.log("✅ Particle Explosion settings updated");

  // Test rendering (simulate animation phases)
  console.log("🎬 Simulating animation phases...");

  for (let i = 0; i < 10; i++) {
    particleExplosion.render("#FFFFFF");
    const progress = particleExplosion.getProgress();
    const phase = particleExplosion.getCurrentPhase();
    console.log(
      `📊 Frame ${i + 1}: Progress ${progress.toFixed(2)}, Phase: ${phase}`
    );

    // Simulate time passing
    setTimeout(() => {}, 100);
  }

  // Test performance metrics
  const metrics = particleExplosion.getPerformanceMetrics();
  console.log("📈 Performance metrics:", {
    activeParticles: metrics.activeParticles,
    totalParticles: metrics.totalParticles,
    currentPhase: metrics.currentPhase,
    renderCalls: metrics.renderCalls,
  });

  // Test completion check
  console.log("🏁 Is complete:", particleExplosion.isComplete());

  // Test reset
  particleExplosion.reset();
  console.log(
    "🔄 Particle Explosion reset, progress:",
    particleExplosion.getProgress()
  );

  // Test cleanup
  particleExplosion.cleanup();
  console.log("🧹 Particle Explosion cleaned up");

  console.log("✅ Particle Explosion Transition test completed");
};

// Test Particle Explosion Presets
export const testParticleExplosionPresets = (): void => {
  console.log("🧪 Testing Particle Explosion Presets...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  const presetNames = Object.keys(ParticleExplosionPresets) as Array<
    keyof typeof ParticleExplosionPresets
  >;

  presetNames.forEach((presetName) => {
    console.log(`🎨 Testing preset: ${presetName}`);

    const preset = ParticleExplosionPresets[presetName];
    const particleExplosion = createParticleExplosionTransition(
      canvas,
      ctx,
      preset
    );

    particleExplosion.initialize("123", 36, 400, 300);
    particleExplosion.render("#FFFFFF");

    const metrics = particleExplosion.getPerformanceMetrics();
    console.log(`   📊 ${presetName} metrics:`, {
      particleCount: preset.particleCount,
      explosionRadius: preset.explosionRadius,
      explosionForce: preset.explosionForce,
      activeParticles: metrics.activeParticles,
      colorScheme: preset.colorScheme,
    });

    particleExplosion.cleanup();
  });

  console.log("✅ Particle Explosion Presets test completed");
};

// Test Advanced Transition Manager with Particle Explosion
export const testAdvancedTransitionManagerParticleExplosion = (): void => {
  console.log(
    "🧪 Testing Advanced Transition Manager with Particle Explosion..."
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

  // Test Particle Explosion support
  const isParticleExplosionSupported =
    manager.isTransitionSupported("particleExplosion");
  console.log("🔍 Particle Explosion supported:", isParticleExplosionSupported);

  if (isParticleExplosionSupported) {
    // Test initialization
    const initialized = manager.initializeTransition(
      "particleExplosion",
      "456",
      48,
      { particleExplosion: AdvancedTransitionPresets.particleExplosion.intense }
    );
    console.log("🚀 Particle Explosion initialized:", initialized);

    if (initialized) {
      // Test rendering
      const rendered = manager.renderTransition(
        "particleExplosion",
        400,
        300,
        48,
        "#FF4444",
        0.5
      );
      console.log("🎨 Particle Explosion rendered:", rendered);

      // Test progress
      const progress = manager.getTransitionProgress("particleExplosion");
      console.log("📊 Transition progress:", progress.toFixed(2));

      // Test completion
      const isComplete = manager.isTransitionComplete("particleExplosion");
      console.log("🏁 Transition complete:", isComplete);

      // Test performance metrics
      const metrics = manager.getPerformanceMetrics("particleExplosion");
      console.log("📈 Performance metrics:", metrics);

      // Test settings update
      manager.updateTransitionSettings("particleExplosion", {
        particleExplosion: { particleCount: 300, explosionForce: 10 },
      });
      console.log("⚙️  Settings updated");

      // Test reset
      manager.resetTransition("particleExplosion");
      console.log("🔄 Transition reset");
    }
  }

  // Test cleanup
  manager.cleanup();
  console.log("🧹 Manager cleaned up");

  console.log(
    "✅ Advanced Transition Manager Particle Explosion test completed"
  );
};

// Test Particle Explosion Color Schemes
export const testParticleExplosionColorSchemes = (): void => {
  console.log("🧪 Testing Particle Explosion Color Schemes...");

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  const colorSchemes: Array<ParticleExplosionSettings["colorScheme"]> = [
    "inherit",
    "rainbow",
    "fire",
    "electric",
  ];

  colorSchemes.forEach((colorScheme) => {
    console.log(`🎨 Testing color scheme: ${colorScheme}`);

    const particleExplosion = createParticleExplosionTransition(canvas, ctx, {
      colorScheme,
      particleCount: 100,
      explosionRadius: 80,
      glowEffect: true,
    });

    particleExplosion.initialize("RGB", 32, 300, 200);
    particleExplosion.render("#00FFFF");

    const metrics = particleExplosion.getPerformanceMetrics();
    console.log(`   📊 ${colorScheme} metrics:`, {
      activeParticles: metrics.activeParticles,
      currentPhase: metrics.currentPhase,
    });

    particleExplosion.cleanup();
  });

  // Test custom colors
  console.log("🎨 Testing custom color scheme...");
  const customColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];

  const customParticleExplosion = createParticleExplosionTransition(
    canvas,
    ctx,
    {
      colorScheme: "custom",
      customColors,
      particleCount: 120,
      glowEffect: true,
    }
  );

  customParticleExplosion.initialize("CUSTOM", 28, 300, 200);
  customParticleExplosion.render("#FFFFFF");

  const customMetrics = customParticleExplosion.getPerformanceMetrics();
  console.log("   📊 Custom color metrics:", {
    activeParticles: customMetrics.activeParticles,
    colors: customColors.length,
  });

  customParticleExplosion.cleanup();

  console.log("✅ Particle Explosion Color Schemes test completed");
};

// Test Particle Explosion Physics
export const testParticleExplosionPhysics = (): void => {
  console.log("🧪 Testing Particle Explosion Physics...");

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test different physics settings
  const physicsTests = [
    { name: "High Gravity", gravity: 1.5, friction: 0.95 },
    { name: "Low Gravity", gravity: 0.1, friction: 0.99 },
    { name: "High Friction", gravity: 0.3, friction: 0.9 },
    { name: "Low Friction", gravity: 0.3, friction: 0.99 },
    { name: "High Force", explosionForce: 10, reformSpeed: 3 },
    { name: "Low Force", explosionForce: 2, reformSpeed: 1 },
  ];

  physicsTests.forEach((test) => {
    console.log(`⚡ Testing physics: ${test.name}`);

    const particleExplosion = createParticleExplosionTransition(canvas, ctx, {
      particleCount: 100,
      explosionRadius: 100,
      ...test,
    });

    particleExplosion.initialize("PHYS", 36, 400, 300);

    // Simulate several frames to test physics
    for (let i = 0; i < 5; i++) {
      particleExplosion.render("#FFFFFF");
    }

    const metrics = particleExplosion.getPerformanceMetrics();
    console.log(`   📊 ${test.name} results:`, {
      activeParticles: metrics.activeParticles,
      currentPhase: metrics.currentPhase,
    });

    particleExplosion.cleanup();
  });

  console.log("✅ Particle Explosion Physics test completed");
};

// Test Particle Explosion Performance
export const testParticleExplosionPerformance = (): void => {
  console.log("🧪 Testing Particle Explosion Performance...");

  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test different particle counts
  const particleCounts = [50, 100, 200, 300, 500];

  particleCounts.forEach((particleCount) => {
    console.log(`⚡ Testing particle count: ${particleCount}`);

    const startTime = performance.now();

    const particleExplosion = createParticleExplosionTransition(canvas, ctx, {
      particleCount,
      explosionRadius: 150,
      explosionForce: 6,
      trailEffect: true,
      glowEffect: true,
    });

    particleExplosion.initialize("PERF", 64, 960, 540);

    // Render multiple frames to test performance
    for (let i = 0; i < 20; i++) {
      particleExplosion.render("#FFFFFF");
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    const metrics = particleExplosion.getPerformanceMetrics();
    console.log(`   📊 Particle count ${particleCount} results:`, {
      renderTime: renderTime.toFixed(2) + "ms",
      activeParticles: metrics.activeParticles,
      totalParticles: metrics.totalParticles,
      renderCalls: metrics.renderCalls,
      avgTimePerFrame: (renderTime / 20).toFixed(2) + "ms",
    });

    particleExplosion.cleanup();
  });

  console.log("✅ Particle Explosion Performance test completed");
};

// Test Particle Explosion Trail Effects
export const testParticleExplosionTrailEffects = (): void => {
  console.log("🧪 Testing Particle Explosion Trail Effects...");

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("❌ Failed to get canvas context");
    return;
  }

  // Test with trail effects
  console.log("🌟 Testing with trail effects enabled...");
  const withTrails = createParticleExplosionTransition(canvas, ctx, {
    particleCount: 150,
    trailEffect: true,
    glowEffect: true,
    colorScheme: "electric",
  });

  withTrails.initialize("TRAIL", 40, 300, 200);
  withTrails.render("#00FFFF");

  const trailMetrics = withTrails.getPerformanceMetrics();
  console.log("   📊 With trails metrics:", {
    activeParticles: trailMetrics.activeParticles,
    renderCalls: trailMetrics.renderCalls,
  });

  withTrails.cleanup();

  // Test without trail effects
  console.log("🌟 Testing without trail effects...");
  const withoutTrails = createParticleExplosionTransition(canvas, ctx, {
    particleCount: 150,
    trailEffect: false,
    glowEffect: false,
    colorScheme: "inherit",
  });

  withoutTrails.initialize("CLEAN", 40, 300, 200);
  withoutTrails.render("#FFFFFF");

  const cleanMetrics = withoutTrails.getPerformanceMetrics();
  console.log("   📊 Without trails metrics:", {
    activeParticles: cleanMetrics.activeParticles,
    renderCalls: cleanMetrics.renderCalls,
  });

  withoutTrails.cleanup();

  console.log("✅ Particle Explosion Trail Effects test completed");
};

// Run all Particle Explosion tests
export const runAllParticleExplosionTests = (): void => {
  console.log("🚀 Starting Particle Explosion Tests...\n");

  try {
    testParticleExplosionTransition();
    console.log("");

    testParticleExplosionPresets();
    console.log("");

    testAdvancedTransitionManagerParticleExplosion();
    console.log("");

    testParticleExplosionColorSchemes();
    console.log("");

    testParticleExplosionPhysics();
    console.log("");

    testParticleExplosionPerformance();
    console.log("");

    testParticleExplosionTrailEffects();
    console.log("");

    console.log("🎉 All Particle Explosion Tests Completed Successfully!");
  } catch (error) {
    console.error("❌ Particle Explosion test failed:", error);
  }
};

// Auto-run tests if this file is executed directly
if (typeof window !== "undefined") {
  // Add a global function to run tests from browser console
  (
    window as unknown as { runParticleExplosionTests: () => void }
  ).runParticleExplosionTests = runAllParticleExplosionTests;
  console.log(
    "💡 Run Particle Explosion tests by calling: runParticleExplosionTests()"
  );
}
