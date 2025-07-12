import { toast } from "sonner";
import JSZip from "jszip";

export interface TransparentExportOptions {
  // Content options
  includeCounter: boolean;
  includeText: boolean;

  // Format options
  format: "png-sequence" | "webm-alpha" | "both";

  // Quality options
  width: number;
  height: number;
  frameRate: number;
  duration: number;

  // Scaling options
  scale: number; // 0.5 to 4.0

  // Animation options
  preserveAnimations: boolean;
  transitionType: string;
  easingFunction: string;
}

export interface CounterSettings {
  startValue: number;
  endValue: number;
  duration: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  design: string;
  transition: string;
  easing: string;
  prefix: string;
  suffix: string;
  separator: string;
  useFloatValues: boolean;
}

export interface TextSettings {
  enabled: boolean;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  offsetX: number;
  offsetY: number;
  opacity: number;
}

export interface DesignSettings {
  neonColor: string;
  neonIntensity: number;
  glowColor: string;
  glowIntensity: number;
  gradientColors: string;
  fireColors: string;
  fireGlow: number;
  rainbowColors: string;
  chromeColors: string;
}

// Easing functions for transitions
const easingFunctions = {
  linear: (progress: number): number => progress,
  easeOut: (progress: number): number => 1 - Math.pow(1 - progress, 2),
  easeIn: (progress: number): number => progress * progress,
  bounce: (progress: number): number => {
    if (progress < 0.5) {
      return 4 * progress * progress;
    } else if (progress < 0.8) {
      return 1 + (progress - 0.8) * 5;
    } else {
      return 1 - 0.5 * Math.pow((progress - 1) * 2.5, 2);
    }
  },
};

export class TransparentCounterExporter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private exportOptions: TransparentExportOptions;
  private counterSettings: CounterSettings;
  private textSettings: TextSettings;
  private designSettings: DesignSettings;
  private previousValue: number = 0;
  private digitTransitions: Map<
    number,
    { oldDigit: string; newDigit: string; progress: number }
  > = new Map();

  constructor(
    exportOptions: TransparentExportOptions,
    counterSettings: CounterSettings,
    textSettings: TextSettings,
    designSettings: DesignSettings
  ) {
    this.exportOptions = exportOptions;
    this.counterSettings = counterSettings;
    this.textSettings = textSettings;
    this.designSettings = designSettings;

    // Create high-resolution canvas for export
    this.canvas = document.createElement("canvas");
    this.canvas.width = exportOptions.width * exportOptions.scale;
    this.canvas.height = exportOptions.height * exportOptions.scale;

    const ctx = this.canvas.getContext("2d", {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    }) as CanvasRenderingContext2D;

    if (!ctx) {
      throw new Error("Could not create canvas context");
    }

    this.ctx = ctx;

    // Configure context for high quality rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
    this.ctx.scale(exportOptions.scale, exportOptions.scale);
  }

  private formatNumber(value: number): string {
    const hasDecimal = value % 1 !== 0;
    let formattedValue;

    if (this.counterSettings.useFloatValues) {
      formattedValue = value.toFixed(2).replace(/\.?0+$/, "");
      if (formattedValue.indexOf(".") === -1 && hasDecimal) {
        formattedValue = value.toFixed(1);
      }
    } else {
      formattedValue = Math.round(value).toString();
    }

    // Apply separator
    if (
      this.counterSettings.separator &&
      this.counterSettings.separator !== "none"
    ) {
      const separator =
        this.counterSettings.separator === "comma"
          ? ","
          : this.counterSettings.separator === "dot"
          ? "."
          : this.counterSettings.separator === "space"
          ? " "
          : "";

      if (separator) {
        if (formattedValue.includes(".")) {
          const parts = formattedValue.split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
          formattedValue = parts.join(".");
        } else {
          formattedValue = formattedValue.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            separator
          );
        }
      }
    }

    return `${this.counterSettings.prefix || ""}${formattedValue}${
      this.counterSettings.suffix || ""
    }`;
  }

  private getFontFamily(fontKey: string): string {
    const fontMap: Record<string, string> = {
      inter: '"Inter", sans-serif',
      mono: '"Roboto Mono", monospace',
      poppins: '"Poppins", sans-serif',
      orbitron: '"Orbitron", monospace',
      rajdhani: '"Rajdhani", sans-serif',
      exo: '"Exo 2", sans-serif',
      play: '"Play", sans-serif',
      russo: '"Russo One", sans-serif',
      audiowide: '"Audiowide", monospace',
      michroma: '"Michroma", monospace',
      roboto: '"Roboto", sans-serif',
      montserrat: '"Montserrat", sans-serif',
      arial: '"Arial", sans-serif',
    };

    return fontMap[fontKey] || '"Inter", sans-serif';
  }

  private applyDesignEffects(
    text: string,
    x: number,
    y: number,
    fontSize: number
  ): void {
    const effects = {
      classic: () => {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText(text, x, y);
      },

      neon: () => {
        const neonColor = this.designSettings.neonColor || "#00FFFF";
        const intensity = this.designSettings.neonIntensity || 10;

        this.ctx.save();

        // Clear any existing shadows
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "rgba(0,0,0,0)";

        // Create contained neon effect to prevent color spreading
        this.ctx.globalCompositeOperation = "source-over";

        // Base text layer
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText(text, x, y);

        // Neon glow layers with controlled spread
        this.ctx.globalCompositeOperation = "screen";

        // Inner glow
        this.ctx.globalAlpha = 0.9;
        this.ctx.shadowColor = neonColor;
        this.ctx.shadowBlur = Math.max(2, intensity * 0.5);
        this.ctx.strokeStyle = neonColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeText(text, x, y);

        // Outer glow
        this.ctx.globalAlpha = 0.7;
        this.ctx.shadowBlur = Math.max(4, intensity * 0.8);
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(text, x, y);

        // Final colored text
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = neonColor;
        this.ctx.fillText(text, x, y);

        this.ctx.restore();
      },

      glow: () => {
        const glowColor = this.designSettings.glowColor || "#FFFFFF";
        const intensity = this.designSettings.glowIntensity || 15;

        this.ctx.save();

        // Clear any existing shadows
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "rgba(0,0,0,0)";

        // Create contained glow effect
        this.ctx.globalCompositeOperation = "source-over";

        // Multiple glow layers with controlled intensity
        for (let i = 3; i >= 1; i--) {
          this.ctx.globalAlpha = 0.3 / i;
          this.ctx.shadowColor = glowColor;
          this.ctx.shadowBlur = intensity * i * 0.5;
          this.ctx.fillStyle = glowColor;
          this.ctx.fillText(text, x, y);
        }

        // Final sharp text
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = glowColor;
        this.ctx.fillText(text, x, y);

        this.ctx.restore();
      },

      gradient: () => {
        const gradient = this.ctx.createLinearGradient(
          x - fontSize,
          y - fontSize / 2,
          x + fontSize,
          y + fontSize / 2
        );

        const colorMatches =
          this.designSettings.gradientColors.match(/#[0-9A-Fa-f]{6}/g);
        if (colorMatches && colorMatches.length > 0) {
          colorMatches.forEach((color, index) => {
            gradient.addColorStop(index / (colorMatches.length - 1), color);
          });
        } else {
          gradient.addColorStop(0, "#FF6B6B");
          gradient.addColorStop(0.25, "#4ECDC4");
          gradient.addColorStop(0.5, "#45B7D1");
          gradient.addColorStop(0.75, "#96CEB4");
          gradient.addColorStop(1, "#FFEAA7");
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillText(text, x, y);
      },

      fire: () => {
        const gradient = this.ctx.createLinearGradient(
          x,
          y - fontSize / 2,
          x,
          y + fontSize / 2
        );
        const colorMatches =
          this.designSettings.fireColors.match(/#[0-9A-Fa-f]{6}/g);

        if (colorMatches && colorMatches.length > 0) {
          colorMatches.forEach((color, index) => {
            gradient.addColorStop(index / (colorMatches.length - 1), color);
          });
        } else {
          gradient.addColorStop(0, "#FF4444");
          gradient.addColorStop(0.5, "#FF8800");
          gradient.addColorStop(1, "#FFFF00");
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillText(text, x, y);

        // Controlled fire glow
        const fireGlow = this.designSettings.fireGlow || 10;
        this.ctx.save();
        this.ctx.shadowColor = "#FF4444";
        this.ctx.shadowBlur = Math.min(fireGlow, 15); // Limit glow spread
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
      },

      rainbow: () => {
        const gradient = this.ctx.createLinearGradient(
          x - fontSize,
          y - fontSize / 2,
          x + fontSize,
          y + fontSize / 2
        );

        const colorMatches =
          this.designSettings.rainbowColors.match(/#[0-9A-Fa-f]{6}/g);
        if (colorMatches && colorMatches.length > 0) {
          colorMatches.forEach((color, index) => {
            gradient.addColorStop(index / (colorMatches.length - 1), color);
          });
        } else {
          gradient.addColorStop(0, "#FF0000");
          gradient.addColorStop(0.17, "#FF8800");
          gradient.addColorStop(0.33, "#FFFF00");
          gradient.addColorStop(0.5, "#00FF00");
          gradient.addColorStop(0.67, "#0088FF");
          gradient.addColorStop(0.83, "#8800FF");
          gradient.addColorStop(1, "#FF0088");
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillText(text, x, y);
      },

      chrome: () => {
        const gradient = this.ctx.createLinearGradient(
          x,
          y - fontSize / 2,
          x,
          y + fontSize / 2
        );
        const colorMatches =
          this.designSettings.chromeColors.match(/#[0-9A-Fa-f]{6}/g);

        if (colorMatches && colorMatches.length > 0) {
          colorMatches.forEach((color, index) => {
            gradient.addColorStop(index / (colorMatches.length - 1), color);
          });
        } else {
          gradient.addColorStop(0, "#FFFFFF");
          gradient.addColorStop(0.5, "#CCCCCC");
          gradient.addColorStop(1, "#999999");
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillText(text, x, y);
      },
    };

    const effect =
      effects[this.counterSettings.design as keyof typeof effects] ||
      effects.classic;
    effect();
  }

  private applyDigitTransition(
    digit: string,
    x: number,
    y: number,
    fontSize: number,
    transitionProgress: number,
    transitionType: string
  ): { x: number; y: number; opacity: number; transform?: () => void } {
    const effects = {
      none: () => ({ x, y, opacity: 1 }),

      fadeIn: () => {
        const easeInOutCubic =
          transitionProgress < 0.5
            ? 4 * transitionProgress * transitionProgress * transitionProgress
            : 1 - Math.pow(-2 * transitionProgress + 2, 3) / 2;
        return { x, y, opacity: easeInOutCubic };
      },

      "fade-roll": () => {
        const rollDistance = fontSize * 0.3;
        const rollY = y - (1 - transitionProgress) * rollDistance;
        const opacity = transitionProgress;
        return {
          x,
          y: rollY,
          opacity,
          transform: () => {
            this.ctx.save();
            this.ctx.translate(x, rollY);
            this.ctx.rotate((1 - transitionProgress) * Math.PI * 0.1);
            this.ctx.translate(-x, -rollY);
          },
        };
      },

      "flip-down": () => {
        const scaleY = Math.abs(Math.cos(transitionProgress * Math.PI));
        const opacity = scaleY > 0.1 ? 1 : 0;
        return {
          x,
          y,
          opacity,
          transform: () => {
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.scale(1, Math.max(0.1, scaleY));
            this.ctx.translate(-x, -y);
          },
        };
      },

      "slide-vertical": () => {
        const slideDistance = fontSize * 1.2;
        const slideY = y + (1 - transitionProgress) * slideDistance;
        return { x, y: slideY, opacity: transitionProgress };
      },

      bounce: () => {
        const bounceHeight =
          Math.sin(transitionProgress * Math.PI) * (fontSize * 0.3);
        const bounceY = y - bounceHeight;
        return { x, y: bounceY, opacity: 1 };
      },

      scale: () => {
        const scaleValue = 0.3 + transitionProgress * 0.7;
        return {
          x,
          y,
          opacity: transitionProgress,
          transform: () => {
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.scale(scaleValue, scaleValue);
            this.ctx.translate(-x, -y);
          },
        };
      },

      slideUp: () => {
        const distance = fontSize * 1.5;
        const offset = (1 - transitionProgress) * distance;
        return { x, y: y + offset, opacity: 0.3 + transitionProgress * 0.7 };
      },

      slideDown: () => {
        const distance = fontSize * 1.5;
        const offset = (1 - transitionProgress) * -distance;
        return { x, y: y + offset, opacity: 0.3 + transitionProgress * 0.7 };
      },

      glitch: () => {
        if (transitionProgress < 0.8 && Math.random() > 0.7) {
          const glitchX = (Math.random() - 0.5) * 10;
          const glitchY = (Math.random() - 0.5) * 10;
          return {
            x: x + glitchX,
            y: y + glitchY,
            opacity: 0.7 + Math.random() * 0.3,
          };
        }
        return { x, y, opacity: 0.7 + transitionProgress * 0.3 };
      },

      blur: () => {
        return { x, y, opacity: transitionProgress };
      },

      typewriter: () => {
        return { x, y, opacity: 1 };
      },
    };

    const effect =
      effects[transitionType as keyof typeof effects] || effects.none;
    return effect();
  }

  private updateDigitTransitions(
    currentValue: number,
    frameProgress: number
  ): void {
    const currentText = this.formatNumber(currentValue);
    const previousText = this.formatNumber(this.previousValue);

    // Clear old transitions
    this.digitTransitions.clear();

    // Find digit changes
    const maxLength = Math.max(currentText.length, previousText.length);
    for (let i = 0; i < maxLength; i++) {
      const currentDigit = currentText[i] || "";
      const previousDigit = previousText[i] || "";

      if (currentDigit !== previousDigit) {
        this.digitTransitions.set(i, {
          oldDigit: previousDigit,
          newDigit: currentDigit,
          progress: frameProgress,
        });
      }
    }

    this.previousValue = currentValue;
  }

  private drawMultiDigitCounter(
    value: number,
    centerX: number,
    centerY: number,
    frameProgress: number
  ): void {
    const counterText = this.formatNumber(value);
    const fontSize = this.counterSettings.fontSize;
    const fontFamily = this.getFontFamily(this.counterSettings.fontFamily);
    const letterSpacing = this.counterSettings.letterSpacing || 0;

    this.ctx.font = `${
      this.counterSettings.fontWeight || 400
    } ${fontSize}px ${fontFamily}`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Calculate total width for centering
    let totalWidth = 0;
    for (let i = 0; i < counterText.length; i++) {
      const char = counterText[i];
      const charWidth = this.ctx.measureText(char).width;
      totalWidth +=
        charWidth + (i < counterText.length - 1 ? letterSpacing : 0);
    }

    // Apply easing to frame progress
    const easedProgress =
      this.counterSettings.easing &&
      this.counterSettings.easing in easingFunctions
        ? easingFunctions[
            this.counterSettings.easing as keyof typeof easingFunctions
          ](frameProgress)
        : frameProgress;

    // Draw each digit with individual transitions
    let currentX = centerX - totalWidth / 2;

    for (let i = 0; i < counterText.length; i++) {
      const char = counterText[i];
      const charWidth = this.ctx.measureText(char).width;
      const digitX = currentX + charWidth / 2;

      // Check if this digit has a transition
      const transition = this.digitTransitions.get(i);
      let digitProgress = easedProgress;

      if (transition && this.exportOptions.preserveAnimations) {
        // Use transition-specific progress
        digitProgress = transition.progress;
      }

      // Apply digit-specific transition
      const {
        x: tX,
        y: tY,
        opacity: tOpacity,
        transform,
      } = this.applyDigitTransition(
        char,
        digitX,
        centerY,
        fontSize,
        digitProgress,
        this.counterSettings.transition
      );

      // Save context for this digit
      this.ctx.save();

      // Apply transform if provided
      if (transform) {
        transform();
      }

      // Apply opacity
      this.ctx.globalAlpha = tOpacity;

      // Draw the digit with design effects
      this.applyDesignEffects(char, tX, tY, fontSize);

      // Restore context
      this.ctx.restore();

      currentX += charWidth + letterSpacing;
    }
  }

  private drawFrame(value: number, progress: number): void {
    // Clear canvas with full transparency
    this.ctx.clearRect(
      0,
      0,
      this.exportOptions.width,
      this.exportOptions.height
    );

    const centerX = this.exportOptions.width / 2;
    const centerY = this.exportOptions.height / 2;

    // Update digit transitions
    this.updateDigitTransitions(value, progress);

    // Draw counter if enabled
    if (this.exportOptions.includeCounter) {
      this.drawMultiDigitCounter(value, centerX, centerY, progress);
    }

    // Draw text if enabled
    if (
      this.exportOptions.includeText &&
      this.textSettings.enabled &&
      this.textSettings.text
    ) {
      const textX = centerX + this.textSettings.offsetX;
      const textY = centerY + this.textSettings.offsetY;
      const textFontSize = this.textSettings.fontSize;
      const textFontFamily = this.getFontFamily(this.textSettings.fontFamily);

      this.ctx.font = `${textFontSize}px ${textFontFamily}`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      const previousAlpha = this.ctx.globalAlpha;
      this.ctx.globalAlpha = this.textSettings.opacity;

      // Apply same design effects as counter for consistency
      this.applyDesignEffects(
        this.textSettings.text,
        textX,
        textY,
        textFontSize
      );

      this.ctx.globalAlpha = previousAlpha;
    }
  }

  private async generatePNGSequence(
    checkCancellation?: () => boolean
  ): Promise<Blob> {
    const zip = new JSZip();
    const frameCount = Math.ceil(
      this.exportOptions.frameRate * this.exportOptions.duration
    );

    toast.info(`Generating ${frameCount} PNG frames...`);

    // Initialize transition progress tracking
    const transitionDuration = Math.ceil(frameCount * 0.25); // 25% of total frames for transition
    this.digitTransitions.clear(); // Clear any previous transitions
    let initialTransitionApplied = false;

    for (let frame = 0; frame < frameCount; frame++) {
      // Check for cancellation
      if (checkCancellation && checkCancellation()) {
        toast.info("PNG sequence generation cancelled");
        // Return partial result if some frames were generated
        if (frame > 0) {
          return await zip.generateAsync({ type: "blob" });
        }
        throw new Error("Export cancelled");
      }

      const progress = frame / (frameCount - 1);
      const value =
        this.counterSettings.startValue +
        progress *
          (this.counterSettings.endValue - this.counterSettings.startValue);

      // Handle initial fade-in and transitions
      if (frame < transitionDuration && !initialTransitionApplied) {
        const fadeProgress = frame / transitionDuration;

        // Create initial transitions for all digits
        if (frame === 0) {
          const text = this.formatNumber(value);
          for (let i = 0; i < text.length; i++) {
            this.digitTransitions.set(i, {
              oldDigit: "",
              newDigit: text[i],
              progress: fadeProgress,
            });
          }
          initialTransitionApplied = true;
        } else {
          // Update transition progress for initial fade
          this.digitTransitions.forEach((transition, index) => {
            transition.progress = fadeProgress;
          });
        }
      }

      // Clear canvas for each frame
      this.ctx.clearRect(
        0,
        0,
        this.exportOptions.width,
        this.exportOptions.height
      );

      // Draw frame with special handling for transitions
      if (frame < transitionDuration) {
        // For initial frames, use explicit transition progress
        const fadeProgress = frame / transitionDuration;
        this.drawFrameWithExplicitTransition(value, fadeProgress);
      } else {
        // For later frames, use normal drawing
        this.drawFrame(value, progress);
      }

      // Convert canvas to PNG blob
      const blob = await new Promise<Blob>((resolve) => {
        this.canvas.toBlob((blob) => {
          resolve(blob!);
        }, "image/png");
      });

      // Add to zip with zero-padded frame number
      const frameNumber = frame.toString().padStart(6, "0");
      const arrayBuffer = await blob.arrayBuffer();
      zip.file(`frame${frameNumber}.png`, arrayBuffer);

      // Update progress
      if (frame % 10 === 0) {
        toast.info(`Generated ${frame + 1}/${frameCount} frames`);
      }
    }

    // Add metadata file
    const metadata = {
      frameRate: this.exportOptions.frameRate,
      duration: this.exportOptions.duration,
      width: this.canvas.width,
      height: this.canvas.height,
      frameCount: frameCount,
      counterSettings: this.counterSettings,
      textSettings: this.textSettings,
      designSettings: this.designSettings,
      exportOptions: this.exportOptions,
      generatedAt: new Date().toISOString(),
    };

    zip.file("metadata.json", JSON.stringify(metadata, null, 2));

    toast.info("Compressing PNG sequence...");
    return await zip.generateAsync({ type: "blob" });
  }

  // Special drawing method with explicit transition progress
  private drawFrameWithExplicitTransition(
    value: number,
    transitionProgress: number
  ): void {
    const centerX = this.exportOptions.width / 2;
    const centerY = this.exportOptions.height / 2;

    // Draw counter with explicit transition progress
    if (this.exportOptions.includeCounter) {
      this.drawTransitioningCounter(
        value,
        centerX,
        centerY,
        transitionProgress
      );
    }

    // Draw text with explicit transition if enabled
    if (
      this.exportOptions.includeText &&
      this.textSettings.enabled &&
      this.textSettings.text
    ) {
      const textX = centerX + this.textSettings.offsetX;
      const textY = centerY + this.textSettings.offsetY;
      const textFontSize = this.textSettings.fontSize;
      const textFontFamily = this.getFontFamily(this.textSettings.fontFamily);

      this.ctx.font = `${textFontSize}px ${textFontFamily}`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      // Apply fade transition to text
      const previousAlpha = this.ctx.globalAlpha;
      this.ctx.globalAlpha = this.textSettings.opacity * transitionProgress;

      // Apply design effects
      this.applyDesignEffects(
        this.textSettings.text,
        textX,
        textY,
        textFontSize
      );

      this.ctx.globalAlpha = previousAlpha;
    }
  }

  // Special counter drawing method with explicit transition
  private drawTransitioningCounter(
    value: number,
    centerX: number,
    centerY: number,
    transitionProgress: number
  ): void {
    const counterText = this.formatNumber(value);
    const fontSize = this.counterSettings.fontSize;
    const fontFamily = this.getFontFamily(this.counterSettings.fontFamily);
    const letterSpacing = this.counterSettings.letterSpacing || 0;
    const fontWeight = this.counterSettings.fontWeight || 400;

    this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Calculate total width for centering
    let totalWidth = 0;
    for (let i = 0; i < counterText.length; i++) {
      const char = counterText[i];
      const charWidth = this.ctx.measureText(char).width;
      totalWidth +=
        charWidth + (i < counterText.length - 1 ? letterSpacing : 0);
    }

    // Apply easing to transition progress if specified
    const easedProgress =
      this.counterSettings.easing &&
      this.counterSettings.easing in easingFunctions
        ? easingFunctions[
            this.counterSettings.easing as keyof typeof easingFunctions
          ](transitionProgress)
        : transitionProgress;

    // Draw each digit with explicit transition progress
    let currentX = centerX - totalWidth / 2;

    for (let i = 0; i < counterText.length; i++) {
      const char = counterText[i];
      const charWidth = this.ctx.measureText(char).width;
      const digitX = currentX + charWidth / 2;

      // Force the transition progress for initial fade
      const {
        x: tX,
        y: tY,
        opacity: tOpacity,
        transform,
      } = this.applyDigitTransition(
        char,
        digitX,
        centerY,
        fontSize,
        easedProgress,
        this.counterSettings.transition
      );

      // Save context for this digit
      this.ctx.save();

      // Apply transform if provided
      if (transform) {
        transform();
      }

      // Apply opacity
      this.ctx.globalAlpha = tOpacity;

      // Draw the digit with design effects
      this.applyDesignEffects(char, tX, tY, fontSize);

      // Restore context
      this.ctx.restore();

      currentX += charWidth + letterSpacing;
    }
  }

  private async generateWebMWithAlpha(
    checkCancellation?: () => boolean
  ): Promise<Blob> {
    const stream = this.canvas.captureStream(this.exportOptions.frameRate);

    // Use VP9 codec for best alpha channel support with controlled quality
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";

    // Increase bitrate for better alpha channel preservation and reduce bleeding
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 12000000, // Higher bitrate to preserve alpha quality
    });

    const chunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };

      recorder.onerror = (event) => {
        reject(new Error("Recording failed"));
      };

      recorder.start(100); // Collect data every 100ms

      // Animate the counter with improved alpha blending
      const frameCount = Math.ceil(
        this.exportOptions.frameRate * this.exportOptions.duration
      );
      let currentFrame = 0;

      const animate = () => {
        // Check for cancellation
        if (checkCancellation && checkCancellation()) {
          recorder.stop();
          stream.getTracks().forEach((track) => track.stop());
          toast.info("WebM generation cancelled");
          resolve(new Blob(chunks, { type: mimeType }));
          return;
        }

        if (currentFrame >= frameCount) {
          recorder.stop();
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const progress = currentFrame / (frameCount - 1);
        const value =
          this.counterSettings.startValue +
          progress *
            (this.counterSettings.endValue - this.counterSettings.startValue);

        // Clear canvas with full transparency before each frame
        this.ctx.clearRect(
          0,
          0,
          this.exportOptions.width,
          this.exportOptions.height
        );

        // Draw the frame with alpha containment
        this.drawFrameWithAlphaContainment(value, progress);
        currentFrame++;

        // Update progress toast occasionally
        if (currentFrame % Math.floor(frameCount / 10) === 0) {
          toast.info(`WebM frames: ${currentFrame}/${frameCount}`);
        }

        setTimeout(animate, 1000 / this.exportOptions.frameRate);
      };

      animate();
    });
  }

  // New method for drawing with improved alpha containment
  private drawFrameWithAlphaContainment(value: number, progress: number): void {
    const centerX = this.exportOptions.width / 2;
    const centerY = this.exportOptions.height / 2;

    // Update digit transitions
    this.updateDigitTransitions(value, progress);

    // For glow and neon effects, use a special rendering approach to prevent bleeding
    const hasGlowEffect = ["neon", "glow"].includes(
      this.counterSettings.design
    );

    if (hasGlowEffect) {
      // For glow effects, use a more contained approach
      if (this.exportOptions.includeCounter) {
        // Draw each digit with contained glow
        this.drawMultiDigitCounterWithContainedEffects(
          value,
          centerX,
          centerY,
          progress
        );
      }

      // Draw text with contained glow if enabled
      if (
        this.exportOptions.includeText &&
        this.textSettings.enabled &&
        this.textSettings.text
      ) {
        const textX = centerX + this.textSettings.offsetX;
        const textY = centerY + this.textSettings.offsetY;
        const textFontSize = this.textSettings.fontSize;
        const textFontFamily = this.getFontFamily(this.textSettings.fontFamily);

        this.ctx.font = `${textFontSize}px ${textFontFamily}`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        const previousAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = this.textSettings.opacity;

        // Apply contained effect
        this.applyContainedDesignEffect(
          this.textSettings.text,
          textX,
          textY,
          textFontSize
        );

        this.ctx.globalAlpha = previousAlpha;
      }
    } else {
      // Use regular drawing for non-glow effects
      this.drawFrame(value, progress);
    }
  }

  // Special method for drawing digits with contained glow/neon effects
  private drawMultiDigitCounterWithContainedEffects(
    value: number,
    centerX: number,
    centerY: number,
    frameProgress: number
  ): void {
    const counterText = this.formatNumber(value);
    const fontSize = this.counterSettings.fontSize;
    const fontFamily = this.getFontFamily(this.counterSettings.fontFamily);
    const letterSpacing = this.counterSettings.letterSpacing || 0;

    this.ctx.font = `${
      this.counterSettings.fontWeight || 400
    } ${fontSize}px ${fontFamily}`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Calculate total width for centering
    let totalWidth = 0;
    for (let i = 0; i < counterText.length; i++) {
      const char = counterText[i];
      const charWidth = this.ctx.measureText(char).width;
      totalWidth +=
        charWidth + (i < counterText.length - 1 ? letterSpacing : 0);
    }

    // Apply easing to frame progress
    const easedProgress =
      this.counterSettings.easing &&
      this.counterSettings.easing in easingFunctions
        ? easingFunctions[
            this.counterSettings.easing as keyof typeof easingFunctions
          ](frameProgress)
        : frameProgress;

    // Draw each digit with individual transitions
    let currentX = centerX - totalWidth / 2;

    for (let i = 0; i < counterText.length; i++) {
      const char = counterText[i];
      const charWidth = this.ctx.measureText(char).width;
      const digitX = currentX + charWidth / 2;

      // Check if this digit has a transition
      const transition = this.digitTransitions.get(i);
      let digitProgress = easedProgress;

      if (transition && this.exportOptions.preserveAnimations) {
        // Use transition-specific progress
        digitProgress = transition.progress;
      }

      // Apply digit-specific transition
      const {
        x: tX,
        y: tY,
        opacity: tOpacity,
        transform,
      } = this.applyDigitTransition(
        char,
        digitX,
        centerY,
        fontSize,
        digitProgress,
        this.counterSettings.transition
      );

      // Save context for this digit
      this.ctx.save();

      // Apply transform if provided
      if (transform) {
        transform();
      }

      // Apply opacity
      this.ctx.globalAlpha = tOpacity;

      // Draw the digit with contained design effects
      this.applyContainedDesignEffect(char, tX, tY, fontSize);

      // Restore context
      this.ctx.restore();

      currentX += charWidth + letterSpacing;
    }
  }

  // New method specifically for neon and glow effects with reduced bleeding
  private applyContainedDesignEffect(
    text: string,
    x: number,
    y: number,
    fontSize: number
  ): void {
    if (this.counterSettings.design === "neon") {
      const neonColor = this.designSettings.neonColor || "#00FFFF";
      const intensity = Math.min(this.designSettings.neonIntensity || 10, 12); // Cap intensity

      this.ctx.save();

      // Base text layer with minimal glow
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.fillText(text, x, y);

      // Contained glow layer
      this.ctx.globalCompositeOperation = "lighter";
      this.ctx.shadowColor = neonColor;
      this.ctx.shadowBlur = intensity * 0.4;
      this.ctx.fillStyle = neonColor;
      this.ctx.fillText(text, x, y);

      // Sharp foreground layer
      this.ctx.shadowBlur = 0;
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.fillStyle = neonColor;
      this.ctx.fillText(text, x, y);

      this.ctx.restore();
    } else if (this.counterSettings.design === "glow") {
      const glowColor = this.designSettings.glowColor || "#FFFFFF";
      const intensity = Math.min(this.designSettings.glowIntensity || 15, 20); // Cap intensity

      this.ctx.save();

      // Use layered approach with reduced blur for better alpha
      this.ctx.globalCompositeOperation = "source-over";

      // Main text
      this.ctx.fillStyle = glowColor;
      this.ctx.fillText(text, x, y);

      // Inner glow - minimal spread
      this.ctx.globalCompositeOperation = "lighter";
      this.ctx.shadowColor = glowColor;
      this.ctx.shadowBlur = intensity * 0.3;
      this.ctx.globalAlpha = 0.7;
      this.ctx.fillText(text, x, y);

      this.ctx.restore();
    } else {
      // Use normal effects for other styles
      this.applyDesignEffects(text, x, y, fontSize);
    }
  }

  async export(
    checkCancellation?: () => boolean
  ): Promise<{ pngSequence?: Blob; webmAlpha?: Blob }> {
    const results: { pngSequence?: Blob; webmAlpha?: Blob } = {};

    try {
      if (
        this.exportOptions.format === "png-sequence" ||
        this.exportOptions.format === "both"
      ) {
        toast.info("Generating PNG sequence with alpha channel...");
        results.pngSequence = await this.generatePNGSequence(checkCancellation);

        // Check for cancellation after PNG generation
        if (checkCancellation && checkCancellation()) {
          return results;
        }
      }

      if (
        this.exportOptions.format === "webm-alpha" ||
        this.exportOptions.format === "both"
      ) {
        toast.info("Generating WebM video with alpha channel...");
        results.webmAlpha = await this.generateWebMWithAlpha(checkCancellation);
      }

      return results;
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    }
  }

  static async downloadExports(
    exports: { pngSequence?: Blob; webmAlpha?: Blob },
    baseName: string = "transparent-counter"
  ): Promise<void> {
    const timestamp = Date.now();

    if (exports.pngSequence) {
      const url = URL.createObjectURL(exports.pngSequence);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}-png-sequence-${timestamp}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    if (exports.webmAlpha) {
      const url = URL.createObjectURL(exports.webmAlpha);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}-alpha-${timestamp}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    toast.success("Transparent counter exports downloaded successfully!");
  }
}
