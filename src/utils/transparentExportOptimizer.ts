/**
 * Transparent Export Optimizer
 * Enhanced alpha channel preservation and quality optimization for transparent exports
 */

export interface TransparentExportSettings {
  preserveAlphaChannel: boolean;
  alphaChannelQuality: "standard" | "high" | "ultra";
  antiAliasing: boolean;
  subPixelRendering: boolean;
  premultipliedAlpha: boolean;
  colorSpaceCorrection: boolean;
  edgeSmoothing: boolean;
}

export interface SpecialEffectsOptimization {
  effectType: string;
  transparencyMode: "additive" | "multiply" | "screen" | "overlay";
  blendMode: GlobalCompositeOperation;
  alphaThreshold: number;
  edgeFeathering: number;
}

export interface ResolutionScaling {
  baseResolution: { width: number; height: number };
  targetResolution: { width: number; height: number };
  scalingAlgorithm: "bilinear" | "bicubic" | "lanczos";
  maintainAspectRatio: boolean;
  sharpening: number;
}

export class TransparentExportOptimizer {
  private static readonly ALPHA_QUALITY_SETTINGS = {
    standard: {
      alphaChannelBits: 8,
      compressionLevel: 6,
      dithering: false,
      edgeSmoothing: 1,
    },
    high: {
      alphaChannelBits: 8,
      compressionLevel: 4,
      dithering: true,
      edgeSmoothing: 2,
    },
    ultra: {
      alphaChannelBits: 8,
      compressionLevel: 2,
      dithering: true,
      edgeSmoothing: 3,
    },
  };

  private static readonly SPECIAL_EFFECTS_OPTIMIZATIONS: Record<
    string,
    SpecialEffectsOptimization
  > = {
    neon: {
      effectType: "neon",
      transparencyMode: "additive",
      blendMode: "screen",
      alphaThreshold: 0.1,
      edgeFeathering: 2,
    },
    glow: {
      effectType: "glow",
      transparencyMode: "additive",
      blendMode: "screen",
      alphaThreshold: 0.05,
      edgeFeathering: 3,
    },
    matrixRain: {
      effectType: "matrixRain",
      transparencyMode: "multiply",
      blendMode: "multiply",
      alphaThreshold: 0.2,
      edgeFeathering: 1,
    },
    particleExplosion: {
      effectType: "particleExplosion",
      transparencyMode: "additive",
      blendMode: "lighter",
      alphaThreshold: 0.15,
      edgeFeathering: 2,
    },
    liquidMorph: {
      effectType: "liquidMorph",
      transparencyMode: "overlay",
      blendMode: "overlay",
      alphaThreshold: 0.1,
      edgeFeathering: 4,
    },
    hologramFlicker: {
      effectType: "hologramFlicker",
      transparencyMode: "screen",
      blendMode: "screen",
      alphaThreshold: 0.3,
      edgeFeathering: 1,
    },
  };

  /**
   * Enhance alpha channel preservation for WebM exports
   */
  static enhanceAlphaChannelPreservation(
    canvas: HTMLCanvasElement,
    settings: TransparentExportSettings
  ): HTMLCanvasElement {
    const ctx = canvas.getContext("2d", {
      alpha: true,
      premultipliedAlpha: settings.premultipliedAlpha,
      colorSpace: settings.colorSpaceCorrection ? "display-p3" : "srgb",
      desynchronized: false,
      willReadFrequently: false,
    });

    if (!ctx) {
      throw new Error(
        "Failed to get canvas context for alpha channel enhancement"
      );
    }

    // Create enhanced canvas with optimized alpha handling
    const enhancedCanvas = document.createElement("canvas");
    enhancedCanvas.width = canvas.width;
    enhancedCanvas.height = canvas.height;

    const enhancedCtx = enhancedCanvas.getContext("2d", {
      alpha: true,
      premultipliedAlpha: settings.premultipliedAlpha,
      colorSpace: settings.colorSpaceCorrection ? "display-p3" : "srgb",
    });

    if (!enhancedCtx) {
      throw new Error("Failed to create enhanced canvas context");
    }

    // Apply alpha channel optimizations
    if (settings.antiAliasing) {
      enhancedCtx.imageSmoothingEnabled = true;
      enhancedCtx.imageSmoothingQuality = "high";
    }

    // Copy original canvas with alpha preservation
    enhancedCtx.globalCompositeOperation = "source-over";
    enhancedCtx.drawImage(canvas, 0, 0);

    // Apply edge smoothing for better alpha blending
    if (settings.edgeSmoothing) {
      this.applyEdgeSmoothing(enhancedCtx, canvas.width, canvas.height);
    }

    // Apply sub-pixel rendering optimization
    if (settings.subPixelRendering) {
      this.applySubPixelRendering(enhancedCtx, canvas.width, canvas.height);
    }

    return enhancedCanvas;
  }

  /**
   * Optimize special effects rendering with transparency
   */
  static optimizeSpecialEffectsTransparency(
    canvas: HTMLCanvasElement,
    effectType: string,
    settings: TransparentExportSettings
  ): HTMLCanvasElement {
    const optimization = this.SPECIAL_EFFECTS_OPTIMIZATIONS[effectType];
    if (!optimization) {
      console.warn(`No optimization available for effect: ${effectType}`);
      return canvas;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context for effects optimization");
    }

    // Create optimized canvas for special effects
    const optimizedCanvas = document.createElement("canvas");
    optimizedCanvas.width = canvas.width;
    optimizedCanvas.height = canvas.height;

    const optimizedCtx = optimizedCanvas.getContext("2d", {
      alpha: true,
      premultipliedAlpha: settings.premultipliedAlpha,
    });

    if (!optimizedCtx) {
      throw new Error("Failed to create optimized effects canvas context");
    }

    // Apply effect-specific optimizations
    optimizedCtx.globalCompositeOperation = optimization.blendMode;
    optimizedCtx.globalAlpha = 1.0;

    // Copy original canvas
    optimizedCtx.drawImage(canvas, 0, 0);

    // Apply alpha threshold optimization
    this.applyAlphaThreshold(
      optimizedCtx,
      canvas.width,
      canvas.height,
      optimization.alphaThreshold
    );

    // Apply edge feathering for smoother transparency
    if (optimization.edgeFeathering > 0) {
      this.applyEdgeFeathering(
        optimizedCtx,
        canvas.width,
        canvas.height,
        optimization.edgeFeathering
      );
    }

    return optimizedCanvas;
  }

  /**
   * Optimize transparent GIF export
   */
  static optimizeTransparentGIF(
    canvas: HTMLCanvasElement,
    settings: TransparentExportSettings
  ): {
    optimizedCanvas: HTMLCanvasElement;
    gifOptions: any;
  } {
    // Create GIF-optimized canvas
    const gifCanvas = document.createElement("canvas");
    gifCanvas.width = canvas.width;
    gifCanvas.height = canvas.height;

    const gifCtx = gifCanvas.getContext("2d");
    if (!gifCtx) {
      throw new Error("Failed to create GIF optimization canvas context");
    }

    // GIF transparency optimization
    gifCtx.globalCompositeOperation = "source-over";

    // Apply dithering for better transparency in GIF
    if (
      settings.alphaChannelQuality === "high" ||
      settings.alphaChannelQuality === "ultra"
    ) {
      this.applyDithering(gifCtx, canvas.width, canvas.height);
    }

    // Copy optimized content
    gifCtx.drawImage(canvas, 0, 0);

    // GIF-specific options for transparency
    const gifOptions = {
      transparent: 0x00000000, // Transparent color
      dispose: 2, // Restore to background
      delay: 100, // Frame delay
      quality:
        settings.alphaChannelQuality === "ultra"
          ? 1
          : settings.alphaChannelQuality === "high"
          ? 5
          : 10,
      dither: settings.alphaChannelQuality !== "standard",
      globalPalette: false,
      optimizeTransparency: true,
    };

    return {
      optimizedCanvas: gifCanvas,
      gifOptions,
    };
  }

  /**
   * Implement quality scaling for different resolutions
   */
  static scaleForResolution(
    canvas: HTMLCanvasElement,
    scaling: ResolutionScaling,
    settings: TransparentExportSettings
  ): HTMLCanvasElement {
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = scaling.targetResolution.width;
    scaledCanvas.height = scaling.targetResolution.height;

    const scaledCtx = scaledCanvas.getContext("2d", {
      alpha: true,
      premultipliedAlpha: settings.premultipliedAlpha,
    });

    if (!scaledCtx) {
      throw new Error("Failed to create scaled canvas context");
    }

    // Configure scaling algorithm
    scaledCtx.imageSmoothingEnabled = true;
    scaledCtx.imageSmoothingQuality =
      scaling.scalingAlgorithm === "bicubic" ? "high" : "medium";

    // Calculate scaling factors
    const scaleX =
      scaling.targetResolution.width / scaling.baseResolution.width;
    const scaleY =
      scaling.targetResolution.height / scaling.baseResolution.height;

    let finalScaleX = scaleX;
    let finalScaleY = scaleY;

    // Maintain aspect ratio if requested
    if (scaling.maintainAspectRatio) {
      const uniformScale = Math.min(scaleX, scaleY);
      finalScaleX = uniformScale;
      finalScaleY = uniformScale;
    }

    // Apply scaling with alpha preservation
    scaledCtx.save();
    scaledCtx.scale(finalScaleX, finalScaleY);
    scaledCtx.drawImage(canvas, 0, 0);
    scaledCtx.restore();

    // Apply sharpening if requested
    if (scaling.sharpening > 0) {
      this.applySharpening(
        scaledCtx,
        scaledCanvas.width,
        scaledCanvas.height,
        scaling.sharpening
      );
    }

    return scaledCanvas;
  }

  /**
   * Get optimized WebM encoder settings for transparency
   */
  static getOptimizedWebMSettings(
    hasTransparency: boolean,
    hasSpecialEffects: boolean,
    quality: "standard" | "high" | "ultra"
  ): MediaRecorderOptions {
    const baseSettings = {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 5000000, // Base 5Mbps
    };

    // Enhance settings for transparency
    if (hasTransparency) {
      baseSettings.videoBitsPerSecond *= 1.5; // Increase bitrate for alpha channel

      // VP9 specific optimizations for alpha
      const vp9Options = {
        ...baseSettings,
        mimeType: "video/webm;codecs=vp9",
        // VP9 alpha-specific parameters would go here if supported by MediaRecorder API
      };

      return vp9Options;
    }

    // Enhance settings for special effects
    if (hasSpecialEffects) {
      baseSettings.videoBitsPerSecond *= 1.3; // Increase bitrate for complex effects
    }

    // Quality-based adjustments
    const qualityMultipliers = {
      standard: 1.0,
      high: 1.5,
      ultra: 2.0,
    };

    baseSettings.videoBitsPerSecond *= qualityMultipliers[quality];

    return baseSettings;
  }

  /**
   * Apply edge smoothing for better alpha blending
   */
  private static applyEdgeSmoothing(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Simple edge smoothing algorithm
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];

      // Smooth edges by adjusting alpha values near boundaries
      if (alpha > 0 && alpha < 255) {
        // Apply smoothing to semi-transparent pixels
        const smoothedAlpha = Math.min(255, alpha * 1.2);
        data[i + 3] = smoothedAlpha;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply sub-pixel rendering optimization
   */
  private static applySubPixelRendering(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    // Sub-pixel rendering is primarily handled by the browser's text rendering engine
    // This method applies additional optimizations for better text clarity with transparency
    ctx.textRenderingOptimization = "optimizeQuality" as any;
  }

  /**
   * Apply alpha threshold optimization
   */
  private static applyAlphaThreshold(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    threshold: number
  ): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;

      // Apply threshold - pixels below threshold become fully transparent
      if (alpha < threshold) {
        data[i + 3] = 0;
      } else {
        // Enhance remaining alpha values
        data[i + 3] = Math.min(255, data[i + 3] * 1.1);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply edge feathering for smoother transparency
   */
  private static applyEdgeFeathering(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    featherRadius: number
  ): void {
    // Create a temporary canvas for feathering
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) return;

    // Copy original
    tempCtx.drawImage(ctx.canvas, 0, 0);

    // Apply blur for feathering effect
    ctx.filter = `blur(${featherRadius}px)`;
    ctx.globalAlpha = 0.5;
    ctx.drawImage(tempCanvas, 0, 0);

    // Reset filter and alpha
    ctx.filter = "none";
    ctx.globalAlpha = 1.0;
  }

  /**
   * Apply dithering for better GIF transparency
   */
  private static applyDithering(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Floyd-Steinberg dithering for alpha channel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const oldAlpha = data[index + 3];
        const newAlpha = oldAlpha > 128 ? 255 : 0;
        const error = oldAlpha - newAlpha;

        data[index + 3] = newAlpha;

        // Distribute error to neighboring pixels
        if (x + 1 < width) {
          data[index + 7] += (error * 7) / 16;
        }
        if (y + 1 < height) {
          if (x > 0) {
            data[((y + 1) * width + (x - 1)) * 4 + 3] += (error * 3) / 16;
          }
          data[((y + 1) * width + x) * 4 + 3] += (error * 5) / 16;
          if (x + 1 < width) {
            data[((y + 1) * width + (x + 1)) * 4 + 3] += (error * 1) / 16;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply sharpening filter
   */
  private static applySharpening(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);

    // Sharpening kernel
    const kernel = [
      0,
      -intensity,
      0,
      -intensity,
      1 + 4 * intensity,
      -intensity,
      0,
      -intensity,
      0,
    ];

    // Apply convolution
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          // RGB channels only, preserve alpha
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
            }
          }
          output[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, sum));
        }
      }
    }

    ctx.putImageData(new ImageData(output, width, height), 0, 0);
  }
}
