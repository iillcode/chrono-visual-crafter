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
    design: string;
    background: string;
    speed: number;
    customFont: string;
    transition: string;
    prefix: string;
    suffix: string;
    separator: string;
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

const CounterPreview = forwardRef<HTMLCanvasElement, CounterPreviewProps>(
  ({ settings, textSettings, designSettings, currentValue, isRecording, formatNumber }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const lastValueRef = useRef<number>(settings.startValue);
    const transitionStartTimeRef = useRef<number>(0);

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
      };

      return fontMap[fontKey] || '"Inter", sans-serif';
    };

    const applyTransitionEffect = (
      ctx: CanvasRenderingContext2D,
      progress: number,
      x: number,
      y: number
    ) => {
      const effects = {
        none: () => ({ x, y }),
        slideUp: () => {
          const offset = (1 - progress) * 50;
          ctx.globalAlpha = progress;
          return { x, y: y + offset };
        },
        slideDown: () => {
          const offset = (1 - progress) * -50;
          ctx.globalAlpha = progress;
          return { x, y: y + offset };
        },
        slideLeft: () => {
          const offset = (1 - progress) * 50;
          ctx.globalAlpha = progress;
          return { x: x + offset, y };
        },
        slideRight: () => {
          const offset = (1 - progress) * -50;
          ctx.globalAlpha = progress;
          return { x: x + offset, y };
        },
        fadeIn: () => {
          ctx.globalAlpha = progress;
          return { x, y };
        },
        scale: () => {
          const scale = 0.5 + progress * 0.5;
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);
          ctx.translate(-x, -y);
          return { x, y };
        },
        rotate: () => {
          const rotation = (1 - progress) * Math.PI * 2;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.translate(-x, -y);
          return { x, y };
        },
        bounce: () => {
          const bounceHeight = Math.sin(progress * Math.PI) * 30;
          return { x, y: y - bounceHeight };
        },
        elastic: () => {
          const elasticOffset =
            Math.sin(progress * Math.PI * 4) * (1 - progress) * 20;
          return { x, y: y + elasticOffset };
        },
        wave: () => {
          const waveOffset = Math.sin(progress * Math.PI * 2) * 10;
          return { x: x + waveOffset, y };
        },
        spiral: () => {
          const angle = progress * Math.PI * 4;
          const radius = (1 - progress) * 50;
          const spiralX = Math.cos(angle) * radius;
          const spiralY = Math.sin(angle) * radius;
          return { x: x + spiralX, y: y + spiralY };
        },
        zoom: () => {
          const scale = progress * 2;
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);
          ctx.translate(-x, -y);
          ctx.globalAlpha = Math.min(progress * 2, 1);
          return { x, y };
        },
        flip: () => {
          const flipProgress = Math.sin(progress * Math.PI);
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(1, flipProgress);
          ctx.translate(-x, -y);
          return { x, y };
        },
        typewriter: () => {
          // This effect is handled differently in the text rendering
          return { x, y };
        },
      };

      const effect = effects[settings.transition] || effects.none;
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
          // Use custom neon color and intensity from designSettings
          const neonColor = designSettings.neonColor || "#00FFFF";
          const intensity = designSettings.neonIntensity || 10;
          
          // Outer glow
          ctx.shadowColor = neonColor;
          ctx.shadowBlur = intensity * 3;
          ctx.strokeStyle = neonColor;
          ctx.lineWidth = 2;
          ctx.strokeText(text, x, y);

          // Inner fill
          ctx.shadowBlur = intensity;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(text, x, y);

          ctx.shadowBlur = 0;
        },

        glow: () => {
          const glowColor = designSettings.glowColor || (settings.background === "white" ? "#000000" : "#FFFFFF");
          const intensity = designSettings.glowIntensity || 15;

          // Multiple glow layers
          for (let i = 0; i < 3; i++) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = intensity + i * 10;
            ctx.fillStyle = glowColor;
            ctx.fillText(text, x, y);
          }

          ctx.shadowBlur = 0;
        },

        gradient: () => {
          // Use custom gradient colors from designSettings
          const gradientCSS = designSettings.gradientColors || "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)";
          
          // Parse CSS gradient to canvas gradient
          const gradient = ctx.createLinearGradient(
            x - fontSize,
            y - fontSize / 2,
            x + fontSize,
            y + fontSize / 2
          );
          
          // Extract colors from CSS gradient string
          const colorMatches = gradientCSS.match(/#[0-9A-Fa-f]{6}/g);
          if (colorMatches && colorMatches.length > 0) {
            colorMatches.forEach((color, index) => {
              gradient.addColorStop(index / (colorMatches.length - 1), color);
            });
          } else {
            // Fallback gradient
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
          // Use custom fire colors from designSettings
          const fireCSS = designSettings.fireColors || "linear-gradient(45deg, #FF4444, #FF8800, #FFFF00)";
          const fireGlow = designSettings.fireGlow || 10;
          
          const gradient = ctx.createLinearGradient(
            x,
            y - fontSize / 2,
            x,
            y + fontSize / 2
          );
          
          // Extract colors from CSS gradient string
          const colorMatches = fireCSS.match(/#[0-9A-Fa-f]{6}/g);
          if (colorMatches && colorMatches.length > 0) {
            colorMatches.forEach((color, index) => {
              gradient.addColorStop(index / (colorMatches.length - 1), color);
            });
          } else {
            // Fallback fire gradient
            gradient.addColorStop(0, "#FF4444");
            gradient.addColorStop(0.5, "#FF8800");
            gradient.addColorStop(1, "#FFFF00");
          }
          
          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);

          // Add fire glow effect
          ctx.shadowColor = "#FF4444";
          ctx.shadowBlur = fireGlow;
          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;
        },

        rainbow: () => {
          // Use custom rainbow colors from designSettings
          const rainbowCSS = designSettings.rainbowColors || "linear-gradient(45deg, #FF0000, #FF8800, #FFFF00, #00FF00, #0088FF, #8800FF, #FF0088)";
          
          const gradient = ctx.createLinearGradient(
            x - fontSize,
            y - fontSize / 2,
            x + fontSize,
            y + fontSize / 2
          );
          
          // Extract colors from CSS gradient string
          const colorMatches = rainbowCSS.match(/#[0-9A-Fa-f]{6}/g);
          if (colorMatches && colorMatches.length > 0) {
            colorMatches.forEach((color, index) => {
              gradient.addColorStop(index / (colorMatches.length - 1), color);
            });
          } else {
            // Fallback rainbow gradient
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
          // Use custom chrome colors from designSettings
          const chromeCSS = designSettings.chromeColors || "linear-gradient(45deg, #FFFFFF, #CCCCCC, #999999)";
          
          const gradient = ctx.createLinearGradient(
            x,
            y - fontSize / 2,
            x,
            y + fontSize / 2
          );
          
          // Extract colors from CSS gradient string
          const colorMatches = chromeCSS.match(/#[0-9A-Fa-f]{6}/g);
          if (colorMatches && colorMatches.length > 0) {
            colorMatches.forEach((color, index) => {
              gradient.addColorStop(index / (colorMatches.length - 1), color);
            });
          } else {
            // Fallback chrome gradient
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
      canvas: HTMLCanvasElement
    ) => {
      if (!textSettings.enabled || !textSettings.text) return;

      const fontSize = textSettings.fontSize;
      const fontFamily = getFontFamily(textSettings.fontFamily, "");

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let x = canvas.width / 2 + textSettings.offsetX;
      let y = canvas.height / 2 + textSettings.offsetY;

      // Position adjustments
      switch (textSettings.position) {
        case "top":
          y = fontSize + 20 + textSettings.offsetY;
          break;
        case "bottom":
          y = canvas.height - fontSize - 20 + textSettings.offsetY;
          break;
        case "left":
          x = fontSize + 20 + textSettings.offsetX;
          break;
        case "right":
          x = canvas.width - fontSize - 20 + textSettings.offsetX;
          break;
      }

      // Apply opacity
      const previousAlpha = ctx.globalAlpha;
      ctx.globalAlpha = textSettings.opacity;

      // Apply same design effects as counter for consistency
      if (settings.design !== "classic") {
        applyDesignEffects(ctx, textSettings.text, x, y, fontSize);
      } else {
        // Apply color (could be gradient)
        if (textSettings.color.startsWith("gradient-")) {
          const gradientType = textSettings.color.replace("gradient-", "");
          const gradient = createGradient(ctx, x, y, fontSize, gradientType);
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = textSettings.color;
        }
        ctx.fillText(textSettings.text, x, y);
      }

      // Restore alpha
      ctx.globalAlpha = previousAlpha;
    };

    const drawFrame = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Clear canvas
      if (settings.background === "transparent") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = settings.background === "white" ? "#FFFFFF" : "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Load custom font if specified
      if (settings.customFont) {
        await loadGoogleFont(settings.customFont);
      }

      // Calculate transition progress
      let transitionProgress = 1;
      if (Math.floor(currentValue) !== Math.floor(lastValueRef.current)) {
        transitionStartTimeRef.current = Date.now();
        lastValueRef.current = Math.floor(currentValue);
      }

      if (settings.transition !== "none") {
        const timeSinceTransition = Date.now() - transitionStartTimeRef.current;
        const transitionDuration = 300; // 300ms transition
        transitionProgress = Math.min(
          timeSinceTransition / transitionDuration,
          1
        );
      }

      // Draw counter
      const fontSize = settings.fontSize;
      const fontFamily = getFontFamily(
        settings.fontFamily,
        settings.customFont
      );

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const counterText = formatNumber(currentValue);
      let x = canvas.width / 2;
      let y = canvas.height / 2;

      // Adjust counter position if text is enabled to prevent overlap
      if (textSettings.enabled && textSettings.text) {
        switch (textSettings.position) {
          case "right":
            x = canvas.width / 2 - 100; // Move counter left
            break;
          case "left":
            x = canvas.width / 2 + 100; // Move counter right
            break;
          case "bottom":
            y = canvas.height / 2 - 60; // Move counter up
            break;
          case "top":
            y = canvas.height / 2 + 60; // Move counter down
            break;
        }
      }

      // Apply transition effects
      ctx.save();

      if (settings.transition !== "none") {
        const newPos = applyTransitionEffect(ctx, transitionProgress, x, y);
        x = newPos.x;
        y = newPos.y;
      }

      // Apply design effects to counter with formatted text
      applyDesignEffects(ctx, counterText, x, y, fontSize);

      ctx.restore();

      // Draw additional text if enabled
      drawText(ctx, canvas);
    };

    useEffect(() => {
      const animate = () => {
        drawFrame();
        if (isRecording) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Draw frame once when not recording
          drawFrame();
        }
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [settings, textSettings, designSettings, currentValue, isRecording, formatNumber]);

    return (
      <div className="w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain rounded-lg"
          style={{
            backgroundColor:
              settings.background === "transparent"
                ? "transparent"
                : settings.background,
          }}
        />
      </div>
    );
  }
);

CounterPreview.displayName = "CounterPreview";

export default CounterPreview;