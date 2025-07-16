/**
 * Export Quality Manager
 * Handles quality presets, file size estimation, and export optimization
 */

export interface QualityPreset {
  id: string;
  name: string;
  description: string;
  resolution: { width: number; height: number };
  fps: number;
  bitrate: number; // in Mbps
  codec: string;
  fileExtension: string;
  estimatedSizePerSecond: number; // in MB
  estimatedTimeMultiplier: number; // relative to real-time
  recommendedFor: string[];
  limitations?: string[];
}

export interface ExportEstimation {
  fileSize: number; // in MB
  exportTime: number; // in seconds
  quality: string;
  warnings: string[];
}

export interface ExportOptions {
  duration: number; // in seconds
  hasTransparency: boolean;
  hasComplexEffects: boolean;
  targetFormat: "webm" | "mp4" | "gif";
}

export class ExportQualityManager {
  private static readonly QUALITY_PRESETS: QualityPreset[] = [
    {
      id: "draft",
      name: "Draft",
      description: "Fast export for quick previews and testing",
      resolution: { width: 1280, height: 720 },
      fps: 30,
      bitrate: 2,
      codec: "vp8",
      fileExtension: "webm",
      estimatedSizePerSecond: 0.25, // 2Mbps = ~0.25MB/s
      estimatedTimeMultiplier: 0.5, // Faster than real-time
      recommendedFor: [
        "Quick previews",
        "Testing transitions",
        "Social media stories",
        "Draft versions",
      ],
      limitations: [
        "Lower resolution (720p)",
        "Reduced frame rate (30fps)",
        "May show compression artifacts",
      ],
    },
    {
      id: "standard",
      name: "Standard",
      description: "Balanced quality and file size for most use cases",
      resolution: { width: 1920, height: 1080 },
      fps: 60,
      bitrate: 5,
      codec: "vp9",
      fileExtension: "webm",
      estimatedSizePerSecond: 0.625, // 5Mbps = ~0.625MB/s
      estimatedTimeMultiplier: 1.2, // Slightly slower than real-time
      recommendedFor: [
        "YouTube videos",
        "General content creation",
        "Social media posts",
        "Presentations",
      ],
    },
    {
      id: "high",
      name: "High",
      description: "High quality for professional content and detailed work",
      resolution: { width: 1920, height: 1080 },
      fps: 60,
      bitrate: 8,
      codec: "vp9",
      fileExtension: "webm",
      estimatedSizePerSecond: 1.0, // 8Mbps = ~1MB/s
      estimatedTimeMultiplier: 1.8, // Slower export for higher quality
      recommendedFor: [
        "Professional videos",
        "Client presentations",
        "High-quality content",
        "Detailed animations",
      ],
      limitations: ["Larger file sizes", "Longer export times"],
    },
    {
      id: "ultra",
      name: "Ultra",
      description: "Maximum quality for premium content and large displays",
      resolution: { width: 2560, height: 1440 },
      fps: 60,
      bitrate: 12,
      codec: "vp9",
      fileExtension: "webm",
      estimatedSizePerSecond: 1.5, // 12Mbps = ~1.5MB/s
      estimatedTimeMultiplier: 3.0, // Much slower for maximum quality
      recommendedFor: [
        "Premium content",
        "Large displays",
        "4K upscaling",
        "Archive quality",
      ],
      limitations: [
        "Very large file sizes",
        "Significantly longer export times",
        "May require powerful hardware",
      ],
    },
  ];

  /**
   * Get all available quality presets
   */
  static getQualityPresets(): QualityPreset[] {
    return [...this.QUALITY_PRESETS];
  }

  /**
   * Get a specific quality preset by ID
   */
  static getPresetById(id: string): QualityPreset | null {
    return this.QUALITY_PRESETS.find((preset) => preset.id === id) || null;
  }

  /**
   * Get recommended preset based on use case
   */
  static getRecommendedPreset(useCase: string): QualityPreset {
    const lowerUseCase = useCase.toLowerCase();

    if (
      lowerUseCase.includes("preview") ||
      lowerUseCase.includes("test") ||
      lowerUseCase.includes("draft")
    ) {
      return this.QUALITY_PRESETS[0]; // Draft
    }

    if (
      lowerUseCase.includes("professional") ||
      lowerUseCase.includes("client") ||
      lowerUseCase.includes("high")
    ) {
      return this.QUALITY_PRESETS[2]; // High
    }

    if (
      lowerUseCase.includes("premium") ||
      lowerUseCase.includes("ultra") ||
      lowerUseCase.includes("4k")
    ) {
      return this.QUALITY_PRESETS[3]; // Ultra
    }

    return this.QUALITY_PRESETS[1]; // Standard (default)
  }

  /**
   * Estimate export file size and time
   */
  static estimateExport(
    preset: QualityPreset,
    options: ExportOptions
  ): ExportEstimation {
    let baseSize = preset.estimatedSizePerSecond * options.duration;
    let baseTime = options.duration * preset.estimatedTimeMultiplier;
    const warnings: string[] = [];

    // Adjust for transparency
    if (options.hasTransparency) {
      baseSize *= 1.3; // Transparency adds ~30% to file size
      baseTime *= 1.2; // Transparency adds ~20% to export time

      if (preset.codec === "vp8") {
        warnings.push(
          "VP8 codec has limited transparency support. Consider VP9 for better quality."
        );
      }
    }

    // Adjust for complex effects
    if (options.hasComplexEffects) {
      baseSize *= 1.4; // Complex effects add ~40% to file size
      baseTime *= 1.5; // Complex effects add ~50% to export time
      warnings.push(
        "Complex effects may increase export time and file size significantly."
      );
    }

    // Format-specific adjustments
    if (options.targetFormat === "gif") {
      baseSize *= 2.5; // GIFs are typically much larger
      baseTime *= 0.8; // But faster to export
      warnings.push(
        "GIF format results in larger file sizes but broader compatibility."
      );
    } else if (options.targetFormat === "mp4") {
      baseSize *= 0.8; // MP4 is typically smaller
      if (options.hasTransparency) {
        warnings.push(
          "MP4 format does not support transparency. Consider WebM instead."
        );
      }
    }

    // Quality warnings
    if (preset.id === "draft") {
      warnings.push(
        "Draft quality may show compression artifacts in detailed animations."
      );
    } else if (preset.id === "ultra") {
      warnings.push(
        "Ultra quality requires significant processing time and storage space."
      );
    }

    // Duration warnings
    if (options.duration > 30 && preset.id === "ultra") {
      warnings.push(
        "Long animations with Ultra quality may take considerable time to export."
      );
    }

    return {
      fileSize: Math.round(baseSize * 100) / 100, // Round to 2 decimal places
      exportTime: Math.round(baseTime),
      quality: preset.name,
      warnings,
    };
  }

  /**
   * Get format capabilities and recommendations
   */
  static getFormatInfo(format: "webm" | "mp4" | "gif") {
    const formatInfo = {
      webm: {
        name: "WebM",
        description: "Modern web video format with excellent compression",
        supportsTransparency: true,
        browserSupport: "Modern browsers (Chrome, Firefox, Edge)",
        bestFor: ["Web content", "Transparent backgrounds", "High quality"],
        limitations: [
          "Limited support in older browsers",
          "Not supported in Safari on older versions",
        ],
      },
      mp4: {
        name: "MP4",
        description: "Universal video format with broad compatibility",
        supportsTransparency: false,
        browserSupport: "All browsers and devices",
        bestFor: ["Universal compatibility", "Mobile devices", "Social media"],
        limitations: [
          "No transparency support",
          "Larger file sizes for same quality",
        ],
      },
      gif: {
        name: "GIF",
        description: "Animated image format with universal support",
        supportsTransparency: true,
        browserSupport: "Universal (all browsers and platforms)",
        bestFor: ["Simple animations", "Social media", "Email compatibility"],
        limitations: [
          "Large file sizes",
          "Limited color palette",
          "No audio support",
        ],
      },
    };

    return formatInfo[format];
  }

  /**
   * Validate export settings and provide recommendations
   */
  static validateExportSettings(preset: QualityPreset, options: ExportOptions) {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for potential issues
    if (options.hasTransparency && preset.codec === "vp8") {
      issues.push("VP8 codec may not preserve transparency quality optimally");
      recommendations.push(
        "Consider using VP9 codec for better transparency support"
      );
    }

    if (options.duration > 60 && preset.id === "ultra") {
      issues.push("Very long export time expected for Ultra quality");
      recommendations.push("Consider using High quality for long animations");
    }

    if (options.hasComplexEffects && preset.id === "draft") {
      issues.push("Complex effects may not render well in Draft quality");
      recommendations.push(
        "Consider Standard or High quality for complex effects"
      );
    }

    // File size warnings
    const estimation = this.estimateExport(preset, options);
    if (estimation.fileSize > 100) {
      issues.push("Very large file size expected (>100MB)");
      recommendations.push(
        "Consider reducing duration or using a lower quality preset"
      );
    }

    if (estimation.exportTime > 300) {
      // 5 minutes
      issues.push("Very long export time expected (>5 minutes)");
      recommendations.push(
        "Consider using a faster quality preset for quicker exports"
      );
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
      estimation,
    };
  }

  /**
   * Get optimal preset for given constraints
   */
  static getOptimalPreset(
    constraints: {
      maxFileSize?: number; // in MB
      maxExportTime?: number; // in seconds
      minQuality?: "draft" | "standard" | "high" | "ultra";
      hasTransparency?: boolean;
      hasComplexEffects?: boolean;
    },
    options: ExportOptions
  ): QualityPreset {
    const presets = this.QUALITY_PRESETS.slice();

    // Filter by minimum quality
    let filteredPresets = presets;
    if (constraints.minQuality) {
      const minIndex = presets.findIndex(
        (p) => p.id === constraints.minQuality
      );
      filteredPresets = presets.slice(minIndex);
    }

    // Find the best preset that meets constraints
    for (const preset of filteredPresets.reverse()) {
      // Start with highest quality
      const estimation = this.estimateExport(preset, options);

      const meetsFileSize =
        !constraints.maxFileSize ||
        estimation.fileSize <= constraints.maxFileSize;
      const meetsExportTime =
        !constraints.maxExportTime ||
        estimation.exportTime <= constraints.maxExportTime;

      if (meetsFileSize && meetsExportTime) {
        return preset;
      }
    }

    // If no preset meets constraints, return the lowest quality
    return presets[0];
  }
}
