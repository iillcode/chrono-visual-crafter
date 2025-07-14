// Shared utilities for CounterPreview and transparentExport to ensure consistency

// Easing functions for transitions - same as CounterPreview.tsx
export const easingFunctions = {
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

// Font mapping - same as CounterPreview.tsx
export const getFontFamily = (fontKey: string, customFont?: string): string => {
  if (customFont) return `"${customFont}", sans-serif`;

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

// Number formatting utility - consistent with CounterPreview
export const formatNumber = (
  value: number,
  settings: {
    prefix?: string;
    suffix?: string;
    separator?: string;
    useFloatValues?: boolean;
  }
): string => {
  const hasDecimal = value % 1 !== 0;
  let formattedValue: string;

  if (settings.useFloatValues) {
    formattedValue = value.toFixed(2).replace(/\.?0+$/, "");
    if (formattedValue.indexOf(".") === -1 && hasDecimal) {
      formattedValue = value.toFixed(1);
    }
  } else {
    formattedValue = Math.round(value).toString();
  }

  // Apply separator
  if (settings.separator && settings.separator !== "none") {
    const separator =
      settings.separator === "comma"
        ? ","
        : settings.separator === "dot"
        ? "."
        : settings.separator === "space"
        ? " "
        : "";

    if (separator) {
      if (formattedValue.includes(".")) {
        const parts = formattedValue.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        formattedValue = parts.join(".");
      } else {
        formattedValue = formattedValue.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          separator
        );
      }
    }
  }

  return `${settings.prefix || ""}${formattedValue}${settings.suffix || ""}`;
};

// Design effects mapping - shared between components
export const designEffects = {
  classic: {
    apply: (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string = "#FFFFFF") => {
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    }
  },
  
  neon: {
    apply: (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, neonColor: string, intensity: number) => {
      ctx.save();
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = intensity;
      ctx.fillStyle = neonColor;
      ctx.fillText(text, x, y);
      
      ctx.shadowBlur = intensity * 2;
      ctx.fillText(text, x, y);
      
      ctx.shadowBlur = intensity * 3;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(text, x, y);
      ctx.restore();
    }
  },
  
  glow: {
    apply: (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, glowColor: string, intensity: number) => {
      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = intensity;
      ctx.fillStyle = glowColor;
      ctx.fillText(text, x, y);
      
      ctx.shadowBlur = intensity * 1.5;
      ctx.fillText(text, x, y);
      ctx.restore();
    }
  }
};