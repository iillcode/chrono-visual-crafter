import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { MultiDigitCounter, DigitTransitionConfig } from "@/utils/counterTransitions";

interface OptimizedCounterPreviewProps {
  settings: {
    startValue: number;
    endValue: number;
    duration: number;
    fontFamily: string;
    fontSize: number;
    fontWeight?: number;
    letterSpacing?: number;
    design: string;
    background: string;
    speed: number;
    transition: string;
    easing: string;
    prefix: string;
    suffix: string;
    separator: string;
    backgroundGradient?: string;
    customBackgroundColor?: string;
    textColor?: string;
    useFloatValues: boolean;
  };
  textSettings: {
    enabled: boolean;
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    offsetX: number;
    offsetY: number;
    opacity: number;
  };
  designSettings: {
    neonColor: string;
    neonIntensity: number;
    glowColor: string;
    glowIntensity: number;
    gradientColors: string;
    fireColors: string;
    fireGlow: number;
    rainbowColors: string;
    chromeColors: string;
  };
  currentValue: number;
  isRecording: boolean;
  formatNumber: (value: number) => string;
}

const OptimizedCounterPreview = forwardRef<HTMLCanvasElement, OptimizedCounterPreviewProps>(
  (
    {
      settings,
      textSettings,
      designSettings,
      currentValue,
      isRecording,
      formatNumber,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const multiDigitCounterRef = useRef<MultiDigitCounter | null>(null);
    const animationFrameRef = useRef<number>();

    useImperativeHandle(ref, () => canvasRef.current!);

    // Setup multi-digit counter
    useEffect(() => {
      if (!counterRef.current) return;

      const transitionConfig: DigitTransitionConfig = {
        type: settings.transition as any,
        duration: 600,
        easing: settings.easing as any,
        delay: 0,
        stagger: 50,
      };

      // Determine digit count based on max value
      const maxValue = Math.max(Math.abs(settings.startValue), Math.abs(settings.endValue));
      const digitCount = Math.max(maxValue.toString().length, 2);

      multiDigitCounterRef.current = new MultiDigitCounter(
        counterRef.current,
        digitCount,
        transitionConfig
      );

      return () => {
        if (multiDigitCounterRef.current) {
          multiDigitCounterRef.current.destroy();
          multiDigitCounterRef.current = null;
        }
      };
    }, [settings.transition, settings.easing]);

    // Update counter value
    useEffect(() => {
      if (multiDigitCounterRef.current) {
        const targetValue = Math.round(currentValue);
        multiDigitCounterRef.current.animateToValue(targetValue);
      }
    }, [currentValue]);

    // Render to canvas for recording
    useEffect(() => {
      const renderToCanvas = () => {
        const canvas = canvasRef.current;
        const counterElement = counterRef.current;
        
        if (!canvas || !counterElement) return;

        const ctx = canvas.getContext('2d', {
          alpha: settings.background === 'transparent',
          premultipliedAlpha: false,
          preserveDrawingBuffer: true,
        });

        if (!ctx) return;

        // Set canvas size
        canvas.width = 800;
        canvas.height = 600;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        this.drawBackground(ctx, canvas, settings);

        // Draw counter using DOM-to-canvas conversion
        this.drawCounterToCanvas(ctx, canvas, counterElement, settings, designSettings);

        // Draw additional text if enabled
        if (textSettings.enabled && textSettings.text) {
          this.drawTextToCanvas(ctx, canvas, textSettings, settings);
        }

        if (isRecording) {
          animationFrameRef.current = requestAnimationFrame(renderToCanvas);
        }
      };

      if (isRecording) {
        renderToCanvas();
      } else {
        // Single render when not recording
        renderToCanvas();
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [settings, textSettings, designSettings, currentValue, isRecording]);

    const drawBackground = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      settings: any
    ) => {
      if (settings.background === 'transparent') {
        return;
      }

      if (settings.background === 'gradient' && settings.backgroundGradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const colors = settings.backgroundGradient.match(/#[0-9a-fA-F]{6}/g) || ['#000000', '#ffffff'];
        colors.forEach((color: string, index: number) => {
          gradient.addColorStop(index / (colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (settings.background === 'custom' && settings.customBackgroundColor) {
        ctx.fillStyle = settings.customBackgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = settings.background === 'white' ? '#FFFFFF' : '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const drawCounterToCanvas = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      counterElement: HTMLElement,
      settings: any,
      designSettings: any
    ) => {
      // Get the formatted counter value
      const counterText = formatNumber(currentValue);
      
      // Set font properties
      const fontWeight = settings.fontWeight || 400;
      const fontFamily = this.getFontFamily(settings.fontFamily);
      ctx.font = `${fontWeight} ${settings.fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Apply design effects
      this.applyDesignEffects(ctx, counterText, centerX, centerY, settings, designSettings);
    };

    const drawTextToCanvas = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      textSettings: any,
      settings: any
    ) => {
      const fontSize = textSettings.fontSize;
      const fontFamily = this.getFontFamily(textSettings.fontFamily);
      
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const x = canvas.width / 2 + textSettings.offsetX;
      const y = canvas.height / 2 + textSettings.offsetY;

      const previousAlpha = ctx.globalAlpha;
      ctx.globalAlpha = textSettings.opacity;

      ctx.fillStyle = textSettings.color;
      ctx.fillText(textSettings.text, x, y);

      ctx.globalAlpha = previousAlpha;
    };

    const getFontFamily = (fontKey: string): string => {
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
    };

    const applyDesignEffects = (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      settings: any,
      designSettings: any
    ) => {
      const effects = {
        classic: () => {
          ctx.fillStyle = settings.textColor || (settings.background === 'white' ? '#000000' : '#FFFFFF');
          ctx.fillText(text, x, y);
        },

        neon: () => {
          const neonColor = designSettings.neonColor || '#00FFFF';
          const intensity = designSettings.neonIntensity || 10;

          ctx.save();
          
          // Multiple glow layers for better effect
          for (let i = 0; i < 3; i++) {
            ctx.shadowColor = neonColor;
            ctx.shadowBlur = intensity * (3 - i);
            ctx.fillStyle = neonColor;
            ctx.fillText(text, x, y);
          }

          // Core text
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(text, x, y);

          ctx.restore();
        },

        glow: () => {
          const glowColor = designSettings.glowColor || '#FFFFFF';
          const intensity = designSettings.glowIntensity || 15;

          ctx.save();

          for (let i = 0; i < 3; i++) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = intensity + i * 10;
            ctx.fillStyle = glowColor;
            ctx.fillText(text, x, y);
          }

          ctx.restore();
        },

        gradient: () => {
          const gradient = ctx.createLinearGradient(
            x - settings.fontSize,
            y - settings.fontSize / 2,
            x + settings.fontSize,
            y + settings.fontSize / 2
          );

          const colorMatches = designSettings.gradientColors.match(/#[0-9A-Fa-f]{6}/g);
          if (colorMatches && colorMatches.length > 0) {
            colorMatches.forEach((color: string, index: number) => {
              gradient.addColorStop(index / (colorMatches.length - 1), color);
            });
          } else {
            gradient.addColorStop(0, '#FF6B6B');
            gradient.addColorStop(0.5, '#4ECDC4');
            gradient.addColorStop(1, '#45B7D1');
          }

          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
        },

        // Add other design effects...
      };

      const effect = effects[settings.design as keyof typeof effects] || effects.classic;
      effect();
    };

    return (
      <div className="w-full h-full flex items-center justify-center relative">
        {/* Hidden canvas for recording */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none"
          style={{ zIndex: -1 }}
        />
        
        {/* Visible counter with optimized transitions */}
        <div
          ref={counterRef}
          className="counter-container"
          style={{
            fontSize: `${settings.fontSize}px`,
            fontFamily: this.getFontFamily(settings.fontFamily),
            fontWeight: settings.fontWeight || 400,
            letterSpacing: `${settings.letterSpacing || 0}px`,
            color: settings.textColor || (settings.background === 'white' ? '#000000' : '#FFFFFF'),
          }}
        />
      </div>
    );
  }
);

OptimizedCounterPreview.displayName = "OptimizedCounterPreview";

export default OptimizedCounterPreview;