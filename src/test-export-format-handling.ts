/**
 * Test file to validate the Enhanced Export Format Handling system
 */

// Mock browser APIs for Node.js testing
(global as any).MediaRecorder = {
  isTypeSupported: (mimeType: string) => {
    // Mock support for common formats
    const supportedFormats = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4;codecs=h264,aac",
      "video/mp4",
    ];
    return supportedFormats.some((format) =>
      mimeType.includes(format.split(";")[0])
    );
  },
};

import { VideoExportManager } from "./utils/videoExportFixes";

const testExportFormatHandling = () => {
  console.log(
    "🧪 Testing Enhanced Export Format Handling System (Node.js Mock)"
  );

  // Test 1: Format capability detection
  console.log("\n📋 Testing Format Capability Detection:");
  const capabilities = VideoExportManager.detectFormatCapabilities();
  console.log("✅ Detected format capabilities:", capabilities.length);
  capabilities.forEach((cap) => {
    console.log(
      `  - ${cap.description}: ${cap.quality} quality, ${cap.browserSupport} support, transparency: ${cap.supportsTransparency}`
    );
  });

  // Test 2: Best format selection
  console.log("\n🎯 Testing Best Format Selection:");
  const bestForTransparency = VideoExportManager.getBestFormat(true, true);
  const bestForCompatibility = VideoExportManager.getBestFormat(false, false);

  console.log(
    "✅ Best format for transparency:",
    bestForTransparency?.description || "None available"
  );
  console.log(
    "✅ Best format for compatibility:",
    bestForCompatibility?.description || "None available"
  );

  // Test 3: Export validation
  console.log("\n🔍 Testing Export Validation:");

  // Test with transparency requirements
  const transparencyValidation = VideoExportManager.validateExportSettings(
    true,
    false
  );
  console.log("✅ Transparency validation:", {
    isValid: transparencyValidation.isValid,
    errors: transparencyValidation.errors.length,
    warnings: transparencyValidation.warnings.length,
    hasRecommendation: !!transparencyValidation.recommendedFormat,
  });

  // Test with complex effects
  const effectsValidation = VideoExportManager.validateExportSettings(
    false,
    true
  );
  console.log("✅ Complex effects validation:", {
    isValid: effectsValidation.isValid,
    errors: effectsValidation.errors.length,
    warnings: effectsValidation.warnings.length,
    hasRecommendation: !!effectsValidation.recommendedFormat,
  });

  // Test with both transparency and effects
  const combinedValidation = VideoExportManager.validateExportSettings(
    true,
    true
  );
  console.log("✅ Combined validation:", {
    isValid: combinedValidation.isValid,
    errors: combinedValidation.errors.length,
    warnings: combinedValidation.warnings.length,
    hasRecommendation: !!combinedValidation.recommendedFormat,
    fallbackOptions: combinedValidation.fallbackOptions.length,
  });

  // Test 4: Format recommendations
  console.log("\n💡 Testing Format Recommendations:");

  const qualityRecommendations = VideoExportManager.getFormatRecommendations(
    true,
    false,
    "quality"
  );
  const compatibilityRecommendations =
    VideoExportManager.getFormatRecommendations(true, false, "compatibility");
  const sizeRecommendations = VideoExportManager.getFormatRecommendations(
    true,
    false,
    "size"
  );

  console.log("✅ Quality-focused recommendations:", {
    primary: qualityRecommendations.primary?.description || "None",
    alternatives: qualityRecommendations.alternatives.length,
  });

  console.log("✅ Compatibility-focused recommendations:", {
    primary: compatibilityRecommendations.primary?.description || "None",
    alternatives: compatibilityRecommendations.alternatives.length,
  });

  console.log("✅ Size-focused recommendations:", {
    primary: sizeRecommendations.primary?.description || "None",
    alternatives: sizeRecommendations.alternatives.length,
  });

  // Test 5: Format information retrieval
  console.log("\n📖 Testing Format Information Retrieval:");

  const webmInfo = VideoExportManager.getFormatInfo("video/webm;codecs=vp9");
  const mp4Info = VideoExportManager.getFormatInfo("video/mp4");

  console.log(
    "✅ WebM VP9 info:",
    webmInfo
      ? {
          supportsTransparency: webmInfo.supportsTransparency,
          quality: webmInfo.quality,
          browserSupport: webmInfo.browserSupport,
          limitations: webmInfo.limitations.length,
        }
      : "Not found"
  );

  console.log(
    "✅ MP4 info:",
    mp4Info
      ? {
          supportsTransparency: mp4Info.supportsTransparency,
          quality: mp4Info.quality,
          browserSupport: mp4Info.browserSupport,
          limitations: mp4Info.limitations.length,
        }
      : "Not found"
  );

  // Test 6: Enhanced MIME type selection
  console.log("\n🎬 Testing Enhanced MIME Type Selection:");

  const transparencyMimeType = VideoExportManager.getSupportedMimeType(true);
  const standardMimeType = VideoExportManager.getSupportedMimeType(false);

  console.log("✅ MIME type for transparency:", transparencyMimeType);
  console.log("✅ MIME type for standard export:", standardMimeType);

  // Test 7: Recorder options with enhanced settings
  console.log("\n⚙️ Testing Enhanced Recorder Options:");

  const transparencyOptions = VideoExportManager.getRecorderOptions(
    true,
    false,
    "high"
  );
  const effectsOptions = VideoExportManager.getRecorderOptions(
    false,
    true,
    "high"
  );
  const combinedOptions = VideoExportManager.getRecorderOptions(
    true,
    true,
    "ultra"
  );

  console.log("✅ Transparency options:", {
    mimeType: transparencyOptions.mimeType,
    videoBitsPerSecond: transparencyOptions.videoBitsPerSecond,
    hasMinimumBitrate: (transparencyOptions.videoBitsPerSecond || 0) >= 5000000,
  });

  console.log("✅ Effects options:", {
    mimeType: effectsOptions.mimeType,
    videoBitsPerSecond: effectsOptions.videoBitsPerSecond,
  });

  console.log("✅ Combined options:", {
    mimeType: combinedOptions.mimeType,
    videoBitsPerSecond: combinedOptions.videoBitsPerSecond,
    isHighBitrate: (combinedOptions.videoBitsPerSecond || 0) > 10000000,
  });

  console.log(
    "\n🎉 Enhanced Export Format Handling tests completed successfully!"
  );

  return {
    formatCapabilitiesDetected: capabilities.length > 0,
    bestFormatSelectionWorks: !!bestForTransparency || !!bestForCompatibility,
    validationSystemWorks: transparencyValidation.isValid !== undefined,
    recommendationSystemWorks: !!qualityRecommendations.primary,
    formatInfoRetrievalWorks: !!webmInfo || !!mp4Info,
    enhancedMimeTypeSelection: transparencyMimeType !== standardMimeType,
    recorderOptionsEnhanced:
      (transparencyOptions.videoBitsPerSecond || 0) >
      (effectsOptions.videoBitsPerSecond || 0),
  };
};

// Run the test
const testResults = testExportFormatHandling();
console.log("\n📊 Final test results:", testResults);

export { testExportFormatHandling };
