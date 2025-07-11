export type TransitionType = 'fade-roll' | 'flip-down' | 'slide-vertical' | 'bounce' | 'scale' | 'none';
export type EasingFunction = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic' | 'back';

export interface DigitTransitionConfig {
  type: TransitionType;
  duration: number;
  easing: EasingFunction;
  delay: number;
  stagger: number;
}

export interface CounterAnimationState {
  currentValue: number;
  targetValue: number;
  isAnimating: boolean;
  startTime: number;
  duration: number;
}

export class CounterTransitionEngine {
  private static readonly EASING_FUNCTIONS = {
    linear: 'linear',
    'ease-in': 'cubic-bezier(0.42, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.58, 1)',
    'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    back: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };

  private animationFrame: number | null = null;
  private config: DigitTransitionConfig;
  private onUpdate: (value: number, progress: number) => void;
  private onComplete: () => void;

  constructor(
    config: DigitTransitionConfig,
    onUpdate: (value: number, progress: number) => void,
    onComplete: () => void = () => {}
  ) {
    this.config = config;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
  }

  static createTransitionCSS(config: DigitTransitionConfig): string {
    const easingFunction = this.EASING_FUNCTIONS[config.easing] || this.EASING_FUNCTIONS.linear;
    
    return `
      :root {
        --counter-transition-duration: ${config.duration}ms;
        --counter-transition-easing: ${easingFunction};
        --counter-transition-delay: ${config.delay}ms;
        --counter-stagger-delay: ${config.stagger}ms;
      }
      
      .counter-digit {
        will-change: transform, opacity;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        position: relative;
        overflow: hidden;
      }
      
      .counter-digit-content {
        transition: transform var(--counter-transition-duration) var(--counter-transition-easing),
                    opacity var(--counter-transition-duration) var(--counter-transition-easing);
        transform: translate3d(0, 0, 0);
      }
      
      /* Fade Roll Transition */
      .transition-fade-roll .counter-digit-content {
        transition: transform var(--counter-transition-duration) var(--counter-transition-easing),
                    opacity calc(var(--counter-transition-duration) * 0.6) var(--counter-transition-easing);
      }
      
      .transition-fade-roll .digit-entering {
        transform: translate3d(0, -100%, 0);
        opacity: 0;
      }
      
      .transition-fade-roll .digit-active {
        transform: translate3d(0, 0, 0);
        opacity: 1;
      }
      
      .transition-fade-roll .digit-exiting {
        transform: translate3d(0, 100%, 0);
        opacity: 0;
      }
      
      /* Flip Down Transition */
      .transition-flip-down .counter-digit-content {
        transform-origin: center top;
        transition: transform var(--counter-transition-duration) var(--counter-transition-easing);
      }
      
      .transition-flip-down .digit-entering {
        transform: perspective(400px) rotateX(-90deg);
      }
      
      .transition-flip-down .digit-active {
        transform: perspective(400px) rotateX(0deg);
      }
      
      .transition-flip-down .digit-exiting {
        transform: perspective(400px) rotateX(90deg);
      }
      
      /* Slide Vertical Transition */
      .transition-slide-vertical .counter-digit {
        overflow: hidden;
      }
      
      .transition-slide-vertical .digit-entering {
        transform: translate3d(0, -100%, 0);
      }
      
      .transition-slide-vertical .digit-active {
        transform: translate3d(0, 0, 0);
      }
      
      .transition-slide-vertical .digit-exiting {
        transform: translate3d(0, 100%, 0);
      }
      
      /* Bounce Transition */
      .transition-bounce .digit-entering {
        transform: translate3d(0, -100%, 0) scale(0.8);
        animation: bounceIn var(--counter-transition-duration) var(--counter-transition-easing) forwards;
      }
      
      .transition-bounce .digit-exiting {
        animation: bounceOut calc(var(--counter-transition-duration) * 0.6) var(--counter-transition-easing) forwards;
      }
      
      @keyframes bounceIn {
        0% {
          transform: translate3d(0, -100%, 0) scale(0.8);
          opacity: 0;
        }
        60% {
          transform: translate3d(0, -10%, 0) scale(1.1);
          opacity: 1;
        }
        80% {
          transform: translate3d(0, 5%, 0) scale(0.95);
        }
        100% {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 1;
        }
      }
      
      @keyframes bounceOut {
        0% {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 1;
        }
        40% {
          transform: translate3d(0, -10%, 0) scale(1.1);
        }
        100% {
          transform: translate3d(0, 100%, 0) scale(0.8);
          opacity: 0;
        }
      }
      
      /* Scale Transition */
      .transition-scale .digit-entering {
        transform: scale(0);
        opacity: 0;
      }
      
      .transition-scale .digit-active {
        transform: scale(1);
        opacity: 1;
      }
      
      .transition-scale .digit-exiting {
        transform: scale(0);
        opacity: 0;
      }
      
      /* Stagger delays for multiple digits */
      .counter-digit:nth-child(1) .counter-digit-content {
        transition-delay: calc(var(--counter-transition-delay) + var(--counter-stagger-delay) * 0);
      }
      
      .counter-digit:nth-child(2) .counter-digit-content {
        transition-delay: calc(var(--counter-transition-delay) + var(--counter-stagger-delay) * 1);
      }
      
      .counter-digit:nth-child(3) .counter-digit-content {
        transition-delay: calc(var(--counter-transition-delay) + var(--counter-stagger-delay) * 2);
      }
      
      .counter-digit:nth-child(4) .counter-digit-content {
        transition-delay: calc(var(--counter-transition-delay) + var(--counter-stagger-delay) * 3);
      }
      
      .counter-digit:nth-child(5) .counter-digit-content {
        transition-delay: calc(var(--counter-transition-delay) + var(--counter-stagger-delay) * 4);
      }
    `;
  }

  animateToValue(
    startValue: number,
    endValue: number,
    duration: number = this.config.duration
  ): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    const startTime = performance.now();
    const valueRange = endValue - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing function
      const easedProgress = this.applyEasing(progress, this.config.easing);
      const currentValue = startValue + (valueRange * easedProgress);

      this.onUpdate(currentValue, progress);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.animationFrame = null;
        this.onComplete();
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  private applyEasing(progress: number, easing: EasingFunction): number {
    switch (easing) {
      case 'linear':
        return progress;
      
      case 'ease-in':
        return progress * progress;
      
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);
      
      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
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
      
      case 'elastic':
        const c4 = (2 * Math.PI) / 3;
        return progress === 0
          ? 0
          : progress === 1
          ? 1
          : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;
      
      case 'back':
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * progress * progress * progress - c1 * progress * progress;
      
      default:
        return progress;
    }
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}

export class DigitRenderer {
  private element: HTMLElement;
  private currentDigit: number = 0;
  private transitionType: TransitionType = 'none';

  constructor(element: HTMLElement, initialDigit: number = 0) {
    this.element = element;
    this.currentDigit = initialDigit;
    this.setupDigitElement();
  }

  private setupDigitElement(): void {
    this.element.classList.add('counter-digit');
    this.element.innerHTML = `
      <div class="counter-digit-content digit-active">
        ${this.currentDigit}
      </div>
    `;
  }

  setTransitionType(type: TransitionType): void {
    // Remove old transition class
    this.element.classList.remove(`transition-${this.transitionType}`);
    
    // Add new transition class
    this.transitionType = type;
    if (type !== 'none') {
      this.element.classList.add(`transition-${type}`);
    }
  }

  animateToDigit(newDigit: number, delay: number = 0): Promise<void> {
    if (newDigit === this.currentDigit) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const content = this.element.querySelector('.counter-digit-content');
        if (!content) {
          resolve();
          return;
        }

        // Create new digit element
        const newContent = document.createElement('div');
        newContent.className = 'counter-digit-content digit-entering';
        newContent.textContent = newDigit.toString();

        // Add new digit to container
        this.element.appendChild(newContent);

        // Mark current digit as exiting
        content.classList.remove('digit-active');
        content.classList.add('digit-exiting');

        // Trigger transition
        requestAnimationFrame(() => {
          newContent.classList.remove('digit-entering');
          newContent.classList.add('digit-active');

          // Clean up after transition
          setTimeout(() => {
            if (content.parentNode) {
              content.parentNode.removeChild(content);
            }
            this.currentDigit = newDigit;
            resolve();
          }, 600); // Slightly longer than typical transition duration
        });
      }, delay);
    });
  }

  getCurrentDigit(): number {
    return this.currentDigit;
  }
}

export class MultiDigitCounter {
  private digits: DigitRenderer[] = [];
  private container: HTMLElement;
  private transitionEngine: CounterTransitionEngine;
  private config: DigitTransitionConfig;

  constructor(
    container: HTMLElement,
    digitCount: number,
    config: DigitTransitionConfig
  ) {
    this.container = container;
    this.config = config;
    this.setupContainer();
    this.createDigits(digitCount);
    this.setupTransitionEngine();
    this.injectCSS();
  }

  private setupContainer(): void {
    this.container.classList.add('multi-digit-counter');
    this.container.style.display = 'flex';
    this.container.style.alignItems = 'center';
    this.container.style.justifyContent = 'center';
  }

  private createDigits(count: number): void {
    this.container.innerHTML = '';
    this.digits = [];

    for (let i = 0; i < count; i++) {
      const digitElement = document.createElement('div');
      this.container.appendChild(digitElement);
      
      const digit = new DigitRenderer(digitElement, 0);
      digit.setTransitionType(this.config.type);
      this.digits.push(digit);
    }
  }

  private setupTransitionEngine(): void {
    this.transitionEngine = new CounterTransitionEngine(
      this.config,
      (value, progress) => {
        this.updateDigitsFromValue(Math.round(value));
      },
      () => {
        // Animation complete
      }
    );
  }

  private injectCSS(): void {
    const styleId = 'counter-transitions-css';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = CounterTransitionEngine.createTransitionCSS(this.config);
  }

  private updateDigitsFromValue(value: number): void {
    const valueStr = value.toString().padStart(this.digits.length, '0');
    
    this.digits.forEach((digit, index) => {
      const digitValue = parseInt(valueStr[index]) || 0;
      const delay = index * this.config.stagger;
      digit.animateToDigit(digitValue, delay);
    });
  }

  animateToValue(targetValue: number, duration?: number): void {
    const currentValue = this.getCurrentValue();
    this.transitionEngine.animateToValue(currentValue, targetValue, duration);
  }

  getCurrentValue(): number {
    return parseInt(
      this.digits.map(digit => digit.getCurrentDigit()).join('') || '0'
    );
  }

  setTransitionConfig(config: Partial<DigitTransitionConfig>): void {
    this.config = { ...this.config, ...config };
    this.digits.forEach(digit => {
      if (config.type) {
        digit.setTransitionType(config.type);
      }
    });
    this.injectCSS();
  }

  destroy(): void {
    this.transitionEngine.stop();
    this.digits = [];
    this.container.innerHTML = '';
  }
}