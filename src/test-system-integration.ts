/**
 * Comprehensive system integration test
 */

import { transitionEngineIntegration } from "./utils/transitionEngineIntegration";
import { userGuidanceSystem } from "./utils/userGuidanceSystem";
import { performanceMonitor } from "./utils/performanceMonitor";
import { performanceOptimizer } from "./utils/performanceOptimizer";
import { memoryManager } from "./utils/memoryManager";
import { runTransitionTests } from "./test-transition-library";

interface SystemTestResult {
  component: string;
  tests: {
    name: string;
    passed: boolean;
    error?: string;
    duration: number;
  }[];
  overallPassed: boolean;
  totalDuration: number;
}

export class SystemIntegrationTester {
  private testResults: SystemTestResult[] = [];

  /**
   * Run complete system integration tests
   */
  async runCompleteSystemTest(): Promise<SystemTestResult[]> {
    console.log("🚀 Starting Complete System Integration Test\n");
    console.log("===========================================\n");

    this.testResults = [];

    // Test each major component
    await this.testTransitionEngineIntegration();
    await this.testPerformanceMonitoring();
    await this.testMemoryManagement();
    await this.testUserGuidanceSystem();
    await this.testTransitionLibrary();
    await this.testEndToEndWorkflow();

    // Generate final report
    this.generateFinalReport();

    return this.testResults;
  }

  /**
   * Test transition engine integration
   */
  private async testTransitionEngineIntegration(): Promise<void> {
    console.log("🔧 Testing Transition Engine Integration...");
    const startTime = performance.now();
    const tests: SystemTestResult["tests"] = [];

    // Test 1: Initialization
    try {
      const testStart = performance.now();
      await transitionEngineIntegration.initialize();
      tests.push({
        name: "Integration Initialization",
        passed: true,
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Integration Initialization",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    // Test 2: Render Context Creation
    try {
      const testStart = performance.now();
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext("2d")!;

      const context = {
        canvas,
        ctx,
        settings: {
          transition: "fadeIn",
          fontSize: 48,
          fontFamily: "Arial",
        },
        currentValue: 50,
        previousValue: 0,
        progress: 0.5,
        timestamp: performance.now(),
      };

      await transitionEngineIntegration.renderTransition(context);
      tests.push({
        name: "Render Context Processing",
        passed: true,
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Render Context Processing",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    // Test 3: Performance Metrics Retrieval
    try {
      const testStart = performance.now();
      const metrics = transitionEngineIntegration.getPerformanceMetrics();
      const optimizationStatus =
        transitionEngineIntegration.getOptimizationStatus();
      const memoryUsage = transitionEngineIntegration.getMemoryUsage();

      tests.push({
        name: "Metrics Retrieval",
        passed:
          metrics !== null ||
          optimizationStatus !== null ||
          memoryUsage !== null,
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Metrics Retrieval",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    const totalDuration = performance.now() - startTime;
    const overallPassed = tests.every((test) => test.passed);

    this.testResults.push({
      component: "Transition Engine Integration",
      tests,
      overallPassed,
      totalDuration,
    });

    console.log(
      `${overallPassed ? "✅" : "❌"} Transition Engine Integration: ${
        tests.filter((t) => t.passed).length
      }/${tests.length} tests passed\n`
    );
  }

  /**
   * Test performance monitoring system
   */
  private async testPerformanceMonitoring(): Promise<void> {
    console.log("📊 Testing Performance Monitoring System...");
    const startTime = performance.now();
    const tests: SystemTestResult["tests"] = [];

    // Test 1: Performance Monitor Start/Stop
    try {
      const testStart = performance.now();
      performanceMonitor.startMonitoring();

      // Wait a bit for metrics to accumulate
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const metrics = performanceMonitor.getCurrentMetrics();
      performanceMonitor.stopMonitoring();

      tests.push({
        name: "Performance Monitor Lifecycle",
        passed: metrics !== null && typeof metrics.fps === "number",
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Performance Monitor Lifecycle",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    // Test 2: Optimization Suggestions
    try {
      const testStart = performance.now();
      const suggestions = performanceMonitor.getOptimizationSuggestions();
      const shouldOptimize = performanceMonitor.shouldOptimize();

      tests.push({
        name: "Optimization Suggestions",
        passed:
          Array.isArray(suggestions) && typeof shouldOptimize === "boolean",
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Optimization Suggestions",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    // Test 3: Render Time Recording
    try {
      const testStart = performance.now();
      const renderStart = performance.now();

      // Simulate some work
      for (let i = 0; i < 10000; i++) {
        Math.random();
      }

      performanceMonitor.recordRenderTime(renderStart);

      tests.push({
        name: "Render Time Recording",
        passed: true,
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Render Time Recording",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    const totalDuration = performance.now() - startTime;
    const overallPassed = tests.every((test) => test.passed);

    this.testResults.push({
      component: "Performance Monitoring",
      tests,
      overallPassed,
      totalDuration,
    });

    console.log(
      `${overallPassed ? "✅" : "❌"} Performance Monitoring: ${
        tests.filter((t) => t.passed).length
      }/${tests.length} tests passed\n`
    );
  }

  /**
   * Test memory management system
   */
  private async testMemoryManagement(): Promise<void> {
    console.log("🧠 Testing Memory Management System...");
    const startTime = performance.now();
    const tests: SystemTestResult["tests"] = [];

    // Test 1: Canvas Caching
    try {
      const testStart = performance.now();
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;

      memoryManager.cacheCanvas("test-canvas", canvas);
      const cachedCanvas = memoryManager.getCachedCanvas("test-canvas");

      tests.push({
        name: "Canvas Caching",
        passed: cachedCanvas === canvas,
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Canvas Caching",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    // Test 2: Memory Usage Tracking
    try {
      const testStart = performance.now();
      const memoryUsage = memoryManager.getMemoryUsage();
      const shouldCleanup = memoryManager.shouldCleanup();

      tests.push({
        name: "Memory Usage Tracking",
        passed:
          typeof memoryUsage.totalMemory === "number" &&
          typeof shouldCleanup === "boolean",
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Memory Usage Tracking",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    // Test 3: Memory Cleanup
    try {
      const testStart = performance.now();
      memoryManager.cleanup();
      const cacheStats = memoryManager.getCacheStats();

      tests.push({
        name: "Memory Cleanup",
        passed: typeof cacheStats.canvasCacheSize === "number",
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Memory Cleanup",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    const totalDuration = performance.now() - startTime;
    const overallPassed = tests.every((test) => test.passed);

    this.testResults.push({
      component: "Memory Management",
      tests,
      overallPassed,
      totalDuration,
    });

    console.log(
      `${overallPassed ? "✅" : "❌"} Memory Management: ${
        tests.filter((t) => t.passed).length
      }/${tests.length} tests passed\n`
    );
  }

  /**
   * Test user guidance system
   */
  private async testUserGuidanceSystem(): Promise<void> {
    console.log("🧭 Testing User Guidance System...");
    const startTime = performance.now();
    const tests: SystemTestResult["tests"] = [];

    // Test 1: Context Updates
    try {
      const testStart = performance.now();
      userGuidanceSystem.updateContext({
        currentTransition: "matrix-rain",
        isRecording: true,
        deviceCapabilities: {
          isMobile: true,
          hasGoodPerformance: false,
          supportsAdvancedEffects: false,
        },
      });

      const messages = userGuidanceSystem.getGuidanceMessages();

      tests.push({
        name: "Context Updates and Message Generation",
        passed: Array.isArray(messages),
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Context Updates and Message Generation",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    // Test 2: Message Categorization
    try {
      const testStart = performance.now();
      const performanceMessages =
        userGuidanceSystem.getMessagesByCategory("performance");
      const transitionMessages =
        userGuidanceSystem.getMessagesByCategory("transition");

      tests.push({
        name: "Message Categorization",
        passed:
          Array.isArray(performanceMessages) &&
          Array.isArray(transitionMessages),
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Message Categorization",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    // Test 3: Custom Messages
    try {
      const testStart = performance.now();
      const messageId = userGuidanceSystem.addCustomMessage({
        type: "info",
        title: "Test Message",
        message: "This is a test message",
        dismissible: true,
        priority: 1,
        category: "general",
      });

      userGuidanceSystem.dismissMessage(messageId);

      tests.push({
        name: "Custom Message Management",
        passed: typeof messageId === "string",
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Custom Message Management",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    const totalDuration = performance.now() - startTime;
    const overallPassed = tests.every((test) => test.passed);

    this.testResults.push({
      component: "User Guidance System",
      tests,
      overallPassed,
      totalDuration,
    });

    console.log(
      `${overallPassed ? "✅" : "❌"} User Guidance System: ${
        tests.filter((t) => t.passed).length
      }/${tests.length} tests passed\n`
    );
  }

  /**
   * Test transition library
   */
  private async testTransitionLibrary(): Promise<void> {
    console.log("🎬 Testing Transition Library...");
    const startTime = performance.now();

    try {
      // Run a subset of transition tests for integration testing
      const transitionResults = await runTransitionTests();
      const passedTransitions = transitionResults.filter((r) => r.success);

      const tests = [
        {
          name: "Transition Library Execution",
          passed: transitionResults.length > 0,
          duration: performance.now() - startTime,
        },
        {
          name: "Transition Success Rate",
          passed: passedTransitions.length / transitionResults.length >= 0.8, // 80% success rate
          duration: 0,
        },
      ];

      this.testResults.push({
        component: "Transition Library",
        tests,
        overallPassed: tests.every((test) => test.passed),
        totalDuration: performance.now() - startTime,
      });

      console.log(
        `${
          tests.every((test) => test.passed) ? "✅" : "❌"
        } Transition Library: ${passedTransitions.length}/${
          transitionResults.length
        } transitions passed\n`
      );
    } catch (error) {
      this.testResults.push({
        component: "Transition Library",
        tests: [
          {
            name: "Transition Library Execution",
            passed: false,
            error: error instanceof Error ? error.message : "Unknown error",
            duration: performance.now() - startTime,
          },
        ],
        overallPassed: false,
        totalDuration: performance.now() - startTime,
      });

      console.log("❌ Transition Library: Failed to execute tests\n");
    }
  }

  /**
   * Test end-to-end workflow
   */
  private async testEndToEndWorkflow(): Promise<void> {
    console.log("🔄 Testing End-to-End Workflow...");
    const startTime = performance.now();
    const tests: SystemTestResult["tests"] = [];

    // Test 1: Complete Animation Cycle
    try {
      const testStart = performance.now();

      // Initialize all systems
      await transitionEngineIntegration.initialize();
      performanceMonitor.startMonitoring();

      // Create test canvas
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext("2d")!;

      // Simulate animation cycle
      const settings = {
        startValue: 0,
        endValue: 100,
        duration: 1000,
        transition: "fadeIn",
        fontSize: 48,
        fontFamily: "Arial",
      };

      let frameCount = 0;
      const maxFrames = 60; // 1 second at 60fps

      const animateFrame = async (): Promise<void> => {
        const progress = frameCount / maxFrames;
        const currentValue =
          settings.startValue +
          (settings.endValue - settings.startValue) * progress;

        await transitionEngineIntegration.renderTransition({
          canvas,
          ctx,
          settings,
          currentValue,
          previousValue: currentValue - 1,
          progress,
          timestamp: performance.now(),
        });

        frameCount++;

        if (frameCount < maxFrames) {
          return new Promise((resolve) => {
            requestAnimationFrame(async () => {
              await animateFrame();
              resolve();
            });
          });
        }
      };

      await animateFrame();

      // Check final metrics
      const metrics = performanceMonitor.getCurrentMetrics();
      performanceMonitor.stopMonitoring();

      tests.push({
        name: "Complete Animation Cycle",
        passed: metrics !== null && frameCount === maxFrames,
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "Complete Animation Cycle",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    // Test 2: System Integration Under Load
    try {
      const testStart = performance.now();

      // Simulate high load scenario
      userGuidanceSystem.updateContext({
        performanceMetrics: {
          fps: 25, // Low FPS to trigger guidance
          memoryUsage: 85, // High memory usage
          renderTime: 20, // Slow render time
        },
      });

      const guidanceMessages = userGuidanceSystem.getGuidanceMessages();
      const hasPerformanceWarnings = guidanceMessages.some(
        (msg) => msg.category === "performance" && msg.type === "warning"
      );

      tests.push({
        name: "System Integration Under Load",
        passed: hasPerformanceWarnings,
        duration: performance.now() - testStart,
      });
    } catch (error) {
      tests.push({
        name: "System Integration Under Load",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: performance.now() - startTime,
      });
    }

    const totalDuration = performance.now() - startTime;
    const overallPassed = tests.every((test) => test.passed);

    this.testResults.push({
      component: "End-to-End Workflow",
      tests,
      overallPassed,
      totalDuration,
    });

    console.log(
      `${overallPassed ? "✅" : "❌"} End-to-End Workflow: ${
        tests.filter((t) => t.passed).length
      }/${tests.length} tests passed\n`
    );
  }

  /**
   * Generate final test report
   */
  private generateFinalReport(): void {
    console.log("📋 SYSTEM INTEGRATION TEST REPORT");
    console.log("==================================\n");

    const totalTests = this.testResults.reduce(
      (sum, result) => sum + result.tests.length,
      0
    );
    const passedTests = this.testResults.reduce(
      (sum, result) => sum + result.tests.filter((test) => test.passed).length,
      0
    );
    const totalDuration = this.testResults.reduce(
      (sum, result) => sum + result.totalDuration,
      0
    );

    console.log(`📊 OVERALL RESULTS`);
    console.log(`-----------------`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(
      `Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(
        1
      )}%)`
    );
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s\n`);

    console.log(`🔍 COMPONENT BREAKDOWN`);
    console.log(`---------------------`);

    this.testResults.forEach((result) => {
      const status = result.overallPassed ? "✅" : "❌";
      const passedCount = result.tests.filter((test) => test.passed).length;
      const duration = (result.totalDuration / 1000).toFixed(2);

      console.log(
        `${status} ${result.component}: ${passedCount}/${result.tests.length} tests (${duration}s)`
      );

      // Show failed tests
      const failedTests = result.tests.filter((test) => !test.passed);
      if (failedTests.length > 0) {
        failedTests.forEach((test) => {
          console.log(`   ❌ ${test.name}: ${test.error || "Unknown error"}`);
        });
      }
    });

    const overallSuccess = this.testResults.every(
      (result) => result.overallPassed
    );

    console.log(`\n${overallSuccess ? "🎉" : "⚠️"} FINAL RESULT`);
    console.log(`--------------`);

    if (overallSuccess) {
      console.log("✅ All system integration tests passed successfully!");
      console.log("🚀 The system is ready for production use.");
    } else {
      console.log("❌ Some system integration tests failed.");
      console.log(
        "🔧 Please review and fix the failing components before deployment."
      );
    }

    console.log(`\n📈 PERFORMANCE SUMMARY`);
    console.log(`---------------------`);
    console.log(
      `Average test duration: ${(totalDuration / totalTests).toFixed(2)}ms`
    );
    console.log(
      `System initialization time: ${(
        this.testResults[0]?.totalDuration || 0
      ).toFixed(2)}ms`
    );
    console.log(
      `Memory management efficiency: ${
        this.testResults.find((r) => r.component === "Memory Management")
          ?.overallPassed
          ? "Good"
          : "Needs improvement"
      }`
    );

    console.log("\n✅ System integration test completed!\n");
  }
}

// Export test runner
export async function runSystemIntegrationTests(): Promise<SystemTestResult[]> {
  const tester = new SystemIntegrationTester();
  return await tester.runCompleteSystemTest();
}
