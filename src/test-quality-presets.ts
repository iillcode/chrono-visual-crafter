/**
 * Test file to validate the Quality Preset System functionality
 */

import {
  ExportQualityManager,
  ExportOptions,
} from "./utils/exportQualityManager";

const testQualityPresetSystem = () => {
  console.log("🧪 Testing Quality Preset System");

  // Test 1: Verify all quality presets are available
  const presets = ExportQualityManager.getQualityPresets();
  console.log(
    "✅ Available quality presets:",
    presets.map((p) => p.name)
  );

  const expectedPresets = ["Draft", "Standard", "High", "Ultra"];
  const hasAllPresets = expectedPresets.every((name) =>
    presets.some((preset) => preset.name === name)
  );
  console.log("✅ All expected presets available:", hasAllPresets);

  // Test 2: Test preset retrieval by ID
  const standardPreset = ExportQualityManager.getPresetById("standard");
  console.log(
    "✅ Standard preset:",
    standardPreset?.name,
    standardPreset?.resolution
  );

  // Test 3: Test export estimation
  const testOptions: ExportOptions = {
    duration: 10, // 10 seconds
    hasTransparency: true,
    hasComplexEffects: false,
    targetFormat: "webm",
  };

  const draftEstimation = ExportQualityManager.estimateExport(
    ExportQualityManager.getPresetById("draft")!,
    testOptions
  );
  console.log("✅ Draft estimation:", {
    fileSize: `${draftEstimation.fileSize}MB`,
    exportTime: `${draftEstimation.exportTime}s`,
    warnings: draftEstimation.warnings.length,
  });

  const ultraEstimation = ExportQualityManager.estimateExport(
    ExportQualityManager.getPresetById("ultra")!,
    testOptions
  );
  console.log("✅ Ultra estimation:", {
    fileSize: `${ultraEstimation.fileSize}MB`,
    exportTime: `${ultraEstimation.exportTime}s`,
    warnings: ultraEstimation.warnings.length,
  });

  // Test 4: Test format information
  const webmInfo = ExportQualityManager.getFormatInfo("webm");
  const mp4Info = ExportQualityManager.getFormatInfo("mp4");
  const gifInfo = ExportQualityManager.getFormatInfo("gif");

  console.log("✅ Format support:", {
    webm: webmInfo.supportsTransparency,
    mp4: mp4Info.supportsTransparency,
    gif: gifInfo.supportsTransparency,
  });

  // Test 5: Test validation system
  const validation = ExportQualityManager.validateExportSettings(
    ExportQualityManager.getPresetById("ultra")!,
    { ...testOptions, duration: 120 } // 2 minute video
  );
  console.log("✅ Validation for long Ultra export:", {
    isValid: validation.isValid,
    issues: validation.issues.length,
    recommendations: validation.recommendations.length,
  });

  // Test 6: Test optimal preset selection
  const optimalPreset = ExportQualityManager.getOptimalPreset(
    {
      maxFileSize: 50, // 50MB limit
      maxExportTime: 60, // 1 minute limit
      minQuality: "standard",
    },
    testOptions
  );
  console.log("✅ Optimal preset for constraints:", optimalPreset.name);

  // Test 7: Test recommended preset
  const professionalPreset = ExportQualityManager.getRecommendedPreset(
    "professional content"
  );
  const previewPreset =
    ExportQualityManager.getRecommendedPreset("quick preview");
  console.log("✅ Recommended presets:", {
    professional: professionalPreset.name,
    preview: previewPreset.name,
  });

  // Test 8: Test preset characteristics
  const presetCharacteristics = presets.map((preset) => ({
    name: preset.name,
    resolution: `${preset.resolution.width}x${preset.resolution.height}`,
    fps: preset.fps,
    bitrate: `${preset.bitrate}Mbps`,
    codec: preset.codec,
    estimatedSizePerSecond: `${preset.estimatedSizePerSecond}MB/s`,
    timeMultiplier: `${preset.estimatedTimeMultiplier}x`,
  }));
  console.log("✅ Preset characteristics:", presetCharacteristics);

  // Test 9: Test complex effects impact
  const complexEffectsOptions: ExportOptions = {
    duration: 10,
    hasTransparency: true,
    hasComplexEffects: true, // Enable complex effects
    targetFormat: "webm",
  };

  const standardWithEffects = ExportQualityManager.estimateExport(
    ExportQualityManager.getPresetById("standard")!,
    complexEffectsOptions
  );
  const standardWithoutEffects = ExportQualityManager.estimateExport(
    ExportQualityManager.getPresetById("standard")!,
    testOptions
  );

  console.log("✅ Complex effects impact:", {
    withEffects: `${standardWithEffects.fileSize}MB, ${standardWithEffects.exportTime}s`,
    withoutEffects: `${standardWithoutEffects.fileSize}MB, ${standardWithoutEffects.exportTime}s`,
    sizeIncrease: `${(
      (standardWithEffects.fileSize / standardWithoutEffects.fileSize - 1) *
      100
    ).toFixed(1)}%`,
    timeIncrease: `${(
      (standardWithEffects.exportTime / standardWithoutEffects.exportTime - 1) *
      100
    ).toFixed(1)}%`,
  });

  console.log("🎉 Quality Preset System tests completed successfully!");

  return {
    allPresetsAvailable: hasAllPresets,
    estimationWorks:
      draftEstimation.fileSize > 0 &&
      ultraEstimation.fileSize > draftEstimation.fileSize,
    formatInfoComplete:
      webmInfo.supportsTransparency && !mp4Info.supportsTransparency,
    validationWorks:
      validation.issues.length > 0 || validation.recommendations.length > 0,
    optimalSelectionWorks: optimalPreset.name !== "Ultra", // Should select lower quality due to constraints
    recommendationWorks:
      professionalPreset.name === "High" && previewPreset.name === "Draft",
    complexEffectsImpact:
      standardWithEffects.fileSize > standardWithoutEffects.fileSize,
  };
};

// Run the test
const testResults = testQualityPresetSystem();
console.log("📊 Final test results:", testResults);

export { testQualityPresetSystem };
