
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
  };
  currentValue: number;
  isRecording: boolean;
}

const CounterPreview = forwardRef<HTMLCanvasElement, CounterPreviewProps>(
  ({ settings, currentValue, isRecording }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
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

    const applyDesignEffects = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
      const fontSize = settings.fontSize;
      const fontFamily = getFontFamily();
      
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      switch (settings.design) {
        case 'neon':
          ctx.shadowColor = '#00FFFF';
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#00FFFF';
          ctx.strokeStyle = '#0088FF';
          ctx.lineWidth = 2;
          ctx.fillText(text, x, y);
          ctx.strokeText(text, x, y);
          break;

        case 'glow':
          ctx.shadowColor = getTextColor();
          ctx.shadowBlur = 30;
          ctx.fillStyle = getTextColor();
          ctx.fillText(text, x, y);
          ctx.shadowBlur = 50;
          ctx.fillText(text, x, y);
          break;

        case 'outline':
          ctx.fillStyle = getTextColor();
          ctx.strokeStyle = settings.background === 'white' ? '#FF0000' : '#00FFFF';
          ctx.lineWidth = 4;
          ctx.strokeText(text, x, y);
          ctx.fillText(text, x, y);
          break;

        case 'gradient':
          const gradient = ctx.createLinearGradient(x - fontSize, y - fontSize/2, x + fontSize, y + fontSize/2);
          gradient.addColorStop(0, '#FF6B6B');
          gradient.addColorStop(0.5, '#4ECDC4');
          gradient.addColorStop(1, '#45B7D1');
          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
          break;

        case 'shadow':
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillText(text, x + 5, y + 5);
          ctx.fillStyle = getTextColor();
          ctx.fillText(text, x, y);
          break;

        case 'retro':
          ctx.fillStyle = '#FF00FF';
          ctx.fillText(text, x - 2, y - 2);
          ctx.fillStyle = '#00FFFF';
          ctx.fillText(text, x + 2, y + 2);
          ctx.fillStyle = '#FFFF00';
          ctx.fillText(text, x, y);
          break;

        case 'fire':
          const fireGradient = ctx.createLinearGradient(x, y - fontSize/2, x, y + fontSize/2);
          fireGradient.addColorStop(0, '#FF4500');
          fireGradient.addColorStop(0.5, '#FF6347');
          fireGradient.addColorStop(1, '#FFD700');
          ctx.fillStyle = fireGradient;
          ctx.shadowColor = '#FF4500';
          ctx.shadowBlur = 15;
          ctx.fillText(text, x, y);
          break;

        case 'ice':
          const iceGradient = ctx.createLinearGradient(x, y - fontSize/2, x, y + fontSize/2);
          iceGradient.addColorStop(0, '#B0E0E6');
          iceGradient.addColorStop(0.5, '#87CEEB');
          iceGradient.addColorStop(1, '#4682B4');
          ctx.fillStyle = iceGradient;
          ctx.shadowColor = '#B0E0E6';
          ctx.shadowBlur = 10;
          ctx.fillText(text, x, y);
          break;

        case 'matrix':
          ctx.fillStyle = '#00FF00';
          ctx.shadowColor = '#00FF00';
          ctx.shadowBlur = 10;
          ctx.fillText(text, x, y);
          // Add matrix-like effect
          for (let i = 0; i < 5; i++) {
            ctx.fillStyle = `rgba(0, 255, 0, ${0.1 * (i + 1)})`;
            ctx.fillText(text, x, y + i * 2);
          }
          break;

        case 'hologram':
          ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
          ctx.fillText(text, x - 1, y);
          ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
          ctx.fillText(text, x + 1, y);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillText(text, x, y);
          break;

        case 'vintage':
          ctx.fillStyle = '#D2691E';
          ctx.fillText(text, x + 3, y + 3);
          ctx.fillStyle = '#F4A460';
          ctx.fillText(text, x, y);
          break;

        case 'cyber':
          ctx.strokeStyle = '#00FFFF';
          ctx.lineWidth = 3;
          ctx.strokeText(text, x, y);
          ctx.fillStyle = '#000000';
          ctx.fillText(text, x, y);
          ctx.fillStyle = '#00FFFF';
          ctx.font = `${fontSize * 0.8}px ${fontFamily}`;
          ctx.fillText(text, x, y);
          break;

        case 'pop':
          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
          const randomColor = colors[Math.floor(currentValue) % colors.length];
          ctx.fillStyle = randomColor;
          ctx.shadowColor = randomColor;
          ctx.shadowBlur = 20;
          ctx.fillText(text, x, y);
          break;

        case 'minimal':
          ctx.fillStyle = getTextColor();
          ctx.fillText(text, x, y);
          break;

        case 'bold':
          ctx.fillStyle = getTextColor();
          ctx.lineWidth = 2;
          ctx.strokeStyle = getTextColor();
          ctx.strokeText(text, x, y);
          ctx.fillText(text, x, y);
          break;

        default: // classic
          ctx.fillStyle = getTextColor();
          ctx.fillText(text, x, y);
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

      // Draw counter
      const displayValue = Math.floor(currentValue);
      const text = displayValue.toString();
      const x = canvas.width / 2;
      const y = canvas.height / 2;

      applyDesignEffects(ctx, text, x, y);

    }, [currentValue, settings]);

    return (
      <div className="relative">
        <canvas
          ref={canvasRef}
          className={`border-2 border-gray-700 rounded-lg ${
            settings.background === 'transparent' ? 'bg-gray-900' : ''
          }`}
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            backgroundColor: settings.background === 'transparent' ? 'transparent' : getBackgroundColor()
          }}
        />
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
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
