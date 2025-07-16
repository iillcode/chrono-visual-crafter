/**
 * Simple validation script for performance monitoring system
 */

// Test that all required files exist and can be imported
const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "src/utils/performanceMonitor.ts",
  "src/utils/performanceOptimizer.ts",
  "src/utils/memoryManager.ts",
  "src/hooks/usePerformanceMonitor.ts",
  "src/components/PerformanceIndicator.tsx",
  "src/components/PerformanceDashboard.tsx",
  "src/test-performance-monitoring.ts",
];

console.log("Validating Performance Monitoring System...\n");

let allFilesExist = true;

requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} missing`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log("\n✓ All required files exist");

  // Check file contents for key exports
  const performanceMonitorPath = path.join(
    __dirname,
    "utils",
    "performanceMonitor.ts"
  );
  const performanceMonitorContent = fs.readFileSync(
    performanceMonitorPath,
    "utf8"
  );

  const requiredExports = [
    "export class PerformanceMonitor",
    "export const performanceMonitor",
    "export interface PerformanceMetrics",
    "export interface PerformanceOptimization",
  ];

  let allExportsFound = true;
  requiredExports.forEach((exportStr) => {
    if (performanceMonitorContent.includes(exportStr)) {
      console.log(`✓ Found: ${exportStr}`);
    } else {
      console.log(`✗ Missing: ${exportStr}`);
      allExportsFound = false;
    }
  });

  if (allExportsFound) {
    console.log("\n✓ All required exports found");
    console.log(
      "✓ Performance monitoring system validation completed successfully!"
    );
  } else {
    console.log("\n✗ Some exports are missing");
  }
} else {
  console.log("\n✗ Some required files are missing");
}

// Validate integration points
console.log("\nValidating integration points...");

// Check CounterPreview integration
const counterPreviewPath = path.join(
  __dirname,
  "components",
  "CounterPreview.tsx"
);
if (fs.existsSync(counterPreviewPath)) {
  const counterPreviewContent = fs.readFileSync(counterPreviewPath, "utf8");

  if (
    counterPreviewContent.includes("performanceMonitor") &&
    counterPreviewContent.includes("performanceOptimizer")
  ) {
    console.log("✓ CounterPreview integration found");
  } else {
    console.log("✗ CounterPreview integration missing");
  }
} else {
  console.log("✗ CounterPreview.tsx not found");
}

// Check Studio page integration
const studioPath = path.join(__dirname, "pages", "Studio.tsx");
if (fs.existsSync(studioPath)) {
  const studioContent = fs.readFileSync(studioPath, "utf8");

  if (studioContent.includes("PerformanceIndicator")) {
    console.log("✓ Studio page integration found");
  } else {
    console.log("✗ Studio page integration missing");
  }
} else {
  console.log("✗ Studio.tsx not found");
}

console.log("\n✓ Performance monitoring system validation completed!");
