// Enhanced Transition Effects and Easing Functions
// Advanced easing functions and transition effect implementations

export interface TransitionContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  currentValue: number;
  settings: {
    fontSize: number;
    endValue: number;
    [key: string]: unknown;
  };
  timestamp: number;
  digitIndex?: number;
  progress: number;
}

export interface TransitionResult {
  x: number;
  y: number;
  opacity: number;
  scale?: number;
  rotation?: number;
  skew?: number;
}

// Enhanced easing functions with more variety
export const enhancedEasingFunctions = {
  // Basic easing
  linear: (t: number): number => t,

  // Quadratic easing
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // Cubic easing
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => --t * t * t + 1,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Quartic easing
  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - --t * t * t * t,
  easeInOutQuart: (t: number): number =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,

  // Quintic easing
  easeInQuint: (t: number): number => t * t * t * t * t,
  easeOutQuint: (t: number): number => 1 + --t * t * t * t * t,
  easeInOutQuint: (t: number): number =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,

  // Sine easing
  easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number): number => (1 - Math.cos(Math.PI * t)) / 2,

  // Exponential easing
  easeInExpo: (t: number): number => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  // Circular easing
  easeInCirc: (t: number): number => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: (t: number): number => Math.sqrt(1 - (t - 1) * (t - 1)),
  easeInOutCirc: (t: number): number => {
    if (t < 0.5) return (1 - Math.sqrt(1 - 4 * t * t)) / 2;
    return (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2;
  },

  // Back easing
  easeInBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    if (t < 0.5) {
      return (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2;
    }
    return (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },

  // Elastic easing
  easeInElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInOutElastic: (t: number): number => {
    const c5 = (2 * Math.PI) / 4.5;
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) {
      return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2;
    }
    return (
      (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1
    );
  },

  // Bounce easing
  easeInBounce: (t: number): number =>
    1 - enhancedEasingFunctions.easeOutBounce(1 - t),
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeInOutBounce: (t: number): number => {
    if (t < 0.5) {
      return (1 - enhancedEasingFunctions.easeOutBounce(1 - 2 * t)) / 2;
    }
    return (1 + enhancedEasingFunctions.easeOutBounce(2 * t - 1)) / 2;
  },

  // Legacy compatibility
  easeOut: (t: number): number => enhancedEasingFunctions.easeOutQuad(t),
  easeIn: (t: number): number => enhancedEasingFunctions.easeInQuad(t),
  bounce: (t: number): number => enhancedEasingFunctions.easeOutBounce(t),
};

// Enhanced transition effects with better performance and visual quality
export const enhancedTransitionEffects = {
  none: (context: TransitionContext): TransitionResult => ({
    x: context.canvas.width / 2,
    y: context.canvas.height / 2,
    opacity: 1,
  }),

  fadeIn: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeOutCubic(context.progress);
    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: progress,
    };
  },

  fadeRoll: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeOutBack(context.progress);
    const rollDistance = context.settings.fontSize * 0.3;
    const rollY = context.canvas.height / 2 - (1 - progress) * rollDistance;

    // Apply rotation for rolling effect
    const rotation = (1 - progress) * Math.PI * 0.1;

    return {
      x: context.canvas.width / 2,
      y: rollY,
      opacity: progress,
      rotation,
    };
  },

  flipDown: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeInOutQuart(context.progress);
    const scaleY = Math.abs(Math.cos(progress * Math.PI));
    const opacity = scaleY > 0.1 ? 1 : 0;

    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity,
      scale: scaleY,
    };
  },

  slideVertical: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeOutExpo(context.progress);
    const slideDistance = context.settings.fontSize * 1.2;
    const slideY = context.canvas.height / 2 + (1 - progress) * slideDistance;

    return {
      x: context.canvas.width / 2,
      y: slideY,
      opacity: progress,
    };
  },

  bounce: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeOutBounce(context.progress);
    const bounceHeight =
      Math.sin(progress * Math.PI) * (context.settings.fontSize * 0.3);
    const bounceY = context.canvas.height / 2 - bounceHeight;

    return {
      x: context.canvas.width / 2,
      y: bounceY,
      opacity: 1,
    };
  },

  scale: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeOutElastic(context.progress);
    const scaleValue = 0.3 + progress * 0.7;

    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: progress,
      scale: scaleValue,
    };
  },

  slideUp: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeOutCirc(context.progress);
    const distance = context.settings.fontSize * 1.5;
    const offset = (1 - progress) * distance;

    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2 + offset,
      opacity: 0.3 + progress * 0.7,
    };
  },

  slideDown: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeOutCirc(context.progress);
    const distance = context.settings.fontSize * 1.5;
    const offset = (1 - progress) * -distance;

    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2 + offset,
      opacity: 0.3 + progress * 0.7,
    };
  },

  glitch: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeInOutQuart(context.progress);

    if (progress < 0.8 && Math.random() > 0.7) {
      const glitchX = (Math.random() - 0.5) * 10;
      const glitchY = (Math.random() - 0.5) * 10;
      return {
        x: context.canvas.width / 2 + glitchX,
        y: context.canvas.height / 2 + glitchY,
        opacity: 0.7 + Math.random() * 0.3,
      };
    }

    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: 0.7 + progress * 0.3,
    };
  },

  blur: (context: TransitionContext): TransitionResult => {
    const progress = enhancedEasingFunctions.easeInOutSine(context.progress);

    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: progress,
    };
  },

  typewriter: (context: TransitionContext): TransitionResult => {
    // Typewriter effect shows characters one by one
    const digitIndex = context.digitIndex || 0;
    const totalDigits = context.settings.endValue.toString().length;
    const digitProgress = digitIndex / totalDigits;
    const showDigit = context.progress > digitProgress;

    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: showDigit ? 1 : 0,
    };
  },

  // Advanced transition effects for future implementation
  matrixRain: (context: TransitionContext): TransitionResult => {
    // Matrix Rain effect with falling characters
    const progress = enhancedEasingFunctions.easeOutExpo(context.progress);

    // The actual Matrix Rain rendering is handled by the MatrixRainTransition class
    // This function provides the basic positioning and opacity for integration
    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: progress,
    };
  },

  particleExplosion: (context: TransitionContext): TransitionResult => {
    // Particle Explosion effect with physics simulation
    const progress = enhancedEasingFunctions.easeOutCirc(context.progress);

    // The actual Particle Explosion rendering is handled by the ParticleExplosionTransition class
    // This function provides the basic positioning and opacity for integration
    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: progress,
    };
  },

  liquidMorph: (context: TransitionContext): TransitionResult => {
    // Liquid Morph effect with fluid dynamics simulation
    const progress = enhancedEasingFunctions.easeInOutSine(context.progress);

    // The actual Liquid Morph rendering is handled by the LiquidMorphTransition class
    // This function provides the basic positioning and opacity for integration
    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: progress,
    };
  },

  hologramFlicker: (context: TransitionContext): TransitionResult => {
    // Hologram Flicker effect with scan lines and interference patterns
    const progress = enhancedEasingFunctions.easeInOutQuad(context.progress);
    const flicker = Math.sin(context.timestamp * 0.01) * 0.1 + 0.9;

    // The actual Hologram Flicker rendering is handled by the HologramFlickerTransition class
    // This function provides the basic positioning and opacity for integration
    return {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
      opacity: progress * flicker,
    };
  },
};

// Utility function to apply transition transformations to canvas context
export const applyTransitionTransform = (
  ctx: CanvasRenderingContext2D,
  result: TransitionResult,
  centerX: number,
  centerY: number
): void => {
  ctx.save();

  // Apply transformations in the correct order
  ctx.translate(centerX, centerY);

  if (result.rotation) {
    ctx.rotate(result.rotation);
  }

  if (result.scale !== undefined) {
    ctx.scale(result.scale, result.scale);
  }

  if (result.skew) {
    ctx.transform(1, result.skew, 0, 1, 0, 0);
  }

  ctx.translate(-centerX, -centerY);

  if (result.opacity !== undefined) {
    ctx.globalAlpha = result.opacity;
  }
};

// Utility function to restore canvas context after transformation
export const restoreTransitionTransform = (
  ctx: CanvasRenderingContext2D
): void => {
  ctx.restore();
};

// Get transition effect by name
export const getTransitionEffect = (name: string) => {
  return (
    enhancedTransitionEffects[name as keyof typeof enhancedTransitionEffects] ||
    enhancedTransitionEffects.none
  );
};

// Get easing function by name
export const getEasingFunction = (name: string) => {
  return (
    enhancedEasingFunctions[name as keyof typeof enhancedEasingFunctions] ||
    enhancedEasingFunctions.linear
  );
};
