import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

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
  currentValue: number;
  isRecording: boolean;
}

const CounterPreview = forwardRef<HTMLCanvasElement, CounterPreviewProps>(
  ({ settings, textSettings, currentValue, isRecording }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useImperativeHandle(ref, () => canvasRef.current!);

    const loadGoogleFont = (fontName: string) => {
      if (!fontName) return Promise.resolve();
      
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
      link.rel = 'stylesheet';
      
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

    const applyDesignEffects = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number) => {
      const effects = {
        classic: () => {
          ctx.fillStyle = settings.background === 'white' ? '#000000' : '#FFFFFF';
          ctx.fillText(text, x, y);
        },
        
        neon: () => {
          ctx.shadowColor = '#00FFFF';
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#00FFFF';
          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;
        },
        
        glow: () => {
          ctx.shadowColor = settings.background === 'white' ? '#000000' : '#FFFFFF';
          ctx.shadowBlur = 15;
          ctx.fillStyle = settings.background === 'white' ? '#000000' : '#FFFFFF';
          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;
        },

        gradient: () => {
          const gradient = ctx.createLinearGradient(x - fontSize, y - fontSize/2, x + fontSize, y + fontSize/2);
          gradient.addColorStop(0, '#FF6B6B');
          gradient.addColorStop(0.25, '#4ECDC4');
          gradient.addColorStop(0.5, '#45B7D1');
          gradient.addColorStop(0.75, '#96CEB4');
          gradient.addColorStop(1, '#FFEAA7');
          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
        },

        fire: () => {
          const gradient = ctx.createLinearGradient(x, y - fontSize/2, x, y + fontSize/2);
          gradient.addColorStop(0, '#FF4444');
          gradient.addColorStop(0.5, '#FF8800');
          gradient.addColorStop(1, '#FFFF00');
          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
          
          ctx.shadowColor = '#FF4444';
          ctx.shadowBlur = 10;
          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;
        }
      };

      const effect = effects[settings.design] || effects.classic;
      effect();
    };

    const drawText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      if (!textSettings.enabled || !textSettings.text) return;

      const fontSize = textSettings.fontSize;
      const fontFamily = getFontFamily(textSettings.fontFamily, '');
      
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let x = canvas.width / 2 + textSettings.offsetX;
      let y = canvas.height / 2 + textSettings.offsetY;
      
      // Position adjustments
      switch (textSettings.position) {
        case 'top':
          y = fontSize + 20 + textSettings.offsetY;
          break;
        case 'bottom':
          y = canvas.height - fontSize - 20 + textSettings.offsetY;
          break;
        case 'left':
          x = fontSize + 20 + textSettings.offsetX;
          break;
        case 'right':
          x = canvas.width - fontSize - 20 + textSettings.offsetX;
          break;
      }
      
      // Apply opacity
      const previousAlpha = ctx.globalAlpha;
      ctx.globalAlpha = textSettings.opacity;
      
      // Apply color
      ctx.fillStyle = textSettings.color;
      ctx.fillText(textSettings.text, x, y);
      
      // Restore alpha
      ctx.globalAlpha = previousAlpha;
    };

    const drawFrame = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Clear canvas
      if (settings.background === 'transparent') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = settings.background === 'white' ? '#FFFFFF' : '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Load custom font if specified
      if (settings.customFont) {
        await loadGoogleFont(settings.customFont);
      }

      // Draw counter
      const fontSize = settings.fontSize;
      const fontFamily = getFontFamily(settings.fontFamily, settings.customFont);
      
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const counterText = Math.floor(currentValue).toString();
      const x = canvas.width / 2;
      const y = canvas.height / 2;

      // Apply transition effects
      ctx.save();
      
      // Apply design effects to counter
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
        }
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [settings, textSettings, currentValue, isRecording]);

    return (
      <div className="w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain rounded-lg"
          style={{ backgroundColor: settings.background === 'transparent' ? 'transparent' : settings.background }}
        />
      </div>
    );
  }
);

CounterPreview.displayName = 'CounterPreview';

export default CounterPreview;
