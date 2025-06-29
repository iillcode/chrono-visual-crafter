
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

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
  currentValue: number;
  isRecording: boolean;
}

const CounterPreview = forwardRef<HTMLCanvasElement, CounterPreviewProps>(
  ({ settings, currentValue, isRecording }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevValueRef = useRef<number>(0);
    const transitionStartTimeRef = useRef<number>(0);
    
    useImperativeHandle(ref, () => canvasRef.current!);

    const getBackgroundColor = () => {
      switch (settings.background) {
        case 'white': return '#FFFFFF';
        case 'black': return '#000000';
        case 'transparent': return 'transparent';
        default: return '#000000';
      }
    };

    const getTextColor = () => {
      return settings.background === 'white' ? '#000000' : '#FFFFFF';
    };

    const getFontFamily = () => {
      const fontMap: { [key: string]: string } = {
        'inter': 'Inter',
        'mono': 'Roboto Mono',
        'poppins': 'Poppins',
        'orbitron': 'Orbitron',
        'rajdhani': 'Rajdhani',
        'exo': 'Exo 2',
        'play': 'Play',
        'russo': 'Russo One',
        'audiowide': 'Audiowide',
        'michroma': 'Michroma',
      };
      return settings.customFont || fontMap[settings.fontFamily] || 'Orbitron';
    };

    const applyTransitionEffect = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, progress: number) => {
      const fontSize = settings.fontSize;
      const fontFamily = getFontFamily();
      
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Reset transformations and effects
      ctx.save();

      switch (settings.transition) {
        case 'slideUp':
          const slideY = y + (50 * (1 - progress));
          ctx.globalAlpha = progress;
          ctx.fillText(text, x, slideY);
          break;

        case 'slideDown':
          const slideDownY = y - (50 * (1 - progress));
          ctx.globalAlpha = progress;
          ctx.fillText(text, x, slideDownY);
          break;

        case 'slideLeft':
          const slideX = x + (100 * (1 - progress));
          ctx.globalAlpha = progress;
          ctx.fillText(text, slideX, y);
          break;

        case 'slideRight':
          const slideRightX = x - (100 * (1 - progress));
          ctx.globalAlpha = progress;
          ctx.fillText(text, slideRightX, y);
          break;

        case 'fadeIn':
          ctx.globalAlpha = progress;
          ctx.fillText(text, x, y);
          break;

        case 'scale':
          const scale = 0.5 + (0.5 * progress);
          ctx.translate(x, y);
          ctx.scale(scale, scale);
          ctx.globalAlpha = progress;
          ctx.fillText(text, 0, 0);
          break;

        case 'rotate':
          ctx.translate(x, y);
          ctx.rotate((1 - progress) * Math.PI * 2);
          ctx.globalAlpha = progress;
          ctx.fillText(text, 0, 0);
          break;

        case 'flip':
          ctx.translate(x, y);
          ctx.scale(1, progress > 0.5 ? 1 : -1);
          ctx.globalAlpha = progress > 0.5 ? 1 : 0.3;
          ctx.fillText(text, 0, 0);
          break;

        case 'bounce':
          const bounceY = y - Math.abs(Math.sin(progress * Math.PI)) * 30;
          ctx.fillText(text, x, bounceY);
          break;

        case 'elastic':
          const elasticScale = 1 + Math.sin(progress * Math.PI * 4) * 0.1 * (1 - progress);
          ctx.translate(x, y);
          ctx.scale(elasticScale, elasticScale);
          ctx.fillText(text, 0, 0);
          break;

        case 'typewriter':
          const visibleChars = Math.floor(text.length * progress);
          const visibleText = text.substring(0, visibleChars);
          ctx.fillText(visibleText, x, y);
          break;

        case 'wave':
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charX = x - (text.length * fontSize * 0.3) / 2 + i * fontSize * 0.6;
            const waveY = y + Math.sin((progress * Math.PI * 2) + (i * 0.5)) * 20;
            ctx.fillText(char, charX, waveY);
          }
          break;

        case 'spiral':
          const spiralAngle = progress * Math.PI * 4;
          const spiralRadius = 50 * (1 - progress);
          const spiralX = x + Math.cos(spiralAngle) * spiralRadius;
          const spiralY = y + Math.sin(spiralAngle) * spiralRadius;
          ctx.globalAlpha = progress;
          ctx.fillText(text, spiralX, spiralY);
          break;

        case 'zoom':
          const zoomScale = progress * 2;
          ctx.translate(x, y);
          ctx.scale(zoomScale, zoomScale);
          ctx.globalAlpha = Math.min(1, progress * 2);
          ctx.fillText(text, 0, 0);
          break;

        case 'glitch':
          for (let i = 0; i < 3; i++) {
            const offsetX = (Math.random() - 0.5) * 10 * (1 - progress);
            const offsetY = (Math.random() - 0.5) * 10 * (1 - progress);
            ctx.globalAlpha = 0.3 + progress * 0.7;
            ctx.fillText(text, x + offsetX, y + offsetY);
          }
          break;

        case 'matrix':
          const matrixY = y + (100 * (1 - progress));
          ctx.globalAlpha = progress;
          for (let i = 0; i < 5; i++) {
            ctx.globalAlpha = progress * (0.2 + i * 0.2);
            ctx.fillText(text, x, matrixY + i * 5);
          }
          break;

        case 'shake':
          const shakeX = x + (Math.random() - 0.5) * 20 * (1 - progress);
          const shakeY = y + (Math.random() - 0.5) * 20 * (1 - progress);
          ctx.fillText(text, shakeX, shakeY);
          break;

        case 'pulse':
          const pulseScale = 1 + Math.sin(progress * Math.PI * 6) * 0.2;
          ctx.translate(x, y);
          ctx.scale(pulseScale, pulseScale);
          ctx.fillText(text, 0, 0);
          break;

        case 'morphColor':
          const hue = progress * 360;
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
          ctx.fillText(text, x, y);
          break;

        case 'splitMerge':
          if (progress < 0.5) {
            const splitOffset = (0.5 - progress) * 100;
            ctx.fillText(text, x - splitOffset, y);
            ctx.fillText(text, x + splitOffset, y);
          } else {
            ctx.fillText(text, x, y);
          }
          break;

        case 'rollIn':
          ctx.translate(x, y);
          ctx.rotate((1 - progress) * Math.PI * 2);
          const rollX = (1 - progress) * -200;
          ctx.translate(rollX, 0);
          ctx.globalAlpha = progress;
          ctx.fillText(text, 0, 0);
          break;

        case 'flipCard':
          ctx.translate(x, y);
          if (progress < 0.5) {
            ctx.scale(1 - progress * 2, 1);
            ctx.globalAlpha = 1 - progress * 2;
            ctx.fillText(prevValueRef.current.toString(), 0, 0);
          } else {
            ctx.scale((progress - 0.5) * 2, 1);
            ctx.globalAlpha = (progress - 0.5) * 2;
            ctx.fillText(text, 0, 0);
          }
          break;

        case 'liquidFill':
          const clipHeight = y + fontSize/2 - (fontSize * progress);
          ctx.save();
          ctx.beginPath();
          ctx.rect(x - fontSize, clipHeight, fontSize * 2, fontSize * progress);
          ctx.clip();
          ctx.fillText(text, x, y);
          ctx.restore();
          
          ctx.globalAlpha = 0.3;
          ctx.fillText(text, x, y);
          break;

        default: // none
          ctx.fillText(text, x, y);
          break;
      }

      ctx.restore();
    };

    const applyDesignEffects = (ctx: CanvasRenderingContext2D) => {
      const textColor = getTextColor();
      
      switch (settings.design) {
        case 'neon':
          ctx.fillStyle = '#00FFFF';
          ctx.shadowColor = '#00FFFF';
          ctx.shadowBlur = 20;
          break;
        case 'glow':
          ctx.fillStyle = textColor;
          ctx.shadowColor = textColor;
          ctx.shadowBlur = 30;
          break;
        case 'gradient':
          const gradient = ctx.createLinearGradient(0, 0, 800, 600);
          gradient.addColorStop(0, '#FF6B6B');
          gradient.addColorStop(0.5, '#4ECDC4');
          gradient.addColorStop(1, '#45B7D1');
          ctx.fillStyle = gradient;
          break;
        case 'fire':
          const fireGradient = ctx.createLinearGradient(0, 0, 0, 600);
          fireGradient.addColorStop(0, '#FF4500');
          fireGradient.addColorStop(0.5, '#FF6347');
          fireGradient.addColorStop(1, '#FFD700');
          ctx.fillStyle = fireGradient;
          ctx.shadowColor = '#FF4500';
          ctx.shadowBlur = 15;
          break;
        default:
          ctx.fillStyle = textColor;
          break;
      }
    };

    useEffect(() => {
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
        ctx.fillStyle = getBackgroundColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Calculate transition progress
      const now = Date.now();
      if (Math.floor(currentValue) !== Math.floor(prevValueRef.current)) {
        transitionStartTimeRef.current = now;
        prevValueRef.current = Math.floor(prevValueRef.current);
      }
      
      const transitionDuration = 200; // ms
      const timeSinceTransition = now - transitionStartTimeRef.current;
      const transitionProgress = Math.min(1, timeSinceTransition / transitionDuration);

      // Apply design effects
      applyDesignEffects(ctx);

      // Draw counter with transition
      const displayValue = Math.floor(currentValue);
      const text = displayValue.toString();
      const x = canvas.width / 2;
      const y = canvas.height / 2;

      applyTransitionEffect(ctx, text, x, y, transitionProgress);

      prevValueRef.current = currentValue;
    }, [currentValue, settings]);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className={`border-2 border-gray-700 rounded-lg max-w-full max-h-full ${
            settings.background === 'transparent' ? 'bg-gray-900' : ''
          }`}
          style={{ 
            backgroundColor: settings.background === 'transparent' ? 'transparent' : getBackgroundColor()
          }}
        />
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>REC</span>
          </div>
        )}
      </div>
    );
  }
);

CounterPreview.displayName = 'CounterPreview';

export default CounterPreview;
