// Hologram Flicker Transition Effect
// Sci-fi holographic glitch effect with scan lines and interference patterns

export interface HologramFlickerSettings {
  scanLineSpeed: number; // Speed of scan lines (1-10)
  scanLineIntensity: number; // Intensity of scan lines (0.1-1.0)
  flickerFrequency: number; // Frequency of flicker (0.1-5.0)
  interferenceLevel: number; // Level of interference (0.1-1.0)
  rgbSeparation: number; // RGB channel separation (0-10)
  staticNoise: number; // Static noise level (0-1.0)
  glitchIntensity: number; // Glitch effect intensity (0-1.0)
  colorScheme: "classic" | "cyan" | "green" | "amber" | "purple" | "custom";
  customColor?: string;
  hologramOpacity: number; // Base hologram opacity (0.3-1.0)
  transparencySupport: boolean;
}

export interface ScanLine {
  y: number;
  speed: number;
  intensity: number;
  width: number;
  active: boolean;
}

export interface GlitchBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  life: number;
  intensity: number;
}

export interface HologramFlickerState {
  scanLines: ScanLine[];
  glitchBlocks: GlitchBlock[];
  targetNumber: string;
  animationTime: number;
  flickerPhase: number;
  interferencePhase: number;
  staticPattern: Uint8Array;
  rgbOffset: { r: number; g: number; b: number };
  hologramStability: number;
  initialized: boolean;
}

export class HologramFlickerTransition {
  private settings: HologramFlickerSettings;
  private state: HologramFlickerState;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastFrameTime: number = 0;

  // Color schemes for hologram effects
  private static readonly COLOR_SCHEMES = {
    classic: { primary: "#00FFFF", secondary: "#0080FF", accent: "#FFFFFF" },
    cyan: { primary: "#00FFFF", secondary: "#40E0D0", accent: "#E0FFFF" },
    green: { primary: "#00FF00", secondary: "#32CD32", accent: "#90EE90" },
    amber: { primary: "#FFA500", secondary: "#FFD700", accent: "#FFFFE0" },
    purple: { primary: "#8A2BE2", secondary: "#9370DB", accent: "#DDA0DD" },
  };

  // Animation constants
  private static readonly ANIMATION = {
    totalDuration: 2500, // ms
    stabilizationTime: 500, // ms
    maxScanLines: 8,
    maxGlitchBlocks: 12,
    staticSize: 64 * 64, // 64x64 static pattern
  };

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    settings: Partial<HologramFlickerSettings> = {}
  ) {
    this.canvas = canvas;
    this.ctx = ctx;

    // Default settings
    this.settings = {
      scanLineSpeed: 4,
      scanLineIntensity: 0.7,
      flickerFrequency: 2.5,
      interferenceLevel: 0.4,
      rgbSeparation: 3,
      staticNoise: 0.3,
      glitchIntensity: 0.6,
      colorScheme: "classic",
      hologramOpacity: 0.8,
      transparencySupport: true,
      ...settings,
    };

    // Initialize state
    this.state = {
      scanLines: [],
      glitchBlocks: [],
      targetNumber: "",
      animationTime: 0,
      flickerPhase: 0,
      interferencePhase: 0,
      staticPattern: new Uint8Array(
        HologramFlickerTransition.ANIMATION.staticSize
      ),
      rgbOffset: { r: 0, g: 0, b: 0 },
      hologramStability: 0,
      initialized: false,
    };

    this.generateStaticPattern();
  }

  // Initialize the hologram flicker effect
  initialize(targetNumber: string, fontSize: number): void {
    this.state.initialized = true;
    this.state.targetNumber = targetNumber;
    this.state.animationTime = 0;
    this.state.flickerPhase = 0;
    this.state.interferencePhase = 0;
    this.state.hologramStability = 0;
    this.state.scanLines = [];
    this.state.glitchBlocks = [];

    // Initialize scan lines
    this.initializeScanLines();

    // Generate initial glitch blocks
    this.generateGlitchBlocks();

    // Regenerate static pattern
    this.generateStaticPattern();

    this.lastFrameTime = performance.now();
  }

  // Initialize scan lines
  private initializeScanLines(): void {
    const lineCount =
      Math.floor(
        Math.random() * HologramFlickerTransition.ANIMATION.maxScanLines
      ) + 3;

    for (let i = 0; i < lineCount; i++) {
      const scanLine: ScanLine = {
        y: Math.random() * this.canvas.height,
        speed: (Math.random() * 0.5 + 0.5) * this.settings.scanLineSpeed,
        intensity: Math.random() * this.settings.scanLineIntensity + 0.3,
        width: Math.random() * 4 + 2,
        active: Math.random() > 0.3,
      };

      this.state.scanLines.push(scanLine);
    }
  }

  // Generate glitch blocks
  private generateGlitchBlocks(): void {
    this.state.glitchBlocks = [];

    if (this.settings.glitchIntensity > 0) {
      const blockCount = Math.floor(
        Math.random() * HologramFlickerTransition.ANIMATION.maxGlitchBlocks
      );

      for (let i = 0; i < blockCount; i++) {
        const glitchBlock: GlitchBlock = {
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          width: Math.random() * 100 + 20,
          height: Math.random() * 30 + 10,
          offsetX: (Math.random() - 0.5) * 20 * this.settings.glitchIntensity,
          offsetY: (Math.random() - 0.5) * 10 * this.settings.glitchIntensity,
          life: Math.random() * 0.5 + 0.2,
          intensity: Math.random() * this.settings.glitchIntensity,
        };

        this.state.glitchBlocks.push(glitchBlock);
      }
    }
  }

  // Generate static noise pattern
  private generateStaticPattern(): void {
    for (let i = 0; i < this.state.staticPattern.length; i++) {
      this.state.staticPattern[i] = Math.random() * 255;
    }
  }

  // Update hologram animation
  update(deltaTime: number): void {
    if (!this.state.initialized) return;

    this.state.animationTime += deltaTime;

    // Update animation phases
    this.updateAnimationPhases(deltaTime);

    // Update hologram stability
    this.updateHologramStability();

    // Update scan lines
    this.updateScanLines(deltaTime);

    // Update glitch blocks
    this.updateGlitchBlocks(deltaTime);

    // Update RGB separation
    this.updateRGBSeparation();

    // Occasionally regenerate static pattern
    if (Math.random() < 0.1) {
      this.generateStaticPattern();
    }

    // Occasionally regenerate glitch blocks
    if (Math.random() < 0.05) {
      this.generateGlitchBlocks();
    }
  }

  // Update animation phases
  private updateAnimationPhases(deltaTime: number): void {
    const dt = deltaTime / 16.67; // Normalize to 60fps

    // Update flicker phase
    this.state.flickerPhase += this.settings.flickerFrequency * 0.1 * dt;

    // Update interference phase
    this.state.interferencePhase += this.settings.interferenceLevel * 0.05 * dt;
  }

  // Update hologram stability
  private updateHologramStability(): void {
    const stabilizationProgress = Math.min(
      this.state.animationTime /
        HologramFlickerTransition.ANIMATION.stabilizationTime,
      1
    );

    // Hologram becomes more stable over time but with occasional instability
    const baseStability = stabilizationProgress * 0.8;
    const flickerNoise =
      Math.sin(this.state.flickerPhase) * 0.2 * (1 - stabilizationProgress);
    const interferenceNoise = Math.sin(this.state.interferencePhase * 2) * 0.1;

    this.state.hologramStability = Math.max(
      0.1,
      baseStability + flickerNoise + interferenceNoise
    );
  }

  // Update scan lines
  private updateScanLines(deltaTime: number): void {
    const dt = deltaTime / 16.67; // Normalize to 60fps

    this.state.scanLines.forEach((scanLine) => {
      if (scanLine.active) {
        scanLine.y += scanLine.speed * dt;

        // Reset scan line if it goes off screen
        if (scanLine.y > this.canvas.height + 50) {
          scanLine.y = -50;
          scanLine.active = Math.random() > 0.3;
          scanLine.intensity =
            Math.random() * this.settings.scanLineIntensity + 0.3;
        }
      } else {
        // Randomly reactivate inactive scan lines
        if (Math.random() < 0.02) {
          scanLine.active = true;
          scanLine.y = -50;
        }
      }
    });
  }

  // Update glitch blocks
  private updateGlitchBlocks(deltaTime: number): void {
    const dt = deltaTime / 16.67; // Normalize to 60fps

    this.state.glitchBlocks.forEach((block) => {
      block.life -= 0.02 * dt;

      // Update glitch offset
      block.offsetX +=
        (Math.random() - 0.5) * 2 * this.settings.glitchIntensity;
      block.offsetY +=
        (Math.random() - 0.5) * 1 * this.settings.glitchIntensity;

      // Limit offset
      block.offsetX = Math.max(-20, Math.min(20, block.offsetX));
      block.offsetY = Math.max(-10, Math.min(10, block.offsetY));
    });

    // Remove dead glitch blocks
    this.state.glitchBlocks = this.state.glitchBlocks.filter(
      (block) => block.life > 0
    );
  }

  // Update RGB separation
  private updateRGBSeparation(): void {
    const separation =
      this.settings.rgbSeparation * (1 - this.state.hologramStability);

    this.state.rgbOffset.r =
      Math.sin(this.state.interferencePhase) * separation;
    this.state.rgbOffset.g = 0;
    this.state.rgbOffset.b =
      Math.cos(this.state.interferencePhase) * separation;
  }

  // Render the hologram flicker effect
  render(
    targetX: number,
    targetY: number,
    fontSize: number,
    textColor: string = "#FFFFFF"
  ): void {
    if (!this.state.initialized) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Update animation
    this.update(deltaTime);

    // Save context
    this.ctx.save();

    // Render hologram number with effects
    this.renderHologramNumber(targetX, targetY, fontSize, textColor);

    // Render scan lines
    this.renderScanLines();

    // Render static noise
    this.renderStaticNoise();

    // Render glitch blocks
    this.renderGlitchBlocks();

    // Restore context
    this.ctx.restore();
  }

  // Render hologram number with RGB separation
  private renderHologramNumber(
    x: number,
    y: number,
    fontSize: number,
    textColor: string
  ): void {
    const colors = this.getHologramColors(textColor);
    const baseOpacity =
      this.settings.hologramOpacity * this.state.hologramStability;

    // Set font
    this.ctx.font = `${fontSize}px monospace`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Render with RGB separation if enabled
    if (this.settings.rgbSeparation > 0) {
      this.renderWithRGBSeparation(x, y, colors, baseOpacity);
    } else {
      this.renderSolidHologram(x, y, colors.primary, baseOpacity);
    }

    // Add hologram glow effect
    this.renderHologramGlow(x, y, fontSize, colors.primary, baseOpacity);
  }

  // Render with RGB channel separation
  private renderWithRGBSeparation(
    x: number,
    y: number,
    colors: any,
    baseOpacity: number
  ): void {
    const text = this.state.targetNumber;

    // Red channel
    this.ctx.save();
    this.ctx.globalAlpha = baseOpacity * 0.8;
    this.ctx.fillStyle = "#FF0000";
    this.ctx.globalCompositeOperation = "screen";
    this.ctx.fillText(text, x + this.state.rgbOffset.r, y);
    this.ctx.restore();

    // Green channel (main)
    this.ctx.save();
    this.ctx.globalAlpha = baseOpacity;
    this.ctx.fillStyle = colors.primary;
    this.ctx.fillText(text, x + this.state.rgbOffset.g, y);
    this.ctx.restore();

    // Blue channel
    this.ctx.save();
    this.ctx.globalAlpha = baseOpacity * 0.8;
    this.ctx.fillStyle = "#0000FF";
    this.ctx.globalCompositeOperation = "screen";
    this.ctx.fillText(text, x + this.state.rgbOffset.b, y);
    this.ctx.restore();
  }

  // Render solid hologram
  private renderSolidHologram(
    x: number,
    y: number,
    color: string,
    opacity: number
  ): void {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.fillText(this.state.targetNumber, x, y);
    this.ctx.restore();
  }

  // Render hologram glow effect
  private renderHologramGlow(
    x: number,
    y: number,
    fontSize: number,
    color: string,
    opacity: number
  ): void {
    this.ctx.save();

    // Outer glow
    this.ctx.globalAlpha = opacity * 0.3;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = fontSize * 0.5;
    this.ctx.fillStyle = color;
    this.ctx.fillText(this.state.targetNumber, x, y);

    // Inner glow
    this.ctx.globalAlpha = opacity * 0.6;
    this.ctx.shadowBlur = fontSize * 0.2;
    this.ctx.fillText(this.state.targetNumber, x, y);

    this.ctx.restore();
  }

  // Render scan lines
  private renderScanLines(): void {
    this.ctx.save();

    this.state.scanLines.forEach((scanLine) => {
      if (!scanLine.active) return;

      const colors = this.getHologramColors("#FFFFFF");
      const alpha = scanLine.intensity * this.state.hologramStability;

      // Create gradient for scan line
      const gradient = this.ctx.createLinearGradient(
        0,
        scanLine.y - scanLine.width,
        0,
        scanLine.y + scanLine.width
      );
      gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
      gradient.addColorStop(
        0.5,
        `${colors.primary}${Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0")}`
      );
      gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        0,
        scanLine.y - scanLine.width,
        this.canvas.width,
        scanLine.width * 2
      );

      // Add scan line flicker
      if (Math.random() < 0.1) {
        this.ctx.globalAlpha = alpha * 0.5;
        this.ctx.fillStyle = colors.accent;
        this.ctx.fillRect(0, scanLine.y - 1, this.canvas.width, 2);
      }
    });

    this.ctx.restore();
  }

  // Render static noise
  private renderStaticNoise(): void {
    if (this.settings.staticNoise <= 0) return;

    this.ctx.save();

    const noiseIntensity =
      this.settings.staticNoise * (1 - this.state.hologramStability);
    const colors = this.getHologramColors("#FFFFFF");

    // Render static pattern
    const staticSize = 8;
    const cols = Math.ceil(this.canvas.width / staticSize);
    const rows = Math.ceil(this.canvas.height / staticSize);

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const index = (y * cols + x) % this.state.staticPattern.length;
        const noise = this.state.staticPattern[index] / 255;

        if (noise > 1 - noiseIntensity) {
          this.ctx.globalAlpha =
            ((noise - (1 - noiseIntensity)) / noiseIntensity) * 0.3;
          this.ctx.fillStyle = colors.accent;
          this.ctx.fillRect(
            x * staticSize,
            y * staticSize,
            staticSize,
            staticSize
          );
        }
      }
    }

    this.ctx.restore();
  }

  // Render glitch blocks
  private renderGlitchBlocks(): void {
    this.ctx.save();

    this.state.glitchBlocks.forEach((block) => {
      if (block.life <= 0) return;

      const colors = this.getHologramColors("#FFFFFF");
      const alpha = block.intensity * block.life * this.state.hologramStability;

      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = colors.secondary;

      // Render glitched rectangle
      this.ctx.fillRect(
        block.x + block.offsetX,
        block.y + block.offsetY,
        block.width,
        block.height
      );

      // Add glitch lines
      this.ctx.globalAlpha = alpha * 0.5;
      this.ctx.fillStyle = colors.primary;
      this.ctx.fillRect(
        block.x + block.offsetX,
        block.y + block.offsetY,
        block.width,
        2
      );
      this.ctx.fillRect(
        block.x + block.offsetX,
        block.y + block.offsetY + block.height - 2,
        block.width,
        2
      );
    });

    this.ctx.restore();
  }

  // Get hologram colors based on color scheme
  private getHologramColors(textColor: string): {
    primary: string;
    secondary: string;
    accent: string;
  } {
    if (this.settings.colorScheme === "custom" && this.settings.customColor) {
      return {
        primary: this.settings.customColor,
        secondary: this.adjustColorBrightness(this.settings.customColor, -0.3),
        accent: this.adjustColorBrightness(this.settings.customColor, 0.3),
      };
    }

    return (
      HologramFlickerTransition.COLOR_SCHEMES[this.settings.colorScheme] ||
      HologramFlickerTransition.COLOR_SCHEMES.classic
    );
  }

  // Utility function to adjust color brightness
  private adjustColorBrightness(color: string, factor: number): string {
    // Simple color brightness adjustment
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.max(0, Math.min(255, Math.floor(r * (1 + factor))));
    const newG = Math.max(0, Math.min(255, Math.floor(g * (1 + factor))));
    const newB = Math.max(0, Math.min(255, Math.floor(b * (1 + factor))));

    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  }

  // Check if animation is complete
  isComplete(): boolean {
    return (
      this.state.animationTime >=
      HologramFlickerTransition.ANIMATION.totalDuration
    );
  }

  // Get current progress (0-1)
  getProgress(): number {
    return Math.min(
      this.state.animationTime /
        HologramFlickerTransition.ANIMATION.totalDuration,
      1
    );
  }

  // Get current hologram stability
  getHologramStability(): number {
    return this.state.hologramStability;
  }

  // Reset the animation
  reset(): void {
    this.state.animationTime = 0;
    this.state.flickerPhase = 0;
    this.state.interferencePhase = 0;
    this.state.hologramStability = 0;
    this.state.scanLines = [];
    this.state.glitchBlocks = [];
    this.state.initialized = false;
    this.generateStaticPattern();
  }

  // Update settings
  updateSettings(newSettings: Partial<HologramFlickerSettings>): void {
    this.settings = { ...this.settings, ...newSettings };

    // Regenerate scan lines if scan line settings changed
    if (
      newSettings.scanLineSpeed !== undefined ||
      newSettings.scanLineIntensity !== undefined
    ) {
      this.initializeScanLines();
    }

    // Regenerate glitch blocks if glitch settings changed
    if (newSettings.glitchIntensity !== undefined) {
      this.generateGlitchBlocks();
    }

    // Regenerate static pattern if static settings changed
    if (newSettings.staticNoise !== undefined) {
      this.generateStaticPattern();
    }
  }

  // Get performance metrics
  getPerformanceMetrics(): {
    scanLines: number;
    glitchBlocks: number;
    hologramStability: number;
    renderCalls: number;
  } {
    const activeScanLines = this.state.scanLines.filter(
      (line) => line.active
    ).length;
    const activeGlitchBlocks = this.state.glitchBlocks.filter(
      (block) => block.life > 0
    ).length;

    return {
      scanLines: activeScanLines,
      glitchBlocks: activeGlitchBlocks,
      hologramStability: this.state.hologramStability,
      renderCalls:
        1 +
        activeScanLines +
        activeGlitchBlocks +
        (this.settings.staticNoise > 0 ? 1 : 0),
    };
  }

  // Cleanup resources
  cleanup(): void {
    this.state.scanLines = [];
    this.state.glitchBlocks = [];
    this.state.initialized = false;
  }
}

// Factory function for easy integration
export const createHologramFlickerTransition = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  settings?: Partial<HologramFlickerSettings>
): HologramFlickerTransition => {
  return new HologramFlickerTransition(canvas, ctx, settings);
};

// Preset configurations for different use cases
export const HologramFlickerPresets = {
  classic: {
    scanLineSpeed: 4,
    scanLineIntensity: 0.7,
    flickerFrequency: 2.5,
    interferenceLevel: 0.4,
    rgbSeparation: 3,
    staticNoise: 0.3,
    glitchIntensity: 0.6,
    colorScheme: "classic" as const,
    hologramOpacity: 0.8,
    transparencySupport: true,
  },

  stable: {
    scanLineSpeed: 2,
    scanLineIntensity: 0.4,
    flickerFrequency: 1.0,
    interferenceLevel: 0.2,
    rgbSeparation: 1,
    staticNoise: 0.1,
    glitchIntensity: 0.3,
    colorScheme: "cyan" as const,
    hologramOpacity: 0.9,
    transparencySupport: true,
  },

  unstable: {
    scanLineSpeed: 8,
    scanLineIntensity: 1.0,
    flickerFrequency: 4.0,
    interferenceLevel: 0.8,
    rgbSeparation: 6,
    staticNoise: 0.6,
    glitchIntensity: 0.9,
    colorScheme: "green" as const,
    hologramOpacity: 0.6,
    transparencySupport: true,
  },

  retro: {
    scanLineSpeed: 3,
    scanLineIntensity: 0.8,
    flickerFrequency: 1.5,
    interferenceLevel: 0.3,
    rgbSeparation: 0,
    staticNoise: 0.4,
    glitchIntensity: 0.4,
    colorScheme: "amber" as const,
    hologramOpacity: 0.85,
    transparencySupport: true,
  },

  minimal: {
    scanLineSpeed: 2,
    scanLineIntensity: 0.3,
    flickerFrequency: 0.8,
    interferenceLevel: 0.1,
    rgbSeparation: 0,
    staticNoise: 0.05,
    glitchIntensity: 0.1,
    colorScheme: "cyan" as const,
    hologramOpacity: 0.95,
    transparencySupport: true,
  },

  cyberpunk: {
    scanLineSpeed: 6,
    scanLineIntensity: 0.9,
    flickerFrequency: 3.5,
    interferenceLevel: 0.6,
    rgbSeparation: 5,
    staticNoise: 0.5,
    glitchIntensity: 0.8,
    colorScheme: "purple" as const,
    hologramOpacity: 0.7,
    transparencySupport: true,
  },
};
