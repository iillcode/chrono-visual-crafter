/**
 * Comprehensive test suite for all transition effects
 */

import { transitionEngine } from "./utils/transitionEngine";
import { transitionEngineIntegration } from "./utils/transitionEngineIntegration";
import { performanceMonitor } from "./utils/performanceMonitor";

interface TransitionTestResult {
  name: string;
  success: boolean;
  renderTime: number;
  memoryUsage: number;
  fps: number;
  error?: string;
}

interface TransitionTestConfig {
  duration: number;
  iterations: number;
  targetFPS: number;
  maxMemoryMB: number;
}

export class TransitionLibraryTester {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private testResults: TransitionTestResult[] = [];
  private config: TransitionTestConfig;

  constructor(config: Partial<TransitionTestConfig> = {}) {
    this.config = {
      duration: 2000, // 2 seconds per test
      iterations: 3,
      targetFPS: 45,
      maxMemoryMB: 100,
      ...config,
    };

    // Create test canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext("2d")!;
  }

  /**
   * Run comprehensive tests for all transitions
   */
  async runAllTests(): Promise<TransitionTestResult[]> {
    console.log("🧪 Starting comprehensive transition tests...\n");

    // Initialize integration system
    await transitionEngineIntegration.initialize();

    const transitions = [
      "none",
      "fadeIn",
      "fade-roll",
      "flip-down",
      "slide-vertical",
      "bounce",
      "scale",
      "slideUp",
      "slideDown",
      "glitch",
      "blur",
      "typewriter",
      "odometer",
      "matrix-rain",
      "particle-explosion",
      "liquid-morph",
      "hologram-flicker",
    ];

    this.testResults = [];

    for (const transition of transitions) {
      console.log(`Testing ${transition}...`);
      const result = await this.testTransition(transition);
      this.testResults.push(result);

      if (result.success) {
        console.log(
          `✓ ${transition}: ${result.renderTime.toFixed(
            2
          )}ms avg, ${result.fps.toFixed(1)} FPS`
        );
      } else {
        console.log(`✗ ${transition}: ${result.error}`);
      }
    }

    // Generate test report
    this.generateTestReport();

    return this.testResults;
  }

  /**
   * Test individual transition
   */
  private async testTransition(
    transitionName: string
  ): Promise<TransitionTestResult> {
    const result: TransitionTestResult = {
      name: transitionName,
      success: false,
      renderTime: 0,
      memoryUsage: 0,
      fps: 0,
    };

    try {
      const renderTimes: number[] = [];
      const fpsReadings: number[] = [];
      let memoryUsage = 0;

      // Start performance monitoring
      performanceMonitor.startMonitoring();

      for (let i = 0; i < this.config.iterations; i++) {
        const iterationResult = await this.runTransitionIteration(
          transitionName
        );
        renderTimes.push(iterationResult.renderTime);
        fpsReadings.push(iterationResult.fps);
        memoryUsage = Math.max(memoryUsage, iterationResult.memoryUsage);
      }

      // Calculate averages
      result.renderTime =
        renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      result.fps = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
      result.memoryUsage = memoryUsage;

      // Check if test passed
      result.success =
        result.fps >= this.config.targetFPS &&
        result.memoryUsage <= this.config.maxMemoryMB &&
        result.renderTime <= 16.67; // 60fps threshold

      performanceMonitor.stopMonitoring();
    } catch (error) {
      result.error = error instanceof Error ? error.message : "Unknown error";
      result.success = false;
    }

    return result;
  }

  /**
   * Run single iteration of transition test
   */
  private async runTransitionIteration(transitionName: string): Promise<{
    renderTime: number;
    fps: number;
    memoryUsage: number;
  }> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      let frameCount = 0;
      let totalRenderTime = 0;
      let maxMemoryUsage = 0;

      const settings = {
        startValue: 0,
        endValue: 100,
        duration: this.config.duration,
        fontFamily: "Arial",
        fontSize: 48,
        transition: transitionName,
        easing: "linear",
        prefix: "",
        suffix: "",
        separator: "none",
        useFloatValues: false,
        design: "classic",
        background: "black",
      };

      const animate = async (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / this.config.duration, 1);
        const currentValue =
          settings.startValue +
          (settings.endValue - settings.startValue) * progress;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render transition
        const renderStart = performance.now();

        try {
          await transitionEngineIntegration.renderTransition({
            canvas: this.canvas,
            ctx: this.ctx,
            settings,
            currentValue,
            previousValue: currentValue - 1,
            progress,
            timestamp: currentTime,
          });
        } catch (error) {
          console.warn(`Render error in ${transitionName}:`, error);
        }

        const renderTime = performance.now() - renderStart;
        totalRenderTime += renderTime;
        frameCount++;

        // Track memory usage
        const memoryInfo = transitionEngineIntegration.getMemoryUsage();
        if (memoryInfo) {
          maxMemoryUsage = Math.max(
            maxMemoryUsage,
            memoryInfo.totalMemory / (1024 * 1024)
          );
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Calculate final metrics
          const totalTime = performance.now() - startTime;
          const avgRenderTime = totalRenderTime / frameCount;
          const fps = (frameCount * 1000) / totalTime;

          resolve({
            renderTime: avgRenderTime,
            fps,
            memoryUsage: maxMemoryUsage,
          });
        }
      };

      requestAnimationFrame(animate);
    });
  }

  /**
   * Generate comprehensive test report
   */
  private generateTestReport(): void {
    console.log("\n📊 TRANSITION TEST REPORT");
    console.log("========================\n");

    const passedTests = this.testResults.filter((r) => r.success);
    const failedTests = this.testResults.filter((r) => !r.success);

    console.log(`✅ Passed: ${passedTests.length}/${this.testResults.length}`);
    console.log(
      `❌ Failed: ${failedTests.length}/${this.testResults.length}\n`
    );

    // Performance summary
    if (passedTests.length > 0) {
      const avgRenderTime =
        passedTests.reduce((sum, r) => sum + r.renderTime, 0) /
        passedTests.length;
      const avgFPS =
        passedTests.reduce((sum, r) => sum + r.fps, 0) / passedTests.length;
      const maxMemory = Math.max(...passedTests.map((r) => r.memoryUsage));

      console.log("📈 PERFORMANCE SUMMARY");
      console.log("---------------------");
      console.log(`Average Render Time: ${avgRenderTime.toFixed(2)}ms`);
      console.log(`Average FPS: ${avgFPS.toFixed(1)}`);
      console.log(`Peak Memory Usage: ${maxMemory.toFixed(1)}MB\n`);
    }

    // Detailed results
    console.log("📋 DETAILED RESULTS");
    console.log("------------------");
    this.testResults.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      const details = result.success
        ? `${result.renderTime.toFixed(2)}ms, ${result.fps.toFixed(
            1
          )}fps, ${result.memoryUsage.toFixed(1)}MB`
        : result.error || "Unknown error";

      console.log(`${status} ${result.name.padEnd(20)} | ${details}`);
    });

    // Recommendations
    console.log("\n💡 RECOMMENDATIONS");
    console.log("------------------");

    const slowTransitions = this.testResults.filter(
      (r) => r.success && r.renderTime > 10
    );
    if (slowTransitions.length > 0) {
      console.log("⚠️  Slow transitions detected:");
      slowTransitions.forEach((t) => {
        console.log(
          `   - ${t.name}: ${t.renderTime.toFixed(2)}ms (consider optimization)`
        );
      });
    }

    const lowFpsTransitions = this.testResults.filter(
      (r) => r.success && r.fps < 50
    );
    if (lowFpsTransitions.length > 0) {
      console.log("⚠️  Low FPS transitions detected:");
      lowFpsTransitions.forEach((t) => {
        console.log(
          `   - ${t.name}: ${t.fps.toFixed(1)}fps (may need quality reduction)`
        );
      });
    }

    if (
      failedTests.length === 0 &&
      slowTransitions.length === 0 &&
      lowFpsTransitions.length === 0
    ) {
      console.log("🎉 All transitions are performing optimally!");
    }

    console.log("\n✅ Test report generated successfully!\n");
  }

  /**
   * Test specific transition categories
   */
  async testCategory(
    category: "basic" | "multi-digit" | "special" | "advanced"
  ): Promise<TransitionTestResult[]> {
    const categoryTransitions = {
      basic: ["none", "fadeIn", "scale"],
      "multi-digit": [
        "fade-roll",
        "flip-down",
        "slide-vertical",
        "bounce",
        "odometer",
      ],
      special: ["slideUp", "slideDown", "glitch", "blur", "typewriter"],
      advanced: [
        "matrix-rain",
        "particle-explosion",
        "liquid-morph",
        "hologram-flicker",
      ],
    };

    const transitions = categoryTransitions[category] || [];
    const results: TransitionTestResult[] = [];

    console.log(`🧪 Testing ${category} transitions...\n`);

    for (const transition of transitions) {
      const result = await this.testTransition(transition);
      results.push(result);

      if (result.success) {
        console.log(
          `✓ ${transition}: ${result.renderTime.toFixed(
            2
          )}ms avg, ${result.fps.toFixed(1)} FPS`
        );
      } else {
        console.log(`✗ ${transition}: ${result.error}`);
      }
    }

    return results;
  }

  /**
   * Cleanup test resources
   */
  cleanup(): void {
    transitionEngineIntegration.destroy();
    console.log("🧹 Test cleanup completed");
  }
}

// Export test runner function
export async function runTransitionTests(): Promise<TransitionTestResult[]> {
  const tester = new TransitionLibraryTester();

  try {
    const results = await tester.runAllTests();
    return results;
  } finally {
    tester.cleanup();
  }
}

// Export category test runner
export async function runCategoryTests(
  category: "basic" | "multi-digit" | "special" | "advanced"
): Promise<TransitionTestResult[]> {
  const tester = new TransitionLibraryTester();

  try {
    const results = await tester.testCategory(category);
    return results;
  } finally {
    tester.cleanup();
  }
}
