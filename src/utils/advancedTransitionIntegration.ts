// Advanced Transition Integration
// Handles complex transition effects like Matrix Rain, Particle Explosion, etc.

import {
  MatrixRainTransition,
  MatrixRainSettings,
  MatrixRainPresets,
} from "./matrixRainTransition";
import {
  ParticleExplosionTransition,
  ParticleExplosionSettings,
  ParticleExplosionPresets,
} from "./particleExplosionTransition";
import {
  LiquidMorphTransition,
  LiquidMorphSettings,
  LiquidMorphPresets,
} from "./liquidMorphTransition";
import {
  HologramFlickerTransition,
  HologramFlickerSettings,
  HologramFlickerPresets,
} from "./hologramFlickerTransition";
import { TransitionContext, TransitionResult } from "./transitionEffects";

export interface AdvancedTransitionSettings {
  matrixRain?: Partial<MatrixRainSettings>;
  particleExplosion?: Partial<ParticleExplosionSettings>;
  liquidMorph?: Partial<LiquidMorphSettings>;
  hologramFlicker?: Partial<HologramFlickerSettings>;
}

export interface AdvancedTransitionState {
  matrixRain?: MatrixRainTransition;
  particleExplosion?: ParticleExplosionTransition;
  liquidMorph?: LiquidMorphTransition;
  hologramFlicker?: HologramFlickerTransition;
}

export class AdvancedTransitionManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private transitionStates: AdvancedTransitionState = {};
  private currentTransition: string | null = null;
  private settings: AdvancedTransitionSettings = {};

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  // Initialize a specific advanced transition
  initializeTransition(
    transitionType: string,
    targetValue: string,
    fontSize: number,
    settings?: AdvancedTransitionSettings
  ): boolean {
    this.currentTransition = transitionType;
    this.settings = settings || {};

    switch (transitionType) {
      case "matrixRain":
        return this.initializeMatrixRain(targetValue, fontSize);

      case "particleExplosion":
        return this.initializeParticleExplosion(targetValue, fontSize);

      case "liquidMorph":
        return this.initializeLiquidMorph(targetValue, fontSize);

      case "hologramFlicker":
        return this.initializeHologramFlicker(targetValue, fontSize);

      default:
        console.warn(`Unknown advanced transition: ${transitionType}`);
        return false;
    }
  }

  // Initialize Matrix Rain transition
  private initializeMatrixRain(targetValue: string, fontSize: number): boolean {
    try {
      // Clean up existing instance
      if (this.transitionStates.matrixRain) {
        this.transitionStates.matrixRain.cleanup();
      }

      // Create new Matrix Rain instance
      const matrixSettings = {
        ...MatrixRainPresets.classic,
        ...this.settings.matrixRain,
      };

      this.transitionStates.matrixRain = new MatrixRainTransition(
        this.canvas,
        this.ctx,
        matrixSettings
      );

      // Initialize the transition
      this.transitionStates.matrixRain.initialize(targetValue, fontSize);

      return true;
    } catch (error) {
      console.error("Failed to initialize Matrix Rain transition:", error);
      return false;
    }
  }

  // Initialize Particle Explosion transition
  private initializeParticleExplosion(
    targetValue: string,
    fontSize: number
  ): boolean {
    try {
      // Clean up existing instance
      if (this.transitionStates.particleExplosion) {
        this.transitionStates.particleExplosion.cleanup();
      }

      // Create new Particle Explosion instance
      const particleSettings = {
        ...ParticleExplosionPresets.classic,
        ...this.settings.particleExplosion,
      };

      this.transitionStates.particleExplosion = new ParticleExplosionTransition(
        this.canvas,
        this.ctx,
        particleSettings
      );

      // Initialize the transition
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      this.transitionStates.particleExplosion.initialize(
        targetValue,
        fontSize,
        centerX,
        centerY
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to initialize Particle Explosion transition:",
        error
      );
      return false;
    }
  }

  // Initialize Liquid Morph transition
  private initializeLiquidMorph(
    targetValue: string,
    fontSize: number
  ): boolean {
    try {
      // Clean up existing instance
      if (this.transitionStates.liquidMorph) {
        this.transitionStates.liquidMorph.cleanup();
      }

      // Create new Liquid Morph instance
      const liquidSettings = {
        ...LiquidMorphPresets.smooth,
        ...this.settings.liquidMorph,
      };

      this.transitionStates.liquidMorph = new LiquidMorphTransition(
        this.canvas,
        this.ctx,
        liquidSettings
      );

      // Initialize the transition (for liquid morph, we need source and target)
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      // For now, we'll use the same number as source and target
      // In a real implementation, you'd pass the previous value as source
      this.transitionStates.liquidMorph.initialize(
        targetValue,
        targetValue,
        fontSize,
        centerX,
        centerY
      );

      return true;
    } catch (error) {
      console.error("Failed to initialize Liquid Morph transition:", error);
      return false;
    }
  }

  // Initialize Hologram Flicker transition
  private initializeHologramFlicker(
    targetValue: string,
    fontSize: number
  ): boolean {
    try {
      // Clean up existing instance
      if (this.transitionStates.hologramFlicker) {
        this.transitionStates.hologramFlicker.cleanup();
      }

      // Create new Hologram Flicker instance
      const hologramSettings = {
        ...HologramFlickerPresets.classic,
        ...this.settings.hologramFlicker,
      };

      this.transitionStates.hologramFlicker = new HologramFlickerTransition(
        this.canvas,
        this.ctx,
        hologramSettings
      );

      // Initialize the transition
      this.transitionStates.hologramFlicker.initialize(targetValue, fontSize);

      return true;
    } catch (error) {
      console.error("Failed to initialize Hologram Flicker transition:", error);
      return false;
    }
  }

  // Render the current advanced transition
  renderTransition(
    transitionType: string,
    targetX: number,
    targetY: number,
    fontSize: number,
    textColor: string,
    progress: number
  ): boolean {
    if (this.currentTransition !== transitionType) {
      return false;
    }

    switch (transitionType) {
      case "matrixRain":
        return this.renderMatrixRain(
          targetX,
          targetY,
          fontSize,
          textColor,
          progress
        );

      case "particleExplosion":
        return this.renderParticleExplosion(
          targetX,
          targetY,
          fontSize,
          textColor,
          progress
        );

      case "liquidMorph":
        return this.renderLiquidMorph(
          targetX,
          targetY,
          fontSize,
          textColor,
          progress
        );

      case "hologramFlicker":
        return this.renderHologramFlicker(
          targetX,
          targetY,
          fontSize,
          textColor,
          progress
        );

      // Future cases for other advanced transitions
      default:
        return false;
    }
  }

  // Render Matrix Rain transition
  private renderMatrixRain(
    targetX: number,
    targetY: number,
    fontSize: number,
    textColor: string,
    progress: number
  ): boolean {
    const matrixRain = this.transitionStates.matrixRain;
    if (!matrixRain) {
      return false;
    }

    try {
      // Render the Matrix Rain effect
      matrixRain.render(targetX, targetY, fontSize, textColor);
      return true;
    } catch (error) {
      console.error("Failed to render Matrix Rain transition:", error);
      return false;
    }
  }

  // Render Particle Explosion transition
  private renderParticleExplosion(
    targetX: number,
    targetY: number,
    fontSize: number,
    textColor: string,
    progress: number
  ): boolean {
    const particleExplosion = this.transitionStates.particleExplosion;
    if (!particleExplosion) {
      return false;
    }

    try {
      // Render the Particle Explosion effect
      particleExplosion.render(textColor);
      return true;
    } catch (error) {
      console.error("Failed to render Particle Explosion transition:", error);
      return false;
    }
  }

  // Render Liquid Morph transition
  private renderLiquidMorph(
    targetX: number,
    targetY: number,
    fontSize: number,
    textColor: string,
    progress: number
  ): boolean {
    const liquidMorph = this.transitionStates.liquidMorph;
    if (!liquidMorph) {
      return false;
    }

    try {
      // Render the Liquid Morph effect
      liquidMorph.render(textColor);
      return true;
    } catch (error) {
      console.error("Failed to render Liquid Morph transition:", error);
      return false;
    }
  }

  // Render Hologram Flicker transition
  private renderHologramFlicker(
    targetX: number,
    targetY: number,
    fontSize: number,
    textColor: string,
    progress: number
  ): boolean {
    const hologramFlicker = this.transitionStates.hologramFlicker;
    if (!hologramFlicker) {
      return false;
    }

    try {
      // Render the Hologram Flicker effect
      hologramFlicker.render(targetX, targetY, fontSize, textColor);
      return true;
    } catch (error) {
      console.error("Failed to render Hologram Flicker transition:", error);
      return false;
    }
  }

  // Check if current transition is complete
  isTransitionComplete(transitionType: string): boolean {
    if (this.currentTransition !== transitionType) {
      return true;
    }

    switch (transitionType) {
      case "matrixRain":
        return this.transitionStates.matrixRain?.isComplete() || false;

      case "particleExplosion":
        return this.transitionStates.particleExplosion?.isComplete() || false;

      case "liquidMorph":
        return this.transitionStates.liquidMorph?.isComplete() || false;

      case "hologramFlicker":
        return this.transitionStates.hologramFlicker?.isComplete() || false;

      // Future cases for other advanced transitions
      default:
        return true;
    }
  }

  // Get transition progress (0-1)
  getTransitionProgress(transitionType: string): number {
    if (this.currentTransition !== transitionType) {
      return 1;
    }

    switch (transitionType) {
      case "matrixRain":
        return this.transitionStates.matrixRain?.getProgress() || 1;

      case "particleExplosion":
        return this.transitionStates.particleExplosion?.getProgress() || 1;

      case "liquidMorph":
        return this.transitionStates.liquidMorph?.getProgress() || 1;

      case "hologramFlicker":
        return this.transitionStates.hologramFlicker?.getProgress() || 1;

      // Future cases for other advanced transitions
      default:
        return 1;
    }
  }

  // Update transition settings
  updateTransitionSettings(
    transitionType: string,
    settings: AdvancedTransitionSettings
  ): void {
    this.settings = { ...this.settings, ...settings };

    switch (transitionType) {
      case "matrixRain":
        if (this.transitionStates.matrixRain && settings.matrixRain) {
          this.transitionStates.matrixRain.updateSettings(settings.matrixRain);
        }
        break;

      case "particleExplosion":
        if (
          this.transitionStates.particleExplosion &&
          settings.particleExplosion
        ) {
          this.transitionStates.particleExplosion.updateSettings(
            settings.particleExplosion
          );
        }
        break;

      case "liquidMorph":
        if (this.transitionStates.liquidMorph && settings.liquidMorph) {
          this.transitionStates.liquidMorph.updateSettings(
            settings.liquidMorph
          );
        }
        break;

      case "hologramFlicker":
        if (this.transitionStates.hologramFlicker && settings.hologramFlicker) {
          this.transitionStates.hologramFlicker.updateSettings(
            settings.hologramFlicker
          );
        }
        break;

      // Future cases for other advanced transitions
    }
  }

  // Get performance metrics for current transition
  getPerformanceMetrics(transitionType: string): Record<string, unknown> {
    if (this.currentTransition !== transitionType) {
      return {};
    }

    switch (transitionType) {
      case "matrixRain":
        return this.transitionStates.matrixRain?.getPerformanceMetrics() || {};

      case "particleExplosion":
        return (
          this.transitionStates.particleExplosion?.getPerformanceMetrics() || {}
        );

      case "liquidMorph":
        return this.transitionStates.liquidMorph?.getPerformanceMetrics() || {};

      case "hologramFlicker":
        return (
          this.transitionStates.hologramFlicker?.getPerformanceMetrics() || {}
        );

      // Future cases for other advanced transitions
      default:
        return {};
    }
  }

  // Reset current transition
  resetTransition(transitionType: string): void {
    if (this.currentTransition !== transitionType) {
      return;
    }

    switch (transitionType) {
      case "matrixRain":
        this.transitionStates.matrixRain?.reset();
        break;

      case "particleExplosion":
        this.transitionStates.particleExplosion?.reset();
        break;

      case "liquidMorph":
        this.transitionStates.liquidMorph?.reset();
        break;

      case "hologramFlicker":
        this.transitionStates.hologramFlicker?.reset();
        break;

      // Future cases for other advanced transitions
    }
  }

  // Check if a transition type is supported
  isTransitionSupported(transitionType: string): boolean {
    const supportedTransitions = [
      "matrixRain",
      "particleExplosion",
      "liquidMorph",
      "hologramFlicker",
    ];

    return supportedTransitions.includes(transitionType);
  }

  // Get available advanced transitions
  getAvailableTransitions(): Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    complexity: "low" | "medium" | "high";
    supportsTransparency: boolean;
    requiresGPU: boolean;
  }> {
    return [
      {
        id: "matrixRain",
        name: "Matrix Rain",
        description:
          "Digital rain effect with falling characters revealing the number",
        category: "Advanced",
        complexity: "high",
        supportsTransparency: true,
        requiresGPU: false,
      },
      {
        id: "particleExplosion",
        name: "Particle Explosion",
        description:
          "Numbers explode into particles and reform with physics simulation",
        category: "Advanced",
        complexity: "high",
        supportsTransparency: true,
        requiresGPU: false,
      },
      {
        id: "liquidMorph",
        name: "Liquid Morph",
        description:
          "Fluid dynamics simulation for smooth number morphing with organic movement",
        category: "Advanced",
        complexity: "high",
        supportsTransparency: true,
        requiresGPU: false,
      },
      {
        id: "hologramFlicker",
        name: "Hologram Flicker",
        description:
          "Sci-fi holographic glitch effect with scan lines and interference patterns",
        category: "Advanced",
        complexity: "high",
        supportsTransparency: true,
        requiresGPU: false,
      },
      // Future transitions will be added here
    ];
  }

  // Cleanup all transitions
  cleanup(): void {
    // Cleanup Matrix Rain
    if (this.transitionStates.matrixRain) {
      this.transitionStates.matrixRain.cleanup();
      this.transitionStates.matrixRain = undefined;
    }

    // Cleanup Particle Explosion
    if (this.transitionStates.particleExplosion) {
      this.transitionStates.particleExplosion.cleanup();
      this.transitionStates.particleExplosion = undefined;
    }

    // Cleanup Liquid Morph
    if (this.transitionStates.liquidMorph) {
      this.transitionStates.liquidMorph.cleanup();
      this.transitionStates.liquidMorph = undefined;
    }

    // Cleanup Hologram Flicker
    if (this.transitionStates.hologramFlicker) {
      this.transitionStates.hologramFlicker.cleanup();
      this.transitionStates.hologramFlicker = undefined;
    }

    // Future: cleanup other transitions

    this.currentTransition = null;
    this.settings = {};
  }
}

// Enhanced transition effect that integrates with the advanced transition manager
export const createAdvancedTransitionEffect = (
  transitionType: string,
  manager: AdvancedTransitionManager
) => {
  return (context: TransitionContext): TransitionResult => {
    // Check if this is an advanced transition
    if (manager.isTransitionSupported(transitionType)) {
      // The actual rendering is handled by the manager
      // This just provides the basic result for compatibility
      const progress = manager.getTransitionProgress(transitionType);

      return {
        x: context.canvas.width / 2,
        y: context.canvas.height / 2,
        opacity: progress,
      };
    }

    // Fallback for unsupported transitions
    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: context.progress,
    };
  };
};

// Factory function for creating advanced transition manager
export const createAdvancedTransitionManager = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): AdvancedTransitionManager => {
  return new AdvancedTransitionManager(canvas, ctx);
};

// Preset configurations for different use cases
export const AdvancedTransitionPresets = {
  matrixRain: {
    classic: MatrixRainPresets.classic,
    fast: MatrixRainPresets.fast,
    dense: MatrixRainPresets.dense,
    minimal: MatrixRainPresets.minimal,

    // Additional presets
    cyberpunk: {
      speed: 6,
      density: 0.4,
      characterSet:
        "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF",
      fadeLength: 25,
      glowIntensity: 4,
      colorScheme: "blue" as const,
      transparencySupport: true,
    },

    hacker: {
      speed: 7,
      density: 0.6,
      characterSet: "01",
      fadeLength: 15,
      glowIntensity: 5,
      colorScheme: "classic" as const,
      transparencySupport: true,
    },

    retro: {
      speed: 3,
      density: 0.25,
      characterSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      fadeLength: 12,
      glowIntensity: 2,
      colorScheme: "classic" as const,
      transparencySupport: true,
    },
  },

  particleExplosion: {
    classic: ParticleExplosionPresets.classic,
    intense: ParticleExplosionPresets.intense,
    subtle: ParticleExplosionPresets.subtle,
    electric: ParticleExplosionPresets.electric,
    minimal: ParticleExplosionPresets.minimal,

    // Additional presets
    fireworks: {
      particleCount: 250,
      explosionRadius: 180,
      explosionForce: 9,
      gravity: 0.5,
      friction: 0.95,
      reformSpeed: 2.5,
      particleSize: 4,
      colorScheme: "rainbow" as const,
      glowEffect: true,
      trailEffect: true,
      transparencySupport: true,
    },

    nuclear: {
      particleCount: 400,
      explosionRadius: 250,
      explosionForce: 10,
      gravity: 0.6,
      friction: 0.94,
      reformSpeed: 3,
      particleSize: 5,
      colorScheme: "fire" as const,
      glowEffect: true,
      trailEffect: true,
      transparencySupport: true,
    },

    gentle: {
      particleCount: 60,
      explosionRadius: 70,
      explosionForce: 3,
      gravity: 0.1,
      friction: 0.99,
      reformSpeed: 1.2,
      particleSize: 2,
      colorScheme: "inherit" as const,
      glowEffect: false,
      trailEffect: false,
      transparencySupport: true,
    },
  },

  liquidMorph: {
    smooth: LiquidMorphPresets.smooth,
    viscous: LiquidMorphPresets.viscous,
    fluid: LiquidMorphPresets.fluid,
    minimal: LiquidMorphPresets.minimal,
    dynamic: LiquidMorphPresets.dynamic,

    // Additional presets
    mercury: {
      viscosity: 0.3,
      surfaceTension: 0.9,
      flowSpeed: 4,
      resolution: 35,
      waveAmplitude: 6,
      waveFrequency: 1.8,
      colorScheme: "gradient" as const,
      glowEffect: true,
      rippleEffect: true,
      transparencySupport: true,
    },

    honey: {
      viscosity: 1.6,
      surfaceTension: 1.0,
      flowSpeed: 1.2,
      resolution: 20,
      waveAmplitude: 2,
      waveFrequency: 0.5,
      colorScheme: "lava" as const,
      glowEffect: false,
      rippleEffect: false,
      transparencySupport: true,
    },

    plasma: {
      viscosity: 0.2,
      surfaceTension: 0.1,
      flowSpeed: 6,
      resolution: 45,
      waveAmplitude: 20,
      waveFrequency: 4.0,
      colorScheme: "rainbow" as const,
      glowEffect: true,
      rippleEffect: true,
      transparencySupport: true,
    },
  },

  hologramFlicker: {
    classic: HologramFlickerPresets.classic,
    stable: HologramFlickerPresets.stable,
    unstable: HologramFlickerPresets.unstable,
    retro: HologramFlickerPresets.retro,
    minimal: HologramFlickerPresets.minimal,
    cyberpunk: HologramFlickerPresets.cyberpunk,

    // Additional presets
    ghost: {
      scanLineSpeed: 1,
      scanLineIntensity: 0.3,
      flickerFrequency: 0.5,
      interferenceLevel: 0.1,
      rgbSeparation: 0,
      staticNoise: 0.1,
      glitchIntensity: 0.2,
      colorScheme: "cyan" as const,
      hologramOpacity: 0.4,
      transparencySupport: true,
    },

    emergency: {
      scanLineSpeed: 10,
      scanLineIntensity: 1.0,
      flickerFrequency: 5.0,
      interferenceLevel: 1.0,
      rgbSeparation: 8,
      staticNoise: 0.8,
      glitchIntensity: 1.0,
      colorScheme: "amber" as const,
      hologramOpacity: 0.5,
      transparencySupport: true,
    },

    pristine: {
      scanLineSpeed: 1,
      scanLineIntensity: 0.2,
      flickerFrequency: 0.3,
      interferenceLevel: 0.05,
      rgbSeparation: 0,
      staticNoise: 0.02,
      glitchIntensity: 0.05,
      colorScheme: "green" as const,
      hologramOpacity: 0.98,
      transparencySupport: true,
    },
  },
};
