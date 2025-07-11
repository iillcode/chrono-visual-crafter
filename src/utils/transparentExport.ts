import { toast } from "sonner";
import JSZip from "jszip";

export interface TransparentExportOptions {
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

export class TransparentCounterExporter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private exportOptions: TransparentExportOptions;
  private counterSettings: CounterSettings;
  private textSettings: TextSettings;
  private designSettings: DesignSettings;

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
    this.canvas = document.createElement('canvas');
    this.canvas.width = exportOptions.width * exportOptions.scale;
    this.canvas.height = exportOptions.height * exportOptions.scale;
    
    const ctx = this.canvas.getContext('2d', {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true
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
        
        // Multiple glow layers for better transparency support
        this.ctx.globalAlpha = 0.4;
        this.ctx.shadowColor = neonColor;
        this.ctx.shadowBlur = intensity * 2;
        this.ctx.fillStyle = neonColor;
        this.ctx.fillText(text, x, y);

        this.ctx.globalAlpha = 0.6;
        this.ctx.shadowBlur = intensity * 1.3;
        this.ctx.fillText(text, x, y);

        this.ctx.globalAlpha = 0.8;
        this.ctx.shadowBlur = intensity * 0.8;
        this.ctx.fillText(text, x, y);

        this.ctx.globalAlpha = 1.0;
        this.ctx.shadowBlur = intensity * 0.4;
        this.ctx.fillText(text, x, y);

        this.ctx.shadowBlur = 0;
        this.ctx.fillText(text, x, y);

        this.ctx.restore();
      },

      glow: () => {
        const glowColor = this.designSettings.glowColor || "#FFFFFF";
        const intensity = this.designSettings.glowIntensity || 15;

        this.ctx.save();

        // Multi-pass glow for transparency
        this.ctx.globalAlpha = 0.4;
        this.ctx.shadowColor = glowColor;
        this.ctx.shadowBlur = intensity * 2;
        this.ctx.fillStyle = glowColor;
        this.ctx.fillText(text, x, y);

        this.ctx.globalAlpha = 0.6;
        this.ctx.shadowBlur = intensity * 1.3;
        this.ctx.fillText(text, x, y);

        this.ctx.globalAlpha = 0.8;
        this.ctx.shadowBlur = intensity * 0.8;
        this.ctx.fillText(text, x, y);

        this.ctx.globalAlpha = 1.0;
        this.ctx.shadowBlur = intensity * 0.4;
        this.ctx.fillText(text, x, y);

        this.ctx.shadowBlur = 0;
        this.ctx.fillText(text, x, y);

        this.ctx.restore();
      },

      gradient: () => {
        const gradient = this.ctx.createLinearGradient(
          x - fontSize, y - fontSize / 2,
          x + fontSize, y + fontSize / 2
        );

        const colorMatches = this.designSettings.gradientColors.match(/#[0-9A-Fa-f]{6}/g);
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
        const gradient = this.ctx.createLinearGradient(x, y - fontSize / 2, x, y + fontSize / 2);
        const colorMatches = this.designSettings.fireColors.match(/#[0-9A-Fa-f]{6}/g);
        
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

        const fireGlow = this.designSettings.fireGlow || 10;
        this.ctx.shadowColor = "#FF4444";
        this.ctx.shadowBlur = fireGlow;
        this.ctx.fillText(text, x, y);
        this.ctx.shadowBlur = 0;
      },

      rainbow: () => {
        const gradient = this.ctx.createLinearGradient(
          x - fontSize, y - fontSize / 2,
          x + fontSize, y + fontSize / 2
        );

        const colorMatches = this.designSettings.rainbowColors.match(/#[0-9A-Fa-f]{6}/g);
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
        const gradient = this.ctx.createLinearGradient(x, y - fontSize / 2, x, y + fontSize / 2);
        const colorMatches = this.designSettings.chromeColors.match(/#[0-9A-Fa-f]{6}/g);
        
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

    const effect = effects[this.counterSettings.design as keyof typeof effects] || effects.classic;
    effect();
  }

  private applyTransitionEffect(progress: number, x: number, y: number, fontSize: number): { x: number; y: number; opacity: number } {
    const effects = {
      none: () => ({ x, y, opacity: 1 }),
      
      slideUp: () => {
        const distance = fontSize * 1.5;
        const offset = (1 - progress) * distance;
        const opacity = 0.3 + progress * 0.7;
        return { x, y: y + offset, opacity };
      },
      
      slideDown: () => {
        const distance = fontSize * 1.5;
        const offset = (1 - progress) * -distance;
        const opacity = 0.3 + progress * 0.7;
        return { x, y: y + offset, opacity };
      },
      
      fadeIn: () => {
        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        return { x, y, opacity: easeInOutCubic };
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

    const effect = effects[this.counterSettings.transition as keyof typeof effects] || effects.none;
    return effect();
  }

  private drawFrame(value: number, progress: number): void {
    // Clear canvas with full transparency
    this.ctx.clearRect(0, 0, this.exportOptions.width, this.exportOptions.height);

    const centerX = this.exportOptions.width / 2;
    const centerY = this.exportOptions.height / 2;

    // Draw counter if enabled
    if (this.exportOptions.includeCounter) {
      const counterText = this.formatNumber(value);
      const fontSize = this.counterSettings.fontSize;
      const fontFamily = this.getFontFamily(this.counterSettings.fontFamily);

      this.ctx.font = `${this.counterSettings.fontWeight || 400} ${fontSize}px ${fontFamily}`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      // Apply transition effects
      const { x: tX, y: tY, opacity: tOpacity } = this.applyTransitionEffect(
        progress, centerX, centerY, fontSize
      );

      const previousAlpha = this.ctx.globalAlpha;
      this.ctx.globalAlpha = (previousAlpha ?? 1) * (tOpacity ?? 1);

      // Apply design effects
      this.applyDesignEffects(counterText, tX, tY, fontSize);

      this.ctx.globalAlpha = previousAlpha;
      this.ctx.restore();
    }

    // Draw text if enabled
    if (this.exportOptions.includeText && this.textSettings.enabled && this.textSettings.text) {
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
      this.applyDesignEffects(this.textSettings.text, textX, textY, textFontSize);

      this.ctx.globalAlpha = previousAlpha;
    }
  }

  private async generatePNGSequence(): Promise<Blob> {
    const zip = new JSZip();
    const frameCount = Math.ceil(this.exportOptions.frameRate * this.exportOptions.duration);
    
    toast.info(`Generating ${frameCount} PNG frames...`);

    for (let frame = 0; frame < frameCount; frame++) {
      const progress = frame / (frameCount - 1);
      const value = this.counterSettings.startValue + 
        progress * (this.counterSettings.endValue - this.counterSettings.startValue);

      this.drawFrame(value, progress);

      // Convert canvas to PNG blob
      const blob = await new Promise<Blob>((resolve) => {
        this.canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });

      // Add to zip with zero-padded frame number
      const frameNumber = frame.toString().padStart(6, '0');
      const arrayBuffer = await blob.arrayBuffer();
      zip.file(`frame_${frameNumber}.png`, arrayBuffer);

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

    zip.file('metadata.json', JSON.stringify(metadata, null, 2));

    toast.info('Compressing PNG sequence...');
    return await zip.generateAsync({ type: 'blob' });
  }

  private async generateWebMWithAlpha(): Promise<Blob> {
    const stream = this.canvas.captureStream(this.exportOptions.frameRate);
    
    // Use VP9 codec for best alpha channel support
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 10000000, // High bitrate for quality
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
        reject(new Error('Recording failed'));
      };

      recorder.start();

      // Animate the counter
      const frameCount = Math.ceil(this.exportOptions.frameRate * this.exportOptions.duration);
      let currentFrame = 0;

      const animate = () => {
        if (currentFrame >= frameCount) {
          recorder.stop();
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const progress = currentFrame / (frameCount - 1);
        const value = this.counterSettings.startValue + 
          progress * (this.counterSettings.endValue - this.counterSettings.startValue);

        this.drawFrame(value, progress);
        currentFrame++;

        setTimeout(animate, 1000 / this.exportOptions.frameRate);
      };

      animate();
    });
  }

  async export(): Promise<{ pngSequence?: Blob; webmAlpha?: Blob }> {
    const results: { pngSequence?: Blob; webmAlpha?: Blob } = {};

    try {
      if (this.exportOptions.format === 'png-sequence' || this.exportOptions.format === 'both') {
        toast.info('Generating PNG sequence with alpha channel...');
        results.pngSequence = await this.generatePNGSequence();
      }

      if (this.exportOptions.format === 'webm-alpha' || this.exportOptions.format === 'both') {
        toast.info('Generating WebM video with alpha channel...');
        results.webmAlpha = await this.generateWebMWithAlpha();
      }

      return results;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  static async downloadExports(
    exports: { pngSequence?: Blob; webmAlpha?: Blob },
    baseName: string = 'transparent-counter'
  ): Promise<void> {
    const timestamp = Date.now();

    if (exports.pngSequence) {
      const url = URL.createObjectURL(exports.pngSequence);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-png-sequence-${timestamp}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    if (exports.webmAlpha) {
      const url = URL.createObjectURL(exports.webmAlpha);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-alpha-${timestamp}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    toast.success('Transparent counter exports downloaded successfully!');
  }
}