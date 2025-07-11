import { toast } from "sonner";
import JSZip from "jszip";
import { AnimationOptimizer, PNGSequenceOptions, WebMAlphaOptions } from "./animationOptimizer";

export interface EnhancedTransparentExportOptions {
  // Content options
  includeCounter: boolean;
  includeText: boolean;
  
  // Format options
  format: 'png-sequence' | 'webm-alpha' | 'both';
  
  // Quality options
  width: number;
  height: number;
  frameRate: number;
  duration: number;
  scale: number;
  
  // PNG specific options
  pngOptions: PNGSequenceOptions;
  
  // WebM specific options
  webmOptions: WebMAlphaOptions;
  
  // Animation options
  preserveAnimations: boolean;
  transitionType: string;
  easingFunction: string;
}

export class EnhancedTransparentCounterExporter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private exportOptions: EnhancedTransparentExportOptions;
  private counterSettings: any;
  private textSettings: any;
  private designSettings: any;

  constructor(
    exportOptions: EnhancedTransparentExportOptions,
    counterSettings: any,
    textSettings: any,
    designSettings: any
  ) {
    this.exportOptions = exportOptions;
    this.counterSettings = counterSettings;
    this.textSettings = textSettings;
    this.designSettings = designSettings;

    // Create high-resolution canvas for export
    this.canvas = document.createElement('canvas');
    this.canvas.width = exportOptions.width * exportOptions.scale;
    this.canvas.height = exportOptions.height * exportOptions.scale;
    
    const ctx = this.canvas.getContext('2d', {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }
    
    this.ctx = ctx;
    
    // Configure context for high quality rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.scale(exportOptions.scale, exportOptions.scale);
  }

  async export(): Promise<{ pngSequence?: any; webmAlpha?: any }> {
    const results: { pngSequence?: any; webmAlpha?: any } = {};

    try {
      // Generate animation frames
      const frames = await this.generateAnimationFrames();

      if (this.exportOptions.format === 'png-sequence' || this.exportOptions.format === 'both') {
        toast.info('Optimizing PNG sequence with 8-bit compression...');
        results.pngSequence = await AnimationOptimizer.optimizePNGSequence(
          frames,
          this.exportOptions.pngOptions
        );
      }

      if (this.exportOptions.format === 'webm-alpha' || this.exportOptions.format === 'both') {
        toast.info('Generating WebM with VP9 alpha channel...');
        results.webmAlpha = await AnimationOptimizer.optimizeWebMAlpha(
          this.canvas,
          {
            width: this.exportOptions.width,
            height: this.exportOptions.height,
            frameRate: this.exportOptions.frameRate,
            duration: this.exportOptions.duration,
            quality: 'high',
          },
          this.exportOptions.webmOptions
        );
      }

      return results;
    } catch (error) {
      console.error('Enhanced export failed:', error);
      throw error;
    }
  }

  private async generateAnimationFrames(): Promise<any[]> {
    const frameCount = Math.ceil(this.exportOptions.frameRate * this.exportOptions.duration);
    const frames: any[] = [];

    for (let i = 0; i < frameCount; i++) {
      const progress = i / (frameCount - 1);
      const value = this.counterSettings.startValue + 
        progress * (this.counterSettings.endValue - this.counterSettings.startValue);

      // Apply easing function
      const easedProgress = this.applyEasing(progress, this.exportOptions.easingFunction);
      const easedValue = this.counterSettings.startValue + 
        easedProgress * (this.counterSettings.endValue - this.counterSettings.startValue);

      // Draw frame
      this.drawFrame(easedValue, progress);

      // Create frame data
      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = this.canvas.width;
      frameCanvas.height = this.canvas.height;
      const frameCtx = frameCanvas.getContext('2d');
      
      if (frameCtx) {
        frameCtx.drawImage(this.canvas, 0, 0);
        frames.push({
          canvas: frameCanvas,
          timestamp: (i / this.exportOptions.frameRate) * 1000,
          index: i,
        });
      }
    }

    return frames;
  }

  private drawFrame(value: number, progress: number): void {
    // Clear canvas with full transparency
    this.ctx.clearRect(0, 0, this.exportOptions.width, this.exportOptions.height);

    const centerX = this.exportOptions.width / 2;
    const centerY = this.exportOptions.height / 2;

    // Draw counter if enabled
    if (this.exportOptions.includeCounter) {
      this.drawOptimizedCounter(value, progress, centerX, centerY);
    }

    // Draw text if enabled
    if (this.exportOptions.includeText && this.textSettings.enabled && this.textSettings.text) {
      this.drawOptimizedText(centerX, centerY);
    }
  }

  private drawOptimizedCounter(value: number, progress: number, centerX: number, centerY: number): void {
    const counterText = this.formatNumber(value);
    const fontSize = this.counterSettings.fontSize;
    const fontFamily = this.getFontFamily(this.counterSettings.fontFamily);

    this.ctx.font = `${this.counterSettings.fontWeight || 400} ${fontSize}px ${fontFamily}`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Apply transition effects if enabled
    if (this.exportOptions.preserveAnimations) {
      const { x: tX, y: tY, opacity: tOpacity } = this.applyTransitionEffect(
        progress, centerX, centerY, fontSize
      );

      const previousAlpha = this.ctx.globalAlpha;
      this.ctx.globalAlpha = (previousAlpha ?? 1) * (tOpacity ?? 1);

      this.applyDesignEffects(counterText, tX, tY, fontSize);
      this.ctx.globalAlpha = previousAlpha;
    } else {
      this.applyDesignEffects(counterText, centerX, centerY, fontSize);
    }
  }

  private drawOptimizedText(centerX: number, centerY: number): void {
    const textX = centerX + this.textSettings.offsetX;
    const textY = centerY + this.textSettings.offsetY;
    const textFontSize = this.textSettings.fontSize;
    const textFontFamily = this.getFontFamily(this.textSettings.fontFamily);

    this.ctx.font = `${textFontSize}px ${textFontFamily}`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    const previousAlpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = this.textSettings.opacity;

    this.ctx.fillStyle = this.textSettings.color;
    this.ctx.fillText(this.textSettings.text, textX, textY);

    this.ctx.globalAlpha = previousAlpha;
  }

  private applyTransitionEffect(
    progress: number,
    x: number,
    y: number,
    fontSize: number
  ): { x: number; y: number; opacity: number } {
    const effects = {
      none: () => ({ x, y, opacity: 1 }),
      
      'fade-roll': () => {
        const opacity = 0.3 + progress * 0.7;
        return { x, y, opacity };
      },
      
      'flip-down': () => {
        const scaleY = Math.abs(Math.cos(progress * Math.PI));
        const opacity = scaleY < 0.3 ? 0.3 : scaleY;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(1, Math.max(0.1, scaleY));
        this.ctx.translate(-x, -y);
        return { x, y, opacity };
      },
      
      'slide-vertical': () => {
        const distance = fontSize * 1.5;
        const offset = (1 - progress) * distance;
        const opacity = 0.3 + progress * 0.7;
        return { x, y: y + offset, opacity };
      },
      
      bounce: () => {
        const bounceHeight = Math.sin(progress * Math.PI) * (fontSize / 2);
        return { x, y: y - bounceHeight, opacity: 1 };
      },
      
      scale: () => {
        const scaleValue = 0.3 + progress * 0.7;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(scaleValue, scaleValue);
        this.ctx.translate(-x, -y);
        return { x, y, opacity: 0.3 + progress * 0.7 };
      },
    };

    const effect = effects[this.exportOptions.transitionType as keyof typeof effects] || effects.none;
    return effect();
  }

  private applyDesignEffects(text: string, x: number, y: number, fontSize: number): void {
    const effects = {
      classic: () => {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText(text, x, y);
      },

      neon: () => {
        const neonColor = this.designSettings.neonColor || "#00FFFF";
        const intensity = this.designSettings.neonIntensity || 10;

        this.ctx.save();
        
        // Optimized neon effect for transparency
        this.ctx.globalAlpha = 0.4;
        this.ctx.shadowColor = neonColor;
        this.ctx.shadowBlur = intensity * 2;
        this.ctx.fillStyle = neonColor;
        this.ctx.fillText(text, x, y);

        this.ctx.globalAlpha = 0.8;
        this.ctx.shadowBlur = intensity;
        this.ctx.fillText(text, x, y);

        this.ctx.globalAlpha = 1.0;
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText(text, x, y);

        this.ctx.restore();
      },

      // Add other optimized design effects...
    };

    const effect = effects[this.counterSettings.design as keyof typeof effects] || effects.classic;
    effect();
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
    if (this.counterSettings.separator && this.counterSettings.separator !== "none") {
      const separator = this.counterSettings.separator === "comma" ? "," :
                       this.counterSettings.separator === "dot" ? "." :
                       this.counterSettings.separator === "space" ? " " : "";

      if (separator) {
        if (formattedValue.includes(".")) {
          const parts = formattedValue.split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
          formattedValue = parts.join(".");
        } else {
          formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        }
      }
    }

    return `${this.counterSettings.prefix || ""}${formattedValue}${this.counterSettings.suffix || ""}`;
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

  private applyEasing(progress: number, easing: string): number {
    switch (easing) {
      case 'linear':
        return progress;
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);
      case 'ease-in-out':
        return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'bounce':
        if (progress < 1 / 2.75) {
          return 7.5625 * progress * progress;
        } else if (progress < 2 / 2.75) {
          return 7.5625 * (progress -= 1.5 / 2.75) * progress + 0.75;
        } else if (progress < 2.5 / 2.75) {
          return 7.5625 * (progress -= 2.25 / 2.75) * progress + 0.9375;
        } else {
          return 7.5625 * (progress -= 2.625 / 2.75) * progress + 0.984375;
        }
      default:
        return progress;
    }
  }

  static async downloadOptimizedExports(
    exports: { pngSequence?: any; webmAlpha?: any },
    baseName: string = 'optimized-transparent-counter'
  ): Promise<void> {
    await AnimationOptimizer.downloadOptimizedExports(
      exports.pngSequence,
      exports.webmAlpha,
      baseName
    );
  }
}