import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

interface CounterPreviewProps {
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
    customFont: string;
    transition: string;
    easing: string;
    prefix: string;
    suffix: string;
    separator: string;
    backgroundGradient?: string;
    customBackgroundColor?: string;
    textColor?: string;
    countDirection?: string;
    useFloatValues: boolean;
  };
  textSettings: {
    enabled: boolean;
    text: string;
    position: string;
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

const CounterPreview = forwardRef<HTMLCanvasElement, CounterPreviewProps>(
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
    const animationRef = useRef<number>();
    const lastValueRef = useRef<number>(settings.startValue);
    const transitionStartTimeRef = useRef<number>(0);
    const digitTransitionsRef = useRef<Map<number, { oldDigit: string; newDigit: string; startTime: number }>>(new Map());

    useImperativeHandle(ref, () => canvasRef.current!);

    const loadGoogleFont = (fontName: string) => {
      if (!fontName) return Promise.resolve();

      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${fontName
        .replace(/\s+/g, "+")
        .replace(/[^a-zA-Z0-9+]/g, "")}:wght@400;700&display=swap`;
      link.rel = "stylesheet";

      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link);
      }

      return new Promise<void>((resolve) => {
        setTimeout(resolve, 100);
      });
    };

    const getFontFamily = (fontKey: string, customFont: string) => {
      if (customFont) return `"${customFont}", sans-serif`;

      const fontMap = {
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

    const updateDigitTransitions = (newValue: number) => {
      const currentText = formatNumber(newValue);
      const previousText = formatNumber(lastValueRef.current);
      const currentTime = Date.now();
      
      // Clear old transitions that are complete
      const transitionsToRemove: number[] = [];
      digitTransitionsRef.current.forEach((transition, index) => {
        if (currentTime - transition.startTime > 500) { // 500ms transition duration
          transitionsToRemove.push(index);
        }
      });
      transitionsToRemove.forEach(index => digitTransitionsRef.current.delete(index));
      
      // Add new transitions for changed digits
      const maxLength = Math.max(currentText.length, previousText.length);
      for (let i = 0; i < maxLength; i++) {
        const currentDigit = currentText[i] || '';
        const previousDigit = previousText[i] || '';
        
        if (currentDigit !== previousDigit && !digitTransitionsRef.current.has(i)) {
          digitTransitionsRef.current.set(i, {
            oldDigit: previousDigit,
            newDigit: currentDigit,
            startTime: currentTime
          });
        }
      }
    };

    const applyDigitTransition = (
      ctx: CanvasRenderingContext2D,
      digit: string,
      x: number,
      y: number,
      fontSize: number,
      transitionProgress: number,
      transitionType: string
    ): { x: number; y: number; opacity: number } => {
      
      const effects = {
        none: () => ({ x, y, opacity: 1 }),
        
        fadeIn: () => {
          const easeInOutCubic = transitionProgress < 0.5
            ? 4 * transitionProgress * transitionProgress * transitionProgress
            : 1 - Math.pow(-2 * transitionProgress + 2, 3) / 2;
          return { x, y, opacity: easeInOutCubic };
        },
        
        'fade-roll': () => {
          const rollDistance = fontSize * 0.3;
          const rollY = y - (1 - transitionProgress) * rollDistance;
          const opacity = transitionProgress;
          
          ctx.save();
          ctx.translate(x, rollY);
          ctx.rotate((1 - transitionProgress) * Math.PI * 0.1);
          ctx.translate(-x, -rollY);
          
          return { x, y: rollY, opacity };
        },
        
        'flip-down': () => {
          const scaleY = Math.abs(Math.cos(transitionProgress * Math.PI));
          const opacity = scaleY > 0.1 ? 1 : 0;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(1, Math.max(0.1, scaleY));
          ctx.translate(-x, -y);
          
          return { x, y, opacity };
        },
        
        'slide-vertical': () => {
          const slideDistance = fontSize * 1.2;
          const slideY = y + (1 - transitionProgress) * slideDistance;
          return { x, y: slideY, opacity: transitionProgress };
        },
        
        bounce: () => {
          const bounceHeight = Math.sin(transitionProgress * Math.PI) * (fontSize * 0.3);
          const bounceY = y - bounceHeight;
          return { x, y: bounceY, opacity: 1 };
        },
        
        scale: () => {
          const scaleValue = 0.3 + transitionProgress * 0.7;
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scaleValue, scaleValue);
          ctx.translate(-x, -y);
          return { x, y, opacity: transitionProgress };
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
            return { x: x + glitchX, y: y + glitchY, opacity: 0.7 + Math.random() * 0.3 };
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

      const effect = effects[transitionType as keyof typeof effects] || effects.none;
      return effect();
    };

    const createGradient = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      fontSize: number,
      type: string
    ) => {
      let gradient;

      switch (type) {
        case "rainbow":
          gradient = ctx.createLinearGradient(
            x - fontSize,
            y - fontSize / 2,
            x + fontSize,
            y + fontSize / 2
          );
          gradient.addColorStop(0, "#FF0000");
          gradient.addColorStop(0.17, "#FF8800");
          gradient.addColorStop(0.33, "#FFFF00");
          gradient.addColorStop(0.5, "#00FF00");
          gradient.addColorStop(0.67, "#0088FF");
          gradient.addColorStop(0.83, "#8800FF");
          gradient.addColorStop(1, "#FF0088");
          break;
        case "fire":
          gradient = ctx.createLinearGradient(
            x,
            y - fontSize / 2,
            x,
            y + fontSize / 2
          );
          gradient.addColorStop(0, "#FF4444");
          gradient.addColorStop(0.5, "#FF8800");
          gradient.addColorStop(1, "#FFFF00");
          break;
        case "ocean":
          gradient = ctx.createLinearGradient(
            x,
            y - fontSize / 2,
            x,
            y + fontSize / 2
          );
          gradient.addColorStop(0, "#00AAFF");
          gradient.addColorStop(0.5, "#0066CC");
          gradient.addColorStop(1, "#003388");
          break;
        case "sunset":
          gradient = ctx.createLinearGradient(
            x,
            y - fontSize / 2,
            x,
            y + fontSize / 2
          );
          gradient.addColorStop(0, "#FF6B6B");
          gradient.addColorStop(0.5, "#FF8E53");
          gradient.addColorStop(1, "#FF6B9D");
          break;
        default:
          gradient = ctx.createLinearGradient(
            x - fontSize,
            y - fontSize / 2,
            x + fontSize,
            y + fontSize / 2
          );
          gradient.addColorStop(0, "#FF6B6B");
          gradient.addColorStop(0.25, "#4ECDC4");
          gradient.addColorStop(0.5, "#45B7D1");
          gradient.addColorStop(0.75, "#96CEB4");
          gradient.addColorStop(1, "#FFEAA7");
      }

      return gradient;
    };

    const applyDesignEffects = (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      fontSize: number
    ) => {
      const effects = {
        classic: () => {
          ctx.fillStyle =
            settings.background === "white" ? "#000000" : "#FFFFFF";
          ctx.fillText(text, x, y);
        },

        neon: () => {
          const neonColor = designSettings.neonColor || "#00FFFF";
          const intensity = designSettings.neonIntensity || 10;

          ctx.save();
          ctx.shadowBlur = 0;
          ctx.shadowColor = "rgba(0,0,0,0)";

          if (settings.background === "transparent") {
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(text, x, y);

            ctx.globalAlpha = 0.9;
            ctx.shadowColor = neonColor;
            ctx.shadowBlur = Math.max(5, intensity * 1.5);
            ctx.strokeStyle = neonColor;
            ctx.lineWidth = 2;
            ctx.strokeText(text, x, y);

            ctx.shadowBlur = Math.max(3, intensity * 0.8);
            ctx.fillStyle = neonColor;
            ctx.fillText(text, x, y);

            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(text, x, y);
          } else {
            ctx.shadowColor = neonColor;
            ctx.shadowBlur = intensity * 3;
            ctx.strokeStyle = neonColor;
            ctx.lineWidth = 2;
            ctx.strokeText(text, x, y);

            ctx.shadowBlur = intensity;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(text, x, y);
          }

          ctx.restore();
        },

        glow: () => {
          const glowColor =
            designSettings.glowColor ||
            (settings.background === "white" ? "#000000" : "#FFFFFF");
          const intensity = designSettings.glowIntensity || 15;

          ctx.save();

          if (settings.background === "transparent") {
            ctx.globalAlpha = 0.4;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = intensity * 2;
            ctx.fillStyle = glowColor;
            ctx.fillText(text, x, y);

            ctx.globalAlpha = 0.6;
            ctx.shadowBlur = intensity * 1.3;
            ctx.fillText(text, x, y);

            ctx.globalAlpha = 0.8;
            ctx.shadowBlur = intensity * 0.8;
            ctx.fillText(text, x, y);

            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = intensity * 0.4;
            ctx.fillText(text, x, y);

            ctx.shadowBlur = 0;
            ctx.fillText(text, x, y);
          } else {
            for (let i = 0; i < 3; i++) {
              ctx.shadowColor = glowColor;
              ctx.shadowBlur = intensity + i * 10;
              ctx.fillStyle = glowColor;
              ctx.fillText(text, x, y);
            }
          }

          ctx.restore();
        },

        gradient: () => {
          const gradientCSS =
            designSettings.gradientColors ||
            "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)";

          const gradient = ctx.createLinearGradient(
            x - fontSize,
            y - fontSize / 2,
            x + fontSize,
            y + fontSize / 2
          );

          const colorMatches = gradientCSS.match(/#[0-9A-Fa-f]{6}/g);
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

          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
        },

        fire: () => {
          const fireCSS =
            designSettings.fireColors ||
            "linear-gradient(45deg, #FF4444, #FF8800, #FFFF00)";
          const fireGlow = designSettings.fireGlow || 10;

          const gradient = ctx.createLinearGradient(
            x,
            y - fontSize / 2,
            x,
            y + fontSize / 2
          );

          const colorMatches = fireCSS.match(/#[0-9A-Fa-f]{6}/g);
          if (colorMatches && colorMatches.length > 0) {
            colorMatches.forEach((color, index) => {
              gradient.addColorStop(index / (colorMatches.length - 1), color);
            });
          } else {
            gradient.addColorStop(0, "#FF4444");
            gradient.addColorStop(0.5, "#FF8800");
            gradient.addColorStop(1, "#FFFF00");
          }

          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);

          ctx.shadowColor = "#FF4444";
          ctx.shadowBlur = fireGlow;
          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;
        },

        rainbow: () => {
          const rainbowCSS =
            designSettings.rainbowColors ||
            "linear-gradient(45deg, #FF0000, #FF8800, #FFFF00, #00FF00, #0088FF, #8800FF, #FF0088)";

          const gradient = ctx.createLinearGradient(
            x - fontSize,
            y - fontSize / 2,
            x + fontSize,
            y + fontSize / 2
          );

          const colorMatches = rainbowCSS.match(/#[0-9A-Fa-f]{6}/g);
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

          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
        },

        chrome: () => {
          const chromeCSS =
            designSettings.chromeColors ||
            "linear-gradient(45deg, #FFFFFF, #CCCCCC, #999999)";

          const gradient = ctx.createLinearGradient(
            x,
            y - fontSize / 2,
            x,
            y + fontSize / 2
          );

          const colorMatches = chromeCSS.match(/#[0-9A-Fa-f]{6}/g);
          if (colorMatches && colorMatches.length > 0) {
            colorMatches.forEach((color, index) => {
              gradient.addColorStop(index / (colorMatches.length - 1), color);
            });
          } else {
            gradient.addColorStop(0, "#FFFFFF");
            gradient.addColorStop(0.5, "#CCCCCC");
            gradient.addColorStop(1, "#999999");
          }

          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
        },
      };

      const effect = effects[settings.design] || effects.classic;
      effect();
    };

    const drawText = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      counterWidth: number,
      counterX: number,
      counterY: number
    ) => {
      if (!textSettings.enabled || !textSettings.text) return;

      const fontSize = textSettings.fontSize;
      const fontFamily = getFontFamily(textSettings.fontFamily, "");

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const x = canvas.width / 2 + textSettings.offsetX;
      const y = canvas.height / 2 + textSettings.offsetY;

      const previousAlpha = ctx.globalAlpha;
      ctx.globalAlpha = textSettings.opacity;

      if (settings.design !== "classic") {
        applyDesignEffects(ctx, textSettings.text, x, y, fontSize);
      } else {
        if (textSettings.color.startsWith("gradient-")) {
          const gradientType = textSettings.color.replace("gradient-", "");
          const gradient = createGradient(ctx, x, y, fontSize, gradientType);
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = textSettings.color;
        }
        ctx.fillText(textSettings.text, x, y);
      }

      ctx.globalAlpha = previousAlpha;
    };

    const drawMultiDigitCounter = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      value: number
    ) => {
      const counterText = formatNumber(value);
      const fontSize = settings.fontSize;
      const fontFamily = getFontFamily(settings.fontFamily, settings.customFont);
      const letterSpacing = settings.letterSpacing || 0;
      const fontWeight = settings.fontWeight || 400;

      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Calculate total width for centering
      let totalWidth = 0;
      for (let i = 0; i < counterText.length; i++) {
        const char = counterText[i];
        const charWidth = ctx.measureText(char).width;
        totalWidth += charWidth + (i < counterText.length - 1 ? letterSpacing : 0);
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let currentX = centerX - totalWidth / 2;

      // Check if we should use multi-digit transitions
      const isMultiDigitTransition = [
        'fade-roll', 'flip-down', 'slide-vertical', 'bounce', 'scale'
      ].includes(settings.transition);

      if (isMultiDigitTransition) {
        // Draw each digit with individual transitions
        for (let i = 0; i < counterText.length; i++) {
          const char = counterText[i];
          const charWidth = ctx.measureText(char).width;
          const digitX = currentX + charWidth / 2;
          
          // Check if this digit has a transition
          const transition = digitTransitionsRef.current.get(i);
          let digitProgress = 1; // Default to fully visible
          
          if (transition) {
            const elapsed = Date.now() - transition.startTime;
            digitProgress = Math.min(elapsed / 500, 1); // 500ms transition
            
            // Apply easing
            if (settings.easing && settings.easing in easingFunctions) {
              digitProgress = easingFunctions[settings.easing as keyof typeof easingFunctions](digitProgress);
            }
          }

          // Apply digit-specific transition
          ctx.save();
          const { x: tX, y: tY, opacity: tOpacity } = applyDigitTransition(
            ctx, char, digitX, centerY, fontSize, digitProgress, settings.transition
          );

          ctx.globalAlpha = tOpacity;
          applyDesignEffects(ctx, char, tX, tY, fontSize);
          ctx.restore();

          currentX += charWidth + letterSpacing;
        }
      } else {
        // Use traditional whole-counter transitions
        const totalRange = settings.endValue - settings.startValue;
        const rawProgress = totalRange !== 0 ? (value - settings.startValue) / totalRange : 1;
        const transitionProgress = Math.min(Math.max(rawProgress, 0), 1);

        ctx.save();
        const { x: tX, y: tY, opacity: tOpacity } = applyDigitTransition(
          ctx, counterText, centerX, centerY, fontSize, transitionProgress, settings.transition
        );

        ctx.globalAlpha = tOpacity;
        
        if (letterSpacing !== 0) {
          // Draw each character with spacing
          currentX = centerX - totalWidth / 2;
          for (let i = 0; i < counterText.length; i++) {
            const char = counterText[i];
            const charWidth = ctx.measureText(char).width;
            applyDesignEffects(ctx, char, currentX + charWidth / 2, tY, fontSize);
            currentX += charWidth + letterSpacing;
          }
        } else {
          applyDesignEffects(ctx, counterText, tX, tY, fontSize);
        }
        
        ctx.restore();
      }
    };

    const drawFrame = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", {
        alpha: settings.background === "transparent",
      });
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 600;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const extractColors = (gradientStr: string): string[] => {
        const matches = gradientStr.match(/#[0-9a-fA-F]{3,6}/g);
        return matches || ["#000000", "#ffffff"];
      };

      // Draw background
      if (settings.background === "transparent") {
        // Keep transparent
      } else if (
        settings.background === "gradient" &&
        settings.backgroundGradient
      ) {
        const grad = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const colors = extractColors(settings.backgroundGradient);
        const step = colors.length > 1 ? 1 / (colors.length - 1) : 1;
        colors.forEach((color, i) => grad.addColorStop(i * step, color));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (
        settings.background === "custom" &&
        settings.customBackgroundColor
      ) {
        ctx.fillStyle = settings.customBackgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = settings.background === "white" ? "#FFFFFF" : "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Set text color
      ctx.fillStyle =
        settings.textColor ||
        (settings.background === "white" ? "#000000" : "#FFFFFF");

      // Draw multi-digit counter
      drawMultiDigitCounter(ctx, canvas, currentValue);

      // Draw additional text if enabled
      if (textSettings.enabled) {
        drawText(
          ctx,
          canvas,
          ctx.measureText(formatNumber(currentValue)).width,
          canvas.width / 2,
          canvas.height / 2
        );
      }
    };

    // Track value changes for digit transitions
    useEffect(() => {
      if (currentValue !== lastValueRef.current) {
        updateDigitTransitions(currentValue);
        lastValueRef.current = currentValue;
        transitionStartTimeRef.current = Date.now();
      }
    }, [currentValue]);

    // Load fonts
    useEffect(() => {
      const loadFontForKey = async (key: string) => {
        if (!key || key === "custom" || key === "arial") return;
        const googleName = key.charAt(0).toUpperCase() + key.slice(1);
        await loadGoogleFont(googleName);
      };

      loadFontForKey(settings.fontFamily);
      loadFontForKey(textSettings.fontFamily);
    }, [settings.fontFamily, textSettings.fontFamily]);

    useEffect(() => {
      const animate = () => {
        drawFrame();
        if (isRecording) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          drawFrame();
        }
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [
      settings,
      textSettings,
      designSettings,
      currentValue,
      isRecording,
      formatNumber,
    ]);

    return (
      <div className="w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain rounded-lg"
          style={{
            background:
              settings.background === "gradient"
                ? settings.backgroundGradient || designSettings.gradientColors
                : settings.background === "custom"
                ? settings.customBackgroundColor || "#000000"
                : settings.background,
          }}
        />
      </div>
    );
  }
);

CounterPreview.displayName = "CounterPreview";

export default CounterPreview;